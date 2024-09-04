import React, { useState, useEffect } from 'react';
import './Styles/komunikasieStyle.module.css';
import { useNavigate, useParams } from 'react-router-dom';

function Samewerking() {
    const [messages, setMessages] = useState("");
    const [files, setFiles] = useState([]);
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();
    const { projectId } = useParams(); 

    useEffect(() => {
        fetch(`http://localhost:5000/projects/${projectId}/messages`)
            .then(response => response.json())
            .then(data => setChats(data.messages));

        fetch('http://localhost:5000/files')
            .then(response => response.json())
            .then(data => setFiles(data.files));
    }, [projectId]);

    function handleNewMessage(event) {
        setMessages(event.target.value);
    }

    function handleSentMessage() {
        if (messages.trim()) {
            const newChat = { message: messages };
            fetch(`http://localhost:5000/projects/${projectId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newChat)
            })
            .then(response => response.json())
            .then(data => {
                setChats(c => [...c, { id: data.id, message: messages }]);
                setMessages("");
            });
        }
    }

    const handleFileUpload = (e) => {
        const uploadedFiles = e.target.files;
        const formData = new FormData();
        for (let i = 0; i < uploadedFiles.length; i++) {
            formData.append('files', uploadedFiles[i]);
        }

        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const newFiles = Array.from(uploadedFiles).map(file => ({ name: file.name }));
            setFiles(f => [...f, ...newFiles]);
        });
    };

    function handleFileDownload(fileId, filename) {
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
    }

    function handleBack() {
        navigate('/projekbestuur');
    }

    return (
        <div className='kComunicate'>
            <h2 className='KHead'>Span kommunikasie</h2>
            <div className='kBody'>
                <div className='KChat'>
                    <h3>Boodskappe:</h3>
                    <ul>
                        {chats.map((chat, index) =>
                            <li key={index}>
                                {chat.message}
                            </li>
                        )}
                    </ul>
                    <input type='text' className="KText" id='message' value={messages} placeholder='Enter your message' onChange={handleNewMessage} />
                    <button className="KButton" onClick={handleSentMessage}>Stuur boodskap</button>
                </div>
                <div className='KFile'>
                    <h3>Lêers:</h3>
                    <ul>
                        {files.map((file, index) => (
                            <li key={index}>
                                {file.filename}
                                <button onClick={() => handleFileDownload(file.id, file.filename)}>Download</button>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="KInFile"
                    />
                </div>
            </div>
            <button className="KButton" id="terug" onClick={handleBack}>Terug</button>
        </div>
    );
}

export default Samewerking;
