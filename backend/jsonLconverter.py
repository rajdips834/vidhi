import json

with open("constitution_qa.json", "r", encoding="utf-8") as infile:
    dataset = json.load(infile)

with open("output.jsonl", "w", encoding="utf-8") as f:
    for item in dataset:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")

print("All data written to output.jsonl in JSONL format")