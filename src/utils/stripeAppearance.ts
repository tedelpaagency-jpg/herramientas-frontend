import { StripeAppearanceConfig } from '../types/landing';

export const defaultStripeAppearance: StripeAppearanceConfig = {
  theme: 'stripe',
  bg_color: '#064e3b',
  bg_transparent: false,
  container_border_color: 'rgba(16, 185, 129, 0.3)',
  container_border_width: '1px',
  container_border_radius: '16px',
  container_shadow: 'md',
  spacing_unit: '16px',

  text_color: '#064e3b',
  title_color: '#047857',
  label_color: '#065f46',
  font_size: '13px',
  font_weight: '600',
  font_family: 'system-ui, -apple-system, sans-serif',

  input_bg_color: '#ffffff',
  input_text_color: '#0f172a',
  input_placeholder_color: '#94a3b8',
  input_border_color: '#cbd5e1',
  input_focus_border_color: '#10b981',
  input_border_width: '1px',
  input_border_radius: '12px',
  input_padding: '12px 14px',

  button_bg_color: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  button_text_color: '#ffffff',
  button_hover_bg_color: '#047857',
  button_border_radius: '14px',
  button_padding: '14px 24px',
  button_text: 'Completar Registro y Pago Seguro',

  error_color: '#ef4444',
  success_color: '#10b981',
  link_color: '#059669',
};

