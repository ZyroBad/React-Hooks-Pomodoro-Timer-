import { useState, useEffect, useRef } from 'react';

// Constantes fuera del componente
//const WORK_TIME = 1500;  // 25 minutos en segundos
//const BREAK_TIME = 300;   // 5 minutos en segundos

//Modo descanso
const WORK_TIME = 5;    // 5 segundos para probar
const BREAK_TIME = 3;   // 3 segundos para probar

function Pomodoro() {
  // Estados principales
  const [mode, setMode] = useState('work'); // 'work' o 'break'
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const intervalRef = useRef(null);
  

  // Efecto 1: Manejar el intervalo del timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  // Efecto 2: Detectar cuando el tiempo llega a cero y cambiar de modo
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      // Si terminó una sesión de trabajo, guardarla en el historial
      if (mode === 'work') {
        const newSession = {
          id: Date.now(),
          type: 'work',
          duration: WORK_TIME,
          completedAt: new Date().toLocaleTimeString()
        };
        setSessions(prev => [...prev, newSession]);
      }
      
      // Cambiar al modo opuesto
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      
      // Resetear el tiempo según el nuevo modo
      const newTime = nextMode === 'work' ? WORK_TIME : BREAK_TIME;
      setTimeLeft(newTime);
      
      // El timer sigue corriendo automáticamente
    }
  }, [timeLeft, isRunning, mode]);

  // Formatear tiempo MM:SS
  const formatTime = (seconds) => {
    const minutos = Math.floor(seconds / 60);
    const segundos = seconds % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  // Funciones de control
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(WORK_TIME);
    setSessions([]);
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Pomodoro Timer</h1>
      
      {/* Modo actual */}
      <div style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: mode === 'work' ? '#4CAF50' : '#2196F3'
      }}>
        {mode === 'work' ? 'Trabajo' : 'Descanso'}
      </div>

      {/* Display del tiempo */}
      <div style={{ 
        fontSize: '5rem', 
        fontWeight: 'bold', 
        margin: '2rem 0',
        fontFamily: 'monospace'
      }}>
        {formatTime(timeLeft)}
      </div>

      {/* Botones de control */}
      <div>
        <button 
          onClick={toggleTimer} 
          style={{ 
            fontSize: '1.2rem', 
            padding: '0.75rem 1.5rem', 
            margin: '0 0.5rem',
            cursor: 'pointer',
            backgroundColor: isRunning ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            transition: 'all 0.3s'
          }}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button 
          onClick={resetTimer} 
          style={{ 
            fontSize: '1.2rem', 
            padding: '0.75rem 1.5rem', 
            margin: '0 0.5rem',
            cursor: 'pointer',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            transition: 'all 0.3s'
          }}
        >
          Reiniciar
        </button>
      </div>

      {/* Historial de sesiones completadas */}
      {sessions.length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '400px', margin: '2rem auto 0' }}>
          <h3>Sesiones completadas</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {sessions.map((session, index) => (
              <li key={session.id} style={{ 
                padding: '0.5rem', 
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Sesión #{index + 1}</span>
                <span>{Math.floor(session.duration / 60)} minutos</span>
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