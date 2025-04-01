'use client';
import { useEffect, useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Loot {
  id: number;
  position: Position;
  type: 'key' | 'deed' | 'mortgage' | 'dreamhouse' | 'powerup';
  collected: boolean;
}

interface Obstacle {
  id: number;
  position: Position;
}

export default function LootGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hunterPosition, setHunterPosition] = useState<Position>({ x: 50, y: 50 });
  const [loot, setLoot] = useState<Loot[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPoweredUp, setIsPoweredUp] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, timeLeft]);

  const generateObstacles = useCallback(() => {
    const newObstacles: Obstacle[] = [];
    const numObstacles = Math.min(3 + level, 8);
    
    for (let i = 0; i < numObstacles; i++) {
      newObstacles.push({
        id: i,
        position: {
          x: Math.random() * 90,
          y: Math.random() * 90
        }
      });
    }
    return newObstacles;
  }, [level]);

  const generateLoot = useCallback(() => {
    const newLoot: Loot[] = [];
    const types: ('key' | 'deed' | 'mortgage' | 'dreamhouse' | 'powerup')[] = 
      ['key', 'deed', 'mortgage', 'dreamhouse', 'powerup'];
    
    for (let i = 0; i < 5; i++) {
      newLoot.push({
        id: i,
        position: {
          x: Math.random() * 90,
          y: Math.random() * 90
        },
        type: types[Math.floor(Math.random() * types.length)],
        collected: false
      });
    }
    return newLoot;
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setIsPoweredUp(false);
    setHunterPosition({ x: 50, y: 50 });
    setLoot(generateLoot());
    setObstacles(generateObstacles());
  };

  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const moveHunterTo = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!gameStarted || gameOver) return;

    setHunterPosition(prev => {
      const step = 5;
      const newPos = { ...prev };

      switch (direction) {
        case 'up':
          newPos.y = Math.max(0, prev.y - step);
          break;
        case 'down':
          newPos.y = Math.min(90, prev.y + step);
          break;
        case 'left':
          newPos.x = Math.max(0, prev.x - step);
          break;
        case 'right':
          newPos.x = Math.min(90, prev.x + step);
          break;
      }

      // Check collision with obstacles
      const hitObstacle = obstacles.some(obs => 
        Math.abs(newPos.x - obs.position.x) < 8 && 
        Math.abs(newPos.y - obs.position.y) < 8
      );

      if (hitObstacle && !isPoweredUp) {
        endGame();
        return prev;
      }

      // Check collision with loot
      setLoot(prevLoot => {
        const newLoot = prevLoot.map(item => {
          if (!item.collected && 
              Math.abs(newPos.x - item.position.x) < 8 && 
              Math.abs(newPos.y - item.position.y) < 8) {
            
            if (item.type === 'powerup') {
              setIsPoweredUp(true);
              setTimeout(() => setIsPoweredUp(false), 5000);
              setScore(s => s + 50);
            } else {
              setScore(s => s + (item.type === 'key' ? 10 : item.type === 'deed' ? 50 : item.type === 'mortgage' ? 100 : 500));
              if (item.type === 'dreamhouse') {
                setLevel(l => l + 1);
                setTimeLeft(t => Math.min(t + 10, 60));
                setObstacles(generateObstacles());
              }
            }
            return { ...item, collected: true };
          }
          return item;
        });

        // Generate new loot if all collected
        if (newLoot.every(item => item.collected)) {
          return generateLoot();
        }
        return newLoot;
      });

      return newPos;
    });
  }, [gameStarted, gameOver, obstacles, isPoweredUp, generateLoot, generateObstacles]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': moveHunterTo('up'); break;
      case 'ArrowDown': moveHunterTo('down'); break;
      case 'ArrowLeft': moveHunterTo('left'); break;
      case 'ArrowRight': moveHunterTo('right'); break;
    }
  }, [moveHunterTo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getLootEmoji = (type: string) => {
    switch (type) {
      case 'key': return '🔑';
      case 'deed': return '📄';
      case 'mortgage': return '🏦';
      case 'dreamhouse': return '🏠';
      case 'powerup': return '⚡';
      default: return '🔑';
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-b from-blue-900/50 to-black/50 p-4 rounded-xl backdrop-blur-sm border border-white/10">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-blue-400 mb-2">House Hunter Adventure</h3>
        <p className="text-sm text-gray-300 mb-2">
          {isMobile ? 'Use the controls below to move the house hunter!' : 'Use arrow keys to move the house hunter and collect housing treasures!'}
        </p>
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-bold text-white">Score: {score}</p>
          <p className="text-lg font-bold text-white">High Score: {highScore}</p>
        </div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-bold text-white">Level: {level}</p>
          <p className="text-lg font-bold text-white">Time: {timeLeft}s</p>
        </div>
        {isPoweredUp && (
          <p className="text-lg font-bold text-yellow-400 animate-pulse">⚡ Power Up Active! ⚡</p>
        )}
        {!gameStarted && (
          <button
            onClick={startGame}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-white font-bold
              hover:opacity-90 transition-all transform hover:scale-105 mt-2"
          >
            {gameOver ? 'Play Again' : 'Start Game'} 🏠
          </button>
        )}
      </div>
      
      {gameStarted && (
        <>
          <div className="relative w-full h-[300px] bg-gradient-to-b from-blue-950/30 to-black/30 rounded-lg border border-white/5">
            <div
              className={`absolute transition-all duration-100 text-2xl ${isPoweredUp ? 'animate-pulse' : ''}`}
              style={{ 
                left: `${hunterPosition.x}%`, 
                top: `${hunterPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              👨‍💼
            </div>
            {obstacles.map(obs => (
              <div
                key={obs.id}
                className="absolute transition-all duration-300"
                style={{ 
                  left: `${obs.position.x}%`, 
                  top: `${obs.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                🚧
              </div>
            ))}
            {loot.map(item => !item.collected && (
              <div
                key={item.id}
                className="absolute transition-all duration-300"
                style={{ 
                  left: `${item.position.x}%`, 
                  top: `${item.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {getLootEmoji(item.type)}
              </div>
            ))}
          </div>

          {/* Mobile Controls */}
          {isMobile && (
            <div className="mt-4 grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
              <div className="col-start-2">
                <button
                  onTouchStart={() => moveHunterTo('up')}
                  className="w-12 h-12 bg-blue-500/20 rounded-lg border-2 border-blue-500/40 flex items-center justify-center text-2xl"
                >
                  ⬆️
                </button>
              </div>
              <div className="col-start-1 row-start-2">
                <button
                  onTouchStart={() => moveHunterTo('left')}
                  className="w-12 h-12 bg-blue-500/20 rounded-lg border-2 border-blue-500/40 flex items-center justify-center text-2xl"
                >
                  ⬅️
                </button>
              </div>
              <div className="col-start-3 row-start-2">
                <button
                  onTouchStart={() => moveHunterTo('right')}
                  className="w-12 h-12 bg-blue-500/20 rounded-lg border-2 border-blue-500/40 flex items-center justify-center text-2xl"
                >
                  ➡️
                </button>
              </div>
              <div className="col-start-2 row-start-2">
                <button
                  onTouchStart={() => moveHunterTo('down')}
                  className="w-12 h-12 bg-blue-500/20 rounded-lg border-2 border-blue-500/40 flex items-center justify-center text-2xl"
                >
                  ⬇️
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-xl font-bold text-red-400">Game Over!</p>
          <p className="text-lg text-white">Final Score: {score}</p>
        </div>
      )}
    </div>
  );
} 