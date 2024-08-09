import { useParams } from "react-router-dom";
import { Message } from "./message";
import { getRoomMessages } from "../http/get_room_messages";
import { useSuspenseQuery } from "@tanstack/react-query";

export function Messages() {

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

    console.log(data);
    console.log(data.messages);

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