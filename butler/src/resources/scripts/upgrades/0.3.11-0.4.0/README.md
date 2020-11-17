# v0.3.11 - v0.4.0 Butler migration script

# Disclaimer

This script must be run after you have manually re-deployed all components in the default circle, otherwise the script
will invalidate the current routing strategy and your components will be unreachable.

# How to run

In order to run this script, first go to its root directory and follow the next steps:

1. Build the docker image:

    ```docker build --tag <your-image-name>:<your-tag> . ```

2. Create a .env file with the following env vars filled:

    ```
    CHARLES_BASEURL=<charles-base-url>
    CHARLES_USER=<charles-user>
    CHARLES_PASSWORD=<charles-user-password>
    DATABASE_HOST=<charles-db-host>
    DATABASE_PORT=<charles-db-port>
    DATABASE_USER=<charles-db-user>
    DATABASE_PASSWORD=<charles-db-password>
    DATABASE_NAME=<charlescd-moove-db-name>
   ```
3. Run the docker container:

    ```docker run -it --env-file ./<your-env-file> <your-image-name>:<your-tag>```
   
   It is important to notice that the -it flag must be present. Our script is interactive and
   therefore needs to have TTY enabled.