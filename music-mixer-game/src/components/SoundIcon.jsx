import styled from "styled-components";

// SVG icons for instruments
const ICONS = {
  DRUM: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  ),
  PIANO: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14h-2v-3h-2v3H8v-3H6v3H4v-5h16v5z" />
    </svg>
  ),
  SYNTH: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M7 4v16h10V4H7zm5 15c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3-3H9v-2h6v2zm0-3H9V8h6v5z" />
    </svg>
  ),
  TRUMPET: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M19 7h-1V6h-2v1h-1c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" />
      <path d="M4 7v2h1v11h2V9h1V7H4z" />
    </svg>
  ),
};

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.$isInUse ? "#ccc" : "#fff")};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: ${(props) => (props.$isInUse ? "not-allowed" : "grab")};
  opacity: ${(props) => (props.$isInUse ? 0.5 : 1)};
  transition: all 0.2s ease;

  &:hover {
    transform: ${(props) => (props.$isInUse ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.$isInUse
        ? "0 2px 4px rgba(0,0,0,0.1)"
        : "0 4px 8px rgba(0,0,0,0.2)"};
  }

  svg {
    width: 32px;
    height: 32px;
    color: #333;
  }
`;

function SoundIcon({ icon, isInUse }) {
  return <IconWrapper $isInUse={isInUse}>{ICONS[icon]}</IconWrapper>;
}

export default SoundIcon;
