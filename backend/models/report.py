from pydantic import BaseModel
from typing import List, Dict

class Detection(BaseModel):
    class_name: str
    confidence: float
    bbox: Dict[str, int]

class DiagnosticResponse(BaseModel):
    image_id: str
    png_image_path: str
    report: str

class ImageUploadResponse(BaseModel):
    image_id: str
    image_url: str