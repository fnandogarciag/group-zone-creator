import { createContext } from "react";

export type GlobalContextType = {
  googleMaps: typeof google.maps;
  mapContainer: google.maps.Map;
};

const GlobalContext = createContext<GlobalContextType>(null!);

export default GlobalContext;
