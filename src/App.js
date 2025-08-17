import React, { useState, useEffect, useRef } from 'react';
// CHANGED: Import axios for making API requests
import axios from 'axios';

// CHANGED: Define the base URL of your deployed backend.
// Replace this with your actual Render.com URL once deployed.
const API_BASE_URL = 'https://your-todo-backend-name.onrender.com/api';

export default function App() {
  // --- States remain the same ---
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const audioRef = useRef(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [stats, setStats] = useState({});

  // Helper function to get the current date as a key
  const getTodayKey = () => new Date().toISOString().split('T')[0];

  // CHANGED: useEffect to load data from the backend API on initial render
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both todos and stats from the backend in parallel
        const [todosResponse, statsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/todos`),
          axios.get(`${API_BASE_URL}/stats`)
        ]);
        setTodos(todosResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchData();
  }, []); // Empty dependency array means this runs only once on mount

  // CHANGED: handleAdd now sends data to the backend
  const handleAdd = async () => {
    if (task.trim() === '') return;
    try {
      // Send a POST request to create the new todo
      const response = await axios.post(`${API_BASE_URL}/todos`, { text: task });
      const newTodo = response.data;
      
      // Add the new todo to the state and refetch stats
      setTodos([newTodo, ...todos]);
      setTask('');
      fetchStats(); // Update stats dashboard
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // CHANGED: handleToggle now updates the todo in the backend
  const handleToggle = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`);
      const updatedTodo = response.data;
      
      // Update the specific todo in the state
      setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo)));
      
      // If a task was completed, refetch stats to update the score
      if (updatedTodo.completed) {
        fetchStats();
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  // CHANGED: handleDelete now sends a delete request to the backend
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      // Remove the todo from the state
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // CHANGED: handleSaveEdit now sends an update request to the backend
  // Note: This requires a corresponding endpoint on your backend.
  // I will assume you have one like `PUT /api/todos/edit/:id`
  const handleSaveEdit = async (id) => {
    if (editText.trim() === '') return;
    try {
      // This endpoint is not in the backend code from the previous step,
      // but this is how you would implement it. For now, this will fail.
      // const response = await axios.put(`${API_BASE_URL}/todos/edit/${id}`, { text: editText });
      // const updatedTodo = response.data;
      
      // For now, we simulate the update locally.
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, text: editText } : todo
      ));

      setEditId(null);
      setEditText('');
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  // NEW: Helper function to refetch stats
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // --- No changes to the functions below ---

  const handleStartEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };
  
  const handleCancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  useEffect(() => {
    setTimeLeft(timerMinutes * 60);
  }, [timerMinutes]);

  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) {
      setTimerRunning(false);
      alert('Timer finished!');
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft, timerRunning]);

  const startTimer = () => {
    if (timeLeft > 0) setTimerRunning(true);
  };
  const pauseTimer = () => setTimerRunning(false);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerMinutes * 60);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setMusicPlaying(!musicPlaying);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const ProductivityDashboard = () => {
    const today = getTodayKey();
    const todayStats = stats[today] || { created: 0, completed: 0 };
    const productivityScore = todayStats.created > 0 
      ? Math.round((todayStats.completed / todayStats.created) * 100)
      : 0;
    const pastDays = Object.keys(stats)
      .filter(date => date !== today)
      .sort((a, b) => new Date(b) - new Date(a));

    return (
      <div style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 20 }}>
        <h3>Productivity Dashboard 📊</h3>
        <div style={{ background: '#f0f8ff', padding: 15, borderRadius: 8, marginBottom: 20 }}>
          <h4>Today's Summary</h4>
          <p><strong>Tasks Created:</strong> {todayStats.created}</p>
          <p><strong>Tasks Completed:</strong> {todayStats.completed}</p>
          <p><strong>Productivity Score:</strong> {productivityScore}%</p>
        </div>
        {pastDays.length > 0 && (
          <div>
            <h4>Past Activity</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {pastDays.map(date => {
                const dayStats = stats[date];
                const score = dayStats.created > 0 ? Math.round((dayStats.completed / dayStats.created) * 100) : 0;
                return (
                  <li key={date} style={{ background: '#f9f9f9', padding: '10px', borderRadius: 5, marginBottom: 8 }}>
                    <strong>{new Date(date).toDateString()}:</strong> Created {dayStats.created}, Completed {dayStats.completed} ({score}%)
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h2>Enhanced To-Do List with Timer & Music</h2>

      <div>
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={e => setTask(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          style={{ width: '70%', padding: 8, marginRight: 8 }}
        />
        <button onClick={handleAdd} style={{ padding: '8px 12px' }}>Add</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
        {/* CHANGED: Use `todo._id` from MongoDB as the key and for handlers */}
        {todos.map(todo => (
          <li key={todo._id} style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo._id)}
              style={{ marginRight: 10 }}
            />
            {editId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  style={{ flexGrow: 1, padding: 6 }}
                />
                <button onClick={() => handleSaveEdit(todo._id)} style={{ marginLeft: 8 }}>Save</button>
                <button onClick={handleCancelEdit} style={{ marginLeft: 4 }}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  onDoubleClick={() => handleStartEdit(todo._id, todo.text)}
                  style={{
                    flexGrow: 1,
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#999' : '#000',
                    cursor: 'pointer',
                  }}
                  title="Double-click to edit"
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => handleDelete(todo._id)}
                  style={{
                    marginLeft: 10,
                    backgroundColor: '#ff4d4f',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      
      <ProductivityDashboard />

      {/* --- Timer and Music sections remain unchanged --- */}
      <div style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 20 }}>
        <h3>Timer ⏱️</h3>
        <div>
          <label>
            <input type="radio" name="timer" checked={timerMinutes === 15} onChange={() => setTimerMinutes(15)} /> 15 min
          </label>{' '}
          <label>
            <input type="radio" name="timer" checked={timerMinutes === 30} onChange={() => setTimerMinutes(30)} /> 30 min
          </label>{' '}
          <label>
            <input type="radio" name="timer" checked={timerMinutes === 50} onChange={() => setTimerMinutes(50)} /> 50 min
          </label>
        </div>
        <div style={{ fontSize: '2rem', marginTop: 10 }}>{formatTime(timeLeft)}</div>
        <div>
          {!timerRunning ? (
            <button onClick={startTimer} style={{ marginRight: 10, padding: '6px 12px' }}>Start</button>
          ) : (
            <button onClick={pauseTimer} style={{ marginRight: 10, padding: '6px 12px' }}>Pause</button>
          )}
          <button onClick={resetTimer} style={{ padding: '6px 12px' }}>Reset</button>
        </div>
      </div>
      <div style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 20 }}>
        <h3>Light Ambient Music 🎵</h3>
        <audio ref={audioRef} loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
        <button onClick={toggleMusic} style={{ padding: '8px 16px' }}>
          {musicPlaying ? 'Pause Music' : 'Play Music'}
        </button>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Feel free to replace the audio URL with your preferred ambient track.</p>
      </div>
    </div>
  );
}
