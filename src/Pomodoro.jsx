import { useState, useEffect, useRef } from 'react';

function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(1500);
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Pomodoro Timer - Nivel 1</h1>
      <div style={{ fontSize: '4rem', margin: '2rem 0' }}>
        {formatTime(timeLeft)}
      </div>
      <div>
        <button onClick={toggleTimer} style={{ margin: '0 5px', padding: '10px 20px' }}>
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button onClick={resetTimer} style={{ margin: '0 5px', padding: '10px 20px' }}>
          Reiniciar
        </button>
      </div>
    </div>
  );
}

export default Pomodoro;