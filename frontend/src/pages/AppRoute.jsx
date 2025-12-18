import { useState } from 'react'

let pages= [
    {
        //image: ""
        title: "Eviniz kaç yıllık",
        description: "Evinit kaç yıllık girin",
        inputPlaceholders: ["X"],
        isOutputPage: false
    },
    {
        //image: ""
        title: "Evinit kaç oda ve banyo var",
        description: "Eviniz hakkında detayları doldurun lütfen",
        inputPlaceholder: ["Y", "Z"],
        isOutputPage: false
    },
    {
        //image: ""
        title: "Tamamdır hesapladım",
        description: "hesap açıklaması",
        inputPlaceholder: [],
        isOutputPage: true,
        outputFormulas: [1,2]
    },
]

function ButtonApp({currentPage, setCurrentPage, pages, type}){
    return (
        <>
        {
            type==="forward" && 
            <button onClick={() => {currentPage<pages.length-1 && setCurrentPage(currentPage+1)}} >
                forward
            </button>
        }
        {
            type==="back" && 
            <button onClick={() => {currentPage>0 && setCurrentPage(currentPage-1)}} >
                back
            </button>
        }
        </>
    )
}

function AppRoute() {
    const [currentPage, setCurrentPage] = useState(0)
    const curPage = pages[currentPage]

    return (
        <div className='app-page'>
            <h1>{curPage.isOutputPage ? "Output Page": `Input ${currentPage+1}`}</h1>
            <h1>{curPage.title}</h1>
            <h3>{curPage.description}</h3>
            <ButtonApp currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages} type={"back"}></ButtonApp>
            <ButtonApp currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages} type={"forward"}></ButtonApp>
            <p>curpage is : {currentPage}</p>
        </div>
    )
}

export default AppRoute
