import React from 'react'
import { render } from '@testing-library/react'
import { BuilderProvider } from '../context/BuilderContext'
import { ThemeProvider } from '../context/ThemeContext'

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <BuilderProvider>
        {ui}
      </BuilderProvider>
    </ThemeProvider>
  )
} 