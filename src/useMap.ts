import React, { useState, useContext, useEffect } from "react";
import GlobalContext from "./utils/GlobalContext";
import { PointType } from "./utils/Types";

type GroupedPointsType = {
  group: number;
  points: PointType[];
};

function useMap(changeMap: (apiKey: string) => Promise<void>) {
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [points, setPoints] = useState<PointType[]>([]);
  const [groupedPoints, setGroupedPoints] = useState<GroupedPointsType[]>([]);
  const [newPoint, setNewPoint] = useState<PointType>({
    id: 0,
    name: "",
    lat: null!,
    lng: null!,
    group: 0,
  });

  const { googleMaps, mapContainer } = useContext(GlobalContext);

  const checkMap = (): boolean => !googleMaps || !mapContainer;

  const handleChangeAPIKEY = (): void => {
    void changeMap(apiKey);
  };

  const allowedExtensions = ["csv"];
  const handlePointsCSV = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (checkMap() || !e.target.files?.length) return;

    const inputFile = e.target.files[0];
    const fileExtension = inputFile.type.split("/")[1];
    if (!allowedExtensions.includes(fileExtension))
      return alert("Archivo debe ser un CSV");

    const reader = new FileReader();
    reader.readAsText(inputFile);
    reader.onload = function (event: ProgressEvent<FileReader>) {
      const csvdata = event.target?.result as string;

      const newPointsData = csvdata.split("\n").filter((row) => row.length);
      const newPoints = [...points];
      newPointsData.forEach((point) => {
        const pointData = point.split(",");

        newPoints.push({
          id: parseFloat(pointData[0]),
          name: pointData[1],
          lat: parseFloat(pointData[2]),
          lng: parseFloat(pointData[3]),
          group: parseFloat(pointData[4]),
        });
      });
      setPoints(newPoints);
    };
  };

  const handleSetNewPoint = (value: string, key: number) => {
    switch (key) {
      case 0:
        setNewPoint({ ...newPoint, name: value });
        break;
      case 1:
        setNewPoint({ ...newPoint, lat: parseFloat(value) });
        break;
      default:
        setNewPoint({ ...newPoint, lng: parseFloat(value) });
        break;
    }
  };

  const handleAddPoint = (): void => {
    if (checkMap()) return;
    const newPoints = [...points];
    newPoints.push({
      ...newPoint,
      id: newPoints.length ? newPoints[newPoints.length - 1].id + 1 : 1,
    });
    setPoints(newPoints);
    setNewPoint({
      id: 0,
      name: "",
      lat: null!,
      lng: null!,
      group: 0,
    });
  };

  const handleDownloadCSV = (): void => {
    if (checkMap() || !points.length) return;
    const rows = points.map((point, index) => [
      index,
      point.name,
      point.lat,
      point.lng,
      point.group,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const nameFile: string = prompt("File name", "") || "data";
    link.setAttribute("download", nameFile + ".csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const changeGroup = (pointId: number): void => {
    const pointIndex = points.findIndex((point) => point.id === pointId);
    if (pointIndex === -1) return;
    const newPoints = [...points];
    newPoints[pointIndex].group = newPoints[pointIndex].group === 0 ? -1 : 0;
    setPoints(newPoints);
  };

  const handleSelectGroup = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroup(parseInt(e.target.value));
  };

  const handleAddToGroup = (): void => {
    const groups = groupedPoints.map(({ group }) => group);
    let newGroup = 0,
      groupIndex = -1;
    do {
      newGroup++;
      groupIndex = groups.findIndex((group) => group === newGroup);
    } while (groupIndex !== -1);
    const newPoints = points.map((point) => ({
      ...point,
      group:
        point.group !== -1
          ? point.group
          : selectedGroup !== 0
          ? selectedGroup
          : newGroup,
    }));
    setPoints(newPoints);
  };

  const handleClickGroupedPoint = (pointId: number): void => {
    const pointIndex = points.findIndex((point) => point.id === pointId);
    if (pointIndex === -1) return;
    const newPoints = [...points];
    if (
      newPoints[pointIndex].group === 0 ||
      newPoints[pointIndex].group === -1
    ) {
      newPoints.splice(pointIndex, 1);
    } else {
      newPoints[pointIndex].group = 0;
    }
    setPoints(newPoints);
  };

  useEffect(() => {
    const newGroupedPoints = [] as GroupedPointsType[];
    points.forEach((point) => {
      const pointGroup = point.group === -1 ? 0 : point.group;
      let groupIndex = newGroupedPoints.findIndex(
        (group) => group.group === pointGroup
      );
      if (groupIndex === -1) {
        groupIndex = newGroupedPoints.length;
        newGroupedPoints.push({
          group: pointGroup,
          points: [],
        });
      }
      newGroupedPoints[groupIndex].points.push(point);
    });
    newGroupedPoints.sort((a, b) => a.group - b.group);
    setGroupedPoints(newGroupedPoints);
  }, [points]);

  return {
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
  };
}

export default useMap;
