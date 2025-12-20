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
    updateAppStructure: (appId, payload) => {
        return api.put(`/api/app/${appId}/structure`, payload);
    },
};

export default appService;
