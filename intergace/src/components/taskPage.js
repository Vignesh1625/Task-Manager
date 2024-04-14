import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "./taskPage.css";

const ShowTaskPage = () => {
  const location = useLocation();
  const { task_id, task_name: initialTaskName, task_description: initialTaskDescription, task_duedate: initialTaskDueDate, task_priority: initialTaskPriority } = location.state;
  const [taskName, setTaskName] = useState(initialTaskName);
  const [taskDescription, setTaskDescription] = useState(initialTaskDescription);
  const [taskDueDate, setTaskDueDate] = useState(initialTaskDueDate);
  const [taskPriority, setTaskPriority] = useState(initialTaskPriority);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


  const handleSave = async () => {
    try {
      if (task_id) {
        // Update existing task
        const response = await axios.post(
          "http://localhost:5000/api/updateTask",
          {
            task_id,
            task_name: taskName,
            task_description: taskDescription,
            task_duedate: taskDueDate,
            task_priority: taskPriority
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          alert("Task updated successfully");
        } else {
          throw new Error("Failed to update task");
        }
      } else {
        // Add new task
        const response = await axios.post(
          "http://localhost:5000/api/addTask",
          {
            task_name: taskName,
            task_description: taskDescription,
            task_duedate: taskDueDate,
            task_priority: taskPriority
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          alert("Task added successfully");
          // Optionally reset form fields after successful addition
          // setTaskName("");
          // setTaskDescription("");
          // setTaskDueDate("");
          // setTaskPriority(false);
        } else {
          throw new Error("Failed to add task");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to save task. Please try again.");
    }
  };
  const toUserDashboard = () => {
    navigate('/userDashboard')
  };
  const toImportantDashboard = () => {
    navigate('/importantDashboard')
  };
  const toOverdueDashboard = () => {
    navigate('/overdueDashboard')
  };
  const toCompletedDashboard = () => {
    navigate('/completedDashboard')
  };
  const toTrash = () => {
    navigate('/trash')
  };
  const handleTaskPriorityChange = (e) => {
    setTaskPriority(e.target.checked);
  };

  const handleTaskDueDateChange = (e) => {
    setTaskDueDate(e.target.value);
  };

  const handleTaskNameChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleTaskDescriptionChange = (e) => {
    setTaskDescription(e.target.value);
  };

  return (
    <div className="task-page">

      <header className="py-3 mb-3 border-bottom">
        <div className="container-fluid d-grid gap-3 align-items-center" style={{gridTemplateColumns: '1fr 2fr'}}>
          <div className="dropdown">
            
          </div>

          <div className="d-flex align-items-center">
            <form className="w-100 me-3" role="search">
              <input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
            </form>

            <div className="flex-shrink-0 dropdown">
              <a  className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" className="rounded-circle" />
              </a>
              <ul className="dropdown-menu text-small shadow">
                <li><a className="dropdown-item" >New project...</a></li>
                <li><a className="dropdown-item" >Settings</a></li>
                <li><a className="dropdown-item" >Profile</a></li>
                <li><hr className="dropdown-divider" /></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <div className="content container-fulid">
      <div className="sidebar d-flex flex-column flex-shrink-0 p-3 text-dark" style={{width: '250px'}}>
        <ul className="nav nav-pills flex-column mb-auto">
        <li>
            <a onClick={toUserDashboard} className="nav-link text-white">
              <svg className="bi pe-none me-2" width="16" height="16"><use href="#speedometer2"></use></svg>
              Dashboard
            </a>
          </li>
          <li>
            <a onClick={toImportantDashboard} className="nav-link text-white">
              <svg className="bi pe-none me-2" width="16" height="16"><use href="#table"></use></svg>
              Important tasks
            </a>
          </li>
          <li>
            <a onClick={toOverdueDashboard} className="nav-link">
              <svg className="bi pe-none me-2" width="16" height="16"><use href="#grid"></use></svg>
              Overdue tasks
            </a>
          </li>
          <li>
            <a onClick={toCompletedDashboard} className="nav-link text-white">
              <svg className="bi pe-none me-2" width="16" height="16"><use href="#people-circle"></use></svg>
              Completed tasks
            </a>
          </li>
          <li>
            <a onClick={toTrash} className="nav-link text-white">
              <svg className="bi pe-none me-2" width="16" height="16"><use href="#toggles2"></use></svg>
              Trash/bin
            </a>
          </li>
        </ul>

      </div>      

      <div className="container">
          <div className="first-row">
            <p>Task ID: {task_id}</p>

            <div className="prioritydiv">
              <input
                type="checkbox"
                checked={taskPriority}
                onChange={handleTaskPriorityChange}
              />
              <p>Priority</p>

              <input
                className="task-duedate"
                type="date"
                value={taskDueDate || ""}
                onChange={handleTaskDueDateChange}
              />
            </div>

          </div>

          <input
            className="task-name"
            placeholder="Task Name"
            type="text"
            value={taskName || ""}
            onChange={handleTaskNameChange}
          />
          <br />
          <hr />
          <textarea
            className="task-description"
            placeholder="Task Description"
            type="text"
            value={taskDescription || ""}
            onChange={handleTaskDescriptionChange}
          />
          <br />

          <div className="last-row">
            <div className="save-button">
              <button onClick={handleSave}>{task_id ? "Update task" : "Add Task"}</button>
            </div>
          </div>
        </div>
    </div>
    
    </div>
  );
};

export default ShowTaskPage;
