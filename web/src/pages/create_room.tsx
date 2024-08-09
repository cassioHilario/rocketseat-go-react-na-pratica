import { ArrowRight } from 'lucide-react';

import myLogo from '../assets/my-logo.png';
import { useNavigate } from 'react-router-dom';

export function CreateRoom() {

    const navigate = useNavigate();

    function handleCreateRoom(data: FormData) {
        const theme = data.get('theme')?.toString();

        console.log(theme);

        navigate('/room/{theme}');
    }

  return (
    <main className='h-screen flex items-center justify-center px-4'>
        <div className='max-w-[450px] flex flex-col gap-6'>
            <img src={myLogo} alt="A logo in a 3D shaped question mark" className='w-10 self-center' />
            <p className='leading-relaxed text-orange-300 text-center' >
                Incididunt elit culpa culpa cupidatat fugiat reprehenderit et ad qui consectetur dolore ut.
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
    </main>
  )
}