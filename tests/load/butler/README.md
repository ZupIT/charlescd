# Butler circle deploy load test

This test is responsible for testing the circle deployment resilience of CharlesCD butler module.
## How it works

Each user sends a single POST request on "/deploy/circle" for their unique circle in parallel.

Change the `wait_time` variable to to determine for how long a simulated user will wait between executing tasks - in this test it is set to 1 second.


See more in [https://docs.locust.io]()
## Usage

#### On terminal

```bash
docker compose up
locust -f circle-deploy-load-test.py
```
Access [http://localhost:8089]() to run the tests or [run the tests without the web ui ](https://docs.locust.io/en/stable/running-locust-without-web-ui.html)


