import { toast } from "sonner";

interface GetRoomMessagesRequest{
    roomId: string;
}

export async function getRoomMessages({ roomId }: GetRoomMessagesRequest){
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/rooms/${roomId}/messages`)

    if (response.status === 404) {
        return { messages: [] }
    }

    if (!response.ok) {
        toast.error('An error occurred while fetching the room messages. Please try again later.')
        return { messages: [] }
    }
        
    const data: Array<{ 
        ID: string
        RoomID: string
        Message: string
        ReactionCount: number
        Answered: boolean
    }> = await response.json()

    console.log(data);

    return { 
        messages: data.map(m => {
            return {
                id: m.ID,
                roomId: m.RoomID,
                message: m.Message,
                votes: m.ReactionCount,
                answered: m.Answered
            }
        })
     }
}