import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment, type ReactNode } from "react";

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  widthClass?: string;
  reset?: () => void;
  onAgree?: () => void;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  reset,
  onAgree,
  widthClass = "md:w-150 w-full",
}: CustomDialogProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-110">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={reset}
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4 z-120 overflow-y-scroll">
          <Dialog.Panel
            className={`bg-white p-6 rounded-xl shadow-lg ${widthClass} my-auto relative`}
          >
            <button
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 cursor-pointer md:hidden"
              onClick={onClose}
            >
              <X />
            </button>
            {title && (
              <Dialog.Title className="text-lg font-semibold">
                {title}
              </Dialog.Title>
            )}
            {description && (
              <Dialog.Description className="text-gray-600 mb-4">
                {description}
              </Dialog.Description>
            )}

            {children}

            {onAgree && (
              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 cursor-pointer rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  onClick={onAgree}
                  className="px-4 py-2 cursor-pointer rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Xác nhận
                </button>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
