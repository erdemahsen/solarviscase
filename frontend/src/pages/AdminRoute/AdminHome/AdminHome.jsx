import { useNavigate } from "react-router-dom";
import AdminAppList from "./components/AdminAppList";
import { useApps } from "./hooks/useApps";

import styles from "./AdminHome.module.css";


function AdminHome() {
  const { apps, loading, error, addApp, removeApp } = useApps();
  const navigate = useNavigate();

  /* -------------------- CREATE -------------------- */
  const handleCreateApp = async () => {
    const appName = window.prompt("Enter app name:");
    if (!appName) return;

    const result = await addApp(appName);
    if (result.success) {
      // Auto-navigate to newly created app
      navigate(`/admin/${result.data.id}`);
    } else {
      alert(result.error);
    }
  };

  /* -------------------- DELETE -------------------- */
  const handleDelete = async (e, appId) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this app?")) return;

    const result = await removeApp(appId);
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleAppClick = (appId) => {
    navigate(`/admin/${appId}`);
  };

  const handleNavigationClick = (appId) => {
    navigate(`/app/${appId}`);
  };

  if (loading) return <p>Loading apps...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.adminHomeContainer}>
      <div className={styles.adminHeader}>
        <h1>Admin - Apps</h1>
        <button onClick={() => alert("not implemented yet")} className="button actionButton">
          Log out
        </button>
      </div>
      <button onClick={handleCreateApp} className="button">
        + Create New App
      </button>

      <AdminAppList
        apps={apps}
        onDelete={handleDelete}
        onAppClick={handleAppClick}
        onNavigationClick={handleNavigationClick}
      />
    </div>
  );
}

export default AdminHome;
