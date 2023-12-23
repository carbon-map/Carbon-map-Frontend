export function CalCenter(pointSet){
  
  let lx = 1e9, ly = 1e9, rx = 0, ry = 0;
  
  for(let i = 0; i < pointSet.length; i++){
    lx = Math.min(pointSet[i][0], lx);
    ly = Math.min(pointSet[i][1], ly);
    rx = Math.max(pointSet[i][2], rx);
    ry = Math.max(pointSet[i][3], ry);
  }

  return { x: (lx + rx) / 2, y: (ly +  ry) / 2};
}

export function GetCenterPoint() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  return { x: centerX, y: centerY };
}