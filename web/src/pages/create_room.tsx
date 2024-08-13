import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { createRoom } from '../http/create_room';
import myLogo from '../assets/my-logo.png';
import { Suspense, useState } from 'react';
import { Rooms } from '../components/rooms';

export function CreateRoom() {

    const [ seed, setSeed ] = useState(1);

    async function handleCreateRoom(data: FormData) {
        const theme = data.get('theme')?.toString();

        if (!theme) {
            return;
        }

        try{
            const { roomId } = await createRoom({ theme });
            if (!roomId) {
                throw new Error();
            }
            toast.success('Room created successfully!');
            setSeed(Math.random());
        }
        catch(error){
            toast.error('An error occurred while creating the room. Please try again later.');
        }
    }

  return (
    <div className='mx-auto max-w-[640px] flex flex-col gap-6 py-10 px-4'>
        <div className='max-w-[450px] flex flex-col self-center gap-6'>
            <img src={myLogo} alt="A logo in a 3D shaped question mark" className='w-10 self-center' />
            <p className='leading-relaxed text-orange-300 text-center' >
                Create here a room to ask questions and get answers from your audience
            </p>
            <form 
                action={handleCreateRoom}
                className='flex items-center gap-2 bg-blue-900 p-2 rounded-xl border border-b-blue-800 ring-orange-400 ring-offset-2 ring-offset-blue-950 focus-within:ring-1'
            >
                <input 
                    type="text" 
                    name='theme' 
                    placeholder='Room name' 
                    autoComplete='off' 
                    className='flex-1 text-sm bg-transparent mx-2 text-purple-300 outline-none placeholder:text-zinc-400' 
                />
                <button type='submit' className='bg-orange-400 text-orange-900 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm hover:bg-orange-500'>
                    Create Room
                    <ArrowRight className='size-4' />
                </button>
            </form>
        </div>
        <div className='h-px w-full bg-orange-200' />
            <Suspense fallback={<p>Loading Rooms...</p>}>
                <Rooms key={seed}/>
            </Suspense>
    </div>
  )
}