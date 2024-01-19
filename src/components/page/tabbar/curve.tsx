import * as d3Shape from "d3-shape";
import { scale } from "react-native-size-scaling";

interface LineDatum {
  x: number;
  y: number;
  missing?: boolean;
}

//** Path Line */
const line = (width : number, height: number) => {
  const path: any = d3Shape
  .line<LineDatum>()
  .x((d) => d.x)
  .y((d) => d.y)([
    { x: width / 2, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height},
    { x: 0, y: 0 },
    { x: width / 2, y: 0 },
  ]);
  
return path;
};

//** Path Curved*/
const lineCurvedDown = (iPosition: number, height: number, circle: number) => {
  const position = iPosition;
  const circleWidth = circle + position;
  const trim = (position + circleWidth) / 2;
  
  const curved: any = d3Shape
    .line<LineDatum>()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(d3Shape.curveBasis)([
      { x: position - scale(20), y: 0 }, // border center left
      { x: position - scale(10), y: scale(2) },
      { x: position - scale(2), y: scale(10) },
      { x: position, y: scale(17) },
  
      { x: trim - scale(25), y: height / 2 + scale(2) },
      { x: trim - scale(10), y: height / 2 + scale(10) },
      { x: trim, y: height / 2 + scale(10) },
      { x: trim + scale(10), y: height / 2 + scale(10) },
      { x: trim + scale(25), y: height / 2 + scale(2) },
  
      { x: circleWidth, y: scale(17) }, // border center right
      { x: circleWidth + scale(2), y: scale(10) },
      { x: circleWidth + scale(10), y: 0 },
      { x: circleWidth + scale(20), y: 0 },
    ]);
  return curved;
};

export const getPathDown = (width: number, iHeight: number, centerWidth: number, clippedTabbarHeight: number) => {
  const height = scale(iHeight);
  const circleWidth = scale(centerWidth) + scale(16);
  return `${line(width, clippedTabbarHeight)} ${lineCurvedDown(
    width / 2 - circleWidth / 2,
    height,
    circleWidth
  )}`;
};
