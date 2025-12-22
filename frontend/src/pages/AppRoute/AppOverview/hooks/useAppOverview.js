import { useState, useEffect } from 'react';
import appService from '../../../../services/appService';

export function useAppOverview(appId) {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [appConfig, setAppConfig] = useState(null);
    const [loading, setLoading] = useState(false);

    // 1. Create a single state object for all inputs
    const [formData, setFormData] = useState({});
    const [backendResults, setBackendResults] = useState(null);

    const handleInputChange = (name, value) => {
        setLoading(true);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    function prevPage() {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1);
        }
    }

    async function nextPage() {
        if (!appConfig) return;
        if (currentPageIndex < appConfig.pages.length - 1) {
            setCurrentPageIndex(prev => prev + 1);
        }
    }

    async function performCalculations() {
        if (!appConfig) return;
        const currentPageConfig = appConfig.pages[currentPageIndex];

        setLoading(true);
        try {
            const payload = {
                formData: formData,
            };

            const app_id = currentPageConfig.config_id;
            const page_id = currentPageConfig.id;

            const response = await appService.calculatePage(app_id, page_id, payload);
            console.log("Results received:", response.data);

            setBackendResults(prev => {
                const current = prev || [];
                const newResults = response.data.results || [];
                const mergedMap = new Map(current.map(item => [item.key, item]));
                newResults.forEach(item => mergedMap.set(item.key, item));
                return Array.from(mergedMap.values());
            });

        } catch (error) {
            console.error("Calculation failed", error);
        } finally {
            setLoading(false);
        }
    }

    // Calculation Trigger Logic
    useEffect(() => {
        if (!appConfig) return;
        const currentPageConfig = appConfig.pages[currentPageIndex];
        const pageCalculations = currentPageConfig?.calculations || [];

        if (pageCalculations.length === 0) return;

        // Debounce Logic: Wait 500ms after user stops typing before calling API
        const delayDebounceFn = setTimeout(() => {
            performCalculations();
        }, 500);

        return () => clearTimeout(delayDebounceFn);

    }, [currentPageIndex, appConfig, formData]);

    // Fetch Config
    useEffect(() => {
        // Reset state when appId changes
        setAppConfig(null);
        setCurrentPageIndex(0);
        setFormData({});
        setBackendResults(null);

        if (!appId) return;

        async function fetchConfig() {
            try {
                // Don't set global loading here, or the page flashes
                const res = await appService.getApp(appId);
                if (res.status != 200) throw new Error("Failed to fetch config");
                setAppConfig(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchConfig();
    }, [appId]);

    return {
        appConfig,
        loading,
        currentPageIndex,
        formData,
        backendResults,
        handleInputChange,
        prevPage,
        nextPage
    };
}
