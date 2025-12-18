// This mimics what your Python FastAPI will eventually do
export const simulateBackendCalculation = (formData, configCalculations) => {
    return new Promise((resolve, reject) => {
        console.log("Sending data to (mock) backend...", formData);

        // 1. Simulate Network Delay (1.5 seconds)
        setTimeout(() => {
            try {
                // 2. Build calculation context
                const context = {};

                // Convert inputs to numbers
                Object.keys(formData).forEach(key => {
                    context[key] = parseFloat(formData[key]) || 0;
                });

                //  ARRAY instead of object
                const results = [];

                // Run calculations sequentially
                configCalculations.forEach((calc) => {
                    // ⚠️ Dangerous in real apps, OK for mock
                    const keys = Object.keys(context);
                    const values = Object.values(context);
                    const mathFunc = new Function(...keys, `return ${calc.formula}`);

                    const val = mathFunc(...values);

                    // Add to context for next formulas
                    context[calc.outputName] = val;

                    // ✅ Push into array
                    results.push({
                        key: calc.outputName,
                        value: val,
                        unit: calc.unit
                    });
                });

                // 3. Return success response
                resolve({
                    status: 200,
                    data: {
                        results,
                        calculatedAt: new Date().toISOString()
                    }
                });

            } catch (error) {
                reject({
                    status: 500,
                    message: "Calculation Error"
                });
            }
        }, 1500);
    });
};
