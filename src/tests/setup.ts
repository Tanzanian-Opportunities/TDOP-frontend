import '@testing-library/jest-dom';
import { vi } from 'vitest';
import i18n from '@/i18n';

export { i18n };

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock('axios', async () => {
  const actual = await vi.importActual('axios');
  const axiosMock: any = vi.fn(() => Promise.resolve({ data: {} }));
  axiosMock.create = vi.fn(() => ({
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  }));
  axiosMock.get = vi.fn(() => Promise.resolve({ data: {} }));
  axiosMock.post = vi.fn(() => Promise.resolve({ data: {} }));
  axiosMock.put = vi.fn(() => Promise.resolve({ data: {} }));
  axiosMock.delete = vi.fn(() => Promise.resolve({ data: {} }));
  axiosMock.AxiosError = actual.AxiosError;
  return {
    ...actual,
    default: axiosMock,
  };
});

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  vi.clearAllMocks();
});
