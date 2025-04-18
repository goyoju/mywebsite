import React, { useState, useEffect, useRef } from 'react';

// 간단한 우주 슈팅 게임 컴포넌트
const SpaceShooterGame = ({ onGameComplete }) => {
  const [gameStatus, setGameStatus] = useState('ready'); // 'ready', 'playing', 'complete'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [ship, setShip] = useState({ x: 50, y: 75, angle: 0 });
  const [bullets, setBullets] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [keys, setKeys] = useState({ left: false, right: false, up: false, space: false });
  const gameAreaRef = useRef(null);
  const requestRef = useRef();
  const lastTimeRef = useRef();
  const lastAsteroidSpawnRef = useRef(0);
  const lastBulletFiredRef = useRef(0);
  
  // 게임 시작
  const startGame = () => {
    setGameStatus('playing');
    setScore(0);
    setTimeLeft(30);
    setShip({ x: 50, y: 75, angle: 0 });
    setBullets([]);
    setAsteroids([createNewAsteroid()]);
    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);
  };
  
  // 게임 루프
  const gameLoop = (timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    // 우주선 이동 처리
    updateShip(deltaTime);
    
    // 총알 이동 처리
    updateBullets(deltaTime);
    
    // 소행성 이동 처리
    updateAsteroids(deltaTime);
    
    // 충돌 감지
    detectCollisions();
    
    // 새 소행성 생성
    if (gameStatus === 'playing' && timestamp - lastAsteroidSpawnRef.current > 3000 && asteroids.length < 5) {
      setAsteroids(prev => [...prev, createNewAsteroid()]);
      lastAsteroidSpawnRef.current = timestamp;
    }
    
    // 총알 발사
    if (keys.space && timestamp - lastBulletFiredRef.current > 300) {
      fireBullet();
      lastBulletFiredRef.current = timestamp;
    }
    
    if (gameStatus === 'playing') {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };
  
  // 우주선 업데이트
  const updateShip = (deltaTime) => {
    if (gameStatus !== 'playing') return;
    
    let newX = ship.x;
    let newY = ship.y;
    let newAngle = ship.angle;
    
    if (keys.left) {
      newAngle = (newAngle - 5) % 360;
    }
    if (keys.right) {
      newAngle = (newAngle + 5) % 360;
    }
    
    const speed = 0.1;
    if (keys.up) {
      const radians = newAngle * Math.PI / 180;
      newX += Math.sin(radians) * speed * deltaTime;
      newY -= Math.cos(radians) * speed * deltaTime;
    }
    
    // 화면 경계 처리
    if (newX < 0) newX = 100;
    if (newX > 100) newX = 0;
    if (newY < 0) newY = 100;
    if (newY > 100) newY = 0;
    
    setShip({ x: newX, y: newY, angle: newAngle });
  };
  
  // 총알 업데이트
  const updateBullets = (deltaTime) => {
    if (gameStatus !== 'playing') return;
    
    setBullets(prevBullets => {
      return prevBullets.map(bullet => {
        // 총알 이동
        const radians = bullet.angle * Math.PI / 180;
        const newX = bullet.x + Math.sin(radians) * 0.3 * deltaTime;
        const newY = bullet.y - Math.cos(radians) * 0.3 * deltaTime;
        
        return { ...bullet, x: newX, y: newY, lifeTime: bullet.lifeTime - deltaTime };
      }).filter(bullet => {
        // 화면 밖으로 나가거나 수명이 다한 총알 제거
        return bullet.lifeTime > 0 && 
               bullet.x >= 0 && bullet.x <= 100 && 
               bullet.y >= 0 && bullet.y <= 100;
      });
    });
  };
  
  // 소행성 업데이트
  const updateAsteroids = (deltaTime) => {
    if (gameStatus !== 'playing') return;
    
    setAsteroids(prevAsteroids => {
      return prevAsteroids.map(asteroid => {
        // 소행성 이동
        let newX = asteroid.x + asteroid.speedX * deltaTime * 0.05;
        let newY = asteroid.y + asteroid.speedY * deltaTime * 0.05;
        
        // 화면 경계 처리
        if (newX < 0) newX = 100;
        if (newX > 100) newX = 0;
        if (newY < 0) newY = 100;
        if (newY > 100) newY = 0;
        
        return { ...asteroid, x: newX, y: newY };
      });
    });
  };
  
  // 총알 발사
  const fireBullet = () => {
    if (gameStatus !== 'playing') return;
    
    const newBullet = {
      id: Date.now(),
      x: ship.x,
      y: ship.y,
      angle: ship.angle,
      lifeTime: 1500, // 총알 수명 (ms)
    };
    
    setBullets(prevBullets => [...prevBullets, newBullet]);
  };
  
  // 충돌 감지
  const detectCollisions = () => {
    if (gameStatus !== 'playing') return;
    
    // 소행성-우주선 충돌
    const shipCollision = asteroids.some(asteroid => {
      const distance = Math.sqrt(
        Math.pow(ship.x - asteroid.x, 2) + 
        Math.pow(ship.y - asteroid.y, 2)
      );
      return distance < (10 + asteroid.size / 2) / 100 * gameAreaRef.current.offsetWidth;
    });
    
    if (shipCollision) {
      endGame();
      return;
    }
    
    // 총알-소행성 충돌
    const newBullets = [...bullets];
    const newAsteroids = [...asteroids];
    const asteroidsToAdd = [];
    
    for (let i = newBullets.length - 1; i >= 0; i--) {
      const bullet = newBullets[i];
      
      for (let j = newAsteroids.length - 1; j >= 0; j--) {
        const asteroid = newAsteroids[j];
        
        const distance = Math.sqrt(
          Math.pow(bullet.x - asteroid.x, 2) + 
          Math.pow(bullet.y - asteroid.y, 2)
        );
        
        // 충돌 발생
        if (distance < (5 + asteroid.size / 2) / 100 * gameAreaRef.current.offsetWidth) {
          // 총알 제거
          newBullets.splice(i, 1);
          
          // 점수 증가
          setScore(prev => prev + (4 - asteroid.stage) * 10);
          
          // 소행성 처리
          if (asteroid.stage > 1) {
            // 소행성이 쪼개짐
            for (let k = 0; k < 2; k++) {
              asteroidsToAdd.push({
                id: Date.now() + k,
                x: asteroid.x,
                y: asteroid.y,
                size: asteroid.size * 0.7,
                stage: asteroid.stage - 1,
                shape: asteroid.stage === 2 ? 'triangle' : 'square',
                speedX: asteroid.speedX * (k === 0 ? 1.2 : -1.2),
                speedY: asteroid.speedY * (k === 0 ? -1.2 : 1.2),
                rotation: Math.random() * 360
              });
            }
          }
          
          // 소행성 제거
          newAsteroids.splice(j, 1);
          break;
        }
      }
    }
    
    setBullets(newBullets);
    setAsteroids([...newAsteroids, ...asteroidsToAdd]);
  };
  
  // 새 소행성 생성
  const createNewAsteroid = () => {
    // 소행성을 화면 가장자리에서 생성
    let x, y;
    const side = Math.floor(Math.random() * 4);
    
    switch (side) {
      case 0: // 위
        x = Math.random() * 100;
        y = 0;
        break;
      case 1: // 오른쪽
        x = 100;
        y = Math.random() * 100;
        break;
      case 2: // 아래
        x = Math.random() * 100;
        y = 100;
        break;
      case 3: // 왼쪽
        x = 0;
        y = Math.random() * 100;
        break;
    }
    
    return {
      id: Date.now(),
      x,
      y,
      size: 40 + Math.random() * 20, // 40px ~ 60px
      stage: 3, // 소행성의 크기 단계 (3: 큼, 2: 중간, 1: 작음)
      shape: 'square',
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360
    };
  };
  
  // 게임 종료
  const endGame = () => {
    setGameStatus('complete');
    cancelAnimationFrame(requestRef.current);
  };
  
  // 타이머 설정
  useEffect(() => {
    let interval;
    if (gameStatus === 'playing') {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            endGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus]);
  
  // 키보드 이벤트 리스너
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowLeft':
          setKeys(prev => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
          setKeys(prev => ({ ...prev, right: true }));
          break;
        case 'ArrowUp':
          setKeys(prev => ({ ...prev, up: true }));
          break;
        case ' ':
          setKeys(prev => ({ ...prev, space: true }));
          break;
      }
    };
    
    const handleKeyUp = (e) => {
      if (gameStatus !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowLeft':
          setKeys(prev => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
          setKeys(prev => ({ ...prev, right: false }));
          break;
        case 'ArrowUp':
          setKeys(prev => ({ ...prev, up: false }));
          break;
        case ' ':
          setKeys(prev => ({ ...prev, space: false }));
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, [gameStatus]);
  
  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);
  
  // SVG 렌더링 헬퍼 함수들
  const renderShip = () => {
    const shipSize = 15;
    const centerX = ship.x;
    const centerY = ship.y;
    const radians = ship.angle * Math.PI / 180;
    
    // 삼각형의 세 점 계산
    const x1 = centerX + Math.sin(radians) * shipSize / 100 * gameAreaRef.current.offsetWidth;
    const y1 = centerY - Math.cos(radians) * shipSize / 100 * gameAreaRef.current.offsetWidth;
    
    const x2 = centerX + Math.sin(radians + 2.5) * shipSize / 2 / 100 * gameAreaRef.current.offsetWidth;
    const y2 = centerY - Math.cos(radians + 2.5) * shipSize / 2 / 100 * gameAreaRef.current.offsetWidth;
    
    const x3 = centerX + Math.sin(radians - 2.5) * shipSize / 2 / 100 * gameAreaRef.current.offsetWidth;
    const y3 = centerY - Math.cos(radians - 2.5) * shipSize / 2 / 100 * gameAreaRef.current.offsetWidth;
    
    const points = `${x1}% ${y1}%, ${x2}% ${y2}%, ${x3}% ${y3}%`;
    
    return (
      <polygon 
        points={points} 
        fill="white" 
        stroke="white" 
        strokeWidth="1"
      />
    );
  };
  
  const renderBullets = () => {
    return bullets.map(bullet => (
      <circle
        key={bullet.id}
        cx={`${bullet.x}%`}
        cy={`${bullet.y}%`}
        r="2"
        fill="white"
      />
    ));
  };
  
  const renderAsteroids = () => {
    return asteroids.map(asteroid => {
      const percentSize = asteroid.size / 100 * gameAreaRef.current?.offsetWidth || 0;
      
      if (asteroid.shape === 'square') {
        return (
          <rect
            key={asteroid.id}
            x={`calc(${asteroid.x}% - ${percentSize / 2}px)`}
            y={`calc(${asteroid.y}% - ${percentSize / 2}px)`}
            width={percentSize}
            height={percentSize}
            fill="none"
            stroke="white"
            strokeWidth="1"
            transform={`rotate(${asteroid.rotation}, ${asteroid.x}, ${asteroid.y})`}
          />
        );
      } else {
        // 삼각형 소행성
        const x1 = asteroid.x;
        const y1 = asteroid.y - percentSize / 2;
        const x2 = asteroid.x - percentSize / 2;
        const y2 = asteroid.y + percentSize / 2;
        const x3 = asteroid.x + percentSize / 2;
        const y3 = asteroid.y + percentSize / 2;
        
        return (
          <polygon
            key={asteroid.id}
            points={`${x1}% ${y1}%, ${x2}% ${y2}%, ${x3}% ${y3}%`}
            fill="none"
            stroke="white"
            strokeWidth="1"
            transform={`rotate(${asteroid.rotation}, ${asteroid.x}%, ${asteroid.y}%)`}
          />
        );
      }
    });
  };
  
  // 방향키 컨트롤을 위한 터치 버튼 렌더링
  const renderTouchControls = () => {
    if (gameStatus !== 'playing') return null;
    
    const handleTouchStart = (key, e) => {
      e.preventDefault();
      setKeys(prev => ({ ...prev, [key]: true }));
    };
    
    const handleTouchEnd = (key, e) => {
      e.preventDefault();
      setKeys(prev => ({ ...prev, [key]: false }));
    };
    
    return (
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6">
        <div className="flex">
          <button
            className="w-12 h-12 bg-gray-800 bg-opacity-50 rounded-full border border-gray-500 flex items-center justify-center text-white"
            onTouchStart={(e) => handleTouchStart('left', e)}
            onTouchEnd={(e) => handleTouchEnd('left', e)}
          >
            ←
          </button>
          <button
            className="w-12 h-12 bg-gray-800 bg-opacity-50 rounded-full border border-gray-500 flex items-center justify-center text-white ml-2"
            onTouchStart={(e) => handleTouchStart('right', e)}
            onTouchEnd={(e) => handleTouchEnd('right', e)}
          >
            →
          </button>
        </div>
        <div className="flex">
          <button
            className="w-12 h-12 bg-gray-800 bg-opacity-50 rounded-full border border-gray-500 flex items-center justify-center text-white"
            onTouchStart={(e) => handleTouchStart('up', e)}
            onTouchEnd={(e) => handleTouchEnd('up', e)}
          >
            ↑
          </button>
          <button
            className="w-12 h-12 bg-gray-800 bg-opacity-50 rounded-full border border-gray-500 flex items-center justify-center text-white ml-2"
            onTouchStart={(e) => handleTouchStart('space', e)}
            onTouchEnd={(e) => handleTouchEnd('space', e)}
          >
            🔫
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold mb-2">우주 슈팅 게임</h2>
        <p className="text-gray-400 mb-2">방향키로 우주선을 움직이고, 스페이스바로 발사하세요!</p>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg">
          <span className="font-medium">점수:</span> {score}
        </div>
        <div className="text-lg">
          <span className="font-medium">남은 시간:</span> {timeLeft}초
        </div>
      </div>
      
      {gameStatus === 'ready' && (
        <div className="text-center">
          <button
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
          >
            게임 시작하기
          </button>
        </div>
      )}
      
      {gameStatus === 'playing' && (
        <div
          ref={gameAreaRef}
          className="bg-gray-900 w-full h-64 relative rounded-lg overflow-hidden border border-gray-700"
        >
          <svg width="100%" height="100%">
            {renderShip()}
            {renderBullets()}
            {renderAsteroids()}
          </svg>
          {renderTouchControls()}
        </div>
      )}
      
      {gameStatus === 'complete' && (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">게임 종료!</h3>
          <p className="text-lg mb-4">당신의 최종 점수: <span className="font-bold text-blue-400">{score}</span></p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              다시 하기
            </button>
            <button
              onClick={onGameComplete}
              className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-4 py-2 rounded-md transition-colors"
            >
              계속하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceShooterGame;
