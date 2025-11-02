import os
import json
import sys
from transformers import pipeline
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Initialize MongoDB connection
mongo_client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017'))
db = mongo_client.get_default_database()

# Initialize AI model for conversational responses
# Using a smaller, more accessible model for healthcare conversations
try:
    # Try to load a conversational AI model
    chat_model = pipeline(
        "text-generation",
        model="microsoft/DialoGPT-medium",
        tokenizer="microsoft/DialoGPT-medium",
        device=-1  # Use CPU
    )
except:
    # Fallback to a simpler approach if model loading fails
    chat_model = None

def get_medical_context(query, user_id=None):
    """Get relevant medical context from database"""
    context = []

    try:
        # Search for relevant medical information
        if user_id:
            # Get user's medical history if available
            user_records = db.users.find_one({"_id": user_id})
            if user_records and "medicalHistory" in user_records:
                context.append(f"Patient medical history: {user_records['medicalHistory']}")

        # Search for general medical knowledge or similar cases
        # This would be enhanced with actual medical knowledge base
        medical_keywords = ["symptoms", "diagnosis", "treatment", "medication", "health"]
        if any(keyword in query.lower() for keyword in medical_keywords):
            context.append("This appears to be a medical inquiry. Please consult healthcare professionals for personalized advice.")

    except Exception as e:
        print(f"Error retrieving context: {e}")

    return " ".join(context)

def generate_health_response(query, user_id=None, context=None):
    """Generate AI response for health-related queries"""

    # Get medical context
    medical_context = get_medical_context(query, user_id)

    # Enhanced context from request
    if context:
        medical_context += f" Additional context: {json.dumps(context)}"

    # Create prompt for healthcare assistant
    system_prompt = """You are MedWallet AI, a helpful healthcare assistant. You provide general health information and guidance, but always remind users to consult healthcare professionals for personalized medical advice. You can help with:

- General health information
- Understanding medical terms
- Health tracking tips
- Wellness recommendations
- Medication reminders (general only)
- Symptom tracking guidance

IMPORTANT: Always include this disclaimer: "This is not medical advice. Please consult a healthcare professional for personalized recommendations."

For medical emergencies, direct users to seek immediate professional help."""

    full_prompt = f"{system_prompt}\n\nContext: {medical_context}\n\nUser Query: {query}\n\nResponse:"

    try:
        if chat_model:
            # Use the conversational model
            response = chat_model(
                full_prompt,
                max_length=200,
                num_return_sequences=1,
                temperature=0.7,
                do_sample=True,
                pad_token_id=50256
            )[0]['generated_text']

            # Clean up the response
            response = response.replace(full_prompt, "").strip()
        else:
            # Fallback response generation
            response = generate_fallback_response(query, medical_context)

    except Exception as e:
        print(f"AI generation error: {e}")
        response = generate_fallback_response(query, medical_context)

    # Ensure medical disclaimer is included
    if "consult a healthcare professional" not in response.lower():
        response += "\n\n*This is general health information, not medical advice. Please consult a healthcare professional for personalized recommendations.*"

    return {
        "response": response,
        "query": query,
        "context_used": bool(medical_context.strip()),
        "disclaimer_included": True
    }

def generate_fallback_response(query, context):
    """Generate a basic response when AI model is not available"""
    responses = {
        "symptoms": "I'm tracking your symptoms. Remember to consult a healthcare professional for proper diagnosis and treatment.",
        "medication": "For medication questions, please consult your healthcare provider or pharmacist. I can help you track your medication schedule.",
        "appointment": "I can help you schedule appointments and send reminders. Would you like me to check your upcoming appointments?",
        "health": "I'm here to support your health journey. I can help track your wellness goals, remind you of check-ups, and provide general health information.",
    }

    # Find matching response
    for key, response in responses.items():
        if key in query.lower():
            return response

    # Default response
    return "I'm your MedWallet AI assistant. I can help you track your health, manage appointments, and provide general wellness information. How can I assist you today?"

def main():
    """Main function to handle AI service requests"""
    # Get environment variables
    query = os.getenv('QUERY', '')
    user_id = os.getenv('USER_ID', '')
    context_str = os.getenv('CONTEXT', '{}')

    try:
        context = json.loads(context_str) if context_str else {}
    except:
        context = {}

    if not query:
        result = {"error": "No query provided"}
    else:
        result = generate_health_response(query, user_id, context)

    # Output JSON result
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
