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


            <div className="px-3.5 py-2 font-extrabold text-5xl mt-5 border border-zinc-50/10 hover:bg-zinc-50 hover:text-zinc-950 transition-colors duration-300 ">
                My To-do List
            </div>



        </div>
    )
}