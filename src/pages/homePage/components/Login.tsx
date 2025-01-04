import { useForm, SubmitHandler } from "react-hook-form"
import { LoginType } from "../../../types/userType"
import useAppContext from "../../../context/useAppContext";
import { login } from "../../../utilities/api";
import { toast, Bounce } from "react-toastify";
type Props = {
    setToLogin: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Login({ setToLogin } : Props){
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginType>();
    const { loginContext, makeStatusPending, makeStatusLogout } = useAppContext();
    

    const submitForLogin: SubmitHandler<LoginType> = async (data) => {
        
        makeStatusPending();
        const response = await login(data);
        toast(response.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            })
        if(response.status){
            loginContext(response);
        }
        else{
            makeStatusLogout();
        }
    }
    

    return (
        <div className="h-[100%] w-[100%] flex justify-center items-center">
            <form className = "w-[100%] flex flex-col items-center" onSubmit={handleSubmit(submitForLogin)}>
                <h1 className="text-2xl font-semibold mb-4">Login</h1>
                <div className = "w-[60%]">
                    <input className="outline-none mt-4 mb-2 p-3 bg-slate-100 rounded-md w-[100%]" placeholder="Email" type="email" {...register("email", 
                        {
                            required: "Email is required"
                        }
                    )}/>
                    {
                        errors.email && <p className="text-red-600">*{errors.email.message}</p>
                    }
                </div>
                <div className = "w-[60%]">
                    <input className="outline-none mt-4 mb-2 p-3 bg-slate-100 rounded-md w-[100%]" type="Password" placeholder="password" {...register("password", 
                        {
                            required: "Password is required"
                        }
                    )}/>
                    {
                        errors.password && <p className="text-red-600">*{errors.password.message}</p>
                    }
                </div>
                <input className="mb-4 mt-4 bg-blue-600 p-2 rounded-md text-slate-100 cursor-pointer pl-3 pr-3 hover:bg-blue-800" type="submit" />
                <div className="underline cursor-pointer text-blue-600" onClick={() => {
                    setToLogin(false);
                }}>Register</div>
            </form>
        </div>
    )
}