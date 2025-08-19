import React, { useState, useEffect } from 'react';
import axios from 'axios';
// ADDED: Import the YouTube component for the music player
import YouTube from 'react-youtube';

const API_BASE_URL = 'https://react-todolist-7cwa.onrender.com/api';

// --- NEW Music Player Component ---
// I've placed the MusicPlayer code here for simplicity.
const MusicPlayer = () => {
  // The ID of the YouTube playlist you want to play
  const playlistId = 'PL4fGSI1pDJn6j_g_2tQo1_V9orUu_i_p_';

  // Options for the YouTube player
  const opts = {
    height: '390',
    width: '100%', // Make it responsive
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0, // 0 = no autoplay, 1 = autoplay
      listType: 'playlist',
      list: playlistId,
    },
  };

  const onReady = (event) => {
    console.log('YouTube player is ready.');
  };

  return (
    <div style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 20 }}>
      <h3>Ambient Music Playlist 🎵</h3>
      <YouTube
        opts={opts}
        onReady={onReady}
        style={{ maxWidth: '640px', margin: '0 auto' }}
      />
    </div>
  );
};


export default function App() {
  // --- States ---
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [stats, setStats] = useState({});

  // REMOVED: audioRef and musicPlaying states are no longer needed.

  // --- Helper Functions ---
  const getTodayKey = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
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
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // --- To-Do Handlers ---
  const handleAdd = async () => {
    if (task.trim() === '') return;
    try {
      const response = await axios.post(`${API_BASE_URL}/todos`, { text: task });
      setTodos([response.data, ...todos]);
      setTask('');
      fetchStats();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`);
      setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
      if (response.data.completed) {
        fetchStats();
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleStartEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };
  const handleSaveEdit = (id) => {
    // For simplicity, this remains a local-only update for now.
    setTodos(todos.map(todo => (todo._id === id ? { ...todo, text: editText } : todo)));
    setEditId(null);
    setEditText('');
  };
  const handleCancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  // --- Timer Logic ---
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
    const intervalId = setInterval(() => setTimeLeft(prevTime => prevTime - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft, timerRunning]);

  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerMinutes * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // REMOVED: toggleMusic function is no longer needed.

  // --- Sub-Components for UI ---
  const ProductivityDashboard = () => {
    // This component's logic remains the same
    const today = getTodayKey();
    const todayStats = stats[today] || { created: 0, completed: 0 };
    const productivityScore = todayStats.created > 0 ? Math.round((todayStats.completed / todayStats.created) * 100) : 0;
    const pastDays = Object.keys(stats).filter(date => date !== today).sort((a, b) => new Date(b) - new Date(a));
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
              {pastDays.map(date => (
                <li key={date} style={{ background: '#f9f9f9', padding: '10px', borderRadius: 5, marginBottom: 8 }}>
                  <strong>{new Date(date).toDateString()}:</strong> Created {stats[date].created}, Completed {stats[date].completed}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h2>Enhanced To-Do List with Timer & Music</h2>
      {/* To-Do Input */}
      <div>
        <input type="text" placeholder="Enter a task" value={task} onChange={e => setTask(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }} style={{ width: '70%', padding: 8, marginRight: 8 }} />
        <button onClick={handleAdd} style={{ padding: '8px 12px' }}>Add</button>
      </div>

      {/* Task List */}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
        {todos.map(todo => (
          <li key={todo._id} style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" checked={todo.completed} onChange={() => handleToggle(todo._id)} style={{ marginRight: 10 }} />
            {editId === todo._id ? (
              <>
                <input type="text" value={editText} onChange={e => setEditText(e.target.value)} style={{ flexGrow: 1, padding: 6 }} />
                <button onClick={() => handleSaveEdit(todo._id)} style={{ marginLeft: 8 }}>Save</button>
                <button onClick={handleCancelEdit} style={{ marginLeft: 4 }}>Cancel</button>
              </>
            ) : (
              <>
                <span onDoubleClick={() => handleStartEdit(todo._id, todo.text)} style={{ flexGrow: 1, textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }} title="Double-click to edit">{todo.text}</span>
                <button onClick={() => handleDelete(todo._id)} style={{ marginLeft: 10, backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <ProductivityDashboard />

      {/* Timer Section */}
      <div style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 20 }}>
        <h3>Timer ⏱️</h3>
        <div>
          <label><input type="radio" name="timer" checked={timerMinutes === 15} onChange={() => setTimerMinutes(15)} /> 15 min</label>{' '}
          <label><input type="radio" name="timer" checked={timerMinutes === 30} onChange={() => setTimerMinutes(30)} /> 30 min</label>{' '}
          <label><input type="radio" name="timer" checked={timerMinutes === 50} onChange={() => setTimerMinutes(50)} /> 50 min</label>
        </div>
        <div style={{ fontSize: '2rem', marginTop: 10 }}>{formatTime(timeLeft)}</div>
        <div>
          {!timerRunning ? <button onClick={startTimer}>Start</button> : <button onClick={pauseTimer}>Pause</button>}
          <button onClick={resetTimer} style={{ marginLeft: 10 }}>Reset</button>
        </div>
      </div>

      {/* CHANGED: Replaced the old audio player with the new MusicPlayer component */}
      <MusicPlayer />

    </div>
  );
}
