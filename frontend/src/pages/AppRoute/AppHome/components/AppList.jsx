import React from "react";
import AppListItem from "./AppListItem";

function AppList({ apps, onClick }) {
    if (apps.length === 0) {
        return <p>No apps found</p>;
    }

    return (
        <div style={{ overflow: 'auto' }}>
            {
                apps.map((app) => (
                    <AppListItem
                        key={app.id}
                        app={app}
                        onClick={onClick}
                    />
                ))
            }
        </div >
    );
}

export default AppList;
