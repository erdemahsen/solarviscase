import { useNavigate, useParams } from "react-router-dom";
import PageEditor from "./components/PageEditor";
import { useAdminApp } from "./hooks/useAdminApp";
import AdminHeader from "./components/AdminHeader";
import PageList from "./components/PageList";

function AdminApp() {
  const navigate = useNavigate();
  const { appId } = useParams();

  const {
    appConfig,
    loading,
    activePageUuid,
    isDirty,
    setActivePageUuid,
    handleSave,
    handleAddPage,
    handleUpdatePage
  } = useAdminApp(appId);

  const onSaveClick = async () => {
    const result = await handleSave();
    if (result.success) {
      alert("Saved successfully!");
    } else {
      alert(result.error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!appConfig) return <p>App not found</p>;

  return (
    <div style={{ padding: 20 }}>
      {/* HEADER */}
      <AdminHeader
        appName={appConfig.app_name}
        onSave={onSaveClick}
        isDirty={isDirty}
        onBack={() => navigate("/admin")}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* TOP: HORIZONTAL PAGE LIST */}
        <PageList
          pages={appConfig.pages}
          activePageUuid={activePageUuid}
          onSelectPage={setActivePageUuid}
          onAddPage={handleAddPage}
        />

        {/* BOTTOM: MAIN EDITOR AREA */}
        <div>
          {activePageUuid ? (
            <PageEditor
              page={appConfig.pages.find(p => p._uuid === activePageUuid)}
              onUpdate={handleUpdatePage}
            />
          ) : (
            <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>
              <p>Select a page from the list above to edit details.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminApp;