import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
    cleanup();
    document.cookie.split(';').forEach((cookie) => {
        document.cookie = cookie.split('=')[0] + '=; Max-Age=0; path=/';
    });
});
