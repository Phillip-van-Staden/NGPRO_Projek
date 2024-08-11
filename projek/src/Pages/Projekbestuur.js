import './Styles/Projek.module.css';
import React,{useState} from 'react';
function ProjekBestuur(){
    const [projekte,setProjekte]=useState([]);
    const [name,setName]=useState("");
    const [desc,setDesc]=useState("");
    const [start,setStart]=useState("");
    const [end,setEnd]=useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    function handleNaamChange(event){
        setName(event.target.value);
    }
    function handleDescriptionChange(event){
        setDesc(event.target.value);
    }
    function handleStartChange(event){
        setStart(event.target.value);
    }
    function handleEndChange(event){
        setEnd(event.target.value);
    }
    function addProjek(){
        if (editingIndex !== null) {
            const updatedProjekte = projekte.map((projek, index) =>
                index === editingIndex ? { naam: name, beskruiwing: desc, begin: start, einde: end } : projek
            );
            setProjekte(updatedProjekte);
            setEditingIndex(null);
        } else {
            const newProjek = { naam: name, beskruiwing: desc, begin: start, einde: end };
            setProjekte(p => [...p, newProjek]);
        }
        setName("");
        setDesc("");
        setStart("");
        setEnd("");
    }
    function editProjek(index){
        const projekToEdit = projekte[index];
        setName(projekToEdit.naam);
        setDesc(projekToEdit.beskruiwing);
        setStart(projekToEdit.begin);
        setEnd(projekToEdit.einde);
        setEditingIndex(index);
    }
    function deleteProjek(index){
        setProjekte(p=>p.filter((_,i)=>i!==index));
    }
    return(
       <div className='project'>
            <h1 className='PHead'>Projekte</h1>
            <label className='project' for="n">Naam: </label>
            <input className='project' type='text' id='n' value={name} onChange={handleNaamChange} placeholder='Projek naam'/>
            <label className='project' for="d">Beskrywing: </label>
            <textarea className='project' type='text' id='d' value={desc} onChange={handleDescriptionChange} placeholder='Projek  beskrywing'></textarea>
            <label className='project' for="s">Begin datum: </label>
            <input className='project' type='date' id='s' value={start} onChange={handleStartChange} />
            <label className='project' for="e">Eind datum: </label>
            <input className='project' type='date' id='e' value={end} onChange={handleEndChange}  />
            <button  className='project' onClick={addProjek}> {editingIndex !== null ? 'Update' : 'Add'}</button>

            <h2 className='project'>Lys van Projekte</h2>
            <ul className='project'>
                {projekte.map((projekte,index)=>
                <li className='project' key={index} >
                    <h3 className='project'>{projekte.naam}</h3>
                    <p className='project'>{projekte.beskruiwing}</p>
                    <p className='project'>{projekte.begin} to {projekte.einde}</p>
                    <button className='project' onClick={()=>editProjek(index)}>Edit</button>
                    <button className='project' onClick={()=>deleteProjek(index)}>Delete</button>
                    </li>)}
            </ul>
       </div>
    );
}
export default ProjekBestuur