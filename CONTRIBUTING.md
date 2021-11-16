
# **Contributing Guide**

This is CharlesCD contributing guide. Please read the following sections to learn how to ask questions and how to work on something in order to improve our project.

## **Welcome**
:wave:Welcome! 

## **Table of contents**

### 1. [**Before you contribute**](#before-you-contribute)
> #### 1.1. [**Code of Conduct**](#code-of-conduct)
> #### 1.2. [**Legal**](#legal)
### 2. [**Prerequisites**](#prerequisites)
> #### 2.1. [**Tests aren’t optional**](#tests-aren’t-optional)
> #### 2.2. [**Be aware of documentation changes**](#be-aware-of-documentation-changes)
> #### 2.3. [**Code reviews**](#code-reviews)
> #### 2.4. [**Continuous Integration**](#continuous-integration)
> #### 2.5. [**Developer Certificate of Origin - DCO**](#developer-certificate-of-origin-DCO)
### 3. [**How to contribute?**](#how-to-contribute?)
> #### 3.1. [**First contribution**](#first-contribution)
> #### 3.2. [**Do you want to add a new feature or change an existing one?**](#do-you-want-to-add-a-new-feature-or-change-an-existing-one?)
> #### 3.3. [**Adding a new feature**](#adding-a-new-feature)
> #### 3.4. [**Before open an issue**](#before-open-an-issue)
> #### 3.5. [**Opening a new issue**](#opening-a-new-issue)
> #### 3.6. [**How to make a change suggestion?**](#how-to-make-a-change-suggestion?)
> #### 3.7. [**Did you find a bug?**](#did-you-find-a-bug?)
### 4. [**Community**](#community)


## **Before you contribute**

