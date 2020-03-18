import { FetchData } from "react-suspense-router";

const request = (id) => fetch(`/api/v1/executions/${id}`).then(res => res.json())

export const fetchExecution = FetchData(async ({ params: { id } }) => {
  const executions = await request(id)

  return { result: executions }
})