import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import appService from "../../../../services/appService";

export const useAdminApp = (appId) => {
    const [appConfig, setAppConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activePageUuid, setActivePageUuid] = useState(null);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setLoading(true);
        appService.getApp(appId)
            .then((res) => {
                const data = res.data;
                const decoratedPages = data.pages.map((p) => ({
                    ...p,
                    _uuid: uuidv4(),
                    inputs: p.inputs.map((i) => ({ ...i, _uuid: uuidv4() })),
                    calculations: p.calculations.map((c) => ({ ...c, _uuid: uuidv4() })),
                }));

                decoratedPages.sort((a, b) => a.order_index - b.order_index);

                setAppConfig({ ...data, pages: decoratedPages });

                if (decoratedPages.length > 0) {
                    setActivePageUuid(decoratedPages[0]._uuid);
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [appId]);

    const handleSave = async () => {
        if (!appConfig) return;

        const cleanPages = appConfig.pages.map((p, index) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            image_url: p.image_url,
            order_index: index,

            inputs: p.inputs.map((i) => ({
                id: i.id,
                variable_name: i.variable_name,
                placeholder: i.placeholder,
                input_type: i.input_type,
            })),

            calculations: p.calculations.map((c) => ({
                id: c.id,
                output_name: c.output_name,
                formula: c.formula,
                unit: c.unit,
            })),
        }));

        const payload = {
            app_name: appConfig.app_name,
            pages: cleanPages,
        };

        try {
            const res = await appService.updateAppStructure(appId, payload);
            if (res.status === 200) {
                setIsDirty(false);
                return { success: true };
            } else {
                return { success: false, error: "Error saving" };
            }
        } catch (e) {
            console.error("Save failed", e);
            return { success: false, error: "Save failed" };
        }
    };

    const handleAddPage = () => {
        const newPageUuid = uuidv4();

        const newPage = {
            _uuid: newPageUuid,
            title: "New Page",
            description: "Enter a description...",
            image_url: "",
            order_index: appConfig.pages.length,
            inputs: [],
            calculations: [],
        };

        setAppConfig((prev) => ({
            ...prev,
            pages: [...prev.pages, newPage],
        }));

        setActivePageUuid(newPageUuid);
        setIsDirty(true);
    };

    const handleUpdatePage = (updatedPage) => {
        setAppConfig((prev) => ({
            ...prev,
            pages: prev.pages.map((p) =>
                p._uuid === activePageUuid ? updatedPage : p
            ),
        }));
        setIsDirty(true);
    };

    return {
        appConfig,
        loading,
        activePageUuid,
        isDirty,
        setActivePageUuid,
        handleSave,
        handleAddPage,
        handleUpdatePage
    };
};
