import { useEffect, useRef, useState, useCallback } from 'react';
import { buildHeaders } from 'core/providers/base';

function loadWorker(workerFile: Function) {
  const code = workerFile.toString();
  const blob = new Blob(['(' + code + ')()']);
  return new Worker(URL.createObjectURL(blob));
}

const useWorker = <T>(workerFile: Function, initialValue: T): [T, Function] => {
  const worker = useRef<Worker>();
  const [data, setData] = useState<T>(initialValue);

  const terminateWorker = () => {
    worker.current.terminate();
  };
  const workerHook = useCallback(
    (apiParams: object) => {
      if (worker.current) {
        terminateWorker();
      }

      worker.current = loadWorker(workerFile);
      worker.current.postMessage({ apiParams, headers: buildHeaders() });
      worker.current.addEventListener('message', (event: MessageEvent) => {
        setData(event.data);
      });
    },
    [workerFile]
  );

  useEffect(() => {
    return () => terminateWorker();
  }, []);

  return [data, workerHook];
};

export default useWorker;
