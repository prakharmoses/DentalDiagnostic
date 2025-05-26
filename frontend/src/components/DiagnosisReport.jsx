import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown';

// Import contexts
import { ReportContext } from '../context/ReportContext'

const DiagnosisReport = () => {
    const { report } = useContext(ReportContext);

    return (
        <div className='w-[48vw] h-[77.8vh] flex flex-col items-center justify-center gap-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white'>
            {report ? (
                <div className='w-full h-full flex flex-col items-center justify-start gap-4 p-4 overflow-y-scroll'>
                    <h2 className='text-2xl font-bold mb-4'>Diagnosis Report</h2>
                    <ReactMarkdown>{report}</ReactMarkdown>
                </div>
            ) : (
                <div className='text-gray-500 text-lg text-center'>
                    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">No data Available</h1>
                    <p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Kindly upload the image first. If uploaded then click Generate Report!</p>
                </div>
            )}
        </div>
    )
}

export default DiagnosisReport
