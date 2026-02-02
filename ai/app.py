from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(title="Smart Complaint AI")

class TextPayload(BaseModel):
    title: Optional[str]
    description: Optional[str]


@app.post('/predict_text')
def predict_text(payload: TextPayload):
    """
    AI Priority Scoring System:
    
    HIGH Priority (3+ points):
    - Life-threatening situations: collapse, flood, fire, accident, electrocute, danger
    - Affecting large population: blocked roads, power outages, water supply issues
    
    MEDIUM Priority (2 points):
    - Significant service disruption: overflow, major damage, leak, no power
    - Urgent but not life-threatening
    
    LOW Priority (0-1 points):
    - Minor issues: pothole, dusty, dirty, small maintenance
    
    The system scans complaint text (title + description) for keywords
    and calculates priority based on severity scoring.
    """
    text = (payload.title or '') + ' ' + (payload.description or '')
    text = text.lower()
    
    # High priority keywords (3 points each)
    high_keywords = [
        'collapse', 'collapsed', 'collapsing',
        'flood', 'flooding', 'flooded',
        'fire', 'burning',
        'accident', 'crash',
        'electrocute', 'electrocution', 'shock',
        'danger', 'dangerous',
        'critical', 'emergency', 'urgent',
        'dead', 'death', 'dying',
        'injury', 'injured', 'bleeding'
    ]
    
    # Medium priority keywords (2 points)
    medium_keywords = [
        'blocked', 'blocking',
        'overflow', 'overflowing',
        'major', 'severe',
        'leak', 'leaking',
        'no power', 'no water', 'no electricity',
        'broken', 'damage', 'damaged',
        'out of service', 'not working',
        'urgent repair'
    ]
    
    # Low priority keywords (1 point - deduction)
    low_keywords = [
        'pothole', 'small', 'minor',
        'dusty', 'dirty', 'dirty',
        'maintenance', 'cosmetic',
        'slow', 'delayed'
    ]
    
    score = 0
    matched_keywords = []
    
    for k in high_keywords:
        if k in text:
            score += 3
            matched_keywords.append(f"{k} (HIGH)")
    
    for k in medium_keywords:
        if k in text:
            score += 2
            matched_keywords.append(f"{k} (MEDIUM)")
    
    for k in low_keywords:
        if k in text:
            score -= 1
            matched_keywords.append(f"{k} (LOW)")
    
    # Calculate description length (longer = more detail = higher priority)
    desc_length = len(payload.description or '')
    if desc_length > 300:
        score += 1
    elif desc_length > 100:
        score += 0.5
    
    # Determine priority based on score
    if score >= 3:
        priority = 'High'
    elif score >= 2:
        priority = 'Medium'
    else:
        priority = 'Low'
    
    confidence = min(0.95, max(0.5, 0.5 + (score / 10)))
    
    return {
        'priority': priority,
        'confidence': round(confidence, 2),
        'score': round(score, 1),
        'keywords_matched': matched_keywords[:5]  # Top 5 matched keywords
    }


@app.post('/predict_image')
async def predict_image(file: UploadFile = File(...)):
    """
    Image-based damage detection (placeholder)
    In production, this would run a CNN model to detect damage
    """
    content = await file.read()
    # naive heuristic: image presence indicates attached evidence
    damage = 0.6
    return {
        'damage_score': damage,
        'priority': 'Medium',
        'confidence': 0.6,
        'note': 'Image evidence increases reliability'
    }


@app.get('/info')
def get_info():
    return {
        'name': 'Smart Complaint AI Service',
        'version': '1.0',
        'endpoints': [
            {'path': '/predict_text', 'method': 'POST', 'description': 'Analyze complaint text for priority'},
            {'path': '/predict_image', 'method': 'POST', 'description': 'Analyze complaint image for damage'},
            {'path': '/info', 'method': 'GET', 'description': 'Service information'}
        ]
    }


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8001)
