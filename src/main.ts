import { rgbToHex, imageDataConverter } from './utils';
import './styles.css';

type SvgInHtml = HTMLElement & SVGElement;

const onDomContentLoaded = () => {
  const imageDataToImage = imageDataConverter();
  let isColorPickerActivated = false;

  const header = document.getElementById('header') as HTMLHeadingElement;
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const magnifierSvg = document.getElementById('magnifier-svg') as SvgInHtml;

  const hexEl = header.querySelector('span.hex-el') as HTMLSpanElement;
  const magnifierRing = magnifierSvg.querySelector('path') as SVGPathElement;
  const magnifierSvgHex = magnifierSvg.querySelector('text') as SVGTextElement;
  const magnifierSvgImg = magnifierSvg.querySelector('image') as SVGImageElement;
  const magnifierSvgSquare = magnifierSvg.querySelector('rect') as SVGRectElement;
  const colorPickerBtn = header.querySelector('button.color-picker-btn') as HTMLButtonElement;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const magnifierSvgDimensions = magnifierSvg.getBoundingClientRect();
  const headerDimensions = header.getBoundingClientRect();
  const magnifierSvgHexDimensions = magnifierSvgHex.getBoundingClientRect();

  const magnification = 4;
  const magnifierWidth = magnifierSvgDimensions.width;
  const magnifierHeight = magnifierSvgDimensions.height;
  const magnifierSvgHexWidth = magnifierSvgHexDimensions.width;
  const magnifierSvgHexHeight = magnifierSvgHexDimensions.height;
  const croppedWidth = magnifierWidth / magnification;
  const croppedHeight = magnifierHeight / magnification;

  const image = new Image();
  image.src = 'palms.jpg';

  magnifierSvgImg.setAttribute('width', `${magnifierWidth}px`);
  magnifierSvgImg.setAttribute('height', `${magnifierHeight}px`);
  magnifierSvgSquare.setAttribute('width', magnification.toString());
  magnifierSvgSquare.setAttribute('height', magnification.toString());
  magnifierSvgSquare.setAttribute('x', (magnifierWidth / 2 - magnification / 2).toString());
  magnifierSvgSquare.setAttribute('y', (magnifierHeight / 2 - magnification / 2).toString());
  magnifierSvgHex.setAttribute('x', (magnifierWidth / 2 - magnifierSvgHexWidth / 2).toString());
  magnifierSvgHex.setAttribute(
      'y',
      (magnifierHeight / 2 + (magnifierSvgHexHeight + magnifierSvgHexHeight / 2)).toString()
  );

  const onColorPickerClick = () => {
    isColorPickerActivated = !isColorPickerActivated;

    if (isColorPickerActivated) {
      colorPickerBtn.classList.add('color-picker-activated');
    } else {
      colorPickerBtn.classList.remove('color-picker-activated');
    }
  };

  const onMouseClick = () => {
    if (isColorPickerActivated) {
      navigator.clipboard.writeText(magnifierSvgHex.textContent || '');
    }
  };

  const onMouseEnter = () => {
    if (!isColorPickerActivated) return;

    canvas.style.cursor = 'none';
    hexEl.style.visibility = 'unset';
    magnifierSvg.style.visibility = 'unset';
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isColorPickerActivated) return;
    const { offsetX, offsetY } = e;

    requestAnimationFrame(() => {
      const imageData = ctx!.getImageData(
          offsetX - croppedWidth / 2,
          offsetY - croppedHeight / 2,
          croppedWidth,
          croppedHeight
      );
      const pixelData = ctx!.getImageData(offsetX, offsetY, 1, 1).data;
      const magnifierImageUrl = imageDataToImage(imageData);
      const color = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
      const magnifierSvgTop = `${offsetY - magnifierSvgDimensions.height / 2}px`;
      const magnifierSvgLeft = `${offsetX - magnifierSvgDimensions.width / 2}px`;

      magnifierSvgImg.setAttributeNS(
          'http://www.w3.org/1999/xlink',
          'xlink:href',
          magnifierImageUrl
      );

      magnifierSvg.style.top = magnifierSvgTop;
      magnifierSvg.style.left = magnifierSvgLeft;

      hexEl.innerHTML = color;
      magnifierSvgHex.innerHTML = color;
      hexEl.style.backgroundColor = color;
      magnifierRing.setAttribute('fill', color);
    });
  };

  const onMouseOut = () => {
    if (!isColorPickerActivated) return;

    canvas.style.cursor = 'unset';
    hexEl.style.visibility = 'hidden';
    magnifierSvg.style.visibility = 'hidden';
  };

  image.addEventListener('load', () => {
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - headerDimensions.height;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mouseenter', onMouseEnter);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseout', onMouseOut);
    canvas.addEventListener('click', onMouseClick);
    colorPickerBtn.addEventListener('click', onColorPickerClick);
  });
};

window.addEventListener('DOMContentLoaded', onDomContentLoaded);
