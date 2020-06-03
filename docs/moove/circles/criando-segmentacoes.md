# Criando Segmentações

{% hint style="info" %}
As segmentações dos círculos podem ser criadas manualmente ou por arquivo.
{% endhint %}

## Segmentando Manualmente

![Cria&#xE7;&#xE3;o manual da segmenta&#xE7;&#xE3;o](../../.gitbook/assets/create-circle-dentists-bh-chrome-capture.gif)

Nesse tipo de segmentação, é possível compor lógicas mais complexas. Por exemplo:

> Clientes que são dentistas **E** moram em Uberlândia 
>
> **OU**
>
> Clientes que são psicólogos **E** moram em João Pessoa

![](../../.gitbook/assets/manually-segmentation-chrome-capture.gif)

## Segmentando por Arquivo

Nesta segmentação, é utilizada apenas a primeira coluna do _csv_ para criar as regras.

![](../../.gitbook/assets/csv-segmentation-chrome-capture.gif)

Além disso, o único operador lógico suportado até o momento é o **OR**. 

![](../../.gitbook/assets/edit-segmentation-chrome-capture.gif)

Um exempo de uso é, em um database externo, extrair os ids dos clientes que se encaixam em um perfil específico e importá-los no Charles.

