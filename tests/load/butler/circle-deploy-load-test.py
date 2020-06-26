import json
import uuid
from locust import task, events, constant_pacing
from locust.contrib.fasthttp import FastHttpUser
from settings import HOST, AUTHOR_ID, CD_CONFIGURATION_ID
from utils import load_json_payload

circle_deployment_payload = ''


@events.test_start.add_listener
def on_test_start(environment):
    global circle_deployment_payload
    circle_deployment_payload = load_json_payload('circle-deployment-payload.json')


class CirclesDeployment(FastHttpUser):
    wait_time = constant_pacing(1)
    host = HOST

    @task
    def create_circle_deployment(self):
        circle_deployment_payload['deploymentId'] = str(uuid.uuid4())
        circle_deployment_payload['modules'][0]['moduleId'] = str(uuid.uuid4())
        circle_deployment_payload['modules'][0]['components'][0]['componentId'] = str(uuid.uuid4())
        circle_deployment_payload['circle']['headerValue'] = str(uuid.uuid4())
        circle_deployment_payload['authorId'] = AUTHOR_ID
        circle_deployment_payload['cdConfigurationId'] = CD_CONFIGURATION_ID
        circle_deployment_payload['applicationName'] = str(uuid.uuid4())

        headers = {'content-type': 'application/json',
                   'x-circle-id': str(uuid.uuid4()),
                   'x-workspace-id': str(uuid.uuid4())}

        print('\n---------------------------------------------------------------------------------------------------\n')
        print("POST IN CIRCLE ID: " + json.dumps(circle_deployment_payload, indent=4))

        with self.client.post("/deployments/circle",
                              data=json.dumps(circle_deployment_payload),
                              headers=headers,
                              catch_response=True) as response:
            if response.text is not None:
                print("\n RESPONSE: \n" + response.text)
            if response.status_code == 201:
                response.success()
            else:
                response.failure('')
