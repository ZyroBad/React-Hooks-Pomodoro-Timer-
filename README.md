Nombre: David Sebastián Lemus Nitsch
Carnet: 241155

# Pomodoro Timer - React Hooks

Proyecto de aprendizaje para practicar `useState`, `useEffect`, `useRef` y manejo de estado en React.  
Tres niveles de dificultad progresiva, cada uno en una rama separada de GitHub y con su video demostrativo.

---

## Ramas del proyecto

| Rama | Descripción | Video | Enlace GitHub |
|------|-------------|-------|---------------|
| `nivel-1` | Timer básico (25 min, inicio/pausa/reinicio) | [Ver video](https://youtube.com/shorts/tPlzYubTcNE) | [Ver rama](https://github.com/ZyroBad/React-Hooks-Pomodoro-Timer-/tree/nivel-1) |
| `nivel-2` | Work/Break + historial de sesiones | [Ver video](https://youtu.be/fkVBdSifEsY) | [Ver rama](https://github.com/ZyroBad/React-Hooks-Pomodoro-Timer-/tree/nivel-2) |
| `nivel-3` | Timer completo con configuración, estadísticas, sonido y barra de progreso | [Ver video](https://youtu.be/qrEhTq9-ZMQ) | [Ver rama](https://github.com/ZyroBad/React-Hooks-Pomodoro-Timer-/tree/nivel-3) |

---

## Nivel 1 - Timer Básico

- Timer de 25 minutos
- Botones: Iniciar, Pausar, Reiniciar
- Formato MM:SS

[Ver video demostración](https://youtube.com/shorts/tPlzYubTcNE)

---

## Nivel 2 - Work/Break + Historial

- Modos: Trabajo (25 min) y Descanso (5 min)
- Cambio automático entre modos al llegar a 0
- Historial de sesiones completadas
- Muestra número de sesión, duración y hora

[Ver video demostración](https://youtu.be/fkVBdSifEsY)

---

## Nivel 3 - Timer Completo

- Configuración personalizada (minutos de trabajo y descanso)
- Inputs numéricos (rango 1-60)
- Barra de progreso visual
- Alerta sonora al completar sesión
- Estadísticas: total de sesiones y tiempo acumulado
- Botón "Guardar sesión" (sesión parcial)
- Diseño mejorado con badges y colores

[ Ver video demostración](https://youtu.be/qrEhTq9-ZMQ)

---

## Cómo ejecutar el proyecto

```bash
# Clonar el repositorio
git clone https://github.com/ZyroBad/React-Hooks-Pomodoro-Timer-.git

# Entrar a la carpeta
cd React-Hooks-Pomodoro-Timer-

# Cambiar a la rama deseada (ej: nivel-3)
git checkout nivel-3

# Instalar dependencias
npm install

# Ejecutar el proyecto
npm run dev

-- Tecnologías utilizadas
React 19

Vite

JavaScript ES2022+

HTML5 / CSS3

