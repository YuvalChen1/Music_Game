import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import styled from "styled-components";
import Character from "./components/Character";
import SoundIcon from "./components/SoundIcon";

import drumSound from "./assets/sounds/drum_3.wav"; // adjust path to your actual sound file
import pianoSound from "./assets/sounds/piano_1.wav";
import synthSound from "./assets/sounds/synth_1.wav";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const CharactersArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 20px;
`;

const SoundTray = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background-color: #e0e0e0;
`;

const RhythmControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 10px;
`;

const BeatIndicator = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Beat = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => (props.$active ? "#4CAF50" : "#e0e0e0")};
  transition: background-color 0.1s ease;
`;

function App() {
  const [characters, setCharacters] = useState([
    { id: "char1", sound: null },
    { id: "char2", sound: null },
    { id: "char3", sound: null },
    { id: "char4", sound: null },
    { id: "char5", sound: null },
    { id: "char6", sound: null },
    { id: "char7", sound: null },
  ]);

  const isSoundInUse = (soundId) => {
    return characters.some((char) => char.sound === soundId);
  };

  const [audioContext] = useState(
    () => new (window.AudioContext || window.webkitAudioContext)()
  );
  const [audioSources, setAudioSources] = useState({});

  const [sounds] = useState([
    { id: "sound1", icon: "DRUM", audioUrl: drumSound },
    { id: "sound2", icon: "PIANO", audioUrl: pianoSound },
    { id: "sound3", icon: "SYNTH", audioUrl: synthSound },
    { id: "sound4", icon: "TRUMPET" },
  ]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const LOOP_DURATION = 8000; // 8 seconds in milliseconds
  const BEATS_PER_BAR = 8; // 8 beats for visual feedback
  const [rhythmInterval, setRhythmInterval] = useState(null);

  const startRhythm = () => {
    if (isPlaying) return;

    const beatDuration = LOOP_DURATION / BEATS_PER_BAR; // Each beat is 1 second

    const interval = setInterval(() => {
      setCurrentBeat((prev) => (prev + 1) % BEATS_PER_BAR);
    }, beatDuration);

    setRhythmInterval(interval);
    setIsPlaying(true);
    audioContext.resume();
  };

  const stopRhythm = () => {
    if (rhythmInterval) {
      clearInterval(rhythmInterval);
    }
    setRhythmInterval(null);
    setIsPlaying(false);
    setCurrentBeat(0);

    // Stop all sounds immediately
    Object.entries(audioSources).forEach(([soundId, source]) => {
      try {
        source.stop(0);
        source.disconnect();
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
    });
    setAudioSources({});
  };

  const playSound = async (soundId) => {
    const sound = sounds.find((s) => s.id === soundId);
    if (!sound) return;

    try {
      // Ensure any existing instance is fully stopped before creating a new one
      if (audioSources[soundId]) {
        const existingSource = audioSources[soundId];
        existingSource.stop(0);
        existingSource.disconnect();
        setAudioSources((prev) => {
          const newSources = { ...prev };
          delete newSources[soundId];
          return newSources;
        });
      }

      const response = await fetch(sound.audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 1.0; // Ensure consistent volume

      source.buffer = audioBuffer;
      source.loop = true;

      // Specific handling for drum sound
      if (sound.id === "sound1") {
        const loopStart = 0.5;
        const loopEnd = 8.5;
        source.loopStart = loopStart;
        source.loopEnd = loopEnd;
      }

      // Specific handling for synth sound - only trim the end
      if (sound.id === "sound3") {
        const loopStart = -0.2;
        const loopEnd = 7.8;
        source.loopStart = loopStart;
        source.loopEnd = loopEnd;
      }

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Store both source and gain node for proper cleanup
      const audioNodes = {
        source,
        gainNode,
      };

      // Updated timing logic
      if (isPlaying) {
        const loopDurationSeconds = LOOP_DURATION / 1000;
        const currentTime = audioContext.currentTime;
        const currentLoopPosition =
          (currentBeat / BEATS_PER_BAR) * loopDurationSeconds;
        const timeUntilNextLoop =
          loopDurationSeconds - currentLoopPosition - 0.4;

        source.start(currentTime + timeUntilNextLoop);
      } else {
        source.start(0);
      }

      setAudioSources((prev) => ({
        ...prev,
        [soundId]: audioNodes,
      }));
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const stopSound = (soundId) => {
    if (audioSources[soundId]) {
      try {
        const nodes = audioSources[soundId];
        nodes.source.stop(0);
        nodes.source.disconnect();
        nodes.gainNode.disconnect();

        // Immediately remove from state
        setAudioSources((prev) => {
          const newSources = { ...prev };
          delete newSources[soundId];
          return newSources;
        });
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
    }
  };

  // Effect to start/stop rhythm based on whether any sounds are playing
  useEffect(() => {
    const hasAnySounds = characters.some((char) => char.sound !== null);

    if (hasAnySounds && !isPlaying) {
      startRhythm();
    } else if (!hasAnySounds && isPlaying) {
      stopRhythm();
    }
  }, [characters]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (destination.droppableId.startsWith("character")) {
      const characterIndex = parseInt(
        destination.droppableId.replace("character", "")
      );
      const soundId = result.draggableId;

      setCharacters((prevChars) => {
        const newChars = [...prevChars];
        // Stop previous sound if exists
        if (newChars[characterIndex].sound) {
          stopSound(newChars[characterIndex].sound);
        }
        newChars[characterIndex] = {
          ...newChars[characterIndex],
          sound: soundId,
        };
        // Play new sound
        playSound(soundId);
        return newChars;
      });
    }
  };

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      if (rhythmInterval) {
        clearInterval(rhythmInterval);
      }
    };
  }, []);

  const removeSound = (characterIndex) => {
    setCharacters((prevChars) => {
      const newChars = [...prevChars];
      const soundId = newChars[characterIndex].sound;
      if (soundId) {
        // Force immediate stop and cleanup
        if (audioSources[soundId]) {
          const nodes = audioSources[soundId];
          try {
            nodes.source.stop(0);
            nodes.source.disconnect();
            nodes.gainNode.disconnect();
          } catch (error) {
            console.error("Error stopping sound:", error);
          }
        }

        // Clean up audio sources
        setAudioSources((prev) => {
          const newSources = { ...prev };
          delete newSources[soundId];
          return newSources;
        });

        newChars[characterIndex].sound = null;
      }
      return newChars;
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <GameContainer>
        {isPlaying && (
          <RhythmControls>
            <BeatIndicator>
              {Array.from({ length: BEATS_PER_BAR }).map((_, index) => (
                <Beat
                  key={index}
                  $active={currentBeat === index}
                  title={`Beat ${index + 1}`}
                />
              ))}
            </BeatIndicator>
          </RhythmControls>
        )}
        <CharactersArea>
          {characters.map((character, index) => (
            <Droppable key={character.id} droppableId={`character${index}`}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <Character
                    id={character.id}
                    isPlaying={!!character.sound}
                    onRemove={() => removeSound(index)}
                    instrumentType={
                      character.sound
                        ? sounds.find((s) => s.id === character.sound)?.icon
                        : null
                    }
                  >
                    {index + 1}
                  </Character>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </CharactersArea>

        <Droppable droppableId="sounds" direction="horizontal">
          {(provided) => (
            <SoundTray ref={provided.innerRef} {...provided.droppableProps}>
              {sounds.map((sound, index) => {
                const isInUse = isSoundInUse(sound.id);
                return (
                  <Draggable
                    key={sound.id}
                    draggableId={sound.id}
                    index={index}
                    isDragDisabled={isInUse}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <SoundIcon icon={sound.icon} isInUse={isInUse} />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </SoundTray>
          )}
        </Droppable>
      </GameContainer>
    </DragDropContext>
  );
}

export default App;
