import './Styles/komunikasieStyle.module.css'
import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
function Samewerking(){
    const [messages,setMessages]=useState("");
    const [files, setFile] = useState([]);
    const [chats,setChats]=useState([]);
    const navigate = useNavigate();
    function handleNewMessage(event){
        setMessages(event.target.value);
    }
    function handleSentMessage(){
        if(messages.trim()){
            const newChat={message:messages};
            setChats(c=>[...c,newChat]);
           
            setMessages("");
        }

    }
    function handleBack(){
        navigate('/dashboard');
    }
    const handleFileUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files);
        setFile([...files, ...uploadedFiles]);
      };
    
    return(
        <div className='kComunicate'>
            <h2 className='KHead'>Span kommunikasie</h2>
            <div className='kBody'>
            <div className='KChat'>
                <h3>Boodskappe:</h3>
                <ul>
                    {chats.map((chat,index)=>
                        <li key={index} >
                                {chat.message} 
                        </li>)}
                </ul>
                <input type='text' className="KText" id='message' value={messages} placeholder='Enter your message' onChange={handleNewMessage}/>
                <button className="KButton" onClick={handleSentMessage}>Stuur boodskap</button>
            </div>
            <div className='KFile'>
                <h3>Lêers:</h3>
                <ul>
                    {files.map((file, index) => (
                        <li key={index}>{file.name}</li>
                    ))}
                </ul>
                <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="KInFile"
            />
             {/* <button onClick={handleFileUpload}>Laai leer op</button> */}
           
            </div>
            </div>
            <button className="KButton" id="terug" onClick={handleBack}>Terug</button>
            
        </div>
    );
}
export default Samewerking