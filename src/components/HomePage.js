import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';

const API_BASE_URL = 'https://react-todolist-7cwa.onrender.com/api';

// --- Music Player Component ---
const MusicPlayer = () => {
  const playlistId = 'PL7v1FHGMOadDghZ1m-jEIUnVUsGMT9jbH';
  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 0,
      listType: 'playlist',
      list: playlistId,
    },
  };
  return (
    <div style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 20 }}>
      <h3>Ambient Music Playlist 🎵</h3>
      <YouTube opts={opts} style={{ maxWidth: '640px', margin: '0 auto' }} />
    </div>
  );
};

// --- Main HomePage Component ---
const HomePage = ({ user }) => {
  // State for this page's features
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [stats, setStats] =useState({});

  const getTodayKey = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Fetch data specific to this page
    const fetchData = async () => {
      try {
        const [todosResponse, statsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/todos`),
          axios.get(`${API_BASE_URL}/stats`)
        ]);
        setTodos(todosResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchStats = async () => {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    setStats(response.data);
  };

  // --- To-Do Handlers ---
  const handleAdd = async () => {
    if (task.trim() === '') return;
    const response = await axios.post(`${API_BASE_URL}/todos`, { text: task });
    setTodos([response.data, ...todos]);
    setTask('');
    fetchStats();
  };
  
  const handleToggle = async (id) => {
    const response = await axios.put(`${API_BASE_URL}/todos/${id}`);
    setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
    if (response.data.completed) fetchStats();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE_URL}/todos/${id}`);
    setTodos(todos.filter(todo => todo._id !== id));
  };
  
  // Edit handlers remain local for now
  const handleStartEdit = (id, text) => { setEditId(id); setEditText(text); };
  const handleSaveEdit = (id) => { setTodos(todos.map(todo => (todo._id === id ? { ...todo, text: editText } : todo))); setEditId(null); setEditText(''); };
  const handleCancelEdit = () => { setEditId(null); setEditText(''); };


  // --- Timer Logic ---
  useEffect(() => { setTimeLeft(timerMinutes * 60); }, [timerMinutes]);
  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) {
      if (timeLeft <= 0) setTimerRunning(false);
      return;
    }
    const intervalId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft, timerRunning]);

  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const resetTimer = () => { setTimerRunning(false); setTimeLeft(timerMinutes * 60); };
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- Productivity Dashboard Sub-Component ---
  const ProductivityDashboard = () => (
    <div style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 20 }}>
      <h3>Productivity Dashboard 📊</h3>
      {/* ... Dashboard JSX ... */}
    </div>
  );


  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      {user ? <h2>Welcome back, {user.displayName}!</h2> : <h2>Welcome to your Productivity Hub!</h2>}
      
      {/* To-Do Input */}
      <div>
        <input type="text" placeholder="Enter a task" value={task} onChange={e => setTask(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }} style={{ width: '70%', padding: 8, marginRight: 8 }} />
        <button onClick={handleAdd} style={{ padding: '8px 12px' }}>Add</button>
      </div>

      {/* Task List */}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
        {todos.map(todo => (
          <li key={todo._id} style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
            {/* ... Task item JSX ... */}
          </li>
        ))}
      </ul>
      
      {/* Link to the new Countdown Timer page */}
      <div style={{ margin: '2rem 0', textAlign: 'center' }}>
        <Link to="/timer">
          <button style={{ padding: '10px 20px', fontSize: '1.1rem' }}>
            Start a Focus Session
          </button>
        </Link>
      </div>

      <ProductivityDashboard />

      {/* Mini Timer Section */}
      <div style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 20 }}>
        <h3>Mini Timer ⏱️</h3>
        {/* ... Mini timer JSX ... */}
      </div>

      <MusicPlayer />
    </div>
  );
};

export default HomePage;
