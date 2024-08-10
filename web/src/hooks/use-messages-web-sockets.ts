import { useEffect } from "react";
import { GetRoomMessagesResponse } from "../http/get_room_messages";
import { useQueryClient } from "@tanstack/react-query";

interface UseMessagesWebSocketsProps {
    roomId: string
}

type WebhookMessage = 
        | { kind: 'message_created', value: { id: string, message: string, reaction_count: number, answered: boolean, roomId: string } }
        | { kind: 'message_answered', value: { id: string, message: string, reaction_count: number, answered: boolean, roomId: string } }
        | { kind: 'reaction_added', value: { id: string, messageId: string, reaction_count: number, userId: string } }
        | { kind: 'reaction_removed', value: { id: string, messageId: string, reaction_count: number, userId: string } }

export function useMessagesWebSockets({
    roomId
}: UseMessagesWebSocketsProps)
{

    const queryClient = useQueryClient();

    useEffect( () => {
        const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`);
        ws.onopen = () => {
            console.log('Websocket connected');
        }

        ws.onclose = () => {
            console.log('Websocket disconnected');
        }

        ws.onmessage = (event) => {
            const data: WebhookMessage = JSON.parse(event.data);

            console.log(data);

            switch (data.kind) {
                case 'message_created':
                    queryClient.setQueryData<GetRoomMessagesResponse>(['messages', { roomId }], state => {
                        return {
                            messages: [...(state?.messages ?? []) , 
                                {
                                    id: data.value.id,
                                    message: data.value.message,
                                    votes: data.value.reaction_count,
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
                                        votes: data.value.reaction_count
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
}