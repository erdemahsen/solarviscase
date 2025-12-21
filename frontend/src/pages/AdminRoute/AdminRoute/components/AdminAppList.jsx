import React from "react";
import AdminAppListItem from "./AdminAppListItem";

function AdminAppList({ apps, onDelete, onAppClick, onNavigationClick }) {
    if (apps.length === 0) {
        return <p>No apps found</p>;
    }

    return (
        <div style={{ overflow: 'auto' }}>
            {
                apps.map((app) => (
                    <AdminAppListItem
                        key={app.id}
                        app={app}
                        onDelete={onDelete}
                        onClick={onAppClick}
                        onNavigationClick={onNavigationClick}
                    />
                ))
            }
        </div >
    );
}

export default AdminAppList;
