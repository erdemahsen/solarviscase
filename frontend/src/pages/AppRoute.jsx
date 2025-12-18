import { useState, useEffect } from 'react'
import InputPageCard from './components/InputPageCard';
import OutputPageCard from './components/OutputPageCard';
import { simulateBackendCalculation } from './mockBackend'; // Import the mock



const mockConfig = {
  numInputPages: 2,
  pages: [
    {
      id: 1,
      title: "Energy Basics",
      description: "Tell us about your current usage.",
      image: "https://example.com/solar-1.jpg",
      inputs: [
        { name: "X", placeholder: "Monthly Bill ($)", type: "number" }
      ]
    },
    {
      id: 2,
      title: "Home Details",
      description: "Dimensions and location.",
      image: "https://example.com/solar-2.jpg",
      inputs: [
        { name: "Y", placeholder: "Roof Area (sqm)", type: "number" },
        { name: "Z", placeholder: "Sunlight Hours", type: "number" }
      ]
    }
  ],
  calculations: [
    { outputName: "A", formula: "(Y * 100000 + Z * 50000) - (X * 10000)", unit: "kWh" },
    { outputName: "B", formula: "A / 200", unit: "USD" }
  ],
  outputPage: {
    title: "Your Solar Potential",
    description: "Based on your inputs, here is your estimate.",
    image: "https://example.com/result.jpg"
  }
};


function AppRoute() {
    const [currentPageIndex, setCurrentPageIndex] = useState(0)

    const [isLoading, setIsLoading] = useState(false);
    const isLastInputPage = currentPageIndex === mockConfig.numInputPages - 1;

    // 1. Create a single state object for all inputs
    const [formData, setFormData] = useState({});

    const [backendResults, setBackendResults] = useState(null);

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
            if (isLastInputPage) {
                setIsLoading(true); // Start loading spinner
                // Only move to next page if successful
                setCurrentPageIndex(currentPageIndex + 1);
                
                try {
                    // CALL THE MOCK SERVICE
                    // Pass formData (inputs) and mockConfig (formulas)
                    const response = await simulateBackendCalculation(formData, mockConfig.calculations);
                    
                    console.log("Results received:", response.data);
                    setBackendResults(response.data.results);
                    
                    // Only move to next page if successful
                    setCurrentPageIndex(currentPageIndex + 1);
                } catch (error) {
                    console.log(error)
                    alert("Backend failed!");
                } finally {
                    setIsLoading(false); // Stop loading spinner
                }
            } else {
                // Normal page navigation
                setCurrentPageIndex(currentPageIndex + 1);
            }
        }
    }

    // Example: This is where you would send your request later
    useEffect(() => {
        if (currentPageIndex === mockConfig.numInputPages) {
            console.log("Wizard finished! Sending data:", formData);
            // sendToBackend(formData);
        }
    }, [currentPageIndex, formData]);

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
