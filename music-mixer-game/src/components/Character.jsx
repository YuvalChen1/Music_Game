import styled from "styled-components";

const CharacterWrapper = styled.div`
  width: 120px;
  height: 160px;
  margin: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const CharacterBody = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: ${(props) => (props.$isPlaying ? "#e3f2fd" : "#fff")};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Head = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffb74d;
  position: relative;
  margin-bottom: 10px;
`;

const Body = styled.div`
  width: 60px;
  height: 70px;
  background-color: ${(props) => getBodyColor(props.$instrumentType)};
  border-radius: 8px;
  position: relative;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ff5252;
  color: white;
  border: none;
  cursor: pointer;
  display: ${(props) => (props.$show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  font-size: 16px;
  z-index: 1;

  &:hover {
    background-color: #ff1744;
  }
`;

// Helper function to get body color based on instrument
const getBodyColor = (instrumentType) => {
  switch (instrumentType) {
    case "DRUM":
      return "#e57373"; // Red
    case "PIANO":
      return "#64b5f6"; // Blue
    case "SYNTH":
      return "#81c784"; // Green
    case "TRUMPET":
      return "#ffd54f"; // Yellow
    default:
      return "#90a4ae"; // Default gray
  }
};

function Character({ id, isPlaying, onRemove, instrumentType, children }) {
  return (
    <CharacterWrapper>
      <CharacterBody $isPlaying={isPlaying}>
        {isPlaying && (
          <RemoveButton $show={true} onClick={onRemove}>
            ×
          </RemoveButton>
        )}
        <Head />
        <Body $instrumentType={instrumentType} />
      </CharacterBody>
    </CharacterWrapper>
  );
}

export default Character;
