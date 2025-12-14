import useAppContext from "../context/useAppContext";
import { TypeAnimation } from "react-type-animation";
import { toast } from "react-toastify";
import { FileText, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { getAppContext, logoutContext } = useAppContext();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setIsProfileMenuOpen(false);
  };

  const loginStatus = () => {
    const user = getAppContext().user;
    const fullName =
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email;
    const initials =
      `${user?.firstName?.charAt(0) || ""}${
        user?.lastName?.charAt(0) || ""
      }`.toUpperCase() || user?.email?.charAt(0).toUpperCase();

    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="flex items-center gap-2 hover:opacity-80 transition-all duration-200"
        >
          <div
            className={`w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-md transition-all duration-200 ${
              isProfileMenuOpen ? "ring-2 ring-blue-400 ring-offset-2" : ""
            }`}
          >
            {initials}
          </div>
        </button>

        {/* Dropdown Menu */}
        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info Section */}
            <div className="px-4 py-4 border-b border-slate-200 bg-slate-50">
              <p className="text-sm font-semibold text-slate-900">{fullName}</p>
              <p className="text-xs text-slate-600 mt-1">{user?.email}</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 flex items-center gap-2 text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
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
