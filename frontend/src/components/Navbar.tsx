import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTranslation from '../utils/useTranslation';
import { useNotifications } from '../context/NotificationsContext';
import Logo from '../assets/logo.svg';
import { useLanguage } from '../context/LanguageContext';
import "animate.css"
import { User } from '../types/userTypes';

export default function Navbar({ user }: { user: User | null }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const notifRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const notifButtonRef = useRef<HTMLButtonElement | null>(null);
    const t = useTranslation();
    const { language, setLanguage } = useLanguage();
    const { notifications } = useNotifications();
    const unreadCount = notifications.length;
    const navigate = useNavigate();

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

            if (
                notifRef.current &&
                !notifRef.current.contains(event.target as Node) &&
                notifButtonRef.current &&
                !notifButtonRef.current.contains(event.target as Node)
            ) {
                setNotifOpen(false);
            }
        };

        const handleResize = () => adjustMenuPosition();

        document.addEventListener('mousedown', handleOutsideClick);
        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            window.removeEventListener('resize', handleResize);
        };
    }, [menuOpen, notifOpen]);

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

    const handleNotificationClick = (tripId: string) => {
        navigate(`/trips/${tripId}`);
        setNotifOpen(false);
    };

    return (
        <nav className="bg-background bg-opacity-50 backdrop-blur-lg shadow-lg sticky top-0 z-10 rounded-b-lg animate__animated animate__fadeInDown">
            <div className="container mx-auto px-6 py-2 flex justify-between items-center">


                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="w-16 h-16 hover:scale-110 duration-150"
                    />
                    <h1 className="text-2xl font-bold text-text hover:scale-110 duration-150">
                        <Link to="/" className="hover:text-primary-900 duration-150">
                            {t.title}
                        </Link>
                    </h1>
                </div>

                <div className="flex items-center space-x-6 rtl:space-x-reverse">
                    {!user && (
                        <>
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
                            <Link
                                to="/trips"
                                className="text-lg text-text hover:text-primary-900 transition hover:scale-110 duration-150"
                            >
                                {t.trips}
                            </Link>

                            <div className="relative">
                                <button
                                    ref={notifButtonRef}
                                    onClick={() => setNotifOpen(!notifOpen)}
                                    className="material-symbols-outlined relative text-2xl text-text hover:text-primary-900 transition items-center hover:scale-110 duration-150"
                                >
                                    notifications
                                    {unreadCount > 0 && (
                                        <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px]  rounded-full px-1 h-5 flex items-center justify-center shadow-md transform transition duration-200">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </div>
                                    )}
                                </button>

                                {notifOpen && (
                                    <div
                                        ref={notifRef}
                                        className="absolute max-h-64 overflow-auto ltr:right-0 rtl:left-0 text-center mt-2 w-64 bg-white shadow-lg rounded-lg p-2 border border-gray-200 animate__animated animate__fadeIn"
                                    >
                                        {notifications.length > 0 ? (
                                            notifications.map((notif, index) => (
                                                <button
                                                    key={index}
                                                    className="px-4 py-2 border-b text-gray-800 hover:bg-primary-50 hover:text-primary-900 rounded transition"
                                                    onClick={() => handleNotificationClick(notif.trip_id)}
                                                >
                                                    {notif.message}
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 px-4 py-2">{t.noNewNotifications}</p>
                                        )}
                                    </div>
                                )}
                            </div>

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
                                        className="absolute bg-gradient-to-br from-white to-gray-100/90 backdrop-blur-md text-gray-800 shadow-xl rounded-lg p-4 w-64 right-0 mt-2 border border-gray-200 animate__animated animate__fadeIn"
                                    >
                                        <Link to="/account" className="block px-4 py-2 text-gray-700 font-medium hover:bg-primary-50 hover:text-primary-900 rounded transition">
                                            {t.accountSettings}
                                        </Link>
                                        <Link to="/about" className="block px-4 py-2 text-gray-700 font-medium hover:bg-primary-50 hover:text-primary-900 rounded transition">
                                            {t.about}
                                        </Link>
                                        <button className="block w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-red-100 hover:text-red-600 rounded transition" onClick={handleLogout}>
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
