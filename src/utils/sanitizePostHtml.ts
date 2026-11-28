const allowedTags = new Set([
  'STRONG',
  'EM',
  'S',
  'U',
  'P',
  'BR',
  'BLOCKQUOTE',
  'UL',
  'OL',
  'LI',
  'SUP',
  'SUB',
]);

const escapeAttribute = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Keep only the formatting tags produced by the post editor. */
export const sanitizePostHtml = (html: string): string => {
  const parsed = new DOMParser().parseFromString(html, 'text/html');

  const cleanNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = document.createElement('span');
      text.textContent = node.textContent;
      return text.innerHTML;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const element = node as Element;
    // Drop executable or embedded content, including its children.
    if (
      ['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'SVG', 'MATH'].includes(
        element.tagName,
      )
    ) {
      return '';
    }

    const children = Array.from(element.childNodes).map(cleanNode).join('');

    if (element.tagName === 'A') {
      const href = element.getAttribute('href')?.trim() ?? '';
      // Only plain web links survive; javascript: and other schemes are dropped.
      return /^https?:\/\//i.test(href)
        ? `<a href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer nofollow ugc">${children}</a>`
        : children;
    }

    return allowedTags.has(element.tagName)
      ? `<${element.tagName.toLowerCase()}>${children}</${element.tagName.toLowerCase()}>`
      : children;
  };

  return Array.from(parsed.body.childNodes).map(cleanNode).join('');
};
