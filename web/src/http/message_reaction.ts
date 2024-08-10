interface MessageReactionRequest{
    roomId: string
    messageId: string
}

export async function createMessageReaction({ roomId, messageId }: MessageReactionRequest){
    await fetch(`${import.meta.env.VITE_APP_API_URL}/rooms/${roomId}/messages/${messageId}/react`, { method: 'PATCH' })
}

export async function deleteMessageReaction({ roomId, messageId }: MessageReactionRequest){
    await fetch(`${import.meta.env.VITE_APP_API_URL}/rooms/${roomId}/messages/${messageId}/react`, { method: 'DELETE' })
}