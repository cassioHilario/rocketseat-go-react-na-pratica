import { useSuspenseQuery } from "@tanstack/react-query";
import { RoomTile } from "./room_tile";
import { getRooms } from "../http/get_rooms";

export function Rooms(){

    const { data } = useSuspenseQuery({
        queryKey: ['rooms'],
        queryFn: () => getRooms()
    })

    if (data.rooms.length === 0) {
        return <p className="text-center text-orange-300">No rooms available</p>
    }

    return(
        <ol className="list-decimal list-outside px-3 space-y-8">
            {data.rooms.map((room) => {
                return (
                    <RoomTile 
                        key={room.id}
                        id={room.id}
                        roomName={room.name}
                    />
                )}
            )}
        </ol>
    )
}