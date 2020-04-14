import { CustomGlobal } from 'setupTests';

export const mockCookie = () => {
  jest.mock('react-cookies', () => ({
    save: jest.fn().mockImplementation((key: string, value: string) => {
      (global as unknown as CustomGlobal).document.cookie = `${key}=${value};`;
    }),
    load: jest
      .fn()
      .mockImplementation(() => (global as unknown as CustomGlobal).document.cookie)
  }));
};
