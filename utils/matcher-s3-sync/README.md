# **Matcher-s3-sync**

## **Table of contents**
### 1. [**About**](#about)
### 2. [**Conditions**](#conditions)
### 3. [**Documentation**](#cocumentation)
### 4. [**Contributing**](#contributing)
### 5. [**License**](#license)
### 6. [**Community**](#community)

## **About**
Matcher-s3-sync is a tool to synchronize the charlescd-circle-matcher and charlescd-moove databases with CSV files hosted in AWS S3.

CharlesCD accepts two types of segmentation: manual and CSV import. Both need the user to interact with CharlesCD's interface, making this process onerous in some cases.

This tool has been created to facilitate this process, Matcher-s3-sync will get CSV files in some S3 buckets and update CharlesCD's database with the information in those CSV files.

## **Conditions**
 - The S3 bucket needs to respect the following rules:
    - Each subfolder of this bucket must be a segmentation (circle) previously created in the CharlesCD and the name of this subfolder must be the circle ID.
    - The CSV inside every subfolder must respect the following documentation in [**CSV import section**](https://docs.charlescd.io/reference/circles)
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

## **Documentation**

For more information about CharlesCD, please check out the [**documentation**](https://docs.charlescd.io/).

## **Contributing**

If you want to contribute to this module, access our [**Contributing Guide**](https://github.com/ZupIT/charlescd/blob/main/CONTRIBUTING.md).

### **Developer Certificate of Origin - DCO**

 This is a security layer for the project and for the developers. It is mandatory.
 
 Follow one of these two methods to add DCO to your commits:
 
**1. Command line**
 Follow the steps: 
 **Step 1:** Configure your local git environment adding the same name and e-mail configured at your GitHub account. It helps to sign commits manually during reviews and suggestions.

 ```
git config --global user.name “Name”
git config --global user.email “email@domain.com.br”
```
**Step 2:** Add the Signed-off-by line with the `'-s'` flag in the git commit command:

```
$ git commit -s -m "This is my commit message"
```

**2. GitHub website**
You can also manually sign your commits during GitHub reviews and suggestions, follow the steps below: 

**Step 1:** When the commit changes box opens, manually type or paste your signature in the comment box, see the example:

```
Signed-off-by: Name < e-mail address >
```

For this method, your name and e-mail must be the same registered on your GitHub account.

## **License**
[**Apache License 2.0**](https://github.com/ZupIT/charlescd/blob/main/LICENSE).

## **Community**

Do you have any question about CharlesCD? Let's chat in our [**forum**](https://forum.zup.com.br/). 
