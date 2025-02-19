import React from 'react';
import LoginButton from '../components/LoginButton'; // שמירה על הכפתור להתחברות עם Google
import useTranslation from '../utils/useTranslation';
import Input from '../components/Input';

export default function LoginPage() {
    const t = useTranslation();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white ring-0 ring-primary hover:ring-1 bg-opacity-70 backdrop-blur-md rounded-lg shadow-xl p-8 w-full max-w-md hover:shadow-2xl duration-150 animate__animated animate__fadeInUp">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-text">{t.loginTitle}</h1>
                    <p className="text-text_secondary mt-2">{t.loginSubtitle}</p>
                </div>
                {/* <form className="space-y-4">
                    <div>
                        <label className="block text-text font-medium mb-2">{t.email}</label>
                        <Input
                            type="email"
                            placeholder={t.emailPlaceholder}
                        />
                    </div>
                    <div>
                        <label className="block text-text font-medium mb-2">{t.password}</label>
                        <Input
                            type="password"
                            placeholder={t.passwordPlaceholder}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary-500 text-white py-2 rounded-lg shadow hover:bg-primary-600 transition"
                    >
                        {t.login}
                    </button>
                </form> */}
                <div className="mt-6 text-center">
                    <LoginButton /> {/* כפתור התחברות עם Google */}
                </div>
                {/* <p className="text-text_secondary text-center mt-6">
                    {t.noAccount}{' '}
                    <a href="/register" className="text-primary-800 hover:underline">
                        {t.registerHere}
                    </a>
                </p> */}
            </div>
        </div>
    );
}
