# About Charles

## What is Charles?

CharlesCD is an open source tool that makes more agile, safe and continuous deploy, which allows development teams to validate their hypothesis with specific groups of users, simultaneously.

## What is circle deploy?

The circle deploy is the pioneer concept created by Charles. Thanks to it, it's possible to deploy the same application with different segmentations of users at the same time.

## What is the main difference on Charles?

Unlike other ways of deploy, Charles allows developers to perform simultaneous segmentation and agroupment of user with circles.

With the tool, the delivery process in traditionals environments occurs in longer frequencies - weekly, biweekly or even monthly - gains a new rhythm. The feedback cycle of your product becomes faster and effective, which means that you can manage your timing in a more intelligent and assertive way. ‌

Besides, developers will be more encouraged to innovate and to make more implementations of new versions, once that identifying bugs is easier and creating circles helps on minimizing the error budget.

## What is Charles' architecture?

The architecture is structured on microservices whose modules are:

* `charlescd-ui`: mirrors on front-end the workspace configuration, users, modules, hypothesis and boards, it is the plataform graphic interface. 
* `charles-moove`: manages workspace, users, modules, hypothesis and boards, it is the whole plataform structure. 
* `charles-butler`: orchestrates and manages releases and deploys. 
* `charles-circle-matcher`: manages all created circles, and also points out which circle the user belongs based on their characteristics.

![Charles&apos; architecture](../.gitbook/assets/arquitetura-charles-nova%20%282%29%20%281%29.png)

