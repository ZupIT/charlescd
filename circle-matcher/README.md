# CharlesCD Circle Matcher

This repository is part of [CharlesCD](https://github.com/ZupIT/charlescd) project.

Circle Matcher is an HTTP service that allows us to identify which segmentation (managed by CharlesCD) the application user belongs to, based on logical rules previously defined.

## How it works
Through CharlesCD, it is possible to deploy different versions of your applications and define which user segmentation (Circle) is going to access it. Routing takes place at the service mesh level, so every request that happens in the cluster - managed by CharlesCD - needs a segment identification (Circle's id) to work properly.

Circle Matcher is a service that receives a JSON (without a specific contract) with the user's attributes (any attribute that matters) and returns the identifier of the circle to which it belongs.

See an sample request:

```
POST /identify HTTP/1.1
Host: YOUR_PUBLIC_CLUSTER_HOST
Content-Type: application/json
X-Application-Id: CHARLESCD_WORKSPACE_ID

{
	"age": "27",
	"children": "2",
	"gender": "female"
}

```

The response could be:

```
{
    "circles": [
        {
            "id": "3ab6ec63-6378-4deb-9c74-97294ed75bcb",
            "name": "Some Circle Name"
        }
    ]
}

```
Then, simply use the circle identification information for any service call in your cluster. To do this, use the HTTP header **X-Circle-Id** with the value of **circles.id**.

Installation instructions [here](https://docs.charlescd.io/usando-o-charles/instalacao-do-charles).

See the CharlesCD [documentation](https://docs.charlescd.io) for more information.
