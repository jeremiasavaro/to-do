import { useState, useEffect } from "react";
import './assets/styles.css';

const App = () => {
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/works')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => setMessage('Error loading tasks'));
  }, []);

  const handleAddWork = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (response.ok) {
        setMessage('Task added succesfuly');
        setDescription('');
        const updatedTasks = await fetch('http://127.0.0.1:5000/works');
        const tasksData = await updatedTasks.json();
        setTasks(tasksData);
      } else {
        setMessage('Error when adding task');
      }
    } catch (error) {
      setMessage('Connection error');
    }
  };

  const handleCompleteTask = async (description) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/work/${description}/complete`, {
        method: 'POST',
      });

      if (response.ok) {
        const updatedTasks = await fetch('http://127.0.0.1:5000/works');
        const tasksData = await updatedTasks.json();
        setTasks(tasksData);
      } else {
        setMessage('Error when updating tasks');
      }
    } catch (error) {
      setMessage('Connection error');
    }
  };

  const handleDeleteTask = async (description) => {
    const confirmDelete = window.confirm("You want to delete this task?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/work/${description}/delete`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMessage('Task deleted');
          const updatedTasks = await fetch('http://127.0.0.1:5000/works');
          const tasksData = await updatedTasks.json();
          setTasks(tasksData);
        } else {
          setMessage('Error when deleting tasks');
        }
      } catch (error) {
        setMessage('Connection error');
      }
    }
  };

  return (
    <div class="container">
      <h1 class="title">To-Do List</h1>
      <form class="form" onSubmit={handleAddWork}>
        <input
          type="text"
          class="input"
          placeholder="Add a new task"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" class="add-button">Add</button>
      </form>
      <div class="task-list">
        {tasks.map(task => (
        <div class="card" key={task.description}>
          <div class="header">
              <p className={`task-description ${task.finished === 0 ? 'task-finished' : ''}`}>
                {task.description}
              </p>
              <label className="containercheck">
                <input
                  type="checkbox"
                  checked={task.finished === 0}
                  onChange={() => handleCompleteTask(task.description)}
                  style={{ display: 'none' }}
                />
                <svg viewBox="0 0 64 64" height="1em" width="1em" className={`checkbox-svg ${task.finished === 0 ? 'checked' : ''}`}>
                  <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" className="path"></path>
                </svg>
              </label>
              <button class="delete-button" onClick={() => handleDeleteTask(task.description)}>Delete</button>
          </div>
          <div class="footer">
              <p class="date-added">Added on: {task.dateAdded}</p>
          </div>
       </div>
        ))}
      </div>
    </div>
  );
};

export default App;
