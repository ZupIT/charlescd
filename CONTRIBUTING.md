# How to contribute

Be welcome! Please read the following sections to learn how to ask questions and how to work on something.

## Before you contribute
### Legal
Keep in mind as you contribute, that code, docs and other material submitted to open source projects are usually considered licensed under the same terms as the rest of the work.

CharlesCD is licensed over [ASL - Apache License](https://github.com/ZupIT/charlescd/blob/master/LICENSE), version 2, so new files must have the ASL version 2 header, please check [here](https://www.apache.org/licenses/LICENSE-2.0).

All contributions are subject to the [Developer Certificate of Origin (DCO)](https://developercertificate.org). When committing use the ```-s ``` option to include the Signed-off-by line at the end of the commit log message. At root of this repository it was included the DCO text verbatim in the [dco.txt](https://github.com/ZupIT/charlescd/blob/master/dco.txt) file.

### Tests aren’t optional
We strongly encourage you write tests before the implementation:
* Any bugfix that doesn’t include a test proving the existence of the bug being fixed, will be returned to sender.
* Any new feature that doesn’t include a test that can’t prove they actually work, will be returned to sender.

### Be aware with documentation changes
If your collaboration changes the way you use some CharlesCD functionality, it would be great if you also include updating the documentation.

### Code reviews
All submissions need to be reviewed before being merged.

### Continuous Integration
To ensure that CharlesCD is always stable, all submissions must go through our CI pipeline. This is part of the process of making changes and includes everyone, even CharlesCD core team members. CharlesCD CI is based on GitHub Actions, so you be able to execute it on your own fork too. All pushes or pull requests to master branch will be checked. It is a good way to get some feedback before get back your changes to original CharlesCD repo.

To enable GitHub Actions on your repo, after fork CharlesCD repo, just go to ’Actions’ tab (on your own fork) and push the big green button. That’s it!

## Help us to Evolve
### Did you find a bug?
#### Before open a new issue
Make sure you’re on the latest version. If you’re not on the most recent version, your problem may have been solved already.

Search under project [issues](https://github.com/ZupIT/charlescd/issues?q=is%3Aopen+is%3Aissue+label%3Abug) to make sure it’s not a known bug. If you don’t find a pre-existing issue, consider checking with the [mailing list](https://groups.google.com/forum/#!forum/charlescd-dev) in case the problem is non-bug-related.

#### Reporting a new issue
If you can't find an open problem for your issue, please [open a new one](https://github.com/ZupIT/charlescd/issues/new). Make sure that your issue describe the bare minimum bellow:
  * A clear title and description with as much relevant information as possible
  * The version of CharlesCD are you using
  * The rich description of the environment where CharlesCD are running
  * A code example (if applicable) or an executable test case that demonstrates the problem
  * Make sure that bug label is included

### Do you intend to add a new feature or change an existing one?
Suggest your change in the CharlesCD developer discussion [mailing list](https://groups.google.com/forum/#!forum/charlescd-dev) or in our [chat](https://spectrum.chat/charlescd?tab=posts). Share your ideas and collect positive feedback about the change before open an issue on GitHub. Finally, start writing code!

## Submitting Evolutions
### Preparing your development environment
CharlesCD has many modules. The environment settings are different between them. Check the configuration documentation for each module (each module’s folders have their own BUILDING file, please check them). 

### Our step-by-step making changes suggestion
1. Click ‘Fork’ on Github, creating e.g. yourname/charlescd
2. Clone your project: ```git clone git@github.com:yourname/charlescd ```
3. ```cd charlescd ```
4. Configure the environment(s) for module(s) that you are collaborating
5. Create a branch: ```git checkout -b your_branch source_branch ```
6. Test, code, test again and repeat.
7. Commit your changes: ```git commit -s -m "My wonderful new evolution" ``` (don’t forget the ```-s ``` flag)
9. Rebase from original repo: ```git pull --rebase upstream source_branch ```
8. Push your commit to get it back up to your fork: ```git push origin your_branch ```

### Writing a bugfix
1. Make sure your branch is based on the branch of version where the bug was first introduced.
2. We recommend follow [Our step-by-step making changes suggestion](#our-step-by-step-making-changes-suggestion).
3. Open a new GitHub pull request with the patch.
4. Ensure the PR description clearly describes the problem and solution, including the issue number.

### Writing a new feature?
1. Make sure your branch is based on master.
2. We recommend follow [Our step-by-step making changes suggestion](#our-step-by-step-making-changes-suggestion).
3. Update the documetation if applicable.
4. Open a new GitHub pull request with the new code.
5. Ensure the PR description clearly describes the new feature, including the issue number.

Ask any question about CharlesCD in our [mailing list](https://groups.google.com/forum/#!forum/charlescd-dev) or in our [chat](https://spectrum.chat/charlescd?tab=posts).

Thank you for considering evoluting CharlesCD!!!:heart::heart::heart:

Keep evolving.

CharlesCD team
