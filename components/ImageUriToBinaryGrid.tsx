import * as ImageManipulator from 'expo-image-manipulator';

export async function imageUriToBinaryGrid(uri: string): Promise<number[][]> {
  const size = 15;

  // Resize to 15x15 and get base64
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: size, height: size } }],
    {
      base64: true,
      format: ImageManipulator.SaveFormat.PNG,
    }
  );

  const base64 = result.base64;
  if (!base64) throw new Error("No base64 returned");

  // Create image
  const img = new Image();
  img.src = `data:image/png;base64,${base64}`;

  await new Promise((res) => (img.onload = res));

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No context");

  ctx.filter = "blur(0.8px)"
  ctx.drawImage(img, 0, 0);

  const data = ctx.getImageData(0, 0, size, size).data;

  // Calculate threshold using average grey value
  const greys: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const grey = 0.299*r + 0.587*g + 0.114*b;
      greys.push(grey);
  }

  const threshold = greys.reduce((a, b) => a + b, 0) / greys.length

  // Use threshold to calculate binary grid
  const grid: number[][] = [];

  for (let y = 0; y < size; y++) {
    const row: number[] = [];

    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const grey = 0.299 * r + 0.587 * g + 0.114 * b;

      const binary = grey < threshold ? 1 : 0;

      row.push(binary);
    }

    grid.push(row);
  }

  return grid;
}
