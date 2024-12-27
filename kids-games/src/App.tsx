import { useState } from 'react';
import styled from 'styled-components';
import GameSelector from './components/GameSelector';
import GameXmas from './games/xmas/GameXmas';
import GameBatman from './games/batman/GameBatman';

type GameType = 'none' | 'gameXmas' | 'gameBatman';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
`;

function App() {
  const [selectedGame, setSelectedGame] = useState<GameType>('none');

  const renderGame = () => {
    switch (selectedGame) {
      case 'gameXmas':
        return <GameXmas onBack={() => setSelectedGame('none')} />;
      case 'gameBatman':
        return <GameBatman onBack={() => setSelectedGame('none')} />;
      default:
        return <GameSelector onSelectGame={setSelectedGame} />;
    }
  };

  return <AppContainer>{renderGame()}</AppContainer>;
}

export default App; 