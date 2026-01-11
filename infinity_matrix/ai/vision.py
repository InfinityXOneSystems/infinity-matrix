"""Vision Cortex - Image and document analysis using Google Vision API."""

import base64
from typing import Any, dict, list

from infinity_matrix.core.logging import LoggerMixin


class VisionCortex(LoggerMixin):
    """Vision analysis engine for OCR, object detection, and document processing."""

    def __init__(self):
        """Initialize Vision API client."""
        try:
            from google.cloud import vision

            self.client = vision.ImageAnnotatorClient()
            self.vision = vision

            self.log_info("vision_cortex_initialized")
        except ImportError:
            self.log_error("vision_api_import_failed")
            raise

    async def analyze_image(
        self,
        image_path: str | None = None,
        image_url: str | None = None,
        image_bytes: bytes | None = None,
        features: list[str] | None = None,
    ) -> dict[str, Any]:
        """
        Analyze image with various detection features.

        Args:
            image_path: Local path to image
            image_url: URL of image
            image_bytes: Raw image bytes
            features: list of features to detect (labels, faces, text, etc.)

        Returns:
            Analysis results
        """
        # Load image
        if image_path:
            with open(image_path, "rb") as f:
                content = f.read()
        elif image_url:
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get(image_url)
                content = response.content
        elif image_bytes:
            content = image_bytes
        else:
            raise ValueError("Must provide image_path, image_url, or image_bytes")

        image = self.vision.Image(content=content)

        # Default features if none specified
        if not features:
            features = ["labels", "text", "objects", "faces"]

        results: dict[str, Any] = {}

        try:
            # Label detection
            if "labels" in features:
                response = self.client.label_detection(image=image)
                results["labels"] = [
                    {
                        "description": label.description,
                        "score": label.score,
                        "topicality": label.topicality,
                    }
                    for label in response.label_annotations
                ]

            # Text detection (OCR)
            if "text" in features:
                response = self.client.text_detection(image=image)
                if response.text_annotations:
                    results["text"] = response.text_annotations[0].description
                    results["text_regions"] = [
                        {
                            "text": text.description,
                            "bounds": [
                                {
                                    "x": vertex.x,
                                    "y": vertex.y,
                                }
                                for vertex in text.bounding_poly.vertices
                            ],
                        }
                        for text in response.text_annotations[1:]
                    ]

            # Object detection
            if "objects" in features:
                response = self.client.object_localization(image=image)
                results["objects"] = [
                    {
                        "name": obj.name,
                        "score": obj.score,
                        "bounds": [
                            {
                                "x": vertex.x,
                                "y": vertex.y,
                            }
                            for vertex in obj.bounding_poly.normalized_vertices
                        ],
                    }
                    for obj in response.localized_object_annotations
                ]

            # Face detection
            if "faces" in features:
                response = self.client.face_detection(image=image)
                results["faces"] = [
                    {
                        "joy": face.joy_likelihood.name,
                        "sorrow": face.sorrow_likelihood.name,
                        "anger": face.anger_likelihood.name,
                        "surprise": face.surprise_likelihood.name,
                        "detection_confidence": face.detection_confidence,
                    }
                    for face in response.face_annotations
                ]

            # Landmark detection
            if "landmarks" in features:
                response = self.client.landmark_detection(image=image)
                results["landmarks"] = [
                    {
                        "description": landmark.description,
                        "score": landmark.score,
                    }
                    for landmark in response.landmark_annotations
                ]

            # Logo detection
            if "logos" in features:
                response = self.client.logo_detection(image=image)
                results["logos"] = [
                    {
                        "description": logo.description,
                        "score": logo.score,
                    }
                    for logo in response.logo_annotations
                ]

            # Safe search detection
            if "safe_search" in features:
                response = self.client.safe_search_detection(image=image)
                safe = response.safe_search_annotation
                results["safe_search"] = {
                    "adult": safe.adult.name,
                    "violence": safe.violence.name,
                    "racy": safe.racy.name,
                }

            self.log_info("vision_analysis_complete", features=features)
            results["success"] = True
            return results

        except Exception as e:
            self.log_error("vision_analysis_failed", error=str(e))
            return {
                "error": str(e),
                "success": False,
            }

    async def extract_document_text(
        self,
        document_path: str,
        language_hints: list[str] | None = None,
    ) -> dict[str, Any]:
        """
        Extract text from document (PDF, DOCX, etc.).

        Args:
            document_path: Path to document
            language_hints: Language hints for OCR

        Returns:
            Extracted text and metadata
        """
        try:
            with open(document_path, "rb") as f:
                content = f.read()

            image = self.vision.Image(content=content)

            # Configure OCR
            image_context = self.vision.ImageContext(
                language_hints=language_hints or ["en"]
            )

            response = self.client.document_text_detection(
                image=image,
                image_context=image_context,
            )

            if response.full_text_annotation:
                text = response.full_text_annotation.text
                pages = []

                for page in response.full_text_annotation.pages:
                    page_info = {
                        "width": page.width,
                        "height": page.height,
                        "blocks": len(page.blocks),
                    }
                    pages.append(page_info)

                self.log_info(
                    "document_text_extracted",
                    document=document_path,
                    pages=len(pages),
                )

                return {
                    "text": text,
                    "pages": pages,
                    "success": True,
                }
            else:
                return {
                    "error": "No text found in document",
                    "success": False,
                }

        except Exception as e:
            self.log_error("document_extraction_failed", error=str(e))
            return {
                "error": str(e),
                "success": False,
            }

    async def analyze_batch_images(
        self,
        image_paths: list[str],
        features: list[str] | None = None,
    ) -> list[dict[str, Any]]:
        """
        Analyze multiple images in batch.

        Args:
            image_paths: list of image paths
            features: Features to detect

        Returns:
            list of analysis results
        """
        import asyncio

        tasks = [
            self.analyze_image(image_path=path, features=features)
            for path in image_paths
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        self.log_info("batch_analysis_complete", count=len(results))
        return results

    def encode_image_base64(self, image_path: str) -> str:
        """Encode image as base64 string."""
        with open(image_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
