export interface User {
    _id: number;
    email: string;
    name: string;
    nickname?: string;
    profilePic: string;
    preferredLanguage: 'en' | 'he';
    createdAt: string;
    updatedAt: string;
}