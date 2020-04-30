# How to contribute

Be welcome! Please read the following sections to learn how to ask questions and how to work on something.

## Licensing
Keep in mind as you contribute, that code, docs and other material submitted to open source projects are usually considered licensed under the same terms as the rest of the work.

CharlesCD is licensed over [Apache License](https://github.com/ZupIT/charlescd/blob/master/LICENSE), so new files must have the Apache License Version 2 header, please check [here](https://www.apache.org/licenses/LICENSE-2.0).

## Tests aren’t optional
Any bugfix that doesn’t include a test proving the existence of the bug being fixed, will be returned to sender.

Any new feature that doesn’t include a test that can’t prove they actually work, will be returned to sender.

Writing tests before the implementation is strongly encouraged.

## Be aware with documentation changes
If your collaboration changes the way you use some CharlesCD functionality, it would be great if you also include updating the documentation.

## Help us to Evolve
### Did you find a bug?
* Make sure you’re on the latest version. If you’re not on the most recent version, your problem may have been solved already.
* Search under project [issues](https://github.com/ZupIT/charlescd/issues?q=is%3Aopen+is%3Aissue+label%3Abug) to make sure it’s not a known bug.
* If you don’t find a pre-existing issue, consider checking with the [mailing list](https://groups.google.com/forum/#!forum/charlescd-dev) in case the problem is non-bug-related.
* If you can't find an open problem for your issue, please [open a new one](https://github.com/ZupIT/charlescd/issues/new). Make sure that your issue describe the bare minimum bellow; more info is almost always better:
  * A clear title and description with as much relevant information as possible
  * The version of CharlesCD are you using
  * The rich description of the environment where CharlesCD are running
  * A code example (if applicable) or an executable test case that demonstrates the problem
  * Make sure that bug label is included

### Do you intend to add a new feature or change an existing one?
* Suggest your change in the CharlesCD developer discussion [mailing list](https://groups.google.com/forum/#!forum/charlescd-dev).
* Share your ideas and collected positive feedback about the change before open an issue on GitHub.
* Start writing code!

## Submitting Evolutions
### Preparing your development environment
CharlesCD has many modules. The environment settings are different between them. Check the configuration documentation for each module (each module's directories have their own CONTRIBUTING file). 

### Our workflow suggestion
1. Click ‘Fork’ on Github, creating e.g. yourname/charlescd
2. Clone your project: ```git clone git@github.com:yourname/charlescd ```
3. ```cd charlescd ```
4. Configure the environment(s) for module(s) that you are collaborating
5. Create a branch: ```git checkout -b your_branch source_branch ```
6. Add changelog entry crediting yourself.
7. Test, code, Test again and repeat.
8. Commit your changes: ```git commit -m "My wonderful new evolution" ```
9. Push your commit to get it back up to your fork: ```git push origin HEAD ```

### Did you write a bugfix?
* Make sure your branch is based on the branch of version where the bug was first introduced.
* Open a new GitHub pull request with the patch.
* Ensure the PR description clearly describes the problem and solution, including the issue number.

### Did you write a new feature?
* Make sure your branch is based on master.
* Update the documetation if applicable.
* Open a new GitHub pull request with the new code.
* Ensure the PR description clearly describes the new feature, including the issue number.

Ask any question about CharlesCD in our [mailing list](https://groups.google.com/forum/#!forum/charlescd-dev) or in our [chat](https://spectrum.chat/charlescd?tab=posts).

Thank you for considering evoluting CharlesCD!!!:heart::heart::heart:

Keep evolving.

CharlesCD team
