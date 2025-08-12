import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  // Tasks state
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Audio ref
  const audioRef = useRef(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  // Add task
  const handleAdd = () => {
    if (task.trim() === '') return;
    setTodos([...todos, { id: Date.now(), text: task, completed: false }]);
    setTask('');
  };

  // Toggle complete
  const handleToggle = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Delete task
  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Start editing a task
  const handleStartEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  // Save edited task
  const handleSaveEdit = (id) => {
    if (editText.trim() === '') return;
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editText } : todo
    ));
    setEditId(null);
    setEditText('');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  // Timer effect
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

  // Timer control handlers
  const startTimer = () => {
    if (timeLeft > 0) setTimerRunning(true);
  };
  const pauseTimer = () => setTimerRunning(false);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerMinutes * 60);
  };

  // Music play/pause
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setMusicPlaying(!musicPlaying);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h2>Enhanced To-Do List with Timer & Music</h2>

      {/* To-Do Input */}
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

      {/* Task List */}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
              style={{ marginRight: 10 }}
            />

            {editId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  style={{ flexGrow: 1, padding: 6 }}
                />
                <button onClick={() => handleSaveEdit(todo.id)} style={{ marginLeft: 8 }}>Save</button>
                <button onClick={handleCancelEdit} style={{ marginLeft: 4 }}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  onDoubleClick={() => handleStartEdit(todo.id, todo.text)}
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
                  onClick={() => handleDelete(todo.id)}
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

      {/* Timer Section */}
      <div style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 20 }}>
        <h3>Timer</h3>
        <div>
          <label>
            <input
              type="radio"
              name="timer"
              checked={timerMinutes === 15}
              onChange={() => setTimerMinutes(15)}
            /> 15 min
          </label>
          {' '}
          <label>
            <input
              type="radio"
              name="timer"
              checked={timerMinutes === 30}
              onChange={() => setTimerMinutes(30)}
            /> 30 min
          </label>
          {' '}
          <label>
            <input
              type="radio"
              name="timer"
              checked={timerMinutes === 50}
              onChange={() => setTimerMinutes(50)}
            /> 50 min
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

      {/* Ambient Music Section */}
      <div style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 20 }}>
        <h3>Light Ambient Music</h3>
        <audio
          ref={audioRef}
          loop
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        />
        <button onClick={toggleMusic} style={{ padding: '8px 16px' }}>
          {musicPlaying ? 'Pause Music' : 'Play Music'}
        </button>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Feel free to replace the audio URL with your preferred ambient track.</p>
      </div>
    </div>
  );
}
