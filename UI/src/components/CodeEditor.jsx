import React, { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FaMagic, FaLightbulb, FaPalette, FaPlay, FaFont, FaCog } from 'react-icons/fa';
import './CodeEditor.css';

const CodeEditor = ({ code, onChange, onRun }) => {
  const editorRef = useRef(null);
  const [theme, setTheme] = useState('vs-dark');
  const [language, setLanguage] = useState('javascript');
  const [isAIAssistEnabled, setIsAIAssistEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register custom themes
    monaco.editor.defineTheme('ai-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '#569CD6' },
        { token: 'string', foreground: '#CE9178' },
        { token: 'number', foreground: '#B5CEA8' },
        { token: 'comment', foreground: '#6A9955' },
        { token: 'identifier', foreground: '#9CDCFE' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editorCursor.foreground': '#AEAFAD',
        'editor.lineHighlightBackground': '#2A2A2A',
        'editor.selectionBackground': '#264F78',
      },
    });

    monaco.editor.defineTheme('github-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '#FF7B72' },
        { token: 'string', foreground: '#79C0FF' },
        { token: 'number', foreground: '#79C0FF' },
        { token: 'comment', foreground: '#8B949E' },
        { token: 'identifier', foreground: '#C9D1D9' },
      ],
      colors: {
        'editor.background': '#0D1117',
        'editor.foreground': '#C9D1D9',
        'editorCursor.foreground': '#C9D1D9',
        'editor.lineHighlightBackground': '#161B22',
        'editor.selectionBackground': '#1F6FEB',
      },
    });

    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '#FF79C6' },
        { token: 'string', foreground: '#F1FA8C' },
        { token: 'number', foreground: '#BD93F9' },
        { token: 'comment', foreground: '#6272A4' },
        { token: 'identifier', foreground: '#50FA7B' },
      ],
      colors: {
        'editor.background': '#282A36',
        'editor.foreground': '#F8F8F2',
        'editorCursor.foreground': '#F8F8F2',
        'editor.lineHighlightBackground': '#44475A',
        'editor.selectionBackground': '#44475A',
      },
    });

    // Apply the default theme
    monaco.editor.setTheme(theme);
  };

  // Toggle AI Assist
  const toggleAIAssist = () => {
    setIsAIAssistEnabled((prev) => !prev);
    // Add AI-powered features here (e.g., auto-completion, linting)
  };

  // Change editor theme
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    editorRef.current.updateOptions({ theme: newTheme });
  };

  // Change editor language
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    editorRef.current.updateOptions({ language: newLanguage });
  };

  // Change font size
  const changeFontSize = (newSize) => {
    setFontSize(newSize);
    editorRef.current.updateOptions({ fontSize: newSize });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        onRun();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRun]);

  return (
    <div className="code-editor-container">
      <div className="editor-toolbar">
        <button onClick={toggleAIAssist} className={isAIAssistEnabled ? 'active' : ''}>
          <FaMagic /> AI Assist
        </button>
        <select onChange={(e) => changeLanguage(e.target.value)} value={language}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>
        <select onChange={(e) => changeTheme(e.target.value)} value={theme}>
          <option value="vs-dark">VS Dark</option>
          <option value="vs-light">VS Light</option>
          <option value="ai-theme">AI Theme</option>
          <option value="github-dark">GitHub Dark</option>
          <option value="dracula">Dracula</option>
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
          wordWrap: 'on',
          lineNumbers: 'on',
          bracketPairColorization: true,
          automaticLayout: true,
          minimap: { enabled: true },
          fontSize: fontSize,
          fontFamily: 'Fira Code, monospace',
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          lineHighlight: 'lineHighlight', // Highlight the current line
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeEditor;