# Wazo JavaScript Software Development Kit

[![Greenkeeper badge](https://badges.greenkeeper.io/wazo-pbx/wazo-js-sdk.svg)](https://greenkeeper.io/)

## Usage

### Add / Install
You may add the Wazo JavaScript Software Development Kit to your project one of the following ways:
* `yarn add @wazo/sdk axios`
* `npm install @wazo/sdk axios`

### Content Delivery Networks
Alternatively, you may use one of the following Content Delivery Networks:

#### UNPKG
```
<script src="https://unpkg.com/@wazo/sdk"></script>
<script src="https://unpkg.com/axios"></script>
```

#### jsDelivr
```
<script src="https://cdn.jsdelivr.net/npm/@wazo/sdk@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/axios"></script>
```

### Import / Require
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
