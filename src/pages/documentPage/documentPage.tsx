import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useAppContext from "../../context/useAppContext";
import Loading from "../AllDocumentsPage/components/Loading";
import ShowEditor from "./components/ShowEditor";
import { getDocumentContent } from "../../utilities/api";
import useAppCookie from "../../customHooks/useAppCookie";
import { toast } from "react-toastify";
import { canAccess } from "../../utilities/api";

type documentParams = {
  documentId: string;
};

export default function DocumentPage() {
  const { documentId } = useParams<documentParams>();
  const { getAppContext } = useAppContext();
  const appContext = getAppContext();
  const navigate = useNavigate();
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { getCookie } = useAppCookie();
  let documentContent = useRef("");
  let documentTitle = useRef("");
  const authToken = getCookie();

  useEffect(() => {
    if (appContext.loggedInStatus === "logout") {
      navigate("/");
    }
    if (appContext.loggedInStatus === "inProgress") {
      setLoading(true);
      setLoadingMessage("Checking for user account");
    } else if (appContext.loggedInStatus === "success") {
      const temp = async () => {
        setLoading(true);
        setLoadingMessage("Fetching document");
        if (appContext.user && appContext.user.userId) {
          if (documentId && authToken) {
            const checkAccess = await canAccess(
              appContext.user.userId,
              appContext.user.email,
              documentId,
              authToken
            );
            if (!checkAccess.status) {
              toast("You are not allowed to access document");
              navigate("/");
            } else {
              if (authToken && documentId) {
                const document = await getDocumentContent(
                  appContext.user?.userId,
                  appContext.user?.email,
                  authToken,
                  documentId
                );
                if (document.status && "content" in document) {
                  documentContent.current = document.content;
                  documentTitle.current = document.documentTitle;
                } else {
                  if ("message" in document) {
                    toast(document.message);
                  }
                  navigate("/");
                }
              }
            }
            setLoading(false);
          }
        }
      };
      temp();
    }
  }, [appContext]);

  return (
    <div className="min-h-screen">
      {appContext.loggedInStatus === "inProgress" ||
      appContext.loggedInStatus === "logout" ||
      !documentId ||
      !appContext ||
      !appContext.user ||
      loading ? (
        <Loading message={loadingMessage} />
      ) : (
        <ShowEditor
          documentTitle={documentTitle.current}
          documentContent={documentContent.current}
          appContext={appContext}
          documentId={documentId}
        />
      )}
    </div>
  );
}
