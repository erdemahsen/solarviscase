import api from "./api";

const appService = {
    getApps: () => {
        return api.get("/api/app/");
    },
    createApp: (appName) => {
        return api.post("/api/app/", { app_name: appName });
    },
    deleteApp: (appId) => {
        return api.delete(`/api/app/${appId}/`);
    },
    getApp: (appId) => {
        return api.get(`/api/app/${appId}/`);
    },
    updateApp: (appId, payload) => {
        return api.put(`/api/app/${appId}/`, payload);
    },
    calculatePage: (appId, pageId, payload) => {
        return api.post(`/api/app/${appId}/pages/${pageId}/calculate`, payload);
    },
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post("/api/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};

export default appService;
