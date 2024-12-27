import { Stage, Container } from '@pixi/react';
import styled from 'styled-components';

const GameWrapper = styled.div`
  width: 800px;
  height: 600px;
  position: relative;
`;

interface GameEngineProps {
  children: React.ReactNode;
  onBack: () => void;
}

const GameEngine = ({ children, onBack }: GameEngineProps) => {
  return (
    <GameWrapper>
      <Stage
        width={800}
        height={600}
        options={{ backgroundColor: 0x1099bb }}
      >
        <Container>{children}</Container>
      </Stage>
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
        }}
      >
        Back to Menu
      </button>
    </GameWrapper>
  );
};

export default GameEngine;