import { useForm, SubmitHandler } from "react-hook-form";
import { RegisterType } from "../../../types/userType";
import useAppContext from "../../../context/useAppContext";
import { registerUser } from "../../../utilities/api";
import { toast, Bounce } from "react-toastify";
import { User, Mail, Lock, UserPlus } from "lucide-react";

type Props = {
  setToLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Register({ setToLogin }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>();
  const { registerContext, makeStatusPending, makeStatusLogout } =
    useAppContext();

  const submitForLogin: SubmitHandler<RegisterType> = async (data) => {
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
    });
    if (response.status) {
      registerContext(response);
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
            Create Account
          </h1>
          <p className="text-slate-600 text-sm">
            Join us and start collaborating
          </p>
        </div>

        <div className="w-full mb-6">
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="First Name"
              {...register("firstName", {
                required: "First Name is required",
              })}
            />
          </div>
          {errors.firstName && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
              <span>•</span>
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="w-full mb-6">
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Last Name"
              {...register("lastName", {
                required: "Last Name is required",
              })}
            />
          </div>
          {errors.lastName && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
              <span>•</span>
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div className="w-full mb-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Email address"
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
          <UserPlus className="h-5 w-5" />
          Create Account
        </button>

        <div className="text-center text-slate-600 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setToLogin(true)}
            className="text-blue-600 hover:text-cyan-600 font-semibold transition-colors duration-200 ml-1"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
