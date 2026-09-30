import json
import os

transcript_path = r'C:\Users\Aryash Singh\.gemini\antigravity\brain\4d94c8cf-cf30-4022-8514-872bb24a045c\.system_generated\logs\transcript_full.jsonl'
output_path = r'C:\Users\Aryash Singh\.gemini\antigravity\scratch\sahayak-frontend\src\data\schemes.json'

schemes_data = []

if os.path.exists(transcript_path):
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                if data.get('type') == 'USER_INPUT':
                    content = data.get('content', '')
                    if 'Jute Diversification Scheme' in content:
                        for row in content.split('\n'):
                            row = row.strip()
                            if not row:
                                continue
                            idx = row.find('{')
                            if idx != -1:
                                json_str = row[idx:]
                                try:
                                    obj = json.loads(json_str)
                                    schemes_data.append(obj)
                                except Exception:
                                    pass
            except Exception:
                pass

print(f"Total schemes extracted: {len(schemes_data)}")
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(schemes_data, f, ensure_ascii=False, indent=2)

print("Saved to:", output_path)
