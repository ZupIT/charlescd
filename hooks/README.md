# **GitHooks**

## **Table of contents**
### 1. [**About**](#about)
### 2. [**Usage**](#usage)
>#### 2.1. [**Configuration**](#configuration)
### 3. [**Documentation**](#documentation)
### 4. [**Contributing**](#contributing)
### 5. [**License**](#license)
### 6. [**Community**](#community)

## **About**
Hooks are programs that, when you place in a **Git Hooks directory**, it triggers actions in Git's execution.

In CharlesCD, there are two Githooks, check out below:

## **Usage**
### **1. Pre-Commit**

This hook runs during  **```git commit```** before you type a commit message. 
CharlesCD uses this to verify if the changed files in a commit have a proper license header.


### **2. Pre-Push**

This hook runs during  **```git push```** after the remote refs have been updated but before any objects have been transferred. 
CharlesCD uses this to verify if the commits to push have DCO Sign Off.


### **Configuration**
 
The hooks are stored inside the hooks subdirectory of Git's directory. 
In most projects, you will see it as:  **```.git/hooks```**.

See below how to configure CharlesCD's hooks:
- Copy the files  **```pre-commit```** and  **```pre-push```** to  **```charlescd/.git/hooks```** directory in your local CharlesCD project.

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
