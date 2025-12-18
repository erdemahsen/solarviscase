import { useState } from 'react'
import InputPageCard from './components/InputPageCard';
import OutputPageCard from './components/OutputPageCard';



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

    

    function prevPage(){
        if(currentPageIndex > 0 ){
            setCurrentPageIndex(currentPageIndex-1)
        }
    }

    function nextPage(){
        if(currentPageIndex < mockConfig.numInputPages){
            setCurrentPageIndex(currentPageIndex+1)
        }
    }

    return (
        <div>
            {currentPageIndex < mockConfig.numInputPages && <InputPageCard currentPage = {mockConfig.pages[currentPageIndex]} nextPage={nextPage} prevPage={prevPage}/>}
            {currentPageIndex == mockConfig.numInputPages && <OutputPageCard outputPage={mockConfig.outputPage} nextPage={nextPage} prevPage={prevPage} calculations={mockConfig.calculations}/>}
            
        </div>
        

    )
}

export default AppRoute
