import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Styles/Kalender.css';
import axios from 'axios';

function Kalender() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEvent, setNewEvent] = useState({ title: '', description: '' });

    useEffect(() => {
        const fetchProjectsAndTasks = async () => {
            try {
                const projectsResponse = await axios.get('http://localhost:5000/projects');
                const projects = projectsResponse.data.projects;

                const tasksPromises = projects.map(project =>
                    axios.get(`http://localhost:5000/projects/${project.id}/tasks`)
                );

                const tasksResponses = await Promise.all(tasksPromises);
                const tasks = tasksResponses.flatMap(response => response.data.tasks);

                const updatedEvents = {};

                
                projects.forEach(project => {
                    const startDate = new Date(project.start_date);
                    const endDate = new Date(project.end_date);

                    const startKey = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
                    const endKey = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;

                    updatedEvents[startKey] = [
                        ...(updatedEvents[startKey] || []),
                        { title: project.name, description: `Project starts` }
                    ];

                    updatedEvents[endKey] = [
                        ...(updatedEvents[endKey] || []),
                        { title: project.name, description: `Project ends` }
                    ];
                });

                
                tasks.forEach(task => {
                    const startDate = new Date(task.taskStart);
                    const endDate = new Date(task.taskEnd);

                    const taskStartKey = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
                    const taskEndKey = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;

                    updatedEvents[taskStartKey] = [
                        ...(updatedEvents[taskStartKey] || []),
                        { title: task.taskName, description: `Task starts` }
                    ];

                    updatedEvents[taskEndKey] = [
                        ...(updatedEvents[taskEndKey] || []),
                        { title: task.taskName, description: `Task ends` }
                    ];
                });

                setEvents(updatedEvents);
            } catch (error) {
                console.error('Error fetching projects and tasks:', error);
            }
        };

        fetchProjectsAndTasks();
    }, []);

    function handleNextMonth() {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    }

    function handlePrevMonth() {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    }

    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    const daysInMonth = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());

    function renderCalendarGrid() {
        const grid = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`;
            grid.push(
                <div 
                    className={`calendar-day ${events[dateKey] ? 'has-event' : ''}`} 
                    key={i} 
                    onClick={() => handleDayClick(dateKey)}
                >
                    {i}
                    {events[dateKey]?.map((event, index) => (
                        <div key={index} className="event-indicator">
                            <strong>{event.title}</strong>
                            <p>{event.description}</p>
                        </div>
                    ))}
                </div>
            );
        }
        return grid;
    }

    function handleDayClick(dateKey) {
        setSelectedDate(dateKey);
        setNewEvent({ title: '', description: '' });
    }

    function handleAddEvent() {
        if (newEvent.title.trim()) {
            
            setEvents(prevEvents => {
                const updatedEvents = { ...prevEvents };

                if (!updatedEvents[selectedDate]) {
                    updatedEvents[selectedDate] = [];
                }

                updatedEvents[selectedDate] = [
                    ...updatedEvents[selectedDate],
                    { title: newEvent.title, description: newEvent.description }
                ];

                return updatedEvents;
            });

            setNewEvent({ title: '', description: '' }); 
        }
    }

    function handleDeleteEvent(dateKey, index) {
        setEvents(prevEvents => {
            const updatedEvents = { ...prevEvents };
            updatedEvents[dateKey].splice(index, 1);
            return updatedEvents;
        });
    }

    function handleEditEvent(dateKey, index, updatedEvent) {
        setEvents(prevEvents => {
            const updatedEvents = { ...prevEvents };
            updatedEvents[dateKey][index] = updatedEvent;
            return updatedEvents;
        });
    }

    return (
        <div className="calendar-container">
            <header>
                <button onClick={handlePrevMonth}>Previous</button>
                <h1>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h1>
                <button onClick={handleNextMonth}>Next</button>
            </header>
            <div className="calendar-grid">
                {renderCalendarGrid()}
            </div>

            {selectedDate && (
                <div className="event-form">
                    <h2>Events on {selectedDate}</h2>
                    <div>
                        {events[selectedDate]?.map((event, index) => (
                            <div key={index} className="event-item">
                                <strong>{event.title}</strong>
                                <p>{event.description}</p>
                                <button onClick={() => handleDeleteEvent(selectedDate, index)}>Delete</button>
                                <button onClick={() => handleEditEvent(selectedDate, index, { ...event, title: "Edited Title" })}>Edit</button>
                            </div>
                        ))}
                    </div>

                    <div className="add-event">
                        <input 
                            type="text" 
                            placeholder="Event Title" 
                            value={newEvent.title} 
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
                        />
                        <textarea 
                            placeholder="Event Description" 
                            value={newEvent.description} 
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} 
                        />
                        <button onClick={handleAddEvent}>Add Event</button>
                    </div>
                </div>
            )}

            <Link to="/dashboard">Terug</Link>
        </div>
    );
};

export default Kalender;
