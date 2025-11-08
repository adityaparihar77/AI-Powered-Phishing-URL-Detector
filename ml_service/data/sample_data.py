"""
Generate sample training data for phishing detection
In production, use real datasets like:
- PhishTank dataset
- OpenPhish feeds
- APWG eCrime Exchange
"""

def generate_sample_data():
    """Generate sample URLs for training (labeled as phishing=1 or legitimate=0)"""
    
    # Legitimate URLs (label = 0)
    legitimate_urls = [
        'https://www.google.com',
        'https://www.facebook.com',
        'https://www.amazon.com',
        'https://www.microsoft.com',
        'https://www.apple.com',
        'https://www.wikipedia.org',
        'https://www.github.com',
        'https://www.stackoverflow.com',
        'https://www.reddit.com',
        'https://www.twitter.com',
        'https://www.linkedin.com',
        'https://www.youtube.com',
        'https://www.instagram.com',
        'https://www.netflix.com',
        'https://www.spotify.com',
        'https://www.dropbox.com',
        'https://www.adobe.com',
        'https://www.salesforce.com',
        'https://www.oracle.com',
        'https://www.ibm.com',
        'https://docs.python.org/3/',
        'https://nodejs.org/en/',
        'https://reactjs.org/',
        'https://www.mongodb.com/',
        'https://www.postgresql.org/',
    ]
    
    # Phishing URLs (label = 1) - synthetic examples
    phishing_urls = [
        'http://paypal-secure-login.suspicious.com/verify',
        'http://amazon-account-update.xyz/signin',
        'http://microsoft-security-alert.info/update-password',
        'http://apple-id-locked.net/unlock',
        'http://facebook-security-check.biz/verify-account',
        'http://google-account-suspended.tk/restore',
        'http://netflix-payment-failed.ml/update-billing',
        'http://linkedin-profile-views.ga/login',
        'http://instagram-verify-badge.cf/confirm',
        'http://twitter-security-alert.gq/verify',
        'http://dropbox-file-share.icu/download',
        'http://adobe-license-expired.online/renew',
        'http://outlook-mailbox-full.site/upgrade',
        'http://chase-fraud-alert.xyz/verify-account',
        'http://wellsfargo-security.info/login',
        'http://bankofamerica-alerts.net/verify',
        'http://usps-package-delivery.xyz/track',
        'http://fedex-shipment-notification.info/details',
        'http://dhl-package-arrival.biz/confirm',
        'http://irs-tax-refund.online/claim',
        'http://192.168.1.1/paypal-login',
        'http://amaz0n-account.com/signin',
        'http://g00gle-security.net/verify',
        'http://micr0soft-update.info/download',
        'http://app1e-id-verify.com/login',
    ]
    
    # Create labeled dataset
    data = []
    
    # Add legitimate URLs with label 0
    for url in legitimate_urls:
        data.append((url, 0))
    
    # Add phishing URLs with label 1
    for url in phishing_urls:
        data.append((url, 1))
    
    # Add more variations
    for i in range(20):
        # More legitimate
        data.append((f'https://legitimate-site-{i}.com/page', 0))
        data.append((f'https://www.company{i}.org/products', 0))
        
        # More phishing
        data.append((f'http://verify-account-{i}.xyz/login', 1))
        data.append((f'http://secure-update-{i}.tk/signin', 1))
        data.append((f'http://alert-security-{i}.ml/verify', 1))
    
    return data

def load_external_dataset(filepath):
    """Load external phishing dataset (placeholder for real implementation)"""
    # In production, implement loading from:
    # - CSV files from PhishTank
    # - JSON feeds from OpenPhish
    # - Custom labeled datasets
    pass
