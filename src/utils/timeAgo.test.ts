import { describe, expect, it } from 'vitest';
import { timeAgo } from './timeAgo';

const now = new Date('2026-11-28T12:00:00Z').getTime();
const ago = (ms: number) => new Date(now - ms).toISOString();

describe('timeAgo', () => {
  it('describes recent and older moments in plain words', () => {
    expect(timeAgo(ago(10 * 1000), now)).toBe('just now');
    expect(timeAgo(ago(5 * 60 * 1000), now)).toBe('5 minutes ago');
    expect(timeAgo(ago(3 * 60 * 60 * 1000), now)).toBe('3 hours ago');
    expect(timeAgo(ago(24 * 60 * 60 * 1000), now)).toBe('yesterday');
    expect(timeAgo(ago(3 * 24 * 60 * 60 * 1000), now)).toBe('3 days ago');
    expect(timeAgo(ago(40 * 24 * 60 * 60 * 1000), now)).toBe('last month');
  });
});
