import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import Axios from "axios";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const {user} = useUser()
    const [tasks, setTaskList] = useState([])
    const [nextpage, setNext] = useState('http://127.0.0.1:8000/api/v1/task/')
    const [prevpage, setPrev] = useState('')
    const [total, setTotal] = useState(0)

    useEffect(()=>{
        Axios.get(nextpage, 
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
            setPrev(res.data.prevpage)
            setTotal(res.data.count)
        }
        })
        .catch(error => console.log(error))
    }, [])
   
    return (
        <TaskContext.Provider value={{ tasks, setTaskList, nextpage, setNext, prevpage, setPrev, total}}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskList = () => useContext(TaskContext);