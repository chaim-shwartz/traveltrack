import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import TripsPage from './pages/TripsPage';
import AccountPage from './pages/AccountPage';
import NewTripPage from './pages/NewTripPage';
import TripDetailsPage from './pages/TripDetailsPage';
import Layout from './components/Layout';
import { fetchUserDetails } from './api/users';
import { useUser } from './context/UserContext';
import Logo from './assets/logo.svg'; // לוגו


export default function App() {
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails()
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center h-screen items-center">
                <div className="inset-0 flex items-center justify-center">
                    <img className='animate-pulse w-56 h-56' src={Logo} alt="" />
                </div>
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    // פונקציה לעמודים מוגנים
    const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
        if (!user && location.pathname !== "/") {
            return <Navigate to="/" />;
        }

        return <Layout user={user}>{children}</Layout>;
    };

    return (
        <LanguageProvider user={user}>
            <Router>
                <Routes>
                    {/* עמודים ציבוריים */}
                    <Route path="/" element={<PrivateRoute><WelcomePage /></PrivateRoute>} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* עמודים מוגנים */}
                    <Route
                        path="/trips"
                        element={
                            <PrivateRoute>
                                <TripsPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/trips/new"
                        element={
                            <PrivateRoute>
                                <NewTripPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/trips/:id"
                        element={
                            <PrivateRoute>
                                <TripDetailsPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/account"
                        element={
                            <PrivateRoute>
                                <AccountPage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </LanguageProvider>
    );
}
