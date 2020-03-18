import { FetchData } from "react-suspense-router";

const request = () => fetch('/api/v1/executions').then(res => res.json())

export const fetchExecutions = FetchData(async () => {
  const executions = await request()

  return { result: executions }
})