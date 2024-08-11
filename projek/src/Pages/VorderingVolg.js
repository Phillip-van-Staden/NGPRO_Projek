import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Styles/VorderingVolg.css';

function Vordering () {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Task 1', status: 'To Do' },
        { id: 2, title: 'Task 2', status: 'In Progress' },
        { id: 3, title: 'Task 3', status: 'Completed' },
    ]);

    function handleStatusChange (taskId, newStatus) {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );
    };

    function renderTaskStatusOptions (taskId, currentStatus) {
        const statuses = ['To Do', 'In Progress', 'Completed'];
        return (
            <select
                value={currentStatus}
                onChange={e => handleStatusChange(taskId, e.target.value)}
            >
                {statuses.map(status => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        );
    };

    return (
        <div className="progress-container">
            <h1>Vordering Tracking</h1>
            <div className="task-list">
                {tasks.map(task => (
                    <div key={task.id} className="task-item">
                        <span className="task-title">{task.title}</span>
                        <span className="task-status">
                            {renderTaskStatusOptions(task.id, task.status)}
                        </span>
                    </div>
                ))}
            </div>
            <Link to="/Kalender">Go to Kalender</Link>
        </div>
    );
};

export default Vordering;
