import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw, CheckCircle2, Circle, Trash2, Plus, Settings, X, Bell, BellOff } from 'lucide-react';
// import './App.css';

// Utility function to format time
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Settings Modal Component
const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key, value) => {
    setLocalSettings({ ...localSettings, [key]: parseInt(value) || 1 });
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Settings size={28} />
            Configuración
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Duración de Trabajo (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localSettings.workDuration}
              onChange={(e) => handleChange('workDuration', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descanso Corto (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={localSettings.shortBreakDuration}
              onChange={(e) => handleChange('shortBreakDuration', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descanso Largo (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localSettings.longBreakDuration}
              onChange={(e) => handleChange('longBreakDuration', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pomodoros antes de descanso largo
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={localSettings.longBreakInterval}
              onChange={(e) => handleChange('longBreakInterval', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

// Timer Display Component
const Display = ({ timeLeft, currentMode }) => {
  const modeColors = {
    work: 'text-red-500',
    shortBreak: 'text-green-500',
    longBreak: 'text-blue-500'
  };

  const modeTitles = {
    work: 'Tiempo de Trabajo',
    shortBreak: 'Descanso Corto',
    longBreak: 'Descanso Largo'
  };

  return (
    <div className="text-center mb-8">
      <h2 className={`text-2xl font-semibold mb-4 ${modeColors[currentMode]}`}>
        {modeTitles[currentMode]}
      </h2>
      <div className="text-8xl font-bold text-gray-800">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

// Controls Component
const Controls = ({ isRunning, onStart, onPause, onReset }) => {
  return (
    <div className="flex justify-center gap-4 mb-8">
      {!isRunning ? (
        <button
          onClick={onStart}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          <Play size={20} />
          Iniciar
        </button>
      ) : (
        <button
          onClick={onPause}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          <Pause size={20} />
          Pausar
        </button>
      )}
      <button
        onClick={onReset}
        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
      >
        <RotateCcw size={20} />
        Reiniciar
      </button>
    </div>
  );
};

// Mode Selector Component
const ModeSelector = ({ currentMode, onModeChange }) => {
  const modes = [
    { id: 'work', label: 'Trabajo', color: 'bg-red-500' },
    { id: 'shortBreak', label: 'Descanso', color: 'bg-green-500' },
    { id: 'longBreak', label: 'Descanso Largo', color: 'bg-blue-500' }
  ];

  return (
    <div className="flex justify-center gap-2 mb-8">
      {modes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            currentMode === mode.id
              ? `${mode.color} text-white`
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

// Task Item Component
const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <button onClick={() => onToggle(task.id)} className="flex-shrink-0">
        {task.completed ? (
          <CheckCircle2 className="text-green-500" size={24} />
        ) : (
          <Circle className="text-gray-400" size={24} />
        )}
      </button>
      <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
        {task.text}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

// Task List Component
const TaskList = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAddTask(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Tareas</h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Agregar nueva tarea..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
        >
          <Plus size={20} />
          Agregar
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No hay tareas aún. ¡Agrega una!</p>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Statistics Component
const Statistics = ({ pomodorosCompleted, totalMinutes }) => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 shadow-lg text-white">
      <h3 className="text-2xl font-bold mb-4">Estadísticas del Día</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <div className="text-4xl font-bold">{pomodorosCompleted}</div>
          <div className="text-sm opacity-90">Pomodoros Completados</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <div className="text-4xl font-bold">{totalMinutes}</div>
          <div className="text-sm opacity-90">Minutos Trabajados</div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  // Default settings
  const DEFAULT_SETTINGS = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4
  };

  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pomodoroSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Timer settings (in seconds)
  const WORK_DURATION = settings.workDuration * 60;
  const SHORT_BREAK_DURATION = settings.shortBreakDuration * 60;
  const LONG_BREAK_DURATION = settings.longBreakDuration * 60;

  // State
  const [currentMode, setCurrentMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Load tasks on mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('pomodoroTasks') || '[]');
    setTasks(savedTasks);
    
    // Create audio element for notification
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBi6F0fPTgjMGH2625+yOOwkTWLDn7KRXFAo+ltryxnIoBS195/LDdSkF');
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationsEnabled(permission === 'granted');
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('pomodoroTasks')) {
      localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }

    // Browser notification
    if (notificationsEnabled && 'Notification' in window) {
      const titles = {
        work: '¡Pomodoro completado! 🎉',
        shortBreak: 'Descanso terminado',
        longBreak: 'Descanso largo terminado'
      };
      
      const bodies = {
        work: '¡Excelente trabajo! Hora de tomar un descanso.',
        shortBreak: '¿Listo para continuar trabajando?',
        longBreak: '¡Recargaste energías! Hora de volver al trabajo.'
      };

      new Notification(titles[currentMode], {
        body: bodies[currentMode],
        icon: '⏰',
        tag: 'pomodoro-timer'
      });
    }

    // Update pomodoros count if work session completed
    if (currentMode === 'work') {
      const newCount = pomodorosCompleted + 1;
      setPomodorosCompleted(newCount);
      
      // Auto-switch to break
      if (newCount % settings.longBreakInterval === 0) {
        setCurrentMode('longBreak');
        setTimeLeft(LONG_BREAK_DURATION);
      } else {
        setCurrentMode('shortBreak');
        setTimeLeft(SHORT_BREAK_DURATION);
      }
    } else {
      // After break, go back to work
      setCurrentMode('work');
      setTimeLeft(WORK_DURATION);
    }
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  
  const handleReset = () => {
    setIsRunning(false);
    const durations = {
      work: WORK_DURATION,
      shortBreak: SHORT_BREAK_DURATION,
      longBreak: LONG_BREAK_DURATION
    };
    setTimeLeft(durations[currentMode]);
  };

  const handleModeChange = (mode) => {
    setIsRunning(false);
    setCurrentMode(mode);
    const durations = {
      work: WORK_DURATION,
      shortBreak: SHORT_BREAK_DURATION,
      longBreak: LONG_BREAK_DURATION
    };
    setTimeLeft(durations[mode]);
  };

  // Task handlers
  const handleAddTask = (text) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    
    // Update current timer if needed
    setIsRunning(false);
    const durations = {
      work: newSettings.workDuration * 60,
      shortBreak: newSettings.shortBreakDuration * 60,
      longBreak: newSettings.longBreakDuration * 60
    };
    setTimeLeft(durations[currentMode]);
  };

  const toggleNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Tu navegador no soporta notificaciones');
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(!notificationsEnabled);
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    } else {
      alert('Las notificaciones están bloqueadas. Por favor habilítalas en la configuración de tu navegador.');
    }
  };

  const totalMinutes = Math.floor((pomodorosCompleted * settings.workDuration));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Clock className="text-purple-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-800">Pomodoro Timer</h1>
          </div>
          <p className="text-gray-600">Organiza tu tiempo y maximiza tu productividad</p>
          
          {/* Action buttons */}
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-semibold"
            >
              <Settings size={20} />
              Configuración
            </button>
            <button
              onClick={toggleNotifications}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
                notificationsEnabled
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
              Notificaciones
            </button>
          </div>
        </div>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSave={handleSaveSettings}
        />

        {/* Timer Section */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
          <ModeSelector currentMode={currentMode} onModeChange={handleModeChange} />
          <Display timeLeft={timeLeft} currentMode={currentMode} />
          <Controls
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />
        </div>

        {/* Statistics and Tasks Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Statistics pomodorosCompleted={pomodorosCompleted} totalMinutes={totalMinutes} />
          <TaskList
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
}

export default App;