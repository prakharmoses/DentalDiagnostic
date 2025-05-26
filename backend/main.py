from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from services.dicom_handler import convert_dicom_to_png
from services.roboflow_client import detect_pathologies, draw_boxes_on_image
from services.gpt_report import generate_diagnostic_report
from models.report import DiagnosticResponse, ImageUploadResponse
import uuid
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Serve static files (converted images)
app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

@app.post("/convertImage", response_model = ImageUploadResponse)
async def convert_image(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}.png"
    dicom_bytes = await file.read()
    png_path = os.path.join(OUTPUT_DIR, filename)
    if not dicom_bytes:
        return JSONResponse(content={"error": "No DICOM file provided."}, status_code=400)

    # Convert DICOM to PNG
    convert_dicom_to_png(dicom_bytes, output_path=png_path)

    if png_path:
        return JSONResponse(
            content = {"image_url": png_path.replace("\\", "/"), "image_id": filename},
            status_code=200
        )
    else:
        return JSONResponse(content={"error": "Failed to convert DICOM to PNG."})

@app.post("/generateDiagnostic", response_model = DiagnosticResponse)
async def generate_diagnostics(request: dict):
    file_id = request.get("image_id")
    png_path = os.path.join(OUTPUT_DIR, file_id)

    if not os.path.exists(png_path):
        return JSONResponse(content={"error": "Kindly re-upload the image first to re-generate diagnostics."}, status_code=404)

    # Send to Roboflow
    detections = detect_pathologies(png_path)
    if not detections or len(detections) == 0:
        return DiagnosticResponse(
            image_id = file_id,
            png_image_path = png_path,
            detections = [],
            report = "No pathologies detected."
        )
    
    # Draw boxes on the image
    png_path = draw_boxes_on_image(png_path, detections)

    # Generate diagnostic report using OpenAI
    report = generate_diagnostic_report(detections)

    return DiagnosticResponse(
        image_id=file_id,
        png_image_path=png_path.replace("\\", "/"),
        detections=detections,
        report=report
    )
