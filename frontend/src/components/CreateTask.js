import React, { useState } from 'react';
import Axios from 'axios';
import { Alert } from 'bootstrap';
import { useTaskList } from '../context/TaskContext';
import { useUser } from '../context/UserContext';


const CreateTask = ({ isOpen, onClose, task, setTask }) => {
    const {user, setUser} = useUser()

    const {tasks, setTaskList} = useTaskList()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value })
    };

    const formatDateForInput = (dateString) => {
        return dateString.split('T')[0]
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (task.uuid){
            Axios.patch(`http://127.0.0.1:8000/api/v1/task/${task.uuid}/`, 
            task,
            {
                headers: {
                    'Authorization': `Bearer ${user}`,
                    "Content-Type": 'multipart/form-data',
                    'Accept': 'application/json'
                }  
            }
            )
            .then(res => {
                if (res.status === 200){
                    const updatedTasks = tasks.map(item => 
                            item.uuid === task.uuid ? { ...item, ...res.data } : item
                        )
            
                    setTaskList(updatedTasks);
                    setTask({
                        title: '',
                        description: '',
                        status: 'Pending',
                        due_date: ''
                    })
                }
                })
                .catch(error => console.log(error))
        }
        else{
            Axios.post(`http://127.0.0.1:8000/api/v1/task/`, 
            task,
            {
                headers: {
                    'Authorization': `Bearer ${user}`,
                    "Content-Type": 'multipart/form-data',
                    'Accept': 'application/json'
                }  
            }
            )
        
            .then(res => {
            if (res.status === 201){
                if (tasks.length == 10){
                    setTaskList((prevTasks) => {
                        const updatedTasks = [res.data, ...prevTasks.slice(0, -1)];
                        return updatedTasks;
                    });
                }
                else{
                    setTaskList(previousState => [res.data, ...previousState])
                }
                setTask({
                    title: '',
                    description: '',
                    status: 'Pending',
                    due_date: ''
                })
            }
            })
            .catch(error => console.log(error))
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h1>Add New Task</h1>
                <form className='addtask0' onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={task.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={task.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            name="status"
                            value={task.status}
                            onChange={handleChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date:</label>
                        <input
                            type="date"
                            id="dueDate"
                            name="due_date"
                            value={formatDateForInput(task.due_date)}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button className='taskbutton' type="submit">{task.uuid?"Update":"Add"}</button>
                    <button className='taskbutton' type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;