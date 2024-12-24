import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ name: '', description: '', dueDate: '' });
    const [editTaskId, setEditTaskId] = useState(null);

    const API_URL = 'http://localhost:3001/to-do-app';

    // Fetch tasks
    useEffect(() => {
        const fetchTasks = async () => {
            const response = await axios.get(API_URL);
            setTasks(response.data);
        };
        fetchTasks();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    // Add a new task
    const handleAddTask = async (e) => {
        e.preventDefault();
        const response = await axios.post(`${API_URL}/new`, newTask);
        setTasks([...tasks, response.data.task]);
        setNewTask({ name: '', description: '', dueDate: '' });
    };

    // Update a task
    const handleUpdateTask = async (e, id) => {
        e.preventDefault();
        const response = await axios.put(`${API_URL}/update/${id}`, newTask);
        setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
        setEditTaskId(null);
        setNewTask({ name: '', description: '', dueDate: '' });
    };

    // Delete a task
    const handleDeleteTask = async (id) => {
        await axios.delete(`${API_URL}/delete/${id}`);
        setTasks(tasks.filter((task) => task._id !== id));
    };

    return (
        <div
            style={{
                fontFamily: 'Arial, sans-serif',
                margin: '20px',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                maxWidth: '600px',
                backgroundColor: '#f9f9f9'
            }}
        >
            <h1 style={{ color: '#333', textAlign: 'center' }}>To-Do App</h1>
    
            <form
                onSubmit={editTaskId ? (e) => handleUpdateTask(e, editTaskId) : handleAddTask}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginBottom: '20px'
                }}
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Task Name"
                    value={newTask.name}
                    onChange={handleChange}
                    required
                    style={{
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '16px'
                    }}
                />
                <textarea
                    name="description"
                    placeholder="Task Description"
                    value={newTask.description}
                    onChange={handleChange}
                    required
                    style={{
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '16px',
                        resize: 'none',
                        height: '80px'
                    }}
                />
                <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleChange}
                    required
                    style={{
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '16px'
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '10px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    {editTaskId ? 'Update Task' : 'Add Task'}
                </button>
            </form>
    
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {tasks.map((task) => (
                    <li
                        key={task._id}
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            padding: '10px',
                            marginBottom: '10px',
                            backgroundColor: '#fff'
                        }}
                    >
                        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{task.name}</h3>
                        <p style={{ margin: '0 0 5px 0', color: '#555' }}>{task.description}</p>
                        <p style={{ margin: '0 0 10px 0', color: '#777' }}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        <button
                            onClick={() => {
                                setEditTaskId(task._id);
                                setNewTask({ name: task.name, description: task.description, dueDate: task.dueDate });
                            }}
                            style={{
                                marginRight: '10px',
                                padding: '8px',
                                backgroundColor: '#008CBA',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteTask(task._id)}
                            style={{
                                padding: '8px',
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
    
};

export default App;
