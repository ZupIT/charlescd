---
description: >-
  In this section, you will find the definitions of main concepts and
  expressions used on Charles' platform and documentation.
---

# Key concepts

## Circles

**Circles** are groups of users created from specific characteristics, inside the same environment on Charles platform. The developer is able to segment users according to the rules "AND/OR" that will make more sense to test that release later.

For example, it is possible to [**create a circle**](https://docs.charlescd.io/v/v0.2.1-en/reference/circles) of engineers from north of Brazil, another one from the southeast, and a third one with all brazilian engineers. Based on client's segmentation, it is possible to make a variety of deployment logic.

## **Hypothesis**

These are [**registered alternatives** ](https://docs.charlescd.io/v/v0.2.1-en/reference/hyphotesis) on the platform to solve a problem or to validate changes on the application integrated on Charles.

Hypothesis can have features that are directly related to modules and/or projects that were previously registered in the workspace.

## **Circle Matcher**

It is a HTTP service which allows you to identify which segmentation the user belongs to, based on predefined logic rules. For that, Circle Matcher receives a JSON request with the user's attributes and also the circle identifier of which group user belongs.

## **Components**

Components are part of the [**modules**](https://docs.charlescd.io/v/v0.2.1-en/get-started/creating-your-first-module) you create on Charles. They work as an application abstraction, which means that they have their own configuration and every part of it belongs to a module application you are working on it.

## Open Sea

This term was originated with Charles, and refers to a default segmentation that will be used for all users not linked to any circle.

For example, if you add 300 users to your database and don't specify which segmentation you want to direct your hypothesis, Charles will redirect it to all, that is when your hypothesis will fall into the open sea.

