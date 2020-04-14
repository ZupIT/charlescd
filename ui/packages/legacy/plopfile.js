module.exports = (plop) => {
  plop.setWelcomeMessage('Welcome to Darwin CLI')

  plop.setGenerator('component', {
    description: 'New component',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'Component name: ',
    }, {
      type: 'confirm',
      name: 'container',
      message: 'This is container? ',
    }],
    actions: ({ container }) => {
      const currentPath = container ? 'containers' : 'core/components'

      const defaultActions = [
        {
          type: 'add',
          path: `src/${currentPath}/{{properCase name}}/index.jsx`,
          templateFile: 'generators/component/index.hbs',
        }, {
          type: 'add',
          path: `src/${currentPath}/{{properCase name}}/styled.js`,
          templateFile: 'generators/component/styled.hbs',
        }, {
          type: 'add',
          path: `src/${currentPath}/{{properCase name}}/constants.js`,
          templateFile: 'generators/component/constants.hbs',
        }, {
          type: 'add',
          path: `src/${currentPath}/{{properCase name}}/__tests__/{{properCase name}}.spec.jsx`,
          templateFile: 'generators/component/__tests__/test.spec.hbs',
        },
      ]

      const componentActions = [
        ...defaultActions,
        {
          type: 'add',
          path: `src/${currentPath}/{{properCase name}}/stories.js`,
          templateFile: 'generators/component/stories.hbs',
        },
      ]

      const containerActions = [
        ...defaultActions,
        {
          type: 'add',
          path: 'src/containers/{{properCase name}}/state.js',
          templateFile: 'generators/component/state.hbs',
        },
        {
          type: 'add',
          path: 'src/containers/{{properCase name}}/helpers.js',
          templateFile: 'generators/component/helpers.hbs',
        },
      ]

      return container ? containerActions : componentActions
    },
  })
}
