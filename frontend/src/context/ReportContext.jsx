import React, { createContext, useState } from 'react';

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
    const [report, setReport] = useState(null);

    return (
        <ReportContext.Provider value={{ report, setReport }}>
            {children}
        </ReportContext.Provider>
    );
};