# What is Charles' architecture?

The architecture is structured on microservices whose modules are:

* `charlescd-ui:` mirrors on front-end the workspace configuration, users, modules, hypothesis and boards, it is the plataform graphic interface. 
* `charles-moove:` manages workspace, users, modules, hypothesis and boards, it is the whole plataform structure. 
* `charles-butler:` orchestrates and manages releases and deploys. 
* `charles-circle-matcher`: manages all created circles, and also points out which circle the user belongs based on their characteristics. 

