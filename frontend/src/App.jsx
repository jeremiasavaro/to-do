import { useState, useEffect } from "react";

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
    <div>
      <h1>To-Do List</h1>
      <form onSubmit={handleAddWork}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="New Task"
        />
        <button type="submit">Add task</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.description} style={{ textDecoration: task.finished === 0 ? 'line-through' : 'none' }}>
            {task.description} - <em>{new Date(task.dateAdded).toLocaleDateString()}</em>
            <input
              type="checkbox"
              checked={task.finished === 0} 
              onChange={() => handleCompleteTask(task.description)} 
            />
            <button onClick={() => handleDeleteTask(task.description)}>Delete task</button>
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
};

export default App;
