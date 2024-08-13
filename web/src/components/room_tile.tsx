interface RoomTileProps {
    id: string
    roomName: string
}

export function RoomTile({
    id,
    roomName
}: RoomTileProps) {

    console.log(id)
    console.log(roomName)

    return (
        <li className="ml-4 leading-relaxed text-zinc-100">
            <a href={`/room/${id}`} className="text-lg font-semibold text-zinc-100 hover:text-zinc-200">{roomName}</a>
        </li>
    )
}