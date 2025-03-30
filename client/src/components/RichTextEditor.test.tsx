import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RichTextEditor from './RichTextEditor'

describe('RichTextEditor', () => {
  it('renders with initial content', () => {
    const onContentChange = vi.fn()
    const onFormattingChange = vi.fn()
    const onFormattedRangesChange = vi.fn()
    
    render(
      <RichTextEditor
        content="Test content"
        textFormatting={{
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          subscript: false,
          superscript: false
        }}
        formattedRanges={[]}
        onContentChange={onContentChange}
        onFormattingChange={onFormattingChange}
        onFormattedRangesChange={onFormattedRangesChange}
      />
    )
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('Test content')
  })
  
  it('toggles formatting when formatting buttons are clicked', async () => {
    const user = userEvent.setup()
    const onContentChange = vi.fn()
    const onFormattingChange = vi.fn()
    const onFormattedRangesChange = vi.fn()
    
    render(
      <RichTextEditor
        content="Test content"
        textFormatting={{
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          subscript: false,
          superscript: false
        }}
        formattedRanges={[]}
        onContentChange={onContentChange}
        onFormattingChange={onFormattingChange}
        onFormattedRangesChange={onFormattedRangesChange}
      />
    )
    
    // Select text in the textarea first
    const textarea = screen.getByRole('textbox')
    await user.click(textarea)
    
    // Mock the selection since jsdom doesn't support actual text selection
    Object.defineProperty(textarea, 'selectionStart', { value: 0 })
    Object.defineProperty(textarea, 'selectionEnd', { value: 4 }) // Select "Test"
    
    // Trigger the selection event manually
    const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true })
    textarea.dispatchEvent(mouseUpEvent)
    
    // Now that text is "selected", click the Bold button
    const boldButton = screen.getByTitle('Bold (Ctrl+B)')
    await user.click(boldButton)
    
    // Check if onFormattingChange was called with the updated formatting
    expect(onFormattingChange).toHaveBeenCalled()
  })
}) 