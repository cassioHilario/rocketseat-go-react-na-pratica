import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { createMessageReaction } from "../http/message_reaction";
import { toast } from "sonner";
import { deleteMessageReaction } from "../http/message_reaction";

interface MessageProps {
  id: string
  message: string
  votes: number
  answered?: boolean
}

export function Message({ 
  id: messageId, 
  message, 
  votes, 
  answered = false,
}: MessageProps) {
  const { roomId } = useParams()
  const [hasReacted, setHasReacted] = useState(false)

  if (!roomId) {
    throw new Error('Messages components must be used within room page')
  }

  async function createMessageReactionAction() {
    if (!roomId) {
      return
    }

    try {
      await createMessageReaction({ messageId, roomId })
    } catch {
      toast.error('Falha ao reagir mensagem, tente novamente!')
    }

    setHasReacted(true)
  }

  async function removeMessageReactionAction() {
    if (!roomId) {
      return
    }

    try {
      await deleteMessageReaction({ messageId, roomId })
    } catch {
      toast.error('Falha ao remover reação, tente novamente!')
    }

    setHasReacted(false)
  }

  return (
    <li data-answered={answered} className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none">
      {message}

      {hasReacted ? (
        <button 
          type="button" 
          onClick={removeMessageReactionAction} 
          className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-500"
        >
          <ArrowUp className="size-4" />
          Curtir pergunta ({votes})
        </button>
      ) : (
        <button 
          type="button" 
          onClick={createMessageReactionAction} 
          className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300"
        >
          <ArrowUp className="size-4" />
          Curtir pergunta ({votes})
        </button>
      )}
    </li>
  )
}