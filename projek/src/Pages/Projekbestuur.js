import './Styles/Projek.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProjekBestuur() {
    const [projekte, setProjekte] = useState([]);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/projects')
            .then(response => response.json())
            .then(data => setProjekte(data.projects));
    }, []);

    function handleNaamChange(event) {
        setName(event.target.value);
    }

    function handleDescriptionChange(event) {
        setDesc(event.target.value);
    }

    function handleStartChange(event) {
        setStart(event.target.value);
    }

    function handleEndChange(event) {
        setEnd(event.target.value);
    }

    function addProjek() {
        if (name.trim()) {
            const newProjek = { name, description: desc, start_date: start, end_date: end };
            
            if (editingIndex !== null) {
                const projectId = projekte[editingIndex].id;
                fetch(`http://localhost:5000/projects/${projectId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProjek)
                }).then(() => {
                    const updatedProjekte = projekte.map((projek, index) =>
                        index === editingIndex ? { ...projek, ...newProjek } : projek
                    );
                    setProjekte(updatedProjekte);
                    setEditingIndex(null);
                });
            } else {
                fetch('http://localhost:5000/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProjek)
                }).then(response => response.json())
                  .then(data => {
                      setProjekte([...projekte, { ...newProjek, id: data.id }]);
                  });
            }

            setName("");
            setDesc("");
            setStart("");
            setEnd("");
        }
    }

    function editProjek(index) {
        const projekToEdit = projekte[index];
        setName(projekToEdit.name);
        setDesc(projekToEdit.description);
        setStart(projekToEdit.start_date);
        setEnd(projekToEdit.end_date);
        setEditingIndex(index);
    }

    function deleteProjek(index) {
        const projectId = projekte[index].id;
        fetch(`http://localhost:5000/projects/${projectId}`, {
            method: 'DELETE'
        }).then(() => {
            setProjekte(p => p.filter((_, i) => i !== index));
        });
    }

    function navigateToSamewerking(projectId) {
        navigate(`/samewerking/${projectId}`);
    }
    function navigateToTake(projectId) {
        navigate(`/taakbestuur/${projectId}`);
    }
    function navigateToDash() {
        navigate(`/dashboard`);
    }
    return (
        <div className='project'>
            <h1 className='PHead'>Projekte</h1>
            <label className='project' htmlFor="n">Naam: </label>
            <input className='project' type='text' id='n' value={name} onChange={handleNaamChange} placeholder='Projek naam'/>
            <label className='project' htmlFor="d">Beskrywing: </label>
            <textarea className='project' id='d' value={desc} onChange={handleDescriptionChange} placeholder='Projek beskrywing'></textarea>
            <label className='project' htmlFor="s">Begin datum: </label>
            <input className='project' type='date' id='s' value={start} onChange={handleStartChange} />
            <label className='project' htmlFor="e">Eind datum: </label>
            <input className='project' type='date' id='e' value={end} onChange={handleEndChange} />
            <button className='project' onClick={addProjek}>{editingIndex !== null ? 'Update' : 'Add'}</button>
            <button className='project' onClick={navigateToDash}>Terug</button>
            <h2 className='project'>Lys van Projekte</h2>
            <ul className='project'>
                {projekte.map((projek, index) => (
                    <li className='project' key={index}>
                        <h3 className='project'>{projek.name}</h3>
                        <p className='project'>{projek.description}</p>
                        <p className='project'>{projek.start_date} to {projek.end_date}</p>
                        <button className='project' onClick={() => editProjek(index)}>Edit</button>
                        <button className='project' onClick={() => deleteProjek(index)}>Delete</button>
                        <button className='project' onClick={() => navigateToTake(projek.id)}>Take</button>
                        <button className='project' onClick={() => navigateToSamewerking(projek.id)}>Komunikasie</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProjekBestuur;
