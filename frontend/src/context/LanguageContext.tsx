import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/userTypes';

// Define the type of languages
type Language = 'en' | 'he';

// Create the Language Context
const LanguageContext = createContext<{
    language: Language;
    setLanguage: (lang: Language) => void;
}>({
    language: 'en', // Default language
    setLanguage: () => { }, // Default setLanguage function
});

// Define the LanguageProvider
export const LanguageProvider = ({ children, user }: { children: ReactNode; user: User | null }) => {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        if (user?.preferredLanguage) {
            setLanguage(user.preferredLanguage);
            document.documentElement.lang = user.preferredLanguage;
            document.documentElement.dir = user.preferredLanguage === 'he' ? 'rtl' : 'ltr';
        }
    }, [user]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Export the hook to use the context
export const useLanguage = () => useContext(LanguageContext);
