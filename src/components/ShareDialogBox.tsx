import ShowShareModalContent from "./ShowShareModalContent";

type Props = {
  selectedDocument: React.MutableRefObject<{
    documentId: string;
    documentTitle: string;
  }>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ShareDialogBox({
  selectedDocument,
  setShowModal,
}: Props) {
  const handleCloseModal = () => {
    selectedDocument.current.documentId = "";
    selectedDocument.current.documentTitle = "";
    setShowModal(false);
  };
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center items-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-2xl w-screen bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 sm:px-8">
              <h2 className="text-xl font-bold text-white" id="modal-title">
                Share Document
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Manage who can access this document
              </p>
            </div>

            {/* Content Section */}
            <div className="px-6 py-6 sm:px-8">
              <ShowShareModalContent
                documentId={selectedDocument.current.documentId}
                documentTitle={selectedDocument.current.documentTitle}
              />
            </div>

            {/* Footer Section */}
            <div className="bg-slate-50 px-6 py-4 sm:px-8 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                className="inline-flex justify-center items-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 active:scale-95"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
