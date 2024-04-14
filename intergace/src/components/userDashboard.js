import React, { useState, useEffect } from "react";
import axios from "axios";
import "./userDashboard.css";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";




const UserDashboard = () => {
  const [tasks, setTasks] = useState({ pendingTasks: [], completedTasks: [] });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([tasks.pendingTasks, tasks.completedTasks]);
 

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks", {
        withCredentials: true,
      });
      setTasks(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks({ pendingTasks: [], completedTasks: [] });
      setErrorMessage(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const filtered = [...tasks.pendingTasks, ...tasks.completedTasks].filter(task =>
      task.name && task.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [query, tasks]);


  const markTaskPending = async (task_id) => {
    try {
      await axios.post(
        "http://localhost:5000/api/markTaskPending",
        { task_id },
        { withCredentials: true }
      );
      alert("Marked as Pending");
      //fetchTasks(); // Refresh tasks after marking as pending
    } catch (error) {
      console.error("Error marking task as pending:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to mark task as pending"
      );
    }
  };

  const markTaskCompleted = async (task_id) => {
    try {
      await axios.post(
        "http://localhost:5000/api/markTaskCompleted",
        { task_id },
        { withCredentials: true }
      );
      alert("Marked as Completed");
      //fetchTasks(); // Refresh tasks after marking as completed
    } catch (error) {
      console.error("Error marking task as completed:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to mark task as completed"
      );
    }
  };

  const deleteTask = async (task_id) => {
    try {
      await axios.post(
        "http://localhost:5000/api/deleteTask",
        { task_id },
        { withCredentials: true }
      );
      alert("Task deleted successfully");
      //fetchTasks(); // Refresh tasks after deleting a task
    } catch (error) {
      console.error("Error deleting task:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }

  const toUnImportant = async (task_id) => {
    try {
      await axios.post(
        "http://localhost:5000/api/toUnImportant",
        { task_id },
        { withCredentials: true }
      );
      alert("Task marked as unimportant");
      //fetchTasks(); // Refresh tasks after marking as unimportant
    } catch (error) {
      console.error("Error marking task as unimportant:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to mark task as unimportant"
      );
    }
  }

  const toImportant = async (task_id) => {
    try {
      await axios.post(
        "http://localhost:5000/api/toImportant",
        { task_id },
        { withCredentials: true }
      );
      alert("Task marked as important");
      //fetchTasks(); // Refresh tasks after marking as important
    } catch (error) {
      console.error("Error marking task as important:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to mark task as important"
      );
    }
  }

  const LogoutSession = async () => {
    try {
      await axios.get("http://localhost:5000/api/logout", {
        withCredentials: true,
      });
      navigate('/login')
    } catch (error) {
      console.error("Error logging out:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to logout"
      );
    }
  };
  
  const showTask = async (task_id,task_name,task_description,task_duedate,task_priority) => {
    navigate(`./taskPage`,{state: {task_id: task_id,task_description: task_description,task_name: task_name,task_duedate: task_duedate,task_priority: task_priority}});
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


  return (
    <div className='user-dashboard'>

      <header className="py-3 mb-3 border-bottom">
        <div className="container-fluid d-grid gap-3 align-items-center" style={{gridTemplateColumns: '1fr 2fr'}}>
          <div className="dropdown">
            
          </div>

          <div className="d-flex align-items-center">
            <form className="w-100 me-3 flex" role="search">
              <input type="text" className="form-control" placeholder="Search..." aria-label="Search" value={query} onChange={e => setQuery(e.target.value)}/>
            </form>

            <div className="flex-shrink-0 dropdown">
              <a href="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" className="rounded-circle" />
              </a>
              <ul className="dropdown-menu text-small shadow">
                <li><a className="dropdown-item" href="#">Profile</a></li>
                <li><a className="dropdown-item" onClick={LogoutSession}>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>


      <div className="content container-fulid">
      <div className="sidebar d-flex flex-column flex-shrink-0 p-3 text-dark" style={{width: '250px'}}>
        <ul className="nav nav-pills flex-column mb-auto">
          <li>
            <a onClick={toUserDashboard} className="nav-link">
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
            <a onClick={toOverdueDashboard} className="nav-link text-white">
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



      <div className="userTasks">
        <div className="task-list">
          {(tasks.pendingTasks.length > 0 || tasks.completedTasks.length > 0) ? (
            <>
              {tasks.pendingTasks.map((task, index) => (
                <div key={task._id} className="task">
                  <div className="task_header">
                    <p className="task_name" onClick={() => showTask(task._id, task.task_name, task.task_description, task.task_duedate, task.task_priority)}>
                      {task.task_name}
                    </p>

                    <button className="delete_task" onClick={() => deleteTask(task._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                    </button>

                  </div>
                  <hr/>
                  <p className="task_duedate">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                  </svg>
                       : {task.task_duedate}</p>
                  <p className="task_description"> {task.task_description}</p>
                  <p className="task_priority">Priority: {task.task_priority ? 'High' : 'Normal'}</p>
                  <div className="task_fotter">
                    <button onClick={() => markTaskCompleted(task._id)}>
                      Mark as Completed
                    </button>
                    
                    <button onClick={() => task.task_priority ? toUnImportant(task._id) : toImportant(task._id)}>
                      {task.task_priority ? "Unimportant" : "Important"}
                    </button>
                  </div>
                </div>
                
              ))}
              {tasks.completedTasks.map((task, index) => (
                <div key={task._id} className="task">
                <div className="task_header">
                  <p className="task_name" onClick={() => showTask(task._id, task.task_name, task.task_description, task.task_duedate, task.task_priority)}>
                    {task.task_name}
                  </p>

                  <button className="delete_task" onClick={() => deleteTask(task._id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                  </svg>
                  </button>

                </div>
                <hr/>
                <p className="task_duedate">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar" viewBox="0 0 16 16">
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                </svg>
                     : {task.task_duedate}</p>
                <div className="task_middle">
                  <p className="task_description"> {task.task_description}</p>
                  <p className="task_priority">Priority: {task.task_priority ? 'High' : 'Normal'}</p>
                
                </div>
                <div className="task_fotter">
                  <button onClick={() => markTaskPending(task._id)}>
                    Mark as Pending
                  </button>
                </div>
              </div>
              ))}
            </>
          ) : (
            <p>No tasks found</p>
          )}
        </div>
        <p className="error">{errorMessage}</p>
        <div className="addtask">
          <button onClick={() => showTask(null,null,null,null,null)}>Add Task</button>
        </div>
      </div>

      </div>

    </div>


  );
};

export default UserDashboard;
