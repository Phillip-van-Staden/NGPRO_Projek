import React, { useState } from 'react';
import './Styles/taakbestuur.css';

function TaskForm ({newTask}) {
    const [taskName, setName] = useState('');
    const [taskProject, setProject] = useState('');
    const [taskDescription, setDescription] = useState('');
    const [taskStart, setStart] = useState('');
    const [taskEnd, setEnd] = useState('');
    const handleAdd = (e) => {
        e.preventDefault();
        newTask({taskName, taskProject, taskDescription, taskStart, taskEnd, tStatus : 'To Do'});
        setName('');
        setProject('');
        setDescription('');
        setStart('Start');
        setEnd('End');
    };
    return (
        <form className='add' onSubmit={handleAdd}>
            <input
                type="text"
                placeholder="Taak Naam"
                value={taskName}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input 
                type="text"
                placeholder="Projek Naam"
                value={taskProject}
                onChange={(e) => setProject(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Beskrywing"
                value={taskDescription}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <input
                type="date"
                placeholder="Start"
                value={taskStart}
                onChange={(e) => setStart(e.target.value)}
                required
            />
            <input
                type="date"
                placeholder="End"
                value={taskEnd}
                onChange={(e) => setEnd(e.target.value)}
                required
            />
            <button className='new' type="submit">Nuwe Taak</button>
        </form>
    );
}

function TaskItem ({task, editTask, removeTask, handleStatus}) {
    const [edit, setEdit] = useState(false);
    const [taskName, setName] = useState(task.taskName);
    const [taskProject, setProject] = useState(task.taskProject);
    const [taskDescription, setDescription] = useState(task.taskDescription);
    const [taskStart, setStart] = useState(task.taskStart);
    const [taskEnd, setEnd] = useState(task.taskEnd);
    const handleEdit = () => {
        editTask(task.id, {...task, taskName, taskProject, taskDescription, taskStart, taskEnd});
        setEdit(false);
    };
    return (
        <div>
            {edit ? (
                <div>
                    <input 
                        type="text"
                        value={taskName}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input 
                        type="text"
                        value={taskProject}
                        onChange={(e) => setProject(e.target.value)}
                    />
                    <input 
                        type="text"
                        value={taskDescription}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input 
                        type="date"
                        value={taskStart}
                        onChange={(e) => setStart(e.target.value)}
                    />
                    <input 
                        type="date"
                        value={taskEnd}
                        onChange={(e) => setEnd(e.target.value)}
                    />
                    <button onClick={handleEdit}>Save</button>
                    <button onClick={() => setEdit(false)}>Cancel</button>
                </div>
            ) :(
                <div>
                <span>{task.taskName} - {task.taskDescription} - {task.taskStart} - {task.taskEnd}</span>
                <span> - {task.tStatus}</span>
                <button onClick={() => setEdit(true)}>Edit</button>
                <button onClick={() => removeTask(task.id)}>Remove</button>
                <select
                    value={task.tStatus}
                    onChange={(e) => handleStatus(task.id, e.target.value)}
                >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
                </div>
            )}
        </div>
    );
}

const TaakBestuur = () => { 
    const [tasks, setTasks] = useState([]);
    const [volgendeID, setVolgendeID] = useState(1);
    const newTask = (task) => {
        setTasks([...tasks, {...task, id:volgendeID}]);
        setVolgendeID(volgendeID +1);
    };
    const editTask = (id, editedTask) => {
        setTasks(tasks.map(task => (task.id === id ? editedTask : task)));
    };
    const removeTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };
    const handleStatus = (id, tStatus) => {
        setTasks(tasks.map(task => task.id === id ? {...task, tStatus } : task));
    };
    return (
        <>
            <div className='container'>
                <div className="header">
                    <div className="text">Takebestuur</div>
                    <div className="underline"></div>
                </div>
                <div className='addtask'>
                    <h1>Nuwe Taak</h1>
                    <div className="underline"></div>
                    <TaskForm newTask={newTask}/>
                </div>
                <div className='listtask'>
                    {tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            editTask={editTask}
                            removeTask={removeTask}
                            handleStatus={handleStatus}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default TaakBestuur;