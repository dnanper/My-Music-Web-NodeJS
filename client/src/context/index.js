import { createContext, useContext, useState } from "react";

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <MusicContext.Provider
      value={{
        tracks,
        setTracks,
        currentTrack,
        setCurrentTrack,
        currentIndex,
        setCurrentIndex,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  return useContext(MusicContext);
}
