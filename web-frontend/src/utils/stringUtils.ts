function capitaliseFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function splitString(str: string, splitStr: string): string[] {
  return str.split(splitStr);
}

function splitStringAndCapitaliseFirstLetter(
  str: string,
  splitStr: string,
  joinStr: string,
): string {
  return splitString(str, splitStr)
    .map((s) => capitaliseFirstLetter(s.toLowerCase()))
    .join(joinStr);
}

export {
  capitaliseFirstLetter,
  splitString,
  splitStringAndCapitaliseFirstLetter,
};
