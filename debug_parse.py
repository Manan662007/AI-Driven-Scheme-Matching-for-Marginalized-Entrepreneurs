import json

transcript_path = r'C:\Users\Aryash Singh\.gemini\antigravity\brain\4d94c8cf-cf30-4022-8514-872bb24a045c\.system_generated\logs\transcript_full.jsonl'

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
                    print(f"Row {i}: parts count = {len(parts)}")
                    json_str = parts[-1] if len(parts) > 1 else row
                    idx = json_str.find('{"id":')
                    if idx != -1:
                        target = json_str[idx:]
                        try:
                            res = json.loads(target)
                            print(f"  OK: {res.get('id')} - {res.get('name')[:40]}")
                        except Exception as e:
                            print(f"  ERR: {e}")
                            print(f"  First 100 chars: {target[:100]}")
