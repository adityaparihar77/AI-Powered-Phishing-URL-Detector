from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from dotenv import load_dotenv
import os

from model.url_classifier import URLClassifier
from features.url_features import URLFeatureExtractor

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize ML components
feature_extractor = URLFeatureExtractor()
classifier = URLClassifier()

# Train model on startup (in production, load pre-trained model)
try:
    logger.info("Training ML model...")
    classifier.train()
    logger.info("Model trained successfully")
except Exception as e:
    logger.error(f"Failed to train model: {e}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'service': 'ml-service',
        'model_loaded': classifier.model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Predict if URL is phishing or legitimate"""
    try:
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({
                'error': 'URL is required'
            }), 400
        
        url = data['url']
        
        # Extract features
        features = feature_extractor.extract_features(url)
        
        # Make prediction
        prediction, confidence = classifier.predict(features)
        
        logger.info(f"Prediction for {url}: {prediction} (confidence: {confidence:.2f})")
        
        return jsonify({
            'url': url,
            'prediction': int(prediction),
            'confidence': float(confidence),
            'features': features,
            'is_phishing': bool(prediction == 1)
        })
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get model information"""
    try:
        info = classifier.get_model_info()
        return jsonify(info)
    except Exception as e:
        logger.error(f"Model info error: {e}")
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/model/retrain', methods=['POST'])
def retrain_model():
    """Retrain the model with new data"""
    try:
        logger.info("Retraining model...")
        classifier.train()
        logger.info("Model retrained successfully")
        
        return jsonify({
            'success': True,
            'message': 'Model retrained successfully'
        })
    except Exception as e:
        logger.error(f"Retrain error: {e}")
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
