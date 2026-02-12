export async function imageToBinaryGrid(file: File): Promise<number[][]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };

    img.onload = () => {
      const size = 15;

      // Create hidden canvas
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No context");

      // --- Crop to square ---
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide) / 2;
      const sy = (img.height - minSide) / 2;

      ctx.drawImage(
        img,
        sx, sy, minSide, minSide,  // source square
        0, 0, size, size          // scale to 15x15
      );

      // --- 2️⃣ Get pixel data ---
      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;

      const contrast = 1.5; // 1 = normal, >1 increases contrast
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

      const grid: number[][] = [];

      // --- 3️⃣ Process pixels ---
      for (let y = 0; y < size; y++) {
        const row: number[] = [];

        for (let x = 0; x < size; x++) {
          const index = (y * size + x) * 4;

          let r = data[index];
          let g = data[index + 1];
          let b = data[index + 2];

          // --- Convert to grayscale ---
          let gray = 0.299 * r + 0.587 * g + 0.114 * b;

          // --- Increase contrast ---
          gray = factor * (gray - 128) + 128;

          // --- Clamp ---
          gray = Math.max(0, Math.min(255, gray));

          // --- Threshold to B/W ---
          const binary = gray < 128 ? 1 : 0;

          row.push(binary);
        }

        grid.push(row);
      }

      resolve(grid);
    };

    reader.readAsDataURL(file);
  });
}
