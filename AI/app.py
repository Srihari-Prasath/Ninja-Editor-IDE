from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import ast
import re

app = Flask(__name__)

# Configure Gemini API
genai.configure(api_key="AIzaSyBybwkha9mnJ3uvkrWmwWoDnRZzadq9oPA")

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

chat_session = model.start_chat(history=[])

def check_code(code):
    """
    Performs basic checks on Python code.
    """
    results = []

    try:
        ast.parse(code)
    except SyntaxError as e:
        results.append(f"Syntax error: {e}")
        return results

    variable_names = set()
    for node in ast.walk(ast.parse(code)):
        if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
            variable_names.add(node.id)
        elif isinstance(node, ast.Name) and isinstance(node.ctx, ast.Load):
            if node.id not in variable_names and node.id not in globals() and node.id not in dir(__builtins__):
                results.append(f"Undefined variable: {node.id}")

    if re.search(r"while True:\s*pass", code, re.IGNORECASE):
        results.append("Potential infinite loop detected (while True without a break condition).")

    return results

def ask_gemini(code):
    """
    Sends the code to the Gemini API for feedback.
    """
    response = chat_session.send_message(f"Review this Python code and provide feedback:\n\n{code}")
    return response.text

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check', methods=['POST'])
def check():
    code = request.form.get('code')
    
    if not code.strip():
        return jsonify({"error": "Code input is empty!"})

    errors = check_code(code)
    feedback = ask_gemini(code) if not errors else "Fix errors first before asking for AI feedback."

    return jsonify({"errors": errors, "feedback": feedback})

if __name__ == '__main__':
    app.run(debug=True)
