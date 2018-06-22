# Wazo JavaScript Software Development Kit

[![Greenkeeper badge](https://badges.greenkeeper.io/wazo-pbx/wazo-js-sdk.svg)](https://greenkeeper.io/)

## Using

### Add
You may add the Wazo JavaScript Software Development Kit to your project one of the following ways:

* `yarn add @wazo/sdk`
* `npm install @wazo/sdk`
* `<script src="https://unpkg.com/@wazo/sdk"></script>`

### Import
* `import wazo from '@wazo/sdk';`
* `const wazo = require('@wazo/sdk');`

### Init
```
wazo.init({
  server: 'demo.wazo.community' // required string
});
```

### Log In
```
wazo.logIn({
  expiration: // optional integer. Session life in number of seconds. If omitted, defaults to one hour.
  username: // required string
  password: // required string
  callback: // optional callback function to receive token
});
```

### Log Out
```
wazo.logOut({
  callback: // optional callback function to receive token
});
```

## Contributing
* `yarn watch`
* `npm run watch`
