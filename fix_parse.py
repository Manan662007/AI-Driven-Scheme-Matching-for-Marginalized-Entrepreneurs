import json
import re

transcript_path = r'C:\Users\Aryash Singh\.gemini\antigravity\brain\4d94c8cf-cf30-4022-8514-872bb24a045c\.system_generated\logs\transcript_full.jsonl'
output_path = r'C:\Users\Aryash Singh\.gemini\antigravity\scratch\sahayak-frontend\src\data\schemes.json'

schemes = []

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            content = data.get('content', '')
            if 'Jute Diversification Scheme' in content:
                lines = content.split('\n')
                for i in range(1, len(lines)):
                    row = lines[i].strip()
                    if not row: continue
                    parts = row.split('\t')
                    json_str = parts[-1] if len(parts) > 1 else row
                    idx = json_str.find('{"id":')
                    if idx != -1:
                        target = json_str[idx:]
                        # Try standard load
                        try:
                            res = json.loads(target)
                            schemes.append(res)
                            print(f"Row {i} OK: {res['id']}")
                            continue
                        except Exception:
                            pass
                        
                        # Try fixing double-escaped quotes
                        try:
                            # Replace \\" with \"
                            fixed = target.replace(r'\"', '"').replace(r'\\"', '"')
                            # Actually let's do a regex or decode
                            # The issue is: "name": "\\"Capital...\\"
                            fixed = re.sub(r'\\\\"', "'", target)
                            res = json.loads(fixed)
                            schemes.append(res)
                            print(f"Row {i} FIXED: {res['id']}")
                            continue
                        except Exception as e:
                            print(f"Row {i} still err: {e}")

print(f"\nTotal schemes successfully collected: {len(schemes)}")
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(schemes, f, ensure_ascii=False, indent=2)

print("Saved to", output_path)
