import { useState, useEffect } from "react";
import Loading from "../pages/AllDocumentsPage/components/Loading";
import { useForm, SubmitHandler } from "react-hook-form";
import { getAllSharedEmail, share, removeAccess } from "../utilities/api";
import useAppContext from "../context/useAppContext";
import useAppCookie from "../customHooks/useAppCookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, X, UserPlus } from "lucide-react";

type Props = {
  documentId: string;
  documentTitle: string;
};
type Inputs = {
  userEmail: string;
};
export default function ShowShareModalContent({
  documentId,
  documentTitle,
}: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>();
  const { getAppContext } = useAppContext();
  const { getCookie } = useAppCookie();
  const appContext = getAppContext();
  const authToken = getCookie();
  const [allUserEmail, setAllUserEmail] = useState<string[]>([]);
  const handleAddEmail: SubmitHandler<Inputs> = async (data) => {
    try {
      if (data.userEmail == appContext.user?.email) {
        setError("userEmail", {
          types: {
            customMessage: "Email should not be same as owner email",
          },
        });
        return;
      }
      if (allUserEmail.indexOf(data.userEmail) != -1) {
        setError("userEmail", {
          types: {
            customMessage: "Email already shared",
          },
        });
        return;
      }
      setInternalLoading(true);
      if (
        appContext.user?.userId &&
        appContext.user.email &&
        documentId &&
        documentTitle &&
        data.userEmail &&
        authToken
      ) {
        const response = await share(
          appContext.user?.userId,
          appContext.user?.email,
          documentId,
          documentTitle,
          data.userEmail,
          authToken
        );
        if (response.status) {
          setAllUserEmail([...allUserEmail, data.userEmail]);
        } else {
          if ("loggedIn" in response && !response.loggedIn) {
            toast("Login First");
          } else {
            setError("userEmail", {
              types: {
                customMessage: response.message,
              },
            });
          }
        }
      }
    } catch (err) {}
    setInternalLoading(false);
  };

  useEffect(() => {
    // API
    const temp = async () => {
      try {
        setLoading(true);
        if (appContext.user?.email && authToken) {
          const response = await getAllSharedEmail(
            documentId,
            appContext.user?.email,
            appContext.user?.userId,
            authToken
          );
          if (
            response.status &&
            "allEmails" in response &&
            response.allEmails
          ) {
            setAllUserEmail(response.allEmails);
            setLoading(false);
          } else {
            navigate("/");
            setLoading(false);
          }
        } else {
          toast("Error while fetching details");
          setLoading(true);
          navigate("/");
        }
      } catch (err) {
        toast("Error while fetching details");
        setLoading(false);
        navigate("/");
      }
    };
    temp();
  }, []);

  const handleRemoveAccess = async (sharedUserEmail: string, index: number) => {
    try {
      setInternalLoading(true);
      if (
        appContext.user?.userId &&
        appContext.user.email &&
        documentId &&
        sharedUserEmail &&
        authToken
      ) {
        const response = await removeAccess(
          appContext.user.userId,
          appContext.user.email,
          documentId,
          sharedUserEmail,
          authToken
        );
        if (response.status) {
          setAllUserEmail(allUserEmail.filter((_, i) => i !== index));
        } else {
          if ("loggedIn" in response && response.loggedIn) {
            toast("You need to login first");
            navigate("/");
          }
        }
      }
    } catch (err) {}
    setInternalLoading(false);
  };

  const showSharedEmail = (email: string, index: number) => {
    return (
      <div
        className="bg-white p-4 flex items-center justify-between rounded-xl m-2 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200"
        key={email}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-slate-900 font-medium text-sm">{email}</span>
        </div>
        <button
          onClick={() => {
            handleRemoveAccess(email, index);
          }}
          className="ml-2 p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 border border-red-200 active:scale-90"
          title="Remove access"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };
  const showShareDetail = () => {
    return (
      <div className="space-y-6">
        {/* Share Form */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">
            Share with email
          </label>
          <form
            className="flex flex-col md:flex-row gap-2"
            onSubmit={handleSubmit(handleAddEmail)}
          >
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
                type="email"
                placeholder="Enter email address..."
                {...register("userEmail", { required: "Email is required" })}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center gap-2 active:scale-95 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Share
            </button>
          </form>

          {/* Error Messages */}
          <div className="min-h-6">
            {errors && errors.userEmail ? (
              <p className="text-red-600 text-sm font-medium">
                {errors.userEmail?.message}
              </p>
            ) : null}
            {errors &&
            errors.userEmail &&
            errors.userEmail.types &&
            "customMessage" in errors.userEmail.types ? (
              <p className="text-red-600 text-sm font-medium">
                {errors.userEmail?.types.customMessage}
              </p>
            ) : null}
          </div>
        </div>

        {/* Shared Users List */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">
            Shared with ({allUserEmail.length})
          </label>
          <div className="max-h-64 overflow-y-auto rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2">
            {internalLoading ? (
              <Loading message="" />
            ) : allUserEmail.length > 0 ? (
              allUserEmail.map((email, index) => {
                return showSharedEmail(email, index);
              })
            ) : (
              <div className="py-8 text-center">
                <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-2 opacity-50" />
                <p className="text-slate-500 text-sm">No one has access yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="w-full">
      {loading || !documentId.length || !documentTitle.length ? (
        <Loading message="Fetching details" />
      ) : (
        showShareDetail()
      )}
    </div>
  );
}
