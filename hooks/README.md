# **GitHooks**

Hooks are programs you can place in a Git Hooks directory to trigger actions at certain points in the Git's execution

In CharlesCD we have two Githooks, see them below:

## **1. Pre-Commit**

This hook runs during  **```git commit```** before you type a commit message. 
CharlesCD uses this to verify if the changed files in a commit have a proper license header.


## **2. Pre-Push**

This hook runs during  **```git push```** after the remote refs have been updated but before any objects have been transferred. 
CharlesCD uses this to verify if the commits to push have DCO Sign Off.


# **Configuration**
 
The hooks are stored inside the hooks subdirectory of Git's directory. 
In most projects, you will see it as:  **```.git/hooks```**.

See below how to configure CharlesCD's hooks:
- Copy the files  **```pre-commit```** and  **```pre-push```** to  **```charlescd/.git/hooks```** directory in your local CharlesCD project.