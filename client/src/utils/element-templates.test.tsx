import { describe, it, expect } from 'vitest'
import { createNewElement } from './element-templates'

describe('Element Templates Utilities', () => {
  it('creates a new heading element with correct properties', () => {
    const element = createNewElement('heading', 'test-drop-zone')
    
    expect(element.type).toBe('heading')
    expect(element.parentId).toBe('test-drop-zone')
    expect(element).toHaveProperty('richText')
    expect(element).toHaveProperty('formattedRanges')
    expect(element.style).toHaveProperty('fontSize')
    expect(element.style).toHaveProperty('fontWeight')
    expect(element.style).toHaveProperty('fontFamily')
  })
  
  it('creates a new paragraph element with correct properties', () => {
    const element = createNewElement('paragraph', 'test-drop-zone')
    
    expect(element.type).toBe('paragraph')
    expect(element.parentId).toBe('test-drop-zone')
    expect(element).toHaveProperty('richText')
    expect(element).toHaveProperty('listType')
    expect(element).toHaveProperty('formattedRanges')
  })
}) 