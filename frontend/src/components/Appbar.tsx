import { auth } from "hono/utils/basic-auth"
import { Avatar } from "./BlogCard"

export const Appbar=()=>{
    return <div className="border-b flex justify-between px-5 py-5 ">
        <div className=" flex flex-col justify-center text-2xl font-semibold" >
            Medium
        </div>
        <div  >
            <Avatar  size="big" name={auth.name}/>
        </div>
        </div>
}