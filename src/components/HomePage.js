import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import YouTube from "react-youtube";
import { checkAdmin } from "../utils/checkAdmin";

const API_BASE_URL = "https://react-todolist-7cwa.onrender.com/api";

// --- Music Player Component ---
const MusicPlayer = () => {
  const playlistId = "PL7v1FHGMOadDghZ1m-jEIUnVUsGMT9jbH";
  const opts = {
    height: "390",
    width: "100%",
    playerVars: { autoplay: 0, listType: "playlist", list: playlistId },
  };
  return (
    <div style={{ marginTop: 40, borderTop: "1px solid #ccc", paddingTop: 20 }}>
      <h3>Ambient Music Playlist 🎵</h3>
      <YouTube opts={opts} style={{ maxWidth: "640px", margin: "0 auto" }} />
    </div>
  );
};

// --- Main HomePage Component ---
const HomePage = ({ user }) => {
  // ✅ Admin State
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function verify() {
      const result = await checkAdmin();
      setIsAdmin(result);
    }
    verify();
  }, []);

  // ✅ Todo States
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // ✅ Timer States
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // ✅ Stats
  const [stats, setStats] = useState({});
  const getTodayKey = () => new Date().toISOString().split("T")[0];

  // --- Data fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [todosResponse, statsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/todos`),
          axios.get(`${API_BASE_URL}/stats`),
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

  // --- CRUD Handlers ---
  const handleAdd = async () => {
    if (task.trim() === "") return;
    const response = await axios.post(`${API_BASE_URL}/todos`, { text: task });
    setTodos([response.data, ...todos]);
    setTask("");
    fetchStats();
  };

  const handleToggle = async (id) => {
    const response = await axios.put(`${API_BASE_URL}/todos/${id}`);
    setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    if (response.data.completed) fetchStats();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE_URL}/todos/${id}`);
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const handleStartEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };
  const handleSaveEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditId(null);
    setEditText("");
  };
  const handleCancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  // --- Timer ---
  useEffect(() => {
    setTimeLeft(timerMinutes * 60);
  }, [timerMinutes]);

  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) {
      if (timeLeft <= 0) {
        setTimerRunning(false);
        alert("Timer Finished!");
      }
      return;
    }
    const intervalId = setInterval(
      () => setTimeLeft((prev) => prev - 1),
      1000
    );
    return () => clearInterval(intervalId);
  }, [timeLeft, timerRunning]);

  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerMinutes * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // --- Productivity Dashboard ---
  const ProductivityDashboard = () => {
    const today = getTodayKey();
    const todayStats = stats[today] || { created: 0, completed: 0 };
    const score =
      todayStats.created > 0
        ? Math.round((todayStats.completed / todayStats.created) * 100)
        : 0;
    return (
      <div
        style={{ marginTop: 40, borderTop: "1px solid #ccc", paddingTop: 20 }}
      >
        <h3>Productivity Dashboard 📊</h3>
        <div style={{ background: "#f0f8ff", padding: 15, borderRadius: 8 }}>
          <h4>Today's Summary</h4>
          <p>
            <strong>Tasks Created:</strong> {todayStats.created}
          </p>
          <p>
            <strong>Tasks Completed:</strong> {todayStats.completed}
          </p>
          <p>
            <strong>Productivity Score:</strong> {score}%
          </p>
        </div>
      </div>
    );
  };

  // --- Final JSX ---
  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, fontFamily: "Arial" }}>
      <h1>Dashboard</h1>
      {isAdmin ? <p>Welcome, Admin!</p> : <p>You are a normal user.</p>}

      {user ? (
        <h2>Welcome back, {user.displayName}!</h2>
      ) : (
        <h2>Welcome to your Productivity Hub!</h2>
      )}

      {/* Todo Input */}
      <div>
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          style={{ width: "70%", padding: 8, marginRight: 8 }}
        />
        <button onClick={handleAdd} style={{ padding: "8px 12px" }}>
          Add
        </button>
      </div>

      {/* Todo List */}
      <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
        {todos.map((todo) => (
          <li
            key={todo._id}
            style={{ marginBottom: 10, display: "flex", alignItems: "center" }}
          >
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
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ flexGrow: 1, padding: 6 }}
                />
                <button
                  onClick={() => handleSaveEdit(todo._id)}
                  style={{ marginLeft: 8 }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{ marginLeft: 4 }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  onDoubleClick={() => handleStartEdit(todo._id, todo.text)}
                  style={{
                    flexGrow: 1,
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                  title="Double-click to edit"
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => handleDelete(todo._id)}
                  style={{
                    marginLeft: 10,
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Focus Session */}
      <div style={{ margin: "2rem 0", textAlign: "center" }}>
        <Link to="/timer">
          <button
            style={{
              padding: "10px 20px",
              fontSize: "1.1rem",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Start a Focus Session
          </button>
        </Link>
      </div>

      <ProductivityDashboard />

      {/* Mini Timer */}
      <div
        style={{
          marginTop: "40px",
          border: "1px solid #eee",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>Mini Timer ⏱️</h3>
        <div style={{ margin: "15px 0" }}>
          <label>
            <input
              type="radio"
              name="timer"
              checked={timerMinutes === 15}
              onChange={() => setTimerMinutes(15)}
            />{" "}
            15 min
          </label>{" "}
          <label>
            <input
              type="radio"
              name="timer"
              checked={timerMinutes === 30}
              onChange={() => setTimerMinutes(30)}
            />{" "}
            30 min
          </label>{" "}
          <label>
            <input
              type="radio"
              name="timer"
              checked={timerMinutes === 50}
              onChange={() => setTimerMinutes(50)}
            />{" "}
            50 min
          </label>
        </div>

        <div
          style={{
            fontSize: "5rem",
            fontWeight: "bold",
            margin: "10px 0 20px 0",
          }}
        >
          {formatTime(timeLeft)}
        </div>

        <div>
          {!timerRunning ? (
            <button
              onClick={startTimer}
              style={{ padding: "10px 20px", fontSize: "1.1rem" }}
            >
              Start
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              style={{ padding: "10px 20px", fontSize: "1.1rem" }}
            >
              Pause
            </button>
          )}
          <button
            onClick={resetTimer}
            style={{ marginLeft: 10, padding: "10px 20px", fontSize: "1.1rem" }}
          >
            Reset
          </button>
        </div>
      </div>

      <MusicPlayer />
    </div>
  );
};

export default HomePage;
