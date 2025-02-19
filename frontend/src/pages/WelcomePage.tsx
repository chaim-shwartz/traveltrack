import React from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '../utils/useTranslation';
import { useUser } from '../context/UserContext';

export default function WelcomePage() {
    const t = useTranslation();
    const { user } = useUser();
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-12 flex flex-col items-center">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-800 mb-6 drop-shadow-lg">
                        {t.welcomeTitle}
                    </h1>
                    <p className="text-lg text-gray-700 mb-8">{t.welcomeDescription}</p>
                    {user ? (
                        <div>
                            <Link
                                to="/trips"
                                className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition"
                            >
                                {t.goToTrips}
                            </Link>
                        </div>
                    ) : ( // הצגת כפתורי התחברות והרשמה אם המשתמש לא מחובר
                        <div className="space-x-4 rtl:space-x-reverse">
                            <Link
                                to="/login"
                                className="bg-secondary text-white px-6 py-3 rounded-lg shadow-md hover:bg-Secondary-400 transition"
                            >
                                {t.login}
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
                            >
                                {t.register}
                            </Link>
                        </div>
                    )}
                </div>

                {/* מידע נוסף */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {t.featureTitle1}
                        </h3>
                        <p className="text-gray-700">{t.featureDescription1}</p>
                    </div>
                    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {t.featureTitle2}
                        </h3>
                        <p className="text-gray-700">{t.featureDescription2}</p>
                    </div>
                    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {t.featureTitle3}
                        </h3>
                        <p className="text-gray-700">{t.featureDescription3}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
