import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  globalCss: {
    body: {
      colorPalette: 'brand',
      fontFamily: 'var(--font-sans)',
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#f0f4ff' },
          100: { value: '#dbe4ff' },
          200: { value: '#b6caff' },
          300: { value: '#8eaaff' },
          400: { value: '#6a90ff' },
          500: { value: '#4a74f1' },
          600: { value: '#3a5dd1' },
          700: { value: '#304db1' },
          800: { value: '#283e91' },
          900: { value: '#212f71' },
          950: { value: '#1a2255' },
        },
      },
      fonts: {
        body: { value: 'var(--font-sans)' },
        heading: { value: 'var(--font-sans)' },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          contrast: {
            value: { base: '{colors.white}', _dark: '{colors.white}' },
          },
          fg: {
            value: { base: '{colors.brand.700}', _dark: '{colors.brand.300}' },
          },
          subtle: {
            value: { base: '{colors.brand.100}', _dark: '{colors.brand.900}' },
          },
          muted: {
            value: { base: '{colors.brand.200}', _dark: '{colors.brand.800}' },
          },
          emphasized: {
            value: { base: '{colors.brand.300}', _dark: '{colors.brand.700}' },
          },
          solid: {
            value: { base: '{colors.brand.600}', _dark: '{colors.brand.600}' },
          },
          focusRing: {
            value: { base: '{colors.brand.400}', _dark: '{colors.brand.400}' },
          },
        },
      },
      radii: {
        l1: { value: '0.25rem' },
        l2: { value: '0.375rem' },
        l3: { value: '0.5rem' },
      },
    },
  },
  // strictTokens: true,
})

export const system = createSystem(defaultConfig, customConfig)
