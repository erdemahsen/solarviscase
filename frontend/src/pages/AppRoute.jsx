import { useState, useEffect, useRef } from 'react'
import axios from "axios";
import InputPageCard from './components/InputPageCard';
import OutputPageCard from './components/OutputPageCard';




const baseURL = "http://127.0.0.1:8000/" // last / can be a bad practice, I may remove that


function AppRoute() {
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [mockConfig, setMockConfig] = useState(null)

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

    function prevPage(){
        if(currentPageIndex > 0 ){
            setCurrentPageIndex(currentPageIndex-1)
        }
    }

    async function nextPage() {
        if (currentPageIndex < mockConfig.numInputPages) {
            
            // If we are about to go to the Output Page, call the API (Mock)
            if (currentPageIndex === mockConfig.numInputPages - 1) {
                setIsLoading(true); // Start loading spinner
                // Only move to next page if successful
                setCurrentPageIndex(prev => prev + 1);
                
                try {

                    const payload = {
                        formData: formData,
                        calculations: mockConfig.calculations
                    }

                    const response = await axios.post(`${baseURL}api/calculate`, payload);
                    
                    console.log("Results received:", response.data);
                    setBackendResults(response.data.results);
                    
                } catch (error) {
                    console.log(error)
                    alert("Backend failed!");
                } finally {
                    setIsLoading(false); // Stop loading spinner
                }
            } else {
                // Normal page navigation
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

                const res = await axios.get(`${baseURL}api/app`);
                //console.log(res)
                if (res.status != 200) {
                    throw new Error("Failed to fetch config");
                }

                const data =  res.data;
                console.log(data)
                setMockConfig(data);

            } catch (err) {
                console.error(err);
                //alert("Failed to load app config");
            } finally {
                setIsLoading(false);
            }
        }

        fetchConfig();
    }, []);

    if(!mockConfig)
    {
        return <p>Loading the app</p>
    }

    return (
        <div>
            {currentPageIndex < mockConfig.numInputPages && 
                <InputPageCard 
                    currentPage = {mockConfig.pages[currentPageIndex]} 
                    nextPage={nextPage} 
                    prevPage={prevPage} 
                    formData={formData} 
                    handleInputChange={handleInputChange}
                />
            }
            {currentPageIndex === mockConfig.numInputPages && (
                isLoading ? <p>Calculating...</p> : 
                <OutputPageCard 
                    outputPage={mockConfig.outputPage} 
                    nextPage={nextPage} 
                    prevPage={prevPage} 
                    // Pass the BACKEND results, not the form data
                    results={backendResults} 
                />
            )}
        </div>
    )
}

export default AppRoute
