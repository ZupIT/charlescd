import { useState, useCallback } from "react"
import { request } from "../api";
import { saveCookie } from "../utils/cookie";

export const useIdentify = () => {
  const [status, setStatus] = useState('idle');

  const getCircleID = useCallback(async (payload) => {
    const workspaceId = process.env.REACT_APP_WORKSPACE_ID
    const circleMatcherUrl = process.env.REACT_APP_CIRCLE_MATCHER_URL
    try {
      setStatus('pending');
      const data = {
        workspaceId: workspaceId,
        requestData: payload
      };
      const response = await request(
        circleMatcherUrl,
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
