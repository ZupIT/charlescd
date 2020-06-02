import { useState, useCallback } from "react"
import { request } from "../api";
import { saveCookie } from "../utils/cookie";

export const useIdentify = () => {
  const [status, setStatus] = useState('idle');

  const getCircleID = useCallback(async (payload) => {
    try {
      setStatus('pending');
      const data = {
        workspaceId: 'c4ddae46-4fd2-4ae5-87ea-f668ba7dc0b1',
        requestData: payload
      };
      const response = await request(
        '/charlescd-circle-matcher/identify',
        { method: 'POST', data }
      );
      const [{ id }] = response.data.circles;
      saveCookie('x-circle-id', id);
      setStatus('resolved');

    } catch (e) {
      saveCookie('x-circle-id', 'UNMATCHED');
      setStatus('rejected');
      console.error(e);
    }
  }, []);

  return {
    getCircleID,
    status
  }
}