import { toast } from "sonner";

interface GetRoomMessagesRequest{
    roomId: string;
}

export interface GetRoomMessagesResponse{
    messages: {
        id: string;
        roomId: string;
        message: string;
        votes: number;
        answered: boolean;
    }[]
}

export async function getRoomMessages({ roomId }: GetRoomMessagesRequest): Promise<GetRoomMessagesResponse> {
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