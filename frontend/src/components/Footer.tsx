import React from 'react';
import useTranslation from '../utils/useTranslation';
import Logo from '../assets/logo.svg';

export default function Footer() {
    const t = useTranslation();

    return (
        <footer className="bg-gradient-to-t from-gray-900 to-gray-800 text-gray-300 py-12 animate__animated animate__fadeInUp">
            <div className="container mx-auto text-center">
                {/* לוגו ותיאור */}
                <div className="flex flex-col items-center mb-8">
                    <img src={Logo} alt="Logo" className="w-16 h-16 mb-4" />
                    <p className="text-sm max-w-md">
                        {t.footerDescription}
                    </p>
                </div>

                {/* קישורים מהירים */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-100">{t.links}</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/trips" className="hover:text-indigo-400 transition">
                                    {t.trips}
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="hover:text-indigo-400 transition">
                                    {t.about}
                                </a>
                            </li>
                            <li>
                                <a href="/account" className="hover:text-indigo-400 transition">
                                    {t.accountSettings}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* רשתות חברתיות */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-100">{t.followUs}</h3>
                        <div className="flex justify-center space-x-6 rtl:space-x-reverse">
                            <a
                                href="https://www.facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-400 transition"
                            >
                                <i className="fab fa-facebook-f text-lg"></i>
                            </a>
                            <a
                                href="https://www.twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-400 transition"
                            >
                                <i className="fab fa-twitter text-lg"></i>
                            </a>
                            <a
                                href="https://www.instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-400 transition"
                            >
                                <i className="fab fa-instagram text-lg"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* זכויות יוצרים */}
                <div className="text-sm text-gray-500 border-t border-gray-700 pt-4">
                    &copy; {new Date().getFullYear()} {t.appName}. {t.allRightsReserved}.
                </div>
            </div>
        </footer>
    );
}
