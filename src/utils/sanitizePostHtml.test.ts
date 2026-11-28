import { describe, expect, it } from 'vitest';
import { sanitizePostHtml } from './sanitizePostHtml';

describe('post HTML rendering', () => {
  it('preserves editor formatting', () => {
    expect(
      sanitizePostHtml('<p>Hello <strong>world</strong><br>again</p>'),
    ).toBe('<p>Hello <strong>world</strong><br></br>again</p>');
  });

  it('removes executable content and event handlers', () => {
    const html = sanitizePostHtml(
      '<p onclick="alert(1)">Safe<script>alert(1)</script><img src=x onerror="alert(1)"><svg onload="alert(1)"></svg></p>',
    );
    expect(html).toBe('<p>Safe</p>');
  });

  it('keeps lists, underline and quotes', () => {
    expect(
      sanitizePostHtml(
        '<ul><li><p><u>One</u></p></li></ul><ol><li><p>Two</p></li></ol><blockquote><p>Hi</p></blockquote>',
      ),
    ).toBe(
      '<ul><li><p><u>One</u></p></li></ul><ol><li><p>Two</p></li></ol><blockquote><p>Hi</p></blockquote>',
    );
  });

  it('keeps http links safe and drops other schemes', () => {
    expect(
      sanitizePostHtml(
        '<a href="https://example.com/?a=1&b=2" onclick="x()">go</a>',
      ),
    ).toBe(
      '<a href="https://example.com/?a=1&amp;b=2" target="_blank" rel="noopener noreferrer nofollow ugc">go</a>',
    );
    expect(sanitizePostHtml('<a href="javascript:alert(1)">bad</a>')).toBe(
      'bad',
    );
  });
});
