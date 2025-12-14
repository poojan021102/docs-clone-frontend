import { useForm, SubmitHandler } from "react-hook-form";
import { LoginType } from "../../../types/userType";
import useAppContext from "../../../context/useAppContext";
import { login } from "../../../utilities/api";
import { toast, Bounce } from "react-toastify";
import { Mail, Lock, LogIn } from "lucide-react";

type Props = {
  setToLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Login({ setToLogin }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    });
    if (response.status) {
      loginContext(response);
    } else {
      makeStatusLogout();
    }
  };

  return (
    <div className="h-full w-full flex justify-center items-center">
      <form
        className="w-full max-w-md px-6 py-12 bg-white rounded-2xl flex flex-col items-center backdrop-blur-sm"
        onSubmit={handleSubmit(submitForLogin)}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        <div className="w-full mb-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Email address"
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
              <span>•</span>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="w-full mb-8">
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
              })}
            />
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
              <span>•</span>
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mb-6 active:scale-95"
        >
          <LogIn className="h-5 w-5" />
          Sign In
        </button>

        <div className="text-center text-slate-600 text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setToLogin(false)}
            className="text-blue-600 hover:text-cyan-600 font-semibold transition-colors duration-200 ml-1"
          >
            Create one
          </button>
        </div>
      </form>
    </div>
  );
}
