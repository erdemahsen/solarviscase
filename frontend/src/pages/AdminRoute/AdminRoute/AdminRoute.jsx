import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateAppButton from "./components/CreateAppButton";
import AdminAppList from "./components/AdminAppList";

const baseURL = "http://127.0.0.1:8000";

function AdminRoute() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchApps = () => {
    setLoading(true);
    axios
      .get(`${baseURL}/api/app/`)
      .then(res => {
        setApps(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApps();
  }, []);

  /* -------------------- CREATE -------------------- */
  const handleCreateApp = async () => {
    const appName = window.prompt("Enter app name:");
    if (!appName) return;

    try {
      const response = await axios.post(`${baseURL}/api/app/`, {
        app_name: appName
      });

      // ✅ status check
      if (response.status === 201 || response.status === 200) {
        // append new app to list
        setApps(prev => [...prev, response.data]);

        // optional: auto-navigate to newly created app
        // navigate(`/admin/${response.data.id}`);
      } else {
        console.error("Unexpected status:", response.status);
        alert("Unexpected response from server");
      }
    } catch (err) {
      console.error("Create failed:", err);

      if (err.response) {
        alert(`Create failed: ${err.response.status}`);
      } else {
        alert("Network error while creating app");
      }
    }
  };

  /* -------------------- DELETE -------------------- */
  const handleDelete = async (e, appId) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this app?")) return;

    try {
      const response = await axios.delete(
        `${baseURL}/api/app/${appId}/`
      );

      if (response.status === 200 || response.status === 204) {
        setApps(prev => prev.filter(app => app.id !== appId));
      } else {
        console.error("Unexpected status:", response.status);
        alert("Unexpected response from server");
      }
    } catch (err) {
      console.error("Delete failed:", err);

      if (err.response) {
        alert(`Delete failed: ${err.response.status}`);
      } else {
        alert("Network error while deleting");
      }
    }
  };

  const handleAppClick = (appId) => {
    navigate(`/admin/${appId}`);
  };

  if (loading) return <p>Loading apps...</p>;

  return (
    <div>
      <h1>Admin – Applications</h1>

      <CreateAppButton onCreate={handleCreateApp} />

      <AdminAppList
        apps={apps}
        onDelete={handleDelete}
        onAppClick={handleAppClick}
      />
    </div>
  );
}

export default AdminRoute;
