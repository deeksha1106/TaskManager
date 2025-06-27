import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    document.body.className = dark ? "dark-theme" : "";
  }, [dark]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
   const res = await axios.get(`${BACKEND_URL}/tasks`);
      setTasks(res.data);
    } catch (error) {
      alert("Failed to fetch tasks");
    }
    setLoading(false);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(`${BACKEND_URL}/tasks`, { title });
      setTitle("");
      fetchTasks();
    } catch (error) {
      alert("Failed to add task");
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await axios.put(`${BACKEND_URL}/tasks/${id}`, {
        completed: !completed,
      });
      fetchTasks();
    } catch (error) {
      alert("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      alert("Failed to delete task");
    }
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditingValue(task.title);
  };

  const handleEditChange = (e) => {
    setEditingValue(e.target.value);
  };

  const saveEdit = async (task) => {
    if (!editingValue.trim()) return;
    try {
      await axios.put(`${BACKEND_URL}/tasks/${task._id}`, {
        title: editingValue,
        completed: task.completed,
      });
      setEditingId(null);
      setEditingValue("");
      fetchTasks();
    } catch (error) {
      alert("Failed to edit task");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  return (
    <div className={`main-bg min-vh-100 d-flex align-items-center justify-content-center${dark ? " dark-main-bg" : ""}`}>
      <div className={`card glass-card border-0 shadow-lg my-5 mx-2 ${dark ? "dark-card" : ""}`} style={{width: "100%", maxWidth: 480}}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="card-title text-center mb-0 fw-bold gradient-text" style={{ flex: 1 }}>
              <i className="bi bi-check2-square me-2"></i>Vector List
            </h2>
            <button
              className={`btn btn-sm rounded-circle ms-2 theme-toggle ${dark ? "btn-light" : "btn-dark"}`}
              title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              onClick={() => setDark((d) => !d)}
              style={{ width: 38, height: 38 }}
            >
              <i className={`bi ${dark ? "bi-brightness-high-fill" : "bi-moon-stars-fill"}`}></i>
            </button>
          </div>
          <form className="d-flex mb-4 gap-2" onSubmit={addTask}>
            <input
              className="form-control form-control-lg rounded-pill shadow-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new task..."
              autoFocus
            />
            <button className="btn btn-gradient rounded-pill px-4" type="submit">
              <i className="bi bi-plus-lg"></i>
            </button>
          </form>
          {loading ? (
            <div className="text-center my-3">
              <div className="spinner-border text-primary" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-muted">No tasks yet. Add one!</div>
          ) : (
            <ul className="list-group list-group-flush">
              {tasks.map((task, idx) => (
                <li
                  key={task._id}
                  className={`list-group-item px-0 border-0 d-flex justify-content-between align-items-center bg-transparent fade-in`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {editingId === task._id ? (
                    <span className="flex-grow-1 d-flex align-items-center edit-span">
                      <input
                        type="text"
                        className="form-control form-control-sm me-2"
                        value={editingValue}
                        onChange={handleEditChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(task);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                        style={{ maxWidth: "70%" }}
                      />
                      <button className="btn btn-success btn-sm me-1" title="Save" onClick={() => saveEdit(task)}>
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button className="btn btn-secondary btn-sm" title="Cancel" onClick={cancelEdit}>
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </span>
                  ) : (
                    <span
                      className={`task-text text-break ${task.completed ? "completed" : ""}`}
                      onClick={() => toggleTask(task._id, task.completed)}
                      title="Click to mark complete/incomplete"
                    >
                      {task.completed ? (
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                      ) : (
                        <i className="bi bi-circle me-2"></i>
                      )}
                      {task.title}
                    </span>
                  )}
                  <span className="d-flex align-items-center">
                    <button
                      className="btn btn-sm btn-outline-primary rounded-circle d-flex align-items-center justify-content-center me-1"
                      style={{width: 32, height: 32}}
                      onClick={() => startEditing(task)}
                      aria-label="Edit"
                      disabled={editingId === task._id}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                      style={{width: 32, height: 32}}
                      onClick={() => deleteTask(task._id)}
                      aria-label="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
