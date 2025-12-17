import os
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")


class EmpathyAgent:
    """
    LLM-based agent for empathetic, human-like explanations.
    Uses Gemini API (cost-friendly).
    """

    @staticmethod
    def generate_response(eligibility_result):
        decision = eligibility_result.decision
        score = eligibility_result.eligibility_score
        risk = eligibility_result.risk_probability
        reason = eligibility_result.reason or "multiple financial factors"

        prompt = f"""
You are Tata Mitra, a warm and supportive loan advisor AI.

Current Situation:
- Loan Decision: {decision}
- Risk Level: {risk}
- Main Factor: {reason}

Task:
Generate a JSON response with two fields:
1. "title": A short, 3-5 word encouraging header (e.g., "Great News!", "Application Update", "Review Status").
2. "message": A warm, human-like paragraph (max 3 sentences) explaining the situation to the user in a kind tone.

Output strictly valid JSON.
"""

        try:
            response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            import json
            return json.loads(response.text)
        except Exception as e:
            print(f"EmpathyAgent Error: {e}")
            return {
                "title": "Application Status",
                "message": f"Loan decision: {decision}. We encourage you to review the improvement factors below."
            }
