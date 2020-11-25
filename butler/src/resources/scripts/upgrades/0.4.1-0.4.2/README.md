# v0.4.1 - v0.4.2 Butler migration script

# Disclaimer

This script must be run if you have releases deployed in default circle on versions before 0.4.2

# How to run

In order to run this script, first go to its root directory and follow the next steps:

1. Build the docker image:

    ```docker build --tag <your-image-name>:<your-tag> . ```

2. Create a .env file with the following env vars filled:

    ```
    CHARLES_BASEURL=<charles-base-url>
    BUTLER_URL=<butler-url>
    CHARLES_USER=<charles-user>
    CHARLES_PASSWORD=<charles-user-password>
    DATABASE_HOST=<charles-db-host>
    DATABASE_PORT=<charles-db-port>
    DATABASE_USER=<charles-db-user>
    DATABASE_PASSWORD=<charles-db-password>
    DATABASE_NAME=<charlescd-moove-db-name>
   ```
3. Run the docker container:

    ```docker run --env-file ./<your-env-file> <your-image-name>:<your-tag>```
   
