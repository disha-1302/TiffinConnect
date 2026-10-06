export default function CustomModal({ isOpen, title, message, onClose, isSuccess }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/45 backdrop-blur-[2px] animate-fade" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[400px] bg-card border border-line rounded-[8px] shadow-[0_28px_70px_-28px_rgba(25,21,18,0.5)] animate-rise overflow-hidden"
      >
        <div className={`h-[3px] w-full ${isSuccess ? 'bg-herb' : 'bg-tomato'}`} />
        <div className="px-7 pt-6 pb-7">
          <div className="flex items-start gap-3.5">
            <span
              className={`mt-0.5 shrink-0 w-7 h-7 rounded-full grid place-items-center border ${
                isSuccess ? 'border-herb text-herb bg-herb-50' : 'border-tomato text-tomato bg-tomato-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isSuccess ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </span>
            <div className="min-w-0">
              <h2 className="display-3 text-[1.25rem]">{title}</h2>
              <p className="prose-sm mt-2 whitespace-pre-wrap">{message}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-dark btn-block mt-6">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
