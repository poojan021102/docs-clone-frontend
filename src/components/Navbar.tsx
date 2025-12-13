import useAppContext from "../context/useAppContext";
import docsLogo from "../assets/docs-logo.jpg";
import { TypeAnimation } from "react-type-animation";
import { toast } from "react-toastify";

export default function Navbar() {
  const { getAppContext, logoutContext } = useAppContext();
  // console.log(getAppContext())

  const getLoadingIcon = () => {
    return (
      <div
        className="ml-2 mr-3 animate-spin inline-block size-6 md:size-17 border-[3px] border-current border-t-transparent text-red-600 rounded-full "
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  };

  const handleLogout = () => {
    logoutContext();
    toast("Logged Out");
  };
  const appContext = getAppContext();
  const userColor =
    appContext &&
    appContext.user &&
    "color" in appContext.user &&
    appContext.user.color
      ? appContext.user.color
      : "black";
  const loginStatus = () => {
    return (
      <div className="flex text-center justify-center">
        <div
          className={`bg-blue-500 cursor-pointer text-sm p-2 pl-3 pr-3 rounded-md mr-2 hover:bg-blue-700 text-slate-100`}
        >
          {getAppContext().user?.email}
        </div>
        <button
          className="rounded-md bg-red-500 text-slate-100 text-bold md:text-sm p-1 md:p-2 ml-2 hover:bg-red-700 text-xs active:scale-90 transition-transform"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    );
  };

  return (
    <div className=" w-full flex items-center p-2  flex-col justify-center md:flex-row md:justify-between">
      <div className="flex flex-col md:flex-row justify-center items-center">
        {/* Docs Logo + Typewriter Animation */}
        {/* <div className=""> */}
        {/* Docs Logo */}
        <img className="h-10 w-10" src={docsLogo} alt="" />
        {/* </div> */}
        <p>
          {/* Typewriter Animation */}
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              "Create Document",
              1000, // wait 1s before replacing "Mice" with "Hamsters"
              "Get AI Suggestions",
              1000,
              "Collaborate",
              1000,
            ]}
            wrapper="p"
            speed={50}
            className="text-m"
            style={{ display: "inline-block" }}
            repeat={Infinity}
          />
        </p>
      </div>
      <div className="flex justify-center mt-2 md:mt-0">
        {getAppContext().loggedInStatus === "inProgress" && getLoadingIcon()}
        {getAppContext().loggedInStatus === "success" && loginStatus()}
      </div>
    </div>
  );
}
