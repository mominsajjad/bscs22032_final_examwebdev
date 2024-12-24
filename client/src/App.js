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
        <div className="App">
            <h1>To-Do App</h1>

            {}
            <form onSubmit={editTaskId ? (e) => handleUpdateTask(e, editTaskId) : handleAddTask}>
                <input
                    type="text"
                    name="name"
                    placeholder="Task Name"
                    value={newTask.name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Task Description"
                    value={newTask.description}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{editTaskId ? 'Update Task' : 'Add Task'}</button>
            </form>

            {}
            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        <h3>{task.name}</h3>
                        <p>{task.description}</p>
                        <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        <button onClick={() => {
                            setEditTaskId(task._id);
                            setNewTask({ name: task.name, description: task.description, dueDate: task.dueDate });
                        }}>Edit</button>
                        <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
