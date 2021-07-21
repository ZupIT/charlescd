# GitHooks

Hooks are programs you can place in a git hooks directory to trigger actions at certain points in git's execution. 

In CharlesCD we have two githooks:

## Pre-Commit

This hook runs during ```git commit```, before you even type in a commit message. In CharlesCD is used
to verify if the changed files in commit have license header appropriately.


## Pre-Push

This hook runs during ```git push```, after the remote refs have been updated but before any objects have been transferred. 


# Configuration

The hooks are all stored in the hooks subdirectory of the Git directory. 
In most projects, that’s ```.git/hooks```.
To config the CharlesCD hooks copy the files ```pre-commit``` and ```pre-push``` to ```charlescd/.git/hooks``` directory in your local CharlesCD project.