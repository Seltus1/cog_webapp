import openai
import json
from datetime import datetime
import os
from dotenv import load_dotenv
import re

# ============================================
# 1. LOAD API KEY FROM .env
# ============================================
load_dotenv()  # Looks for .env file in the same directory

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

if not DEEPSEEK_API_KEY:
    raise ValueError("❌ DEEPSEEK_API_KEY not found in .env file!")

# ============================================
# 2. CONFIGURE DEEPSEEK CLIENT
# ============================================
client = openai.OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com/v1"
)

# ============================================
# 3. LOAD YOUR DATA
# ============================================
with open("session_level_export.json", "r") as f:
    data = json.load(f)

print(f"📂 Loaded {len(data)} participants")

# ============================================
# 4. PREPARE PROMPTS (Your Full Prompt)
# ============================================
system_prompt = """You are an expert qualitative researcher coding participant feedback for a cognitive psychology experiment involving doors, shapes, colors, and numbers.

You must output valid JSON only. No markdown, no extra text, no explanations.

The JSON should be an array of objects, each with these fields:
- session_id (string)
- true_rule_identified (boolean or null): true if they explicitly mention counting shapes/symbols on the door
- stated_mechanism (string): one of ['count_shapes', 'highest_number', 'lowest_number', 'ascending_order', 'colour_match', 'shape_match', 'ambiguous_combination', 'intuition_random', 'other']
- articulation_depth (integer 1-3): 1=vague/short, 2=descriptive, 3=detailed trial-and-error explanation
- confidence_indicators (string): extract words showing certainty (e.g., "definitely", "I think", "couldn't figure out")
- key_evidence_quote (string): the exact sentence that best supports your coding
- notes (string): any unique behaviors or comments (e.g., "mentioned confusion about instructions", "enjoyed the game")
"""

user_prompt = f"""Analyze the following participant data and add the coding fields described above. 
Return a JSON array with the same number of objects as the input.

Input data:
{json.dumps(data, indent=2)}
"""

# ============================================
# 5. MAKE THE API CALL
# ============================================
print("🚀 Sending request to DeepSeek API...")

response = client.chat.completions.create(
    model="deepseek-chat",  # NOT "deepseek-reasoner" (R1 adds thinking tokens)
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ],
    temperature=0.0,
    response_format={"type": "json_object"}  # Forces valid JSON
)

print("✅ Response received!")

# ============================================
# 6. EXTRACT & CLEAN RESPONSE
# ============================================
raw_output = response.choices[0].message.content

# DeepSeek sometimes wraps JSON in markdown code blocks — clean it
cleaned_output = re.sub(r'```json\s*|\s*```', '', raw_output)
cleaned_output = cleaned_output.strip()

# Parse the coded data
try:
    coded_data = json.loads(cleaned_output)
except json.JSONDecodeError as e:
    print(f"❌ JSON parsing failed: {e}")
    print(f"Raw output (first 500 chars):\n{raw_output[:500]}")
    # Save raw output for debugging
    with open("raw_debug_output.txt", "w") as f:
        f.write(raw_output)
    raise

# ============================================
# 7. EXTRACT TOKEN USAGE
# ============================================
usage = response.usage

# DeepSeek pricing (as of 2024)
INPUT_COST_PER_MILLION = 0.14    # $0.14 per 1M input tokens
OUTPUT_COST_PER_MILLION = 0.28   # $0.28 per 1M output tokens

estimated_cost = (
    (usage.prompt_tokens * INPUT_COST_PER_MILLION / 1_000_000) +
    (usage.completion_tokens * OUTPUT_COST_PER_MILLION / 1_000_000)
)

token_report = {
    "timestamp": datetime.now().isoformat(),
    "model": "deepseek-chat",
    "prompt_tokens": usage.prompt_tokens,
    "completion_tokens": usage.completion_tokens,
    "total_tokens": usage.total_tokens,
    "estimated_cost_usd": round(estimated_cost, 6),
    "participants_processed": len(data),
    "api_response_id": response.id,
    "api_created": response.created
}

# ============================================
# 8. SAVE EVERYTHING
# ============================================
# Save coded data
with open("coded_output.json", "w") as f:
    json.dump(coded_data, f, indent=2)

# Save token usage report
with open("token_usage.json", "w") as f:
    json.dump(token_report, f, indent=2)

# Also save a combined version (original + coded merged)
# This is useful for analysis in pandas/excel
# merged_data = []
# for i, participant in enumerate(data):
#     merged = {**participant, **coded_data[i] if i < len(coded_data) else {}}
#     merged_data.append(merged)

# with open("merged_output.json", "w") as f:
#     json.dump(merged_data, f, indent=2)

# ============================================
# 9. PRINT SUMMARY
# ============================================
print("\n" + "="*50)
print("📊 CODING COMPLETE")
print("="*50)
print(f"✅ Participants processed: {len(data)}")
print(f"📝 Total tokens used: {usage.total_tokens:,}")
print(f"   - Input tokens:  {usage.prompt_tokens:,}")
print(f"   - Output tokens: {usage.completion_tokens:,}")
print(f"💰 Estimated cost: ${estimated_cost:.6f}")
print(f"   (That's ~${estimated_cost * 1_000_000 / len(data):.6f} per participant)")
print("\n💾 Saved files:")
print(f"   - coded_output.json     (coded data only)")
print(f"   - token_usage.json      (API usage report)")
print(f"   - merged_output.json    (original + coded merged)")
print("="*50)

# Optional: Quick preview of results
print("\n📋 Quick Preview of Coded Data:")
for i, item in enumerate(coded_data[:3]):  # Show first 3
    print(f"\nParticipant {i+1}: {item.get('session_id', 'N/A')}")
    print(f"   Rule identified: {item.get('true_rule_identified')}")
    print(f"   Mechanism: {item.get('stated_mechanism')}")
    print(f"   Articulation: {item.get('articulation_depth')}/3")
    print(f"   Quote: \"{item.get('key_evidence_quote', 'N/A')[:60]}...\"")