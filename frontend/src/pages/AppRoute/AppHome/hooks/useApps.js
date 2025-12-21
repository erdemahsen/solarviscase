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



    return { apps, loading, error };
};
