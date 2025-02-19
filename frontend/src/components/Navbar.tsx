import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '../utils/useTranslation';
import Logo from '../assets/logo.svg'; // לוגו
import { useLanguage } from '../context/LanguageContext'; // שימוש ב-Context
import "animate.css"
import { User } from '../types/userTypes';

export default function Navbar({ user }: { user: User | null }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const t = useTranslation();
    const { language, setLanguage } = useLanguage(); // שימוש בשפה ובהחלפה

    const adjustMenuPosition = () => {
        if (menuOpen && menuRef.current) {
            const menuRect = menuRef.current.getBoundingClientRect();
            const windowWidth = window.innerWidth;

            if (menuRect.right > windowWidth) {
                menuRef.current.style.left = `auto`;
                menuRef.current.style.right = `0`;
            } else if (menuRect.left < 0) {
                menuRef.current.style.left = `0`;
                menuRef.current.style.right = `auto`;
            }
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
                setMenuOpen(false);
            }
        };
        const handleResize = () => adjustMenuPosition();

        document.addEventListener('mousedown', handleOutsideClick);
        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            window.removeEventListener('resize', handleResize);
        };
    }, [menuOpen]);

    useEffect(() => {
        adjustMenuPosition();
    }, [menuOpen]);

    const toggleLanguage = () => {
        const newLanguage = language === 'en' ? 'he' : 'en';
        setLanguage(newLanguage);
        document.documentElement.lang = newLanguage;
        document.documentElement.dir = newLanguage === 'he' ? 'rtl' : 'ltr';
    };

    const handleLogout = () => {
        console.log('Logged out');
        window.location.href = '/login';
    };

    return (
        <nav className="bg-background bg-opacity-50 backdrop-blur-lg shadow-lg sticky top-0 z-10 rounded-b-lg animate__animated animate__fadeInDown">
            <div className="container mx-auto px-6 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-4 rtl:space-x-reverse ">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="w-16 h-16 hover:scale-110 duration-150"
                    />
                    <h1 className="text-2xl font-bold text-text hover:scale-110 duration-150">
                        <Link to="/" className="hover:text-primary-900 duration-150 ">
                            {t.title}
                        </Link>
                    </h1>
                </div>

                <div className="flex items-center space-x-6 rtl:space-x-reverse">
                    {!user && (
                        <>
                            {/* כפתור שינוי שפה */}
                            <button
                                onClick={toggleLanguage}
                                className="text-text text-lg hover:text-primary-900 transition hover:scale-110 duration-150"
                            >
                                {language === 'en' ? 'עברית' : 'English'}
                            </button>
                            <Link
                                to="/login"
                                className="bg-secondary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary-400 transition hover:scale-110 duration-150"
                            >
                                {t.login}
                            </Link>
                        </>
                    )}

                    {user && (
                        <>
                            {/* כפתור לנסיעות */}
                            <Link
                                to="/trips"
                                className="text-lg text-text hover:text-primary-900 transition hover:scale-110 duration-150"
                            >
                                {t.trips}
                            </Link>

                            <div className="relative">
                                <button
                                    ref={buttonRef}
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center space-x-2 rtl:space-x-reverse outline-none hover:scale-110 duration-150"
                                >
                                    <img
                                        src={user.profilePic}
                                        alt={user.name}
                                        className="rounded-full w-10 h-10 border-2 border-primary-400"
                                    />
                                    <span className="font-medium text-gray-700">
                                        {user.nickname || t.defaultUser}
                                    </span>
                                </button>

                                {menuOpen && (
                                    <div
                                        ref={menuRef}
                                        className="animate__animated animate__fadeIn animate__faster  absolute bg-gradient-to-br from-white to-gray-100/90 backdrop-blur-md text-gray-800 shadow-xl rounded-lg p-4 w-64 right-0 mt-2 border border-gray-200 hover:scale-110 duration-150"
                                        style={{
                                            top: '100%',
                                            zIndex: 1000,
                                        }}
                                    >
                                        <Link
                                            to="/account"
                                            className="block px-4 py-2 text-gray-700 font-medium hover:bg-primary-50 hover:text-primary-900 rounded transition rtl:text-right"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            {t.accountSettings}
                                        </Link>
                                        <Link
                                            to="/about"
                                            className="block px-4 py-2 text-gray-700 font-medium hover:bg-primary-50 hover:text-primary-900 rounded transition rtl:text-right"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            {t.about}
                                        </Link>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-red-100 hover:text-red-600 rounded transition rtl:text-right"
                                            onClick={handleLogout}
                                        >
                                            {t.logout}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
