import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./UserContext"; // ✅ נשתמש ב-UserContext כדי לקבל את ה-userId
import axios from "axios";

interface Notification {
    user_id: string;
    message: string;
    trip_id: string;
}

interface NotificationsContextType {
    notifications: Notification[];
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user } = useUser(); // ✅ מקבלים את המשתמש מה-Context

    useEffect(() => {
        const socket: Socket = io("http://localhost:5005", { transports: ["websocket", "polling"] });

        socket.on("connect", () => {
            console.log("🟢 Connected to notifications WebSocket with ID:", socket.id);
            
            if (user?._id) { // ✅ בודקים אם יש user מחובר ושולחים את ה-ID לשרת
                console.log(`📡 Registering user ${user._id} to WebSocket`);
                socket.emit("register", user._id);
            } else {
                console.log("⚠️ No user found in UserContext");
            }
        });

        socket.on("disconnect", () => {
            console.log("🔴 Disconnected from WebSocket");
        });

        socket.on("new-notification", (notification: Notification) => {
            console.log("🔔 New notification received:", notification);
            setNotifications((prev) => [...prev, notification]);
        });

        const fetchOldNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:5005/api/notifications', {
                    withCredentials: true,
                });
                console.log(response.data);
                // setNotifications(response.data); // Uncomment this line if you want to update notifications
            } catch (error) {
                console.error("Failed to fetch old notifications:", error);
            }
        };

        fetchOldNotifications();
        
        return () => {
            socket.disconnect();
        };
    }, [user]); // ✅ כאשר ה-user משתנה, החיבור יתעדכן בהתאם

    return (
        <NotificationsContext.Provider value={{ notifications }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = (): NotificationsContextType => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationsProvider");
    }
    return context;
};