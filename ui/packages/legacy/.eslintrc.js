module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "plugins": [
    "babel"
  ],
  "env": {
    "jest": true,
    "browser": true
  },
  "rules": {
    "no-param-reassign": [2, { "props": false }],
    "semi": ["error", "never"],
    "react/forbid-prop-types": "off",
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "no-confusing-arrow": ["off"],
    "padded-blocks": ["error", { "classes": "always" }],
    "linebreak-style": [2, "windows"],
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        prev: "*",
        next: "return"
      }
    ],
    "jsx-a11y/label-has-for": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/mouse-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "arrow-body-style": "off",
    "import/no-extraneous-dependencies": "off",
    "no-underscore-dangle": "off",
    "no-unused-expressions": ["error", { "allowShortCircuit": true, "allowTernary": true, "allowTaggedTemplates": true }],
    "class-methods-use-this": "off",
    "react/prefer-stateless-function": "off",
    "react/destructuring-assignment": "off",
    "react/jsx-one-expression-per-line": "off",
    "object-curly-newline": "off",
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    "babel/no-unused-expressions": "off",
    "camelcase": "off",
    "import/no-cycle": "off",
    "react/prop-types": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "no-magic-numbers": ["error"],
  },
  "settings": {
    "import/resolver": "webpack"
  }
}
