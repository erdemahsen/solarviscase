import { useNavigate } from "react-router-dom";
import AppList from "./components/AppList";
import { useApps } from "./hooks/useApps";

import styles from "./AppHome.module.css";


function AppHome() {
  const { apps, loading, error } = useApps();
  const navigate = useNavigate();

  const handleAppClick = (appId) => {
    navigate(`/app/${appId}`);
  };

  if (loading) return <p>Loading apps...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.appHomeContainer}>
      <div className={styles.appHeader}>
        <h1>User - Apps</h1>
        <button onClick={() => alert("not implemented yet")} className="button actionButton">
          Log in
        </button>
      </div>

      <AppList
        apps={apps}
        onClick={handleAppClick}

      />
    </div>
  );
}

export default AppHome;
