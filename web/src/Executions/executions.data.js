import { FetchData } from "react-suspense-router";

const basePath = process.env.REACT_APP_API_URI;
const request = () => fetch(`${basePath}/api/v1/executions`).then(res => res.json())

export const fetchExecutions = FetchData(async () => {
  const executions = await request()

  return { result: executions }
})