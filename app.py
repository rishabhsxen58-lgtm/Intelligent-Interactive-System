import os
from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk

app = Flask(__name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'sample_training.csv')
df = pd.read_csv(DATA_PATH)
texts = (df['title'].fillna('') + ' ' + df['description'].fillna('')).tolist()
categories = df['category'].tolist()
vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(texts)

try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except:
    nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

def classify_category(text):
    v = vectorizer.transform([text])
    sims = cosine_similarity(v, X)[0]
    idx = sims.argmax()
    return categories[idx], float(sims[idx])

def extract_keywords(text, top_k=5):
    v = vectorizer.transform([text])
    scores = v.toarray()[0]
    idxs = scores.argsort()[::-1]
    feature_names = vectorizer.get_feature_names_out()
    out = []
    for i in idxs:
        if scores[i] <= 0:
            continue
        out.append(feature_names[i])
        if len(out) >= top_k:
            break
    return out

def compute_priority(sent, keywords):
    s = sent
    boost = 0
    urgent_words = {'urgent','water','electricity','medical','fire','police','road','sewage','crime','hospital'}
    for k in keywords:
        if k.lower() in urgent_words:
            boost += 0.2
    score = min(1.0, max(0.0, 0.5 + s * 0.5 + boost))
    return score

def severity_from_priority(p):
    if p >= 0.8:
        return 'Critical'
    if p >= 0.6:
        return 'Urgent'
    return 'Normal'

@app.post('/analyze')
def analyze():
    data = request.get_json(force=True)
    title = data.get('title','')
    description = data.get('description','')
    text = (title + ' ' + description).strip()
    sent = sia.polarity_scores(text)['compound']
    category, sim = classify_category(text)
    keywords = extract_keywords(text)
    priority = compute_priority(sent, keywords)
    severity = severity_from_priority(priority)
    return jsonify({
        'category': category,
        'sentiment_score': float(sent),
        'priority_score': float(priority),
        'similarity_score': float(sim),
        'severity_level': severity,
        'keywords': keywords
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', '8001'))
    app.run(host='0.0.0.0', port=port)
