import React, { useEffect, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import './Output.css';

const Output = ({ output, onClear }) => {
  const outputRef = useRef(null);
  const isError = output.startsWith('Error:');

  useEffect(() => {
    if (outputRef.current) {
      Prism.highlightAllUnder(outputRef.current);
    }
  }, [output]);

  return (
    <div className="output-panel">
      <div className="output-header">
        <h3>Output</h3>
        <button onClick={onClear} className="clear-button">
          <FaTrash /> Clear
        </button>
      </div>
      <div className="output-content" ref={outputRef}>
        {isError ? (
          <pre className="error">{output}</pre>
        ) : (
          <pre>
            <code className="language-javascript">{output}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default Output;