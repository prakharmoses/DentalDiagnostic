import React, { useState, useRef, useContext, useEffect } from 'react'

// Import Components
import ModelViewer from './ModelViewer'

// Import Context
import { ReportContext } from '../context/ReportContext'

const UploadImage = () => {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Define Context
    const { setReport } = useContext(ReportContext);

    const handleClearUpload = () => {
        setFile(null);
        setReport(null); // Reset report when file is cleared
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // Clear the file input
        }
    }

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // Sending request to backend to convert the format to PNG or JPEG
            const formData = new FormData();
            formData.append('file', selectedFile);
            try {
                setLoading(true);

                const response = await fetch('http://localhost:8000/convertImage', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('File converted successfully:', data);
                setFile({
                    image_url: `http://localhost:8000/${data.image_url}`,
                    imageId: data.image_id
                });
                setReport(null); // Reset report when a new file is uploaded
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Failed to upload file. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    }

    const handleDiagnosisGeneration = async () => {
        if (!file) {
            alert('Please upload a file first.');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('http://localhost:8000/generateDiagnostic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image_url: file.image_url, image_id: file.imageId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${response.status} ${errorData.error}`);
            }

            const data = await response.json();
            console.log('Report generated successfully:', data);
            setReport(data.report); // Assuming the backend returns the report
            setFile({
                ...file,
                image_url: `http://localhost:8000/${data.png_image_path}`,
            })
        } catch (error) {
            console.error('Error generating report:', error);
            alert(`${error.message || 'Failed to generate report. Please try with uploading file.'}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading && (
                <div className='fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50'>
                    <div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                </div>
            )}
            <div className='w-[48vw] h-[77.8vh] flex flex-col items-center justify-center gap-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white'>
                <div className="w-full max-w-4xl shadow-xl rounded-xl overflow-hidden">
                    {(file == null || !file) ? <ModelViewer /> : (
                        <div className="flex flex-col items-center justify-center p-4">
                            <img
                                src={file.image_url} alt="Converted PNG"
                                className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
                            />
                        </div>
                    )}
                </div>
                <div className='flex flex-row items-center justify-around w-full mb-4'>
                    <div>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor="large_size"
                        >Accepted File Formats: .dcm or .rvg</label>
                        <button
                            className="flex items-center rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg hover-shadow-slate-900 focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="file"
                            id="large_size"
                            onClick={file ? handleClearUpload : () => fileInputRef.current.click()}
                        >
                            {!file && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5">
                                <path fill-rule="evenodd" d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clip-rule="evenodd" />
                            </svg>}
                            {file ? "Clear Upload" : "Upload File"}
                        </button>
                        <input
                            type="file"
                            accept=".dcm,.rvg"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div>
                        <div className="relative">
                            <div className="absolute -inset-5">
                                <div
                                    className="w-full h-full max-w-sm mx-auto -lg:mx-2 opacity-30 blur-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-green-600">
                                </div>
                            </div>
                            <button
                                className="relative z-10 inline-flex items-center justify-center w-full px-8 py-2 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent sm:w-auto rounded-xl font-pj hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                type="button"
                                onClick={handleDiagnosisGeneration}
                                disabled={!file || loading}
                            >
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UploadImage
