function calculateColour(min: number, max: number, val: number) {
  const minHue = 240;
  const maxHue = 0;
  var curPercent = (val - min) / (max - min);
  var colString =
    'hsl(' + (curPercent * (maxHue - minHue) + minHue) + ',100%,50%)';
  return colString;
}

export default calculateColour;
