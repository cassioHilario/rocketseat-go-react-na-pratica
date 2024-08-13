interface GetRoomsResponse {
    rooms: {
        id: string;
        name: string;
    }[];
}

export async function getRooms(): Promise<GetRoomsResponse> {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/rooms`);

    if (!response.ok) {
        throw new Error('An error occurred while fetching the rooms. Please try again later.');
    }

    console.log(response);

    const data: Array<{
        ID: string;
        Theme: string;
    }> = await response.json();

    return {
        rooms: data.map((r) => {
            return {
                id: r.ID,
                name: r.Theme,
            };
        }),
    };
}