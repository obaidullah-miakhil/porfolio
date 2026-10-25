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

let cachedSoftwareGl: boolean | null = null;

export function detectSoftwareWebGL(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  if (cachedSoftwareGl !== null) {
    return cachedSoftwareGl;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (!gl || !('getParameter' in gl)) {
      cachedSoftwareGl = true;
      return true;
    }
    const webgl = gl as WebGLRenderingContext;
    const ext = webgl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : webgl.RENDERER;
    const gpu = String(webgl.getParameter(param) || '');
    webgl.getExtension('WEBGL_lose_context')?.loseContext();
    cachedSoftwareGl =
      /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return cachedSoftwareGl;
  } catch {
    cachedSoftwareGl = true;
    return true;
  }
}

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

export function shouldSkipWebGL(): boolean {
  if (typeof window === 'undefined') return true;

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('poster') === '1') return true;
    if (params.get('lowmem') === '1') return true;
    if (params.get('force3d') === '1') {
      return !isWebGLAvailable();
    }
  } catch {
    // Ignore URL parse error
  }

  // 1. Reduced motion preference
  if (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return true;
  }

  // 2. Data Saver mode
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData === true) {
    return true;
  }

  // 3. Low device memory (<= 4 GB per spec Section 5)
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) {
    return true;
  }

  // 4. Low hardware concurrency (<= 4 cores per spec Section 5)
  if (
    typeof nav.hardwareConcurrency === 'number' &&
    nav.hardwareConcurrency <= 4
  ) {
    return true;
  }

  // 5. WebGL unavailable
  if (!isWebGLAvailable()) {
    return true;
  }

  return false;
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
