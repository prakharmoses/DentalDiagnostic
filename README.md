# Dental X-ray DICOM Diagnostic Report Gen

## 📖 Introduction

Can't access a doctor to read your dental X-rays or just curious get insights on your own? Introducing Dental X-ray DICOM Diagnostic Report Generator, your one stop to get insights from the dental X-ray.

This tool empowers users to generate a clear and concise report of the dental X-ray with just a few clicks away. It takes DICOM images (.dcm and .rvg types) as input and then generate a proper diagnostic report.

## 📝 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Benefits](#benefits)
4. [Getting Started](#gettingstarted)
5. [Usage](#usage)
6. [Architecture](#architecture)
7. [Endpoints](#endpoints)
8. [Author](#author)
9. [License](#license)

## <div id="overview">📝 Overview</div>

Dental X-ray DICOM Diagnostic Report Generator is a comprehensive tool designed to simplify the process of getting insights and diagnostic report from the dental X-ray using ML and AI.

## <div id="features">✨ Features</div>

<ul>
  <li><strong>Intutive and User Friendly UI:</strong> Easy to understand and use. Two sections with left side for uploading X-ray images in DICOM format and right side to display the generated diagnostic report.</li>
  <li><strong>Reveals Dental Issues:</strong> The X-ray analysis provides insights into dental abnormalities, including the presence of cavities, periapical lesion, etc.</li>
  <li><strong>Recommendations:</strong> Provides the recommendations and steps need to be taken to cure in a concise way.</li>
</ul>

## <div id="benefits">📈 Benefits</div>

<ul>
  <li><strong>Wasy to Use/ Clicks Away:</strong> Intutive UI with report generation only a few clicks away.</li>
  <li><strong>Understandable Reports:</strong> Uses AI and ML to produce clear, concise reports with actionable recommendations. The reports are designed so that anyone can understand them.</li>
</ul>

## <div id="gettingstarted">📲 Getting Started</div>

Follow these steps to set up Dental X-ray DICOM Diagnostic Report Generator on your system:

1. Clone the repository:
    ```bash
    git clone https://github.com/prakharmoses/DentalDiagnostic
    ```

2. Open two terminals, one for frontend directory and another for backend directory.

3. In first terminal, navigate to the frontend folder and install all dependencies. Then start the project.
    ```bash
    cd frontend
    ```
    ```bash
    npm install
    ```
    ```bash
    npm start
    ```
4. Create file .env in the backend folder of the project and populate it as follows:
   ```env
   ROBOFLOW_API_KEY = <your-roboflow-api-key>
   GEMINI_API_KEY = <your-gemini-api-key>
   MODEL_NAME = <model-name-in-gemini-(gemma-3-27b-it)-was-used-for-testing>
   ```

5. In second terminal, navigate to the backend folder, create a virtual environment.
    ```bash
    cd backend
    ```
    ```bash
    python -m venv dobbeai
    ```

6. Activate the virtual environmentm install all required dependencies and run the server.
    ```bash
    dobbeai\Scripts\activate.ps1
    ```
    ```bash
    pip install -r requirements.txt
    ```
    ```bash
    uvicorn main:app --reload
    ```

   <strong>Note:</strong>
   <ul>
     <li>The command given above are for windows.</li>
     <li>Don't forget to close the virtual environment before closing the tool as a good practice. The command for the same is:
  ```bash
  deactivate
  ```
  </li>
   </ul>

##  <div id="usage">🧑🏽‍💻 Usage</div>

This is a single page application designed for you to generate the diagnostic report from X-ray DICOM images. To use, the steps are:

1. <strong>Landing Screen</strong>

   ![image](https://github.com/user-attachments/assets/95d84ce7-9e39-4a72-8f8b-08b299b866c4)

   The landing screen will look like as given above.

2. <strong>Upload Image in DICOM format (.dcm or .rvg)</strong>

   ![image](https://github.com/user-attachments/assets/3918a353-18e3-4426-90fd-76bcf0f7c85a)

   Click on the upload file button, and select a .dcm or .rvg format file. The file will be displayed in the section as shown above.

3. <strong>Generate Diagnostic Report</strong>

   ![image](https://github.com/user-attachments/assets/e13ab879-6b85-4ab4-84d3-f9c412b19c01)

   Click on "Generate Report" button to detect dental issues (which will be shown in left side image) and generate a clear and concise report on right as shown above.

4. <strong>Clear Image</strong>

   Click on Clear Upload to fresh start for next X-ray image.

The usage of the tool with the help of a video is shown below.
<video width="640" controls>
  <source src="DICOMdiagnostic.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## <div id='architecture'>🏰 Architecture</div>

  ### Frontend (React)
  <ul>
    <li><strong>User Interface</strong>: Provides an intutive interface for users to upload DICOM Dental X-ray images, button to generate diagnostic report and clear uploads.</li>
    <li><strong>State Management</strong>: Utilizes state management via Context API to manage report (stores generated diagnostic report) state.</li>
  </ul>

  ### Backend (FastAPI)
  <ul>
    <li><strong>API Endpoints</strong>: Exposes RESTful API endpoints for handling DICOM image upload and to generate diagnostic report by getting issue detections using Roboflow.</li>
  </ul>

  ### Roboflow API
  <ul>
    <li>The <em>.png</em> image is given to Roboflow to detect issues in dental X-ray using <i>adr/6</i> model and the confidence and overlap percentages as 30% and 50% respectively.</li>
    <li>It returns an array of details of detections with class, confidence, x and y coordinates of the start of issue and size (width and height) of the issue. Other things are not used in this tool.</li>
  </ul>

  ### LLM
  <ul>
    <li>The detection in the array are passed to the LLM model (here Gemini) with a proper prompt.</li>
    <li>Report in the markdown format is returned from the model.</li>
  </ul>

  ### 🛣️ Workflow
  <ul>
    <li><strong>Image Upload</strong>: Image is uploaded by the user in DICOM format via React frontend. Only one image is accepted at a time.</li>
    <li><strong>API Request</strong>: The frontend sends request to the FastAPI backend to process these interactions.</li>
    <li><strong>Image Conversion</strong>: The DICOM format image is converted to <em>.png</em> format and is saved in the backend server with a unique id assigned (this can be changed)</li>
    <li><strong>Response Delivery</strong>: The backend sends the reponse as image path to the frontend to display the uploaded and converted image to the user.</li>
    <li><strong>User Interaction to Generate Report</strong>: User clicks on Generate Report and the respective API in the backend is called with image path given to backend.</li>
    <li><strong>Roboflow API</strong>: Roboflow API is called with transfering the respective image along with confidence and overlap percentages. It returns an array of issues detected.</li>
    <li><strong>Annotate Image</strong>: The annotations are drawn on the <em>.png</em> image replacing the original image.</li>
    <li><strong>Report Generation</strong>: The detection array is given to LLM with a prompt to generate a textual disgnostic report.</li>
    <li><strong>Response Delivery</strong>: FInally, the generated textual report is returned to frontend (in Markdwon format) with the path of the new annotated image. The markdown is shown using ReactMarkdown.</li>
  </ul>

## <div id="endpoints">☁️ API Endpoints</div>

This tool exposes only two RESTful API endpoints to manage the upload of DICOM images and to generate diagnostic report.

  ### Convert Image
  <ul>
    <li><strong>Endpoint</strong>: /convertImage</li>
    <li><strong>Method</strong>: POST</li>
    <li><strong>Request Body</strong>:
      <ul>
        <li><strong>file (single DICOM file)</strong>: DICOM image (.dcm or .rvg) to be uploaded.</li>
      </ul>
    </li>
    <li><strong>Response</strong>:
      <ul>
        <li><strong>Status Code</strong>: 200 Successful response</li>
        <li><strong>Fields</strong>: image_id (string) and image_url (string)</li>
      </ul>
    </li>
  </ul>

  ### Generate Diagnostics
  <ul>
    <li><strong>Endpoint</strong>: /generateDiagnostic</li>
    <li><strong>Method</strong>: POST</li>
    <li><strong>Request Body</strong>:
      <ul>
        <li><strong>image_url</strong>: URL of the PNG image to generate diagnostic report from (in string).</li>
        <li><strong>image_id</strong>: Unique ID assigned to image in starting (in string).</li>
      </ul>
    </li>
    <li><strong>Response</strong>:
      <ul>
        <li><strong>Status Code</strong>: 200 Successful response</li>
        <li><strong>Fields</strong>: image_id (string), png_image_path (string) and report (string)</li>
      </ul>
    </li>
  </ul>

## <div id="author">🎓 Author</div>

<p>  <a href="https://github.com/prakharmosesOK"><b>Prakhar Moses</b><a/><p/>

## <div id="license">📋 License</div>

This repository is under no license.
