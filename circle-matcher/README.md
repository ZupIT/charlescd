# CharlesCD Circle Matcher

This repository is part of [CharlesCD](https://github.com/ZupIT/charlescd) project.

Circle Matcher is an HTTP service that allows us to identify which segmentation (managed by CharlesCD) the application user belongs to, based on logical rules previously defined.

## How Circle Matcher works
Through CharlesCD, it is possible to deploy different versions of your applications and define which user segmentation (Circle) is going to access it. Routing takes place at the service mesh level, so every request that happens in the cluster - managed by CharlesCD - needs a segment identification (Circle's id) to work properly.

## How to use
Circle Matcher has a service that receives a JSON (without a specific contract) with the user's attributes (any attribute that matters) and returns the identifier of the circle to which it belongs.

See an sample request:

```
POST /identify HTTP/1.1
Host: YOUR_PUBLIC_CLUSTER_HOST
Content-Type: application/json

{
    "workspaceId": "2ec54c86-4d77-4053-b3ed-3692db22e794",
    "requestData": {
        "age": "27",
        "children": "2",
        "gender": "female"
    }
}

```

The response could be:

```
{
    "circles": [
        {
            "id": "bbb35775-1f7a-4f72-8fb3-d21b7274fb6f",
            "name": "Default"
        }
    ]
}

```
Then, simply use the circle identification information for any service call in your cluster. To do this, use the HTTP header **X-Circle-Id** with the value of **circles.id**.

## Documentation

Please check the [Charles Documentation].

## Contributing

Please check our [Contributing Guide].

[Postman Collection]: data/postman/CharlesCD_Villager.postman_collection.json
[Contributing Guide]: https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md

