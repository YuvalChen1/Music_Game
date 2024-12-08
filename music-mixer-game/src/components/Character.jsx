import styled, { keyframes } from "styled-components";

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const blink = keyframes`
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
`;

const sing = keyframes`
  0%, 100% { 
    transform: scaleX(1) translateX(0); 
  }
  50% { 
    transform: scaleX(1.2) translateX(0);
  }
`;

const CharacterWrapper = styled.div`
  width: 120px;
  height: 160px;
  margin: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${(props) => (props.$isPlaying ? bounce : "none")} 2s ease-in-out
    infinite;
`;

const CharacterBody = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Head = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${(props) => getCharacterColor(props.$instrumentType)};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Eyes = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  position: relative;
  top: -5px;
`;

const Eye = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  position: relative;
  animation: ${blink} 4s infinite;

  &::after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: black;
    top: 5px;
    left: 5px;
  }
`;

const Mouth = styled.div`
  width: ${(props) => (props.$isPlaying ? "20px" : "30px")};
  height: ${(props) => (props.$isPlaying ? "25px" : "10px")};
  background-color: ${(props) => (props.$isPlaying ? "black" : "#666")};
  border-radius: ${(props) => (props.$isPlaying ? "10px" : "5px")};
  position: absolute;
  right: 10px;
  bottom: 15px;
  transform-origin: center right;
  animation: ${(props) => (props.$isPlaying ? sing : "none")} 0.5s infinite;
`;

const Accessory = styled.div`
  position: absolute;
  ${(props) => getAccessoryStyle(props.$instrumentType)}
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

// Helper function to get character color based on instrument
const getCharacterColor = (instrumentType) => {
  switch (instrumentType) {
    case "DRUM":
      return "#ff7043";
    case "PIANO":
      return "#4fc3f7";
    case "SYNTH":
      return "#aed581";
    case "TRUMPET":
      return "#ffd54f";
    default:
      return "#b0bec5";
  }
};

// Helper function to get accessory style based on instrument
const getAccessoryStyle = (instrumentType) => {
  switch (instrumentType) {
    case "DRUM":
      return `
        width: 70px;
        height: 15px;
        background: #d32f2f;
        border-radius: 15px;
        top: -20px;
      `;
    case "PIANO":
      return `
        width: 40px;
        height: 20px;
        background: #1976d2;
        border-radius: 5px;
        top: -25px;
        transform: rotate(-10deg);
      `;
    case "SYNTH":
      return `
        width: 50px;
        height: 20px;
        background: #388e3c;
        border-radius: 10px;
        top: -15px;
        &::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          background: #81c784;
          border-radius: 50%;
          right: 5px;
          top: 5px;
        }
      `;
    case "TRUMPET":
      return `
        width: 30px;
        height: 30px;
        border: 5px solid #f57f17;
        border-radius: 50%;
        top: -25px;
      `;
    default:
      return "";
  }
};

function Character({ id, isPlaying, onRemove, instrumentType }) {
  return (
    <CharacterWrapper $isPlaying={isPlaying}>
      {isPlaying && (
        <RemoveButton $show={true} onClick={onRemove}>
          ×
        </RemoveButton>
      )}
      <CharacterBody>
        <Head $instrumentType={instrumentType}>
          <Accessory $instrumentType={instrumentType} />
          <Eyes>
            <Eye />
            <Eye />
          </Eyes>
          <Mouth $isPlaying={isPlaying} />
        </Head>
      </CharacterBody>
    </CharacterWrapper>
  );
}

export default Character;
