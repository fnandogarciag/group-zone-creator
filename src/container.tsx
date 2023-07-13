import React from "react";
import useMap from "./useMap";

import CustomMap from "./components/CustomMap";
import CustomMarker from "./components/CustomMarker";
import Colors from "./utils/Colors";

type ContainerProps = {
  mapRef: React.RefObject<HTMLDivElement>;
  changeMap: (apiKey: string) => Promise<void>;
};

function Container({ mapRef, changeMap }: ContainerProps) {
  const {
    apiKey,
    setApiKey,
    handleChangeAPIKEY,
    points,
    handlePointsCSV,
    newPoint,
    handleSetNewPoint,
    handleAddPoint,
    handleDownloadCSV,
    changeGroup,
    groupedPoints,
    handleSelectGroup,
    handleAddToGroup,
    handleClickGroupedPoint,
  } = useMap(changeMap);

  return (
    <div className="container">
      <div className="left">
        <CustomMap ref={mapRef} />
        {points.map((point) => (
          <CustomMarker
            key={point.id}
            marker={point}
            handleClick={changeGroup}
            color={
              point.group === 0
                ? "red"
                : point.group === -1
                ? "green"
                : Colors[point.group]
            }
          />
        ))}
      </div>
      <div className="right">
        <h2>Mapa Crear Grupos</h2>
        <label htmlFor="changeMap">
          <input
            type="text"
            name="changeMap"
            id="changeMap"
            placeholder="APIKEY"
            value={apiKey || ""}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button type="button" onClick={handleChangeAPIKEY}>
            Agregar APIKEY
          </button>
        </label>
        <label htmlFor="addPointsCVS">
          <input
            type="file"
            name="addPointsCVS"
            id="addPointsCVS"
            accept=".csv"
            onChange={handlePointsCSV}
          />
        </label>
        <label>
          <input
            type="text"
            name="addPointName"
            id="addPointName"
            placeholder="New Point Name"
            value={newPoint.name || ""}
            onChange={(e) => handleSetNewPoint(e.target.value, 0)}
          />
          <input
            type="number"
            name="addPointLat"
            id="addPointLat"
            placeholder="New Point Lat"
            value={newPoint.lat || ""}
            onChange={(e) => handleSetNewPoint(e.target.value, 1)}
          />
          <input
            type="number"
            name="addPointLng"
            id="addPointLng"
            placeholder="New Point Lng"
            value={newPoint.lng || ""}
            onChange={(e) => handleSetNewPoint(e.target.value, 2)}
          />
          <button type="button" onClick={handleAddPoint}>
            Agregar Punto
          </button>
        </label>
        <label htmlFor="downloadCSV">
          <button type="button" onClick={handleDownloadCSV}>
            Download CSV
          </button>
        </label>
        <label htmlFor="downloadCSV">
          <select className="selectOption" onChange={handleSelectGroup}>
            <option value="0">All</option>
            {groupedPoints.map(({ group }) => {
              if (group === 0) return null;
              return (
                <option key={group} value={group}>
                  {group === 0 ? "Sin Grupo" : `Grupo ${group}`}
                </option>
              );
            })}
          </select>
          <button type="button" onClick={handleAddToGroup}>
            Agregar al Grupo
          </button>
        </label>
        {groupedPoints.map(({ group, points }) => (
          <div className="group-lists" key={group}>
            <h3>{group === 0 ? "Sin Grupo" : `Grupo ${group}`}</h3>
            <ul>
              {points.map((point) => (
                <li key={point.id}>
                  <span>{point.name}</span>
                  <button onClick={() => handleClickGroupedPoint(point.id)}>
                    Borrar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Container;
