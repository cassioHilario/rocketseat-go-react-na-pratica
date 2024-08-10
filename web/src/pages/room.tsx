import { Share2 } from "lucide-react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

import { Suspense } from "react"
import myLogo from '../assets/my-logo.png'
import { CreateMessageForm } from "../components/create_message_form"
import { Messages } from "../components/messages"

export function Room() {
  const { roomId } = useParams()

  function handleShareRoom() {
    const url = window.location.href.toString()

    if (navigator.share !== undefined && navigator.canShare()) {
      navigator.share({ url })
    } else {
      navigator.clipboard.writeText(url)

      toast.info('The room URL was copied to your clipboard!')
    }
  }

  return (
    <div className="mx-auto max-w-[640px] flex flex-col gap-6 py-10 px-4">
      <div className="flex items-center gap-3 px-3">
        <img src={myLogo} alt="AMA" className="h-5" />

        <span className="text-sm text-orange-400 truncate">
          Room Code: <span className="text-orange-300">{roomId}</span>
        </span>

        <button 
          type="submit" 
          onClick={handleShareRoom}
          className="ml-auto bg-orange-700 text-orange-300 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-orange-700"
        >
          Share
          <Share2 className="size-4" />
        </button>
      </div>

      <div className="h-px w-full bg-orange-200" />

      <CreateMessageForm />
      
      <Suspense fallback={<p>Loading Questions...</p>}>
        <Messages />
      </Suspense>
      
    </div>
  )
}