export const stripePresets: Record<string, { name: string; description: string; colors: string[]; config: StripeAppearanceConfig }> = {
  emerald_pay: {
    name: 'Emerald Pay (Finanzas)',
    description: 'Verde esmeralda corporativo optimizado para conversión',
    colors: ['#064e3b', '#10b981', '#059669'],
    config: {
      theme: 'stripe',
      bg_color: '#f0fdf4',
      bg_transparent: false,
      container_border_color: '#a7f3d0',
      container_border_width: '1px',
      container_border_radius: '16px',
      container_shadow: 'md',
      spacing_unit: '16px',
      text_color: '#064e3b',
      title_color: '#047857',
      label_color: '#065f46',
      font_size: '13px',
      font_weight: '600',
      font_family: 'system-ui, sans-serif',
      input_bg_color: '#ffffff',
      input_text_color: '#0f172a',
      input_placeholder_color: '#94a3b8',
      input_border_color: '#a7f3d0',
      input_focus_border_color: '#10b981',
      input_border_width: '1px',
      input_border_radius: '12px',
      input_padding: '12px 14px',
      button_bg_color: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      button_text_color: '#ffffff',
      button_hover_bg_color: '#047857',
      button_border_radius: '14px',
      button_padding: '14px 24px',
      button_text: 'Pagar con Tarjeta Segura',
      error_color: '#ef4444',
      success_color: '#10b981',
      link_color: '#059669',
    },
  },
  dark_luxe: {
    name: 'Dark Luxe (Slate & Indigo)',
    description: 'Tema oscuro premium con acentos índigo y violeta',
    colors: ['#0f172a', '#6366f1', '#a855f7'],
    config: {
      theme: 'night',
      bg_color: '#090d16',
      bg_transparent: false,
      container_border_color: '#1e293b',
      container_border_width: '1px',
      container_border_radius: '20px',
      container_shadow: 'xl',
      spacing_unit: '18px',
      text_color: '#f8fafc',
      title_color: '#ffffff',
      label_color: '#cbd5e1',
      font_size: '13px',
      font_weight: '600',
      font_family: 'Inter, system-ui, sans-serif',
      input_bg_color: '#020617',
      input_text_color: '#ffffff',
      input_placeholder_color: '#64748b',
      input_border_color: '#1e293b',
      input_focus_border_color: '#6366f1',
      input_border_width: '1px',
      input_border_radius: '12px',
      input_padding: '12px 14px',
      button_bg_color: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      button_text_color: '#ffffff',
      button_hover_bg_color: '#4f46e5',
      button_border_radius: '14px',
      button_padding: '14px 24px',
      button_text: 'Confirmar y Pagar Ahora',
      error_color: '#f87171',
      success_color: '#34d399',
      link_color: '#818cf8',
    },
  },
  clean_light: {
    name: 'Clean Light (Corporativo Blanco)',
    description: 'Blanco puro, bordes sutiles y azul corporativo moderno',
    colors: ['#ffffff', '#2563eb', '#f1f5f9'],
    config: {
      theme: 'stripe',
      bg_color: '#ffffff',
      bg_transparent: false,
      container_border_color: '#e2e8f0',
      container_border_width: '1px',
      container_border_radius: '16px',
      container_shadow: 'lg',
      spacing_unit: '16px',
      text_color: '#1e293b',
      title_color: '#0f172a',
      label_color: '#475569',
      font_size: '13px',
      font_weight: '600',
      font_family: 'system-ui, sans-serif',
      input_bg_color: '#f8fafc',
      input_text_color: '#0f172a',
      input_placeholder_color: '#94a3b8',
      input_border_color: '#cbd5e1',
      input_focus_border_color: '#2563eb',
      input_border_width: '1px',
      input_border_radius: '10px',
      input_padding: '12px 14px',
      button_bg_color: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      button_text_color: '#ffffff',
      button_hover_bg_color: '#1e40af',
      button_border_radius: '12px',
      button_padding: '14px 24px',
      button_text: 'Pagar con Tarjeta',
      error_color: '#dc2626',
      success_color: '#16a34a',
      link_color: '#2563eb',
    },
  },
  neon_cyber: {
    name: 'Neon Cyber (Tecnológico Cían)',
    description: 'Fondo negro azabache con contrastes cían de alta visibilidad',
    colors: ['#000000', '#06b6d4', '#38bdf8'],
    config: {
      theme: 'night',
      bg_color: '#05070d',
      bg_transparent: false,
      container_border_color: 'rgba(6, 182, 212, 0.4)',
      container_border_width: '1px',
      container_border_radius: '20px',
      container_shadow: 'xl',
      spacing_unit: '18px',
      text_color: '#e0f2fe',
      title_color: '#38bdf8',
      label_color: '#7dd3fc',
      font_size: '13px',
      font_weight: '600',
      font_family: 'Montserrat, sans-serif',
      input_bg_color: '#090d16',
      input_text_color: '#f0f9ff',
      input_placeholder_color: '#38bdf8',
      input_border_color: '#0e7490',
      input_focus_border_color: '#06b6d4',
      input_border_width: '1px',
      input_border_radius: '12px',
      input_padding: '12px 14px',
      button_bg_color: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
      button_text_color: '#000000',
      button_hover_bg_color: '#06b6d4',
      button_border_radius: '14px',
      button_padding: '14px 24px',
      button_text: 'PROCESAR PAGO SEGURO →',
      error_color: '#f43f5e',
      success_color: '#10b981',
      link_color: '#38bdf8',
    },
  },
  glassmorphism: {
    name: 'Glassmorphism (Cristal Translúcido)',
    description: 'Efecto cristal translúcido con desenfoque de fondo y bordes de luz',
    colors: ['rgba(15,23,42,0.65)', '#ec4899', 'rgba(255,255,255,0.2)'],
    config: {
      theme: 'night',
      bg_color: 'rgba(15, 23, 42, 0.7)',
      bg_transparent: false,
      container_border_color: 'rgba(255, 255, 255, 0.15)',
      container_border_width: '1px',
      container_border_radius: '24px',
      container_shadow: '2xl',
      spacing_unit: '20px',
      text_color: '#ffffff',
      title_color: '#ffffff',
      label_color: '#e2e8f0',
      font_size: '13px',
      font_weight: '600',
      font_family: 'system-ui, sans-serif',
      input_bg_color: 'rgba(2, 6, 23, 0.55)',
      input_text_color: '#ffffff',
      input_placeholder_color: 'rgba(255, 255, 255, 0.4)',
      input_border_color: 'rgba(255, 255, 255, 0.15)',
      input_focus_border_color: '#ec4899',
      input_border_width: '1px',
      input_border_radius: '14px',
      input_padding: '12px 14px',
      button_bg_color: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
      button_text_color: '#ffffff',
      button_hover_bg_color: '#db2777',
      button_border_radius: '16px',
      button_padding: '14px 24px',
      button_text: 'Pagar con Stripe',
      error_color: '#fb7185',
      success_color: '#34d399',
      link_color: '#f472b6',
    },
  },
  minimalist: {
    name: 'Minimalist (Transparente Plano)',
    description: 'Fondo totalmente transparente, limpio y adaptable a cualquier plantilla',
    colors: ['transparent', '#0f172a', '#64748b'],
    config: {
      theme: 'flat',
      bg_color: 'transparent',
      bg_transparent: true,
      container_border_color: '#cbd5e1',
      container_border_width: '1px',
      container_border_radius: '12px',
      container_shadow: 'none',
      spacing_unit: '14px',
      text_color: '#0f172a',
      title_color: '#0f172a',
      label_color: '#334155',
      font_size: '13px',
      font_weight: '600',
      font_family: 'system-ui, sans-serif',
      input_bg_color: '#ffffff',
      input_text_color: '#0f172a',
      input_placeholder_color: '#94a3b8',
      input_border_color: '#cbd5e1',
      input_focus_border_color: '#0f172a',
      input_border_width: '1px',
      input_border_radius: '8px',
      input_padding: '10px 12px',
      button_bg_color: '#0f172a',
      button_text_color: '#ffffff',
      button_hover_bg_color: '#334155',
      button_border_radius: '10px',
      button_padding: '12px 20px',
      button_text: 'Pagar Orden',
      error_color: '#ef4444',
      success_color: '#10b981',
      link_color: '#0f172a',
    },
  },
};

