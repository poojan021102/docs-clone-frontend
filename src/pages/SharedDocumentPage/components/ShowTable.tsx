import useAppContext from "../../../context/useAppContext";
import { useEffect, useState } from "react";
import { SharedDocument } from "../../../types/documentType";
import { sharedDocument } from "../../../utilities/api";
import useAppCookie from "../../../customHooks/useAppCookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../AllDocumentsPage/components/Loading";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";

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

  function formatDateString(dateString: string) {
    const date = new Date(dateString);

    // Format in Indian style: DD/MM/YYYY HH:MM:SS
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  const showActualEntry = () => {
    return (
      <div className="h-full w-full flex justify-center min-h-screen py-2 px-4">
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Shared With Me
            </h1>
            <p className="text-slate-600 text-sm">Documents shared by others</p>
          </div>

          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/allDocuments"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              My Documents
            </Link>
          </div>

          {/* Documents Table */}
          {allDocuments.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Title
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {allDocuments.map((document) => {
                    return (
                      <tr
                        key={document.documentId}
                        className="hover:bg-slate-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <Link
                            to={`/document/${document.documentId}`}
                            className="flex items-center gap-3 group"
                          >
                            <FileText className="w-5 h-5 flex-shrink-0 text-slate-600" />
                            <span className="font-semibold text-slate-900 group-hover:text-blue-600 group-hover:underline truncate transition-colors duration-200">
                              {document.documentTitle}
                            </span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 px-6 py-16 text-center">
              <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
              <p className="text-slate-600 font-semibold text-lg mb-2">
                No shared documents yet
              </p>
              <p className="text-slate-500 text-sm">
                Documents shared with you will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return loading ? <Loading message="Loading Documents" /> : showActualEntry();
}
