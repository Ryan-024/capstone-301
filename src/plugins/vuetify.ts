import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#0f172a',
          surface: '#1e293b',
          primary: '#3b82f6',
          secondary: '#06b6d4',
          tertiary: '#8b5cf6',
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#0ea5e9'
        }
      },
      light: {
        dark: false,
        colors: {
          background: '#f8fafc',
          surface: '#ffffff',
          primary: '#3b82f6',
          secondary: '#06b6d4',
          tertiary: '#8b5cf6',
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#0ea5e9'
        }
      }
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi }
  }
})
