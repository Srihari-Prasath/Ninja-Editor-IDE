import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { FaMagic, FaPlay } from "react-icons/fa";
import "./CodeEditor.css";

const CodeEditor = ({ code, onChange }) => {
  const editorRef = useRef(null);
  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("javascript");
  const [isAIAssistEnabled, setIsAIAssistEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.setTheme(theme);
  };

  // Run code execution
  const onRun = async () => {
    if (language === "javascript") {
      try {
        // Execute JavaScript using eval()
        // eslint-disable-next-line no-eval
        eval(code);
      } catch (error) {
        alert("JavaScript Error: " + error.message);
      }
    } else if (language === "python") {
      try {
        // Load Pyodide if not already loaded
        if (!window.pyodide) {
          window.pyodide = await window.loadPyodide();
        }
        const output = await window.pyodide.runPythonAsync(code);
        alert(output);
      } catch (error) {
        alert("Python Error: " + error.message);
      }
    } else {
      alert("This editor currently supports only JavaScript and Python.");
    }
  };

  // Handle theme change
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    editorRef.current.updateOptions({ theme: newTheme });
  };

  // Handle language change
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    editorRef.current.updateOptions({ language: newLanguage });
  };

  // Handle font size change
  const changeFontSize = (newSize) => {
    setFontSize(newSize);
    editorRef.current.updateOptions({ fontSize: newSize });
  };

  // Fix: Prevent default Ctrl+R (refresh) and use Ctrl+Enter to run code
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault(); // Prevent page refresh
        onRun();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onRun]);

  return (
    <div className="code-editor-container">
      <div className="editor-toolbar">
        <button onClick={() => setIsAIAssistEnabled(!isAIAssistEnabled)} className={isAIAssistEnabled ? "active" : ""}>
          <FaMagic /> AI Assist
        </button>
        <select onChange={(e) => changeLanguage(e.target.value)} value={language}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
        <select onChange={(e) => changeTheme(e.target.value)} value={theme}>
          <option value="vs-dark">VS Dark</option>
          <option value="vs-light">VS Light</option>
        </select>
        <div className="font-size-control">
          <button onClick={() => changeFontSize(fontSize - 1)}>-</button>
          <span>{fontSize}px</span>
          <button onClick={() => changeFontSize(fontSize + 1)}>+</button>
        </div>
        <button onClick={onRun} className="run-button">
          <FaPlay /> Run
        </button>
      </div>
      <Editor
        height="90vh"
        language={language}
        value={code}
        onChange={onChange}
        theme={theme}
        options={{
          wordWrap: "on",
          lineNumbers: "on",
          bracketPairColorization: true,
          automaticLayout: true,
          minimap: { enabled: true },
          fontSize: fontSize,
          fontFamily: "Fira Code, monospace",
          scrollBeyondLastLine: false,
          smoothScrolling: true,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeEditor;
