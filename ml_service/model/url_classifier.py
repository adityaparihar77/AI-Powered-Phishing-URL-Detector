import os
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import logging

from features.url_features import URLFeatureExtractor
from data.sample_data import generate_sample_data

logger = logging.getLogger(__name__)

class URLClassifier:
    """ML classifier for phishing URL detection"""
    
    def __init__(self, model_path='models/phishing_detector.pkl'):
        self.model_path = model_path
        self.model = None
        self.feature_extractor = URLFeatureExtractor()
        self.feature_names = None
        
        # Try to load existing model
        if os.path.exists(model_path):
            self.load_model()
    
    def train(self, data=None):
        """Train the classifier"""
        try:
            # Generate or use provided training data
            if data is None:
                logger.info("Generating sample training data...")
                data = generate_sample_data()
            
            # Extract features for all URLs
            logger.info("Extracting features...")
            X_data = []
            y_data = []
            
            for url, label in data:
                try:
                    features = self.feature_extractor.extract_features(url)
                    X_data.append(list(features.values()))
                    y_data.append(label)
                    
                    if self.feature_names is None:
                        self.feature_names = list(features.keys())
                except Exception as e:
                    logger.warning(f"Failed to extract features for {url}: {e}")
                    continue
            
            X = np.array(X_data)
            y = np.array(y_data)
            
            logger.info(f"Training with {len(X)} samples...")
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Train Random Forest classifier
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
            
            self.model.fit(X_train, y_train)
            
            # Evaluate
            y_pred = self.model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            precision = precision_score(y_test, y_pred)
            recall = recall_score(y_test, y_pred)
            f1 = f1_score(y_test, y_pred)
            
            logger.info(f"Model Performance:")
            logger.info(f"  Accuracy:  {accuracy:.4f}")
            logger.info(f"  Precision: {precision:.4f}")
            logger.info(f"  Recall:    {recall:.4f}")
            logger.info(f"  F1 Score:  {f1:.4f}")
            
            # Save model
            self.save_model()
            
            return {
                'accuracy': accuracy,
                'precision': precision,
                'recall': recall,
                'f1_score': f1
            }
            
        except Exception as e:
            logger.error(f"Training failed: {e}")
            raise
    
    def predict(self, features: dict):
        """Make prediction for a URL"""
        if self.model is None:
            raise Exception("Model not trained or loaded")
        
        # Convert features dict to array in correct order
        feature_vector = [features[name] for name in self.feature_names]
        X = np.array([feature_vector])
        
        # Get prediction and probability
        prediction = self.model.predict(X)[0]
        probabilities = self.model.predict_proba(X)[0]
        
        # Confidence is the probability of the predicted class
        confidence = probabilities[prediction]
        
        return prediction, confidence
    
    def save_model(self):
        """Save model to disk"""
        try:
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            
            model_data = {
                'model': self.model,
                'feature_names': self.feature_names
            }
            
            with open(self.model_path, 'wb') as f:
                pickle.dump(model_data, f)
            
            logger.info(f"Model saved to {self.model_path}")
        except Exception as e:
            logger.error(f"Failed to save model: {e}")
            raise
    
    def load_model(self):
        """Load model from disk"""
        try:
            with open(self.model_path, 'rb') as f:
                model_data = pickle.load(f)
            
            self.model = model_data['model']
            self.feature_names = model_data['feature_names']
            
            logger.info(f"Model loaded from {self.model_path}")
        except Exception as e:
            logger.warning(f"Failed to load model: {e}")
    
    def get_model_info(self):
        """Get information about the model"""
        if self.model is None:
            return {'status': 'not_trained'}
        
        return {
            'status': 'trained',
            'model_type': 'RandomForestClassifier',
            'n_features': len(self.feature_names) if self.feature_names else 0,
            'feature_names': self.feature_names,
            'n_estimators': self.model.n_estimators if hasattr(self.model, 'n_estimators') else None
        }
