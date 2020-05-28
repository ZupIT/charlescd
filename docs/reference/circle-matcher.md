# Circle Matcher

Circle Matcher is a resource that allows you to validate if your [**circles**](https://docs.charlescd.io/v/v0.2.1-en/reference/circles) are in coherent segmentations. You can also use it in your applications to determine in which circle your users fit better. 

{% hint style="info" %}
One good practice is to realize this identification always when a user logs in the application. However, this can be changed according to your business needs. .
{% endhint %}

## Identifying circles through Circle ID

Once you start using the interface, it's possible to notice that there are two ways to realize the circle identification. For that, access the **Circles** menu inside a **workspace** and select the icon indicated below: 

![Identifica&#xE7;&#xE3;o do &#xED;cone do Circle Matcher](../.gitbook/assets/chrome-capture.jpg)

The two ways to make this validation are:

* **Default:** in this option, you add manually keys and values to define the characteristics of a user test. And, based on that, once you execute the **Try**,  ****you will receive all the circles related to these user.  ****

![Circle identification with Default option.](../.gitbook/assets/circle-matcher-default.gif)

* **JSON:** similar to the default option, with the difference that here you can copy and paste in **payload camp** a **JSON** of your productive environment instead of add manually. 

![Circle identification with JSON option. ](../.gitbook/assets/circle-matcher-json.gif)

{% hint style="warning" %}
If you pass informations that are off the preconfigured logic conditions in the circles, the system will return indicating that the user is on _Default_ circle, on the standard version of your application. 
{% endhint %}

## Circle identification through API

You can integrate in your applications the **Identify** resource on the [`charle-moove`](https://github.com/ZupIT/charlescd/tree/master/moove) module to detect the circles the user belongs to.

For example, considering the use of the parameters below to segment: 

![](https://lh6.googleusercontent.com/q573-961WtpntVK8NfXXvPgzSPrxLwxjx3QXRqM3vBlHFM8nAoDkpn1KD26Zfw3_wJtjnhVldYcwRUUzhbveEvqJz6n16NQFkxi0S3hh8rk6Y7OUmWtnBOl_qJekzoymQ64mFF8k)

Once you realize the requisition of identification with theses informations, compatible circles will be returned.

{% api-method method="post" host="https:" path="//api.charles-moove.com/identify" %}
{% api-method-summary %}
Identify
{% endapi-method-summary %}

{% api-method-description %}
Method used to identify circles based on the user's characteristics.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="X-Workspace-Id" type="string" required=true %}
Workspace's ID
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}

{% api-method-body-parameters %}
{% api-method-parameter name="state" type="string" required=false %}
NY
{% endapi-method-parameter %}

{% api-method-parameter name="profession" type="string" required=false %}
Lawyer 
{% endapi-method-parameter %}

{% api-method-parameter name="age" type="number" required=false %}
46 
{% endapi-method-parameter %}

{% api-method-parameter name="city" type="string" required=false %}
Stony Brook
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```
[
  {
    "id": "6577ae92-648c-11ea-bc55-0242ac130003",
    "name": "NY Lawyers"
  },
  {
    "id": "6577b112-648c-11ea-bc55-0242ac130003",
    "name": "Stony Brook's Citizens"
  }
]
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

As the example above shows, there are correspondents circles with the given informations of the user, which means that **`charles-moove`** will return a list with all the circles. Here, there are two circles that fit with this description: NY Lawyers e Stony Brook’s Citizens.

In this requisition, only the parameter **`X-Workspace-Id`** is mandatory. The requisition body is totally flexible, but it's good to remember that the keys must have the same nomenclature defined by segmentation's rules of the circle. Let's see the case below:

![](https://lh3.googleusercontent.com/FdPVIHDFeYJCkC_6Y1P3ZOBSqmNlGkl9q2_XyIayNKQo2Mp9IXBY7PzvpzW0Mej1P9Ox8AG12QiA1H0w5uozWP1UYWafcfwXLKBOf3G-ObIVoPHtYGOlWd5Ju01uLuScqtCn8qQ1)

The **Stony Brook’s Citizens** circle was created to identify users that contains as one of its characteristics the key **`city`** and the exact value **`Stony Brook`**. That means that this user won't be listed if you realize a requisition to **`Identify`** in case you inform on the requisition body the information presented on the example below:  

{% api-method method="post" host="https://" path="api.charles-circle-matcher.com/identify" %}
{% api-method-summary %}
Identify
{% endapi-method-summary %}

{% api-method-description %}
Method used to identify circles based on the user's characteristics. 
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-headers %}
{% api-method-parameter name="X-Workspace-Id" type="string" required=true %}
Workspace's ID 
{% endapi-method-parameter %}
{% endapi-method-headers %}

{% api-method-body-parameters %}
{% api-method-parameter name="aGEee" type="number" required=false %}
46
{% endapi-method-parameter %}

{% api-method-parameter name="city" type="string" required=false %}
Stony Brook
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
Listagem de todos os círculos aos quais o usuário pertence 
{% endapi-method-response-example-description %}

```
[
  {
    "id": "6577ae92-648c-11ea-bc55-0242ac130003",
    "name": "Default"
  }
]
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}





