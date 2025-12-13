import useAppContext from "../../../context/useAppContext";
import { useEffect, useState } from "react";
import { DocumentWithoutContent } from "../../../types/documentType";
import { getAllDocuments, deleteDocument } from "../../../utilities/api";
import useAppCookie from "../../../customHooks/useAppCookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "./Loading";
import { createDocument } from "../../../utilities/api";
import { Link } from "react-router-dom";
import docsLogo from "../../../assets/docs-logo.jpg";

type Props = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDocument: React.MutableRefObject<{
    documentId: string;
    documentTitle: string;
  }>;
};

export default function ShowTable({ setShowModal, selectedDocument }: Props) {
  const { getAppContext, makeStatusLogout } = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [allDocuments, setAllDocument] = useState<DocumentWithoutContent[]>([]);
  const appContext = getAppContext();
  const { getCookie } = useAppCookie();
  const cookie = getCookie();
  const navigate = useNavigate();
  const [newDocumentTitle, setNewDocumentTitle] = useState<string>("");
  useEffect(() => {
    const temp = async () => {
      setLoading(true);
      if (appContext.user?.userId && cookie) {
        const response = await getAllDocuments(
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
  }, []);

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
        className="rounded-md bg-blue-600 active:scale-90 transition-transform text-slate-200 p-1 text-xs cursor-pointer font-semi-bold hover:bg-blue-700"
      >
        Share
      </button>
    );
  };

  function formatDateString(dateString: string) {
    const date = new Date(dateString);

    // Use Intl.DateTimeFormat to get a readable format
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate.replace(",", "");
  }

  const showActualEntry = () => {
    return (
      <div className="w-[100%] flex flex-row justify-center">
        <div className="mt-2 w-[80vw] h-[100%] bg-slate-100 flex justify-center items-start">
          <div className="w-[100%] flex flex-col justify-center items-center">
            <form
              className="flex mb-3 flex-col md:flex-row justify-center items-center"
              action=""
            >
              <input
                type="text"
                value={newDocumentTitle}
                onChange={(e) => {
                  setNewDocumentTitle(e.target.value);
                }}
                className="p-2 rounded-md m-2 outline-none"
                placeholder="Enter Document Title"
              />
              <input
                onClick={handleCreateDocument}
                className="text-sm active:scale-90 cursor-pointer pl-4 pr-4 pt-2 pb-2 rounded-lg border-2 border-blue-500 hover:bg-gradient-to-r hover:from-cyan-500 transition hover:to-blue-500"
                disabled={newDocumentTitle.length ? false : true}
                value="Create"
                type="submit"
              />
            </form>
            <Link
              to="/shared-with-me"
              className="p-2 text-xs md:text-md rounded-md m-4 pl-3 pr-3 text-slate-200 font-semibold bg-blue-500 hover:bg-blue-600 active:scale-90 transition-transform"
            >
              Shared Document With Me
            </Link>
            <table className="table-fixed w-[100%] rounded-md">
              <thead className="bg-slate-400 pt-3 pb-3">
                <tr>
                  <th className="pt-2 pb-2 rounded-tl-md">Title</th>
                  <th className="pt-2 pb-2">Created At</th>
                  <th className="pt-2 pb-2 rounded-tr-md">Action</th>
                </tr>
              </thead>
              <tbody>
                {allDocuments &&
                  allDocuments.map((document, index) => {
                    return (
                      <tr
                        className="pt-3 pb-3 bg-white shadow-xl"
                        key={document.documentId}
                      >
                        <td className="pt-2 border-y-[2px]text-center text-xs md:text-md underline font-bold text-blue-400">
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
                        <td className="text-center border-y-[2px] p-0 text-xs md:text-md">
                          {formatDateString(document.createdAt)}
                        </td>
                        <td className="text-center border-y-[2px] pt-2 pb-2 item-center flex justify-around">
                          <button
                            className="rounded-md active:scale-90 transition-transform text-xs p-1 bg-red-500 hover:bg-red-700 text-slate-200"
                            onClick={() => {
                              deleteDocumentState(index);
                            }}
                          >
                            Delete
                          </button>
                          {showShareButton(
                            document.documentId,
                            document.documentTitle
                          )}
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
