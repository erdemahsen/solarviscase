import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const baseURL = "http://127.0.0.1:8000";

function AdminApp() {
  const navigate = useNavigate();
  const { appId } = useParams(); // 👈 from /admin/:appId
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseURL}/api/app/${appId}/`)
      .then(res => res.json())
      .then(data => {
        setApp(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [appId]);

  if (loading) return <p>Loading...</p>;
  if (!app) return <p>App not found</p>;

  return (
    <>
      <button onClick={() => navigate("/admin")}>
        ← Back
      </button>

      <h1>Admin App</h1>

      <p><strong>ID:</strong> {app.id}</p>
      <p><strong>Name:</strong> {app.app_name}</p>
    </>
  );
}

export default AdminApp;
