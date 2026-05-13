import { useState, useEffect, useRef } from 'react';

const WORK_TIME = 1500;  // 25 minutos
const BREAK_TIME = 300;   // 5 minutos

//Prueba modo break
//const WORK_TIME = 5;    // 5 segundos para probar
//const BREAK_TIME = 3;   // 3 segundos para probar

function Pomodoro() {
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const intervalRef = useRef(null);

  // Efecto para el intervalo del timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  // Efecto para cambiar de modo cuando llega a cero
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      // Guardar sesion de trabajo completada
      if (mode === 'work') {
        setSessions(prev => [...prev, {
          id: Date.now(),
          type: 'work',
          duration: WORK_TIME / 60,
          completedAt: new Date().toLocaleTimeString()
        }]);
      }
      // Cambiar al modo opuesto
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      setTimeLeft(nextMode === 'work' ? WORK_TIME : BREAK_TIME);
    }
  }, [timeLeft, isRunning, mode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(WORK_TIME);
    setSessions([]);
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Pomodoro Timer - Nivel 2</h1>
      
      <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: mode === 'work' ? '#4CAF50' : '#2196F3' }}>
        {mode === 'work' ? 'Trabajo' : 'Descanso'}
      </div>

      <div style={{ fontSize: '5rem', fontWeight: 'bold', margin: '2rem 0' }}>
        {formatTime(timeLeft)}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button 
          onClick={toggleTimer} 
          style={{ 
            margin: '0 10px', 
            padding: '12px 24px', 
            fontSize: '1.1rem',
            cursor: 'pointer',
            backgroundColor: isRunning ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button 
          onClick={resetTimer} 
          style={{ 
            margin: '0 10px', 
            padding: '12px 24px', 
            fontSize: '1.1rem',
            cursor: 'pointer',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Reiniciar
        </button>
      </div>

      {sessions.length > 0 && (
        <div style={{ marginTop: '3rem', textAlign: 'left', maxWidth: '400px', margin: '3rem auto 0' }}>
          <h3>Sesiones completadas</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {sessions.map((session, index) => (
              <li key={session.id} style={{ 
                padding: '8px', 
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Sesión #{index + 1}</span>
                <span>{session.duration} min</span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>{session.completedAt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Pomodoro;
