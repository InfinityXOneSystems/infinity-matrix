"""AI Voice Agent Integration using OpenAI and Twilio"""

import json
import os
from datetime import datetime
from typing import Any, dict

import openai
from dotenv import load_dotenv
from twilio.rest import Client
from twilio.twiml.voice_response import Gather, VoiceResponse

load_dotenv()


class VoiceAgent:
    """AI-powered voice agent for lead qualification calls"""

    def __init__(self):
        # Initialize with graceful degradation for missing API keys
        openai_key = os.getenv("OPENAI_API_KEY")
        twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
        twilio_token = os.getenv("TWILIO_AUTH_TOKEN")

        # Initialize OpenAI client with error handling
        self.openai_client = None
        if openai_key:
            try:
                self.openai_client = openai.OpenAI(api_key=openai_key)
            except Exception as e:
                print(f"Warning: Failed to initialize OpenAI client: {e}")

        # Initialize Twilio client with error handling
        self.twilio_client = None
        if twilio_sid and twilio_token:
            try:
                self.twilio_client = Client(twilio_sid, twilio_token)
            except Exception as e:
                print(f"Warning: Failed to initialize Twilio client: {e}")

        self.twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
        self.conversation_history: dict[str, list] = {}

    async def initiate_call(self, phone_number: str, callback_url: str) -> dict[str, Any]:
        """Initiate an outbound call to a lead"""
        if not self.twilio_client:
            raise Exception("Twilio client not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables.")

        if not self.twilio_phone:
            raise Exception("Twilio phone number not configured. Please set TWILIO_PHONE_NUMBER environment variable.")

        try:
            call = self.twilio_client.calls.create(
                to=phone_number,
                from_=self.twilio_phone,
                url=callback_url,
                status_callback=f"{callback_url}/status",
                status_callback_event=['initiated', 'ringing', 'answered', 'completed'],
                record=True
            )

            return {
                "call_sid": call.sid,
                "status": call.status,
                "phone_number": phone_number,
                "started_at": datetime.utcnow()
            }
        except Exception as e:
            raise Exception(f"Failed to initiate call: {str(e)}")

    def generate_greeting_twiml(self) -> str:
        """Generate initial greeting TwiML"""
        response = VoiceResponse()
        gather = Gather(
            input='speech',
            action='/api/voice/process',
            method='POST',
            speech_timeout='auto',
            language='en-US'
        )
        gather.say(
            "Hello! Thank you for your interest. I'm an AI assistant helping to understand "
            "your needs. May I have your name please?",
            voice='Polly.Joanna'
        )
        response.append(gather)
        return str(response)

    async def process_speech(
        self,
        call_sid: str,
        speech_result: str,
        conversation_stage: str = "greeting"
    ) -> dict[str, Any]:
        """Process speech input and generate AI response"""

        # Initialize conversation history if needed
        if call_sid not in self.conversation_history:
            self.conversation_history[call_sid] = [
                {
                    "role": "system",
                    "content": (
                        "You are a professional, friendly AI sales assistant conducting a lead "
                        "qualification call. Your goal is to:\n"
                        "1. Get the person's name\n"
                        "2. Understand their company and role\n"
                        "3. Learn about their needs and pain points\n"
                        "4. Assess their interest level\n"
                        "5. Schedule a callback with a human sales representative\n\n"
                        "Be conversational, empathetic, and professional. Keep responses concise "
                        "(2-3 sentences). Extract key information naturally without being pushy."
                    )
                }
            ]

        # Add user's speech to history
        self.conversation_history[call_sid].append({
            "role": "user",
            "content": speech_result
        })

        # Get AI response
        if not self.openai_client:
            return {
                "response": "I apologize, the AI service is currently unavailable. A team member will call you back shortly.",
                "extracted_info": {},
                "conversation_complete": True,
                "error": "OpenAI client not configured"
            }

        try:
            completion = self.openai_client.chat.completions.create(
                model=os.getenv("AI_VOICE_MODEL", "gpt-4-turbo-preview"),
                messages=self.conversation_history[call_sid],
                temperature=float(os.getenv("AI_VOICE_TEMPERATURE", "0.7")),
                max_tokens=150
            )

            ai_response = completion.choices[0].message.content

            # Add AI response to history
            self.conversation_history[call_sid].append({
                "role": "assistant",
                "content": ai_response
            })

            # Extract structured information from conversation
            extracted_info = await self._extract_information(call_sid)

            return {
                "response": ai_response,
                "extracted_info": extracted_info,
                "conversation_complete": self._is_conversation_complete(extracted_info)
            }

        except Exception as e:
            return {
                "response": "I apologize, I'm having technical difficulties. A team member will call you back shortly.",
                "error": str(e),
                "conversation_complete": True
            }

    def generate_response_twiml(self, ai_response: str, is_complete: bool = False) -> str:
        """Generate TwiML for AI response"""
        response = VoiceResponse()

        if not is_complete:
            gather = Gather(
                input='speech',
                action='/api/voice/process',
                method='POST',
                speech_timeout='auto',
                language='en-US'
            )
            gather.say(ai_response, voice='Polly.Joanna')
            response.append(gather)
        else:
            response.say(ai_response, voice='Polly.Joanna')
            response.say(
                "Thank you for your time. You'll receive a confirmation shortly. Goodbye!",
                voice='Polly.Joanna'
            )
            response.hangup()

        return str(response)

    async def _extract_information(self, call_sid: str) -> dict[str, Any]:
        """Extract structured information from conversation using AI"""

        if not self.openai_client:
            return {}

        conversation_text = "\n".join([
            f"{msg['role']}: {msg['content']}"
            for msg in self.conversation_history[call_sid]
            if msg['role'] != 'system'
        ])

        extraction_prompt = f"""
        From the following conversation, extract and return a JSON object with these fields:
        - name: person's full name
        - company: company name
        - role: job title/role
        - needs: their expressed needs or pain points
        - interest_level: low/medium/high based on engagement
        - preferred_callback_time: any mentioned preferred time
        - email: email address if provided

        Conversation:
        {conversation_text}

        Return only valid JSON, use null for missing fields.
        """

        try:
            completion = self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": extraction_prompt}],
                response_format={"type": "json_object"}
            )

            extracted = json.loads(completion.choices[0].message.content)
            return extracted
        except Exception:
            return {}

    def _is_conversation_complete(self, extracted_info: dict[str, Any]) -> bool:
        """Determine if enough information has been collected"""
        required_fields = ['name', 'company']
        return all(extracted_info.get(field) for field in required_fields)

    async def generate_conversation_summary(self, call_sid: str) -> dict[str, Any]:
        """Generate a summary and sentiment analysis of the conversation"""

        if call_sid not in self.conversation_history:
            return {
                "summary": "No conversation data available",
                "sentiment": "neutral",
                "score": 50
            }

        if not self.openai_client:
            return {
                "summary": "AI summary unavailable",
                "sentiment": "neutral",
                "score": 50
            }

        conversation_text = "\n".join([
            f"{msg['role']}: {msg['content']}"
            for msg in self.conversation_history[call_sid]
            if msg['role'] != 'system'
        ])

        summary_prompt = f"""
        Analyze this sales call conversation and provide:
        1. A concise summary (2-3 sentences)
        2. Sentiment (positive/neutral/negative)
        3. Lead quality score (0-100)
        4. Key takeaways

        Conversation:
        {conversation_text}

        Return as JSON with fields: summary, sentiment, score, takeaways (array)
        """

        try:
            completion = self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": summary_prompt}],
                response_format={"type": "json_object"}
            )

            result = json.loads(completion.choices[0].message.content)
            return result
        except Exception as e:
            return {
                "summary": "Error generating summary",
                "sentiment": "neutral",
                "score": 50,
                "error": str(e)
            }

    def get_call_recording_url(self, call_sid: str) -> str | None:
        """Get the URL of the call recording"""
        if not self.twilio_client:
            return None
        try:
            recordings = self.twilio_client.recordings.list(call_sid=call_sid, limit=1)
            if recordings:
                recording = recordings[0]
                return f"https://api.twilio.com{recording.uri.replace('.json', '.mp3')}"
            return None
        except Exception:
            return None

    def cleanup_conversation(self, call_sid: str):
        """Clean up conversation history after call completion"""
        if call_sid in self.conversation_history:
            del self.conversation_history[call_sid]


# Global instance
voice_agent = VoiceAgent()
