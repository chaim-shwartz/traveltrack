import React from 'react';
import useTranslation from '../utils/useTranslation';
import googleIcon from '../assets/google-icon.svg'

export default function LoginButton() {
    const t = useTranslation();

    const handleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };

    return (
        <button
            className="w-full bg-secondary text-white py-2 px-4 rounded-lg shadow hover:bg-secondary-400 duration-150 ease-in-out transition flex items-center justify-center"
            onClick={handleLogin}
        >
            {t.loginWithGoogle}
            <img
                src={googleIcon}
                alt="Google"
                className="w-6 h-6 ml-2 rtl:mr-2"
            />
        </button>
    );
}
