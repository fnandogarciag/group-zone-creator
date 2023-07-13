import { forwardRef } from "react";

const CustomMap = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="map-container" />
));

export default CustomMap;
