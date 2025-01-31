import React, { useState } from 'react';
import { FaCode, FaMagic } from 'react-icons/fa';
import './CodeSnippetsPanel.css'; 

const CodeSnippetsPanel = ({ onInsertSnippet }) => {
  const [snippets, setSnippets] = useState([
    { "id": 1, "name": "Print Statement", "code": 'print("Hello, World!")' },
    { "id": 2, "name": "Function Example", "code": 'def greet():\n    print("Hello!")' },
    { "id": 3, "name": "For Loop", "code": 'for i in range(10):\n    print(i)' }
]);

  const [aiGeneratedSnippet, setAIGeneratedSnippet] = useState('');

  const handleInsertSnippet = (code) => {
    onInsertSnippet(code);
  };

  const generateAISnippet = async () => {
  
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve('const newFunction = () => {}'), 1000)
    );
    setAIGeneratedSnippet(response);
  };

  return (
    <div className="code-snippets-panel">
      <h3><FaCode /> Code Snippets</h3>
      <ul>
        {snippets.map((snippet) => (
          <li key={snippet.id} onClick={() => handleInsertSnippet(snippet.code)}>
            <strong>{snippet.name}</strong>
            <pre>{snippet.code}</pre>
          </li>
        ))}
      </ul>
      <div className="ai-snippet-generator">
        <h4><FaMagic /> AI Snippet Generator</h4>
        <button onClick={generateAISnippet}>Generate Snippet</button>
        {aiGeneratedSnippet && (
          <div className="ai-snippet">
            <pre>{aiGeneratedSnippet}</pre>
            <button onClick={() => handleInsertSnippet(aiGeneratedSnippet)}>
              Insert Snippet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeSnippetsPanel;