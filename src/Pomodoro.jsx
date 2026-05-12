import { useState, useEffect, useRef } from 'react';

function Pomodoro() {
  // Estados principales
  const [mode, setMode] = useState('work');
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [workMins, setWorkMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  
  // Tiempo actual en segundos
  const totalTime = mode === 'work' ? workMins * 60 : breakMins * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const justCompletedRef = useRef(false);

  // Inicializar audio
  useEffect(() => {
    audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  }, []);

  // Efecto 1: Intervalo del timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  // Efecto 2: Sincronizar timeLeft cuando cambia la configuracion
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(totalTime);
    }
  }, [workMins, breakMins, mode, isRunning, totalTime]);

  // Efecto 3: Detectar cuando llega a cero y cambiar de modo automaticamente
  useEffect(() => {
    if (timeLeft === 0 && isRunning && !justCompletedRef.current) {
      justCompletedRef.current = true;
      
      // Reproducir sonido
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Error al reproducir sonido:', e));
      }

      // Guardar sesion de trabajo completada
      if (mode === 'work') {
        const newSession = {
          id: Date.now(),
          type: 'work',
          duration: workMins,
          completedAt: new Date().toLocaleTimeString()
        };
        setSessions(prev => [...prev, newSession]);
      }
      
      // Cambiar de modo automaticamente
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      
      // El timer sigue corriendo automaticamente con el nuevo tiempo
      // El timeLeft se sincroniza via useEffect 2
      
      setTimeout(() => {
        justCompletedRef.current = false;
      }, 100);
    } else if (timeLeft !== 0) {
      justCompletedRef.current = false;
    }
  }, [timeLeft, isRunning, mode, workMins, breakMins]);

  // Calcular porcentaje para la barra de progreso
  const progressPercent = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  // Calcular estadisticas
  const totalWorkSessions = sessions.filter(s => s.type === 'work').length;
  const totalWorkMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);

  // Guardar sesion parcial
  const savePartialSession = () => {
    const elapsed = totalTime - timeLeft;
    if (elapsed > 0 && mode === 'work') {
      const partialSession = {
        id: Date.now(),
        type: 'work (parcial)',
        duration: Math.floor(elapsed / 60),
        completedAt: new Date().toLocaleTimeString()
      };
      setSessions(prev => [...prev, partialSession]);
    }
  };

  // Funciones de control
  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(workMins * 60);
    setSessions([]);
    justCompletedRef.current = false;
  };

  // Validacion de inputs
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

  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Pomodoro Timer - Nivel 3</h1>
      
      {/* Configuracion de tiempos */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>Trabajo (min): </label>
          <input
            type="number"
            min="1"
            max="60"
            value={workMins}
            onChange={handleWorkChange}
            disabled={isRunning}
            style={{ 
              padding: '0.5rem', 
              width: '80px', 
              marginLeft: '0.5rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              textAlign: 'center',
              fontSize: '1rem'
            }}
          />
        </div>
        <div>
          <label style={{ fontWeight: 'bold' }}>Descanso (min): </label>
          <input
            type="number"
            min="1"
            max="60"
            value={breakMins}
            onChange={handleBreakChange}
            disabled={isRunning}
            style={{ 
              padding: '0.5rem', 
              width: '80px', 
              marginLeft: '0.5rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              textAlign: 'center',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      {/* Modo actual */}
      <div style={{ 
        fontSize: '1.8rem', 
        fontWeight: 'bold',
        marginBottom: '1rem',
        padding: '0.5rem',
        borderRadius: '10px',
        display: 'inline-block',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        backgroundColor: mode === 'work' ? '#e8f5e9' : '#e3f2fd',
        color: mode === 'work' ? '#2e7d32' : '#1565c0'
      }}>
        {mode === 'work' ? 'TRABAJO' : 'DESCANSO'}
      </div>

      {/* Display del tiempo */}
      <div style={{ 
        fontSize: '6rem', 
        fontWeight: 'bold', 
        margin: '2rem 0',
        fontFamily: 'monospace',
        letterSpacing: '5px'
      }}>
        {`${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}
      </div>

      {/* Barra de progreso */}
      <div style={{ 
        width: '100%', 
        height: '12px', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '10px',
        marginBottom: '2.5rem',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${progressPercent}%`, 
          height: '100%', 
          backgroundColor: mode === 'work' ? '#4CAF50' : '#2196F3',
          transition: 'width 0.3s ease',
          borderRadius: '10px'
        }} />
      </div>

      {/* Botones de control */}
      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
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
            transition: 'all 0.3s',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
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
            transition: 'all 0.3s',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          REINICIAR
        </button>
      </div>

      {/* Boton Guardar Sesion */}
      <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
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
            transition: 'all 0.3s',
            fontWeight: 'bold'
          }}
        >
         GUARDAR SESION PARCIAL
        </button>
      </div>

      {/* Estadisticas */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '2rem', 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px',
        border: '1px solid #e0e0e0'
      }}>
        <div>
          <strong>Sesiones completadas:</strong> {totalWorkSessions}
        </div>
        <div>
          <strong> Tiempo total:</strong> {totalWorkMinutes} min
        </div>
      </div>

      {/* Historial de sesiones */}
      {sessions.length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '100%' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #ddd', paddingBottom: '0.5rem' }}>
            Historial de sesiones
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {sessions.map((session, index) => (
              <li key={session.id} style={{ 
                padding: '10px', 
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                borderRadius: '5px'
              }}>
                <span style={{ fontWeight: 'bold' }}>#{index + 1}</span>
                <span style={{ 
                  padding: '3px 10px', 
                  borderRadius: '15px',
                  backgroundColor: session.type === 'work' ? '#4CAF50' : '#FF9800',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {session.type}
                </span>
                <span>{session.duration} minutos</span>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>{session.completedAt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Pomodoro;