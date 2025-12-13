import useAppContext from "../../../context/useAppContext";
import { useEffect, useState } from "react";
import { SharedDocument } from "../../../types/documentType";
import { sharedDocument } from "../../../utilities/api";
import useAppCookie from "../../../customHooks/useAppCookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../AllDocumentsPage/components/Loading";
import { Link } from "react-router-dom";
import docsLogo from "../../../assets/docs-logo.jpg";

export default function ShowTable() {
  const { getAppContext, makeStatusLogout } = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [allDocuments, setAllDocument] = useState<SharedDocument[]>([]);
  const appContext = getAppContext();
  const { getCookie } = useAppCookie();
  const cookie = getCookie();
  const navigate = useNavigate();
  useEffect(() => {
    const temp = async () => {
      setLoading(true);
      if (appContext.user?.userId && cookie) {
        const response = await sharedDocument(
          appContext.user.userId,
          appContext.user.email,
          cookie
        );
        if (response.status) {
          if ("documents" in response && response.documents) {
            setAllDocument(response.documents);
          }
        } else {
          if ("loggedIn" in response && !response.loggedIn) {
            toast("You need to login first");
            makeStatusLogout();
            navigate("/");
          } else {
            toast(response.message);
          }
        }
      } else {
        navigate("/");
      }
      setLoading(false);
    };
    temp();
  }, []);

  const showActualEntry = () => {
    return (
      <div className="w-[100%] flex flex-row justify-center">
        <div className="mt-2 w-[40vw] h-[100%] bg-slate-100 flex justify-center items-start">
          <div className="w-[100%] flex flex-col justify-center items-center">
            <Link
              to="/allDocuments"
              className="p-2 rounded-md text-xs md:text-md m-4 pl-3 pr-3 text-slate-200 font-semibold bg-blue-500 hover:bg-blue-600 active:scale-90 transition-transform"
            >
              My Documents
            </Link>
            <table className="table-fixed w-[100%] rounded-md">
              <thead className="bg-slate-400 pt-3 pb-3">
                <tr>
                  <th className="pt-2 pb-2 rounded-tl-md">Title</th>
                </tr>
              </thead>
              <tbody>
                {allDocuments &&
                  allDocuments.map((document) => {
                    return (
                      <tr
                        className="pt-3 pb-3 bg-white shadow-xl font-bold"
                        key={document.documentId}
                      >
                        <td className="pt-2 border-y-[2px]text-center text-xs md:text-md underline text-blue-400">
                          <div className="flex justify-around items-center">
                            <img
                              className="w-6 h-6"
                              src={docsLogo}
                              alt="Document"
                            />
                            <Link
                              to={`/document/${document.documentId}`}
                              className="active:scale-90 transition-transform"
                            >
                              {document.documentTitle}
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return loading ? <Loading message="Loading Documents" /> : showActualEntry();
}
