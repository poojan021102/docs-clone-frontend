import { useCallback, useEffect, useState, useRef } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { QUILL_OPTIONS } from "../../../utilities/constants";
import "./editorStyle.css"
import { connectSocket } from "../../../utilities/socket";
import { appContextType } from "../../../types/appcontextType";
import { toast } from "react-toastify";
import QuillCursors from 'quill-cursors';
import { getAISuggestion } from "../../../utilities/api";
import { Link } from "react-router-dom";
import ShareDialogBox from "../../../components/ShareDialogBox";

Quill.register('modules/cursors', QuillCursors);

type Props = {
    documentId: string,
    appContext: appContextType,
    documentContent: any,
    documentTitle: string
}

export default function ShowEditor({ documentId, appContext, documentContent, documentTitle }: Props){
    const [socket, setSocket] = useState<any>(null);
    const [quill, setQuill] = useState<Quill | undefined>(undefined);
    const [cursor, setCursor] = useState(null);
    const cursorState = useRef(null);
    const selectedDocument = useRef({
        documentId: "",
        documentTitle: ""
    })
    const [showModal, setShowModal] = useState<boolean>(false);
    
    const wrapperRef = useCallback((wrapper: any) => {
        if(wrapper === null || wrapper === undefined)return;
        wrapper.innerHTML = "";
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor, {
            modules: {
                toolbar: QUILL_OPTIONS,
                cursors: true
            },
            theme: 'snow'
        });
        setSocket(connectSocket());
        setQuill(q);
        q.setContents(documentContent);
        setCursor(q.getModule("cursors"));
        cursorState.current = {
            isAICalled: "not_started_writing",
            cursorIndex: q.getLength(),
            lastMoved: new Date()
        }
    }, []);

    const handleNewUserConnectionServerToClient = args => {
        toast(`${args.user.firstName + args.user.lastName} (${args.user.email}) joined`);
    }
    
    const handleDisconnectingServerToClient = args => {
        toast(`${args.user.firstName + args.user.lastName} (${args.user.email}) disconnected`);
        cursor.removeCursor(args.socketId)
    }

    const handleEditorSelectionChange = (range, _, source) => {
        socket.emit("editorSelectionChangeClientToServer", {
            range, user: appContext.user, documentId
        });
    }

    const handleEditorOnTextChange = (delta, _, source) => {
        if(source == 'api')return;
        // aiSuggestion.current = "";
        
        cursorState.current = {
            cursorIndex: quill?.getSelection().index,
            lastMoved: new Date(),
            isAICalled: "not_called"
        }
        socket.emit('textChangeClientToServer', {
            delta,
            documentId,
            content: quill?.getContents()
        })   
    }

    const handleEditorSelectionChangeServerToClient = args=>{
        cursor.createCursor(args.socketId, args.user.firstName + args.user.lastName, args.user.color ? args.user.color : 'black');
        cursor.moveCursor(args.socketId, args.range); // <== cursor data from previous step
        cursor.toggleFlag(args.socketId, true);
    }

    const handleTextChangeServerToClient = args => {
        quill?.updateContents(args.delta);
    }

    useEffect(() => {
        if(!quill || !socket || !appContext || !appContext.user)return;

        socket.emit("userConnectedClientToServer", {
            documentId, 
            user: appContext.user
        })
        socket.on("userConnectedServerToClient", handleNewUserConnectionServerToClient);
        socket.on("disconnectingServerToClient", handleDisconnectingServerToClient);
        quill.on("text-change", handleEditorOnTextChange)
        socket.on("textChangeServerToClient", handleTextChangeServerToClient)
        quill.on("selection-change", handleEditorSelectionChange)
        socket.on("editorSelectionChangeServerToClient", handleEditorSelectionChangeServerToClient);
        const interval = setInterval(async()=> {
            const currentDate = new Date();
            const previousDate = cursorState.current.lastMoved;
            if(cursorState.current && quill && quill.getLength() - 1 && currentDate.getTime() - cursorState.current.lastMoved.getTime() >= 3000  && cursorState.current.isAICalled == "not_called"){
               
                cursorState.current.isAICalled = "in_progress";
               
                const response = await getAISuggestion(quill.getText().substring(0, cursorState.current.cursorIndex));
                // const response = {
                //     status: true,
                //     response: "AI Response"
                // }
                if(response.status && previousDate == cursorState.current.lastMoved){
                    if('response' in response && response.response){
                        quill.insertText(cursorState.current.cursorIndex, response.response, "user");
                        quill.setSelection(cursorState.current.cursorIndex + response.response.length)
                    }
                }

                cursorState.current.isAICalled = "called"
            }
        }, 2000)
        
        return () => {
            socket.emit("disconnectingClientToServer", {
                documentId,
                user: appContext.user
            })
            socket.on("disconnectingServerToClient", handleDisconnectingServerToClient);
            socket.off("userConnectedServerToClient", handleNewUserConnectionServerToClient);
            socket.off("textChangeServerToClient", handleTextChangeServerToClient)
            quill.off("text-change", handleEditorOnTextChange)
            socket.off("editorSelectionChangeServerToClient", handleEditorSelectionChangeServerToClient);
            clearInterval(interval);
            socket.disconnect();
        };
    }, [socket, quill]);

    const handleShareDocumentClick = () => {
        setShowModal(true);
        selectedDocument.current.documentId = documentId;
        selectedDocument.current.documentTitle = documentTitle ;
    }

    return(
        <div className="flex justify-center items-center flex-col">
            {
                showModal && <ShareDialogBox selectedDocument={selectedDocument} setShowModal={setShowModal}/>
            }
            
            <div className="pl-3 mb-3 mt-3 pr-5 w-[100%] flex flex-wrap items-center justify-between">
                <div className="mb-2 text-2xl font-semibold">
                    Document Title
                </div>
                <div className="flex justify-between items-center">
                    <Link className="pr-3 underline text-slate-400" to = "/allDocuments">Home</Link>
                    <button onClick = {() => {handleShareDocumentClick()}} className="bg-blue-300 hover:bg-blue-400 p-1 pl-5 pr-5 text-lg font-semibold rounded-3xl">Share</button>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <div id="container" className="flex flex-col justify-center items-center" ref = {wrapperRef}>
                
                </div>
            </div>
        </div>
    )
}