function OutputPageCard({ outputPage, prevPage, nextPage, results }) {  
  return (
    <div className='card'>
        <h1>{outputPage.title}</h1>
        <h3>{outputPage.description}</h3>
        
        {results &&
          results.map(r => (
            <div key={r.key}>
              {r.key}: {r.value} {r.unit}
            </div>
          ))

        }

        <button onClick={prevPage}>Back</button>
        <button onClick={nextPage}>Finish</button>
    </div>
  )
}

export default OutputPageCard