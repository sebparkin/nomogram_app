import { View, StyleSheet, Pressable, Text, SectionList } from "react-native";
import React, { useState, useMemo } from "react";
import Feather from '@expo/vector-icons/Feather';

import { getColumnClues, getRowClues } from '@/scripts/getClues';
import { imageUriToBinaryGrid } from "@/scripts/ImageUriToBinaryGrid";
import * as colours from '@/constants/colour'

type Props = {
  mode: 'fill' | 'mark';
  reset: number;
  uri: string;
  showGame: boolean;
  setGameComplete: (mode: boolean) => void;
  maxRowClues: number;
  maxColClues: number;
  setMaxRowClues: (mode: number) => void;
  setMaxColClues: (mode: number) => void;
};

export default function Nonogram({ mode, reset, uri, showGame, setGameComplete, maxRowClues, maxColClues, setMaxRowClues, setMaxColClues }: Props) {
  const size = 15;
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<number | null>(null);
  const [rowClues, setRowClues] = useState<number[][]>([[]]);
  const [colClues, setColClues] = useState<number[][]>([[]]);
  const [rowPaddedClues, setRowPaddedClues] = useState<number[][]>([[]]);
  const [colPaddedClues, setColPaddedClues] = useState<number[][]>([[]]);
  const [binaryGrid, setBinaryGrid] = useState<number[][]>([[]]);
  const [loading, setLoading] = useState<boolean>(true);

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
    else if (mode == 'mark') nextValue = 2;// erase

    setDragValue(nextValue);
    setIsDragging(true);

    setCell(row, col, nextValue);
  };

  const setCell = (row: number, col: number, value: number) => {
    setGrid(prev => {
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
    setRowClues(getRowClues(binaryGrid));
    setColClues(getColumnClues(binaryGrid));
    setRowPaddedClues(rowClues.map(clue => [...clue]));
    setColPaddedClues(colClues.map(clue => [...clue]));
  };

  React.useEffect(() => {
    setGrid(createEmptyGrid());
  }, [reset])

  React.useEffect(() => {
    const getClues = async() => {
      setLoading(true);
      const loadGrid = await imageUriToBinaryGrid(uri);
      setBinaryGrid(loadGrid)
      //setClues(loadGrid)
      const rowClues = getRowClues(loadGrid);
      const colClues = getColumnClues(loadGrid);
      setRowClues(rowClues);
      setColClues(colClues);
      const rowPaddedClues = rowClues.map(clue => [...clue]);
      const colPaddedClues = colClues.map(clue => [...clue]);
      setRowPaddedClues(rowPaddedClues);
      setColPaddedClues(colPaddedClues);
      const maxRowCluesNum = Math.max(...rowClues.map(c => c.length));
      const maxColCluesNum = Math.max(...colClues.map(c => c.length));
      setMaxRowClues(maxRowCluesNum);
      setMaxColClues(maxColCluesNum);
      padAllClues(rowClues, rowPaddedClues, colPaddedClues, maxRowCluesNum, maxColCluesNum)
      setLoading(false);
    };
    getClues();
  }, [showGame])

  const rowCompleted = useMemo(() => {
    return rowClues.map((target, i) => 
      JSON.stringify(getRowClues(grid)[i]) == JSON.stringify(target)
    );
  }, [grid, rowClues]);

  const colCompleted = useMemo(() => {
    return colClues.map((target, i) => 
      JSON.stringify(getColumnClues(grid)[i]) == JSON.stringify(target)
    );
  }, [grid, colClues]);
  
  const gameComplete = useMemo(() => {
    let rowComplete = rowCompleted.every(Boolean);
    let colComplete = colCompleted.every(Boolean);

    console.log(rowComplete, colComplete);
    if (rowComplete && colComplete) {
      setGameComplete(true);
    } else setGameComplete(false);
  }, [grid]);

  function padClues(clues: number[], max: number) {
    const padding = max - clues.length;
    if (padding <= 0) {
      return clues;  
    } else return Array(padding).fill('').concat(clues);
  }

  function padAllClues(
    rowClues: number[][],
    rowPaddedClues: number[][], colPaddedClues: number[][],
    maxRowClues: number, maxColClues: number) {

    for (let i = 0; i < colPaddedClues.length; i++) {
      colPaddedClues[i] = padClues(colPaddedClues[i], maxColClues)
    }

    let padLength = (rowClues.length - rowPaddedClues.length) + maxColClues
    for (let i = 0; i < padLength; i++) {
      rowPaddedClues.unshift([])
    }

    for (let i = 0; i < rowPaddedClues.length; i++) {
      rowPaddedClues[i] = padClues(rowPaddedClues[i], maxRowClues)
    } 
    console.log(colPaddedClues)

  }; //padAllClues(rowClues, rowPaddedClues, colPaddedClues, maxRowClues, maxColClues)


  return(
    <View style={{flexDirection: 'row'}}>
      <View>
        {/* {Array.from({ length: maxColClues }).map((_, i) => (
          <Text key={i} style={styles.padClue}>{""}</Text>
        ))} */}
        {rowPaddedClues.map((clue: number[], i: number) => (
          <View key={i} style={[styles.rowClue, rowCompleted[i-maxColClues] && styles.completedClue, {width: (cell_size * maxRowClues)/1.5}]}>
            <Text style={[styles.clueText, rowCompleted[i-maxColClues] && styles.completedClueText]}>{clue.join(" ")}</Text>
          </View>
        ))}
      </View>
      <View style={styles.board}>
        <View style={{ flexDirection: "row" }}>
          {colPaddedClues.map((clue, i) => (
            <View key={i}>
              {clue.map((n, j) => (
                <View style={[styles.colClue, colCompleted[i] && styles.completedClue]}>
                  <Text key={j} style={[styles.clueText, colCompleted[i] && styles.completedClueText]}>{n}</Text>
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
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  rowClue: {
    width: cell_size, 
    height: cell_size,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row', 
    paddingRight: 5,
  },
  colClue: {
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
  completedClue: {
    backgroundColor: '#bbb'
  },
  completedClueText: {
    backgroundColor: '#bbb',
    color: '#666',
  },
  padClue: {
    width: cell_size, 
    height: cell_size,
  },
  filled: {
    backgroundColor: colours.nonogramColour,
  },
})