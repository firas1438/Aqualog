import cv2
import numpy as np
import io

from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import Response

router = APIRouter()

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "bmp", "tiff", "tif"}
MAX_SIZE_MB = 10


def segmenter_bloom_colore(image_bytes: bytes) -> tuple[bytes, int]:
    """
    Segmentation Otsu avec zones colorées en rouge.
    Reçoit les bytes de l'image, retourne (bytes PNG traité, nb contours).
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Impossible de décoder l'image. Format non supporté.")

    img_rgb  = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Seuillage Otsu
    _, mask = cv2.threshold(img_gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Contours
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Overlay rouge semi-transparent + contours verts
    overlay = img_rgb.copy()
    cv2.drawContours(overlay, contours, -1, (255, 0, 0), -1)
    result = cv2.addWeighted(img_rgb, 0.5, overlay, 0.5, 0)
    cv2.drawContours(result, contours, -1, (0, 255, 0), 2)

    # Encoder en PNG
    result_bgr = cv2.cvtColor(result, cv2.COLOR_RGB2BGR)
    success, buffer = cv2.imencode(".png", result_bgr)
    if not success:
        raise RuntimeError("Échec de l'encodage de l'image résultat.")

    return buffer.tobytes(), len(contours)


@router.post(
    "/segment",
    response_class=Response,
    responses={
        200: {"content": {"image/png": {}}, "description": "Image traitée (PNG)"},
        413: {"description": "Fichier trop grand"},
        415: {"description": "Extension non supportée"},
        422: {"description": "Image illisible"},
    },
)
async def segment(image: UploadFile = File(..., description="Image à segmenter")):
    """
    Reçoit une image (multipart/form-data, champ `image`)
    et retourne l'image PNG traitée directement dans le body.

    Headers de réponse :
    - `X-Contours-Count` : nombre de blooms détectés
    - `X-Original-Filename` : nom du fichier envoyé
    """

    # 1. Vérifier l'extension
    ext = image.filename.rsplit(".", 1)[-1].lower() if "." in image.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Extension '{ext}' non supportée. Acceptées : {sorted(ALLOWED_EXTENSIONS)}",
        )

    # 2. Lire et vérifier la taille
    image_bytes = await image.read()
    size_mb = len(image_bytes) / (1024 * 1024)
    if size_mb > MAX_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"Fichier trop grand ({size_mb:.1f} Mo). Maximum : {MAX_SIZE_MB} Mo.",
        )

    # 3. Traitement
    try:
        result_bytes, nb_contours = segmenter_bloom_colore(image_bytes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de traitement : {e}")

    # 4. Retourner l'image PNG + headers informatifs
    return Response(
        content=result_bytes,
        media_type="image/png",
        headers={
            "X-Contours-Count":    str(nb_contours),
            "X-Original-Filename": image.filename,
        },
    )