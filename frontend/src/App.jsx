import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";
import Intro from "./Intro.jsx"; // Update the import

const socket = io("https://realtime-code-editor-zwp3.onrender.com");

const App = () => {
  const [showIntro, setShowIntro] = useState(true); // State to control the intro screen
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [copySuccess, setCopySuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [output, setOutput] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState("vs-dark");
  const [wordWrap, setWordWrap] = useState("off");

  // Handle the completion of the intro animation
  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    socket.on("userJoined", (users) => {
      setUsers(users);
    });

    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socket.on("userTyping", (user) => {
      setTyping(`${user.slice(0, 8)}... is Typing`);
      setTimeout(() => setTyping(""), 2000);
    });

    socket.on("languageUpdate", (newLanguage) => {
      setLanguage(newLanguage);
    });

    return () => {
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.emit("leaveRoom");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const joinRoom = async () => {
    if (roomId && userName) {
      socket.emit("join", { roomId, userName });
      setJoined(true);

      // Send user details to the backend for storage in MongoDB
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId, userName }),
        });

        const data = await response.json();
        if (!response.ok) {
          console.error("Error saving user:", data.message);
        }
      } catch (error) {
        console.error("Failed to send user data:", error);
      }
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setUserName("");
    setCode("// start code here");
    setLanguage("javascript");
    setOutput("");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
    socket.emit("typing", { roomId, userName });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });
  };

  const runCode = () => {
    if (language !== "javascript") {
      setOutput("⚠️ Execution only works for JavaScript in the browser.");
      return;
    }
    try {
      
      let logs = [];
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        logs.push(args.join(" "));
        originalConsoleLog(...args);
      };

      
      eval(code);

      
      console.log = originalConsoleLog;
      setOutput(logs.join("\n") || "Write an code ");
    } catch (error) {
      setOutput(`❌ Error: ${error.message}`);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_F, () => {
      editor.getAction('actions.find').run();
    });
  };

  
  if (showIntro) {
    return <Intro onIntroComplete={handleIntroComplete} />;
  }

  
  if (!joined) {
    return (
      <div className="join-container">
        <div className="join-form">
          <h1>Join Code Room</h1>
          <input
            type="text"
            placeholder="Room Id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      </div>
    );
  }

  // Show the main editor screen if joined
  return (
    <div className="editor-container">
      <div className="sidebar">
        <div className="room-info">
          <h2>Code Room: {roomId}</h2>
          <button onClick={copyRoomId} className="copy-button">
            Copy Id
          </button>
          {copySuccess && <span className="copy-success">{copySuccess}</span>}
        </div>
        <h3>Users in Room:</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.slice(0, 8)}...</li>
          ))}
        </ul>
        <p className="typing-indicator">{typing}</p>
        <select
          className="language-selector"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <div className="editor-settings">
          <label>
            Font Size:
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </label>
          <label>
            Theme:
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="vs-dark">Dark</option>
              <option value="vs-light">Light</option>
            </select>
          </label>
          <label>
            Word Wrap:
            <select value={wordWrap} onChange={(e) => setWordWrap(e.target.value)}>
              <option value="off">Off</option>
              <option value="on">On</option>
            </select>
          </label>
        </div>
        <button className="leave-button" onClick={leaveRoom}>
          Leave Room
        </button>
      </div>

      <div className="editor-wrapper">
        <Editor
          height={"90vh"}
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme={theme}
          options={{
            minimap: { enabled: false },
            fontSize: fontSize,
            wordWrap: wordWrap,
          }}
          onMount={handleEditorDidMount}
        />
      </div>

      <div className="output-box">
        <h3>Output:</h3>
        <pre>{output}</pre>
        <button className="run-button" onClick={runCode}>
          Run Code
        </button>
      </div>
    </div>
  );
};

export default App;