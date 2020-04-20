import { Rules } from 'modules/Circles/Segments';

export interface Build {
  id: string;
  tag: string;
  artifacts?: Artifact[];
}

export interface Artifact {
  id: string;
  artifact: string;
  version: string;
  componentName: string;
  moduleName: string;
}

export interface Deployment {
  id: string;
  deployedAt: string;
  status: string;
  build: Build;
  artifacts: Artifact[];
}

export interface Author {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  createdAt: string;
}

export interface Circle {
  id: string;
  name: string;
  author: Author;
  createdAt: string;
  deployment: Deployment;
  rules: Rules;
}
