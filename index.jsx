import React, { useState, useEffect, useCallback } from 'react';
import { Music, Play, Users, Trophy, Timer, SkipForward, CheckCircle, RefreshCcw, Home, Plus, Trash2, Sparkles } from 'lucide-react';

// Lista extendida de canciones chilenas populares
const CHILEAN_SONGS = [
  "Gracias a la Vida - Violeta Parra",
  "Todos Juntos - Los Jaivas",
  "El Baile de los que Sobran - Los Prisioneros",
  "La Joya del Pacífico - Jorge Farías",
  "Mira Niñita - Los Jaivas",
  "Tren al Sur - Los Prisioneros",
  "Arriba en la Cordillera - Patricio Manns",
  "He barrido el sol - Los Tres",
  "Maldigo del alto cielo - Violeta Parra",
  "La Consentida - Jaime Atria",
  "Estrechez de Corazón - Los Prisioneros",
  "Amor Violento - Los Tres",
  "Tu falta de querer - Mon Laferte",
  "Miéntele - Los Bunkers",
  "Llueve sobre la ciudad - Los Bunkers",
  "Un amor violento - Los Tres",
  "Hijo del Sol Luminoso - Joe Vasconcellos",
  "La torre de Babel - Los Tres",
  "Fe - Jorge González",
  "Sube a nacer conmigo hermano - Los Jaivas"
];

