import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import CodeSnippetsPanel from './components/CodeSnippetsPanel';
import Output from './components/Output';
import './index.css';

const App = () => {
  const [code, setCode] = useState('// Start coding here...');
  const [output, setOutput] = useState('');

  // Handle inserting a snippet into the editor
  const handleInsertSnippet = (snippet) => {
    setCode((prevCode) => prevCode + '\n' + snippet);
  };

  return (
    <div className="app">
      <CodeSnippetsPanel onInsertSnippet={handleInsertSnippet} />
      <div className="editor-container">
        <CodeEditor code={code} onChange={setCode} />
      </div>
      <Output output={output} />
    </div>
  );
};

export default App;