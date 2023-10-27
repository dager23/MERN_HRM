import React from 'react'
import Login from './Userlogin'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import Employee from './Employee'
import Profile from './Profile'
import Home from './Home'
import AddEmployee from './AddEmployee'
import EditEmployee from './EditEmployee'
import Start from './Start'
import EmployeeDetail from './EmployeeDetail'
import EmployeeLogin from './EmployeeLogin'
import YourComponent from '/LoadImage'


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Dashboard />}>
         <Route path='' element={<Home/>}></Route>
         <Route path='/employee' element={<Employee/>}></Route>
         <Route path='/Profile' element={<Profile/>}></Route>
         <Route path='/create' element={<AddEmployee/>}></Route>
         <Route path='/home' element={<Home/>}></Route>
         <Route path='/employeeEdit/:id' element={<EditEmployee/>}></Route>
        </Route>

        <Route path='/start' element={<Start/>}></Route>
        <Route path='/employeeLogin' element={<EmployeeLogin/>}></Route>
        <Route path='/employeedetail/:id' element={<EmployeeDetail/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/get_image' element={<YourComponent/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App