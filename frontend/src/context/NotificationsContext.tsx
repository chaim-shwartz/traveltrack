import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./UserContext"; // ✅ We will use UserContext to get the userId
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
    const { user } = useUser(); // ✅ Getting the user from the Context

    useEffect(() => {
        const socket: Socket = io("http://localhost:5005", { transports: ["websocket", "polling"] });

        socket.on("connect", () => {
            console.log("🟢 Connected to notifications WebSocket with ID:", socket.id);

            if (user?._id) { // ✅ Checking if there is a logged-in user and sending the ID to the server
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
            setNotifications((prev) => [notification, ...prev]);
        });

        (async () => {
            try {
                const response = await axios.get('http://localhost:5005/api/notifications', {
                    withCredentials: true,
                });
                setNotifications((prev) => [...prev, ...response.data]);
                // setNotifications(response.data); // Uncomment this line if you want to update notifications
            } catch (error) {
                console.error("Failed to fetch old notifications:", error);
            }
        })()




        return () => {
            socket.disconnect();
        };
    }, [user]); // ✅ When the user changes, the connection will update accordingly

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
