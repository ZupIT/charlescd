# Releases

Releases are application versions. It is different from other ways of deploy that releases generally go through lots of environments until they reach production, with CharlesCD it is possible that the same release will be published for different[ **circles**](circles.md).

## How to create releases with Charles?

There are two ways to create releases with Charles:

1. Hypothesis board;
2. Existing images on docker registry.

The first one offers a better use of the product, because it works with the hypothesis concept tests during the development cycle. The second option offers the flexibility needed if you want cases which the generation of artifacts or the development process are apart from CharlesCD.

### Releases through hypothesis board

After registering a **hypothesis** on Charles, you can use the board that is automatically generated to create and manage cards that represents your hypothesis development.

The boards shows two cards categories: **the blue one represents a feature coding** and **the gray one a action that does not involve implementation.**

If you want to generate new releases, the blue cards represent features, when they are on the **Ready to Go** column, you select only one or a subset of them to build a release.

![Example of cards selection ](../.gitbook/assets/gerando-release-board-1-%20%282%29%20%281%29.gif)

As soon as a release creation is triggered, a new branch with the prefix **release-darwin** will be created on the module repository and the configured CI tool will go off. Besides that, a new card with the **'Building'** status will show up on the **Builds** column to represent a process in progress.

{% hint style="warning" %}
Triggering the pipeline of your CI tool through **release-darwin** prefix, it is expected that it will generate a image of your application and make the push for your [**registry**.](../get-started/defining-a-workspace/docker-registry.md)
{% endhint %}

Once you made it, the [**Villager**](https://github.com/ZupIT/charlescd/tree/master/villager) will watch your registry to search for the generated release. Hold on until you card status is changed to **Built**.

{% hint style="info" %}
Any cases of success or error will be shown on your release card.
{% endhint %}

![Example of release status](../.gitbook/assets/release-2%20%281%29.png)

### **Releases through existing images on configured Docker Registry**

To create a release without using the hypothesis board, it is necessary that the Docker images are already available on you [**configured registry** ](../get-started/defining-a-workspace/docker-registry.md)for the module. If this requirement is done, just click on the [**circles**](circles.md) option on Charles menu and select the circle for a release deploy to be created.

If you are creating the circle at this moment, click on **Insert release** and then Create release. If the circle is already created, click on **Override release** and then **Create release**.

On the release creation screen, fill the name and select one module and its component. On the field beside, all available images on that component will be listed on the registry. Select one and, if it's necessary, add more modules to the release, clicking on **Add module** and repeat the previous process. When all your modules are registered, click on **deploy**.

![Exemple of release creation by Registry images](../.gitbook/assets/releases-por-meio-de-imagens-existentes%20%281%29%20%281%29.gif)

After deploying this new release, it will be available to use in other circles, just look into '**Search for existing releases'** option.

## How to search for an existing release?

If the release was generated through hypothesis board on your workspace, when you create a circle deploy, you are able to search for it on '**Search for existing releases**'.

![Example of release search by circle deploy ](../.gitbook/assets/may-29-2020_17-21-33%20%281%29%20%281%29.gif)

