import { useParams } from "react-router-dom"
import { ArrowRight, Share2 } from "lucide-react"
import { toast } from "sonner"

import myLogo from '../assets/my-logo.png'
import { Message } from "../components/message"

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

      <form 
        className="flex items-center gap-2 bg-blue-900 p-2 rounded-xl border border-purple-800 ring-orange-400 ring-offset-2 ring-offset-blue-950 focus-within:ring-1"
      >
        <input 
          type="text" 
          name="theme"
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

      <ol className="list-decimal list-outside px-3 space-y-8">
        <Message message="Proident quis eu magna id et incididunt nostrud." votes={112}/>
        <Message message="Cillum eiusmod veniam ad cupidatat." votes={98}/>
        <Message message="Aute voluptate aliquip incididunt cupidatat. Excepteur anim cupidatat incididunt laborum esse culpa magna magna qui in aute. Duis adipisicing in est enim incididunt. Irure mollit exercitation nulla laboris veniam enim adipisicing. Ipsum enim dolore in elit nulla proident quis. Enim ut ea aliqua occaecat reprehenderit est do ad do. Deserunt nostrud deserunt labore dolore aute." votes={85} answered/>
        <Message message="Aliquip laborum ex et." votes={74}/>

      </ol>
    </div>
  )
}