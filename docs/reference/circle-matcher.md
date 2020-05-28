# Circle Matcher

Circle Matcher is a HTTP service that allows you validade and/or identify, through defined logic rules during segmentations creation, if your circles are able to find the users you want them to. 

There are two ways to validade segmentation through Circle Matcher:

1. **Default:** it is the manual validation where you will add up all the keys that defines the predetermined characteristic to a circle. _-- é a validação manual, em que você vai adicionando todas as chaves que definem as características pré-determinadas para_ círculo.   
2. **JSON:** it is a validation which goes straight to the JSON on your production environment and inserts a field on the paylod so it will make the try. _a validação na qual você vai direto no JSON do seu ambiente produtivo e insere no campo de payload para, em seguida, fazer o try._

If you pass an attribute that is out of the configured conditions on the circles, the system will return that specific user is in [**open sea**](https://docs.charlescd.io/principais-conceitos#mar-aberto), which means, it is in the general circle segmentation. 

## Circles identification

If after the circle creation you notice it is necessary the use of the Circle Matcher to test your segmentation rules, you can integrate to your application the `charles-circle-matcher` module Identify resource, so you will be able to detect circles which your user belongs to.

For example, if you use the following parameters to segment:  


![](https://lh6.googleusercontent.com/q573-961WtpntVK8NfXXvPgzSPrxLwxjx3QXRqM3vBlHFM8nAoDkpn1KD26Zfw3_wJtjnhVldYcwRUUzhbveEvqJz6n16NQFkxi0S3hh8rk6Y7OUmWtnBOl_qJekzoymQ64mFF8k)

When performing the identification request with the following information, compatible circles will return.   


{% api-method method="get" host="https:" path="//api.charles-circle-matcher.com/identify" %}
{% api-method-summary %}
Identify
{% endapi-method-summary %}

{% api-method-description %}

{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="x-application-id" type="string" required=true %}
Workspace's ID
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}

{% api-method-body-parameters %}
{% api-method-parameter name="State" type="string" required=false %}
NY
{% endapi-method-parameter %}

{% api-method-parameter name="Profession" type="string" required=false %}
Lawyer 
{% endapi-method-parameter %}

{% api-method-parameter name="Age" type="number" required=false %}
46 
{% endapi-method-parameter %}

{% api-method-parameter name="City" type="string" required=false %}
Stony Brook
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```
{ 
    "circles": [ 
    { 
    "id": "6577ae92-648c-11ea-bc55-0242ac130003", "name": "NY Lawyers" 
},  { 
    "id": "6577b112-648c-11ea-bc55-0242ac130003", 
    "name": "Stony Brook's Citizens" 
    } 
  ] 
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

As our example shows circles with corresponding information about a user, charles-circle-matcher is returning a list with them. In this case, two circles fit in to: NY Lawyers e Stony Brook’s Citizens.

**‌**On this request only the x-application-id is required. The body is totally flexible, however it is important to remember the keys must have the same defined name on the segmentation circle rules. Check this next example:  


![](https://lh3.googleusercontent.com/FdPVIHDFeYJCkC_6Y1P3ZOBSqmNlGkl9q2_XyIayNKQo2Mp9IXBY7PzvpzW0Mej1P9Ox8AG12QiA1H0w5uozWP1UYWafcfwXLKBOf3G-ObIVoPHtYGOlWd5Ju01uLuScqtCn8qQ1)

The Stony Brook’s Citizens circle was created to identify users that have the same characteristic key ‘city’. Thus, it will not be on the list when making a request to Identify, if the body is informed like in the example below:

When the user doesnt fit to any segmentation, the system returns indicating that it fits in the open sea, which means a general segmentation that includes all users out of a specific circle.   


{% api-method method="get" host="https://" path="api.charles-circle-matcher.com/identify" %}
{% api-method-summary %}
Open Sea
{% endapi-method-summary %}

{% api-method-description %}

{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-headers %}
{% api-method-parameter name="x-application-id" type="string" required=true %}
Workspace's ID 
{% endapi-method-parameter %}
{% endapi-method-headers %}

{% api-method-body-parameters %}
{% api-method-parameter name="Age" type="number" required=false %}
46
{% endapi-method-parameter %}

{% api-method-parameter name="City" type="string" required=false %}
Stony Brook
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
List with all circles a user belongs to 
{% endapi-method-response-example-description %}

```
{
   "circles":  [
    {
       "id": 6577ae92-648c-11ea-bc55-0242ac130003", 
       "name": "NY Lawyers"
    },
    { 
       "id": 6577b1112-648c-11ea-bc55-0242ac30003",
       "name": "Stony Brook's Citizens"
    }
  ]
}   
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

It is a good thing to always make this identification when the user logs in the application. Anyhow, this can be altered according to your business rules.  


