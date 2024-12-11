import React, { useState } from 'react';
import Axios from "axios";
import styles from '../style/LoginStyle.css'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';


export default function Login() {
    const navigate = useNavigate()
    const [username, setName] = useState('')
    const [password, setPassword] = useState('')
    const inputStyle ="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100"
    const {user, setUser} = useUser()

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        Axios.post(`http://127.0.0.1:8000/api/v1/login/`, 
        {'username':username, 'password':password},
        {
            headers: {
                "Content-Type": 'multipart/form-data',
                'Accept': 'application/json'
            }  
        }
        )
        .then(res => {
        if (res.status === 200){
            console.log("successfully login")
            localStorage.setItem('access', JSON.stringify(res.data.access));
            setUser(res.data.access)
            navigate('/'); 
        }
        })
        .catch(error => console.log(error))
       
    };

    return (
      <div className="bg-gray-200 flex justify-center items-center h-screen w-screen">
        <div className=" border-t-8 rounded-sm border-indigo-600 bg-white p-12 shadow-2xl w-96">
          <h1 className="font-bold text-center block text-2xl">Log In</h1>
          <form onSubmit={handleSubmit}>
          <label className="text-gray-500 block mt-3">User Name
          <input type="text" id="username" name="username" 
            onChange={(e)=>setName(e.target.value)}
            placeholder="username" autofocus={true} className={inputStyle}/>
          </label>
          <label className="text-gray-500 block mt-3">Password
          <input type="password" id="password" name="password" 
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="••••••••••" className={inputStyle}/>
          </label>
          <button 
            type="submit"
            className="mt-6 transition transition-all block py-3 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-400 hover:from-indigo-700 hover:to-purple-500 focus:bg-indigo-900 transform hover:-translate-y-1 hover:shadow-lg">
            Submit</button>
          <span>New User
            <button onClick={()=>navigate('/register')} className='btn btn-md'>Register</button>
          </span>
          </form>
        </div>
      </div>
    )
  }
