import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // Estado para contar puntos (mantenido del ejemplo original)
  const [contador, setContador] = useState(0)

  // Estados principales del juego del ahorcado
  const [palabra, setPalabra] = useState('') // Palabra actual que el jugador debe adivinar
  const [letrasAdivinadas, setLetrasAdivinadas] = useState([]) // Letras correctas que el jugador ha adivinado
  const [letrasIncorrectas, setLetrasIncorrectas] = useState([]) // Letras incorrectas que el jugador ha intentado
  const [estadoJuego, setEstadoJuego] = useState('jugando') // Estado actual: 'jugando', 'ganado', 'perdido'
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false) // Controla si mostrar notificación de letra repetida

  // Lista de palabras relacionadas con desarrollo de software e IA
  const palabras = [
  // --- Lenguajes y Fundamentos ---
  "JAVASCRIPT", "PYTHON", "ALGORITMO", "COMPILADOR", "VARIABLE", 
  "FUNCION", "SINTAXIS", "DEPURACION", "CODIGO", "LIBRERIA", 
  "BINARIO", "RECURSIVIDAD", "ASINCRONO", "HERENCIA",

  // --- Desarrollo Web (Frontend y Backend) ---
  "REACT", "FRAMEWORK", "BACKEND", "FRONTEND", "RESPONSIVE", 
  "API", "WEBSOCKET", "JSON", "DOM", "HTTP", "ESTADO", 
  "COMPONENTE", "SERVIDOR", "ENRUTADOR", "DESPLIEGUE",

  // --- Bases de Datos ---
  "DATABASE", "CONSULTA", "INDICE", "MODELADO", "NORMALIZACION", 
  "TRANSACCION", "ESCALABILIDAD", "SQL", "NOSQL",

  // --- Arquitectura y DevOps ---
  "MICROSERVICIOS", "DEVOPS", "CONTENEDOR", "DOCKER", "KUBERNETES", 
  "INTEGRACION", "MONOLITO", "SERVERLESS", "VIRTUALIZACION",

  // --- Inteligencia Artificial y Ciencia de Datos ---
  "MACHINELEARNING", "NEURALNETWORK", "DEEPLEARNING", "BIGDATA", 
  "INTELIGENCIAARTIFICIAL", "TENSORFLOW", "PYTORCH", "MODELO", 
  "ENTRENAMIENTO", "PREDICCION", "CLASIFICACION", "REGRESION",

  // --- Conceptos y Metodologías ---
  "CLOUDCOMPUTING", "BLOCKCHAIN", "CIBERSEGURIDAD", "OPTIMIZACION", 
  "AUTOMATIZACION", "AGILE", "SCRUM", "REFACTORIZAR", "ENCRIPTACION", 
  "AUTENTICACION", "GIT", "VERSIONADO", "USABILIDAD"
];

  // Efecto para seleccionar una palabra aleatoria cuando el juego comienza o se reinicia
  useEffect(() => {
    // Solo seleccionar una nueva palabra si el juego está en estado 'jugando'
    if (estadoJuego === 'jugando') {
      // Seleccionar una palabra aleatoria del array
      const palabraAleatoria = palabras[Math.floor(Math.random() * palabras.length)]
      setPalabra(palabraAleatoria) // Establecer la palabra actual
      setLetrasAdivinadas([]) // Reiniciar letras adivinadas
      setLetrasIncorrectas([]) // Reiniciar letras incorrectas
    }
  }, [estadoJuego]) // Este efecto se ejecuta cuando estadoJuego cambia

  // Efecto para manejar eventos de teclado
  useEffect(() => {
    // Función que se ejecuta cuando se presiona una tecla
    const manejarTeclaPresionada = (evento) => {
      const { key, keyCode } = evento
      
      // Si el juego no está activo o la tecla no es una letra, no hacer nada
      if (estadoJuego !== 'jugando' || keyCode < 65 || keyCode > 90) return
      
      const letra = key.toUpperCase() // Convertir a mayúscula
      
      // Si la letra ya fue intentada, mostrar notificación
      if (letrasAdivinadas.includes(letra) || letrasIncorrectas.includes(letra)) {
        mostrarNotificacionTemporal()
        return
      }

      // Si la letra está en la palabra, agregarla a letrasAdivinadas
      if (palabra.includes(letra)) {
        setLetrasAdivinadas(prev => [...prev, letra])
      } else {
        // Si no está, agregarla a letrasIncorrectas
        setLetrasIncorrectas(prev => [...prev, letra])
      }
    }

    // Agregar el event listener al presionar teclas
    window.addEventListener('keydown', manejarTeclaPresionada)
    
    // Limpiar el event listener cuando el componente se desmonte
    return () => window.removeEventListener('keydown', manejarTeclaPresionada)
  }, [palabra, letrasAdivinadas, letrasIncorrectas, estadoJuego])

  // Efecto para verificar el estado del juego (ganar o perder)
  useEffect(() => {
    if (!palabra) return // Si no hay palabra, no hacer nada
    
    // Obtener letras únicas de la palabra
    const letrasUnicas = [...new Set(palabra.split(''))]
    
    // Verificar si todas las letras fueron adivinadas (victoria)
    if (letrasUnicas.every(letra => letrasAdivinadas.includes(letra))) {
      setEstadoJuego('ganado')
    } 
    // Verificar si se alcanzó el máximo de errores (derrota)
    else if (letrasIncorrectas.length >= 6) {
      setEstadoJuego('perdido')
    }
  }, [letrasAdivinadas, letrasIncorrectas, palabra])

  // Función para mostrar una notificación temporal
  const mostrarNotificacionTemporal = () => {
    setMostrarNotificacion(true)
    // Ocultar la notificación después de 2 segundos
    setTimeout(() => setMostrarNotificacion(false), 2000)
  }

  // Función para reiniciar el juego
  const reiniciarJuego = () => {
    setEstadoJuego('jugando')
  }

  // Función para renderizar la palabra con guiones y letras adivinadas
  const renderizarPalabra = () => {
    return palabra.split('').map((letra, indice) => (
      <span key={indice} className="letra">
        {letrasAdivinadas.includes(letra) ? letra : '_'}
      </span>
    ))
  }

  // Función para renderizar el dibujo del ahorcado según los errores
  const renderizarAhorcado = () => {
    const errores = letrasIncorrectas.length
    return (
      <div className="contenedor-ahorcado">
        {/* Base del ahorcado */}
        <div className="base-ahorcado"></div>
        
        {/* Poste vertical */}
        <div className="poste-ahorcado"></div>
        
        {/* Travesaño horizontal superior */}
        <div className="travesano-ahorcado"></div>
        
        {/* Cuerda que cuelga del travesaño */}
        <div className="cuerda-ahorcado"></div>
        
        {/* Cabeza (aparece con 1 error) */}
        {errores > 0 && <div className="cabeza-ahorcado"></div>}
        
        {/* Cuerpo (aparece con 2 errores) */}
        {errores > 1 && <div className="cuerpo-ahorcado"></div>}
        
        {/* Brazo izquierdo (aparece con 3 errores) */}
        {errores > 2 && <div className="brazo-izquierdo-ahorcado"></div>}
        
        {/* Brazo derecho (aparece con 4 errores) */}
        {errores > 3 && <div className="brazo-derecho-ahorcado"></div>}
        
        {/* Pierna izquierda (aparece con 5 errores) */}
        {errores > 4 && <div className="pierna-izquierda-ahorcado"></div>}
        
        {/* Pierna derecha (aparece con 6 errores - juego perdido) */}
        {errores > 5 && <div className="pierna-derecha-ahorcado"></div>}
      </div>
    )
  }

  return (
    <div className="App">
      <header className="encabezado-app">
        <h1>JUEGO DEL AHORCADO</h1>
        <p>Adivina la palabra relacionada con desarrollo de software e IA</p>
        
        {/* Logos de Vite y React (mantenidos del código original) */}
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        
        {/* Contador de ejemplo (mantenido del código original) */}
        <div className="tarjeta">
          <button onClick={() => setContador((contador) => contador + 1)}>
            Contador: {contador}
          </button>
          <p>
            Este contador es solo demostrativo, no afecta el juego
          </p>
        </div>
      </header>

      <div className="contenedor-juego">
        {/* Sección del dibujo del ahorcado */}
        <div className="seccion-ahorcado">
          {renderizarAhorcado()}
          <div className="letras-incorrectas">
            <p>Letras incorrectas: {letrasIncorrectas.join(', ')}</p>
            <p>Intentos restantes: {6 - letrasIncorrectas.length}</p>
          </div>
        </div>

        {/* Palabra a adivinar (mostrada con guiones) */}
        <div className="seccion-palabra">
          <div className="palabra">{renderizarPalabra()}</div>
        </div>

        {/* Teclado virtual para dispositivos móviles */}
        <div className="seccion-teclado">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letra => (
            <button
              key={letra}
              onClick={() => {
                // Verificar si la letra ya fue usada o el juego terminó
                if (estadoJuego !== 'jugando' || 
                    letrasAdivinadas.includes(letra) || 
                    letrasIncorrectas.includes(letra)) {
                  mostrarNotificacionTemporal()
                  return
                }
                
                // Agregar letra a adivinadas o incorrectas según corresponda
                if (palabra.includes(letra)) {
                  setLetrasAdivinadas(prev => [...prev, letra])
                } else {
                  setLetrasIncorrectas(prev => [...prev, letra])
                }
              }}
              // Deshabilitar botones de letras ya usadas o cuando el juego terminó
              disabled={letrasAdivinadas.includes(letra) || letrasIncorrectas.includes(letra) || estadoJuego !== 'jugando'}
              // Aplicar clases CSS según si la letra es correcta o incorrecta
              className={`tecla ${
                letrasAdivinadas.includes(letra) ? 'correcta' : 
                letrasIncorrectas.includes(letra) ? 'incorrecta' : ''
              }`}
            >
              {letra}
            </button>
          ))}
        </div>

        {/* Notificación de letra repetida */}
        {mostrarNotificacion && (
          <div className="notificacion">
            <p>Ya has intentado con esta letra</p>
          </div>
        )}

        {/* Modal de resultado al ganar o perder */}
        {estadoJuego !== 'jugando' && (
          <div className="modal-resultado">
            <div className="contenido-resultado">
              <h2>
                {estadoJuego === 'ganado' 
                  ? '¡Felicidades! Has ganado' 
                  : '¡Game Over! Has perdido'}
              </h2>
              <p>La palabra era: <strong>{palabra}</strong></p>
              <button onClick={reiniciarJuego} className="boton-reiniciar">
                Jugar de nuevo
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Mensaje del ejemplo original */}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App