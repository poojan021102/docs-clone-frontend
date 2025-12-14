import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import useAppContext from "../../context/useAppContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [toLogin, setToLogin] = useState<boolean>(true);
  const { getAppContext } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (getAppContext().loggedInStatus === "success") {
      navigate("/allDocuments");
    }
  });

  const showLoading = () => {
    return (
      <div
        className="ml-2 mr-3 animate-spin inline-block size-7 md:size-17 border-[3px] border-current border-t-transparent text-blue-400 rounded-full "
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  };

  const normalWorkFlow = () => {
    return toLogin ? (
      <Login setToLogin={setToLogin} />
    ) : (
      <Register setToLogin={setToLogin} />
    );
  };

  return (
    <div className="min-h-screen overflow-hidden flex justify-center items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
      <div className="w-[85%] h-[86vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex items-center justify-between overflow-hidden">
        <div className="flex flex-col justify-center items-center h-[100%] w-[100%] md:w-[50%]">
          {/* Login and Logout Component */}
          {getAppContext().loggedInStatus === "inProgress"
            ? showLoading()
            : normalWorkFlow()}
        </div>
        <div className="w-0 md:w-[50%] h-[100%] rounded-r-2xl bg-gradient-to-br from-slate-100 to-slate-200 md:flex justify-center items-center md:p-8 hidden md:block">
          {/* Professional Document Collaboration Image */}
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
            alt="Document collaboration"
          />
        </div>
      </div>
    </div>
  );
}
