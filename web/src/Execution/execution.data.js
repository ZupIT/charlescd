import { FetchData } from "react-suspense-router";

const basePath = process.env.REACT_APP_API_URI;
const request = (id) => fetch(`${basePath}/api/v1/executions/${id}`).then(res => res.json())

export const fetchExecution = FetchData(async ({ params: { id } }) => {
  const executions = await request(id)

  return { result: executions }
})