export interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
}

const DEFAULT_LIGHT_COLORS: ThemeColors = {
  bg: '#F4F1EA',
  surface: '#FBFAF6',
  text: '#141413',
  muted: '#5E5B55',
  border: '#DEDAD0',
  accent: '#FF4F00',
};

export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (!gl) return false;
    if ('getExtension' in gl) {
      (gl as WebGLRenderingContext)
        .getExtension('WEBGL_lose_context')
        ?.loseContext();
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Lighter gate for the story character: it carries the home page, so only skip
 * it when the device asks to save data, is very low on memory, or has no WebGL.
 */
export function shouldSkipStoryAvatar(): boolean {
  if (typeof window === 'undefined') return true;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  try {
    if (new URLSearchParams(window.location.search).get('poster') === '1') return true;
  } catch {
    // Ignore URL parse error
  }
  if (nav.connection?.saveData === true) return true;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 2) return true;
  return !isWebGLAvailable();
}

export function readThemeTokenColors(): ThemeColors {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_LIGHT_COLORS;
  }
  const style = window.getComputedStyle(document.documentElement);
  const get = (prop: string, fallback: string) =>
    style.getPropertyValue(prop).trim() || fallback;

  return {
    bg: get('--bg', DEFAULT_LIGHT_COLORS.bg),
    surface: get('--surface', DEFAULT_LIGHT_COLORS.surface),
    text: get('--text', DEFAULT_LIGHT_COLORS.text),
    muted: get('--muted', DEFAULT_LIGHT_COLORS.muted),
    border: get('--border', DEFAULT_LIGHT_COLORS.border),
    accent: get('--accent', DEFAULT_LIGHT_COLORS.accent),
  };
}
