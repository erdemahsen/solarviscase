import { useState, useEffect, useRef } from 'react'
import axios from "axios";
import PageCard from './components/PageCard';

const baseURL = "http://127.0.0.1:8000/" 

function AppRoute() {
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [appConfig, setAppConfig] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    
    // 1. Create a single state object for all inputs
    const [formData, setFormData] = useState({});
    const [backendResults, setBackendResults] = useState(null);
    const hasFetchedConfig = useRef(false);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    function prevPage() {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1)
        }
    }

    async function performCalculations() {
        
        setIsLoading(true);
        try {
            const payload = {
                formData: formData,
                //calculations: pageCalculations not gonna be needed
            };

            console.log(currentPageConfig)
            const app_id = currentPageConfig.config_id
            const page_id = currentPageConfig.id

            const response = await axios.post(`${baseURL}api/app/${app_id}/pages/${page_id}/calculate`, payload);
            console.log("Results received:", response.data);
            // backend results is a pretty cool dictionary, it only updates the related calculations because thats what we get from the backend
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
            setIsLoading(false);
        }
    }

    // UPDATED: Calculation Trigger Logic
    useEffect(() => {
        if (!appConfig) return;
        const currentPageConfig = appConfig.pages[currentPageIndex];
        const pageCalculations = currentPageConfig?.calculations || [];

        if (pageCalculations.length === 0) return;
        // UNCOMMENT ABOVE LATER

        // Debounce Logic: Wait 500ms after user stops typing before calling API
        const delayDebounceFn = setTimeout(() => {
            performCalculations();
        }, 500);

        // Cleanup function cancels the timer if formData changes again quickly
        return () => clearTimeout(delayDebounceFn);

    }, [currentPageIndex, appConfig, formData]); // Triggers on Page Change OR Form Change

    async function nextPage() {
        const currentPageConfig = appConfig.pages[currentPageIndex];
        if (!currentPageConfig.is_final_page) {
            if (currentPageIndex < appConfig.pages.length - 1) {
                setCurrentPageIndex(prev => prev + 1);
            }
        }
    }

    useEffect(() => {
        if (hasFetchedConfig.current) return;
        hasFetchedConfig.current = true;
        async function fetchConfig() {
            try {
                // Don't set global isLoading here, or the page flashes
                const res = await axios.get(`${baseURL}api/app/1/`); // we are only fetching app 1 -> if I want I can with ease add other apps with small changes to the code
                if (res.status != 200) throw new Error("Failed to fetch config");
                setAppConfig(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchConfig();
    }, []);

    if (!appConfig) {
        return <p>Loading the app configuration...</p>
    }

    const currentPageConfig = appConfig.pages[currentPageIndex];
    const isResultPage = currentPageConfig.is_final_page;

    // REMOVED: if (isLoading) return <p>Calculating...</p>; 
    // keeping that would destroy the form while typing.

    return (
        <div>
            {/* Optional: Show a subtle loader somewhere, but keep the page rendered */}
            {isLoading && <div style={{position: 'fixed', top:0, right:0, background:'yellow'}}>Calculating...</div>}
            
            <PageCard
                pageConfig={currentPageConfig}
                results={backendResults}
                formData={formData}
                handleInputChange={handleInputChange}
                prevPage={prevPage}
                nextPage={nextPage}
                isResultPage={isResultPage}
            />

            <button onClick={() => console.log("backend results are : ",backendResults)}>See backend results array</button>
        </div>
    )
}

export default AppRoute