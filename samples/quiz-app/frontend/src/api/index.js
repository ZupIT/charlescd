import axios from 'axios';
import { getCircleId } from "../utils/cookie";

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'x-circle-id': getCircleId()
  }
});

export const request = instance.request;