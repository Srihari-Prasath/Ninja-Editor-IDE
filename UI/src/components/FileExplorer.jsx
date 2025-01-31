// src/components/FileExplorer.jsx
import React, { useState } from 'react';
import { FaFolder, FaFolderOpen, FaFileCode } from 'react-icons/fa';
import './FileExplorer.css'; // Create this file for styling

const FileExplorer = () => {
  const [expandedFolders, setExpandedFolders] = useState({});

  // Sample folder structure
  const fileStructure = [
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: 'components', type: 'folder', children: [{ name: 'App.jsx', type: 'file' }] },
        { name: 'index.jsx', type: 'file' },
      ],
    },
    {
      name: 'public',
      type: 'folder',
      children: [{ name: 'index.html', type: 'file' }],
    },
    { name: 'package.json', type: 'file' },
  ];

  // Toggle folder expand/collapse
  const toggleFolder = (folderName) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  // Render folder or file
  const renderItem = (item) => {
    if (item.type === 'folder') {
      return (
        <div key={item.name} className="folder">
          <div className="folder-header" onClick={() => toggleFolder(item.name)}>
            {expandedFolders[item.name] ? <FaFolderOpen /> : <FaFolder />}
            <span>{item.name}</span>
          </div>
          {expandedFolders[item.name] && (
            <div className="folder-content">
              {item.children.map((child) => renderItem(child))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div key={item.name} className="file">
          <FaFileCode />
          <span>{item.name}</span>
        </div>
      );
    }
  };

  return (
    <div className="file-explorer">
      <h3>File Explorer</h3>
      <div className="file-tree">
        {fileStructure.map((item) => renderItem(item))}
      </div>
    </div>
  );
};

export default FileExplorer;