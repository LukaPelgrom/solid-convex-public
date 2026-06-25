/**
 * Color utility functions for handling various color formats and transformations
 */

/**
 * Validates if a string is a valid color format
 * Supports: hex (#fff, #ffffff), rgb, rgba, hsl, hsla
 */
export const isValidColor = (color: string): boolean => {
  if (!color || typeof color !== "string") return false;

  const trimmedColor = color.trim();

  // Hex color (#fff or #ffffff)
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(trimmedColor)) {
    return true;
  }

  // RGB color: rgb(255, 255, 255) or rgb(255,255,255)
  if (/^rgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(trimmedColor)) {
    return true;
  }

  // RGBA color: rgba(255, 255, 255, 1) or rgba(255,255,255,0.5)
  if (
    /^rgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(trimmedColor)
  ) {
    return true;
  }

  // HSL color: hsl(360, 100%, 50%)
  if (/^hsl\s*\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)$/.test(trimmedColor)) {
    return true;
  }

  // HSLA color: hsla(360, 100%, 50%, 1)
  if (
    /^hsla\s*\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*,\s*[\d.]+\s*\)$/.test(
      trimmedColor,
    )
  ) {
    return true;
  }

  return false;
};

/**
 * Adds alpha transparency to a color string
 * @param color - The color string in any supported format (hex, rgb, rgba, hsl, hsla)
 * @param alpha - The alpha value to apply (0-1), defaults to 0.1
 * @returns The color string with the specified alpha value, or undefined if invalid
 *
 * @example
 * addAlphaToColor("#ffffff", 0.1) // "rgba(255, 255, 255, 0.1)"
 * addAlphaToColor("rgb(255, 255, 255)", 0.2) // "rgba(255, 255, 255, 0.2)"
 * addAlphaToColor("rgba(255, 255, 255, 1)", 0.3) // "rgba(255, 255, 255, 0.3)"
 * addAlphaToColor("hsl(0, 100%, 50%)", 0.4) // "hsla(0, 100%, 50%, 0.4)"
 * addAlphaToColor("invalid", 0.1) // undefined
 */
export const addAlphaToColor = (
  color: string,
  alpha = 0.1,
): string | undefined => {
  if (!color || typeof color !== "string") return undefined;

  const trimmedColor = color.trim();

  // Validate the color format first
  if (!isValidColor(trimmedColor)) {
    return undefined;
  }

  // Clamp alpha between 0 and 1
  const clampedAlpha = Math.max(0, Math.min(1, alpha));

  // Hex color (#fff or #ffffff)
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(trimmedColor)) {
    let hex = trimmedColor.slice(1);
    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
      hex = [...hex].map((char) => char + char).join("");
    }
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
  }

  // RGBA color - replace existing alpha
  if (/^rgba\s*\(/.test(trimmedColor)) {
    return trimmedColor.replace(
      /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*[\d.]+\s*\)/,
      (_, r, g, b) => `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`,
    );
  }

  // RGB color - add alpha
  if (/^rgb\s*\(/.test(trimmedColor)) {
    return trimmedColor.replace(
      /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/,
      (_, r, g, b) => `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`,
    );
  }

  // HSLA color - replace existing alpha
  if (/^hsla\s*\(/.test(trimmedColor)) {
    return trimmedColor.replace(
      /hsla\s*\(([^,]+),\s*([^,]+),\s*([^,]+),\s*[\d.]+\s*\)/,
      (_, h, s, l) => `hsla(${h}, ${s}, ${l}, ${clampedAlpha})`,
    );
  }

  // HSL color - add alpha
  if (/^hsl\s*\(/.test(trimmedColor)) {
    return trimmedColor.replace(
      /hsl\s*\(([^,]+),\s*([^,]+),\s*([^)]+)\)/,
      (_, h, s, l) => `hsla(${h}, ${s}, ${l}, ${clampedAlpha})`,
    );
  }

  return undefined;
};

const hue2rgb = (p: number, q: number, t: number) => {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
};

/**
 * Parses a color string to RGB values
 * Supports: hex (#fff, #ffffff), rgb(), rgba(), hsl(), hsla()
 * @returns [r, g, b] array with values 0-255, or undefined if invalid
 */
const parseColorToRgb = (
  color: string,
): [number, number, number] | undefined => {
  const trimmed = color.trim();

  // Hex color
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(trimmed)) {
    let hex = trimmed.slice(1);
    if (hex.length === 3) {
      hex = [...hex].map((c) => c + c).join("");
    }
    return [
      Number.parseInt(hex.slice(0, 2), 16),
      Number.parseInt(hex.slice(2, 4), 16),
      Number.parseInt(hex.slice(4, 6), 16),
    ];
  }

  // RGB/RGBA
  const rgbMatch = trimmed.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return [
      Number.parseInt(rgbMatch[1], 10),
      Number.parseInt(rgbMatch[2], 10),
      Number.parseInt(rgbMatch[3], 10),
    ];
  }

  // HSL/HSLA - convert to RGB
  const hslMatch = trimmed.match(
    /^hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/,
  );
  if (hslMatch) {
    const h = Number.parseFloat(hslMatch[1]) / 360;
    const s = Number.parseFloat(hslMatch[2]) / 100;
    const l = Number.parseFloat(hslMatch[3]) / 100;

    if (s === 0) {
      const v = Math.round(l * 255);
      return [v, v, v];
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [
      Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      Math.round(hue2rgb(p, q, h) * 255),
      Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    ];
  }

  return undefined;
};

/**
 * Returns a contrasting text color ("white" or "black") for a given background color.
 * Uses the WCAG relative luminance formula to determine readability.
 * @param color - The background color string (hex, rgb, rgba, hsl, hsla)
 * @returns "white" for dark backgrounds, "#1a1a1a" for light backgrounds
 */
export const getContrastTextColor = (color: string): string => {
  const rgb = parseColorToRgb(color);
  if (!rgb) return "white";

  // Convert to sRGB linear values and compute relative luminance (WCAG 2.0)
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance < 0.5 ? "white" : "#1a1a1a";
};

/**
 * Creates a style object with transparent background and original foreground color
 * Falls back to undefined if the color is invalid
 * @param color - The color string to convert
 * @param alpha - The alpha value for the background (0-1), defaults to 0.1
 * @returns Style object with background and color properties, or undefined if invalid
 */
export const getColorStyles = (
  color: string,
  alpha = 0.1,
): { background: string; color: string } | undefined => {
  if (!color || !isValidColor(color)) {
    return undefined;
  }

  const background = addAlphaToColor(color, alpha);
  if (!background) {
    return undefined;
  }

  return {
    background,
    color: color.trim(),
  };
};
