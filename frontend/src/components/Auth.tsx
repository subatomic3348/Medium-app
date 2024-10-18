import { SigninType, SignupType } from "@subatomic3348/zod-common"
import { ChangeEvent, useState } from "react"
import { Link , useNavigate } from "react-router-dom"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const Auth=({type}:{type:"Signup"|"Signin"})=>{
    const  Navigate =  useNavigate();
    const [postInputs,setpostInputs] = useState<SignupType|SigninType>({
        name:"",
        email:"",
        password:"",
    })
    async function sendRequest(){
        try{
        const res = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "Signup" ? "signup" : "signin"}`, postInputs);
        const jwt = res.data;
        localStorage.setItem("token", jwt);
        Navigate("/blogs");
        }
        catch(e){
            toast.error("error while singing up")
        }
    }
    return <div className="h-screen flex justify-center flex-col">
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />


        <div className="flex justify-center ">
            <div>
                <div className="px-10">
      {type=="Signup"?  <div className="text-3xl font-extrabold px-2">
            Create an Account

        </div>: <div className="text-3xl font-extrabold ">
            Login To Your Account
            </div>}
        <div className="text-slate-500 px-5">
                        {type === "Signin" ? "Don't have an account?" : "Already have an account?" }
                        <Link className="pl-2 underline" to={type === "Signin" ? "/Signup" : "/Signin"}>
                            {type === "Signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
        </div>
        <div>
       {type=="Signup"? <LabledInput label="Name" placeholder="your Name" onChange={(e)=>{
            setpostInputs(c=>{
                return {...c,name:e.target.value}
            })
            

        }}/>:null}
        <LabledInput label="Email" placeholder="Enter Your Gmail" onChange={(e)=>{
            setpostInputs((c)=>{
                return {...c,email:e.target.value}
            })
            

        }}/>
        <LabledInput label="Password"  type =  {"password"} placeholder="Enter Your Password" onChange={(e)=>{
            setpostInputs((c)=>{
                return {...c,password:e.target.value}
            })
            

        }}/>
        <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "Signup" ? "Sign up" : "Sign in"}</button>


        </div>
        </div>
        </div>
        
    </div>
}
interface LabledInputType{
    label:string;
    placeholder:string;
    onChange:(e:ChangeEvent<HTMLInputElement>)=>void;
    type?:string
}
function LabledInput({label,placeholder,onChange,type}:Readonly<LabledInputType>){//readonly props (corrected using sonarlint);
    return <div>
    <label  className="block mb-2 text-sm font-semibold pt-4 text-black-900 ">{label}</label>
    <input onChange={onChange} type={type||"text"} id="first_name" className="bg-gray-50 border border-gray-300 
    text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
     placeholder={placeholder} required />
</div>

}