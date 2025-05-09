export function toSnakeCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

export function findBlockEnd(contents: string, startIndex: number): number {
  let openCount = 0;
  let i = startIndex;

  while (i < contents.length) {
    const char = contents[i];

    if (char === "{") {
      openCount++;
    } else if (char === "}") {
      openCount--;
      if (openCount === 0) {
        return i;
      }
    }

    i++;
  }

  return -1; // Not found
}
