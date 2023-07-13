import { useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import "./App.scss";

import GlobalContext from "./utils/GlobalContext";
import Container from "./container";

const mapOptions = {
  center: {
    lat: 4.65,
    lng: -74.11,
  },
  zoom: 12,
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
};

function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapContainer, setMapContainer] = useState<google.maps.Map>(null!);
  const [googleMaps, setGoogleMaps] = useState<typeof google.maps>(null!);

  const startMap = async (apiKey: string): Promise<void> => {
    const loader = new Loader({
      apiKey,
      version: "weekly",
    });
    try {
      const newGoogle = await loader.load();
      setGoogleMaps(newGoogle.maps);
      setMapContainer(
        new newGoogle.maps.Map(mapRef.current as HTMLDivElement, mapOptions)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GlobalContext.Provider value={{ googleMaps, mapContainer }}>
      <Container mapRef={mapRef} changeMap={startMap} />
    </GlobalContext.Provider>
  );
}

export default App;
