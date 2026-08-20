import { UserRound } from "lucide-react"


export default function HomePage() {

    return(
        <div className="flex flex-col items-center max-w-130 w-full">
            <nav className='flex items-center justify-between w-full max-w-130 max-full py-3 border-b border-b-zinc-50/15'>
                <div className='flex items-center justify-center rounded-full p-2 cursor-pointer hover:bg-zinc-50 hover:text-zinc-950 '>
                    <UserRound size={15} />
                </div>
                <div className='w-6 h-6 bg-white rounded-full'>u</div>
            </nav>


            <div className="mt-10 px-3.5 py-2 font-extrabold text-6xl  border border-zinc-50/12 hover:bg-zinc-50 hover:text-zinc-950 transition-colors duration-300 ">
                My To-do List
            </div>

            <form className=" flex items-stretch w-full mt-10 gap-2 ">
                <input type="text" name="todo" placeholder="what your to do" className="w-full bg-transparent border border-white/12 px-5 py-2
                 hover:border-zinc-100/40 hover:bg-amber-50/4 focus:border-zinc-100/40 hover:text-white/88 outline-none transition-colors duration-300 " />

                <button type="submit" className="bg-zinc-900/75 hover:scale-105 border border-zinc-50/8 whitespace-nowrap hover:bg-zinc-100
                 hover:text-zinc-950 px-3 w-auto cursor-pointer transition-all duration-300">Next</button>

                {/* Pop-up from next */}
                <div className="absolute top-1/2 left-1/2 ">

                </div>


            </form>


            <div className="mt-2.5 flex items-center justify-between w-full ">
                <div className="bg-zinc-950 text-zinc-50/85 border border-zinc-50/12 px-3 py-2">
                    Total Characters: 0
                </div>

                <div className="bg-zinc-950 text-zinc-50/85 border border-zinc-50/12 px-3 py-2">
                    Remaining: 50
                </div>


            </div>


        </div>
    )
}