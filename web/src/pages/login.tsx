import myLogo from '/question-mark.png';
import { LoginForm } from '../components/login_form';

export function Login() {
    return (
        <header className='mx-auto max-w-[640px] flex flex-col items-center gap-16 py-10 px-4'>
            <div className="flex items-center gap-3 px-3">
                <img src={myLogo} alt="A logo in a 3D shaped question mark" className='w-10'/>
                <span className="text-2xl font-semibold subpixel-antialiased text-orange-400 truncate">
                    Login
                </span>
            </div>
            <div>
                <LoginForm />
            </div>
        </header>
    );
}