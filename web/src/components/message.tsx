import { ArrowUp } from "lucide-react";
import { useState } from "react";

interface MessageProps {
    message: string;
    votes: number;
    answered?: boolean;
}

export function Message({ message, votes, answered = false }: MessageProps) {

    const [hasVoted, setHasVoted] = useState(false);

    function handleVote() {
        setHasVoted(!hasVoted);
        
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