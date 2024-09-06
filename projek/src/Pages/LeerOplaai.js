import React, { useState, useEffect } from "react";
import './Styles/FileUpload.css';
import { useNavigate } from 'react-router-dom';

const LeerOplaai = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch files when component loads
    fetch('http://localhost:5000/files')
      .then(response => response.json())
      .then(data => setFiles(data.files));
  }, []);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    // Upload files
    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        const newFiles = Array.from(selectedFiles).map(file => ({ name: file.name }));
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
      });
  };

  const handleFileDownload = (fileId, filename) => {
    // Download file
    fetch(`http://localhost:5000/files/${fileId}`)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  return (
    <div className="container">
      <div className="content-box">
        <div className="header">
          <div className="text">Lêer Oplaai</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
          <div className="file-previews">
            {files.map((file, index) => (
              <div key={index} className="file-preview">
                <div className="file-name">
                  {file.filename}
                  <button onClick={() => handleFileDownload(file.id, file.filename)}>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="next" onClick={() => navigate('/dashboard')}>
          Terug na Dashboard
        </button>
      </div>
    </div>
  );
};

export default LeerOplaai;
