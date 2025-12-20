import { useState, useEffect } from "react";
import appService from "../../../../services/appService";

export const useApps = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApps = () => {
        setLoading(true);
        appService
            .getApps()
            .then((res) => {
                setApps(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load apps");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const addApp = async (appName) => {
        try {
            const response = await appService.createApp(appName);
            if (response.status === 201 || response.status === 200) {
                setApps((prev) => [...prev, response.data]);
                return { success: true, data: response.data };
            } else {
                return { success: false, error: "Unexpected response status" };
            }
        } catch (err) {
            console.error("Create failed:", err);
            return {
                success: false,
                error: err.response
                    ? `Create failed: ${err.response.status}`
                    : "Network error",
            };
        }
    };

    const removeApp = async (appId) => {
        try {
            const response = await appService.deleteApp(appId);
            if (response.status === 200 || response.status === 204) {
                setApps((prev) => prev.filter((app) => app.id !== appId));
                return { success: true };
            } else {
                return { success: false, error: "Unexpected response status" };
            }
        } catch (err) {
            console.error("Delete failed:", err);
            return {
                success: false,
                error: err.response
                    ? `Delete failed: ${err.response.status}`
                    : "Network error",
            };
        }
    };

    return { apps, loading, error, addApp, removeApp };
};
