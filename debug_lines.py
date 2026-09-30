import json
import os

transcript_path = r'C:\Users\Aryash Singh\.gemini\antigravity\brain\4d94c8cf-cf30-4022-8514-872bb24a045c\.system_generated\logs\transcript_full.jsonl'

if os.path.exists(transcript_path):
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT':
                content = data.get('content', '')
                if 'Jute Diversification Scheme' in content:
                    lines = content.split('\n')
                    print(f"Total lines: {len(lines)}")
                    for idx, l in enumerate(lines[:15]):
                        print(f"Line {idx} (len {len(l)}): {l[:80]}...")
