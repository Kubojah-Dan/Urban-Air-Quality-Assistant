/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#091118',
          'bg-gradient-start': '#081016',
          'bg-gradient-end': '#0D1922',
          surface: '#11222D',
          'surface-elevated': '#162C3A',
          'surface-card': '#10202B',
          border: 'rgba(0, 229, 190, 0.16)',
          'border-subtle': 'rgba(255, 255, 255, 0.08)',
          teal: '#00E5BE',
          'teal-bright': '#38EF7D',
          'teal-dim': 'rgba(0, 229, 190, 0.15)',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          amber: '#F59E0B',
          text: '#FFFFFF',
          'text-secondary': '#93A8B8',
          'text-muted': '#586E7E'
        },
        lightUi: {
          bg: '#F1F4FA',
          surface: 'rgba(255, 255, 255, 0.95)',
          'surface-card': '#FFFFFF',
          border: 'rgba(220, 230, 242, 0.95)',
          text: '#0F172A',
          'text-secondary': '#64748B'
        },
        brand: {
          teal: '#00E5BE',
          'teal-dark': '#0D9488',
          amber: '#F59E0B',
          blue: '#38BDF8',
          lavender: '#8B5CF6',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#00E5BE',
          600: '#0ea5e9',
          700: '#0284c7'
        },
        slateText: {
          primary: 'inherit',
          secondary: '#64748B',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'cyber-card': '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
        'cyber-glow-teal': '0 0 25px -2px rgba(0, 229, 190, 0.45)',
        'cyber-glow-amber': '0 0 25px -2px rgba(245, 158, 11, 0.45)',
        'cyber-glow-blue': '0 0 25px -2px rgba(59, 130, 246, 0.45)',
        'light-card': '0 12px 32px -8px rgba(32, 40, 60, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)',
        'light-card-elevated': '0 16px 40px -8px rgba(0, 229, 190, 0.15), inset 0 1px 2px 0 rgba(255, 255, 255, 1)'
      },
      borderRadius: {
        '2xl': '1rem',
        '2.5xl': '1.25rem',
        '3xl': '1.5rem',
        '3.5xl': '1.75rem',
        '4xl': '2rem',
        '5xl': '2.5rem'
      }
    }
  },
  plugins: []
};
