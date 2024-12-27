import styled from 'styled-components';

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const GameButton = styled.button`
  padding: 20px 40px;
  font-size: 24px;
  border-radius: 12px;
  border: none;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

interface GameSelectorProps {
  onSelectGame: (game: 'gameXmas' | 'gameBatman') => void;
}

const GameSelector = ({ onSelectGame }: GameSelectorProps) => {
  return (
    <SelectorContainer>
      <h1>Choose Your Game!</h1>
      <GameButton onClick={() => onSelectGame('gameXmas')}>
        Game Xmas
      </GameButton>
      <GameButton onClick={() => onSelectGame('gameBatman')}>
        Game Batman
      </GameButton>
    </SelectorContainer>
  );
};

export default GameSelector;