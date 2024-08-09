import { useParams } from "react-router-dom";
import { Message } from "./message";
import { getRoomMessages, GetRoomMessagesResponse } from "../http/get_room_messages";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function Messages() {

    const queryClient = useQueryClient();

    const { roomId } = useParams();

    if (!roomId) {
        throw new Error("Messages component must be used within a Room page");
    }

    const { data } = useSuspenseQuery({
        queryKey: ['messages', { roomId }],
        queryFn: () => getRoomMessages({ roomId})
    })

    if (data.messages.length === 0) {
        return <p className="text-center text-orange-300">No questios in this room yet</p>
    }

    useEffect( () => {
        const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`);
        ws.onopen = () => {
            console.log('Websocket connected');
        }

        ws.onclose = () => {
            console.log('Websocket disconnected');
        }

        ws.onmessage = (event) => {
            const data:
            {
                kind: 'message_created' | 'message_answered' | 'reaction_added' | 'reaction_removed',
                value: any
            } = JSON.parse(event.data);

            console.log(data);

            switch (data.kind) {
                case 'message_created':
                    queryClient.setQueryData<GetRoomMessagesResponse>(['messages', { roomId }], state => {
                        return {
                            messages: [...(state?.messages ?? []) , 
                                {
                                    id: data.value.id,
                                    message: data.value.message,
                                    votes: data.value.count,
                                    answered: data.value.answered,
                                    roomId: data.value.roomId
                                }
                            ]
                        }
                    })
                    break;
                case 'message_answered':
                    queryClient.setQueryData<GetRoomMessagesResponse>(['messages', { roomId }], state => {
                        if (!state) {
                            return undefined;
                        }
                        return {
                            messages: state.messages.map(message => {
                                if (message.id === data.value.id) {
                                    return {
                                        ...message,
                                        answered: true
                                    }
                                }
                                return message;
                            })
                        }
                    })
                    break;
                case 'reaction_added':
                case 'reaction_removed':
                    queryClient.setQueryData<GetRoomMessagesResponse>(['messages', { roomId }], state => {
                        if (!state) {
                            return undefined;
                        }
                        return {
                            messages: state.messages.map(message => {
                                if (message.id === data.value.id) {
                                    return {
                                        ...message,
                                        votes: data.value.count
                                    }
                                }
                                return message;
                            })
                        }
                    })
                    break;
            }



        }

    }, [roomId, queryClient])

    return(
        <>
            <ol className="list-decimal list-outside px-3 space-y-8">
                {data.messages.map((message) => {
                    return (
                        <Message 
                            key={message.id}
                            id={message.id}
                            message={message.message}
                            votes={message.votes}
                            answered={message.answered}
                        />
                    )
                })}

            </ol>
        </>
    )
}