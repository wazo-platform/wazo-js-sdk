# Wazo's JavaScript Software Development Kit

[![npm version](https://badge.fury.io/js/%40wazo%2Fsdk.svg)](https://badge.fury.io/js/%40wazo%2Fsdk)
[![Greenkeeper badge](https://badges.greenkeeper.io/wazo-pbx/wazo-js-sdk.svg)](https://greenkeeper.io/)

The Wazo JavaScript Software Development Kit is an API wrapper making it easy for you to communicate with your Wazo server. It allows you to add Wazo functionalities to any JavaScript application you are developing.

## Usage

### Install / Add
You may install the Wazo JavaScript Software Development Kit to your project one of the following ways:
* `npm install @wazo/sdk`
* `yarn add @wazo/sdk`

### Content Delivery Networks
Alternatively, you may load the Wazo SDK from a CDN. If you choose to, you'll also have to load Axios as the SDK depends on it. Use one of the following Content Delivery Networks:

#### UNPKG
```
<script src="https://unpkg.com/axios"></script>
<script src="https://unpkg.com/@wazo/sdk"></script>
```

#### jsDelivr
```
<script src="https://cdn.jsdelivr.net/npm/axios"></script>
<script src="https://cdn.jsdelivr.net/npm/@wazo/sdk"></script>
```

### Require / Import
Depending on your preference, you may require or add the Wazo SDK to your own client application one of the following ways:
* `const wazo = require('@wazo/sdk');`
* `import wazo from '@wazo/sdk';`

### Init
```
wazo.init({
  server: 'demo.wazo.community' // required string
});
```

### Log In
```
wazo.logIn({
  expiration: // optional integer. Session life in number of seconds. If omitted, defaults to 3600 (an hour).
  username: // required string
  password: // required string
  backend: // optional string. If omitted, defaults to wazo_user
  callback: // optional callback function to receive token
});
```

### Log Out
```
wazo.logOut({
  callback: // optional callback function to receive token
});
```
