import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Navbar from './components/Navbar.tsx';
import HomePage from './pages/homePage/HomePage.tsx';
import { useEffect } from "react";
import { CookiesProvider } from "react-cookie";
import useAppContext from "./context/useAppContext.tsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllDocuments from "./pages/AllDocumentsPage/AllDocuments.tsx";
import DocumentPage from "./pages/documentPage/documentPage.tsx";
import SharedDocumentPage from "./pages/SharedDocumentPage/SharedDocumentPage.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>
  },
  {
    path: "/allDocuments",
    element: <AllDocuments/>
  },
  {
    path: "/document/:documentId",
    element: <DocumentPage/>
  },
  {
    path: "/shared-with-me",
    element: <SharedDocumentPage/>
  }
]);

function App(): JSX.Element {
  
  const {checkLogin} = useAppContext();
  useEffect(() => {
    const temp = async (): Promise<void> => {
      await checkLogin();
    };
    temp();
  }, []);
  
  return (
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <Navbar/>
          <ToastContainer/>
          <RouterProvider router={router} />
      </CookiesProvider>
    )
}

export default App;
