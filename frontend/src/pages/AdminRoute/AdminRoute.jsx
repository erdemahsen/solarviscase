import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  if (loading) return <p>Loading apps...</p>;

  return (
    <div>
      <h1>Admin – Applications</h1>

      {/* ➕ Create App */}
      <button
        onClick={handleCreateApp}
        style={{
          marginBottom: "16px",
          padding: "8px 12px",
          cursor: "pointer"
        }}
      >
        ➕ Create New App
      </button>

      {apps.length === 0 && <p>No apps found</p>}

      {apps.map(app => (
        <div
          key={app.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "8px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
          onClick={() => navigate(`/admin/${app.id}`)}
        >
          <div>
            <h3>{app.app_name}</h3>
            <p>id: {app.id}</p>
            <p>num of pages: {app.pages.length}</p>
          </div>

          {/* 🗑️ Delete */}
          <button
            onClick={(e) => handleDelete(e, app.id)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "18px"
            }}
            title="Delete app"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminRoute;
