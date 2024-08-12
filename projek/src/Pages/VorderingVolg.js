import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VorderingVolg.css';

function VorderingVolg () {
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: 'Project 1',
            tasks: [
                { id: 1, name: 'Task 1', start: calculateDayIndex(1, 1), end: calculateDayIndex(2, 1) },
                { id: 2, name: 'Task 2', start: calculateDayIndex(1, 1), end: calculateDayIndex(3, 2) },
                { id: 3, name: 'Task 3', start: calculateDayIndex(1, 5), end: calculateDayIndex(2, 4) },
            ]
        },
        {
            id: 2,
            name: 'Project 2',
            tasks: [
                { id: 1, name: 'Task 1', start: calculateDayIndex(3, 3), end: calculateDayIndex(5, 2) },
                { id: 2, name: 'Task 2', start: calculateDayIndex(4, 4), end: calculateDayIndex(7, 3) },
            ]
        },
        {
            id: 3,
            name: 'Project 3',
            tasks: [
                { id: 1, name: 'Task 1', start: calculateDayIndex(2, 1), end: calculateDayIndex(3, 1) },
                { id: 2, name: 'Task 2', start: calculateDayIndex(3, 2), end: calculateDayIndex(5, 1) },
                { id: 3, name: 'Task 3', start: calculateDayIndex(5, 2), end: calculateDayIndex(7, 3) },
                { id: 4, name: 'Task 4', start: calculateDayIndex(6, 4), end: calculateDayIndex(8, 2) },
            ]
        },
    ]);

    function calculateDayIndex (week, day) {
        return (week - 1) * 5 + day;
    };

    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
    const days = ['M', 'T', 'W', 'T', 'F'];
    const weekColors = ['#f9c2c2', '#c2f9c2', '#c2c2f9', '#f9e2c2'];

    return (
        <div className="gantt-chart-container">
            <table className="gantt-chart">
                <thead>
                    <tr>
                        <th>Tasks</th>
                        {weeks.map((week, i) => (
                            <th key={i} colSpan={5} style={{ backgroundColor: weekColors[i % weekColors.length] }}>{week}</th>
                        ))}
                    </tr>
                    <tr>
                        <th></th>
                        {weeks.map((_, i) =>
                            days.map((day, j) => (
                                <th
                                    key={`${i}-${j}`}
                                    className="gantt-day"
                                    style={{ backgroundColor: weekColors[i % weekColors.length] }}
                                >
                                    {day}
                                </th>
                            ))
                        )}
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <>
                            <tr key={project.id}>
                                <td colSpan={weeks.length * 5 + 1} className="project-header">{project.name}</td>
                            </tr>
                            {project.tasks.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.name}</td>
                                    {weeks.map((_, i) =>
                                        days.map((_, j) => {
                                            const dayIndex = i * 5 + j + 1;
                                            const isInRange = dayIndex >= task.start && dayIndex <= task.end;
                                            return (
                                                <td
                                                    key={`${task.id}-${dayIndex}`}
                                                    className={`gantt-cell ${isInRange ? 'gantt-bar' : ''}`}
                                                ></td>
                                            );
                                        })
                                    )}
                                </tr>
                            ))}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VorderingVolg;
