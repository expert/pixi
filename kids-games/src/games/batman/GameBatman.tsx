interface GameBatmanProps {
    onBack: () => void;
}

const GameBatman = ({ onBack }: GameBatmanProps) => {
    return (
        <h1>Batman</h1>
    )
}

export default GameBatman;