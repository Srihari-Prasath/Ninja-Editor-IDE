import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import Output from './components/Output';
import './App.css';

const App = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleRun = () => {
    try {
      // Execute the code and capture the output
      const result = eval(code); // Note: Using `eval` is generally unsafe and should be avoided in production
      setOutput(result.toString());
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleClearOutput = () => {
    setOutput('');
  };

  return (
    <div className="app-container">
      <div className="editor-panel">
        <CodeEditor code={code} onChange={setCode} onRun={handleRun} />
      </div>
      <div className="output-panel">
        <Output output={output} onClear={handleClearOutput} />
      </div>
    </div>
  );
};

export default App;