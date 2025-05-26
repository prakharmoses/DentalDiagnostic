import requests
import os
import cv2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")  # set this in your environment
ROBOFLOW_MODEL = "adr/6"              # Replace with your Roboflow model path
ROBOFLOW_URL = f"https://detect.roboflow.com/{ROBOFLOW_MODEL}"

def detect_pathologies(image_path: str):
    with open(image_path, "rb") as img_file:
        image_data = img_file.read()
    
    # Make request
    response = requests.post(
        ROBOFLOW_URL,
        params={
            "api_key": ROBOFLOW_API_KEY,
            "confidence": 30,
            "overlap": 50,
        },
        files={"file": image_data}
    )

    # Check if the request was successful
    if response.status_code != 200:
        raise Exception(f"Error: {response.status_code} - {response.text}")
    
    predictions = response.json().get("predictions", [])
    return [
        {
            "class_name": pred["class"],
            "confidence": pred["confidence"],
            "bbox": {
                "x": int(pred["x"]),
                "y": int(pred["y"]),
                "width": int(pred["width"]),
                "height": int(pred["height"])
            }
        }
        for pred in predictions
    ]


def draw_boxes_on_image(image_path: str, detections: list):
    image = cv2.imread(image_path)
    
    for detection in detections:
        bbox = detection["bbox"]
        class_name = detection["class_name"]
        confidence = detection["confidence"]

        # Draw bounding box
        cv2.rectangle(
            image,
            (bbox["x"], bbox["y"]),
            (bbox["x"] + bbox["width"], bbox["y"] + bbox["height"]),
            (0, 255, 0), 2
        )

        # Put class name and confidence
        label = f"{class_name} ({confidence:.2f})"
        cv2.putText(
            image,
            label,
            (bbox["x"], bbox["y"] - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (255, 255, 255),
            2
        )

    output_path = image_path.replace(".png", "_annotated.png")
    os.remove(image_path)  # Remove original
    cv2.imwrite(output_path, image)
    return output_path