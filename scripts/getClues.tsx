function getClues(line: number[]): number[] {
  const clues: number[] = [];

  let count = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === 1) {
      count++;
    } else {
      if (count > 0) {
        clues.push(count);
        count = 0;
      }
    }
  }
  // push final count if row ends in 1
  if (count > 0) clues.push(count);

  // return clues if it has values, otherwise 0
  return clues.length ? clues : [0];
}

export function getRowClues(grid: number[][]): number[][] {
  return grid.map(row => getClues(row));
}

export function getColumnClues(grid: number[][]): number[][] {
  const size = grid.length;
  const clues: number[][] = [];

  for (let col = 0; col < size; col++) {
    const column: number[] = [];

    for (let row = 0; row < size; row++) {
      column.push(grid[row][col]);
    }

    clues.push(getClues(column));
  }

  return clues;
}


