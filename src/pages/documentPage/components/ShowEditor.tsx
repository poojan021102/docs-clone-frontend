import { useCallback, useEffect, useState, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { QUILL_OPTIONS } from "../../../utilities/constants";
import "./editorStyle.css";
import { connectSocket } from "../../../utilities/socket";
import { appContextType } from "../../../types/appcontextType";
import { toast } from "react-toastify";
import QuillCursors from "quill-cursors";
import { getAISuggestion } from "../../../utilities/api";
import { Link } from "react-router-dom";
import ShareDialogBox from "../../../components/ShareDialogBox";
import { Share2, Home, FileText, ArrowLeft } from "lucide-react";

Quill.register("modules/cursors", QuillCursors);

interface CursorState {
  isAICalled: "not_started_writing" | "not_called" | "in_progress" | "called";
  cursorIndex: number;
  lastMoved: Date;
}

interface UserSocketData {
  user: any;
  socketId: string;
  email: string;
}

interface TextChangeData {
  delta: any;
}

interface RangeData {
  index: number;
  length: number;
}

type Props = {
  documentId: string;
  appContext: appContextType;
  documentContent: any;
  documentTitle: string;
};

export default function ShowEditor({
  documentId,
  appContext,
  documentContent,
  documentTitle,
}: Props) {
  const [socket, setSocket] = useState<any>(null);
  const [quill, setQuill] = useState<Quill | undefined>(undefined);
  const [cursor, setCursor] = useState<any>(null);
  const cursorState = useRef<CursorState | null>(null);
  const selectedDocument = useRef({
    documentId: "",
    documentTitle: "",
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  const wrapperRef = useCallback((wrapper: any) => {
    if (wrapper === null || wrapper === undefined) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      modules: {
        toolbar: QUILL_OPTIONS,
        cursors: true,
      },
      theme: "snow",
    });
    setSocket(connectSocket());
    setQuill(q);
    q.setContents(documentContent);
    setCursor(q.getModule("cursors"));
    cursorState.current = {
      isAICalled: "not_started_writing" as const,
      cursorIndex: q.getLength(),
      lastMoved: new Date(),
    };
  }, []);

  const colors = ["blue", "red", "orange", "green"];

  function pickRandomString(arr: string[]): string {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  useEffect(() => {
    if (!quill || !socket || !appContext || !appContext.user) return;

    socket.emit("userConnectedClientToServer", {
      documentId,
      user: appContext.user,
    });

    const onUserConnected = (args: UserSocketData) => {
      toast(
        `${args.user.firstName + args.user.lastName} (${
          args.user.email
        }) joined`
      );
    };

    const onDisconnecting = (args: UserSocketData) => {
      toast(
        `${args.user.firstName + args.user.lastName} (${
          args.user.email
        }) disconnected`
      );
      cursor?.removeCursor(args.socketId);
    };

    const onTextChange = (delta: any, _: any, source: any) => {
      if (source === "user") {
        cursorState.current = {
          cursorIndex: quill?.getSelection()?.index || 0,
          lastMoved: new Date(),
          isAICalled: "not_called" as const,
        };
        socket.emit("textChangeClientToServer", {
          delta,
          documentId,
          content: quill?.getContents(),
        });
      }
    };

    const onTextChangeFromServer = (args: TextChangeData) => {
      quill?.updateContents(args.delta, "api");
    };

    const onSelectionChange = (range: RangeData, _: any) => {
      socket.emit("editorSelectionChangeClientToServer", {
        range,
        user: appContext.user,
        documentId,
      });
    };

    const onSelectionChangeFromServer = (args: any) => {
      cursor?.createCursor(
        args.socketId,
        args.user.firstName + args.user.lastName,
        pickRandomString(colors)
      );
      cursor?.moveCursor(args.socketId, args.range);
      cursor?.toggleFlag(args.socketId, true);
    };

    socket.on("userConnectedServerToClient", onUserConnected);
    socket.on("disconnectingServerToClient", onDisconnecting);
    quill.on("text-change", onTextChange);
    socket.on("textChangeServerToClient", onTextChangeFromServer);
    quill.on("selection-change", onSelectionChange);
    socket.on(
      "editorSelectionChangeServerToClient",
      onSelectionChangeFromServer
    );

    const interval = setInterval(async () => {
      const currentDate = new Date();
      const previousDate = cursorState.current?.lastMoved;
      if (
        cursorState.current &&
        quill &&
        quill.getLength() - 1 &&
        currentDate.getTime() - cursorState.current.lastMoved.getTime() >=
          3000 &&
        cursorState.current.isAICalled == "not_called"
      ) {
        cursorState.current.isAICalled = "in_progress";

        const response = await getAISuggestion(
          quill.getText().substring(0, cursorState.current.cursorIndex)
        );

        if (response.status && previousDate == cursorState.current.lastMoved) {
          if ("response" in response && response.response) {
            const aiText = String(response.response);
            quill.insertText(cursorState.current.cursorIndex, aiText, "api");
            quill.setSelection(cursorState.current.cursorIndex + aiText.length);

            // Emit AI suggestion to other users
            socket.emit("textChangeClientToServer", {
              delta: {
                ops: [
                  { retain: cursorState.current.cursorIndex },
                  { insert: aiText },
                ],
              },
              documentId,
              content: quill?.getContents(),
            });
          }
        }

        cursorState.current.isAICalled = "called";
      }
    }, 2000);

    const onDisconnect = () => {
      socket.emit("disconnectingClientToServer", {
        documentId,
        user: appContext.user,
      });
    };

    socket.on("disconnect", onDisconnect);

    return () => {
      socket.emit("disconnectingClientToServer", {
        documentId,
        user: appContext.user,
      });

      socket.off("userConnectedServerToClient", onUserConnected);
      socket.off("disconnectingServerToClient", onDisconnecting);
      socket.off("textChangeServerToClient", onTextChangeFromServer);
      quill.off("text-change", onTextChange);
      socket.off(
        "editorSelectionChangeServerToClient",
        onSelectionChangeFromServer
      );
      quill.off("selection-change", onSelectionChange);
      socket.off("disconnect", onDisconnect);

      clearInterval(interval);
      socket.disconnect();
    };
  }, [socket, quill, appContext, documentId]);

  const handleShareDocumentClick = () => {
    setShowModal(true);
    selectedDocument.current.documentId = documentId;
    selectedDocument.current.documentTitle = documentTitle;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {showModal && (
        <ShareDialogBox
          selectedDocument={selectedDocument}
          setShowModal={setShowModal}
        />
      )}

      {/* Document Title Bar - Full Width */}
      <div className="w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Title Section */}
          <div className="flex flex-col flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent truncate">
              {documentTitle || "Untitled Document"}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              to="/allDocuments"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200 font-semibold text-sm border border-slate-300 hover:shadow-md active:scale-95"
            >
              <ArrowLeft size={16} />
              <span className="hidden md:inline">Back</span>
            </Link>
            <button
              onClick={() => {
                handleShareDocumentClick();
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg active:scale-95"
            >
              <Share2 size={16} />
              <span className="hidden md:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Container - Full Width */}
      <div className="w-full">
        <div
          id="container"
          className="w-full min-h-[calc(100vh-150px)] flex flex-col justify-center items-center"
          ref={wrapperRef}
        ></div>
      </div>
    </div>
  );
}
