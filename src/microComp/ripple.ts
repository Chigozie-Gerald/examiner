export const makeRipple = (
  e: MouseEvent | React.MouseEvent<HTMLLabelElement, MouseEvent>,
  light = false,
  center = false,
  size = 4,
  decipher = false,
) => {
  const ripple = document.createElement('span');

  let Size = size * 10;
  ripple.classList.add('ripple');
  if (light) {
    ripple.classList.add('light');
  }

  let x: number, y: number;
  const element = e.target as HTMLElement;
  const bT = parseInt(element.style.borderTopWidth || `0`);
  const bB = parseInt(element.style.borderBottomWidth || `0`);
  const bL = parseInt(element.style.borderLeftWidth || `0`);
  const bR = parseInt(element.style.borderRightWidth || `0`);
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  const rect = element.getBoundingClientRect();
  if (decipher) {
    Size = rect.height;
  }
  if (center) {
    console.log(rect.height, bL, bR, size);
    x = (rect.width - bL - bR - size) / 2;
    y = (rect.height - bT - bB - size) / 2;
  } else {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }

  ripple.style.position = 'absolute';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  if (center) {
    ripple.style.marginTop = `-${0}px`;
    ripple.style.marginBottom = `-${0}px`;
    ripple.style.marginLeft = `auto`;
    ripple.style.marginRight = `auto`;
    ripple.style.height = `${size}px`;
    ripple.style.width = `${size}px`;
  } else {
    ripple.style.marginTop = `-${Size / 2}px`;
    ripple.style.marginLeft = `-${Size / 2}px`;
    ripple.style.height = `${Size}px`;
    ripple.style.width = `${Size}px`;
  }

  setTimeout(() => {
    ripple.remove();
    element.style.overflow = '';
  }, 1700);
};