### **Code of Conduct**
Please follow the [**Code of Conduct**](https://github.com/ZupIT/charlescd/blob/main/CODE_OF_CONDUCT.md) in all your interactions with our project.

### **Legal**
As you contribute, keep in mind that the code, docs and other materials submitted to open source projects are usually considered licensed under the same terms as the rest of the work.

- CharlesCD is licensed over [**ASF - Apache License**](https://github.com/ZupIT/charlescd/blob/main/LICENSE), version 2, so new files must have the ASL version 2 header. For more information, please check out [**Apache license**](https://www.apache.org/licenses/LICENSE-2.0).

- You should configure a pre-commit Githook in your local machine, so it will help you not commit files without a license header. Please check out [**more about Githooks**](https://github.com/ZupIT/charlescd/blob/main/hooks/README.md).

- All contributions are subject to the [**Developer Certificate of Origin (DCO)**](https://developercertificate.org). 
When you commit, use the ```**-s** ``` option to include the Signed-off-by line at the end of the commit log message. At the root of this repository, you will find the DCO text verbatim in the [**dco.txt**](https://github.com/ZupIT/charlescd/blob/main/dco.txt) file. You should config a pre-push Githook in your local machine to help you not push without DCO Sign Off. For more information, [**check out GitHooks**](https://github.com/ZupIT/charlescd/blob/main/hooks/README.md).

- All contributions should use [**GPG commit signature verification**](https://docs.github.com/en/github/authenticating-to-github/managing-commit-signature-verification/about-commit-signature-verification#gpg-commit-signature-verification). 
When you commit, use the ```**-S** ``` option to include the signing. 
To sign commits using GPG and have them verified on GitHub, follow the steps described [**in the commit signature verification section**](https://docs.github.com/en/github/authenticating-to-github/managing-commit-signature-verification/about-commit-signature-verification#gpg-commit-signature-verification).

## **Prerequisites** 

Check out the requisites before contributing to CharlesCD:

### **Tests aren’t optional**
We encourage you to write tests before the implementation, see below:

1. Bug fixes need to include a test proving the existence of the bug and why you are fixing it. If it doesn't include, it will return to the sender.
2. New features need to include a test that proves it actually works. If it doesn't include, it will return to the sender.

### **Be aware of documentation changes**
If your collaboration changes the way we use any CharlesCD functionality, you should also update the documentation.

### **Code reviews**
All your submissions needs a review before being merged.

### **Continuous Integration**
**All submissions must go through our CI pipeline** to ensure CharlesCD is always stable. This is part of the process of making changes and includes everyone, even CharlesCD core team members. 
- **CharlesCD CI is based on GitHub Actions** so you are able to execute it on your own fork too and all pushes or pull requests to the main branch will be checked. 
It is a good way to get some feedback before get back your changes to original CharlesCD repo.

#### **How to enable GitHub Actions on your repo?**
After forking CharlesCD repo, you must go to ’Actions’ tab (on your own fork) and push the big green button. That’s it!

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

## **How to contribute?** 

### **Help us to Evolve** 

See the guidelines to submit your changes: 

### **Prepare your development environment**

CharlesCD has many modules and the environment settings are different between them. So, you should check the configuration documentation for each module.
Each module’s folders have their own README file, please check them: 

- [**Butler**](https://github.com/ZupIT/charlescd/tree/main/butler)
- [**Circle-Matcher**](https://github.com/ZupIT/charlescd/tree/main/circle-matcher)
- [**Compass**](https://github.com/ZupIT/charlescd/tree/main/compass)
- [**Gate**](https://github.com/ZupIT/charlescd/tree/main/gate)
- [**Hermes**](https://github.com/ZupIT/charlescd/tree/main/hermes)
- [**Moove**](https://github.com/ZupIT/charlescd/tree/main/moove)
- [**UI**](https://github.com/ZupIT/charlescd/tree/main/ui)
- [**Villager**](https://github.com/ZupIT/charlescd/tree/main/villager)

### **First contribution**

Contributing to a new feature is only allowed in the [**main repository**](https://github.com/ZupIT/charlescd).

### **Do you want to add a new feature or change an existing one?**
You can suggest changes for CharlesCD's in our [**forum**](https://forum.zup.com.br/). Share your ideas and collect positive feedback about the change before open an issue on GitHub. Finally, start writing code!

### **Adding a new feature**
1. Make sure your branch is based on main;
2. Follow the tutorial [**How to make a change suggestion?**](#how-to-make-a-change-suggestion);
3. Update the documentation if applicable.
4. Open a new GitHub pull request with the new code.
5. Ensure the PR description clearly describes the new feature, including the issue number.

###  **Before open an issue**
1. Check out if you are on the latest version. If you’re not, your problem may have been solved already.

2. Search under the project's [**issues**](https://github.com/ZupIT/charlescd/issues?q=is%3Aopen+is%3Aissue+label%3Abug) and make sure it’s not a known bug. 

3. If you didn't find a pre-existing issue, consider checking our [**forum**](https://forum.zup.com.br/c/en/charles/13) if the problem is non-bug-related.

### **Opening a new issue**
If you can't find an open issue for your bug/problem, please [**open a new one**](https://github.com/ZupIT/charlescd/issues/new). 

Your issue must have: 
  * A clear title and description with relevant information;
  * CharlesCD's version you are using;
  * A description of the environment where CharlesCD is running;
  * A code example (if applicable) or an executable test case that demonstrates the problem;
  * A bug label.


### **How to suggest changes?**
Follow the steps: 

**Step 1.** Click ‘Fork’ on Github, creating e.g. yourname/charlescd;

**Step 2.** Clone your project: ```git clone git@github.com:yourname/charlescd ```;

**Step 3.** ```cd charlescd ```

**Step 4.** Configure the environment(s) for module(s) that you are collaborating

**Step 5.** Create a branch: ```git checkout -b your_branch source_branch ```

**Step 6.** Test, code, test again and repeat;

**Step 7.** Commit your changes: ```git commit -s -S -m "My wonderful new evolution" ``` (don’t forget the ```-s ``` and  ```-S ``` flags);

**Step 8.** Rebase from original repo: ```git pull --rebase upstream source_branch ```;

**Step 9.** Push your commit to get it back up to your fork: ```git push origin your_branch ```.

### **Did you find a bug?**
Follow the steps to write a bug fix:

**Step 1.** Make sure your branch is based on the branch of the version where the bug was first introduced;
**Step 2.** Follow the tutorial [**How to make a change suggestion?**](#how-to-make-a-change-suggestion);
**Step 3.** Open a new GitHub pull request with the patch; 
**Step 4.** Check the PR description, it needs to describe the problem and solution, including the issue number.

## **Community**

- You can ask question and chat with us in our [**forum**](https://forum.zup.com.br/c/en/charles/13).

Thank you for considering evoluting CharlesCD!!!:heart::heart::heart:

Keep evolving.

**CharlesCD team**
