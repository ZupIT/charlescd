# CD Configuration

It is necessary to register a CD configuration linked to your docker. To be able to do that, follow the next steps:

1. Click on your name on the left bottom corner and then select **Settings;**
2. Click on **Credentials;**
3. Click on **Add CD Configuration;**
4. Select the option **Octopipe** or **Spinnaker**, which will depend on which system you use. 

## Using Octopipe

1. Define a **name** for the CD Configuration;
2. Define a **namespace;**
3. Define a **git provider;**
4. Insert a git **token;**
5. Por fim, selecione um **manager** para associar à CD Configuration. 

## Using Spinnaker

1. Define a **name** for the CD Configuration;
2. Define a **namespace**.
3. Insert a git **token;**
4. Select a **manager** to associate with the CD Configuration. 

![](../.gitbook/assets/cd-configuration-2%20%281%29%20%281%29.gif)

### **Default**

This option must be used when the application’s cluster is the same where Octopipe is installed. This way it is not necessary to create an extra authentication mechanism. ****

### **EKS**

For a cluster managed by EKS \(Elastic Kubernetes Service\),you only have to select the option and fill the following fields:

1. **AWS SID:** Statement ID**;**
2. **AWS Secret:** Access key to EKS cluster; 
3. **AWS Region:** Region where the EKS cluster is installed; 
4. **AWS Cluster Name:** EKS’s cluster name.

### **Others**

For the other cloud providers, we use a simpler approach, that only a few _kubeconfig_ fields must be used. Here they are: 

1. **Host:** Cluster URL's access;
2. **Client Certificate:** _kubeconfig_ "client-certificate-data" field;
3. **Client Key:** _kubeconfig_  "client-key-data" field;
4. **CA Data:** _kubeconfig_  "certificate-authority-data" field.

All the information provided above is encrypted by Charles. Once this process is done, it is possible to associate the configuration in modules and after that deploy versions of them.  


