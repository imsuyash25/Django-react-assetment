import '../style/AddTask.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import '../style/TaskList.css'
import { useNavigate } from 'react-router-dom';
import CreateTask from './CreateTask';
import { useTaskList } from '../context/TaskContext';
import editIcon from '../style/edit.png';
import deleteIcon from '../style/delete.png'
import Axios from 'axios';
import { useUser } from '../context/UserContext';

function Task() {
    const navigate = useNavigate()
    const {user} = useUser()
    const [isPopupOpen, setPopupOpen] = useState(false);
    const {tasks, setTaskList, nextpage, setNext, prevpage, setPrev, total, setTotal} = useTaskList()
    const [updateItem, setUpdateItem] = useState({
        title: '',
        description: '',
        status: 'Pending',
        due_date: ''
    })

    const togglePopup = () => {
        setUpdateItem({
            title: '',
            description: '',
            status: 'Pending',
            due_date: ''
        })
        setPopupOpen(!isPopupOpen);
    };

    const handleTaskChange =(task)=>{
        setPopupOpen(!isPopupOpen)
        setUpdateItem(task)
    }

    const handleDeleteTask =(task)=>{
        Axios.delete(`http://127.0.0.1:8000/api/v1/task/${task.uuid}/`,
        {
            headers: {
                'Authorization': `Bearer ${user}`,
            }  
        }
        )
        .then(res => {
            if (res.status === 204){
                const updatedTasks = tasks.filter(item => item.uuid !== task.uuid);
                setTaskList(updatedTasks)
                setTotal(total-1)
            }
            })
            .catch(error => console.log(error))
    }


    const formatDateForInput = (dateString) => {
        return dateString.split('T')[0]
    };

    const changePage = (targetpage)=>{
        Axios.get(targetpage, 
            {
                headers: {
                    'Authorization': `Bearer ${user}`,
                    'Content-Type': 'application/json',
                }
            }
            )
            .then(res => {
            if (res.status === 200){
                setTaskList(res.data.results)
                setNext(res.data.next)
                setPrev(res.data.previous)
                setTotal(res.data.count)
            }
            })
            .catch(error => console.log(error))
    }
    const handleSearchItem = (e)=>{
        const value = e.target.value
        Axios.get(`http://127.0.0.1:8000/api/v1/task/?search=${value}`, 
            {
                headers: {
                    'Authorization': `Bearer ${user}`,
                    'Content-Type': 'application/json',
                }
            }
            )
            .then(res => {
            if (res.status === 200){
                setTaskList(res.data.results)
                setNext(res.data.next)
                setPrev(res.data.previous)
                setTotal(res.data.count)
            }
            })
            .catch(error => console.log(error))
    }

    return (
        <>

            <div className="container">

                <div className="row d-flex justify-content-center mt-3 ">
                    <div className="col-md-11">
                        
                        <div className="card">
                            <div className="d-flex justify-content-between align-items-center">
                                <button onClick={togglePopup} className="btn btn-md btn-primary mr-2">Create Task</button>
                                <div className="d-flex flex-row">
                                    <button className="btn btn-primary mr-2 active">Active</button>
                                    <button className="btn btn-primary new"><i className="fa fa-plus"></i> New</button>
                                </div>
                            </div>
                            <div className="mt-3 inputs">
                                <i className="fa fa-search"></i>
                                <input onChange={handleSearchItem} type="text" className="form-control" placeholder="Search Tasks By Title, Due Date, Status..."/>
                            </div>
                           
                            {tasks.map((item)=>(
                                <div className="mt-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex flex-row align-items-center">
                                            <span className="star"><i className="fa fa-star yellow"></i></span>
                                            <div className="d-flex flex-column">
                                                <span className="tasktitle">{item.title}</span>
                                                <div className="taskdescription">{item.description}</div>
                                                <div className="d-flex flex-row align-items-center time-text taskdesc">
                                                    <div class={item.status === 'Completed'? "badge bg-success":"badge bg-secondary"}>{item.status}</div>
                                                    <span className="dots"></span>
                                                    <small>Due Date {formatDateForInput(item.due_date)}</small>
                                                    <span className="dots"></span>
                                                    <small>Edited {formatDateForInput(item.updated_at)}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                        <span onClick={()=>handleTaskChange(item)} className="content-text-1 mx-1">
                                            <img src={editIcon}/>
                                        </span>
                                        <span onClick={()=>handleDeleteTask(item)}className="content-text-2 mx-1">
                                            <img src={deleteIcon}/>
                                        </span>
                                        </div>
                                    </div>
                                </div>
                             ))
                            }
                             <div className="pagination mt-2">
                                {prevpage? 
                                <button onClick={()=>changePage(prevpage)} className="btn btn-md text-primary">Previous Page</button>
                                :null}
                                {nextpage?
                                <div className='flex-grow-1'>
                                <button onClick={()=>changePage(nextpage)} className="btn btn-md float-right text-primary">Next Page </button>
                                </div>:null}
                            </div>
                        </div>
                    </div>
                </div>
                <CreateTask task={updateItem} setTask={setUpdateItem} isOpen={isPopupOpen} onClose={togglePopup} />
            </div>
        </>
    )
}

export default Task;