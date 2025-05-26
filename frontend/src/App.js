// Import Components
import UploadImage from "./components/UploadImage";
import DiagnosisReport from "./components/DiagnosisReport";

// Import Context
import { ReportProvider } from "./context/ReportContext";

function App() {
  return (
    <ReportProvider>
      <div className="App">
        <header className="w-[fit-content] mx-auto my-4 text-center">
          <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Dental X-ray DICOM <span class="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">Diagnostic Report</span></h1>
        </header>
        <main className="p-4 flex flex-row items-start justify-center gap-4">
          <UploadImage />
          <DiagnosisReport />
        </main>
        <footer className="mt-4 text-center text-gray-600">
          &copy; 2025 Dental Diagnostics Inc. All rights reserved.
        </footer>
      </div>
    </ReportProvider>
  );
}

export default App;
