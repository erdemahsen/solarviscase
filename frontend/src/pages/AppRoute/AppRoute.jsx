import { useState, useEffect, useRef } from 'react'
import axios from "axios";
import InputPageCard from './components/InputPageCard';
import OutputPageCard from './components/OutputPageCard';




const baseURL = "http://127.0.0.1:8000/" // last / can be a bad practice, I may remove that


function AppRoute() {
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [appConfig, setAppConfig] = useState(null)

    const [isLoading, setIsLoading] = useState(false);

    // 1. Create a single state object for all inputs
    const [formData, setFormData] = useState({});

    const [backendResults, setBackendResults] = useState(null);

    const hasFetchedConfig = useRef(false);

    // 2. Create a generic handler that updates the specific key (X, Y, or Z)
    const handleInputChange = (name, value) => {
        console.log(formData)
        setFormData(prev => ({
            ...prev,
            [name]: value // Dynamically update the key based on input name
        }));
    };

    function prevPage() {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1)
        }
    }

    async function nextPage() {
        const currentPageConfig = appConfig.pages[currentPageIndex];

        // Check if we are on the final page (according to API)
        if (currentPageConfig.is_final_page) {

            setIsLoading(true); // Start loading spinner

            try {
                // Aggregate calculations from all pages
                const allCalculations = appConfig.pages.flatMap(p => p.calculations || []);

                const payload = {
                    formData: formData,
                    calculations: allCalculations
                }

                const response = await axios.post(`${baseURL}api/calculate`, payload);

                console.log("Results received:", response.data);
                setBackendResults(response.data.results);

                // Move to "Results" view (index = length of pages)
                setCurrentPageIndex(prev => prev + 1);

            } catch (error) {
                console.log(error)
                alert("Backend failed!");
            } finally {
                setIsLoading(false); // Stop loading spinner
            }
        } else {
            // Normal page navigation
            if (currentPageIndex < appConfig.pages.length - 1) {
                setCurrentPageIndex(prev => prev + 1);
            }
        }
    }

    useEffect(() => {
        // If we have already fetched, do nothing
        if (hasFetchedConfig.current) return;

        // Mark as fetched
        hasFetchedConfig.current = true;
        async function fetchConfig() {
            try {
                setIsLoading(true);

                const res = await axios.get(`${baseURL}api/app/1/`);
                //console.log(res)
                if (res.status != 200) {
                    throw new Error("Failed to fetch config");
                }

                const data = res.data;
                console.log(data)
                setAppConfig(data);

            } catch (err) {
                console.error(err);
                //alert("Failed to load app config");
            } finally {
                setIsLoading(false);
            }
        }

        fetchConfig();
    }, []);

    if (!appConfig) {
        return <p>Loading the app</p>
    }

    const isResultPage = currentPageIndex === appConfig.pages.length;

    return (
        <div>
            {/* Show Input Pages if we are NOT on the result page */}
            {!isResultPage &&
                <InputPageCard
                    currentPage={appConfig.pages[currentPageIndex]}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    formData={formData}
                    handleInputChange={handleInputChange}
                />
            }
            {/* Show Output Page only when we are past the last input page */}
            {isResultPage && (
                isLoading ? <p>Calculating...</p> :
                    <OutputPageCard
                        // New API doesn't have outputPage object, so we construct a temporary one
                        outputPage={{ title: "Your Solar Potential", description: "Based on your inputs, here is your estimate." }}
                        nextPage={nextPage} // Maybe reset or finish?
                        prevPage={prevPage}
                        // Pass the BACKEND results, not the form data
                        results={backendResults}
                    />
            )}
        </div>
    )
}

export default AppRoute