const App = () => {
  const [view, setView] = useState('home'); // home, register, raffle, game, results
  const [teams, setTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentSong, setCurrentSong] = useState('');
  const [usedSongs, setUsedSongs] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  
  // Estado para el sorteo (raffle)
  const [raffleIndex, setRaffleIndex] = useState(0);
  const [isRaffleSpinning, setIsRaffleSpinning] = useState(false);

  // Color principal solicitado
  const brandColor = "#39AFB4";

  // Lógica para seleccionar una nueva canción
  const nextRound = useCallback(() => {
    let availableSongs = CHILEAN_SONGS.filter(s => !usedSongs.includes(s));
    
    if (availableSongs.length === 0) {
      setUsedSongs([]);
      availableSongs = CHILEAN_SONGS;
    }

    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selected = availableSongs[randomIndex];
    
    setCurrentSong(selected);
    setUsedSongs(prev => [...prev, selected]);
    setTimeLeft(30);
  }, [usedSongs]);

  // Manejo del temporizador del juego
  useEffect(() => {
    let interval = null;
    if (view === 'game' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, timeLeft]);

  // Manejo de la animación del sorteo
  useEffect(() => {
    let interval = null;
    if (view === 'raffle' && isRaffleSpinning) {
      interval = setInterval(() => {
        setRaffleIndex((prev) => (prev + 1) % teams.length);
      }, 100); // Velocidad de rotación
    }
    return () => clearInterval(interval);
  }, [view, isRaffleSpinning, teams.length]);

  // Gestión de equipos
  const addTeam = () => {
    if (newTeamName.trim()) {
      setTeams([...teams, { name: newTeamName.trim(), score: 0 }]);
      setNewTeamName('');
    }
  };

  const removeTeam = (index) => {
    setTeams(teams.filter((_, i) => i !== index));
  };

  const startRaffle = () => {
    if (teams.length === 0) return;
    setView('raffle');
    setIsRaffleSpinning(true);
    
    // Detener el sorteo después de 2.5 segundos
    setTimeout(() => {
      setIsRaffleSpinning(false);
      // El raffleIndex actual será el equipo que comienza
    }, 2500);
  };

  const startGameAfterRaffle = () => {
    setCurrentTeamIndex(raffleIndex);
    setScore(0);
    setUsedSongs([]);
    nextRound();
    setView('game');
  };

  const addPoint = () => {
    setScore(prev => prev + 1);
    nextRound();
  };

  const nextTeam = () => {
    const updatedTeams = [...teams];
    updatedTeams[currentTeamIndex].score = score;
    setTeams(updatedTeams);

    if (currentTeamIndex < teams.length - 1) {
      setCurrentTeamIndex(prev => prev + 1);
      setScore(0);
      nextRound();
    } else if (currentTeamIndex === teams.length - 1 && teams.length > 1 && currentTeamIndex !== 0) {
        // Caso cuando el que empezó no fue el índice 0 (por el sorteo)
        // Pero para simplificar el flujo, el sorteo define quién es el "primero" en la lista de turnos circular
        setView('results');
    } else {
        // En esta versión el sorteo decide quién empieza y luego sigue el orden de la lista
        setView('results');
    }
  };

  const resetApp = () => {
    setTeams([]);
    setNewTeamName('');
    setView('home');
  };

  // --- Vistas ---

  const HomeView = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-in fade-in duration-700">
      <div className="bg-white/20 p-6 rounded-full text-white animate-bounce shadow-lg">
        <Music size={64} />
      </div>
      <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-md">
        IMPROVISA
      </h1>
      <p className="text-xl text-white/90 max-w-md italic drop-shadow-sm">
        "Escucha, improvisa y adivina con la música chilena"
      </p>
      <button 
        onClick={() => setView('register')}
        style={{ color: brandColor }}
        className="px-10 py-4 bg-white hover:bg-gray-100 rounded-full text-xl font-bold transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
      >
        <Play fill="currentColor" size={24} /> Comenzar
      </button>
    </div>
  );

  const RegisterView = () => (
    <div className="flex flex-col items-center min-h-[80vh] space-y-6 animate-in slide-in-from-bottom-10 duration-500 w-full max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2 drop-shadow-sm">
        <Users /> Registrar Equipos
      </h2>
      
      <div className="flex w-full gap-2">
        <input 
          autoFocus
          type="text" 
          placeholder="Nombre del equipo..."
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTeam()}
          className="flex-grow px-4 py-3 border-2 border-transparent rounded-xl focus:ring-4 focus:ring-white/20 outline-none transition-all shadow-md"
        />
        <button 
          onClick={addTeam}
          className="bg-white p-3 rounded-xl hover:bg-gray-100 active:scale-95 transition-all shadow-md"
          style={{ color: brandColor }}
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="w-full space-y-3 overflow-y-auto max-h-[40vh] px-2">
        {teams.map((team, index) => (
          <div key={index} className="flex items-center justify-between bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm group animate-in slide-in-from-left-5">
            <div className="flex items-center gap-3">
              <div style={{ backgroundColor: brandColor }} className="text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <span className="font-semibold text-gray-700">{team.name}</span>
            </div>
            <button onClick={() => removeTeam(index)} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {teams.length === 0 && (
          <p className="text-center text-white/80 italic py-8">Añade al menos un equipo para jugar</p>
        )}
      </div>

      <button 
        onClick={startRaffle}
        disabled={teams.length === 0}
        style={{ color: teams.length > 0 ? brandColor : '#999' }}
        className="w-full py-4 bg-white disabled:bg-gray-200 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-100 transition-colors mt-auto disabled:shadow-none"
      >
        ¡Iniciar Competencia! ({teams.length})
      </button>
    </div>
  );

  const RaffleView = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-in zoom-in duration-500 px-4">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest drop-shadow-md">
            {isRaffleSpinning ? "Sorteando primer turno..." : "¡Equipo inicial elegido!"}
        </h2>
        <div className="flex justify-center">
            <Sparkles className={`text-yellow-300 ${isRaffleSpinning ? 'animate-spin' : 'animate-bounce'}`} size={48} />
        </div>
      </div>

      <div className="bg-white w-full max-w-md p-12 rounded-[3rem] shadow-2xl border-b-8 border-gray-100 transform transition-all relative overflow-hidden">
        {/* Efecto de luces para el ganador */}
        {!isRaffleSpinning && (
            <div className="absolute inset-0 bg-yellow-400/10 animate-pulse pointer-events-none" />
        )}
        
        <p className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-4 font-bold">Comienza el juego:</p>
        <h3 className={`text-4xl md:text-5xl font-black transition-all duration-75 ${isRaffleSpinning ? 'scale-90 opacity-50' : 'scale-110'}`} style={{ color: brandColor }}>
          {teams[raffleIndex]?.name}
        </h3>
      </div>

      {!isRaffleSpinning && (
        <button 
          onClick={startGameAfterRaffle}
          style={{ color: brandColor }}
          className="px-12 py-5 bg-white hover:bg-gray-100 rounded-full text-2xl font-black transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          ¡A Jugar! <Play fill="currentColor" size={24} />
        </button>
      )}
    </div>
  );

  const GameView = () => (
    <div className="flex flex-col h-[85vh] justify-between p-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-lg">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          <span className="font-bold text-xl" style={{ color: brandColor }}>{score} pts</span>
        </div>
        <div className="flex flex-col items-center overflow-hidden px-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Turno de</span>
            <div className="font-bold uppercase text-sm truncate max-w-[120px]" style={{ color: brandColor }}>
              {teams[currentTeamIndex]?.name}
            </div>
        </div>
        <div className={`flex items-center gap-2 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : ''}`} style={{ color: timeLeft > 5 ? brandColor : undefined }}>
          <Timer size={20} />
          <span className="font-mono font-bold text-2xl">{timeLeft}s</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow space-y-10">
        <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl border-b-8 border-gray-100 text-center transform transition-all">
            <p className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-4 font-bold">Tararea o improvisa:</p>
            <h3 className="text-3xl md:text-4xl font-black leading-snug" style={{ color: brandColor }}>
              {currentSong}
            </h3>
        </div>

        <div className="grid grid-cols-1 w-full max-w-md gap-4">
          <button 
            onClick={addPoint}
            className="group flex items-center justify-center gap-3 py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl text-2xl font-bold shadow-xl transition-all active:scale-95"
          >
            <CheckCircle size={32} className="group-hover:rotate-12 transition-transform" /> 
            ¡Adivinó! (+1)
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={nextRound}
              className="flex items-center justify-center gap-2 py-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold transition-all backdrop-blur-sm"
            >
              <SkipForward size={20} /> Saltar
            </button>
            <button 
              onClick={nextTeam}
              style={{ color: brandColor }}
              className="flex items-center justify-center gap-2 py-4 bg-white hover:bg-gray-100 text-white rounded-2xl font-bold transition-all shadow-md"
            >
              {currentTeamIndex < teams.length - 1 ? 'Siguiente Equipo' : 'Finalizar Juego'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ResultsView = () => {
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6 animate-in zoom-in duration-500 max-w-md mx-auto py-8">
        <div className="relative mb-4 bg-white/20 p-6 rounded-full shadow-inner">
          <Trophy size={100} className="text-yellow-300 drop-shadow-lg" />
          <div className="absolute -top-2 -right-2 bg-white text-gray-800 text-xs px-2 py-1 rounded-full font-bold shadow-sm" style={{ color: brandColor }}>POSICIONES</div>
        </div>
        
        <h2 className="text-3xl font-black text-white uppercase drop-shadow-md">Tabla de Puntajes</h2>
        
        <div className="w-full space-y-3">
            {sortedTeams.map((team, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-2xl shadow-md border-2 ${index === 0 ? 'bg-yellow-50 border-yellow-300 scale-105' : 'bg-white border-transparent opacity-90'}`}>
                    <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {index + 1}
                        </span>
                        <span className="font-bold text-gray-800">{team.name}</span>
                    </div>
                    <span className="text-2xl font-black" style={{ color: brandColor }}>{team.score}</span>
                </div>
            ))}
        </div>

        <div className="flex flex-col gap-3 w-full pt-6">
          <button 
            onClick={() => {
                const resetTeams = teams.map(t => ({ ...t, score: 0 }));
                setTeams(resetTeams);
                startRaffle(); // Volver a sortear quién empieza
            }}
            style={{ color: brandColor }}
            className="px-8 py-4 bg-white text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 shadow-lg transition-all"
          >
            <RefreshCcw size={20} /> Jugar de nuevo
          </button>
          <button 
            onClick={resetApp}
            className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
          >
            <Home size={20} /> Volver al Inicio
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: brandColor }} className="min-h-screen font-sans text-gray-900 p-4 transition-colors duration-500 overflow-x-hidden">
      <div className="max-w-xl mx-auto">
        {view === 'home' && <HomeView />}
        {view === 'register' && <RegisterView />}
        {view === 'raffle' && <RaffleView />}
        {view === 'game' && <GameView />}
        {view === 'results' && <ResultsView />}
      </div>
    </div>
  );
};

export default App;
