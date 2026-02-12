import { View, StyleSheet, Pressable, Text } from "react-native";
import React, { useState } from "react";
import Feather from '@expo/vector-icons/Feather';

import * as colours from '@/constants/colour'

type Props = {
  mode: 'fill' | 'mark';
  reset: number;
};

export default function Nonogram({ mode, reset }: Props) {
  const size = 15;
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<number | null>(null);

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

  React.useEffect(() => {
    setGrid(createEmptyGrid());
  }, [reset])

  return(
    <View style={styles.board}>
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
  filled: {
    backgroundColor: colours.nonogramColour,
  },
})