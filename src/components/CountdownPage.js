import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

// You can find a sound file URL online or host your own.
const completionSound = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_276708c374.mp3');

const CountdownPage = () => {
  const [initialDuration, setInitialDuration] = useState(15 * 60); // Default to 15 minutes
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // This effect handles the countdown logic
  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      setIsFinished(true);
      completionSound.play(); // Play sound on completion
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, isRunning]);
  
  // Update timeLeft when the initial duration changes
  useEffect(() => {
    setTimeLeft(initialDuration);
  }, [initialDuration]);

  const setTimer = (minutes) => {
    setIsRunning(false);
    setIsFinished(false);
    setInitialDuration(minutes * 60);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(initialDuration);
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const timerOptions = [1, 2, 5, 15, 30];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
      textAlign: 'center'
    }}>
      {isFinished && <Confetti />}

      <div style={{ fontSize: 'clamp(4rem, 20vw, 10rem)', fontWeight: 'bold' }}>
        {formatTime(timeLeft)}
      </div>

      <div style={{ margin: '20px 0' }}>
        {timerOptions.map(min => (
          <button key={min} onClick={() => setTimer(min)} style={{ margin: '0 5px', padding: '10px 15px' }}>
            {min} min
          </button>
        ))}
      </div>

      <div>
        {!isRunning && timeLeft > 0 ? (
          <button onClick={() => setIsRunning(true)} style={{ padding: '15px 30px', fontSize: '1.5rem' }}>
            Start
          </button>
        ) : (
          <button onClick={() => setIsRunning(false)} style={{ padding: '15px 30px', fontSize: '1.5rem' }}>
            Pause
          </button>
        )}
         <button onClick={resetTimer} style={{ marginLeft: '10px', padding: '15px 30px', fontSize: '1.5rem' }}>
            Reset
          </button>
      </div>
    </div>
  );
};

export default CountdownPage;
