import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import json
from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Initialize MongoDB connection
mongo_client = MongoClient(os.getenv('MONGODB_URI'))
db = mongo_client.get_default_database()

# Load model and tokenizer
model = AutoModelForCausalLM.from_pretrained("your-model-path")
tokenizer = AutoTokenizer.from_pretrained("your-model-path")

@app.route('/api/generate', methods=['POST'])
def generate_response():
    try:
        data = request.json
        query = data.get('query')
        
        # Get relevant context from MongoDB if needed
        # Example: Search patient records
        relevant_records = db.patients.find(
            {"$text": {"$search": query}},
            {"score": {"$meta": "textScore"}}
        ).sort([("score", {"$meta": "textScore"})]).limit(5)
        
        context = " ".join([json.dumps(record) for record in relevant_records])
        
        # Generate response using your model
        inputs = tokenizer.encode(f"{context}\n{query}", return_tensors="pt")
        outputs = model.generate(
            inputs,
            max_length=150,
            num_return_sequences=1,
            no_repeat_ngram_size=2,
            temperature=0.7
        )
        
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        return jsonify({"response": response})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)