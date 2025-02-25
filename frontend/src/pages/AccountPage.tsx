import React, { useEffect, useRef, useState } from 'react';
// import { useLanguage } from '../context/LanguageContext';
import useTranslation from '../utils/useTranslation';
import { updateUserDetails } from '../api/users';
import { PhotoIcon } from '@heroicons/react/16/solid';
import { useUser } from '../context/UserContext';
import { User } from '../types/userTypes';
import Input from '../components/Input';
import { AnimatePresence, motion } from 'framer-motion';

export default function AccountPage() {
    const { user } = useUser();

    // const [nickname, setNickname] = useState(user.nickname || '');
    const [userDetails, setUserDetails] = useState<User>(user);
    // const { language, setLanguage } = useLanguage();
    const [editMode, setEditMode] = useState(false);
    const t = useTranslation();
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false); // To manage save button state
    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isImageOpen, setIsImageOpen] = useState(false);

    const imageRef = useRef<HTMLDivElement | null>(null);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

    const handleOpenImage = () => {
        if (!editMode) {
            if (imageRef.current) {
                const rect = imageRef.current.getBoundingClientRect();
                setImagePosition({
                    x: rect.left + rect.width / 2, // מרכז התמונה
                    y: rect.top + rect.height / 2, // מרכז התמונה
                });
            }
            setIsImageOpen(true);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setLanguageMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {            
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [languageMenuOpen]);
    const handleBtnClick = async () => {
        if (!editMode) {
            setEditMode(true)
        }
        else {
            setLoading(true); // Indicate loading state
            try {
                // await Promise.all([
                await updateUserDetails(userDetails)
                // ]);
                alert(t.saveSuccess); // Notify user
                // if (user.preferredLanguage !== userDetails.preferredLanguage) {
                window.location.reload()
                // }
                setEditMode(false);
            } catch (error) {
                console.error('Failed to save changes:', error);
                alert(t.saveError); // Notify user of failure
            } finally {
                setLoading(false); // Reset loading state
            }
        }
    };
    const handleCancelClick = async () => {
        setEditMode(false)
        setUserDetails(user)
        setLanguageMenuOpen(false)
    };

    const handleLanguageChange = (lang: 'en' | 'he') => {
        setUserDetails({ ...userDetails, preferredLanguage: lang })
        setLanguageMenuOpen(false);
    };

    const languages = [
        { value: 'en', label: 'English' },
        { value: 'he', label: 'עברית' },
    ];

    return (

        <span>
            {loading && <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-center items-center h-screen w-screen opacity-50 bg-black">
                <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>}
            <AnimatePresence>
                {isImageOpen && (
                    <motion.div
                        className="fixed h-screen inset-0 z-50 bg-black/80 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsImageOpen(false)} // Close when clicking on background
                    >
                        <motion.img
                            src={userDetails.profilePic}
                            alt={user.name}
                            className="h-auto max-h-screen rounded-lg shadow-lg cursor-zoom-out"
                            // initial={{ scale: 0.1, x: user?.preferredLanguage === "he" ? -350 : 350 }}
                            // animate={{ scale: 1, x: 0 }}
                            // exit={{ scale: 0.1, x: user?.preferredLanguage === "he" ? -350 : 350 }}
                            // transition={{ duration: 0.3 }}
                            initial={{
                                scale: 0.1,
                                x: imagePosition.x - window.innerWidth / 2, // מיקום יחסי למסך
                                y: imagePosition.y - window.innerHeight / 2, // מיקום יחסי למסך
                            }}
                            animate={{ scale: 1, x: 0, y: 0 }}
                            exit={{
                                scale: 0.1,
                                x: imagePosition.x - window.innerWidth / 2,
                                y: imagePosition.y - window.innerHeight / 2,
                            }}
                            transition={{ duration: 0.3 }}
                        // onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
                        />
                    </motion.div>

                )}
            </AnimatePresence>
            <div className="flex flex-col items-center lg:px-12 sm:px-4 animate__animated animate__fadeInUp">
                <h1 className="text-2xl font-bold mb-6">{t.accountSettings}</h1>
                <div className="container mx-auto p-4 rtl:text-right ltr:text-left">
                    <div className="grid lg:grid-cols-2 sm:grid-cols-1 lg:gap-20 gap-8 items-center">
                        {/* Profile Picture Section */}
                        <div className="text-center relative lg:order-last">
                            <label
                                htmlFor="profilePicUpload"
                                className={`${editMode ? 'cursor-pointer' : 'cursor-zoom-in'}`}
                                onClick={handleOpenImage} // Open enlarged view when not in edit mode
                            >
                                <div
                                    ref={imageRef}
                                    className="relative w-full max-w-xs mx-auto aspect-square rounded-full overflow-hidden border-2 border-primary-400 bg-black"
                                >
                                    <img
                                        src={userDetails.profilePic}
                                        alt={user.name}
                                        className={`w-full h-full object-cover ${editMode && 'opacity-60'} transition duration-150`}
                                    />
                                    {editMode && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                            <span className="text-white text-2xl">✎</span>
                                        </div>
                                    )}
                                </div>
                            </label>
                            <input
                                disabled={!editMode}
                                id="profilePicUpload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            setUserDetails({ ...userDetails, profilePic: reader.result as string });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <div className="text-xl font-bold shadow-xl rounded-2xl mt-4">{user.name}</div>
                        </div>

                        {/* User Details Section */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block font-medium">{t.email}</label>
                                <Input
                                    type="text"
                                    disabled
                                    value={user.email}
                                />
                            </div>
                            <div>
                                <label className="block font-medium">{t.nickname}</label>
                                <Input
                                    disabled={!editMode}
                                    type="text"
                                    value={userDetails.nickname}
                                    onChange={(e) => setUserDetails({ ...userDetails, nickname: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <label className="block font-medium">{t.language}</label>
                                <button
                                    ref={buttonRef}
                                    disabled={!editMode}
                                    className="w-full px-4 py-2 border shadow rounded-lg focus:outline-none ring-0 ring-primary focus:ring-2 focus:ring-primary-400 hover:ring-1 transform ease-in-out duration-150 disabled:bg-gray-50 disabled:ring-0 rtl:text-right ltr:text-left"
                                    onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                                >
                                    {languages.find((l) => l.value === userDetails.preferredLanguage)?.label}
                                </button>
                                {languageMenuOpen && (
                                    <div
                                        ref={menuRef}
                                        className="absolute top-full mt-2 bg-white shadow-lg rounded-lg w-full z-10"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.value}
                                                onClick={() => handleLanguageChange(lang.value as 'en' | 'he')}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleBtnClick}
                                    disabled={loading}
                                    className={`bg-secondary text-white px-6 py-2 rounded-lg hover:scale-105 hover:shadow-lg hover:bg-secondary-400 transition duration-150 ${loading ? 'opacity-50 cursor-progress' : ''
                                        }`}
                                >
                                    {!editMode ? t.edit : loading ? t.saving : t.saveChanges}
                                </button>
                                {editMode && (
                                    <button
                                        onClick={handleCancelClick}
                                        disabled={loading}
                                        className={`bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:scale-105 hover:shadow-lg hover:bg-gray-400 transition duration-150 ${loading ? 'opacity-50 cursor-progress' : ''
                                            }`}
                                    >
                                        {t.cancel}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </span>
    );
}