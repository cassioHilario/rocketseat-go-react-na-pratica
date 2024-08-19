export function LoginForm() {
    return (
        <>
            <form action="" className="text-yellow-600 gap-6 flex flex-col">
                <div className="flex gap-6 items-center">
                    <label htmlFor="username">Username: </label>
                    <input 
                        className="ml-auto border-2 border-blue-900 focus:border-blue-800 bg-blue-200 placeholder:text-fuchsia-900 rounded-lg"
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        autoComplete="off"
                    />
                 </div>
                 <div className="flex items-center gap-6">
                    <label htmlFor="password">Password: </label>
                    <input 
                        className="ml-auto border-2 border-blue-900 focus:border-blue-800 bg-blue-200 placeholder:text-fuchsia-900 rounded-lg"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        autoComplete="off"
                    />
                </div>
                <div className="flex gap-3 items-center">
                    <span className="text-xs font-semibold underline hover:text-amber-600"><a href="">I forgot my password</a></span>
                    <button type="submit" 
                        className="ml-auto border-2 border-blue-950 active:border[#F27E16] text-blue-900 active:text-[#1B365C] bg-yellow-400 active:bg-[#F2CF67] hover:bg-yellow-500 font-semibold px-4 py-1 rounded-md">
                        Login
                    </button>
                </div>
                <div>
                    <span>Don't have an account yet? </span>
                    <a href="" className="text-yellow-500 hover:text-amber-300 font-semibold" >Sign up</a>
                </div>
            </form>
        </>
    );
}