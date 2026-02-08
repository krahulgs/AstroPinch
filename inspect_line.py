
with open('backend/services/dosha_calculator.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    line_219 = lines[218] # 0-indexed
    print(f"Line 219: {repr(line_219)}")
    for char in line_219:
        print(f"{ord(char)}: {char}")
