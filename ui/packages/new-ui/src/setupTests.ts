// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import fetch, { FetchMock } from 'jest-fetch-mock';
import storageMock from 'unit-test/local-storage';
import { mockCookie } from './unit-test/cookie';

interface CustomDocument {
  cookie?: string;
}

export interface CustomGlobal {
  fetch: FetchMock;
  localStorage?: object;
  document?: CustomDocument;
  Worker: object;
}

declare const global: CustomGlobal;

mockCookie();

class Worker {
  addEventListener = jest.fn();
  postMessage = jest.fn();
  terminate = jest.fn();
}

global.Worker = Worker;
window.URL.createObjectURL = jest.fn();

global.fetch = fetch as FetchMock;
global.localStorage = storageMock();
global.document.cookie = '';
