import { useState, useEffect, useRef } from 'react';

function Pomodoro() {
  // TODO 1: Declara los estados timeLeft e isRunning
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutos en segundos
  const [isRunning, setIsRunning] = useState(false);

  // TODO 2: Declara intervalRef con useRef
  const intervalRef = useRef(null);

  // TODO 3: Implementa el useEffect para el timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsRunning(false);
    }

    // Función de limpieza: elimina el intervalo cuando el efecto se desmonta o se re-ejecuta
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  // TODO 4: Funcion formatTime(seconds) => "MM:SS"
  const formatTime = (seconds) => {
    const minutos = Math.floor(seconds / 60);
    const segundos = seconds % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  // TODO 5: Funciones toggleTimer y resetTimer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(1500);
  };

  // TODO 6: Renderiza el tiempo y los botones
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Temporizador Pomodoro</h1>
      <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '2rem 0' }}>
        {formatTime(timeLeft)}
      </div>
      <div>
        <button 
          onClick={toggleTimer} 
          style={{ 
            fontSize: '1.2rem', 
            padding: '0.5rem 1rem', 
            margin: '0 0.5rem',
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
            fontSize: '1.2rem', 
            padding: '0.5rem 1rem', 
            margin: '0 0.5rem',
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
    </div>
  );
}

export default Pomodoro;