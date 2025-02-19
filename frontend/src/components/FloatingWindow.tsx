// // import React from 'react';

// type Props = {
//     isOpen: boolean;
//     onClose: () => void;
//     title?: string;
//     children: React.ReactNode;
//     footer?: React.ReactNode;
// };




// import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

// export default function FloatingWindow({ isOpen, onClose, title, children, footer }: Props) {
//     //   const [open, setOpen] = useState(true)

//     return (
//         <Dialog open={isOpen} onClose={onClose} className="relative z-10">
//             <DialogBackdrop
//                 transition
//                 className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
//             />

//             <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//                 <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//                     <DialogPanel
//                         transition
//                         className="relative transform overflow-hidden rounded-lg hover:outline-primary hover:outline bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
//                     >
//                         <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
//                             <div className="sm:flex sm:items-start flex-col p-4">
//                                 <button
//                                     onClick={onClose}
//                                     className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
//                                 >
//                                     ✕
//                                 </button>


//                                 <DialogTitle as="h3" className="text-base font-semibold text-text">
//                                     {title}
//                                 </DialogTitle>
//                                 <div className="mt-2">

//                                     {/* Content */}
//                                     <div className="space-y-4">{children}</div>
//                                 </div>


//                                 {/* Footer */}
//                                 {footer && <div className="mt-6 flex justify-end space-x-4">{footer}</div>}
//                             </div>
//                         </div>
//                         {/* <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//               <button
//                 type="button"
//                 onClick={() => setOpen(false)}
//                 className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
//               >
//                 Deactivate
//               </button>
//               <button
//                 type="button"
//                 data-autofocus
//                 onClick={() => setOpen(false)}
//                 className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
//               >
//                 Cancel
//               </button>
//             </div> */}
//                     </DialogPanel>
//                 </div>
//             </div>
//         </Dialog>
//     )
// }






// import React from 'react';
// import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

// type Props = {
//     isOpen: boolean;
//     onClose: () => void;
//     title?: string;
//     children: React.ReactNode;
//     footer?: React.ReactNode;
// };

// export default function FloatingWindow({ isOpen, onClose, title, children, footer }: Props) {
//     return (
//         <Dialog open={isOpen} onClose={onClose} className={`relative z-10 animate__animated animate__fadeIn animate__faster`}>
//             <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

//             <div className="fixed inset-0 z-10 overflow-y-auto">
//                 <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
//                     <DialogPanel className="relative w-full max-w-lg overflow-hidden transform rounded-lg bg-white shadow-xl rtl:direction-rtl">
//                         {/* Close Button */}
//                         <button
//                             onClick={onClose}
//                             className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
//                         >
//                             ✕
//                         </button>

//                         {/* Header */}
//                         {title && (
//                             <DialogTitle
//                                 as="h3"
//                                 className="text-lg font-bold text-text_secondary px-6 py-4 border-b"
//                             >
//                                 {title}
//                             </DialogTitle>
//                         )}

//                         {/* Content */}
//                         <div className="p-6 space-y-4">{children}</div>

//                         {/* Footer */}
//                         {footer && (
//                             <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-4 rtl:space-x-reverse">
//                                 {footer}
//                             </div>
//                         )}
//                     </DialogPanel>
//                 </div>
//             </div>
//         </Dialog>
//     );
// }









import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
};

export default function FloatingWindow({ isOpen, onClose, title, children, footer }: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onClose={onClose} className="relative z-10">
                    {/* Backdrop */}
                    <motion.span
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, }}
                        transition={{ duration: 0.3 }}
                    >
                        <DialogBackdrop className="fixed inset-0 bg-gray-500/75" aria-hidden="true" />
                    </motion.span>

                    {/* Animated Dialog */}
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 200 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 200 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-full max-w-lg overflow-hidden transform rounded-lg bg-white shadow-xl rtl:direction-rtl"
                            >
                                <DialogPanel>
                                    {/* Close Button */}
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        ✕
                                    </button>
                                    {/* Header */}
                                    {title && (
                                        <DialogTitle
                                            as="h3"
                                            className="text-lg font-bold text-text_secondary px-6 py-4 border-b"
                                        >
                                            {title}
                                        </DialogTitle>
                                    )}
                                    {/* Content */}
                                    <div className="p-6 space-y-4">{children}</div>
                                    {/* Footer */}
                                    {footer && (
                                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-4 rtl:space-x-reverse">
                                            {footer}
                                        </div>
                                    )}
                                </DialogPanel>
                            </motion.div>
                        </div>
                    </div>
                </Dialog>
            )
            }
        </AnimatePresence >
    );
}