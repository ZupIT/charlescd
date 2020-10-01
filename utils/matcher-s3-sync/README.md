![CharlesCD Logo](../../images/logo.png)

# About
Matcher-s3-sync is a tool to synchronize the charlescd-circle-matcher and charlescd-moove databases with CSV files hosted in AWS S3.

Charles CD accepts two types of segmentation, manual and CSV import. Both need that the user interacts with the charles interface, making this process onerous in some cases.

This tool has been created to facilitate this process, Matcher-s3-sync will get csv files in some S3 bucket and update charlescd database with the information in those CSV files.


# Conditions
 - The S3 bucket needs to respect the following rules:
    - each subfolder of this bucket must be a circle previously created in the CharlesCD and the name of this subfolder must be the circle ID.
    - the CSV inside every subfolder must respect the following documentation in [CSV import section](https://docs.charlescd.io/reference/circles)
    - To make compatible with AWS Athenas, the CSV files have to be compressed (.gz)
    - Matcher-S3-Sync will get always the newest object in each folder.

 - Matcher-S3-sync need some ENV variables to work
    - WORKSPACE_ID: Workspace ID where your applications is saved.
    - MOOVE_URL: Internal URL of charlescd-moove.
    - BUCKET_NAME: Name of S3 bucket with all circles and csv files.
    - KEYCLOAK_URL: Used to get charlescd token.
    - CHARLES_USER: User with maintainer permissions on the used workspace.
    - CHARLES_PASS: Password of user.
    - PERIOD: time in milliseconds to execute the sync function.
    - LIST_BUCKETS: 0 for false and 1 for true, used to validate AWS credentials, this will skip all steps and just list buckets from S3.

 - Matcher-S3-sync has to be installed in the same cluster of charlescd-moove.

