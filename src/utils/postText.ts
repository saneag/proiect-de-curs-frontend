/** Length of the visible text in post HTML, ignoring tags and attributes. */
export const getPlainTextLength = (html: string): number =>
  (new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '')
    .length;
