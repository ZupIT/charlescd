# react-cookies [![Build Status](https://travis-ci.org/bukinoshita/react-cookies.svg?branch=master)](https://travis-ci.org/bukinoshita/react-cookies)

> Load and save cookies with React

## Install
```bash
$ npm install react-cookies --save
```


## Usage

```js
import { Component } from 'react'
import cookie from 'react-cookies'

import LoginPanel from './LoginPanel'
import Dashboard from './Dashboard'

class MyApp extends Component {
  constructor () {
    super()

    this.onLogin = this.onLogin.bind(this)
    this.onLogout = this.onLogout.bind(this)
  }

  componentWillMount() {
    this.state =  { userId: cookie.load('userId') }
  }

  onLogin(userId) {
    this.setState({ userId })
    cookie.save('userId', userId, { path: '/' })
  }

  onLogout() {
    cookie.remove('userId', { path: '/' })
  }

  render() {
    const { userId } = this.state

    if (!userId) {
      return <LoginPanel onSuccess={this.onLogin} />
    }

    return <Dashboard userId={userId} />
  }
}
```

_React cookies is the v1.0.4 of react-cookie with a couple changes._

## Isomorphic cookies!

To be able to access user cookies while doing server-rendering, you can use [`plugToRequest`](#user-content-plugtorequestreq-res-unplug) or [`setRawCookie`](#user-content-setrawcookiecookies).


## API

### .load(name, [doNotParse])

Load the cookie value.<br />
Returns `undefined` if the cookie does not exist.<br />
Deserialize any cookie starting with `{` or `[` unless `dotNotParse` is `true`.

#### name

Type: `string`<br/>
Required

#### doNotParse

Type: `boolean`<br/>
Default: false

#### Example

```js
import cookie from 'react-cookies'

componentWillMount() {
  this.state =  { token: cookie.load('token') }
  // => 123456789
}
```

### .loadAll()

Load all available cookies.<br />
Returns an `object` containing all cookies.

#### Example

```js
import cookie from 'react-cookies'

componentWillMount() {
  this.state =  { cookies: cookie.loadAll() }
  // => { cookies: { token: 123456789, _ga: GA198712 } }
}
```


### .select([regex])

Find all the cookies with a name that match the regex.<br />
Returns an `object` with the cookie name as the key.

#### Example

```js
import cookie from 'react-cookies'

componentWillMount() {
  this.state =  { tests: cookie.select(/\btest(er|ing|ed|s)?\b/g) }
  // => { tests: { test: 'test', 'testing': 'testing' } }
}
```

### .save(name, value, [options])

Set a cookie.

#### name

Type: `string`<br/>
Required

#### value

Type: `string`||`number`||`object`<br/>
Required

#### options

Support all the cookie options from the [RFC 6265](https://tools.ietf.org/html/rfc6265#section-4.1.2.1).

Type: `object`

##### path

Cookie path.<br/>
Use `/` as the path if you want your cookie to be accessible on all pages.

Type: `string`

##### expires

Absolute expiration date for the cookie.

Type: `object (date)`

##### maxAge

Relative max age of the cookie from when the client receives it in `seconds`.

Type: `number`

##### domain

Domain for the cookie.<br/>
Use `https://*.yourdomain.com` if you want to access the cookie in all your subdomains.

Type: `string`

##### secure

If set `true` it will only be accessible through https.

Type: `boolean`

##### httpOnly

If set `true` it will only be accessible on the server.

Type: `boolean`

#### Example

```js
import cookie from 'react-cookies'

handleButtonClick() {
  const expires = new Date()
   expires.setDate(Date.now() + 1000 * 60 * 60 * 24 * 14)

  cookie.save(
    'userId',
    '1234',
    {
      path: '/',
      expires,
      maxAge: 1000,
      domain: 'https://play.bukinoshita.io',
      secure: true
      httpOnly: true
    }
  )
}
```


### .remove(name, [options])

Remove a cookie.

#### name

Type: `string`<br/>
Required

#### options

Support all the cookie options from the [RFC 6265](https://tools.ietf.org/html/rfc6265#section-4.1.2.1).

Type: `object`

##### path

Cookie path.<br/>
Use `/` as the path if you want your cookie to be accessible on all pages.

Type: `string`

##### expires

Absolute expiration date for the cookie.

Type: `object (date)`

##### maxAge

Relative max age of the cookie from when the client receives it in `seconds`.

Type: `number`

##### domain

Domain for the cookie.<br/>
Use `https://*.yourdomain.com` if you want to access the cookie in all your subdomains.

Type: `string`

##### secure

If set `true` it will only be accessible through https.

Type: `boolean`

##### httpOnly

If set `true` it will only be accessible on the server.

Type: `boolean`

#### Example

```js
import cookie from 'react-cookies'

handleButtonClick() {
  cookie.remove('userId', { path: '/' })
}
```


### .plugToRequest(req, res): unplug()
Load the user cookies so you can do server-rendering and match the same result.<br />
Also send back to the user the new cookies.<br />
Work with [connect](https://github.com/senchalabs/connect) or [express.js](https://github.com/expressjs/express) by using the cookieParser middleware first.<br />
Use `const unplug = plugToRequest(req, res)` just before your `renderToString`.<br />
<br />
Returns `unplug()` function so it stops setting cookies on the response.


### .setRawCookie(cookies)
Load the user cookies so you can do server-rendering and match the same result.<br />
Use `setRawCookie(headers.cookie)` just before your `renderToString`.<br />
Make sure it is the raw string from the request headers.<br />


## License
[MIT](https://github.com/bukinoshita/react-cookies/blob/master/LICENSE) &copy; Bu Kinoshita
