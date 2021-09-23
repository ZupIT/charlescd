
# **Contributing Guide**

This is CharlesCD contributing guide. Please read the following sections to learn how to ask questions and how to work on something in order to improve our project.

## **Welcome**
:wave:Welcome! 

## **Getting started**

1. [**Before you contribute**](#Before-you-contribute)
    1. [Legal](#Legal)
3. [**Prerequisites**](#Prerequisites)
    1. [Tests aren’t optional](#Tests-aren’t-optional)
    2. [Be aware of documentation changes](#Be-aware-of-documentation-changes)
    3. [Code reviews](#Code-reviews)
    4. [Continuous Integration](#Continuous-Integration)
    5. [Developer Certificate of Origin - DCO](#Developer-Certificate-of-Origin-DCO)
4. [**Help us to Evolve**](#Prerequisites)
    1. [How to contribute?](#How-to-contribute?)
    2. [First contribution](#First-contribution)
    3. [Do you want to add a new feature or change an existing one?](#Do-you-want-to-add-a-new-feature-or-change-an-existing-one?)
    4. [Adding a new feature](#Adding-a-new-feature)
    5. [Before open an issue](#Before-open-an-issue)
    6. [Opening a new issue](#Opening-a-new-issue)
    7. [How to make a change suggestion?](#How-to-make-a-change-suggestion?)
    8. [Did you find a bug?](#Did-you-find-a-bug?)
5. [**Community**](#Community)


## **Before you contribute**

### **Legal**
As you contribute, keep in mind that the code, docs and other materials submitted to open source projects are usually considered licensed under the same terms as the rest of the work.

- CharlesCD is licensed over [**ASL - Apache License**](https://github.com/ZupIT/charlescd/blob/main/LICENSE), version 2, so new files must have the ASL version 2 header. For more information, please check out [**Apache license**](https://www.apache.org/licenses/LICENSE-2.0).
You should configure a pre-commit Githook in your local machine, so it will help you not commit files without a license header. Please check out [more about Githooks](https://github.com/ZupIT/charlescd/blob/main/hooks/README.md).

- All contributions are subject to the [**Developer Certificate of Origin (DCO)**](https://developercertificate.org). 
When you commit, use the ```**-s** ``` option to include the Signed-off-by line at the end of the commit log message. At the root of this repository, you will find the DCO text verbatim in the [**dco.txt**](https://github.com/ZupIT/charlescd/blob/main/dco.txt) file.
You should config a pre-push Githook in your local machine to help you not push without DCO Sign Off. For more information, [check out GitHooks](https://github.com/ZupIT/charlescd/blob/main/hooks/README.md).

- All contributions should use [**GPG commit signature verification**](https://docs.github.com/en/github/authenticating-to-github/managing-commit-signature-verification/about-commit-signature-verification#gpg-commit-signature-verification). 
When you commit, use the ```**-S** ``` option to include the signing. 
To sign commits using GPG and have them verified on GitHub, follow the steps described [**in the commit signature verification section**](https://docs.github.com/en/github/authenticating-to-github/managing-commit-signature-verification/about-commit-signature-verification#gpg-commit-signature-verification).

## **Prerequisites** 

Check out the requisites before contributing to CharlesCD:

### **Tests aren’t optional**
We encourage you to write tests before the implementation, see below:

1. Bugfixes need to include a test proving the existence of the bug and why you are fixing it, if it doesn't include, it will return to the sender.
2. New features need to include a test that proves it actually works, if it doesn't include, it will return to the sender.

### **Be aware of documentation changes**
If your collaboration changes the way we use any CharlesCD functionality, you should  also update the documentation.

### **Code reviews**
All your submissions needs a review before being merged.

### **Continuous Integration**
To ensure CharlesCD is always stable, **all submissions must go through our CI pipeline.** This is part of the process of making changes and includes everyone, even CharlesCD core team members. 
- **CharlesCD CI is based on GitHub Actions:** you are able to execute it on your own fork too and all pushes or pull requests to the main branch will be checked. 
It is a good way to get some feedback before get back your changes to original CharlesCD repo.

#### How to enable GitHub Actions on your repo? 
After forking CharlesCD repo, you must go to ’Actions’ tab (on your own fork) and push the big green button. That’s it!

### **Developer Certificate of Origin - DCO**

 This is a security layer for the project and for the developers. It is mandatory.
 
 There are two ways to use DCO, see them below: 
 
**1. Command line**
 Follow the steps: 
 **Step 1:** Check out your local git:

 ```
git config --global user.name “Name”
git config --global user.email “email@domain.com.br”
```
**Step 2:** When you commit, add the sigoff via `-s` flag:

```
$ git commit -s -m "This is my commit message"
```
**2. GitHub website**

**Step 1:** When the commit changes box opens, add the following command:
```
$ git commit -m “My signed commit” Signed-off-by: username <email address>
```
Note: For this option, your e-mail must be the same in registered in GitHub. 

## **Help us to Evolve** 
### **How to contribute?** 

See the guidelines to submit evolutions: 

### **Prepare your development environment**

CharlesCD has many modules and the environment settings are different between them. So, you should check the configuration documentation for each module.
Each module’s folders have their own README file, please check them: 

- [**Butler**](https://github.com/ZupIT/charlescd/tree/main/butler)
- [**Circle-Matcher**](https://github.com/ZupIT/charlescd/tree/main/circle-matcher)
- [**Compass**](https://github.com/ZupIT/charlescd/tree/main/compass)
- [**Moove**](https://github.com/ZupIT/charlescd/tree/main/moove)
- [**Villager**](https://github.com/ZupIT/charlescd/tree/main/villager)

### **First contribution**

Contributing to a new feature is only allowed in the [**main repository**](https://github.com/ZupIT/charlescd).

### Do you want to add a new feature or change an existing one?
You can suggest a change in CharlesCD's developer discussion [**mailing list**](https://groups.google.com/forum/#!forum/charlescd-dev) or in our [**chat**](https://spectrum.chat/charlescd?tab=posts). Share your ideas and collect positive feedback about the change before open an issue on GitHub. Finally, start writing code!

### **Adding a new feature**
1. Make sure your branch is based on main;
2. Follow the tutorial [**How to make a change suggestion?**](#how-to-make-a-change-suggestion);
3. Update the documentation if applicable.
4. Open a new GitHub pull request with the new code.
5. Ensure the PR description clearly describes the new feature, including the issue number.

###  **Before open an issue**
1. Check out if you are on the latest version. If you’re not, your problem may have been solved already.

2. Search under the project's [**issues**](https://github.com/ZupIT/charlescd/issues?q=is%3Aopen+is%3Aissue+label%3Abug) and make sure it’s not a known bug. 

3. If you didn't find a pre-existing issue, consider checking with the [**mailing list**](https://groups.google.com/forum/#!forum/charlescd-dev) if the problem is non-bug-related.

### **Opening a new issue**
If you can't find an open issue for your bug/problem, please [**open a new one**](https://github.com/ZupIT/charlescd/issues/new). 

Your issue needs to have: 
  * A clear title and description with relevant information;
  * CharlesCD's version you are using;
  * A description of the environment where CharlesCD is running;
  * A code example (if applicable) or an executable test case that demonstrates the problem;
  * Add a bug label.


### **How to suggest changes?**
Follow the steps: 
**Step 1.** Click ‘Fork’ on Github, creating e.g. yourname/charlescd
**Step 2.** Clone your project: ```git clone git@github.com:yourname/charlescd ```
**Step 3.** ```cd charlescd ```
**Step 4.** Configure the environment(s) for module(s) that you are collaborating
**Step 5.** Create a branch: ```git checkout -b your_branch source_branch ```
**Step 6.** Test, code, test again and repeat.
**Step 7.** Commit your changes: ```git commit -s -S -m "My wonderful new evolution" ``` (don’t forget the ```-s ``` and  ```-S ``` flags);
**Step 8.** Rebase from original repo: ```git pull --rebase upstream source_branch ```
**Step 9.** Push your commit to get it back up to your fork: ```git push origin your_branch ```

### **Did you find a bug?**
Follow the steps to write a bugfix:

**Step 1.** Make sure your branch is based on the branch of version where the bug was first introduced;
**Step 2.** Follow the tutorial [**How to make a change suggestion?**](#how-to-make-a-change-suggestion);
**Step 3.** Open a new GitHub pull request with the patch; 
**Step 4.** Check the PR description, it needs to describe the problem and solution, including the issue number.

## **Community**

- Ask any question about CharlesCD in our [**mailing list**](https://groups.google.com/forum/#!forum/charlescd-dev) 
- Let's chat in our [**forum**](https://forum.zup.com.br/c/en/charles/13).

Thank you for considering evoluting CharlesCD!!!:heart::heart::heart:

Keep evolving.

**CharlesCD team**
