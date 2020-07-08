# CharlesCD UI

The user interface is responsible for providing an easy-to-use interface for all resources, such as CharlesCD to facilitate your hypothesis testing and circle deployments.

## How to Use

### Requirements

  - [Node]
  - [Yarn]

Change `REACT_APP_API_URI` value in [environments/dev] dir to access the [Charles application] api.

### On terminal
Run the following commands in the [root folder] to get all dependencies installed in ui and to start the server:

```
yarn
yarn start
```

The app will start up on localhost:3000

### Testing

To run the tests execute `yarn test`.

### Building & Deploying

To build the ui, run `yarn build`. The built ui lives in `build/`.

### CRA

We use [create react app] to create a user interface. You may need define a new environment or set up a proxy, etc. Please check the [create react app docs].


## Documentation

Please check the [Charles Documentation].

## Contributing

Please check our [Contributing Guide].

[Node]: https://nodejs.org/en/download
[Yarn]: https://classic.yarnpkg.com/docs/install
[environments/dev]: ./environments/dev
[Charles application]: https://github.com/ZupIT/charlescd/tree/master/moove
[root folder]: ./
[create react app]: https://create-react-app.dev/
[create react app docs]: https://create-react-app.dev/docs/getting-started
[Charles Documentation]: https://docs.charlescd.io/ 
[Contributing Guide]: https://docs.charlescd.io/

