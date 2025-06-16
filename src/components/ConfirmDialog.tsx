import React from "react";

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
        <p className="text-gray-800 text-lg mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
