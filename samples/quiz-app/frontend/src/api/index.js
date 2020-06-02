import axios from 'axios';

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'x-circle-id': '3b729218-0e90-4108-9467-b444051319c3',
  }
});

export const request = instance.request;