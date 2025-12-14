import useAppContext from "../../../context/useAppContext";
import { useEffect, useState } from "react";
import {
  DocumentWithoutContent,
  SharedDocument,
} from "../../../types/documentType";
import {
  getAllDocuments,
  deleteDocument,
  sharedDocument,
} from "../../../utilities/api";
import useAppCookie from "../../../customHooks/useAppCookie";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "./Loading";
import { createDocument } from "../../../utilities/api";
import { Link } from "react-router-dom";
import { Trash2, Share2, FileText, Plus, Files, Users } from "lucide-react";

type Props = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDocument: React.MutableRefObject<{
    documentId: string;
    documentTitle: string;
  }>;
};

export default function ShowTable({ setShowModal, selectedDocument }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getAppContext, makeStatusLogout } = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [allDocuments, setAllDocument] = useState<
    (DocumentWithoutContent | SharedDocument)[]
  >([]);
  const appContext = getAppContext();
  const { getCookie } = useAppCookie();
  const cookie = getCookie();
  const navigate = useNavigate();
  const [newDocumentTitle, setNewDocumentTitle] = useState<string>("");
  const activeTab = searchParams.get("tab") || "my-documents";

  useEffect(() => {
    const temp = async () => {
      setLoading(true);
      if (appContext.user?.userId && cookie) {
        const apiCall =
          activeTab === "shared" ? sharedDocument : getAllDocuments;
        const response = await apiCall(
          appContext.user?.userId,
          appContext.user?.email,
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
  }, [activeTab]);

  const handleCreateDocument = async (e: any) => {
    try {
      e.preventDefault();
      // setLoading(true);
      if (
        appContext.user &&
        appContext.user.email &&
        appContext.user.userId &&
        cookie
      ) {
        const response = await createDocument(
          {
            email: appContext.user?.email,
            userId: appContext.user?.userId,
            documentTitle: newDocumentTitle,
          },
          cookie
        );
        if (response.status && "document" in response && response.document) {
          const d: [DocumentWithoutContent] = JSON.parse(
            JSON.stringify(allDocuments)
          );
          d.push(response.document);
          setAllDocument(d);
          toast("Document created successfuly");
        }
      }
      // setLoading(false);
      setNewDocumentTitle("");
    } catch (err) {
      toast("Error in creating new document");
    }
  };

  const deleteDocumentState = async (index: number) => {
    try {
      if ("user" in appContext && appContext.user?.userId && cookie) {
        const response = await deleteDocument(
          appContext.user?.userId,
          appContext.user?.email,
          cookie,
          allDocuments[index].documentId
        );
        if (response.status) {
          const d: [DocumentWithoutContent] = JSON.parse(
            JSON.stringify([
              ...allDocuments.slice(0, index),
              ...allDocuments.slice(index + 1),
            ])
          );
          setAllDocument(d);
          toast("Document deleted");
        } else if ("loggedIn" in response && !response.loggedIn) {
          toast("Login Required");
          makeStatusLogout();
          navigate("/");
        } else {
          toast("Deletion Failed");
        }
      }
    } catch (err) {}
  };
  const handleShareButtonClick = (
    documentId: string,
    documentTitle: string
  ) => {
    selectedDocument.current.documentId = documentId;
    selectedDocument.current.documentTitle = documentTitle;
    setShowModal(true);
  };
  const showShareButton = (documentId: string, documentTitle: string) => {
    return (
      <button
        onClick={() => handleShareButtonClick(documentId, documentTitle)}
        className="rounded-md bg-blue-600 text-slate-200 p-1 text-xs cursor-pointer font-semi-bold hover:bg-blue-700"
      >
        Share
      </button>
    );
  };

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
              My Documents
            </h1>
            <p className="text-slate-600 text-sm">
              Create and manage your documents
            </p>
          </div>

          {/* Create Document Form - Only show on My Documents tab */}
          {activeTab === "my-documents" && (
            <div className="mb-8">
              <div className="w-full px-6 py-8 bg-white rounded-2xl flex flex-col items-center backdrop-blur-sm shadow-lg border border-slate-200">
                <form
                  className="w-full flex flex-col md:flex-row gap-3 items-end"
                  onSubmit={handleCreateDocument}
                >
                  <div className="flex-1 w-full">
                    <label
                      className="block text-xs font-semibold text-slate-700 mb-2"
                      htmlFor="documentTitle"
                    >
                      Document Title
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                      <input
                        id="documentTitle"
                        type="text"
                        value={newDocumentTitle}
                        onChange={(e) => setNewDocumentTitle(e.target.value)}
                        autoFocus
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Enter document title..."
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCreateDocument}
                    disabled={newDocumentTitle.length ? false : true}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 active:scale-95"
                  >
                    <Plus className="h-5 w-5" />
                    Create
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex border-b-2 border-slate-200">
              <button
                onClick={() => setSearchParams({ tab: "my-documents" })}
                className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-[3px] transition-all duration-200 relative ${
                  activeTab === "my-documents"
                    ? "text-blue-600 border-b-[3px]"
                    : "text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300"
                }`}
                style={
                  activeTab === "my-documents"
                    ? {
                        borderBottomColor: "var(--tw-gradient-from)",
                        background:
                          "linear-gradient(to right, rgb(37, 99, 235), rgb(34, 211, 238))",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }
                    : {}
                }
              >
                <Files size={18} />
                My Documents
              </button>
              <button
                onClick={() => setSearchParams({ tab: "shared" })}
                className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-[3px] transition-all duration-200 ${
                  activeTab === "shared"
                    ? "text-blue-600 border-b-[3px]"
                    : "text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300"
                }`}
                style={
                  activeTab === "shared"
                    ? {
                        borderBottomColor: "var(--tw-gradient-from)",
                        background:
                          "linear-gradient(to right, rgb(37, 99, 235), rgb(34, 211, 238))",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }
                    : {}
                }
              >
                <Users size={18} />
                Shared With Me
              </button>
            </div>
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
                    {activeTab === "shared" ? (
                      <>
                        <th className="px-6 py-4 text-left font-semibold text-sm">
                          Shared By
                        </th>
                      </>
                    ) : null}
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Created
                    </th>
                    {activeTab === "my-documents" ? (
                      <th className="px-6 py-4 text-center font-semibold text-sm">
                        Actions
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {allDocuments.map((document, index) => (
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
                      {activeTab === "shared" && "ownerEmail" in document ? (
                        <td className="px-6 py-4 text-slate-600 text-sm">
                          {document.ownerEmail}
                        </td>
                      ) : null}
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {formatDateString(document.createdAt)}
                      </td>
                      {activeTab === "my-documents" ? (
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 border border-red-200 hover:shadow-md active:scale-95"
                              onClick={() => deleteDocumentState(index)}
                              title="Delete document"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleShareButtonClick(
                                  document.documentId,
                                  document.documentTitle
                                )
                              }
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 border border-blue-200 hover:shadow-md active:scale-95"
                              title="Share document"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 px-6 py-16 text-center">
              <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
              <p className="text-slate-600 font-semibold text-lg mb-2">
                No documents yet
              </p>
              <p className="text-slate-500 text-sm">
                Create your first document to get started
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return loading ? <Loading message="Loading Documents" /> : showActualEntry();
}
