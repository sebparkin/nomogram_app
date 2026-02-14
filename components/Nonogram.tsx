import { View, StyleSheet, Pressable, Text } from "react-native";
import React, { useState } from "react";
import Feather from '@expo/vector-icons/Feather';

import { getColumnClues, getRowClues } from '@/scripts/getClues';
import { imageUriToBinaryGrid } from "@/scripts/ImageUriToBinaryGrid";
import * as colours from '@/constants/colour'

type Props = {
  mode: 'fill' | 'mark';
  reset: number;
  uri: string;
  showGame: boolean;
};

export default function Nonogram({ mode, reset, uri, showGame }: Props) {
  const size = 15;
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<number | null>(null);
  const [rowClues, setRowClues] = useState<number[][]>([[]]);
  const [colClues, setColClues] = useState<number[][]>([[]]);
  

  const createEmptyGrid = () =>
    Array.from({ length: size }, () =>
      Array.from({ length: size }, () => 0)
    );

  const [grid, setGrid] = useState<number[][]>(createEmptyGrid());

  const startDrag = (row: number, col: number) => {
    const current = grid[row][col];

    let nextValue;
    nextValue = 0;
    if (current != 0) nextValue = 0;
    else if (mode == 'fill') nextValue = 1;// fill
    else if (mode == 'mark') nextValue = 2;                // erase

    setDragValue(nextValue);
    setIsDragging(true);

    setCell(row, col, nextValue);
  };

  const setCell = (row: number, col: number, value: number) => {
    setGrid(prev => {
      //console.log(row, col, mode)
      const newGrid = prev.map(r => [...r]);

      newGrid[row][col] = value;

      return newGrid;
    });
  };

  const enterCell = (row: number, col: number) => {
    if (!isDragging || dragValue == null) return;
    setCell(row, col, dragValue)
  };

  const stopDrag = () => {
    setIsDragging(false);
    setDragValue(null);
  };

  const setClues = (binaryGrid: number[][]) => {
    setRowClues(getRowClues(binaryGrid))
    setColClues(getColumnClues(binaryGrid))
  };

  React.useEffect(() => {
    setGrid(createEmptyGrid());
  }, [reset])

  React.useEffect(() => {
    const getClues = async() => {
      let binaryGrid = await imageUriToBinaryGrid(uri);
      setClues(binaryGrid)
    };
    getClues()
  }, [showGame])

  const maxRowClues = Math.max(...rowClues.map(c => c.length));
  const maxColClues = Math.max(...colClues.map(c => c.length));

  function padClues(clues: number[], max: number) {
    return Array(max - clues.length).fill("").concat(clues);
  }

  function padAllClues(rowClues: number[][], colClues: number[][], maxRowClues: number, maxColClues: number) {

    for (let i = 0; i < colClues.length; i++) {
      colClues[i] = padClues(colClues[i], maxColClues)
    }

    for (let i = 0; i < rowClues.length; i++) {
      rowClues[i] = padClues(rowClues[i], maxRowClues)
    }

  }; padAllClues(rowClues, colClues, maxRowClues, maxColClues)

  console.log(colClues)
  

  return(
    <View style={{flexDirection: 'row'}}>
       <View>
        {Array.from({ length: maxColClues }).map((_, i) => (
          <Text key={i} style={styles.padClue}>{""}</Text>
        ))}
        {rowClues.map((clue: number[], i: number) => (
          <View style={styles.clue}>
            <Text key={i} style={styles.clueText}>{clue.join(" ")}</Text>
          </View>
        ))}
      </View>
      <View style={styles.board}>
        <View style={{ flexDirection: "row" }}>
          {colClues.map((clue, i) => (
            <View key={i}>
              {clue.map((n, j) => (
                <View style={styles.clue}>
                  <Text key={j} style={styles.clueText}>{n}</Text>
                </View>
              ))}
            </View>
          ))} 
        </View>
        {grid.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((cell, c ) => (
                <Pressable 
                  key={c}
                  style={[styles.cell, cell === 1 && styles.filled,
                  ]}
                  onPressIn={() => startDrag(r, c)}
                  onHoverIn={() => enterCell(r, c)}
                  onPressOut={stopDrag}
                  >
                    {cell === 2 && <Feather name="x" size={24} color={colours.nonogramColour} /> }
                  </Pressable>
              ))}
            </View>
        ))}
      <View
      onTouchEnd={stopDrag}
      ></View>
      </View>
    </View>
  );
}

const cell_size = 22;
const styles = StyleSheet.create({
  board: {
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: cell_size,
    height: cell_size,
    borderWidth: 1,
    borderColor: colours.nonogramColour,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  clue: {
    width: cell_size, 
    height: cell_size,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clueText: {
    color: colours.nonogramColour,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
  padClue: {
    width: cell_size, 
    height: cell_size,
  },
  filled: {
    backgroundColor: colours.nonogramColour,
  },
})