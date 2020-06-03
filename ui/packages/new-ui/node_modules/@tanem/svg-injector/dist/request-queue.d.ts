import { Errback } from './types';
export declare const clear: () => void;
export declare const queueRequest: (url: string, callback: Errback) => void;
export declare const processRequestQueue: (url: string) => void;
