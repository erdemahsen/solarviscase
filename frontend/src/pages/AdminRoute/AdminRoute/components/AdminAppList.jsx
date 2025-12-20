import React from "react";
import AdminAppListItem from "./AdminAppListItem";

function AdminAppList({ apps, onDelete, onAppClick }) {
    if (apps.length === 0) {
        return <p>No apps found</p>;
    }

    return (
        <div>
            {apps.map((app) => (
                <AdminAppListItem
                    key={app.id}
                    app={app}
                    onDelete={onDelete}
                    onClick={onAppClick}
                />
            ))}
        </div>
    );
}

export default AdminAppList;
