# GitHooks

Hooks are programs you place in a **Git Hooks directory**, they trigger actions in Git's execution.

In CharlesCD, there are two Githooks, check out below:

## **Pre-Commit**

This hook runs during ```git commit``` before you type a commit message. 
CharlesCD uses this to verify if the changed files in a commit have a proper **license header**.


## **Pre-Push**

This hook runs during ```git push``` after the remote refs have been updated but before any objects have been transferred. 
CharlesCD uses to verify if the commits to push have the **DCO Sign Off**.


# Configuration

You will find these hooks stored inside the hooks' subdirectory of a Git directory. 

In most projects, you will see it as: **```.git/hooks```**, this is a hidden folder, you will have to change your computer's configuration to find it. 

If you want configure CharlesCD's hooks:
- Copy the files **```pre-commit```** and **```pre-push```** to **```charlescd/.git/hooks```** directory in your local CharlesCD project.