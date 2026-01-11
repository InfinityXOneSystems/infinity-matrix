"""Vertex AI integration for advanced analytics and ML."""

from typing import Any, dict, list

from infinity_matrix.core.config import settings
from infinity_matrix.core.logging import LoggerMixin


class VertexAIEngine(LoggerMixin):
    """Google Vertex AI integration for predictions and analytics."""

    def __init__(
        self,
        project_id: str | None = None,
        location: str | None = None,
    ):
        """Initialize Vertex AI client."""
        self.project_id = project_id or settings.google_cloud_project
        self.location = location or settings.vertex_ai_location

        if not self.project_id:
            raise ValueError("Google Cloud project ID not provided")

        try:
            from google.cloud import aiplatform

            aiplatform.init(
                project=self.project_id,
                location=self.location,
            )
            self.aiplatform = aiplatform

            self.log_info(
                "vertex_ai_initialized",
                project=self.project_id,
                location=self.location,
            )
        except ImportError:
            self.log_error("vertex_ai_import_failed")
            raise

    async def predict(
        self,
        model_id: str,
        instances: list[dict[str, Any]],
        parameters: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """
        Make predictions using a deployed Vertex AI model.

        Args:
            model_id: Model resource name or endpoint ID
            instances: list of prediction instances
            parameters: Additional prediction parameters

        Returns:
            Prediction results
        """
        try:
            endpoint = self.aiplatform.Endpoint(model_id)

            predictions = endpoint.predict(
                instances=instances,
                parameters=parameters or {},
            )

            self.log_info(
                "vertex_prediction_complete",
                model_id=model_id,
                num_predictions=len(predictions.predictions),
            )

            return {
                "predictions": predictions.predictions,
                "model_id": model_id,
                "success": True,
            }

        except Exception as e:
            self.log_error(
                "vertex_prediction_failed",
                model_id=model_id,
                error=str(e),
            )
            return {
                "error": str(e),
                "success": False,
            }

    async def analyze_text(
        self,
        text: str,
        analysis_type: str = "sentiment",
    ) -> dict[str, Any]:
        """
        Analyze text using Vertex AI Natural Language API.

        Args:
            text: Text to analyze
            analysis_type: Type of analysis (sentiment, entities, syntax)

        Returns:
            Analysis results
        """
        try:
            from google.cloud import language_v1

            client = language_v1.LanguageServiceClient()
            document = language_v1.Document(
                content=text,
                type_=language_v1.Document.Type.PLAIN_TEXT,
            )

            if analysis_type == "sentiment":
                response = client.analyze_sentiment(
                    request={"document": document}
                )
                return {
                    "sentiment_score": response.document_sentiment.score,
                    "sentiment_magnitude": response.document_sentiment.magnitude,
                    "success": True,
                }

            elif analysis_type == "entities":
                response = client.analyze_entities(
                    request={"document": document}
                )
                entities = [
                    {
                        "name": entity.name,
                        "type": language_v1.Entity.Type(entity.type_).name,
                        "salience": entity.salience,
                    }
                    for entity in response.entities
                ]
                return {
                    "entities": entities,
                    "success": True,
                }

            else:
                return {
                    "error": f"Unknown analysis type: {analysis_type}",
                    "success": False,
                }

        except Exception as e:
            self.log_error("vertex_text_analysis_failed", error=str(e))
            return {
                "error": str(e),
                "success": False,
            }

    async def batch_predict(
        self,
        model_id: str,
        input_data: list[dict[str, Any]],
        output_uri: str,
    ) -> dict[str, Any]:
        """
        Run batch prediction job.

        Args:
            model_id: Model resource name
            input_data: Batch input data
            output_uri: GCS URI for output

        Returns:
            Job information
        """
        try:
            model = self.aiplatform.Model(model_id)

            job = model.batch_predict(
                job_display_name="infinity_matrix_batch_prediction",
                instances_format="jsonl",
                predictions_format="jsonl",
                gcs_source=input_data,
                gcs_destination_prefix=output_uri,
            )

            self.log_info(
                "vertex_batch_prediction_started",
                job_id=job.resource_name,
            )

            return {
                "job_id": job.resource_name,
                "status": job.state.name,
                "success": True,
            }

        except Exception as e:
            self.log_error("vertex_batch_prediction_failed", error=str(e))
            return {
                "error": str(e),
                "success": False,
            }

    async def train_automl_model(
        self,
        dataset_id: str,
        model_display_name: str,
        target_column: str,
        prediction_type: str = "classification",
    ) -> dict[str, Any]:
        """
        Train an AutoML model.

        Args:
            dataset_id: Dataset resource name
            model_display_name: Display name for the model
            target_column: Target column name
            prediction_type: Type of prediction (classification, regression)

        Returns:
            Training job information
        """
        try:
            dataset = self.aiplatform.TabularDataset(dataset_id)

            if prediction_type == "classification":
                job = self.aiplatform.AutoMLTabularTrainingJob(
                    display_name=model_display_name,
                    optimization_prediction_type="classification",
                )
            else:
                job = self.aiplatform.AutoMLTabularTrainingJob(
                    display_name=model_display_name,
                    optimization_prediction_type="regression",
                )

            model = job.run(
                dataset=dataset,
                target_column=target_column,
                training_fraction_split=0.8,
                validation_fraction_split=0.1,
                test_fraction_split=0.1,
            )

            self.log_info(
                "vertex_automl_training_started",
                model_name=model.display_name,
            )

            return {
                "model_id": model.resource_name,
                "model_name": model.display_name,
                "success": True,
            }

        except Exception as e:
            self.log_error("vertex_automl_training_failed", error=str(e))
            return {
                "error": str(e),
                "success": False,
            }
