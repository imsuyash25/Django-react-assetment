import { Outlet, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Popper from 'popper.js'; 
import Task from './Task.js'
import React from 'react';
import { useUser } from '../context/UserContext';
import Axios from "axios";
import { useNavigate } from 'react-router-dom';

const Layout = () => {
  const {user, setUser} = useUser()
  const navigate = useNavigate()

  const handlelogout=()=>{
    Axios.get(`http://127.0.0.1:8000/api/v1/logout/`,
        {
          headers: {
              'Authorization': `Bearer ${user}`,
              'Content-Type': 'application/json',
          }
        }
    )
      .then(res => {
        if (res.status === 200) {
            console.log("successfully logout")
            if (localStorage.getItem('access')) {
                localStorage.removeItem('access');
            }
            setUser({})
            navigate('/login');
        }
      })
      .catch(error => console.log(error))
  }
  return (
    <>
     <div className="container-fluid">
        <button onClick={handlelogout} className="btn btn-sm mb-0 btn-primary float-right">Logout</button>
        <Outlet />
    </div>
    </>
  )
};

export default Layout;