import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import { User } from '../types/userTypes';

export default function Layout({ children, user }: { children: React.ReactNode; user: User | null }) {
    const navigate = useNavigate();

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate]);

    return (
        <div className="flex flex-col min-h-screen ">
            <Navbar user={user} />
            <main className="flex-grow container mx-auto p-8">{children}</main>
            <Footer />
        </div>
    );
}
