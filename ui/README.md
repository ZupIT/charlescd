# CharlesCD UI

The user interface is responsible for providing an easy-to-use interface for all resources, such as CharlesCD to facilitate your hypothesis testing and circle deployments.

## How to Use

### Requirements

- [Node]
- [npm]

Change `REACT_APP_API_URI` value in [environments/dev] dir to access the [Charles application] api.

### On terminal

Run the following commands in the [root folder] to get all dependencies installed in ui and to start the server:

```
npm install
npm run start
```

The app will start up on localhost:3000

### How to start the app with mocks

Run the following commands in the [root folder] to get all dependencies installed in ui and to start the server:

```
npm install
npm run start:local
```

`We are still working on mock improvements`

### Testing

To run the tests execute `npm run test`.

### Run single test

To run single test execute `npm run test:watch -- --testPathPattern [your-file-path]`.

### Building & Deploying

To build the ui, run `npm run build`. The built ui lives in `build/`.

### CRA

We use [create react app] to create a user interface. You may need define a new environment or set up a proxy, etc. Please check the [create react app docs].

## Documentation

Please check the [Charles Documentation].

## Contributing

Please check our [Contributing Guide].

[node]: https://nodejs.org/en/download
[npm]: https://www.npmjs.com/
[environments/dev]: ./environments/dev
[charles application]: https://github.com/ZupIT/charlescd/tree/master/moove
[root folder]: ./
[create react app]: https://create-react-app.dev/
[create react app docs]: https://create-react-app.dev/docs/getting-started
[charles documentation]: https://docs.charlescd.io/
[contributing guide]: https://docs.charlescd.io/
