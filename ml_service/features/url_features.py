import re
from urllib.parse import urlparse
import tldextract
from typing import Dict

class URLFeatureExtractor:
    """Extract features from URLs for phishing detection"""
    
    def extract_features(self, url: str) -> Dict:
        """Extract all features from a URL"""
        try:
            parsed = urlparse(url)
            extracted = tldextract.extract(url)
            
            features = {
                # Length-based features
                'url_length': len(url),
                'domain_length': len(parsed.netloc),
                'path_length': len(parsed.path),
                
                # Character-based features
                'num_dots': url.count('.'),
                'num_hyphens': url.count('-'),
                'num_underscores': url.count('_'),
                'num_slashes': url.count('/'),
                'num_questionmarks': url.count('?'),
                'num_equal': url.count('='),
                'num_at': url.count('@'),
                'num_ampersand': url.count('&'),
                'num_exclamation': url.count('!'),
                'num_tilde': url.count('~'),
                'num_comma': url.count(','),
                'num_plus': url.count('+'),
                'num_asterisk': url.count('*'),
                'num_hashtag': url.count('#'),
                'num_dollar': url.count('$'),
                'num_percent': url.count('%'),
                
                # Protocol and security
                'is_https': int(parsed.scheme == 'https'),
                'has_ip': int(self._has_ip_address(parsed.netloc)),
                
                # Domain features
                'subdomain_level': len(extracted.subdomain.split('.')) if extracted.subdomain else 0,
                'has_www': int('www' in parsed.netloc),
                
                # Suspicious patterns
                'has_suspicious_words': int(self._has_suspicious_words(url)),
                'digit_ratio': self._calculate_digit_ratio(url),
                'letter_ratio': self._calculate_letter_ratio(url),
                
                # Path features
                'path_depth': len([x for x in parsed.path.split('/') if x]),
                
                # Query features
                'num_query_params': len(parsed.query.split('&')) if parsed.query else 0,
            }
            
            return features
            
        except Exception as e:
            raise Exception(f"Feature extraction failed: {str(e)}")
    
    def _has_ip_address(self, domain: str) -> bool:
        """Check if domain contains IP address"""
        ip_pattern = r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
        return bool(re.search(ip_pattern, domain))
    
    def _has_suspicious_words(self, url: str) -> bool:
        """Check for suspicious keywords"""
        suspicious_words = [
            'login', 'signin', 'account', 'update', 'verify', 'secure',
            'banking', 'paypal', 'amazon', 'ebay', 'password', 'confirm',
            'suspend', 'restricted', 'alert', 'notification'
        ]
        url_lower = url.lower()
        return any(word in url_lower for word in suspicious_words)
    
    def _calculate_digit_ratio(self, url: str) -> float:
        """Calculate ratio of digits in URL"""
        if len(url) == 0:
            return 0.0
        digits = sum(c.isdigit() for c in url)
        return digits / len(url)
    
    def _calculate_letter_ratio(self, url: str) -> float:
        """Calculate ratio of letters in URL"""
        if len(url) == 0:
            return 0.0
        letters = sum(c.isalpha() for c in url)
        return letters / len(url)
