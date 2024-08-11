import React, { useState } from "react";
import './Styles/FileUpload.css';

const LeerOplaai = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).map((file) => ({
      ...file,
      preview: URL.createObjectURL(file),
    }));
    setFiles([...files, ...selectedFiles]);
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
                <img src={file.preview} alt={file.name} className="file-image" />
                <div className="file-name">{file.name}</div>
              </div>
            ))}
          </div>
        </div>
        <button className="next" disabled>
          Terug na Dashboard
        </button>
      </div>
    </div>
  );
};

export default LeerOplaai;

