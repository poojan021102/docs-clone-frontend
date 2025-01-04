import { useForm, SubmitHandler } from "react-hook-form"
import { RegisterType } from "../../../types/userType";
type Props = {
    setToLogin: React.Dispatch<React.SetStateAction<boolean>>
}
import useAppContext from "../../../context/useAppContext";
import { registerUser } from "../../../utilities/api";
import { toast, Bounce } from "react-toastify";


export default function Register({ setToLogin } : Props){
    const {
            register,
            handleSubmit,
            formState: { errors }
        } = useForm<RegisterType>();
        const { registerContext, makeStatusPending, makeStatusLogout } = useAppContext();
        
    
        const submitForLogin: SubmitHandler<RegisterType> = async(data) => {
            makeStatusPending();
                    const response = await registerUser(data);

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
                        registerContext(response);
                    }
                    else{
                        makeStatusLogout();
                    }
        }
        
    
        return (
            <div className="h-[100%] w-[100%] flex justify-center items-center">
                <form className = "w-[100%] flex flex-col items-center" onSubmit={handleSubmit(submitForLogin)}>
                    <h1 className="text-2xl font-semibold mb-4">Register</h1>
                    <div className = "w-[60%] mt-4 mb-2">
                        <input className="outline-none p-3 bg-slate-100 rounded-md w-[100%]" placeholder="First Name" {...register("firstName", 
                            {
                                required: "First Name is required"
                            }
                        )}/>
                        {
                            errors.firstName && <p className="text-red-600">*{errors.firstName.message}</p>
                        }
                    </div>

                    <div className = "w-[60%] mt-4 mb-2">
                        <input className="outline-none p-3 bg-slate-100 rounded-md w-[100%]" placeholder="Last Name" {...register("lastName", 
                            {
                                required: "Last Name is required"
                            }
                        )}/>
                        {
                            errors.lastName && <p className="text-red-600">*{errors.lastName.message}</p>
                        }
                    </div>

                    <div className = "w-[60%] mt-4 mb-2">
                        <input className="outline-none p-3 bg-slate-100 rounded-md w-[100%]" placeholder="Email" {...register("email", 
                            {
                                required: "Email is required"
                            }
                        )}/>
                        {
                            errors.email && <p className="text-red-600">*{errors.email.message}</p>
                        }
                    </div>
                    <div className = "w-[60%] mt-4 mb-2">
                        <input className="outline-none  p-3 bg-slate-100 rounded-md w-[100%]" type="password" placeholder="Password" {...register("password", 
                            {
                                required: "Password is required"
                            }
                        )}/>
                        {
                            errors.password && <p className="text-red-600">*{errors.password.message}</p>
                        }
                    </div>
                    <input className="mb-4 mt-3 bg-blue-600 p-2 rounded-md text-slate-100 cursor-pointer pl-3 pr-3 hover:bg-blue-800" type="submit" value = "Register" />
                    <div className="underline cursor-pointer text-blue-600" onClick={() => {
                        setToLogin(true);
                    }}>Login</div>
                </form>
            </div>
        )
}