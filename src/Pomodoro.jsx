import { useState, useEffect, useRef } from 'react';

function Pomodoro() {
  const [mode, setMode] = useState('work');
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [workMins, setWorkMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workMins * 60);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Inicializar audio
  useEffect(() => {
    audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  }, []);

  // Un solo efecto para el intervalo
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  // Detectar cuando llega a cero y cambiar modo (esto corre fuera del efecto)
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      // Guardar sesion si era trabajo
      if (mode === 'work') {
        const newSession = {
          id: Date.now(),
          type: 'work',
          duration: workMins,
          completedAt: new Date().toLocaleTimeString()
        };
        setSessions(prev => [...prev, newSession]);
        audioRef.current.play().catch(e => console.log('Error:', e));
      }
      
      // Cambiar modo
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      
      // Resetear tiempo al nuevo modo
      const newTime = nextMode === 'work' ? workMins * 60 : breakMins * 60;
      setTimeLeft(newTime);
    }
  }, [timeLeft, isRunning, mode, workMins, breakMins]);

  // Funciones
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(workMins * 60);
    setSessions([]);
  };

  const savePartialSession = () => {
    if (mode === 'work' && isRunning) {
      const total = mode === 'work' ? workMins * 60 : breakMins * 60;
      const elapsed = total - timeLeft;
      if (elapsed > 0) {
        const partialSession = {
          id: Date.now(),
          type: 'work (parcial)',
          duration: Math.floor(elapsed / 60),
          completedAt: new Date().toLocaleTimeString()
        };
        setSessions(prev => [...prev, partialSession]);
      }
    }
  };

  const handleWorkChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isRunning && val >= 1 && val <= 60) {
      setWorkMins(val);
      if (mode === 'work') {
        setTimeLeft(val * 60);
      }
    }
  };

  const handleBreakChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isRunning && val >= 1 && val <= 60) {
      setBreakMins(val);
    }
  };

  const getTotalTime = () => {
    return mode === 'work' ? workMins * 60 : breakMins * 60;
  };

  const progressPercent = () => {
    const total = getTotalTime();
    return total > 0 ? ((total - timeLeft) / total) * 100 : 0;
  };

  const totalWorkSessions = sessions.filter(s => s.type === 'work').length;
  const totalWorkMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Pomodoro Timer - Nivel 3</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <label>Trabajo (min): </label>
          <input
            type="number"
            min="1"
            max="60"
            value={workMins}
            onChange={handleWorkChange}
            disabled={isRunning}
            style={{ padding: '0.5rem', width: '80px', marginLeft: '0.5rem', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'center' }}
          />
        </div>
        <div>
          <label>Descanso (min): </label>
          <input
            type="number"
            min="1"
            max="60"
            value={breakMins}
            onChange={handleBreakChange}
            disabled={isRunning}
            style={{ padding: '0.5rem', width: '80px', marginLeft: '0.5rem', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'center' }}
          />
        </div>
      </div>

      <div style={{ 
        fontSize: '1.8rem', 
        fontWeight: 'bold',
        marginTop: '1rem',
        marginBottom: '1rem',
        padding: '0.5rem 2rem',
        borderRadius: '10px',
        display: 'inline-block',
        backgroundColor: mode === 'work' ? '#e8f5e9' : '#e3f2fd',
        color: mode === 'work' ? '#2e7d32' : '#1565c0'
      }}>
        {mode === 'work' ? 'TRABAJO' : 'DESCANSO'}
      </div>

      <div style={{ 
        fontSize: '6rem', 
        fontWeight: 'bold', 
        marginTop: '3rem',
        marginBottom: '3rem',
        fontFamily: 'monospace',
        letterSpacing: '5px'
      }}>
        {`${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}
      </div>

      <div style={{ 
        width: '100%', 
        height: '12px', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '10px', 
        marginBottom: '3rem',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${progressPercent()}%`, 
          height: '100%', 
          backgroundColor: mode === 'work' ? '#4CAF50' : '#2196F3',
          transition: 'width 0.3s ease' 
        }} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={toggleTimer} 
          style={{ 
            fontSize: '1.2rem', 
            padding: '12px 28px', 
            margin: '0 10px',
            cursor: 'pointer',
            backgroundColor: isRunning ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}
        >
          {isRunning ? 'PAUSAR' : 'INICIAR'}
        </button>
        <button 
          onClick={resetTimer} 
          style={{ 
            fontSize: '1.2rem', 
            padding: '12px 28px', 
            margin: '0 10px',
            cursor: 'pointer',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}
        >
          REINICIAR
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={savePartialSession} 
          disabled={mode !== 'work' || !isRunning}
          style={{ 
            fontSize: '1rem', 
            padding: '8px 20px', 
            margin: '0 10px',
            cursor: mode === 'work' && isRunning ? 'pointer' : 'not-allowed',
            backgroundColor: mode === 'work' && isRunning ? '#9C27B0' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}
        >
          GUARDAR SESION PARCIAL
        </button>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '2rem', 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px'
      }}>
        <div><strong>Sesiones completadas:</strong> {totalWorkSessions}</div>
        <div><strong>Tiempo total:</strong> {totalWorkMinutes} min</div>
      </div>

      {sessions.length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
          <h3>Historial de sesiones</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {sessions.map((session, index) => (
              <li key={session.id} style={{ 
                padding: '8px', 
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>#{index + 1}</span>
                <span>{session.type}</span>
                <span>{session.duration} min</span>
                <span>{session.completedAt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Pomodoro;