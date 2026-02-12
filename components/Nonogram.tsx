import { View, StyleSheet, Pressable } from "react-native";
import { useState } from "react";

export default function Nonogram() {
  const size = 15;

  const createEmptyGrid = () =>
    Array.from({ length: size }, () =>
      Array.from({ length: size }, () => 0)
    );

  const [grid, setGrid] = useState<number[][]>(createEmptyGrid());

  const setCell = (row: number, col: number) => {
    setGrid(prev => {
      console.log(row, col)
      const newGrid = prev.map(r => [...r]);
      newGrid[row][col] = (newGrid[row][col] + 1) % 2;
      return newGrid;
    });
  };

  return(
    <View style={styles.board}>
      {grid.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((cell, c ) => (
              <Pressable 
                key={c}
                style={[styles.cell, cell === 1 && styles.filled,
                ]}
                onPress={() => setCell(r, c)}
                ></Pressable>
            ))}
          </View>
      ))}
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
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  filled: {
    backgroundColor: '#000',
  },
})