import { Stage, Container } from '@pixi/react';
import styled from 'styled-components';
import { VirtualJoystick } from './components/VirtualJoystick';
import { useController } from './hooks/useController';
// import { useIsMobile } from './hooks/useIsMobile';

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
  // const isMobile = useIsMobile();
  const { handleInput } = useController();

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
      <VirtualJoystick onInput={handleInput} />
    </GameWrapper>
  );
};

export default GameEngine;