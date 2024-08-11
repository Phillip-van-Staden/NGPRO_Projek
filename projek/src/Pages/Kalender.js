import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Kalender.css';

function Kalender () {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState({});  
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEvent, setNewEvent] = useState({ title: '', description: '' });

    function handleNextMonth () {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    function handlePrevMonth () {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    function getDaysInMonth (month, year) {
        return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());

    function renderCalendarGrid () {
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
                </div>
            );
        }
        return grid;
    };

    function handleDayClick (dateKey) {
        setSelectedDate(dateKey);
        setNewEvent({ title: '', description: '' });
    };

    function handleAddEvent () {
        if (newEvent.title.trim()) {
            setEvents(prevEvents => ({
                ...prevEvents,
                [selectedDate]: [...(prevEvents[selectedDate] || []), newEvent]
            }));
            setNewEvent({ title: '', description: '' });
        }
    };

    function handleDeleteEvent (dateKey, index) {
        setEvents(prevEvents => {
            const updatedEvents = [...prevEvents[dateKey]];
            updatedEvents.splice(index, 1);
            return { ...prevEvents, [dateKey]: updatedEvents };
        });
    };

    function handleEditEvent (dateKey, index, updatedEvent) {
        setEvents(prevEvents => {
            const updatedEvents = [...prevEvents[dateKey]];
            updatedEvents[index] = updatedEvent;
            return { ...prevEvents, [dateKey]: updatedEvents };
        });
    };

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

            <Link to="/VorderingVolg">Go to Vordering Volg</Link>
        </div>
    );
};

export default Kalender;
