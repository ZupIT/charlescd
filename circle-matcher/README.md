# **CharlesCD Circle Matcher** 

Circle Matcher is an HTTP service that allows us to identify which segmentation (managed by CharlesCD) the application user belongs to, based on logical rules previously defined.

## **How does Circle Matcher work?**
CharlesCD deploys different versions of your applications and it defines which user segmentation (Circle) is going to access it. The routing takes place at the service mesh level, so every request that happens in the cluster - managed by CharlesCD - needs a segment identification (Circle's id) to work properly.

## **Usage**

Circle Matcher has a service that receives a JSON (without a specific contract) with the user's attributes (any attribute that matters) and returns the identifier of the circle to which it belongs.

See a request sample:

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

And the response could be:

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
Then, use the circle identification information for any service call in your cluster. To do this, use the HTTP header **X-Circle-Id** with the value of **circles.id**.

## **Running locally**

### **Requirements**
See below the requirements to run locally: 

- **GraalVM 20.3.0 with JDK 1.8+**
- [**Docker**](https://docs.docker.com/get-docker/)
- [**Docker Compose**](https://docs.docker.com/compose/install/)
- [**Maven**](https://maven.apache.org/download.cgi)

### **How to do it?**
Follow the steps below:

**Step 1:** First up the Redis container:
```
docker-compose -f docker-compose.xml up
```

**Step 2:** Run the application (if you want to run with another Redis flavors, use the appropriate profile):
```
./run-local.sh
```

## **Documentation**

For more information about CharlesCD, please check out the [**documentation**](https://docs.charlescd.io/).

## **Contributing**

If you want to contribute to this module, access our [**Contributing Guide**](https://github.com/ZupIT/charlescd/blob/main/CONTRIBUTING.md).


[Postman Collection]: data/postman/CharlesCD_Villager.postman_collection.json
[Contributing Guide]: https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md

