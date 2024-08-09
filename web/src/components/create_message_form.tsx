import { ArrowRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { createMessage } from "../http/create_message";

export function CreateMessageForm() {

    const { roomId } = useParams()

    if (!roomId) {
        throw new Error("CreateMessageForm component must be used within a Room page");
    }

    async function createMessageAction(data: FormData) {
      const message = data.get('question')?.toString()
      
      if (!message || message.trim() === '' || !roomId) {
          return
      }

      try {
          await createMessage({ roomId, message })
          toast.success('Message created successfully!')
      } catch (error) {
          toast.error('An error occurred while creating the question. Please try again later.')
      }
    }

    return (
        <form 
        action={createMessageAction}
        className="flex items-center gap-2 bg-blue-900 p-2 rounded-xl border border-purple-800 ring-orange-400 ring-offset-2 ring-offset-blue-950 focus-within:ring-1"
      >
        <input 
          type="text" 
          name="question"
          placeholder="Ask anything"
          autoComplete="off"
          className="flex-1 text-sm bg-transparent mx-2 outline-none text-orange-100 placeholder:text-orange-500"
        />

        <button 
          type="submit" 
          className="bg-orange-400 text-orange-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-orange-500"
        >
          Ask
          <ArrowRight className="size-4" />
        </button>
      </form>
    )
}