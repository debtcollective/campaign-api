#! /usr/bin/env node
/* eslint no-console: 0 */
const { exec } = require('child_process')
const cluster = process.env.ECS_CLUSTER
const service = process.env.ECS_SERVICE
const taskDefinition = `${service}_${cluster}`

if (!cluster || !service) {
  process.exit(
    'Both ECS_CLUSTER and ECS_SERVICE env variables need to be present.'
  )
}

const overrides = {
  containerOverrides: [
    {
      name: service,
      memoryReservation: 64,
      command: ['yarn', 'db:migrate']
    }
  ]
}

const migrationCommand = `aws ecs run-task --started-by db-migrate --cluster ${cluster} --task-definition ${taskDefinition} --overrides '${JSON.stringify(
  overrides
)}'`

console.log(migrationCommand);

(async function () {
  try {
    await exec(migrationCommand)
  } catch (e) {
    console.log(e)
  } finally {
    process.exit()
  }
})()
