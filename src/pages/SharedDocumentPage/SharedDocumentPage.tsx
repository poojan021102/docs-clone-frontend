import { useEffect } from "react"
import useAppContext from "../../context/useAppContext"
import { useNavigate } from "react-router-dom";
import ShowTable from "./components/ShowTable";
import Loading from "../AllDocumentsPage/components/Loading";

export default function SharedDocumentPage() {
    const { getAppContext } = useAppContext();
    const currentContext = getAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if(currentContext.loggedInStatus === "logout"){
            navigate("/");
        }
    }, [currentContext]);

    
    return(
        <div className="mt-2">
            {
                currentContext.loggedInStatus === "inProgress" ? <Loading message = "Fetching User account"/> : <ShowTable/>
            }
            
        </div>
    )
}