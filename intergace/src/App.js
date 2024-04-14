import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignUpForm from './components/SignUpForm'
import LoginForm from './components/LoginForm'
import UserDashboard from './components/userDashboard'
import TaskPage from './components/taskPage'
import ImportantDashboard from './components/importantDashboard'
import CompletedDashboard from './components/completedDashboard.js'
import OverDueDashboard from './components/overDueDashboard'
import Trash from './components/Trash'

function App(){
  return(
    <Router>
      <Routes>

        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/userDashboard/taskPage" element={<TaskPage />} />
        <Route path="/ImportantDashboard" element={<ImportantDashboard />} />
        <Route path="/completedDashboard" element={<CompletedDashboard />} />
        <Route path="/OverDueDashboard" element={<OverDueDashboard />} />
        <Route path="/trash" element={<Trash />} />
      </Routes>
    </Router>
  );
}

export default App;