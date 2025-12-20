import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid'; 
import PageEditor from "./components/PageEditor";

const baseURL = "http://127.0.0.1:8000";

function AdminApp() {
  const navigate = useNavigate();
  const { appId } = useParams();
  
  const [appConfig, setAppConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePageUuid, setActivePageUuid] = useState(null);
  const [isDirty, setIsDirty] = useState(false); 

  // 1. FETCH & DECORATE
  useEffect(() => {
    fetch(`${baseURL}/api/app/${appId}/`)
      .then(res => res.json())
      .then(data => {
        const decoratedPages = data.pages.map(p => ({
            ...p,
            _uuid: uuidv4(),
            inputs: p.inputs.map(i => ({ ...i, _uuid: uuidv4() })),
            calculations: p.calculations.map(c => ({ ...c, _uuid: uuidv4() }))
        }));

        decoratedPages.sort((a, b) => a.order_index - b.order_index);

        setAppConfig({ ...data, pages: decoratedPages });
        
        if (decoratedPages.length > 0) {
            setActivePageUuid(decoratedPages[0]._uuid);
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [appId]);

  // 2. SAVE FUNCTION
  const handleSave = async () => {
    if (!appConfig) return;

    const cleanPages = appConfig.pages.map((p, index) => ({
        id: p.id, 
        title: p.title,
        description: p.description,
        image_url: p.image_url,
        order_index: index, 

        inputs: p.inputs.map(i => ({
            id: i.id,
            variable_name: i.variable_name,
            placeholder: i.placeholder,
            input_type: i.input_type
        })),

        calculations: p.calculations.map(c => ({
            id: c.id,
            output_name: c.output_name,
            formula: c.formula,
            unit: c.unit
        }))
    }));

    const payload = {
        app_name: appConfig.app_name,
        pages: cleanPages
    };

    try {
        const res = await fetch(`${baseURL}/api/app/${appId}/structure`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            // Optional: You might want to re-fetch here to get real IDs back
            // so subsequent edits don't cause duplicate creations.
            alert("Saved successfully!");
            setIsDirty(false);
        } else {
            alert("Error saving");
        }
    } catch (e) {
        console.error("Save failed", e);
    }
  };

  // 3. ADD PAGE FUNCTION (New)
  const handleAddPage = () => {
    const newPageUuid = uuidv4();
    
    const newPage = {
      _uuid: newPageUuid,
      // No 'id' property -> Backend will see this and create a NEW page
      title: "New Page",
      description: "Enter a description...",
      image_url: "",
      order_index: appConfig.pages.length, // Put it at the end
      inputs: [],        // Empty default
      calculations: []   // Empty default
    };

    setAppConfig(prev => ({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
    
    // Automatically switch the view to the new page
    setActivePageUuid(newPageUuid);
    setIsDirty(true);
  };

  if (loading) return <p>Loading...</p>;
  if (!appConfig) return <p>App not found</p>;

  return (
    <div style={{ padding: 20 }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <button onClick={() => navigate("/admin")}>← Back</button>
        <h2>Editing: {appConfig.app_name}</h2>
        <button 
            onClick={handleSave} 
            disabled={!isDirty}
            style={{ backgroundColor: isDirty ? 'blue' : 'grey', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: isDirty ? 'pointer' : 'default' }}
        >
            Save Changes
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        
        {/* LEFT SIDEBAR */}
        <div style={{ width: '250px', borderRight: '1px solid #ccc', paddingRight: 10 }}>
           <h3>Pages</h3>
           <ul style={{ listStyle: 'none', padding: 0 }}>
               {appConfig.pages.map((page) => (
                   <li 
                    key={page._uuid}
                    style={{ 
                        padding: '8px',
                        backgroundColor: page._uuid === activePageUuid ? '#e0e0e0' : 'transparent',
                        fontWeight: page._uuid === activePageUuid ? 'bold' : 'normal',
                        cursor: 'pointer',
                        marginBottom: 5,
                        borderRadius: '4px'
                    }}
                    onClick={() => setActivePageUuid(page._uuid)}
                   >
                       {page.title}
                   </li>
               ))}
           </ul>
           {/* UPDATED BUTTON */}
           <button 
             onClick={handleAddPage} 
             style={{ width: '100%', padding: '8px', cursor: 'pointer' }}
           >
             + Add Page
           </button>
        </div>

        {/* MAIN AREA */}
        <div style={{ flex: 1 }}>
            {activePageUuid ? (
               <PageEditor 
                 page={appConfig.pages.find(p => p._uuid === activePageUuid)} 
                 onUpdate={(updatedPage) => {
                    setAppConfig(prev => ({
                        ...prev,
                        pages: prev.pages.map(p => 
                            p._uuid === activePageUuid ? updatedPage : p
                        )
                    }));
                    setIsDirty(true);
                 }}
               />
            ) : (
                <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>
                    <p>Select a page from the left to edit details.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

export default AdminApp;