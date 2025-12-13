import { useState, useEffect } from "react";
import Loading from "../pages/AllDocumentsPage/components/Loading";
import { useForm, SubmitHandler } from "react-hook-form";
import { getAllSharedEmail, share, removeAccess } from "../utilities/api";
import useAppContext from "../context/useAppContext";
import useAppCookie from "../customHooks/useAppCookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
        className="bg-white w-[95%] p-2 flex flex-wrap justify-between rounded-sm m-2 shadow-md text-xs md:text-sm hover:shadow-lg"
        key={email}
      >
        <div>{email}</div>
        <button
          onClick={() => {
            handleRemoveAccess(email, index);
          }}
          className="bg-slate-200 hover:bg-slate-300 p-1 text-xs md:text-sm rounded-sm pl-2 pr-2 active:scale-90 transition-transform"
        >
          Remove
        </button>
      </div>
    );
  };
  const showShareDetail = () => {
    return (
      <div className="p-2 mt-1">
        <form
          className="flex flex-wrap items-center"
          onSubmit={handleSubmit(handleAddEmail)}
        >
          <input
            className="p-1 pl-2 pr-2 bg-slate-200 mr-2 rounded-sm md:rounded-md text-xs md:text-lg w-[80%] outline-none"
            type="email"
            {...register("userEmail", { required: "Email is required" })}
          />
          <input
            type="submit"
            value="Share"
            className="bg-blue-500 hover:bg-blue-600 p-1 pl-2 pr-2 rounded-sm md:rounded-md cursor-pointer text-xs md:text-lg text-slate-200 active:scale-90 transition-transform"
          />
        </form>

        <div className="h-[50px]">
          {errors && errors.userEmail ? (
            <p className="text-red-500 text-sm md:text-md">
              {errors.userEmail?.message}
            </p>
          ) : (
            <p></p>
          )}
          {errors &&
          errors.userEmail &&
          errors.userEmail.types &&
          "customMessage" in errors.userEmail.types ? (
            <p className="text-red-500 text-sm md:text-md">
              {errors.userEmail?.types.customMessage}
            </p>
          ) : (
            <p></p>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="bg-slate-200 h-[200px] overflow-scroll rounded-sm">
            {internalLoading ? (
              <Loading message="" />
            ) : (
              allUserEmail.map((email, index) => {
                return showSharedEmail(email, index);
              })
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="w-[100%]">
      <h1 className="text-xl font-semi-bold md:text-3xl md:font-bold">Share</h1>
      {loading || !documentId.length || !documentTitle.length ? (
        <Loading message="Fetching details" />
      ) : (
        showShareDetail()
      )}
    </div>
  );
}
