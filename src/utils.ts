const componentToHex = (color: number): string => {
  const hex = color.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};

export const imageDataConverter = (): ((imageData: ImageData) => string) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  return (imageData: ImageData) => {
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
  };
};

export const rgbToHex = (r: number, g: number, b: number): string =>
    '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);