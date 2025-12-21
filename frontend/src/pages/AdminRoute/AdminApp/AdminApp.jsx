import { useNavigate, useParams } from "react-router-dom";
import PageEditor from "./components/PageEditor";
import { useAdminApp } from "./hooks/useAdminApp";
import AdminHeader from "./components/AdminHeader";
import PageList from "./components/PageList";

import styles from "./AdminApp.module.css";

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
    handleUpdatePage,
    handleDeletePage
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
    <div className={styles.adminAppContainer}>
      <AdminHeader
        appName={appConfig.app_name}
        onSave={onSaveClick}
        isDirty={isDirty}
        onBack={() => navigate("/admin")}
      />
      <PageList
        pages={appConfig.pages}
        activePageUuid={activePageUuid}
        onSelectPage={setActivePageUuid}
        onAddPage={handleAddPage}
        onDeletePage={handleDeletePage}
      />
      <PageEditor
        page={appConfig.pages.find(p => p._uuid === activePageUuid)}
        onUpdatePage={handleUpdatePage}
        onDeletePage={handleDeletePage}
      />
    </div >
  );
}

export default AdminApp;