import { describe, expect, it } from 'vitest';
import { sanitizePostHtml } from './sanitizePostHtml';

describe('post HTML rendering', () => {
    it('preserves editor formatting', () => {
        expect(sanitizePostHtml('<p>Hello <strong>world</strong><br>again</p>')).toBe('<p>Hello <strong>world</strong><br></br>again</p>');
    });

    it('removes executable content and event handlers', () => {
        const html = sanitizePostHtml('<p onclick="alert(1)">Safe<script>alert(1)</script><img src=x onerror="alert(1)"><svg onload="alert(1)"></svg></p>');
        expect(html).toBe('<p>Safe</p>');
    });
});
