import { useEffect, useState, useRef } from "react"
import useAppContext from "../../context/useAppContext"
import { useNavigate } from "react-router-dom";
import ShowTable from "./components/ShowTable";
import Loading from "./components/Loading";
import ShareDialogBox from "../../components/ShareDialogBox";

export default function AllDocuments() {
    const { getAppContext } = useAppContext();
    const currentContext = getAppContext();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState<boolean>(false);
    const selectedDocument = useRef({
        documentId: "",
        documentTitle: ""
    });

    useEffect(() => {
        if(currentContext.loggedInStatus === "logout"){
            navigate("/");
        }
    }, [currentContext]);

    // const shareButton = (documentId, documentTitle) => {
    //     return(

    //     )
    // }

    
    
    return(
        <div className="mt-2">
            {
                showModal && <ShareDialogBox
                    setShowModal = {setShowModal}
                    selectedDocument = {selectedDocument}
                />
            }
            {
                currentContext.loggedInStatus === "inProgress" ? <Loading message = "Fetching User account"/> : <ShowTable setShowModal={setShowModal} selectedDocument={selectedDocument}/>
            }
            
        </div>
    )
}