/**
 * Convierte la configuración visual en la configuración oficial de Apariencia de Stripe (Stripe Appearance API).
 * Compatible con Stripe Elements y Payment Element oficial.
 */
export function buildStripeAppearanceOptions(config?: StripeAppearanceConfig): Record<string, any> {
  const merged = { ...defaultStripeAppearance, ...config };

  const theme = merged.theme || (merged.bg_color && isColorDark(merged.bg_color) ? 'night' : 'stripe');

  const variables: Record<string, string> = {
    fontFamily: merged.font_family || 'system-ui, sans-serif',
    fontSizeBase: merged.font_size || '14px',
    fontWeightNormal: merged.font_weight || '400',
    fontWeightMedium: '500',
    fontWeightBold: '700',
  };

  if (merged.button_bg_color && !merged.button_bg_color.includes('gradient')) {
    variables.colorPrimary = merged.button_bg_color;
  } else {
    variables.colorPrimary = '#10b981';
  }

  if (merged.bg_transparent) {
    variables.colorBackground = 'transparent';
  } else if (merged.bg_color) {
    variables.colorBackground = merged.bg_color;
  }

  if (merged.text_color) {
    variables.colorText = merged.text_color;
  }

  if (merged.label_color) {
    variables.colorTextSecondary = merged.label_color;
  }

  if (merged.input_placeholder_color) {
    variables.colorTextPlaceholder = merged.input_placeholder_color;
  }

  if (merged.error_color) {
    variables.colorDanger = merged.error_color;
  }

  if (merged.success_color) {
    variables.colorSuccess = merged.success_color;
  }

  if (merged.input_border_radius) {
    variables.borderRadius = merged.input_border_radius.includes('px')
      ? merged.input_border_radius
      : `${merged.input_border_radius}px`;
  }

  if (merged.spacing_unit) {
    variables.spacingUnit = merged.spacing_unit.includes('px')
      ? merged.spacing_unit
      : `${merged.spacing_unit}px`;
  }

  const rules: Record<string, any> = {
    '.Input': {
      backgroundColor: merged.input_bg_color || undefined,
      color: merged.input_text_color || undefined,
      borderColor: merged.input_border_color || undefined,
      borderWidth: merged.input_border_width || '1px',
      borderRadius: merged.input_border_radius || '8px',
      padding: merged.input_padding || '12px',
      boxShadow: 'none',
    },
    '.Input:focus': {
      borderColor: merged.input_focus_border_color || '#10b981',
      boxShadow: merged.input_focus_border_color
        ? `0 0 0 2px ${merged.input_focus_border_color}33`
        : '0 0 0 2px rgba(16, 185, 129, 0.2)',
    },
    '.Input::placeholder': {
      color: merged.input_placeholder_color || '#94a3b8',
    },
    '.Label': {
      color: merged.label_color || merged.text_color || '#374151',
      fontWeight: merged.font_weight || '600',
      fontSize: merged.font_size || '13px',
      marginBottom: '6px',
    },
    '.Tab': {
      backgroundColor: merged.input_bg_color || '#ffffff',
      color: merged.text_color || '#0f172a',
      borderColor: merged.input_border_color || '#cbd5e1',
      borderRadius: merged.input_border_radius || '8px',
    },
    '.Tab:hover': {
      color: merged.text_color || '#0f172a',
    },
    '.Tab--selected': {
      borderColor: merged.input_focus_border_color || '#10b981',
      backgroundColor: merged.bg_color || '#f0fdf4',
    },
    '.Error': {
      color: merged.error_color || '#ef4444',
      fontSize: '12px',
    },
    '.Block': {
      backgroundColor: merged.bg_transparent ? 'transparent' : merged.bg_color || '#ffffff',
      borderColor: merged.container_border_color || '#e2e8f0',
      borderRadius: merged.container_border_radius || '12px',
    },
  };

  return {
    theme: theme as 'stripe' | 'night' | 'flat',
    variables,
    rules,
  };
}

export function isColorDark(color: string): boolean {
  if (!color || color === 'transparent') return false;
  if (color.startsWith('#')) {
    let hex = color.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq < 128;
  }
  if (color.startsWith('rgb')) {
    const parts = color.match(/\d+/g);
    if (parts && parts.length >= 3) {
      const r = parseInt(parts[0], 10);
      const g = parseInt(parts[1], 10);
      const b = parseInt(parts[2], 10);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq < 128;
    }
  }
  return false;
}
