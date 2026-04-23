import { describe, it, expect } from 'vitest';
import { generateId } from '../idGenerator';

describe('generateId', () => {
  it('should generate a valid UUID string', () => {
    const id = generateId();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(id).toMatch(uuidRegex);
  });

  it('should generate unique IDs on each call', () => {
    const id1 = generateId();
    const id2 = generateId();
    const id3 = generateId();
    
    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
    expect(id1).not.toBe(id3);
  });
});
