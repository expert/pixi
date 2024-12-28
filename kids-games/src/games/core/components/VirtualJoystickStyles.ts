import styled from 'styled-components';

export const JoystickContainer = styled.div`
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    touch-action: none;
`;

export const JoystickKnob = styled.div<{ $x: number; $y: number }>`
    position: absolute;
    width: 40px;
    height: 40px;
    // background: rgba(255, 255, 255, 0.5);
    background: red;
    border-radius: 50%;
    transform: translate(${props => props.$x}px, ${props => props.$y}px);
    left: 40px;
    top: 40px;
`;

export const JumpButton = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    touch-action: none;

    &:active {
        background: rgba(255, 255, 255, 0.4);
    }
`;

export const DirectionalButton = styled.div`
    position: fixed;
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    touch-action: none;
    user-select: none;

    &:active {
        background: rgba(255, 255, 255, 0.4);
    }
`;

export const DirectionalButtonsContainer = styled.div`
    position: fixed;
    bottom: 20px;
    left: 20px;
    display: grid;
    grid-template-columns: repeat(3, 50px);
    grid-template-rows: repeat(3, 50px);
    gap: 5px;
`; 