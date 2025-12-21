import React from "react";
import PageCard from "./PageCard";

function PageList({ pages, activePageUuid, onSelectPage, onAddPage, onDeletePage }) {
    return (
        <div style={{ display: 'flex', gap: '10px', padding: '10px', alignItems: 'center', backgroundColor: 'blue', justifyContent: 'center' }}>
            {pages.map((page) => (
                <PageCard
                    key={page._uuid}
                    page={page}
                    isActive={page._uuid === activePageUuid}
                    onClick={() => onSelectPage(page._uuid)}
                    onDelete={() => onDeletePage(page._uuid)}
                />
            ))}

            <PageCard onClick={onAddPage}>
                + Add Page
            </PageCard>
        </div>
    );
}

export default PageList;
