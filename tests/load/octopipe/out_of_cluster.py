import random
import fixtures
from locust import HttpUser, task, between

class OctopipeOutOfClusterTest(HttpUser):
    wait_time = constant(0.01)

    @task
    def deploy(self):
        pass
