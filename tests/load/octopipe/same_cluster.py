import random
import json
import fixtures
from locust import HttpUser, task, constant

class OctopipeSameClusterTest(HttpUser):
    wait_time = constant(0.01)

    @task
    def deploy(self):
        request_data = fixtures.get_samecluster_request()
        headers = {'content-type': 'application/json'}
        with self.client.post("/api/v1/pipelines", data = json.dumps(request_data), headers = headers, catch_response = True) as response:
            if response.status_code == 201:
                response.success()
            else:
                response.failure(response.text)