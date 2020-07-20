function performDeployment(data) {
  deploymentId = data.deploymentId
  deploymentComponents = DB.query(where(deployment_id: deploymentId).joins(components)).where(components: { status: "RUNNING" })
  allComponents = DB.components.where({ status: "RUNNING" })
  deploymentComponents.map(name)
  allComponents.map(name)
  if (deploymentComponents.any(allComponents)) {
    boss.publish(data) //se encontramos components sendo executados não executamos o deployment e voltamos esse mesmo job pra fila
    return
  }
  data.type DEPLOYET
  data.type UNDEPLOYT
  CDService.deploy(data)
}



function deploy(deployId) {
  boss.publish('deployments-queue', id)
}

await boss.subscribe('deployments-queue', options, job => performDeployment(job.data))


function callback(status, deploymentId) {
  if (status == "OK") {
    DB.update(deploymentId {components {status: "DONE"}})
  }
}
