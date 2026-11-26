const allowedTags = new Set([
    'STRONG',
    'EM',
    'S',
    'P',
    'BR',
    'BLOCKQUOTE',
    'SUP',
    'SUB',
]);

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
        return allowedTags.has(element.tagName)
            ? `<${element.tagName.toLowerCase()}>${children}</${element.tagName.toLowerCase()}>`
            : children;
    };

    return Array.from(parsed.body.childNodes).map(cleanNode).join('');
};
