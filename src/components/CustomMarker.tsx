import { useEffect, useState, useContext } from "react";
import { PointType } from "../utils/Types";
import GlobalContext from "../utils/GlobalContext";

type CustomMarkerTypes = {
  marker: PointType;
  handleClick: (pointId: number) => void;
  color?: string;
};

const CustomMarker = ({
  marker,
  handleClick,
  color = "red",
}: CustomMarkerTypes) => {
  const [markerElement, setMarkerElement] = useState<google.maps.Marker>(null!);

  const { googleMaps, mapContainer } = useContext(GlobalContext);

  useEffect(() => {
    if (!mapContainer) return;
    const markerOptions = {
      position: {
        lat: marker.lat,
        lng: marker.lng,
      },
      title: marker.name,
      icon: {
        path: googleMaps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 9 + `${marker.id}:${marker.group}`.length * 3,
      },
      label: `${marker.id}:${marker.group}`,
    } as google.maps.MarkerOptions;

    const newMarkerElement = new googleMaps.Marker(markerOptions);

    newMarkerElement.addListener("click", () => {
      handleClick(marker.id);
    });
    setMarkerElement(newMarkerElement);
  }, [color, googleMaps, handleClick, mapContainer, marker]);

  useEffect(() => {
    if (!markerElement) return;
    markerElement.setMap(mapContainer);
    return () => {
      markerElement.setMap(null);
    };
  }, [mapContainer, markerElement]);

  return null;
};

export default CustomMarker;
