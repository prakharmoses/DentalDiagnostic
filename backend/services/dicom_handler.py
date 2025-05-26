import pydicom
import numpy as np
from PIL import Image
from pydicom.pixel_data_handlers.util import apply_voi_lut
import io

def convert_dicom_to_png(dicom_bytes: str, output_path: str, output_format: str = ".png") -> str:
    try:
        ds = pydicom.dcmread(io.BytesIO(dicom_bytes))
        pixel_array = apply_voi_lut(ds.pixel_array, ds)

        if ds.PhotometricInterpretation == "MONOCHROME1":
            pixel_array = np.max(pixel_array) - pixel_array

        pixel_array = pixel_array - np.min(pixel_array)
        pixel_array = (pixel_array / np.max(pixel_array) * 255).astype(np.uint8)

        if len(pixel_array.shape) == 2:
            img = Image.fromarray(pixel_array)
        else:
            img = Image.fromarray(pixel_array[0])
            
        img.save(output_path)

    except Exception as e:
        print(f"Error converting DICOM: {e}")
        return None