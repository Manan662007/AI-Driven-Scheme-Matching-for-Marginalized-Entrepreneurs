import json
import os
import re

transcript_path = r'C:\Users\Aryash Singh\.gemini\antigravity\brain\4d94c8cf-cf30-4022-8514-872bb24a045c\.system_generated\logs\transcript_full.jsonl'
output_path = r'C:\Users\Aryash Singh\.gemini\antigravity\scratch\sahayak-frontend\src\data\schemes.json'

schemes = []

if os.path.exists(transcript_path):
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                if data.get('type') == 'USER_INPUT':
                    content = data.get('content', '')
                    if 'Jute Diversification Scheme' in content:
                        print("Found content! Length:", len(content))
                        for row in content.split('\n'):
                            row = row.strip()
                            if not row:
                                continue
                            # Find json block
                            start = row.find('{"id":')
                            if start != -1:
                                json_part = row[start:]
                                try:
                                    parsed = json.loads(json_part)
                                    schemes.append(parsed)
                                except Exception as err:
                                    # Try to see if there's trailing or escaping
                                    pass
            except Exception:
                pass

print(f"Extracted {len(schemes)} schemes.")
for s in schemes:
    print(f"- [{s.get('id')}] {s.get('name')}")

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(schemes, f, ensure_ascii=False, indent=2)

print("Saved to", output_path)
