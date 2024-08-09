import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { createMessageReaction, deleteMessageReaction } from "../http/message_reaction";
import { toast } from "sonner";

interface MessageProps {
    id: string;
    message: string;
    votes: number;
    answered?: boolean;
}

export function Message({ id, message, votes, answered = false }: MessageProps) {

    console.log(id);
    console.log(message);
    console.log(votes);
    console.log(answered);

    const { roomId } = useParams();

    if (!roomId) {
        throw new Error("Messages component must be used within a Room page");
    }

    const [hasVoted, setHasVoted] = useState(false);

    async function handleVote() {
        if (!roomId)
            return;

        console.log(hasVoted);

        setHasVoted(!hasVoted);

        if (!hasVoted)
        {
            try {
                await createMessageReaction({ roomId, messageId: id })
            } catch{
                toast.error('An error occurred while voting. Please try again later.')
            }
        } else {
            try {
                await deleteMessageReaction({ roomId, messageId: id })
            } catch{
                toast.error('An error occurred while voting. Please try again later.')
            }
        }

    }

    return (
        <>
            <li data-answered={answered} className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none">
                {message}

                {hasVoted ? (
                    <button 
                    type="button" 
                    onClick={handleVote}
                    className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-300"
                    >
                        <ArrowUp className="size-4" />
                        Upvote ({votes})
                    </button>
                ) : (
                    <button 
                    type="button" 
                    onClick={handleVote}
                    className="mt-3 flex items-center gap-2 text-zinc-300 text-sm font-medium hover:text-zinc-200"
                    >
                        <ArrowUp className="size-4" />
                        Upvote ({votes})
                    </button>
                )
                
                }
            </li>
        </>
    )
}