# First Deploy

After you have created your first [**module**](https://docs.charlescd.io/v/v0.2.1-en/get-started/creating-your-first-module) and registered your [**cluster crendentials**](https://docs.charlescd.io/v/v0.2.1-en/get-started/defining-a-workspace/configuracoes-de-deploy), you have finished all the steps needed to make your first deploy. Now, it is necessary to create a [**release** ](https://docs.charlescd.io/v/v0.2.1-en/reference/release)and provide it on the configured cluster. 

Charles offers two alternatives to create a release: use the [**hypothesis**](https://docs.charlescd.io/v/v0.2.1-en/reference/hyphotesis) flow chart or create with docker images already available on your configured [**registry**.](https://docs.charlescd.io/v/v0.2.1-en/get-started/defining-a-workspace/docker-registry) 

Here we will focus on the first approach with the following steps: 

1. Click on **Hypothesis** in the homepage left side bar; 
2.  Fill the name with the new hypothesis on the **Create new hypothesis** field, at the bottom of the hypothesis list and press enter.
3. At the new created hypothesis board, click on **+Card** at the bottom of the **To do** list column;
4. Type the name of your new card and press **enter**; 
5.  Left-click on the card and associate it to a Module previously created. After this, a **branch with the name of the card will be created in the configured repository**; 
6. Perform your work on this branch, after you finish, move the card to **Ready to Go**; 
7. Click on **Generate release candidate** at the bottom of the column **Ready to Go;**
8. Type the release name you want to create and click on **Generate**. A branch with the prefix "**release-darwin" will be created on the module repository, after that the configured CI tool will go off;**
9. A new card with **Building** status will show up ath the **Builds** column. Wait until its status changes to **Built**. 

After you have done the whole process above, your release will be ready to deploy. 

![Example of release created and ready to deploy](../.gitbook/assets/primeiro_deploy-1-.png)



Now, just follow the next steps to the [**Open Sea**](https://docs.charlescd.io/v/v0.2.1-en/key-concepts) deploy: 

1. On Charles homepage, click on **Circles**; 
2. Click on the Default circle \( it represents the open sea\) 
3. Click on **Override release** in upper right corner; 
4. Click on **Search for ready releases**;
5. Type the release name created above and click on **Deploy**.

After that, Charles will provide the created release on cluster in the open sea. The deploy status will be show and updated along the process. 

![Example of a deploy in open sea](../.gitbook/assets/primeiro-deploy%20%281%29.gif)

