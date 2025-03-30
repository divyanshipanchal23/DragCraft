import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly with different variants', () => {
    render(<Button variant="default">Default Button</Button>)
    expect(screen.getByText('Default Button')).toBeInTheDocument()
    
    render(<Button variant="destructive">Destructive Button</Button>)
    expect(screen.getByText('Destructive Button')).toHaveClass('bg-destructive')
  })
  
  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clickable</Button>)
    
    await userEvent.click(screen.getByText('Clickable'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
}) 