import useAppContext from "../context/useAppContext";
import { TypeAnimation } from "react-type-animation";
import { toast } from "react-toastify";
import { FileText, LogOut } from "lucide-react";

export default function Navbar() {
  const { getAppContext, logoutContext } = useAppContext();

  const getLoadingIcon = () => {
    return (
      <div
        className="ml-2 mr-3 animate-spin inline-block size-6 md:size-17 border-[3px] border-current border-t-transparent text-blue-600 rounded-full "
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

  const loginStatus = () => {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {getAppContext().user?.email?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-700">
            {getAppContext().user?.email}
          </span>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-all duration-200 text-sm font-semibold"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    );
  };

  return (
    <nav className="w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo and Brand Section */}
        <div className="flex items-center gap-3 flex-1 md:flex-none">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-lg">
            <FileText size={24} className="text-white" />
          </div>
          <div className="flex flex-col md:gap-0 gap-1">
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              DocsClone
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              {/* Typewriter Animation */}
              <TypeAnimation
                sequence={[
                  "Create Document",
                  1000,
                  "Get AI Suggestions",
                  1000,
                  "Collaborate",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                style={{ display: "inline-block" }}
                repeat={Infinity}
              />
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 md:gap-6">
          {getAppContext().loggedInStatus === "inProgress" && getLoadingIcon()}
          {getAppContext().loggedInStatus === "success" && loginStatus()}
        </div>
      </div>
    </nav>
  );
}
