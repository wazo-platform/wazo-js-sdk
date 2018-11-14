(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['@wazo/sdk'] = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var base64 = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	    module.exports = factory(global);
	}((
	    typeof self !== 'undefined' ? self
	        : typeof window !== 'undefined' ? window
	        : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal
	: commonjsGlobal
	), function(global) {
	    // existing version for noConflict()
	    var _Base64 = global.Base64;
	    var version = "2.4.9";
	    // if node.js and NOT React Native, we use Buffer
	    var buffer;
	    if (module.exports) {
	        try {
	            buffer = eval("require('buffer').Buffer");
	        } catch (err) {
	            buffer = undefined;
	        }
	    }
	    // constants
	    var b64chars
	        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	    var b64tab = function(bin) {
	        var t = {};
	        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
	        return t;
	    }(b64chars);
	    var fromCharCode = String.fromCharCode;
	    // encoder stuff
	    var cb_utob = function(c) {
	        if (c.length < 2) {
	            var cc = c.charCodeAt(0);
	            return cc < 0x80 ? c
	                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
	                                + fromCharCode(0x80 | (cc & 0x3f)))
	                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
	                   + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
	                   + fromCharCode(0x80 | ( cc         & 0x3f)));
	        } else {
	            var cc = 0x10000
	                + (c.charCodeAt(0) - 0xD800) * 0x400
	                + (c.charCodeAt(1) - 0xDC00);
	            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
	                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
	                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
	                    + fromCharCode(0x80 | ( cc         & 0x3f)));
	        }
	    };
	    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
	    var utob = function(u) {
	        return u.replace(re_utob, cb_utob);
	    };
	    var cb_encode = function(ccc) {
	        var padlen = [0, 2, 1][ccc.length % 3],
	        ord = ccc.charCodeAt(0) << 16
	            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
	            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
	        chars = [
	            b64chars.charAt( ord >>> 18),
	            b64chars.charAt((ord >>> 12) & 63),
	            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
	            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
	        ];
	        return chars.join('');
	    };
	    var btoa = global.btoa ? function(b) {
	        return global.btoa(b);
	    } : function(b) {
	        return b.replace(/[\s\S]{1,3}/g, cb_encode);
	    };
	    var _encode = buffer ?
	        buffer.from && Uint8Array && buffer.from !== Uint8Array.from
	        ? function (u) {
	            return (u.constructor === buffer.constructor ? u : buffer.from(u))
	                .toString('base64')
	        }
	        :  function (u) {
	            return (u.constructor === buffer.constructor ? u : new  buffer(u))
	                .toString('base64')
	        }
	        : function (u) { return btoa(utob(u)) }
	    ;
	    var encode = function(u, urisafe) {
	        return !urisafe
	            ? _encode(String(u))
	            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
	                return m0 == '+' ? '-' : '_';
	            }).replace(/=/g, '');
	    };
	    var encodeURI = function(u) { return encode(u, true) };
	    // decoder stuff
	    var re_btou = new RegExp([
	        '[\xC0-\xDF][\x80-\xBF]',
	        '[\xE0-\xEF][\x80-\xBF]{2}',
	        '[\xF0-\xF7][\x80-\xBF]{3}'
	    ].join('|'), 'g');
	    var cb_btou = function(cccc) {
	        switch(cccc.length) {
	        case 4:
	            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
	                |    ((0x3f & cccc.charCodeAt(1)) << 12)
	                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
	                |     (0x3f & cccc.charCodeAt(3)),
	            offset = cp - 0x10000;
	            return (fromCharCode((offset  >>> 10) + 0xD800)
	                    + fromCharCode((offset & 0x3FF) + 0xDC00));
	        case 3:
	            return fromCharCode(
	                ((0x0f & cccc.charCodeAt(0)) << 12)
	                    | ((0x3f & cccc.charCodeAt(1)) << 6)
	                    |  (0x3f & cccc.charCodeAt(2))
	            );
	        default:
	            return  fromCharCode(
	                ((0x1f & cccc.charCodeAt(0)) << 6)
	                    |  (0x3f & cccc.charCodeAt(1))
	            );
	        }
	    };
	    var btou = function(b) {
	        return b.replace(re_btou, cb_btou);
	    };
	    var cb_decode = function(cccc) {
	        var len = cccc.length,
	        padlen = len % 4,
	        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
	            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
	            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
	            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
	        chars = [
	            fromCharCode( n >>> 16),
	            fromCharCode((n >>>  8) & 0xff),
	            fromCharCode( n         & 0xff)
	        ];
	        chars.length -= [0, 0, 2, 1][padlen];
	        return chars.join('');
	    };
	    var atob = global.atob ? function(a) {
	        return global.atob(a);
	    } : function(a){
	        return a.replace(/[\s\S]{1,4}/g, cb_decode);
	    };
	    var _decode = buffer ?
	        buffer.from && Uint8Array && buffer.from !== Uint8Array.from
	        ? function(a) {
	            return (a.constructor === buffer.constructor
	                    ? a : buffer.from(a, 'base64')).toString();
	        }
	        : function(a) {
	            return (a.constructor === buffer.constructor
	                    ? a : new buffer(a, 'base64')).toString();
	        }
	        : function(a) { return btou(atob(a)) };
	    var decode = function(a){
	        return _decode(
	            String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
	                .replace(/[^A-Za-z0-9\+\/]/g, '')
	        );
	    };
	    var noConflict = function() {
	        var Base64 = global.Base64;
	        global.Base64 = _Base64;
	        return Base64;
	    };
	    // export Base64
	    global.Base64 = {
	        VERSION: version,
	        atob: atob,
	        btoa: btoa,
	        fromBase64: decode,
	        toBase64: encode,
	        utob: utob,
	        encode: encode,
	        encodeURI: encodeURI,
	        btou: btou,
	        decode: decode,
	        noConflict: noConflict,
	        __buffer__: buffer
	    };
	    // if ES5 is available, make Base64.extendString() available
	    if (typeof Object.defineProperty === 'function') {
	        var noEnum = function(v){
	            return {value:v,enumerable:false,writable:true,configurable:true};
	        };
	        global.Base64.extendString = function () {
	            Object.defineProperty(
	                String.prototype, 'fromBase64', noEnum(function () {
	                    return decode(this)
	                }));
	            Object.defineProperty(
	                String.prototype, 'toBase64', noEnum(function (urisafe) {
	                    return encode(this, urisafe)
	                }));
	            Object.defineProperty(
	                String.prototype, 'toBase64URI', noEnum(function () {
	                    return encode(this, true)
	                }));
	        };
	    }
	    //
	    // export Base64 to the namespace
	    //
	    if (global['Meteor']) { // Meteor.js
	        Base64 = global.Base64;
	    }
	    // module.exports and AMD are mutually exclusive.
	    // module.exports has precedence.
	    if (module.exports) {
	        module.exports.Base64 = global.Base64;
	    }
	    // that's it!
	    return {Base64: global.Base64}
	}));
	});
	var base64_1 = base64.Base64;

	/*       */

	class BadResponse extends Error {
	  static fromResponse(error        , status        ) {
	    return new BadResponse(error.message, status, error.timestamp, error.error_id, error.details);
	  }

	  static fromText(response        , status        ) {
	    return new BadResponse(response, status);
	  }

	                  
	                 
	                     
	                   
	                   

	  constructor(
	    message        ,
	    status        ,
	    timestamp          = null,
	    errorId          = null,
	    details          = null
	  ) {
	    super(message);

	    this.timestamp = timestamp;
	    this.status = status;
	    this.errorId = errorId;
	    this.details = details;
	  }
	}

	/*       */

	class ServerError extends BadResponse {
	  static fromResponse(error        , status        ) {
	    return new ServerError(error.message, status, error.timestamp, error.error_id, error.details);
	  }

	  static fromText(response        , status        ) {
	    return new ServerError(response, status);
	  }
	}

	/*       */

	class Logger {
	  static hasDebug() {
	    return typeof process !== 'undefined' && (+process.env.DEBUG === 1 || process.env.DEBUG === 'true');
	  }

	  static logRequest(url        , { method, body, headers }        , response        ) {
	    if (!Logger.hasDebug()) {
	      return;
	    }

	    const { status } = response;

	    let curl = `${status} - curl ${method !== 'get' ? `-X ${method.toUpperCase()}` : ''}`;
	    Object.keys(headers).forEach(headerName => {
	      curl += ` -H '${headerName}: ${headers[headerName]}'`;
	    });

	    curl += ` ${url}`;

	    if (body) {
	      curl += ` -d '${body}'`;
	    }

	    console.info(curl);
	  }
	}

	/*       */
	                                             

	const methods = ['head', 'get', 'post', 'put', 'delete'];

	// Use a function here to be able to mock it in tests
	const realFetch = () => {
	  if (typeof document !== 'undefined') {
	    // Browser
	    return window.fetch;
	  }

	  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
	    // React native
	    return fetch;
	  }

	  // nodejs
	  // this package is disable for react-native in package.json because it requires nodejs modules
	  return require('node-fetch/lib/index');
	};

	class ApiRequester {
	                 
	                 

	                 
	                
	                 
	                
	                   

	  // eslint-disable-next-line
	  static successResponseParser(response        , isJson         ) {
	    return response.status === 204;
	  }

	  static defaultParser(response        ) {
	    return response.json().then((data        ) => data);
	  }

	  static getHeaders(header                  )         {
	    if (header instanceof Object) {
	      return header;
	    }

	    return {
	      'X-Auth-Token': header,
	      Accept: 'application/json',
	      'Content-Type': 'application/json'
	    };
	  }

	  static getQueryString(obj        )         {
	    return Object.keys(obj)
	      .filter(key => obj[key])
	      .map(key => `${key}=${encodeURIComponent(obj[key])}`)
	      .join('&');
	  }

	  static base64Encode(str        )         {
	    return typeof btoa !== 'undefined' ? btoa(str) : base64_1.encode(str);
	  }

	  // @see https://github.com/facebook/flow/issues/183#issuecomment-358607052
	  constructor({ server, agent = null }                                              ) {
	    this.server = server;
	    this.agent = agent;

	    methods.forEach(method => {
	      // $FlowFixMe
	      ApiRequester.prototype[method] = function sugar(...args) {
	        // Add method in arguments passed to `call`
	        args.splice(1, 0, method);

	        return this.call.call(this, ...args);
	      };
	    });
	  }

	  call(
	    path        ,
	    method         = 'get',
	    body          = null,
	    headers                    = null,
	    parse           = ApiRequester.defaultParser
	  )               {
	    const url = this.computeUrl(method, path, body);
	    const newBody = body && method !== 'get' ? JSON.stringify(body) : null;
	    const isHead = method === 'head';
	    const hasEmptyResponse = method === 'delete' || isHead;
	    const newParse = hasEmptyResponse ? ApiRequester.successResponseParser : parse;
	    const options = {
	      method,
	      body: newBody,
	      headers: headers ? ApiRequester.getHeaders(headers) : {},
	      agent: this.agent
	    };

	    return realFetch()(url, options).then(response => {
	      const contentType = response.headers.get('content-type') || '';
	      const isJson = contentType.indexOf('application/json') !== -1;

	      Logger.logRequest(url, options, response);

	      // Throw an error only if status >= 500
	      if ((isHead && response.status >= 500) || (!isHead && response.status >= 400)) {
	        const promise = isJson ? response.json() : response.text();
	        const exceptionClass = response.status >= 500 ? ServerError : BadResponse;

	        return promise.then(err => {
	          throw typeof err === 'string'
	            ? exceptionClass.fromText(err, response.status)
	            : exceptionClass.fromResponse(err, response.status);
	        });
	      }

	      return newParse(response, isJson);
	    });
	  }

	  computeUrl(method        , path        , body         )         {
	    const url = `${this.baseUrl}/${path}`;

	    return method === 'get' && body && Object.keys(body).length ? `${url}?${ApiRequester.getQueryString(body)}` : url;
	  }

	  get baseUrl()         {
	    return `https://${this.server}/api`;
	  }
	}

	//      

	var newFrom = (instance     , ToClass     ) => {
	  const args = {};
	  Object.getOwnPropertyNames(instance).forEach(prop => {
	    args[prop] = instance[prop];
	  });

	  return new ToClass(args);
	};

	//      

	                  
	                  
	                
	             
	                                              
	  

	                     
	                           
	                         
	                               
	            
	  

	                      
	             
	                              
	  

	class Line {
	             
	                               

	  static parse(plain              )       {
	    return new Line({
	      id: plain.id,
	      extensions: plain.extensions
	    });
	  }

	  static newFrom(profile      ) {
	    return newFrom(profile, Line);
	  }

	  constructor({ id, extensions }                = {}) {
	    this.id = id;
	    this.extensions = extensions;
	  }
	}

	//      

	                 
	                      
	                  
	  

	const FORWARD_KEYS = {
	  BUSY: 'busy',
	  NO_ANSWER: 'noanswer',
	  UNCONDITIONAL: 'unconditional'
	};

	                               
	                      
	                   
	             
	  

	class ForwardOption {
	                      
	                   
	              

	  static parse(plain          , key        )                {
	    return new ForwardOption({
	      destination: plain.destination || '',
	      enabled: plain.enabled,
	      key
	    });
	  }

	  static newFrom(profile               ) {
	    return newFrom(profile, ForwardOption);
	  }

	  constructor({ destination, enabled, key }                         = {}) {
	    this.destination = destination;
	    this.enabled = enabled;
	    this.key = key;
	  }

	  setDestination(number        )                {
	    this.destination = number;

	    return this;
	  }

	  is(other               ) {
	    return this.key === other.key;
	  }
	}

	//      

	const PRESENCE = {
	  AVAILABLE: 'available',
	  DO_NOT_DISTURB: 'donotdisturb',
	  DISCONNECTED: 'disconnected'
	};

	                        
	                                              
	                    
	                     
	                   
	                    
	               
	                
	               
	                                                                                                                    
	                              
	                           
	     
	             
	                   
	                    
	                   
	                
	             
	           
	                          
	                      
	      
	               
	                          
	                      
	      
	                    
	                          
	                      
	     
	    
	                               
	             
	          
	                      
	     
	   
	  

	                         
	             
	                    
	                   
	                
	                     
	                   
	                       
	                                 
	                         
	                   
	  

	class Profile {
	             
	                    
	                   
	                
	                     
	                   
	                       
	                                 
	                         
	                    

	  static parse(plain                 )          {
	    return new Profile({
	      id: plain.uuid,
	      firstName: plain.firstName || plain.firstname || '',
	      lastName: plain.lastName || plain.lastname || '',
	      email: plain.email,
	      lines: plain.lines.map(line => Line.parse(line)),
	      username: plain.username,
	      mobileNumber: plain.mobile_phone_number || '',
	      forwards: [
	        ForwardOption.parse(plain.forwards.unconditional, FORWARD_KEYS.UNCONDITIONAL),
	        ForwardOption.parse(plain.forwards.noanswer, FORWARD_KEYS.NO_ANSWER),
	        ForwardOption.parse(plain.forwards.busy, FORWARD_KEYS.BUSY)
	      ],
	      doNotDisturb: plain.services.dnd.enabled
	    });
	  }

	  static newFrom(profile         ) {
	    return newFrom(profile, Profile);
	  }

	  constructor({
	    id,
	    firstName,
	    lastName,
	    email,
	    lines,
	    username,
	    mobileNumber,
	    forwards,
	    doNotDisturb,
	    presence
	  }                   = {}) {
	    this.id = id;
	    this.firstName = firstName;
	    this.lastName = lastName;
	    this.email = email;
	    this.lines = lines;
	    this.username = username;
	    this.mobileNumber = mobileNumber;
	    this.forwards = forwards;
	    this.doNotDisturb = doNotDisturb;
	    this.presence = presence;
	  }

	  hasId(id        ) {
	    return id === this.id;
	  }

	  setMobileNumber(number        ) {
	    this.mobileNumber = number;

	    return this;
	  }

	  setForwardOption(forwardOption               ) {
	    const updatedForwardOptions = this.forwards.slice();
	    const index = updatedForwardOptions.findIndex(forward => forward.is(forwardOption));
	    updatedForwardOptions.splice(index, 1, forwardOption);

	    this.forwards = updatedForwardOptions;

	    return this;
	  }

	  setDoNotDisturb(enabled         ) {
	    this.doNotDisturb = enabled;

	    return this;
	  }

	  setPresence(presence        ) {
	    this.presence = presence;

	    return this;
	  }
	}

	//      

	                          
	                    
	                   
	                      
	                 
	                   
	                      
	                    
	               
	  

	                        
	                 
	                            
	              
	                    
	                    
	                      
	                        
	                      
	                           
	   
	  

	                         
	                               
	               
	                                
	                                 
	  

	                                
	             
	                     
	                    
	                  
	                 
	                      
	                    
	                   
	                
	                    
	                     
	                   
	  

	                         
	              
	                
	                
	                  
	                      
	                 
	                      
	                    
	                   
	                
	                      
	                     
	                    
	                  
	                    
	                  
	                      
	               
	  

	class Contact {
	              
	                
	                
	                  
	                      
	                 
	                      
	                    
	                   
	                
	                      
	                     
	                    
	                  
	                   
	                  
	                

	  static merge(oldContacts                , newContacts                )                 {
	    return newContacts.map(current => {
	      const old = oldContacts.find(contact => contact.is(current));

	      return typeof old !== 'undefined' ? current.merge(old) : current;
	    });
	  }

	  static parseMany(response                  )                 {
	    return response.results.map(r => Contact.parse(r, response.column_types));
	  }

	  static parse(plain                 , columns                )          {
	    return new Contact({
	      name: plain.column_values[columns.indexOf('name')],
	      number: plain.column_values[columns.indexOf('number')] || '',
	      favorited: plain.column_values[columns.indexOf('favorite')],
	      email: plain.column_values[columns.indexOf('email')] || '',
	      entreprise: plain.column_values[columns.indexOf('entreprise')] || '',
	      birthday: plain.column_values[columns.indexOf('birthday')] || '',
	      address: plain.column_values[columns.indexOf('address')] || '',
	      note: plain.column_values[columns.indexOf('note')] || '',
	      endpointId: plain.relations.endpoint_id,
	      personal: plain.column_values[columns.indexOf('personal')],
	      source: plain.source,
	      sourceId: plain.relations.source_entry_id,
	      uuid: plain.relations.user_uuid
	    });
	  }

	  static parseManyPersonal(results                                )                  {
	    return results.map(r => Contact.parsePersonal(r));
	  }

	  static parsePersonal(plain                         )           {
	    return new Contact({
	      name: `${plain.firstName || plain.firstname || ''} ${plain.lastName || plain.lastname || ''}`,
	      number: plain.number || '',
	      email: plain.email || '',
	      source: 'personal',
	      sourceId: plain.id,
	      entreprise: plain.entreprise || '',
	      birthday: plain.birthday || '',
	      address: plain.address || '',
	      note: plain.note || '',
	      favorited: false,
	      personal: true
	    });
	  }

	  static newFrom(profile         ) {
	    return newFrom(profile, Contact);
	  }

	  constructor({
	    id,
	    uuid,
	    name,
	    number,
	    email,
	    source,
	    sourceId,
	    entreprise,
	    birthday,
	    address,
	    note,
	    presence,
	    status,
	    endpointId,
	    personal
	  }                   = {}) {
	    this.id = id;
	    this.uuid = uuid;
	    this.name = name;
	    this.number = number;
	    this.email = email;
	    this.source = source;
	    this.sourceId = sourceId || '';
	    this.entreprise = entreprise;
	    this.birthday = birthday;
	    this.address = address;
	    this.note = note;
	    this.presence = presence;
	    this.status = status;
	    this.endpointId = endpointId;
	    this.personal = personal;
	  }

	  setFavorite(value         ) {
	    this.favorited = value;

	    return this;
	  }

	  is(other         )          {
	    return Boolean(other) && this.sourceId === other.sourceId && (this.uuid ? this.uuid === other.uuid : true);
	  }

	  hasId(id        )          {
	    return this.uuid === id;
	  }

	  hasNumber(number        )          {
	    return this.number === number;
	  }

	  hasEndpointId(endpointId        )          {
	    return this.endpointId === endpointId;
	  }

	  isAvailable()          {
	    return this.presence === 'available';
	  }

	  isDoNotDisturb()          {
	    return this.presence === 'donotdisturb';
	  }

	  isDisconnected()          {
	    return this.presence === 'disconnected';
	  }

	  merge(old         )          {
	    this.presence = old.presence;
	    this.status = old.status;

	    return this;
	  }

	  isIntern()          {
	    return !!this.uuid;
	  }

	  isCallable(session         )          {
	    return !!this.number && !!session && !session.is(this);
	  }

	  separateName()                                          {
	    if (!this.name) {
	      return {
	        firstName: '',
	        lastName: ''
	      };
	    }
	    const names = this.name.split(' ');
	    const firstName = names[0];
	    const lastName = names.slice(1).join(' ');

	    return {
	      firstName,
	      lastName
	    };
	  }
	}

	//      

	                 
	         
	                 
	                        
	                           
	                      
	                      
	                    
	                       
	                           
	                
	                       
	                 
	                        
	                           
	                            
	                      
	                                     
	                   
	     
	   
	  

	                         
	                
	               
	                   
	  

	class Session {
	                
	               
	                    

	  static parse(plain          )           {
	    return new Session({
	      token: plain.data.token,
	      uuid: plain.data.xivo_user_uuid
	    });
	  }

	  static newFrom(profile         ) {
	    return newFrom(profile, Session);
	  }

	  constructor({ token, uuid, profile }                   = {}) {
	    this.token = token;
	    this.uuid = uuid;
	    this.profile = profile;
	  }

	  is(contact         )          {
	    return Boolean(contact) && this.uuid === contact.uuid;
	  }

	  using(profile         )          {
	    this.profile = profile;

	    return this;
	  }

	  displayName()         {
	    return this.profile ? `${this.profile.firstName} ${this.profile.lastName}` : '';
	  }

	  primaryLine()        {
	    return this.profile ? this.profile.lines[0] : null;
	  }

	  primaryContext()          {
	    const line = this.primaryLine();

	    return line ? line.extensions[0].context : null;
	  }

	  primaryNumber()          {
	    const line = this.primaryLine();

	    return line ? line.extensions[0].exten : null;
	  }
	}

	/*       */

	const DEFAULT_BACKEND_USER = 'wazo_user';
	const DETAULT_EXPIRATION = 3600;

	var authMethods = (client              , baseUrl        ) => ({
	  checkToken(token       )                   {
	    return client.head(`${baseUrl}/token/${token}`, null, {});
	  },

	  authenticate(token       )                    {
	    return client.get(`${baseUrl}/token/${token}`, null, {}).then(response => Session.parse(response));
	  },

	  logIn(params                                                                             )                    {
	    const body = {
	      backend: params.backend || DEFAULT_BACKEND_USER,
	      expiration: params.expiration || DETAULT_EXPIRATION
	    };
	    const headers = {
	      Authorization: `Basic ${ApiRequester.base64Encode(`${params.username}:${params.password}`)}`,
	      'Content-Type': 'application/json'
	    };

	    return client.post(`${baseUrl}/token`, body, headers).then(response => Session.parse(response));
	  },

	  logOut(token       )                          {
	    return client.delete(`${baseUrl}/token/${token}`, null, {}, ApiRequester.successResponseParser);
	  },

	  updatePassword(token       , userUuid      , oldPassword        , newPassword        )                   {
	    const body = {
	      new_password: newPassword,
	      old_password: oldPassword
	    };

	    return client.put(`${baseUrl}/users/${userUuid}/password`, body, token, ApiRequester.successResponseParser);
	  },

	  sendDeviceToken(token       , userUuid      , deviceToken        ) {
	    const body = {
	      token: deviceToken
	    };

	    return client.post(`${baseUrl}/users/${userUuid}/external/mobile`, body, token);
	  },

	  removeDeviceToken(token       , userUuid      ) {
	    return client.delete(`${baseUrl}/users/${userUuid}/external/mobile`, null, token);
	  },

	  getUser(token       , userUuid      )                           {
	    return client.get(`${baseUrl}/users/${userUuid}`, null, token);
	  },

	  listTenants(token       )                               {
	    return client.get(`${baseUrl}/tenants`, null, token);
	  },

	  getTenant(token       , tenantUuid      )                             {
	    return client.get(`${baseUrl}/tenants/${tenantUuid}`, null, token);
	  },

	  createTenant(token       , name        )                                 {
	    return client.post(`${baseUrl}/tenants`, { name }, token);
	  },

	  deleteTenant(token       , uuid      )                                  {
	    return client.delete(`${baseUrl}/tenants/${uuid}`, null, token);
	  },

	  listUsers(token       )                             {
	    return client.get(`${baseUrl}/users`, null, token);
	  },

	  listGroups(token       )                              {
	    return client.get(`${baseUrl}/groups`, null, token);
	  },

	  listPolicies(token       )                                {
	    return client.get(`${baseUrl}/policies`, null, token);
	  }
	});

	/*       */
	                                                                                       

	var applicationMethods = (client              , baseUrl        ) => ({
	  answerCall(
	    token        ,
	    applicationUuid        ,
	    callId        ,
	    context        ,
	    exten        ,
	    autoanswer        
	  ) {
	    const url = `${baseUrl}/${applicationUuid}/nodes`;
	    const body = { calls: [{ id: callId }] };

	    return client
	      .post(url, body, token, res => res.data.uuid)
	      .then(nodeUuid =>
	        client.post(`${url}/${nodeUuid}/calls`, { context, exten, autoanswer }, token).then(data => ({
	          nodeUuid,
	          data
	        }))
	      );
	  },

	  calls(token       , applicationUuid        ) {
	    return client.get(`${baseUrl}/${applicationUuid}/calls`, null, token);
	  },

	  hangupCall(token       , applicationUuid        , callId        ) {
	    const url = `${baseUrl}/${applicationUuid}/calls/${callId}`;

	    return client.delete(url, null, token);
	  },

	  playCall(token       , applicationUuid        , callId        , language        , uri        ) {
	    return client.post(`${baseUrl}/${applicationUuid}/calls/${callId}/play`, { language, uri }, token);
	  },

	  addCallNodes(token       , applicationUuid        , nodeUuid        , callId        )                   {
	    return client.put(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`, null, token);
	  },

	  addNewCallNodes(
	    token       ,
	    applicationUuid        ,
	    nodeUuid        ,
	    context        ,
	    exten        ,
	    autoanswer        
	  ) {
	    const data = { context, exten, autoanswer };

	    return client.post(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls`, data, token);
	  },

	  listCallsNodes(token       , applicationUuid        , nodeUuid        )                                 {
	    return client.get(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`, null, token);
	  },

	  listNodes(token       , applicationUuid        )                             {
	    return client.get(`${baseUrl}/${applicationUuid}/nodes`, null, token);
	  },

	  removeNode(token       , applicationUuid        , nodeUuid        ) {
	    return client.delete(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`, null, token);
	  },

	  removeCallNodes(token       , applicationUuid        , nodeUuid        , callId        ) {
	    return client.delete(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`, null, token);
	  }
	});

	/*       */

	var confdMethods = (client              , baseUrl        ) => ({
	  listUsers(token       )                                  {
	    return client.get(`${baseUrl}/users`, null, token);
	  },

	  getUser(token       , userUuid        )                   {
	    return client.get(`${baseUrl}/users/${userUuid}`, null, token).then(response => Profile.parse(response));
	  },

	  updateUser(token       , userUuid        , profile         )                   {
	    const body = {
	      firstname: profile.firstName,
	      lastname: profile.lastName,
	      email: profile.email,
	      mobile_phone_number: profile.mobileNumber
	    };

	    return client.put(`${baseUrl}/users/${userUuid}`, body, token, ApiRequester.successResponseParser);
	  },

	  updateForwardOption(
	    token       ,
	    userUuid        ,
	    key        ,
	    destination        ,
	    enabled         
	  )                   {
	    const url = `${baseUrl}/users/${userUuid}/forwards/${key}`;
	    return client.put(url, { destination, enabled }, token, ApiRequester.successResponseParser);
	  },

	  updateDoNotDisturb(token       , userUuid      , enabled         )                   {
	    const url = `${baseUrl}/users/${userUuid}/services/dnd`;

	    return client.put(url, { enabled }, token, ApiRequester.successResponseParser);
	  },

	  // @TODO: type response
	  getUserLineSip(token       , userUuid        , lineId        ) {
	    return client.get(`${baseUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip`, null, token);
	  },

	  listApplications(token       )                                    {
	    const url = `${baseUrl}/applications?recurse=true`;

	    return client.get(url, null, token);
	  },

	  getSIP(token       , userUuid      , lineId        )                        {
	    return client.get(`${baseUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip`, null, token);
	  }
	});

	/*       */

	var accessdMethods = (client              , baseUrl        ) => ({
	  listSubscriptions(token        ) {
	    return client.get(`${baseUrl}/subscriptions?recurse=true`, null, token);
	  },
	  createSubscription(
	    token        ,
	    { tenantUuid, productSku, name, startDate, contractDate, autoRenew, term }        
	  ) {
	    const body = {
	      product_sku: productSku,
	      name,
	      start_date: startDate,
	      contract_date: contractDate,
	      auto_renew: autoRenew,
	      term
	    };

	    const headers         = {
	      'X-Auth-Token': token,
	      'Content-Type': 'application/json'
	    };
	    if (tenantUuid) {
	      headers['Wazo-Tenant'] = tenantUuid;
	    }

	    return client.post(`${baseUrl}/subscriptions`, body, headers);
	  },
	  getSubscription(token        , uuid        ) {
	    return client.get(`${baseUrl}/subscriptions/${uuid}`, null, token);
	  },
	  listAuthorizations(token        , subscriptionUuid        ) {
	    return client.get(`${baseUrl}/subscriptions/${subscriptionUuid}/authorizations`, null, token);
	  },
	  getAuthorization(token        , subscriptionUuid        , uuid        ) {
	    return client.get(`${baseUrl}/subscriptions/${subscriptionUuid}/authorizations/${uuid}`, null, token);
	  },
	  createAuthorization(token        , subscriptionUuid        , { startDate, term, service, rules, autoRenew }        ) {
	    const url = `${baseUrl}/subscriptions/${subscriptionUuid}/authorizations`;
	    const body = {
	      start_date: startDate,
	      term,
	      service,
	      rules,
	      auto_renew: autoRenew
	    };

	    return client.post(url, body, token);
	  }
	});

	//      

	                     
	               
	                                  
	                                
	                    
	              
	                             
	                          
	  

	                             
	             
	             
	                  
	                    
	                
	                     
	                  
	    
	           
	                     
	                  
	    
	               
	  

	                             
	              
	                    
	                     
	  

	                 
	                            
	  

	const uuid = () => {
	  const s4 = () =>
	    Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);

	  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
	};

	class ChatMessage {
	             
	             
	                  
	                    
	                
	                     
	                  
	    

	           
	                     
	                  
	    

	                

	  static parseMany(plain          )                     {
	    return plain.items.map(item => ChatMessage.parse(item));
	  }

	  static parse(plain              )              {
	    return new ChatMessage({
	      id: uuid(),
	      date: new Date(plain.date),
	      message: plain.msg,
	      direction: plain.direction,
	      destination: {
	        serverId: plain.destination_server_uuid,
	        userId: plain.destination_user_uuid
	      },
	      source: {
	        serverId: plain.source_server_uuid,
	        userId: plain.source_user_uuid
	      },
	      read: true
	    });
	  }

	  static parseMessageSent(plain                      )              {
	    return new ChatMessage({
	      id: uuid(),
	      date: new Date(),
	      message: plain.msg,
	      direction: 'sent',
	      destination: {
	        serverId: plain.to[0],
	        userId: plain.to[1]
	      },
	      source: {
	        serverId: plain.from[0],
	        userId: plain.from[1]
	      },
	      read: true
	    });
	  }

	  static parseMessageReceived(plain                      )              {
	    return new ChatMessage({
	      id: uuid(),
	      date: new Date(),
	      message: plain.msg,
	      direction: 'received',
	      destination: {
	        serverId: plain.to[0],
	        userId: plain.to[1]
	      },
	      source: {
	        serverId: plain.from[0],
	        userId: plain.from[1]
	      },
	      read: false
	    });
	  }

	  static newFrom(profile             ) {
	    return newFrom(profile, ChatMessage);
	  }

	  constructor({ id, date, message, direction, destination, source, read = true }                       = {}) {
	    this.id = id;
	    this.date = date;
	    this.message = message;
	    this.direction = direction;
	    this.destination = destination;
	    this.source = source;
	    this.read = read;
	  }

	  is(other             ) {
	    return this.id === other.id;
	  }

	  isIncoming() {
	    return this.direction === 'received';
	  }

	  acknowledge() {
	    this.read = true;

	    return this;
	  }

	  getTheOtherParty() {
	    if (this.direction === 'sent') {
	      return this.destination.userId;
	    }
	    return this.source.userId;
	  }
	}

	//      

	                        
	                         
	                        
	                   
	             
	                 
	                   
	  

	                 
	             
	               
	                 
	                  
	               
	                 
	                 
	                                    
	    
	  

	                           
	              
	              
	                    
	           
	                 
	                  
	    
	                   
	  

	class Voicemail {
	              
	              
	                    
	                   
	           
	                 
	                  
	    

	  static parse(plain                 )            {
	    return new Voicemail({
	      id: plain.id,
	      date: new Date(plain.timestamp),
	      duration: plain.duration * 1000,
	      caller: {
	        name: plain.caller_id_name,
	        number: plain.caller_id_num
	      },
	      unread: plain.folder ? plain.folder.type === 'new' : null
	    });
	  }

	  static parseMany(plain          )                   {
	    const plainUnread = plain.folders.filter(folder => folder.type === 'new')[0].messages;
	    const plainRead = plain.folders.filter(folder => folder.type === 'old')[0].messages;

	    const unread = plainUnread.map(message => Voicemail.parse(message)).map(voicemail => voicemail.makeAsUnRead());
	    const read = plainRead.map(message => Voicemail.parse(message)).map(voicemail => voicemail.acknowledge());

	    return [...unread, ...read];
	  }

	  static newFrom(profile           ) {
	    return newFrom(profile, Voicemail);
	  }

	  constructor({ id, date, duration, caller, unread }                     = {}) {
	    this.id = id;
	    this.date = date;
	    this.duration = duration;
	    this.caller = caller;
	    this.unread = unread;
	  }

	  is(other           )          {
	    return other && this.id === other.id;
	  }

	  acknowledge() {
	    this.unread = false;

	    return this;
	  }

	  makeAsUnRead() {
	    this.unread = true;

	    return this;
	  }

	  contains(query        )          {
	    if (!query) {
	      return true;
	    }

	    return this.caller.name.toUpperCase().includes(query.toUpperCase()) || this.caller.number.includes(query);
	  }
	}

	//      

	                     
	                  
	                              
	                                
	                 
	                        
	                  
	  

	                      
	             
	                     
	                       
	                  
	                 
	                    
	  

	class Call {
	             
	                     
	                       
	                  
	                 
	                     

	  static parseMany(plain                     )              {
	    return plain.map((plainCall              ) => Call.parse(plainCall));
	  }

	  static parse(plain              )       {
	    return new Call({
	      id: +plain.call_id,
	      calleeName: plain.peer_caller_id_name,
	      calleeNumber: plain.peer_caller_id_number,
	      onHold: plain.on_hold,
	      status: plain.status,
	      startingTime: new Date(plain.creation_time)
	    });
	  }

	  static newFrom(profile      ) {
	    return newFrom(profile, Call);
	  }

	  constructor({ id, calleeName, calleeNumber, onHold, status, startingTime }                = {}) {
	    this.id = id;
	    this.calleeName = calleeName;
	    this.calleeNumber = calleeNumber;
	    this.onHold = onHold;
	    this.status = status;
	    this.startingTime = startingTime;
	  }

	  getElapsedTimeInSeconds()         {
	    const now = Date.now();
	    return (now - this.startingTime) / 1000;
	  }

	  separateCalleeName()                                          {
	    const names = this.calleeName.split(' ');
	    const firstName = names[0];
	    const lastName = names.slice(1).join(' ');

	    return { firstName, lastName };
	  }

	  is(other      )          {
	    return this.id === other.id;
	  }

	  hasACalleeName()          {
	    return this.calleeName.length > 0;
	  }

	  hasNumber(number        )          {
	    return this.calleeNumber === number;
	  }

	  isUp()          {
	    return this.status === 'Up';
	  }

	  isDown()          {
	    return this.status === 'Down';
	  }

	  isRinging()          {
	    return this.isRingingIncoming() || this.isRingingOutgoing();
	  }

	  isRingingIncoming()          {
	    return this.status === 'Ringing';
	  }

	  isRingingOutgoing()          {
	    return this.status === 'Ring';
	  }

	  isFromTransfer()          {
	    return this.status === 'Down' || this.status === 'Ringing';
	  }

	  isOnHold()          {
	    return this.onHold;
	  }

	  putOnHold()       {
	    this.onHold = true;
	  }

	  resume()       {
	    this.onHold = false;
	  }
	}

	/*       */

	var ctidNgMethods = (client              , baseUrl        ) => ({
	  updatePresence(token       , presence        )                   {
	    return client.put(`${baseUrl}/users/me/presences`, { presence }, token, ApiRequester.successResponseParser);
	  },

	  listMessages(token       , participantUuid       , limit         )                              {
	    const query         = {};

	    if (participantUuid) {
	      query.participant_user_uuid = participantUuid;
	    }

	    if (limit) {
	      query.limit = limit;
	    }

	    return client.get(`${baseUrl}/users/me/chats`, query, token).then(response => ChatMessage.parseMany(response));
	  },

	  sendMessage(token       , alias        , msg        , toUserId        ) {
	    const body = { alias, msg, to: toUserId };

	    return client.post(`${baseUrl}/users/me/chats`, body, token, ApiRequester.successResponseParser);
	  },

	  makeCall(token       , extension        ) {
	    return client.post(`${baseUrl}/users/me/calls`, { from_mobile: true, extension }, token);
	  },

	  cancelCall(token       , callId        )                   {
	    return client.delete(`${baseUrl}/users/me/calls/${callId}`, null, token);
	  },

	  listCalls(token       )                       {
	    return client.get(`${baseUrl}/users/me/calls`, null, token).then(response => Call.parseMany(response.items));
	  },

	  relocateCall(token       , callId        , destination        , lineId         ) {
	    const body         = {
	      completions: ['answer'],
	      destination,
	      initiator_call: callId
	    };

	    if (lineId) {
	      body.location = { line_id: lineId };
	    }

	    return client.post(`${baseUrl}/users/me/relocates`, body, token);
	  },

	  listVoicemails(token       )                                           {
	    return client.get(`${baseUrl}/users/me/voicemails`, null, token).then(response => Voicemail.parseMany(response));
	  },

	  deleteVoicemail(token       , voicemailId        )                   {
	    return client.delete(`${baseUrl}/users/me/voicemails/messages/${voicemailId}`, null, token);
	  },

	  getPresence(token       , contactUuid      )                                                                      {
	    return client.get(`${baseUrl}/users/${contactUuid}/presences`, null, token);
	  },

	  getStatus(token       , lineUuid      ) {
	    return client.get(`${baseUrl}/lines/${lineUuid}/presences`, null, token);
	  }
	});

	/*       */
	                                                    

	const getContactPayload = (contact                      ) => ({
	  email: contact.email,
	  firstname: contact.firstName ? contact.firstName : '',
	  lastname: contact.lastName ? contact.lastName : '',
	  number: contact.phoneNumber ? contact.phoneNumber : '',
	  entreprise: contact.entreprise ? contact.entreprise : '',
	  birthday: contact.birthday ? contact.birthday : '',
	  address: contact.address ? contact.address : '',
	  note: contact.note ? contact.note : ''
	});

	var dirdMethods = (client              , baseUrl        ) => ({
	  search(token       , context        , term        )                          {
	    return client
	      .get(`${baseUrl}/directories/lookup/${context}`, { term }, token)
	      .then(response => Contact.parseMany(response));
	  },

	  listPersonalContacts(token       )                          {
	    return client.get(`${baseUrl}/personal`, null, token).then(response => Contact.parseManyPersonal(response.items));
	  },

	  addContact(token       , contact            )                   {
	    return client
	      .post(`${baseUrl}/personal`, getContactPayload(contact), token)
	      .then(response => Contact.parsePersonal(response));
	  },

	  editContact(token       , contact         )                   {
	    return client.put(`${baseUrl}/personal/${contact.sourceId || ''}`, getContactPayload(contact), token);
	  },

	  deleteContact(token       , contactUuid      ) {
	    return client.delete(`${baseUrl}/personal/${contactUuid}`, null, token);
	  },

	  listFavorites(token       , context        )                          {
	    return client
	      .get(`${baseUrl}/directories/favorites/${context}`, null, token)
	      .then(response => Contact.parseMany(response));
	  },

	  markAsFavorite(token       , source        , sourceId        )                   {
	    const url = `${baseUrl}/directories/favorites/${source}/${sourceId}`;

	    return client.put(url, null, token, ApiRequester.successResponseParser);
	  },

	  removeFavorite(token       , source        , sourceId        ) {
	    return client.delete(`${baseUrl}/directories/favorites/${source}/${sourceId}`, null, token);
	  }
	});

	//      

	                        
	                 
	                    
	                         
	                                
	                            
	                   
	              
	             
	                           
	                      
	               
	  

	                 
	                   
	                                
	               
	  

	                         
	               
	                    
	                          
	                        
	                
	                      
	                
	    
	           
	                      
	                
	    
	             
	                   
	              
	           
	  

	class CallLog {
	               
	                    
	                         
	                        
	                
	                      
	                
	    

	           
	                      
	                
	    

	             
	                   
	              
	            

	  static merge(current                , toMerge                )                  {
	    const onlyUnique = (value, index, self) => self.indexOf(value) === index;

	    const allLogs                 = current.concat(toMerge);
	    const onlyUniqueIds                = allLogs.map(c => c.id).filter(onlyUnique);

	    return onlyUniqueIds.map(id => allLogs.find(log => log.id === id));
	  }

	  static parseMany(plain          )                 {
	    return plain.items.map(item => CallLog.parse(item));
	  }

	  static parse(plain                 )          {
	    return new CallLog({
	      answer: new Date(plain.answer),
	      answered: plain.answered,
	      callDirection: plain.call_direction,
	      destination: {
	        extension: plain.destination_extension,
	        name: plain.destination_name || ''
	      },
	      source: {
	        extension: plain.source_extension,
	        name: plain.source_name
	      },
	      id: plain.id,
	      duration: (plain.duration || 0) * 1000, // duration is in seconds
	      start: new Date(plain.start),
	      end: new Date(plain.end)
	    });
	  }

	  static parseNew(plain                 , session         )          {
	    return new CallLog({
	      answer: new Date(plain.answer),
	      answered: plain.answered,
	      callDirection: plain.call_direction,
	      destination: {
	        extension: plain.destination_extension,
	        name: plain.destination_name || ''
	      },
	      source: {
	        extension: plain.source_extension,
	        name: plain.source_name
	      },
	      id: plain.id,
	      duration: (plain.duration || 0) * 1000, // duration is in seconds
	      start: new Date(plain.start),
	      end: new Date(plain.end),
	      // @TODO: FIXME add verification declined vs missed call
	      newMissedCall: plain.destination_extension === session.primaryNumber() && !plain.answered
	    });
	  }

	  static newFrom(profile         ) {
	    return newFrom(profile, CallLog);
	  }

	  constructor({
	    answer,
	    answered,
	    callDirection,
	    destination,
	    source,
	    id,
	    duration,
	    start,
	    end
	  }                   = {}) {
	    this.answer = answer;
	    this.answered = answered;
	    this.callDirection = callDirection;
	    this.destination = destination;
	    this.source = source;
	    this.id = id;
	    this.duration = duration;
	    this.start = start;
	    this.end = end;
	  }

	  isFromSameParty(other         , session         )          {
	    return this.theOtherParty(session).extension === other.theOtherParty(session).extension;
	  }

	  theOtherParty(session         )                                      {
	    if (this.source.extension === session.primaryNumber()) {
	      return this.destination;
	    }
	    return this.source;
	  }

	  isNewMissedCall()          {
	    return this.newMissedCall;
	  }

	  acknowledgeCall()          {
	    this.newMissedCall = false;

	    return this;
	  }

	  isAcknowledged()          {
	    return this.newMissedCall;
	  }

	  isAnOutgoingCall(session         )          {
	    return this.source.extension === session.primaryNumber() && this.answered;
	  }

	  isAMissedOutgoingCall(session         )          {
	    return this.source.extension === session.primaryNumber() && !this.answered;
	  }

	  isAnIncomingCall(session         )          {
	    return this.destination.extension === session.primaryNumber() && this.answered;
	  }

	  isADeclinedCall(session         )          {
	    return this.destination.extension === session.primaryNumber() && !this.answered;
	  }
	}

	/*       */

	var callLogdMethods = (client              , baseUrl        ) => ({
	  search(token       , search        , limit         = 5)                          {
	    return client
	      .get(`${baseUrl}/users/me/cdr`, { search, limit }, token)
	      .then(response => CallLog.parseMany(response));
	  },

	  listCallLogs(token       , offset        , limit         = 5)                          {
	    return client
	      .get(`${baseUrl}/users/me/cdr`, { offset, limit }, token)
	      .then(response => CallLog.parseMany(response));
	  },

	  listCallLogsFromDate(token       , from      , number        )                          {
	    return client
	      .get(`${baseUrl}/users/me/cdr`, { from: from.toISOString(), number }, token)
	      .then(response => CallLog.parseMany(response));
	  }
	});

	/*       */

	const AUTH_VERSION = '0.1';
	const APPLICATION_VERSION = '1.0';
	const CONFD_VERSION = '1.1';
	const ACCESSD_VERSION = '1.0';
	const CTIDNG_VERSION = '1.0';
	const DIRD_VERSION = '0.1';
	const CALL_LOGD_VERSION = '1.0';

	class ApiClient {
	                       
	               
	                      
	                
	                  
	                 
	               
	                   

	  // @see https://github.com/facebook/flow/issues/183#issuecomment-358607052
	  constructor({ server, agent = null }                                               ) {
	    this.updatePatemers({ server, agent });
	  }

	  initializeEndpoints()       {
	    this.auth = authMethods(this.client, `auth/${AUTH_VERSION}`);
	    this.application = applicationMethods(this.client, `ctid-ng/${APPLICATION_VERSION}/applications`);
	    this.confd = confdMethods(this.client, `confd/${CONFD_VERSION}`);
	    this.accessd = accessdMethods(this.client, `accessd/${ACCESSD_VERSION}`);
	    this.ctidNg = ctidNgMethods(this.client, `ctid-ng/${CTIDNG_VERSION}`);
	    this.dird = dirdMethods(this.client, `dird/${DIRD_VERSION}`);
	    this.callLogd = callLogdMethods(this.client, `call-logd/${CALL_LOGD_VERSION}`);
	  }

	  updatePatemers({ server, agent }                                    ) {
	    this.client = new ApiRequester({ server, agent });

	    this.initializeEndpoints();
	  }
	}

	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */

	var logDisabled_ = true;
	var deprecationWarnings_ = true;

	/**
	 * Extract browser version out of the provided user agent string.
	 *
	 * @param {!string} uastring userAgent string.
	 * @param {!string} expr Regular expression used as match criteria.
	 * @param {!number} pos position in the version string to be returned.
	 * @return {!number} browser version.
	 */
	function extractVersion(uastring, expr, pos) {
	  var match = uastring.match(expr);
	  return match && match.length >= pos && parseInt(match[pos], 10);
	}

	// Wraps the peerconnection event eventNameToWrap in a function
	// which returns the modified event object (or false to prevent
	// the event).
	function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
	  if (!window.RTCPeerConnection) {
	    return;
	  }
	  var proto = window.RTCPeerConnection.prototype;
	  var nativeAddEventListener = proto.addEventListener;
	  proto.addEventListener = function(nativeEventName, cb) {
	    if (nativeEventName !== eventNameToWrap) {
	      return nativeAddEventListener.apply(this, arguments);
	    }
	    var wrappedCallback = function(e) {
	      var modifiedEvent = wrapper(e);
	      if (modifiedEvent) {
	        cb(modifiedEvent);
	      }
	    };
	    this._eventMap = this._eventMap || {};
	    this._eventMap[cb] = wrappedCallback;
	    return nativeAddEventListener.apply(this, [nativeEventName,
	      wrappedCallback]);
	  };

	  var nativeRemoveEventListener = proto.removeEventListener;
	  proto.removeEventListener = function(nativeEventName, cb) {
	    if (nativeEventName !== eventNameToWrap || !this._eventMap
	        || !this._eventMap[cb]) {
	      return nativeRemoveEventListener.apply(this, arguments);
	    }
	    var unwrappedCb = this._eventMap[cb];
	    delete this._eventMap[cb];
	    return nativeRemoveEventListener.apply(this, [nativeEventName,
	      unwrappedCb]);
	  };

	  Object.defineProperty(proto, 'on' + eventNameToWrap, {
	    get: function() {
	      return this['_on' + eventNameToWrap];
	    },
	    set: function(cb) {
	      if (this['_on' + eventNameToWrap]) {
	        this.removeEventListener(eventNameToWrap,
	            this['_on' + eventNameToWrap]);
	        delete this['_on' + eventNameToWrap];
	      }
	      if (cb) {
	        this.addEventListener(eventNameToWrap,
	            this['_on' + eventNameToWrap] = cb);
	      }
	    },
	    enumerable: true,
	    configurable: true
	  });
	}

	// Utility methods.
	var utils = {
	  extractVersion: extractVersion,
	  wrapPeerConnectionEvent: wrapPeerConnectionEvent,
	  disableLog: function(bool) {
	    if (typeof bool !== 'boolean') {
	      return new Error('Argument type: ' + typeof bool +
	          '. Please use a boolean.');
	    }
	    logDisabled_ = bool;
	    return (bool) ? 'adapter.js logging disabled' :
	        'adapter.js logging enabled';
	  },

	  /**
	   * Disable or enable deprecation warnings
	   * @param {!boolean} bool set to true to disable warnings.
	   */
	  disableWarnings: function(bool) {
	    if (typeof bool !== 'boolean') {
	      return new Error('Argument type: ' + typeof bool +
	          '. Please use a boolean.');
	    }
	    deprecationWarnings_ = !bool;
	    return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
	  },

	  log: function() {
	    if (typeof window === 'object') {
	      if (logDisabled_) {
	        return;
	      }
	      if (typeof console !== 'undefined' && typeof console.log === 'function') {
	        console.log.apply(console, arguments);
	      }
	    }
	  },

	  /**
	   * Shows a deprecation warning suggesting the modern and spec-compatible API.
	   */
	  deprecated: function(oldMethod, newMethod) {
	    if (!deprecationWarnings_) {
	      return;
	    }
	    console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
	        ' instead.');
	  },

	  /**
	   * Browser detector.
	   *
	   * @return {object} result containing browser and version
	   *     properties.
	   */
	  detectBrowser: function(window) {
	    var navigator = window && window.navigator;

	    // Returned result object.
	    var result = {};
	    result.browser = null;
	    result.version = null;

	    // Fail early if it's not a browser
	    if (typeof window === 'undefined' || !window.navigator) {
	      result.browser = 'Not a browser.';
	      return result;
	    }

	    if (navigator.mozGetUserMedia) { // Firefox.
	      result.browser = 'firefox';
	      result.version = extractVersion(navigator.userAgent,
	          /Firefox\/(\d+)\./, 1);
	    } else if (navigator.webkitGetUserMedia) {
	      // Chrome, Chromium, Webview, Opera.
	      // Version matches Chrome/WebRTC version.
	      result.browser = 'chrome';
	      result.version = extractVersion(navigator.userAgent,
	          /Chrom(e|ium)\/(\d+)\./, 2);
	    } else if (navigator.mediaDevices &&
	        navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // Edge.
	      result.browser = 'edge';
	      result.version = extractVersion(navigator.userAgent,
	          /Edge\/(\d+).(\d+)$/, 2);
	    } else if (window.RTCPeerConnection &&
	        navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) { // Safari.
	      result.browser = 'safari';
	      result.version = extractVersion(navigator.userAgent,
	          /AppleWebKit\/(\d+)\./, 1);
	    } else { // Default fallthrough: not supported.
	      result.browser = 'Not a supported browser.';
	      return result;
	    }

	    return result;
	  }
	};

	var logging = utils.log;

	// Expose public methods.
	var getusermedia = function(window) {
	  var browserDetails = utils.detectBrowser(window);
	  var navigator = window && window.navigator;

	  var constraintsToChrome_ = function(c) {
	    if (typeof c !== 'object' || c.mandatory || c.optional) {
	      return c;
	    }
	    var cc = {};
	    Object.keys(c).forEach(function(key) {
	      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
	        return;
	      }
	      var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
	      if (r.exact !== undefined && typeof r.exact === 'number') {
	        r.min = r.max = r.exact;
	      }
	      var oldname_ = function(prefix, name) {
	        if (prefix) {
	          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
	        }
	        return (name === 'deviceId') ? 'sourceId' : name;
	      };
	      if (r.ideal !== undefined) {
	        cc.optional = cc.optional || [];
	        var oc = {};
	        if (typeof r.ideal === 'number') {
	          oc[oldname_('min', key)] = r.ideal;
	          cc.optional.push(oc);
	          oc = {};
	          oc[oldname_('max', key)] = r.ideal;
	          cc.optional.push(oc);
	        } else {
	          oc[oldname_('', key)] = r.ideal;
	          cc.optional.push(oc);
	        }
	      }
	      if (r.exact !== undefined && typeof r.exact !== 'number') {
	        cc.mandatory = cc.mandatory || {};
	        cc.mandatory[oldname_('', key)] = r.exact;
	      } else {
	        ['min', 'max'].forEach(function(mix) {
	          if (r[mix] !== undefined) {
	            cc.mandatory = cc.mandatory || {};
	            cc.mandatory[oldname_(mix, key)] = r[mix];
	          }
	        });
	      }
	    });
	    if (c.advanced) {
	      cc.optional = (cc.optional || []).concat(c.advanced);
	    }
	    return cc;
	  };

	  var shimConstraints_ = function(constraints, func) {
	    if (browserDetails.version >= 61) {
	      return func(constraints);
	    }
	    constraints = JSON.parse(JSON.stringify(constraints));
	    if (constraints && typeof constraints.audio === 'object') {
	      var remap = function(obj, a, b) {
	        if (a in obj && !(b in obj)) {
	          obj[b] = obj[a];
	          delete obj[a];
	        }
	      };
	      constraints = JSON.parse(JSON.stringify(constraints));
	      remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
	      remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
	      constraints.audio = constraintsToChrome_(constraints.audio);
	    }
	    if (constraints && typeof constraints.video === 'object') {
	      // Shim facingMode for mobile & surface pro.
	      var face = constraints.video.facingMode;
	      face = face && ((typeof face === 'object') ? face : {ideal: face});
	      var getSupportedFacingModeLies = browserDetails.version < 66;

	      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
	                    face.ideal === 'user' || face.ideal === 'environment')) &&
	          !(navigator.mediaDevices.getSupportedConstraints &&
	            navigator.mediaDevices.getSupportedConstraints().facingMode &&
	            !getSupportedFacingModeLies)) {
	        delete constraints.video.facingMode;
	        var matches;
	        if (face.exact === 'environment' || face.ideal === 'environment') {
	          matches = ['back', 'rear'];
	        } else if (face.exact === 'user' || face.ideal === 'user') {
	          matches = ['front'];
	        }
	        if (matches) {
	          // Look for matches in label, or use last cam for back (typical).
	          return navigator.mediaDevices.enumerateDevices()
	          .then(function(devices) {
	            devices = devices.filter(function(d) {
	              return d.kind === 'videoinput';
	            });
	            var dev = devices.find(function(d) {
	              return matches.some(function(match) {
	                return d.label.toLowerCase().indexOf(match) !== -1;
	              });
	            });
	            if (!dev && devices.length && matches.indexOf('back') !== -1) {
	              dev = devices[devices.length - 1]; // more likely the back cam
	            }
	            if (dev) {
	              constraints.video.deviceId = face.exact ? {exact: dev.deviceId} :
	                                                        {ideal: dev.deviceId};
	            }
	            constraints.video = constraintsToChrome_(constraints.video);
	            logging('chrome: ' + JSON.stringify(constraints));
	            return func(constraints);
	          });
	        }
	      }
	      constraints.video = constraintsToChrome_(constraints.video);
	    }
	    logging('chrome: ' + JSON.stringify(constraints));
	    return func(constraints);
	  };

	  var shimError_ = function(e) {
	    if (browserDetails.version >= 64) {
	      return e;
	    }
	    return {
	      name: {
	        PermissionDeniedError: 'NotAllowedError',
	        PermissionDismissedError: 'NotAllowedError',
	        InvalidStateError: 'NotAllowedError',
	        DevicesNotFoundError: 'NotFoundError',
	        ConstraintNotSatisfiedError: 'OverconstrainedError',
	        TrackStartError: 'NotReadableError',
	        MediaDeviceFailedDueToShutdown: 'NotAllowedError',
	        MediaDeviceKillSwitchOn: 'NotAllowedError',
	        TabCaptureError: 'AbortError',
	        ScreenCaptureError: 'AbortError',
	        DeviceCaptureError: 'AbortError'
	      }[e.name] || e.name,
	      message: e.message,
	      constraint: e.constraint || e.constraintName,
	      toString: function() {
	        return this.name + (this.message && ': ') + this.message;
	      }
	    };
	  };

	  var getUserMedia_ = function(constraints, onSuccess, onError) {
	    shimConstraints_(constraints, function(c) {
	      navigator.webkitGetUserMedia(c, onSuccess, function(e) {
	        if (onError) {
	          onError(shimError_(e));
	        }
	      });
	    });
	  };

	  navigator.getUserMedia = getUserMedia_;

	  // Returns the result of getUserMedia as a Promise.
	  var getUserMediaPromise_ = function(constraints) {
	    return new Promise(function(resolve, reject) {
	      navigator.getUserMedia(constraints, resolve, reject);
	    });
	  };

	  if (!navigator.mediaDevices) {
	    navigator.mediaDevices = {
	      getUserMedia: getUserMediaPromise_,
	      enumerateDevices: function() {
	        return new Promise(function(resolve) {
	          var kinds = {audio: 'audioinput', video: 'videoinput'};
	          return window.MediaStreamTrack.getSources(function(devices) {
	            resolve(devices.map(function(device) {
	              return {label: device.label,
	                kind: kinds[device.kind],
	                deviceId: device.id,
	                groupId: ''};
	            }));
	          });
	        });
	      },
	      getSupportedConstraints: function() {
	        return {
	          deviceId: true, echoCancellation: true, facingMode: true,
	          frameRate: true, height: true, width: true
	        };
	      }
	    };
	  }

	  // A shim for getUserMedia method on the mediaDevices object.
	  // TODO(KaptenJansson) remove once implemented in Chrome stable.
	  if (!navigator.mediaDevices.getUserMedia) {
	    navigator.mediaDevices.getUserMedia = function(constraints) {
	      return getUserMediaPromise_(constraints);
	    };
	  } else {
	    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
	    // function which returns a Promise, it does not accept spec-style
	    // constraints.
	    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
	        bind(navigator.mediaDevices);
	    navigator.mediaDevices.getUserMedia = function(cs) {
	      return shimConstraints_(cs, function(c) {
	        return origGetUserMedia(c).then(function(stream) {
	          if (c.audio && !stream.getAudioTracks().length ||
	              c.video && !stream.getVideoTracks().length) {
	            stream.getTracks().forEach(function(track) {
	              track.stop();
	            });
	            throw new DOMException('', 'NotFoundError');
	          }
	          return stream;
	        }, function(e) {
	          return Promise.reject(shimError_(e));
	        });
	      });
	    };
	  }

	  // Dummy devicechange event methods.
	  // TODO(KaptenJansson) remove once implemented in Chrome stable.
	  if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
	    navigator.mediaDevices.addEventListener = function() {
	      logging('Dummy mediaDevices.addEventListener called.');
	    };
	  }
	  if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
	    navigator.mediaDevices.removeEventListener = function() {
	      logging('Dummy mediaDevices.removeEventListener called.');
	    };
	  }
	};

	var logging$1 = utils.log;

	/* iterates the stats graph recursively. */
	function walkStats(stats, base, resultSet) {
	  if (!base || resultSet.has(base.id)) {
	    return;
	  }
	  resultSet.set(base.id, base);
	  Object.keys(base).forEach(function(name) {
	    if (name.endsWith('Id')) {
	      walkStats(stats, stats.get(base[name]), resultSet);
	    } else if (name.endsWith('Ids')) {
	      base[name].forEach(function(id) {
	        walkStats(stats, stats.get(id), resultSet);
	      });
	    }
	  });
	}

	/* filter getStats for a sender/receiver track. */
	function filterStats(result, track, outbound) {
	  var streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
	  var filteredResult = new Map();
	  if (track === null) {
	    return filteredResult;
	  }
	  var trackStats = [];
	  result.forEach(function(value) {
	    if (value.type === 'track' &&
	        value.trackIdentifier === track.id) {
	      trackStats.push(value);
	    }
	  });
	  trackStats.forEach(function(trackStat) {
	    result.forEach(function(stats) {
	      if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
	        walkStats(result, stats, filteredResult);
	      }
	    });
	  });
	  return filteredResult;
	}

	var chrome_shim = {
	  shimGetUserMedia: getusermedia,
	  shimMediaStream: function(window) {
	    window.MediaStream = window.MediaStream || window.webkitMediaStream;
	  },

	  shimOnTrack: function(window) {
	    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
	        window.RTCPeerConnection.prototype)) {
	      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
	        get: function() {
	          return this._ontrack;
	        },
	        set: function(f) {
	          if (this._ontrack) {
	            this.removeEventListener('track', this._ontrack);
	          }
	          this.addEventListener('track', this._ontrack = f);
	        },
	        enumerable: true,
	        configurable: true
	      });
	      var origSetRemoteDescription =
	          window.RTCPeerConnection.prototype.setRemoteDescription;
	      window.RTCPeerConnection.prototype.setRemoteDescription = function() {
	        var pc = this;
	        if (!pc._ontrackpoly) {
	          pc._ontrackpoly = function(e) {
	            // onaddstream does not fire when a track is added to an existing
	            // stream. But stream.onaddtrack is implemented so we use that.
	            e.stream.addEventListener('addtrack', function(te) {
	              var receiver;
	              if (window.RTCPeerConnection.prototype.getReceivers) {
	                receiver = pc.getReceivers().find(function(r) {
	                  return r.track && r.track.id === te.track.id;
	                });
	              } else {
	                receiver = {track: te.track};
	              }

	              var event = new Event('track');
	              event.track = te.track;
	              event.receiver = receiver;
	              event.transceiver = {receiver: receiver};
	              event.streams = [e.stream];
	              pc.dispatchEvent(event);
	            });
	            e.stream.getTracks().forEach(function(track) {
	              var receiver;
	              if (window.RTCPeerConnection.prototype.getReceivers) {
	                receiver = pc.getReceivers().find(function(r) {
	                  return r.track && r.track.id === track.id;
	                });
	              } else {
	                receiver = {track: track};
	              }
	              var event = new Event('track');
	              event.track = track;
	              event.receiver = receiver;
	              event.transceiver = {receiver: receiver};
	              event.streams = [e.stream];
	              pc.dispatchEvent(event);
	            });
	          };
	          pc.addEventListener('addstream', pc._ontrackpoly);
	        }
	        return origSetRemoteDescription.apply(pc, arguments);
	      };
	    } else {
	      // even if RTCRtpTransceiver is in window, it is only used and
	      // emitted in unified-plan. Unfortunately this means we need
	      // to unconditionally wrap the event.
	      utils.wrapPeerConnectionEvent(window, 'track', function(e) {
	        if (!e.transceiver) {
	          Object.defineProperty(e, 'transceiver',
	            {value: {receiver: e.receiver}});
	        }
	        return e;
	      });
	    }
	  },

	  shimGetSendersWithDtmf: function(window) {
	    // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
	    if (typeof window === 'object' && window.RTCPeerConnection &&
	        !('getSenders' in window.RTCPeerConnection.prototype) &&
	        'createDTMFSender' in window.RTCPeerConnection.prototype) {
	      var shimSenderWithDtmf = function(pc, track) {
	        return {
	          track: track,
	          get dtmf() {
	            if (this._dtmf === undefined) {
	              if (track.kind === 'audio') {
	                this._dtmf = pc.createDTMFSender(track);
	              } else {
	                this._dtmf = null;
	              }
	            }
	            return this._dtmf;
	          },
	          _pc: pc
	        };
	      };

	      // augment addTrack when getSenders is not available.
	      if (!window.RTCPeerConnection.prototype.getSenders) {
	        window.RTCPeerConnection.prototype.getSenders = function() {
	          this._senders = this._senders || [];
	          return this._senders.slice(); // return a copy of the internal state.
	        };
	        var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
	        window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
	          var pc = this;
	          var sender = origAddTrack.apply(pc, arguments);
	          if (!sender) {
	            sender = shimSenderWithDtmf(pc, track);
	            pc._senders.push(sender);
	          }
	          return sender;
	        };

	        var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
	        window.RTCPeerConnection.prototype.removeTrack = function(sender) {
	          var pc = this;
	          origRemoveTrack.apply(pc, arguments);
	          var idx = pc._senders.indexOf(sender);
	          if (idx !== -1) {
	            pc._senders.splice(idx, 1);
	          }
	        };
	      }
	      var origAddStream = window.RTCPeerConnection.prototype.addStream;
	      window.RTCPeerConnection.prototype.addStream = function(stream) {
	        var pc = this;
	        pc._senders = pc._senders || [];
	        origAddStream.apply(pc, [stream]);
	        stream.getTracks().forEach(function(track) {
	          pc._senders.push(shimSenderWithDtmf(pc, track));
	        });
	      };

	      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
	      window.RTCPeerConnection.prototype.removeStream = function(stream) {
	        var pc = this;
	        pc._senders = pc._senders || [];
	        origRemoveStream.apply(pc, [stream]);

	        stream.getTracks().forEach(function(track) {
	          var sender = pc._senders.find(function(s) {
	            return s.track === track;
	          });
	          if (sender) {
	            pc._senders.splice(pc._senders.indexOf(sender), 1); // remove sender
	          }
	        });
	      };
	    } else if (typeof window === 'object' && window.RTCPeerConnection &&
	               'getSenders' in window.RTCPeerConnection.prototype &&
	               'createDTMFSender' in window.RTCPeerConnection.prototype &&
	               window.RTCRtpSender &&
	               !('dtmf' in window.RTCRtpSender.prototype)) {
	      var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
	      window.RTCPeerConnection.prototype.getSenders = function() {
	        var pc = this;
	        var senders = origGetSenders.apply(pc, []);
	        senders.forEach(function(sender) {
	          sender._pc = pc;
	        });
	        return senders;
	      };

	      Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
	        get: function() {
	          if (this._dtmf === undefined) {
	            if (this.track.kind === 'audio') {
	              this._dtmf = this._pc.createDTMFSender(this.track);
	            } else {
	              this._dtmf = null;
	            }
	          }
	          return this._dtmf;
	        }
	      });
	    }
	  },

	  shimSenderReceiverGetStats: function(window) {
	    if (!(typeof window === 'object' && window.RTCPeerConnection &&
	        window.RTCRtpSender && window.RTCRtpReceiver)) {
	      return;
	    }

	    // shim sender stats.
	    if (!('getStats' in window.RTCRtpSender.prototype)) {
	      var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
	      if (origGetSenders) {
	        window.RTCPeerConnection.prototype.getSenders = function() {
	          var pc = this;
	          var senders = origGetSenders.apply(pc, []);
	          senders.forEach(function(sender) {
	            sender._pc = pc;
	          });
	          return senders;
	        };
	      }

	      var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
	      if (origAddTrack) {
	        window.RTCPeerConnection.prototype.addTrack = function() {
	          var sender = origAddTrack.apply(this, arguments);
	          sender._pc = this;
	          return sender;
	        };
	      }
	      window.RTCRtpSender.prototype.getStats = function() {
	        var sender = this;
	        return this._pc.getStats().then(function(result) {
	          /* Note: this will include stats of all senders that
	           *   send a track with the same id as sender.track as
	           *   it is not possible to identify the RTCRtpSender.
	           */
	          return filterStats(result, sender.track, true);
	        });
	      };
	    }

	    // shim receiver stats.
	    if (!('getStats' in window.RTCRtpReceiver.prototype)) {
	      var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
	      if (origGetReceivers) {
	        window.RTCPeerConnection.prototype.getReceivers = function() {
	          var pc = this;
	          var receivers = origGetReceivers.apply(pc, []);
	          receivers.forEach(function(receiver) {
	            receiver._pc = pc;
	          });
	          return receivers;
	        };
	      }
	      utils.wrapPeerConnectionEvent(window, 'track', function(e) {
	        e.receiver._pc = e.srcElement;
	        return e;
	      });
	      window.RTCRtpReceiver.prototype.getStats = function() {
	        var receiver = this;
	        return this._pc.getStats().then(function(result) {
	          return filterStats(result, receiver.track, false);
	        });
	      };
	    }

	    if (!('getStats' in window.RTCRtpSender.prototype &&
	        'getStats' in window.RTCRtpReceiver.prototype)) {
	      return;
	    }

	    // shim RTCPeerConnection.getStats(track).
	    var origGetStats = window.RTCPeerConnection.prototype.getStats;
	    window.RTCPeerConnection.prototype.getStats = function() {
	      var pc = this;
	      if (arguments.length > 0 &&
	          arguments[0] instanceof window.MediaStreamTrack) {
	        var track = arguments[0];
	        var sender;
	        var receiver;
	        var err;
	        pc.getSenders().forEach(function(s) {
	          if (s.track === track) {
	            if (sender) {
	              err = true;
	            } else {
	              sender = s;
	            }
	          }
	        });
	        pc.getReceivers().forEach(function(r) {
	          if (r.track === track) {
	            if (receiver) {
	              err = true;
	            } else {
	              receiver = r;
	            }
	          }
	          return r.track === track;
	        });
	        if (err || (sender && receiver)) {
	          return Promise.reject(new DOMException(
	            'There are more than one sender or receiver for the track.',
	            'InvalidAccessError'));
	        } else if (sender) {
	          return sender.getStats();
	        } else if (receiver) {
	          return receiver.getStats();
	        }
	        return Promise.reject(new DOMException(
	          'There is no sender or receiver for the track.',
	          'InvalidAccessError'));
	      }
	      return origGetStats.apply(pc, arguments);
	    };
	  },

	  shimSourceObject: function(window) {
	    var URL = window && window.URL;

	    if (typeof window === 'object') {
	      if (window.HTMLMediaElement &&
	        !('srcObject' in window.HTMLMediaElement.prototype)) {
	        // Shim the srcObject property, once, when HTMLMediaElement is found.
	        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
	          get: function() {
	            return this._srcObject;
	          },
	          set: function(stream) {
	            var self = this;
	            // Use _srcObject as a private property for this shim
	            this._srcObject = stream;
	            if (this.src) {
	              URL.revokeObjectURL(this.src);
	            }

	            if (!stream) {
	              this.src = '';
	              return undefined;
	            }
	            this.src = URL.createObjectURL(stream);
	            // We need to recreate the blob url when a track is added or
	            // removed. Doing it manually since we want to avoid a recursion.
	            stream.addEventListener('addtrack', function() {
	              if (self.src) {
	                URL.revokeObjectURL(self.src);
	              }
	              self.src = URL.createObjectURL(stream);
	            });
	            stream.addEventListener('removetrack', function() {
	              if (self.src) {
	                URL.revokeObjectURL(self.src);
	              }
	              self.src = URL.createObjectURL(stream);
	            });
	          }
	        });
	      }
	    }
	  },

	  shimAddTrackRemoveTrackWithNative: function(window) {
	    // shim addTrack/removeTrack with native variants in order to make
	    // the interactions with legacy getLocalStreams behave as in other browsers.
	    // Keeps a mapping stream.id => [stream, rtpsenders...]
	    window.RTCPeerConnection.prototype.getLocalStreams = function() {
	      var pc = this;
	      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
	      return Object.keys(this._shimmedLocalStreams).map(function(streamId) {
	        return pc._shimmedLocalStreams[streamId][0];
	      });
	    };

	    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
	    window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
	      if (!stream) {
	        return origAddTrack.apply(this, arguments);
	      }
	      this._shimmedLocalStreams = this._shimmedLocalStreams || {};

	      var sender = origAddTrack.apply(this, arguments);
	      if (!this._shimmedLocalStreams[stream.id]) {
	        this._shimmedLocalStreams[stream.id] = [stream, sender];
	      } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
	        this._shimmedLocalStreams[stream.id].push(sender);
	      }
	      return sender;
	    };

	    var origAddStream = window.RTCPeerConnection.prototype.addStream;
	    window.RTCPeerConnection.prototype.addStream = function(stream) {
	      var pc = this;
	      this._shimmedLocalStreams = this._shimmedLocalStreams || {};

	      stream.getTracks().forEach(function(track) {
	        var alreadyExists = pc.getSenders().find(function(s) {
	          return s.track === track;
	        });
	        if (alreadyExists) {
	          throw new DOMException('Track already exists.',
	              'InvalidAccessError');
	        }
	      });
	      var existingSenders = pc.getSenders();
	      origAddStream.apply(this, arguments);
	      var newSenders = pc.getSenders().filter(function(newSender) {
	        return existingSenders.indexOf(newSender) === -1;
	      });
	      this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
	    };

	    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
	    window.RTCPeerConnection.prototype.removeStream = function(stream) {
	      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
	      delete this._shimmedLocalStreams[stream.id];
	      return origRemoveStream.apply(this, arguments);
	    };

	    var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
	    window.RTCPeerConnection.prototype.removeTrack = function(sender) {
	      var pc = this;
	      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
	      if (sender) {
	        Object.keys(this._shimmedLocalStreams).forEach(function(streamId) {
	          var idx = pc._shimmedLocalStreams[streamId].indexOf(sender);
	          if (idx !== -1) {
	            pc._shimmedLocalStreams[streamId].splice(idx, 1);
	          }
	          if (pc._shimmedLocalStreams[streamId].length === 1) {
	            delete pc._shimmedLocalStreams[streamId];
	          }
	        });
	      }
	      return origRemoveTrack.apply(this, arguments);
	    };
	  },

	  shimAddTrackRemoveTrack: function(window) {
	    var browserDetails = utils.detectBrowser(window);
	    // shim addTrack and removeTrack.
	    if (window.RTCPeerConnection.prototype.addTrack &&
	        browserDetails.version >= 65) {
	      return this.shimAddTrackRemoveTrackWithNative(window);
	    }

	    // also shim pc.getLocalStreams when addTrack is shimmed
	    // to return the original streams.
	    var origGetLocalStreams = window.RTCPeerConnection.prototype
	        .getLocalStreams;
	    window.RTCPeerConnection.prototype.getLocalStreams = function() {
	      var pc = this;
	      var nativeStreams = origGetLocalStreams.apply(this);
	      pc._reverseStreams = pc._reverseStreams || {};
	      return nativeStreams.map(function(stream) {
	        return pc._reverseStreams[stream.id];
	      });
	    };

	    var origAddStream = window.RTCPeerConnection.prototype.addStream;
	    window.RTCPeerConnection.prototype.addStream = function(stream) {
	      var pc = this;
	      pc._streams = pc._streams || {};
	      pc._reverseStreams = pc._reverseStreams || {};

	      stream.getTracks().forEach(function(track) {
	        var alreadyExists = pc.getSenders().find(function(s) {
	          return s.track === track;
	        });
	        if (alreadyExists) {
	          throw new DOMException('Track already exists.',
	              'InvalidAccessError');
	        }
	      });
	      // Add identity mapping for consistency with addTrack.
	      // Unless this is being used with a stream from addTrack.
	      if (!pc._reverseStreams[stream.id]) {
	        var newStream = new window.MediaStream(stream.getTracks());
	        pc._streams[stream.id] = newStream;
	        pc._reverseStreams[newStream.id] = stream;
	        stream = newStream;
	      }
	      origAddStream.apply(pc, [stream]);
	    };

	    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
	    window.RTCPeerConnection.prototype.removeStream = function(stream) {
	      var pc = this;
	      pc._streams = pc._streams || {};
	      pc._reverseStreams = pc._reverseStreams || {};

	      origRemoveStream.apply(pc, [(pc._streams[stream.id] || stream)]);
	      delete pc._reverseStreams[(pc._streams[stream.id] ?
	          pc._streams[stream.id].id : stream.id)];
	      delete pc._streams[stream.id];
	    };

	    window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
	      var pc = this;
	      if (pc.signalingState === 'closed') {
	        throw new DOMException(
	          'The RTCPeerConnection\'s signalingState is \'closed\'.',
	          'InvalidStateError');
	      }
	      var streams = [].slice.call(arguments, 1);
	      if (streams.length !== 1 ||
	          !streams[0].getTracks().find(function(t) {
	            return t === track;
	          })) {
	        // this is not fully correct but all we can manage without
	        // [[associated MediaStreams]] internal slot.
	        throw new DOMException(
	          'The adapter.js addTrack polyfill only supports a single ' +
	          ' stream which is associated with the specified track.',
	          'NotSupportedError');
	      }

	      var alreadyExists = pc.getSenders().find(function(s) {
	        return s.track === track;
	      });
	      if (alreadyExists) {
	        throw new DOMException('Track already exists.',
	            'InvalidAccessError');
	      }

	      pc._streams = pc._streams || {};
	      pc._reverseStreams = pc._reverseStreams || {};
	      var oldStream = pc._streams[stream.id];
	      if (oldStream) {
	        // this is using odd Chrome behaviour, use with caution:
	        // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
	        // Note: we rely on the high-level addTrack/dtmf shim to
	        // create the sender with a dtmf sender.
	        oldStream.addTrack(track);

	        // Trigger ONN async.
	        Promise.resolve().then(function() {
	          pc.dispatchEvent(new Event('negotiationneeded'));
	        });
	      } else {
	        var newStream = new window.MediaStream([track]);
	        pc._streams[stream.id] = newStream;
	        pc._reverseStreams[newStream.id] = stream;
	        pc.addStream(newStream);
	      }
	      return pc.getSenders().find(function(s) {
	        return s.track === track;
	      });
	    };

	    // replace the internal stream id with the external one and
	    // vice versa.
	    function replaceInternalStreamId(pc, description) {
	      var sdp = description.sdp;
	      Object.keys(pc._reverseStreams || []).forEach(function(internalId) {
	        var externalStream = pc._reverseStreams[internalId];
	        var internalStream = pc._streams[externalStream.id];
	        sdp = sdp.replace(new RegExp(internalStream.id, 'g'),
	            externalStream.id);
	      });
	      return new RTCSessionDescription({
	        type: description.type,
	        sdp: sdp
	      });
	    }
	    function replaceExternalStreamId(pc, description) {
	      var sdp = description.sdp;
	      Object.keys(pc._reverseStreams || []).forEach(function(internalId) {
	        var externalStream = pc._reverseStreams[internalId];
	        var internalStream = pc._streams[externalStream.id];
	        sdp = sdp.replace(new RegExp(externalStream.id, 'g'),
	            internalStream.id);
	      });
	      return new RTCSessionDescription({
	        type: description.type,
	        sdp: sdp
	      });
	    }
	    ['createOffer', 'createAnswer'].forEach(function(method) {
	      var nativeMethod = window.RTCPeerConnection.prototype[method];
	      window.RTCPeerConnection.prototype[method] = function() {
	        var pc = this;
	        var args = arguments;
	        var isLegacyCall = arguments.length &&
	            typeof arguments[0] === 'function';
	        if (isLegacyCall) {
	          return nativeMethod.apply(pc, [
	            function(description) {
	              var desc = replaceInternalStreamId(pc, description);
	              args[0].apply(null, [desc]);
	            },
	            function(err) {
	              if (args[1]) {
	                args[1].apply(null, err);
	              }
	            }, arguments[2]
	          ]);
	        }
	        return nativeMethod.apply(pc, arguments)
	        .then(function(description) {
	          return replaceInternalStreamId(pc, description);
	        });
	      };
	    });

	    var origSetLocalDescription =
	        window.RTCPeerConnection.prototype.setLocalDescription;
	    window.RTCPeerConnection.prototype.setLocalDescription = function() {
	      var pc = this;
	      if (!arguments.length || !arguments[0].type) {
	        return origSetLocalDescription.apply(pc, arguments);
	      }
	      arguments[0] = replaceExternalStreamId(pc, arguments[0]);
	      return origSetLocalDescription.apply(pc, arguments);
	    };

	    // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier

	    var origLocalDescription = Object.getOwnPropertyDescriptor(
	        window.RTCPeerConnection.prototype, 'localDescription');
	    Object.defineProperty(window.RTCPeerConnection.prototype,
	        'localDescription', {
	          get: function() {
	            var pc = this;
	            var description = origLocalDescription.get.apply(this);
	            if (description.type === '') {
	              return description;
	            }
	            return replaceInternalStreamId(pc, description);
	          }
	        });

	    window.RTCPeerConnection.prototype.removeTrack = function(sender) {
	      var pc = this;
	      if (pc.signalingState === 'closed') {
	        throw new DOMException(
	          'The RTCPeerConnection\'s signalingState is \'closed\'.',
	          'InvalidStateError');
	      }
	      // We can not yet check for sender instanceof RTCRtpSender
	      // since we shim RTPSender. So we check if sender._pc is set.
	      if (!sender._pc) {
	        throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' +
	            'does not implement interface RTCRtpSender.', 'TypeError');
	      }
	      var isLocal = sender._pc === pc;
	      if (!isLocal) {
	        throw new DOMException('Sender was not created by this connection.',
	            'InvalidAccessError');
	      }

	      // Search for the native stream the senders track belongs to.
	      pc._streams = pc._streams || {};
	      var stream;
	      Object.keys(pc._streams).forEach(function(streamid) {
	        var hasTrack = pc._streams[streamid].getTracks().find(function(track) {
	          return sender.track === track;
	        });
	        if (hasTrack) {
	          stream = pc._streams[streamid];
	        }
	      });

	      if (stream) {
	        if (stream.getTracks().length === 1) {
	          // if this is the last track of the stream, remove the stream. This
	          // takes care of any shimmed _senders.
	          pc.removeStream(pc._reverseStreams[stream.id]);
	        } else {
	          // relying on the same odd chrome behaviour as above.
	          stream.removeTrack(sender.track);
	        }
	        pc.dispatchEvent(new Event('negotiationneeded'));
	      }
	    };
	  },

	  shimPeerConnection: function(window) {
	    var browserDetails = utils.detectBrowser(window);

	    // The RTCPeerConnection object.
	    if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
	      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
	        // Translate iceTransportPolicy to iceTransports,
	        // see https://code.google.com/p/webrtc/issues/detail?id=4869
	        // this was fixed in M56 along with unprefixing RTCPeerConnection.
	        logging$1('PeerConnection');
	        if (pcConfig && pcConfig.iceTransportPolicy) {
	          pcConfig.iceTransports = pcConfig.iceTransportPolicy;
	        }

	        return new window.webkitRTCPeerConnection(pcConfig, pcConstraints);
	      };
	      window.RTCPeerConnection.prototype =
	          window.webkitRTCPeerConnection.prototype;
	      // wrap static methods. Currently just generateCertificate.
	      if (window.webkitRTCPeerConnection.generateCertificate) {
	        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
	          get: function() {
	            return window.webkitRTCPeerConnection.generateCertificate;
	          }
	        });
	      }
	    }

	    var origGetStats = window.RTCPeerConnection.prototype.getStats;
	    window.RTCPeerConnection.prototype.getStats = function(selector,
	        successCallback, errorCallback) {
	      var pc = this;
	      var args = arguments;

	      // If selector is a function then we are in the old style stats so just
	      // pass back the original getStats format to avoid breaking old users.
	      if (arguments.length > 0 && typeof selector === 'function') {
	        return origGetStats.apply(this, arguments);
	      }

	      // When spec-style getStats is supported, return those when called with
	      // either no arguments or the selector argument is null.
	      if (origGetStats.length === 0 && (arguments.length === 0 ||
	          typeof arguments[0] !== 'function')) {
	        return origGetStats.apply(this, []);
	      }

	      var fixChromeStats_ = function(response) {
	        var standardReport = {};
	        var reports = response.result();
	        reports.forEach(function(report) {
	          var standardStats = {
	            id: report.id,
	            timestamp: report.timestamp,
	            type: {
	              localcandidate: 'local-candidate',
	              remotecandidate: 'remote-candidate'
	            }[report.type] || report.type
	          };
	          report.names().forEach(function(name) {
	            standardStats[name] = report.stat(name);
	          });
	          standardReport[standardStats.id] = standardStats;
	        });

	        return standardReport;
	      };

	      // shim getStats with maplike support
	      var makeMapStats = function(stats) {
	        return new Map(Object.keys(stats).map(function(key) {
	          return [key, stats[key]];
	        }));
	      };

	      if (arguments.length >= 2) {
	        var successCallbackWrapper_ = function(response) {
	          args[1](makeMapStats(fixChromeStats_(response)));
	        };

	        return origGetStats.apply(this, [successCallbackWrapper_,
	          arguments[0]]);
	      }

	      // promise-support
	      return new Promise(function(resolve, reject) {
	        origGetStats.apply(pc, [
	          function(response) {
	            resolve(makeMapStats(fixChromeStats_(response)));
	          }, reject]);
	      }).then(successCallback, errorCallback);
	    };

	    // add promise support -- natively available in Chrome 51
	    if (browserDetails.version < 51) {
	      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
	          .forEach(function(method) {
	            var nativeMethod = window.RTCPeerConnection.prototype[method];
	            window.RTCPeerConnection.prototype[method] = function() {
	              var args = arguments;
	              var pc = this;
	              var promise = new Promise(function(resolve, reject) {
	                nativeMethod.apply(pc, [args[0], resolve, reject]);
	              });
	              if (args.length < 2) {
	                return promise;
	              }
	              return promise.then(function() {
	                args[1].apply(null, []);
	              },
	              function(err) {
	                if (args.length >= 3) {
	                  args[2].apply(null, [err]);
	                }
	              });
	            };
	          });
	    }

	    // promise support for createOffer and createAnswer. Available (without
	    // bugs) since M52: crbug/619289
	    if (browserDetails.version < 52) {
	      ['createOffer', 'createAnswer'].forEach(function(method) {
	        var nativeMethod = window.RTCPeerConnection.prototype[method];
	        window.RTCPeerConnection.prototype[method] = function() {
	          var pc = this;
	          if (arguments.length < 1 || (arguments.length === 1 &&
	              typeof arguments[0] === 'object')) {
	            var opts = arguments.length === 1 ? arguments[0] : undefined;
	            return new Promise(function(resolve, reject) {
	              nativeMethod.apply(pc, [resolve, reject, opts]);
	            });
	          }
	          return nativeMethod.apply(this, arguments);
	        };
	      });
	    }

	    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
	    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
	        .forEach(function(method) {
	          var nativeMethod = window.RTCPeerConnection.prototype[method];
	          window.RTCPeerConnection.prototype[method] = function() {
	            arguments[0] = new ((method === 'addIceCandidate') ?
	                window.RTCIceCandidate :
	                window.RTCSessionDescription)(arguments[0]);
	            return nativeMethod.apply(this, arguments);
	          };
	        });

	    // support for addIceCandidate(null or undefined)
	    var nativeAddIceCandidate =
	        window.RTCPeerConnection.prototype.addIceCandidate;
	    window.RTCPeerConnection.prototype.addIceCandidate = function() {
	      if (!arguments[0]) {
	        if (arguments[1]) {
	          arguments[1].apply(null);
	        }
	        return Promise.resolve();
	      }
	      return nativeAddIceCandidate.apply(this, arguments);
	    };
	  },

	  fixNegotiationNeeded: function(window) {
	    utils.wrapPeerConnectionEvent(window, 'negotiationneeded', function(e) {
	      var pc = e.target;
	      if (pc.signalingState !== 'stable') {
	        return;
	      }
	      return e;
	    });
	  },

	  shimGetDisplayMedia: function(window, getSourceId) {
	    if ('getDisplayMedia' in window.navigator) {
	      return;
	    }
	    // getSourceId is a function that returns a promise resolving with
	    // the sourceId of the screen/window/tab to be shared.
	    if (typeof getSourceId !== 'function') {
	      console.error('shimGetDisplayMedia: getSourceId argument is not ' +
	          'a function');
	      return;
	    }
	    navigator.getDisplayMedia = function(constraints) {
	      return getSourceId(constraints)
	        .then(function(sourceId) {
	          var widthSpecified = constraints.video && constraints.video.width;
	          var heightSpecified = constraints.video && constraints.video.height;
	          var frameRateSpecified = constraints.video &&
	            constraints.video.frameRate;
	          constraints.video = {
	            mandatory: {
	              chromeMediaSource: 'desktop',
	              chromeMediaSourceId: sourceId,
	              maxFrameRate: frameRateSpecified || 3
	            }
	          };
	          if (widthSpecified) {
	            constraints.video.mandatory.maxWidth = widthSpecified;
	          }
	          if (heightSpecified) {
	            constraints.video.mandatory.maxHeight = heightSpecified;
	          }
	          return navigator.mediaDevices.getUserMedia(constraints);
	        });
	    };
	  }
	};

	// Edge does not like
	// 1) stun: filtered after 14393 unless ?transport=udp is present
	// 2) turn: that does not have all of turn:host:port?transport=udp
	// 3) turn: with ipv6 addresses
	// 4) turn: occurring muliple times
	var filtericeservers = function(iceServers, edgeVersion) {
	  var hasTurn = false;
	  iceServers = JSON.parse(JSON.stringify(iceServers));
	  return iceServers.filter(function(server) {
	    if (server && (server.urls || server.url)) {
	      var urls = server.urls || server.url;
	      if (server.url && !server.urls) {
	        utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
	      }
	      var isString = typeof urls === 'string';
	      if (isString) {
	        urls = [urls];
	      }
	      urls = urls.filter(function(url) {
	        var validTurn = url.indexOf('turn:') === 0 &&
	            url.indexOf('transport=udp') !== -1 &&
	            url.indexOf('turn:[') === -1 &&
	            !hasTurn;

	        if (validTurn) {
	          hasTurn = true;
	          return true;
	        }
	        return url.indexOf('stun:') === 0 && edgeVersion >= 14393 &&
	            url.indexOf('?transport=udp') === -1;
	      });

	      delete server.url;
	      server.urls = isString ? urls[0] : urls;
	      return !!urls.length;
	    }
	  });
	};

	var sdp = createCommonjsModule(function (module) {

	// SDP helpers.
	var SDPUtils = {};

	// Generate an alphanumeric identifier for cname or mids.
	// TODO: use UUIDs instead? https://gist.github.com/jed/982883
	SDPUtils.generateIdentifier = function() {
	  return Math.random().toString(36).substr(2, 10);
	};

	// The RTCP CNAME used by all peerconnections from the same JS.
	SDPUtils.localCName = SDPUtils.generateIdentifier();

	// Splits SDP into lines, dealing with both CRLF and LF.
	SDPUtils.splitLines = function(blob) {
	  return blob.trim().split('\n').map(function(line) {
	    return line.trim();
	  });
	};
	// Splits SDP into sessionpart and mediasections. Ensures CRLF.
	SDPUtils.splitSections = function(blob) {
	  var parts = blob.split('\nm=');
	  return parts.map(function(part, index) {
	    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
	  });
	};

	// returns the session description.
	SDPUtils.getDescription = function(blob) {
	  var sections = SDPUtils.splitSections(blob);
	  return sections && sections[0];
	};

	// returns the individual media sections.
	SDPUtils.getMediaSections = function(blob) {
	  var sections = SDPUtils.splitSections(blob);
	  sections.shift();
	  return sections;
	};

	// Returns lines that start with a certain prefix.
	SDPUtils.matchPrefix = function(blob, prefix) {
	  return SDPUtils.splitLines(blob).filter(function(line) {
	    return line.indexOf(prefix) === 0;
	  });
	};

	// Parses an ICE candidate line. Sample input:
	// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
	// rport 55996"
	SDPUtils.parseCandidate = function(line) {
	  var parts;
	  // Parse both variants.
	  if (line.indexOf('a=candidate:') === 0) {
	    parts = line.substring(12).split(' ');
	  } else {
	    parts = line.substring(10).split(' ');
	  }

	  var candidate = {
	    foundation: parts[0],
	    component: parseInt(parts[1], 10),
	    protocol: parts[2].toLowerCase(),
	    priority: parseInt(parts[3], 10),
	    ip: parts[4],
	    address: parts[4], // address is an alias for ip.
	    port: parseInt(parts[5], 10),
	    // skip parts[6] == 'typ'
	    type: parts[7]
	  };

	  for (var i = 8; i < parts.length; i += 2) {
	    switch (parts[i]) {
	      case 'raddr':
	        candidate.relatedAddress = parts[i + 1];
	        break;
	      case 'rport':
	        candidate.relatedPort = parseInt(parts[i + 1], 10);
	        break;
	      case 'tcptype':
	        candidate.tcpType = parts[i + 1];
	        break;
	      case 'ufrag':
	        candidate.ufrag = parts[i + 1]; // for backward compability.
	        candidate.usernameFragment = parts[i + 1];
	        break;
	      default: // extension handling, in particular ufrag
	        candidate[parts[i]] = parts[i + 1];
	        break;
	    }
	  }
	  return candidate;
	};

	// Translates a candidate object into SDP candidate attribute.
	SDPUtils.writeCandidate = function(candidate) {
	  var sdp = [];
	  sdp.push(candidate.foundation);
	  sdp.push(candidate.component);
	  sdp.push(candidate.protocol.toUpperCase());
	  sdp.push(candidate.priority);
	  sdp.push(candidate.address || candidate.ip);
	  sdp.push(candidate.port);

	  var type = candidate.type;
	  sdp.push('typ');
	  sdp.push(type);
	  if (type !== 'host' && candidate.relatedAddress &&
	      candidate.relatedPort) {
	    sdp.push('raddr');
	    sdp.push(candidate.relatedAddress);
	    sdp.push('rport');
	    sdp.push(candidate.relatedPort);
	  }
	  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
	    sdp.push('tcptype');
	    sdp.push(candidate.tcpType);
	  }
	  if (candidate.usernameFragment || candidate.ufrag) {
	    sdp.push('ufrag');
	    sdp.push(candidate.usernameFragment || candidate.ufrag);
	  }
	  return 'candidate:' + sdp.join(' ');
	};

	// Parses an ice-options line, returns an array of option tags.
	// a=ice-options:foo bar
	SDPUtils.parseIceOptions = function(line) {
	  return line.substr(14).split(' ');
	};

	// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
	// a=rtpmap:111 opus/48000/2
	SDPUtils.parseRtpMap = function(line) {
	  var parts = line.substr(9).split(' ');
	  var parsed = {
	    payloadType: parseInt(parts.shift(), 10) // was: id
	  };

	  parts = parts[0].split('/');

	  parsed.name = parts[0];
	  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
	  parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
	  // legacy alias, got renamed back to channels in ORTC.
	  parsed.numChannels = parsed.channels;
	  return parsed;
	};

	// Generate an a=rtpmap line from RTCRtpCodecCapability or
	// RTCRtpCodecParameters.
	SDPUtils.writeRtpMap = function(codec) {
	  var pt = codec.payloadType;
	  if (codec.preferredPayloadType !== undefined) {
	    pt = codec.preferredPayloadType;
	  }
	  var channels = codec.channels || codec.numChannels || 1;
	  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
	      (channels !== 1 ? '/' + channels : '') + '\r\n';
	};

	// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
	// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
	// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
	SDPUtils.parseExtmap = function(line) {
	  var parts = line.substr(9).split(' ');
	  return {
	    id: parseInt(parts[0], 10),
	    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
	    uri: parts[1]
	  };
	};

	// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
	// RTCRtpHeaderExtension.
	SDPUtils.writeExtmap = function(headerExtension) {
	  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
	      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
	          ? '/' + headerExtension.direction
	          : '') +
	      ' ' + headerExtension.uri + '\r\n';
	};

	// Parses an ftmp line, returns dictionary. Sample input:
	// a=fmtp:96 vbr=on;cng=on
	// Also deals with vbr=on; cng=on
	SDPUtils.parseFmtp = function(line) {
	  var parsed = {};
	  var kv;
	  var parts = line.substr(line.indexOf(' ') + 1).split(';');
	  for (var j = 0; j < parts.length; j++) {
	    kv = parts[j].trim().split('=');
	    parsed[kv[0].trim()] = kv[1];
	  }
	  return parsed;
	};

	// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
	SDPUtils.writeFmtp = function(codec) {
	  var line = '';
	  var pt = codec.payloadType;
	  if (codec.preferredPayloadType !== undefined) {
	    pt = codec.preferredPayloadType;
	  }
	  if (codec.parameters && Object.keys(codec.parameters).length) {
	    var params = [];
	    Object.keys(codec.parameters).forEach(function(param) {
	      if (codec.parameters[param]) {
	        params.push(param + '=' + codec.parameters[param]);
	      } else {
	        params.push(param);
	      }
	    });
	    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
	  }
	  return line;
	};

	// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
	// a=rtcp-fb:98 nack rpsi
	SDPUtils.parseRtcpFb = function(line) {
	  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
	  return {
	    type: parts.shift(),
	    parameter: parts.join(' ')
	  };
	};
	// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
	SDPUtils.writeRtcpFb = function(codec) {
	  var lines = '';
	  var pt = codec.payloadType;
	  if (codec.preferredPayloadType !== undefined) {
	    pt = codec.preferredPayloadType;
	  }
	  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
	    // FIXME: special handling for trr-int?
	    codec.rtcpFeedback.forEach(function(fb) {
	      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
	      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
	          '\r\n';
	    });
	  }
	  return lines;
	};

	// Parses an RFC 5576 ssrc media attribute. Sample input:
	// a=ssrc:3735928559 cname:something
	SDPUtils.parseSsrcMedia = function(line) {
	  var sp = line.indexOf(' ');
	  var parts = {
	    ssrc: parseInt(line.substr(7, sp - 7), 10)
	  };
	  var colon = line.indexOf(':', sp);
	  if (colon > -1) {
	    parts.attribute = line.substr(sp + 1, colon - sp - 1);
	    parts.value = line.substr(colon + 1);
	  } else {
	    parts.attribute = line.substr(sp + 1);
	  }
	  return parts;
	};

	SDPUtils.parseSsrcGroup = function(line) {
	  var parts = line.substr(13).split(' ');
	  return {
	    semantics: parts.shift(),
	    ssrcs: parts.map(function(ssrc) {
	      return parseInt(ssrc, 10);
	    })
	  };
	};

	// Extracts the MID (RFC 5888) from a media section.
	// returns the MID or undefined if no mid line was found.
	SDPUtils.getMid = function(mediaSection) {
	  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
	  if (mid) {
	    return mid.substr(6);
	  }
	};

	SDPUtils.parseFingerprint = function(line) {
	  var parts = line.substr(14).split(' ');
	  return {
	    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
	    value: parts[1]
	  };
	};

	// Extracts DTLS parameters from SDP media section or sessionpart.
	// FIXME: for consistency with other functions this should only
	//   get the fingerprint line as input. See also getIceParameters.
	SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
	  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
	      'a=fingerprint:');
	  // Note: a=setup line is ignored since we use the 'auto' role.
	  // Note2: 'algorithm' is not case sensitive except in Edge.
	  return {
	    role: 'auto',
	    fingerprints: lines.map(SDPUtils.parseFingerprint)
	  };
	};

	// Serializes DTLS parameters to SDP.
	SDPUtils.writeDtlsParameters = function(params, setupType) {
	  var sdp = 'a=setup:' + setupType + '\r\n';
	  params.fingerprints.forEach(function(fp) {
	    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
	  });
	  return sdp;
	};
	// Parses ICE information from SDP media section or sessionpart.
	// FIXME: for consistency with other functions this should only
	//   get the ice-ufrag and ice-pwd lines as input.
	SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
	  var lines = SDPUtils.splitLines(mediaSection);
	  // Search in session part, too.
	  lines = lines.concat(SDPUtils.splitLines(sessionpart));
	  var iceParameters = {
	    usernameFragment: lines.filter(function(line) {
	      return line.indexOf('a=ice-ufrag:') === 0;
	    })[0].substr(12),
	    password: lines.filter(function(line) {
	      return line.indexOf('a=ice-pwd:') === 0;
	    })[0].substr(10)
	  };
	  return iceParameters;
	};

	// Serializes ICE parameters to SDP.
	SDPUtils.writeIceParameters = function(params) {
	  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
	      'a=ice-pwd:' + params.password + '\r\n';
	};

	// Parses the SDP media section and returns RTCRtpParameters.
	SDPUtils.parseRtpParameters = function(mediaSection) {
	  var description = {
	    codecs: [],
	    headerExtensions: [],
	    fecMechanisms: [],
	    rtcp: []
	  };
	  var lines = SDPUtils.splitLines(mediaSection);
	  var mline = lines[0].split(' ');
	  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
	    var pt = mline[i];
	    var rtpmapline = SDPUtils.matchPrefix(
	        mediaSection, 'a=rtpmap:' + pt + ' ')[0];
	    if (rtpmapline) {
	      var codec = SDPUtils.parseRtpMap(rtpmapline);
	      var fmtps = SDPUtils.matchPrefix(
	          mediaSection, 'a=fmtp:' + pt + ' ');
	      // Only the first a=fmtp:<pt> is considered.
	      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
	      codec.rtcpFeedback = SDPUtils.matchPrefix(
	          mediaSection, 'a=rtcp-fb:' + pt + ' ')
	        .map(SDPUtils.parseRtcpFb);
	      description.codecs.push(codec);
	      // parse FEC mechanisms from rtpmap lines.
	      switch (codec.name.toUpperCase()) {
	        case 'RED':
	        case 'ULPFEC':
	          description.fecMechanisms.push(codec.name.toUpperCase());
	          break;
	        default: // only RED and ULPFEC are recognized as FEC mechanisms.
	          break;
	      }
	    }
	  }
	  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
	    description.headerExtensions.push(SDPUtils.parseExtmap(line));
	  });
	  // FIXME: parse rtcp.
	  return description;
	};

	// Generates parts of the SDP media section describing the capabilities /
	// parameters.
	SDPUtils.writeRtpDescription = function(kind, caps) {
	  var sdp = '';

	  // Build the mline.
	  sdp += 'm=' + kind + ' ';
	  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
	  sdp += ' UDP/TLS/RTP/SAVPF ';
	  sdp += caps.codecs.map(function(codec) {
	    if (codec.preferredPayloadType !== undefined) {
	      return codec.preferredPayloadType;
	    }
	    return codec.payloadType;
	  }).join(' ') + '\r\n';

	  sdp += 'c=IN IP4 0.0.0.0\r\n';
	  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

	  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
	  caps.codecs.forEach(function(codec) {
	    sdp += SDPUtils.writeRtpMap(codec);
	    sdp += SDPUtils.writeFmtp(codec);
	    sdp += SDPUtils.writeRtcpFb(codec);
	  });
	  var maxptime = 0;
	  caps.codecs.forEach(function(codec) {
	    if (codec.maxptime > maxptime) {
	      maxptime = codec.maxptime;
	    }
	  });
	  if (maxptime > 0) {
	    sdp += 'a=maxptime:' + maxptime + '\r\n';
	  }
	  sdp += 'a=rtcp-mux\r\n';

	  if (caps.headerExtensions) {
	    caps.headerExtensions.forEach(function(extension) {
	      sdp += SDPUtils.writeExtmap(extension);
	    });
	  }
	  // FIXME: write fecMechanisms.
	  return sdp;
	};

	// Parses the SDP media section and returns an array of
	// RTCRtpEncodingParameters.
	SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
	  var encodingParameters = [];
	  var description = SDPUtils.parseRtpParameters(mediaSection);
	  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
	  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

	  // filter a=ssrc:... cname:, ignore PlanB-msid
	  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
	  .map(function(line) {
	    return SDPUtils.parseSsrcMedia(line);
	  })
	  .filter(function(parts) {
	    return parts.attribute === 'cname';
	  });
	  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
	  var secondarySsrc;

	  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
	  .map(function(line) {
	    var parts = line.substr(17).split(' ');
	    return parts.map(function(part) {
	      return parseInt(part, 10);
	    });
	  });
	  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
	    secondarySsrc = flows[0][1];
	  }

	  description.codecs.forEach(function(codec) {
	    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
	      var encParam = {
	        ssrc: primarySsrc,
	        codecPayloadType: parseInt(codec.parameters.apt, 10)
	      };
	      if (primarySsrc && secondarySsrc) {
	        encParam.rtx = {ssrc: secondarySsrc};
	      }
	      encodingParameters.push(encParam);
	      if (hasRed) {
	        encParam = JSON.parse(JSON.stringify(encParam));
	        encParam.fec = {
	          ssrc: primarySsrc,
	          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
	        };
	        encodingParameters.push(encParam);
	      }
	    }
	  });
	  if (encodingParameters.length === 0 && primarySsrc) {
	    encodingParameters.push({
	      ssrc: primarySsrc
	    });
	  }

	  // we support both b=AS and b=TIAS but interpret AS as TIAS.
	  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
	  if (bandwidth.length) {
	    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
	      bandwidth = parseInt(bandwidth[0].substr(7), 10);
	    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
	      // use formula from JSEP to convert b=AS to TIAS value.
	      bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
	          - (50 * 40 * 8);
	    } else {
	      bandwidth = undefined;
	    }
	    encodingParameters.forEach(function(params) {
	      params.maxBitrate = bandwidth;
	    });
	  }
	  return encodingParameters;
	};

	// parses http://draft.ortc.org/#rtcrtcpparameters*
	SDPUtils.parseRtcpParameters = function(mediaSection) {
	  var rtcpParameters = {};

	  // Gets the first SSRC. Note tha with RTX there might be multiple
	  // SSRCs.
	  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
	      .map(function(line) {
	        return SDPUtils.parseSsrcMedia(line);
	      })
	      .filter(function(obj) {
	        return obj.attribute === 'cname';
	      })[0];
	  if (remoteSsrc) {
	    rtcpParameters.cname = remoteSsrc.value;
	    rtcpParameters.ssrc = remoteSsrc.ssrc;
	  }

	  // Edge uses the compound attribute instead of reducedSize
	  // compound is !reducedSize
	  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
	  rtcpParameters.reducedSize = rsize.length > 0;
	  rtcpParameters.compound = rsize.length === 0;

	  // parses the rtcp-mux attrіbute.
	  // Note that Edge does not support unmuxed RTCP.
	  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
	  rtcpParameters.mux = mux.length > 0;

	  return rtcpParameters;
	};

	// parses either a=msid: or a=ssrc:... msid lines and returns
	// the id of the MediaStream and MediaStreamTrack.
	SDPUtils.parseMsid = function(mediaSection) {
	  var parts;
	  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
	  if (spec.length === 1) {
	    parts = spec[0].substr(7).split(' ');
	    return {stream: parts[0], track: parts[1]};
	  }
	  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
	  .map(function(line) {
	    return SDPUtils.parseSsrcMedia(line);
	  })
	  .filter(function(msidParts) {
	    return msidParts.attribute === 'msid';
	  });
	  if (planB.length > 0) {
	    parts = planB[0].value.split(' ');
	    return {stream: parts[0], track: parts[1]};
	  }
	};

	// Generate a session ID for SDP.
	// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
	// recommends using a cryptographically random +ve 64-bit value
	// but right now this should be acceptable and within the right range
	SDPUtils.generateSessionId = function() {
	  return Math.random().toString().substr(2, 21);
	};

	// Write boilder plate for start of SDP
	// sessId argument is optional - if not supplied it will
	// be generated randomly
	// sessVersion is optional and defaults to 2
	// sessUser is optional and defaults to 'thisisadapterortc'
	SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
	  var sessionId;
	  var version = sessVer !== undefined ? sessVer : 2;
	  if (sessId) {
	    sessionId = sessId;
	  } else {
	    sessionId = SDPUtils.generateSessionId();
	  }
	  var user = sessUser || 'thisisadapterortc';
	  // FIXME: sess-id should be an NTP timestamp.
	  return 'v=0\r\n' +
	      'o=' + user + ' ' + sessionId + ' ' + version +
	        ' IN IP4 127.0.0.1\r\n' +
	      's=-\r\n' +
	      't=0 0\r\n';
	};

	SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
	  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

	  // Map ICE parameters (ufrag, pwd) to SDP.
	  sdp += SDPUtils.writeIceParameters(
	      transceiver.iceGatherer.getLocalParameters());

	  // Map DTLS parameters to SDP.
	  sdp += SDPUtils.writeDtlsParameters(
	      transceiver.dtlsTransport.getLocalParameters(),
	      type === 'offer' ? 'actpass' : 'active');

	  sdp += 'a=mid:' + transceiver.mid + '\r\n';

	  if (transceiver.direction) {
	    sdp += 'a=' + transceiver.direction + '\r\n';
	  } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
	    sdp += 'a=sendrecv\r\n';
	  } else if (transceiver.rtpSender) {
	    sdp += 'a=sendonly\r\n';
	  } else if (transceiver.rtpReceiver) {
	    sdp += 'a=recvonly\r\n';
	  } else {
	    sdp += 'a=inactive\r\n';
	  }

	  if (transceiver.rtpSender) {
	    // spec.
	    var msid = 'msid:' + stream.id + ' ' +
	        transceiver.rtpSender.track.id + '\r\n';
	    sdp += 'a=' + msid;

	    // for Chrome.
	    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
	        ' ' + msid;
	    if (transceiver.sendEncodingParameters[0].rtx) {
	      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
	          ' ' + msid;
	      sdp += 'a=ssrc-group:FID ' +
	          transceiver.sendEncodingParameters[0].ssrc + ' ' +
	          transceiver.sendEncodingParameters[0].rtx.ssrc +
	          '\r\n';
	    }
	  }
	  // FIXME: this should be written by writeRtpDescription.
	  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
	      ' cname:' + SDPUtils.localCName + '\r\n';
	  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
	    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
	        ' cname:' + SDPUtils.localCName + '\r\n';
	  }
	  return sdp;
	};

	// Gets the direction from the mediaSection or the sessionpart.
	SDPUtils.getDirection = function(mediaSection, sessionpart) {
	  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
	  var lines = SDPUtils.splitLines(mediaSection);
	  for (var i = 0; i < lines.length; i++) {
	    switch (lines[i]) {
	      case 'a=sendrecv':
	      case 'a=sendonly':
	      case 'a=recvonly':
	      case 'a=inactive':
	        return lines[i].substr(2);
	      default:
	        // FIXME: What should happen here?
	    }
	  }
	  if (sessionpart) {
	    return SDPUtils.getDirection(sessionpart);
	  }
	  return 'sendrecv';
	};

	SDPUtils.getKind = function(mediaSection) {
	  var lines = SDPUtils.splitLines(mediaSection);
	  var mline = lines[0].split(' ');
	  return mline[0].substr(2);
	};

	SDPUtils.isRejected = function(mediaSection) {
	  return mediaSection.split(' ', 2)[1] === '0';
	};

	SDPUtils.parseMLine = function(mediaSection) {
	  var lines = SDPUtils.splitLines(mediaSection);
	  var parts = lines[0].substr(2).split(' ');
	  return {
	    kind: parts[0],
	    port: parseInt(parts[1], 10),
	    protocol: parts[2],
	    fmt: parts.slice(3).join(' ')
	  };
	};

	SDPUtils.parseOLine = function(mediaSection) {
	  var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
	  var parts = line.substr(2).split(' ');
	  return {
	    username: parts[0],
	    sessionId: parts[1],
	    sessionVersion: parseInt(parts[2], 10),
	    netType: parts[3],
	    addressType: parts[4],
	    address: parts[5]
	  };
	};

	// a very naive interpretation of a valid SDP.
	SDPUtils.isValidSDP = function(blob) {
	  if (typeof blob !== 'string' || blob.length === 0) {
	    return false;
	  }
	  var lines = SDPUtils.splitLines(blob);
	  for (var i = 0; i < lines.length; i++) {
	    if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
	      return false;
	    }
	    // TODO: check the modifier a bit more.
	  }
	  return true;
	};

	// Expose public methods.
	{
	  module.exports = SDPUtils;
	}
	});

	function fixStatsType(stat) {
	  return {
	    inboundrtp: 'inbound-rtp',
	    outboundrtp: 'outbound-rtp',
	    candidatepair: 'candidate-pair',
	    localcandidate: 'local-candidate',
	    remotecandidate: 'remote-candidate'
	  }[stat.type] || stat.type;
	}

	function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
	  var sdp$$1 = sdp.writeRtpDescription(transceiver.kind, caps);

	  // Map ICE parameters (ufrag, pwd) to SDP.
	  sdp$$1 += sdp.writeIceParameters(
	      transceiver.iceGatherer.getLocalParameters());

	  // Map DTLS parameters to SDP.
	  sdp$$1 += sdp.writeDtlsParameters(
	      transceiver.dtlsTransport.getLocalParameters(),
	      type === 'offer' ? 'actpass' : dtlsRole || 'active');

	  sdp$$1 += 'a=mid:' + transceiver.mid + '\r\n';

	  if (transceiver.rtpSender && transceiver.rtpReceiver) {
	    sdp$$1 += 'a=sendrecv\r\n';
	  } else if (transceiver.rtpSender) {
	    sdp$$1 += 'a=sendonly\r\n';
	  } else if (transceiver.rtpReceiver) {
	    sdp$$1 += 'a=recvonly\r\n';
	  } else {
	    sdp$$1 += 'a=inactive\r\n';
	  }

	  if (transceiver.rtpSender) {
	    var trackId = transceiver.rtpSender._initialTrackId ||
	        transceiver.rtpSender.track.id;
	    transceiver.rtpSender._initialTrackId = trackId;
	    // spec.
	    var msid = 'msid:' + (stream ? stream.id : '-') + ' ' +
	        trackId + '\r\n';
	    sdp$$1 += 'a=' + msid;
	    // for Chrome. Legacy should no longer be required.
	    sdp$$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
	        ' ' + msid;

	    // RTX
	    if (transceiver.sendEncodingParameters[0].rtx) {
	      sdp$$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
	          ' ' + msid;
	      sdp$$1 += 'a=ssrc-group:FID ' +
	          transceiver.sendEncodingParameters[0].ssrc + ' ' +
	          transceiver.sendEncodingParameters[0].rtx.ssrc +
	          '\r\n';
	    }
	  }
	  // FIXME: this should be written by writeRtpDescription.
	  sdp$$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
	      ' cname:' + sdp.localCName + '\r\n';
	  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
	    sdp$$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
	        ' cname:' + sdp.localCName + '\r\n';
	  }
	  return sdp$$1;
	}

	// Edge does not like
	// 1) stun: filtered after 14393 unless ?transport=udp is present
	// 2) turn: that does not have all of turn:host:port?transport=udp
	// 3) turn: with ipv6 addresses
	// 4) turn: occurring muliple times
	function filterIceServers(iceServers, edgeVersion) {
	  var hasTurn = false;
	  iceServers = JSON.parse(JSON.stringify(iceServers));
	  return iceServers.filter(function(server) {
	    if (server && (server.urls || server.url)) {
	      var urls = server.urls || server.url;
	      if (server.url && !server.urls) {
	        console.warn('RTCIceServer.url is deprecated! Use urls instead.');
	      }
	      var isString = typeof urls === 'string';
	      if (isString) {
	        urls = [urls];
	      }
	      urls = urls.filter(function(url) {
	        var validTurn = url.indexOf('turn:') === 0 &&
	            url.indexOf('transport=udp') !== -1 &&
	            url.indexOf('turn:[') === -1 &&
	            !hasTurn;

	        if (validTurn) {
	          hasTurn = true;
	          return true;
	        }
	        return url.indexOf('stun:') === 0 && edgeVersion >= 14393 &&
	            url.indexOf('?transport=udp') === -1;
	      });

	      delete server.url;
	      server.urls = isString ? urls[0] : urls;
	      return !!urls.length;
	    }
	  });
	}

	// Determines the intersection of local and remote capabilities.
	function getCommonCapabilities(localCapabilities, remoteCapabilities) {
	  var commonCapabilities = {
	    codecs: [],
	    headerExtensions: [],
	    fecMechanisms: []
	  };

	  var findCodecByPayloadType = function(pt, codecs) {
	    pt = parseInt(pt, 10);
	    for (var i = 0; i < codecs.length; i++) {
	      if (codecs[i].payloadType === pt ||
	          codecs[i].preferredPayloadType === pt) {
	        return codecs[i];
	      }
	    }
	  };

	  var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
	    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
	    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
	    return lCodec && rCodec &&
	        lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
	  };

	  localCapabilities.codecs.forEach(function(lCodec) {
	    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
	      var rCodec = remoteCapabilities.codecs[i];
	      if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
	          lCodec.clockRate === rCodec.clockRate) {
	        if (lCodec.name.toLowerCase() === 'rtx' &&
	            lCodec.parameters && rCodec.parameters.apt) {
	          // for RTX we need to find the local rtx that has a apt
	          // which points to the same local codec as the remote one.
	          if (!rtxCapabilityMatches(lCodec, rCodec,
	              localCapabilities.codecs, remoteCapabilities.codecs)) {
	            continue;
	          }
	        }
	        rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
	        // number of channels is the highest common number of channels
	        rCodec.numChannels = Math.min(lCodec.numChannels,
	            rCodec.numChannels);
	        // push rCodec so we reply with offerer payload type
	        commonCapabilities.codecs.push(rCodec);

	        // determine common feedback mechanisms
	        rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
	          for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
	            if (lCodec.rtcpFeedback[j].type === fb.type &&
	                lCodec.rtcpFeedback[j].parameter === fb.parameter) {
	              return true;
	            }
	          }
	          return false;
	        });
	        // FIXME: also need to determine .parameters
	        //  see https://github.com/openpeer/ortc/issues/569
	        break;
	      }
	    }
	  });

	  localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
	    for (var i = 0; i < remoteCapabilities.headerExtensions.length;
	         i++) {
	      var rHeaderExtension = remoteCapabilities.headerExtensions[i];
	      if (lHeaderExtension.uri === rHeaderExtension.uri) {
	        commonCapabilities.headerExtensions.push(rHeaderExtension);
	        break;
	      }
	    }
	  });

	  // FIXME: fecMechanisms
	  return commonCapabilities;
	}

	// is action=setLocalDescription with type allowed in signalingState
	function isActionAllowedInSignalingState(action, type, signalingState) {
	  return {
	    offer: {
	      setLocalDescription: ['stable', 'have-local-offer'],
	      setRemoteDescription: ['stable', 'have-remote-offer']
	    },
	    answer: {
	      setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
	      setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
	    }
	  }[type][action].indexOf(signalingState) !== -1;
	}

	function maybeAddCandidate(iceTransport, candidate) {
	  // Edge's internal representation adds some fields therefore
	  // not all fieldѕ are taken into account.
	  var alreadyAdded = iceTransport.getRemoteCandidates()
	      .find(function(remoteCandidate) {
	        return candidate.foundation === remoteCandidate.foundation &&
	            candidate.ip === remoteCandidate.ip &&
	            candidate.port === remoteCandidate.port &&
	            candidate.priority === remoteCandidate.priority &&
	            candidate.protocol === remoteCandidate.protocol &&
	            candidate.type === remoteCandidate.type;
	      });
	  if (!alreadyAdded) {
	    iceTransport.addRemoteCandidate(candidate);
	  }
	  return !alreadyAdded;
	}


	function makeError(name, description) {
	  var e = new Error(description);
	  e.name = name;
	  // legacy error codes from https://heycam.github.io/webidl/#idl-DOMException-error-names
	  e.code = {
	    NotSupportedError: 9,
	    InvalidStateError: 11,
	    InvalidAccessError: 15,
	    TypeError: undefined,
	    OperationError: undefined
	  }[name];
	  return e;
	}

	var rtcpeerconnection = function(window, edgeVersion) {
	  // https://w3c.github.io/mediacapture-main/#mediastream
	  // Helper function to add the track to the stream and
	  // dispatch the event ourselves.
	  function addTrackToStreamAndFireEvent(track, stream) {
	    stream.addTrack(track);
	    stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack',
	        {track: track}));
	  }

	  function removeTrackFromStreamAndFireEvent(track, stream) {
	    stream.removeTrack(track);
	    stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack',
	        {track: track}));
	  }

	  function fireAddTrack(pc, track, receiver, streams) {
	    var trackEvent = new Event('track');
	    trackEvent.track = track;
	    trackEvent.receiver = receiver;
	    trackEvent.transceiver = {receiver: receiver};
	    trackEvent.streams = streams;
	    window.setTimeout(function() {
	      pc._dispatchEvent('track', trackEvent);
	    });
	  }

	  var RTCPeerConnection = function(config) {
	    var pc = this;

	    var _eventTarget = document.createDocumentFragment();
	    ['addEventListener', 'removeEventListener', 'dispatchEvent']
	        .forEach(function(method) {
	          pc[method] = _eventTarget[method].bind(_eventTarget);
	        });

	    this.canTrickleIceCandidates = null;

	    this.needNegotiation = false;

	    this.localStreams = [];
	    this.remoteStreams = [];

	    this._localDescription = null;
	    this._remoteDescription = null;

	    this.signalingState = 'stable';
	    this.iceConnectionState = 'new';
	    this.connectionState = 'new';
	    this.iceGatheringState = 'new';

	    config = JSON.parse(JSON.stringify(config || {}));

	    this.usingBundle = config.bundlePolicy === 'max-bundle';
	    if (config.rtcpMuxPolicy === 'negotiate') {
	      throw(makeError('NotSupportedError',
	          'rtcpMuxPolicy \'negotiate\' is not supported'));
	    } else if (!config.rtcpMuxPolicy) {
	      config.rtcpMuxPolicy = 'require';
	    }

	    switch (config.iceTransportPolicy) {
	      case 'all':
	      case 'relay':
	        break;
	      default:
	        config.iceTransportPolicy = 'all';
	        break;
	    }

	    switch (config.bundlePolicy) {
	      case 'balanced':
	      case 'max-compat':
	      case 'max-bundle':
	        break;
	      default:
	        config.bundlePolicy = 'balanced';
	        break;
	    }

	    config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);

	    this._iceGatherers = [];
	    if (config.iceCandidatePoolSize) {
	      for (var i = config.iceCandidatePoolSize; i > 0; i--) {
	        this._iceGatherers.push(new window.RTCIceGatherer({
	          iceServers: config.iceServers,
	          gatherPolicy: config.iceTransportPolicy
	        }));
	      }
	    } else {
	      config.iceCandidatePoolSize = 0;
	    }

	    this._config = config;

	    // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
	    // everything that is needed to describe a SDP m-line.
	    this.transceivers = [];

	    this._sdpSessionId = sdp.generateSessionId();
	    this._sdpSessionVersion = 0;

	    this._dtlsRole = undefined; // role for a=setup to use in answers.

	    this._isClosed = false;
	  };

	  Object.defineProperty(RTCPeerConnection.prototype, 'localDescription', {
	    configurable: true,
	    get: function() {
	      return this._localDescription;
	    }
	  });
	  Object.defineProperty(RTCPeerConnection.prototype, 'remoteDescription', {
	    configurable: true,
	    get: function() {
	      return this._remoteDescription;
	    }
	  });

	  // set up event handlers on prototype
	  RTCPeerConnection.prototype.onicecandidate = null;
	  RTCPeerConnection.prototype.onaddstream = null;
	  RTCPeerConnection.prototype.ontrack = null;
	  RTCPeerConnection.prototype.onremovestream = null;
	  RTCPeerConnection.prototype.onsignalingstatechange = null;
	  RTCPeerConnection.prototype.oniceconnectionstatechange = null;
	  RTCPeerConnection.prototype.onconnectionstatechange = null;
	  RTCPeerConnection.prototype.onicegatheringstatechange = null;
	  RTCPeerConnection.prototype.onnegotiationneeded = null;
	  RTCPeerConnection.prototype.ondatachannel = null;

	  RTCPeerConnection.prototype._dispatchEvent = function(name, event) {
	    if (this._isClosed) {
	      return;
	    }
	    this.dispatchEvent(event);
	    if (typeof this['on' + name] === 'function') {
	      this['on' + name](event);
	    }
	  };

	  RTCPeerConnection.prototype._emitGatheringStateChange = function() {
	    var event = new Event('icegatheringstatechange');
	    this._dispatchEvent('icegatheringstatechange', event);
	  };

	  RTCPeerConnection.prototype.getConfiguration = function() {
	    return this._config;
	  };

	  RTCPeerConnection.prototype.getLocalStreams = function() {
	    return this.localStreams;
	  };

	  RTCPeerConnection.prototype.getRemoteStreams = function() {
	    return this.remoteStreams;
	  };

	  // internal helper to create a transceiver object.
	  // (which is not yet the same as the WebRTC 1.0 transceiver)
	  RTCPeerConnection.prototype._createTransceiver = function(kind, doNotAdd) {
	    var hasBundleTransport = this.transceivers.length > 0;
	    var transceiver = {
	      track: null,
	      iceGatherer: null,
	      iceTransport: null,
	      dtlsTransport: null,
	      localCapabilities: null,
	      remoteCapabilities: null,
	      rtpSender: null,
	      rtpReceiver: null,
	      kind: kind,
	      mid: null,
	      sendEncodingParameters: null,
	      recvEncodingParameters: null,
	      stream: null,
	      associatedRemoteMediaStreams: [],
	      wantReceive: true
	    };
	    if (this.usingBundle && hasBundleTransport) {
	      transceiver.iceTransport = this.transceivers[0].iceTransport;
	      transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
	    } else {
	      var transports = this._createIceAndDtlsTransports();
	      transceiver.iceTransport = transports.iceTransport;
	      transceiver.dtlsTransport = transports.dtlsTransport;
	    }
	    if (!doNotAdd) {
	      this.transceivers.push(transceiver);
	    }
	    return transceiver;
	  };

	  RTCPeerConnection.prototype.addTrack = function(track, stream) {
	    if (this._isClosed) {
	      throw makeError('InvalidStateError',
	          'Attempted to call addTrack on a closed peerconnection.');
	    }

	    var alreadyExists = this.transceivers.find(function(s) {
	      return s.track === track;
	    });

	    if (alreadyExists) {
	      throw makeError('InvalidAccessError', 'Track already exists.');
	    }

	    var transceiver;
	    for (var i = 0; i < this.transceivers.length; i++) {
	      if (!this.transceivers[i].track &&
	          this.transceivers[i].kind === track.kind) {
	        transceiver = this.transceivers[i];
	      }
	    }
	    if (!transceiver) {
	      transceiver = this._createTransceiver(track.kind);
	    }

	    this._maybeFireNegotiationNeeded();

	    if (this.localStreams.indexOf(stream) === -1) {
	      this.localStreams.push(stream);
	    }

	    transceiver.track = track;
	    transceiver.stream = stream;
	    transceiver.rtpSender = new window.RTCRtpSender(track,
	        transceiver.dtlsTransport);
	    return transceiver.rtpSender;
	  };

	  RTCPeerConnection.prototype.addStream = function(stream) {
	    var pc = this;
	    if (edgeVersion >= 15025) {
	      stream.getTracks().forEach(function(track) {
	        pc.addTrack(track, stream);
	      });
	    } else {
	      // Clone is necessary for local demos mostly, attaching directly
	      // to two different senders does not work (build 10547).
	      // Fixed in 15025 (or earlier)
	      var clonedStream = stream.clone();
	      stream.getTracks().forEach(function(track, idx) {
	        var clonedTrack = clonedStream.getTracks()[idx];
	        track.addEventListener('enabled', function(event) {
	          clonedTrack.enabled = event.enabled;
	        });
	      });
	      clonedStream.getTracks().forEach(function(track) {
	        pc.addTrack(track, clonedStream);
	      });
	    }
	  };

	  RTCPeerConnection.prototype.removeTrack = function(sender) {
	    if (this._isClosed) {
	      throw makeError('InvalidStateError',
	          'Attempted to call removeTrack on a closed peerconnection.');
	    }

	    if (!(sender instanceof window.RTCRtpSender)) {
	      throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' +
	          'does not implement interface RTCRtpSender.');
	    }

	    var transceiver = this.transceivers.find(function(t) {
	      return t.rtpSender === sender;
	    });

	    if (!transceiver) {
	      throw makeError('InvalidAccessError',
	          'Sender was not created by this connection.');
	    }
	    var stream = transceiver.stream;

	    transceiver.rtpSender.stop();
	    transceiver.rtpSender = null;
	    transceiver.track = null;
	    transceiver.stream = null;

	    // remove the stream from the set of local streams
	    var localStreams = this.transceivers.map(function(t) {
	      return t.stream;
	    });
	    if (localStreams.indexOf(stream) === -1 &&
	        this.localStreams.indexOf(stream) > -1) {
	      this.localStreams.splice(this.localStreams.indexOf(stream), 1);
	    }

	    this._maybeFireNegotiationNeeded();
	  };

	  RTCPeerConnection.prototype.removeStream = function(stream) {
	    var pc = this;
	    stream.getTracks().forEach(function(track) {
	      var sender = pc.getSenders().find(function(s) {
	        return s.track === track;
	      });
	      if (sender) {
	        pc.removeTrack(sender);
	      }
	    });
	  };

	  RTCPeerConnection.prototype.getSenders = function() {
	    return this.transceivers.filter(function(transceiver) {
	      return !!transceiver.rtpSender;
	    })
	    .map(function(transceiver) {
	      return transceiver.rtpSender;
	    });
	  };

	  RTCPeerConnection.prototype.getReceivers = function() {
	    return this.transceivers.filter(function(transceiver) {
	      return !!transceiver.rtpReceiver;
	    })
	    .map(function(transceiver) {
	      return transceiver.rtpReceiver;
	    });
	  };


	  RTCPeerConnection.prototype._createIceGatherer = function(sdpMLineIndex,
	      usingBundle) {
	    var pc = this;
	    if (usingBundle && sdpMLineIndex > 0) {
	      return this.transceivers[0].iceGatherer;
	    } else if (this._iceGatherers.length) {
	      return this._iceGatherers.shift();
	    }
	    var iceGatherer = new window.RTCIceGatherer({
	      iceServers: this._config.iceServers,
	      gatherPolicy: this._config.iceTransportPolicy
	    });
	    Object.defineProperty(iceGatherer, 'state',
	        {value: 'new', writable: true}
	    );

	    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
	    this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
	      var end = !event.candidate || Object.keys(event.candidate).length === 0;
	      // polyfill since RTCIceGatherer.state is not implemented in
	      // Edge 10547 yet.
	      iceGatherer.state = end ? 'completed' : 'gathering';
	      if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
	        pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
	      }
	    };
	    iceGatherer.addEventListener('localcandidate',
	      this.transceivers[sdpMLineIndex].bufferCandidates);
	    return iceGatherer;
	  };

	  // start gathering from an RTCIceGatherer.
	  RTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
	    var pc = this;
	    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
	    if (iceGatherer.onlocalcandidate) {
	      return;
	    }
	    var bufferedCandidateEvents =
	      this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
	    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
	    iceGatherer.removeEventListener('localcandidate',
	      this.transceivers[sdpMLineIndex].bufferCandidates);
	    iceGatherer.onlocalcandidate = function(evt) {
	      if (pc.usingBundle && sdpMLineIndex > 0) {
	        // if we know that we use bundle we can drop candidates with
	        // ѕdpMLineIndex > 0. If we don't do this then our state gets
	        // confused since we dispose the extra ice gatherer.
	        return;
	      }
	      var event = new Event('icecandidate');
	      event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

	      var cand = evt.candidate;
	      // Edge emits an empty object for RTCIceCandidateComplete‥
	      var end = !cand || Object.keys(cand).length === 0;
	      if (end) {
	        // polyfill since RTCIceGatherer.state is not implemented in
	        // Edge 10547 yet.
	        if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
	          iceGatherer.state = 'completed';
	        }
	      } else {
	        if (iceGatherer.state === 'new') {
	          iceGatherer.state = 'gathering';
	        }
	        // RTCIceCandidate doesn't have a component, needs to be added
	        cand.component = 1;
	        // also the usernameFragment. TODO: update SDP to take both variants.
	        cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;

	        var serializedCandidate = sdp.writeCandidate(cand);
	        event.candidate = Object.assign(event.candidate,
	            sdp.parseCandidate(serializedCandidate));

	        event.candidate.candidate = serializedCandidate;
	        event.candidate.toJSON = function() {
	          return {
	            candidate: event.candidate.candidate,
	            sdpMid: event.candidate.sdpMid,
	            sdpMLineIndex: event.candidate.sdpMLineIndex,
	            usernameFragment: event.candidate.usernameFragment
	          };
	        };
	      }

	      // update local description.
	      var sections = sdp.getMediaSections(pc._localDescription.sdp);
	      if (!end) {
	        sections[event.candidate.sdpMLineIndex] +=
	            'a=' + event.candidate.candidate + '\r\n';
	      } else {
	        sections[event.candidate.sdpMLineIndex] +=
	            'a=end-of-candidates\r\n';
	      }
	      pc._localDescription.sdp =
	          sdp.getDescription(pc._localDescription.sdp) +
	          sections.join('');
	      var complete = pc.transceivers.every(function(transceiver) {
	        return transceiver.iceGatherer &&
	            transceiver.iceGatherer.state === 'completed';
	      });

	      if (pc.iceGatheringState !== 'gathering') {
	        pc.iceGatheringState = 'gathering';
	        pc._emitGatheringStateChange();
	      }

	      // Emit candidate. Also emit null candidate when all gatherers are
	      // complete.
	      if (!end) {
	        pc._dispatchEvent('icecandidate', event);
	      }
	      if (complete) {
	        pc._dispatchEvent('icecandidate', new Event('icecandidate'));
	        pc.iceGatheringState = 'complete';
	        pc._emitGatheringStateChange();
	      }
	    };

	    // emit already gathered candidates.
	    window.setTimeout(function() {
	      bufferedCandidateEvents.forEach(function(e) {
	        iceGatherer.onlocalcandidate(e);
	      });
	    }, 0);
	  };

	  // Create ICE transport and DTLS transport.
	  RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
	    var pc = this;
	    var iceTransport = new window.RTCIceTransport(null);
	    iceTransport.onicestatechange = function() {
	      pc._updateIceConnectionState();
	      pc._updateConnectionState();
	    };

	    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
	    dtlsTransport.ondtlsstatechange = function() {
	      pc._updateConnectionState();
	    };
	    dtlsTransport.onerror = function() {
	      // onerror does not set state to failed by itself.
	      Object.defineProperty(dtlsTransport, 'state',
	          {value: 'failed', writable: true});
	      pc._updateConnectionState();
	    };

	    return {
	      iceTransport: iceTransport,
	      dtlsTransport: dtlsTransport
	    };
	  };

	  // Destroy ICE gatherer, ICE transport and DTLS transport.
	  // Without triggering the callbacks.
	  RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
	      sdpMLineIndex) {
	    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
	    if (iceGatherer) {
	      delete iceGatherer.onlocalcandidate;
	      delete this.transceivers[sdpMLineIndex].iceGatherer;
	    }
	    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
	    if (iceTransport) {
	      delete iceTransport.onicestatechange;
	      delete this.transceivers[sdpMLineIndex].iceTransport;
	    }
	    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
	    if (dtlsTransport) {
	      delete dtlsTransport.ondtlsstatechange;
	      delete dtlsTransport.onerror;
	      delete this.transceivers[sdpMLineIndex].dtlsTransport;
	    }
	  };

	  // Start the RTP Sender and Receiver for a transceiver.
	  RTCPeerConnection.prototype._transceive = function(transceiver,
	      send, recv) {
	    var params = getCommonCapabilities(transceiver.localCapabilities,
	        transceiver.remoteCapabilities);
	    if (send && transceiver.rtpSender) {
	      params.encodings = transceiver.sendEncodingParameters;
	      params.rtcp = {
	        cname: sdp.localCName,
	        compound: transceiver.rtcpParameters.compound
	      };
	      if (transceiver.recvEncodingParameters.length) {
	        params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
	      }
	      transceiver.rtpSender.send(params);
	    }
	    if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
	      // remove RTX field in Edge 14942
	      if (transceiver.kind === 'video'
	          && transceiver.recvEncodingParameters
	          && edgeVersion < 15019) {
	        transceiver.recvEncodingParameters.forEach(function(p) {
	          delete p.rtx;
	        });
	      }
	      if (transceiver.recvEncodingParameters.length) {
	        params.encodings = transceiver.recvEncodingParameters;
	      } else {
	        params.encodings = [{}];
	      }
	      params.rtcp = {
	        compound: transceiver.rtcpParameters.compound
	      };
	      if (transceiver.rtcpParameters.cname) {
	        params.rtcp.cname = transceiver.rtcpParameters.cname;
	      }
	      if (transceiver.sendEncodingParameters.length) {
	        params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
	      }
	      transceiver.rtpReceiver.receive(params);
	    }
	  };

	  RTCPeerConnection.prototype.setLocalDescription = function(description) {
	    var pc = this;

	    // Note: pranswer is not supported.
	    if (['offer', 'answer'].indexOf(description.type) === -1) {
	      return Promise.reject(makeError('TypeError',
	          'Unsupported type "' + description.type + '"'));
	    }

	    if (!isActionAllowedInSignalingState('setLocalDescription',
	        description.type, pc.signalingState) || pc._isClosed) {
	      return Promise.reject(makeError('InvalidStateError',
	          'Can not set local ' + description.type +
	          ' in state ' + pc.signalingState));
	    }

	    var sections;
	    var sessionpart;
	    if (description.type === 'offer') {
	      // VERY limited support for SDP munging. Limited to:
	      // * changing the order of codecs
	      sections = sdp.splitSections(description.sdp);
	      sessionpart = sections.shift();
	      sections.forEach(function(mediaSection, sdpMLineIndex) {
	        var caps = sdp.parseRtpParameters(mediaSection);
	        pc.transceivers[sdpMLineIndex].localCapabilities = caps;
	      });

	      pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
	        pc._gather(transceiver.mid, sdpMLineIndex);
	      });
	    } else if (description.type === 'answer') {
	      sections = sdp.splitSections(pc._remoteDescription.sdp);
	      sessionpart = sections.shift();
	      var isIceLite = sdp.matchPrefix(sessionpart,
	          'a=ice-lite').length > 0;
	      sections.forEach(function(mediaSection, sdpMLineIndex) {
	        var transceiver = pc.transceivers[sdpMLineIndex];
	        var iceGatherer = transceiver.iceGatherer;
	        var iceTransport = transceiver.iceTransport;
	        var dtlsTransport = transceiver.dtlsTransport;
	        var localCapabilities = transceiver.localCapabilities;
	        var remoteCapabilities = transceiver.remoteCapabilities;

	        // treat bundle-only as not-rejected.
	        var rejected = sdp.isRejected(mediaSection) &&
	            sdp.matchPrefix(mediaSection, 'a=bundle-only').length === 0;

	        if (!rejected && !transceiver.rejected) {
	          var remoteIceParameters = sdp.getIceParameters(
	              mediaSection, sessionpart);
	          var remoteDtlsParameters = sdp.getDtlsParameters(
	              mediaSection, sessionpart);
	          if (isIceLite) {
	            remoteDtlsParameters.role = 'server';
	          }

	          if (!pc.usingBundle || sdpMLineIndex === 0) {
	            pc._gather(transceiver.mid, sdpMLineIndex);
	            if (iceTransport.state === 'new') {
	              iceTransport.start(iceGatherer, remoteIceParameters,
	                  isIceLite ? 'controlling' : 'controlled');
	            }
	            if (dtlsTransport.state === 'new') {
	              dtlsTransport.start(remoteDtlsParameters);
	            }
	          }

	          // Calculate intersection of capabilities.
	          var params = getCommonCapabilities(localCapabilities,
	              remoteCapabilities);

	          // Start the RTCRtpSender. The RTCRtpReceiver for this
	          // transceiver has already been started in setRemoteDescription.
	          pc._transceive(transceiver,
	              params.codecs.length > 0,
	              false);
	        }
	      });
	    }

	    pc._localDescription = {
	      type: description.type,
	      sdp: description.sdp
	    };
	    if (description.type === 'offer') {
	      pc._updateSignalingState('have-local-offer');
	    } else {
	      pc._updateSignalingState('stable');
	    }

	    return Promise.resolve();
	  };

	  RTCPeerConnection.prototype.setRemoteDescription = function(description) {
	    var pc = this;

	    // Note: pranswer is not supported.
	    if (['offer', 'answer'].indexOf(description.type) === -1) {
	      return Promise.reject(makeError('TypeError',
	          'Unsupported type "' + description.type + '"'));
	    }

	    if (!isActionAllowedInSignalingState('setRemoteDescription',
	        description.type, pc.signalingState) || pc._isClosed) {
	      return Promise.reject(makeError('InvalidStateError',
	          'Can not set remote ' + description.type +
	          ' in state ' + pc.signalingState));
	    }

	    var streams = {};
	    pc.remoteStreams.forEach(function(stream) {
	      streams[stream.id] = stream;
	    });
	    var receiverList = [];
	    var sections = sdp.splitSections(description.sdp);
	    var sessionpart = sections.shift();
	    var isIceLite = sdp.matchPrefix(sessionpart,
	        'a=ice-lite').length > 0;
	    var usingBundle = sdp.matchPrefix(sessionpart,
	        'a=group:BUNDLE ').length > 0;
	    pc.usingBundle = usingBundle;
	    var iceOptions = sdp.matchPrefix(sessionpart,
	        'a=ice-options:')[0];
	    if (iceOptions) {
	      pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
	          .indexOf('trickle') >= 0;
	    } else {
	      pc.canTrickleIceCandidates = false;
	    }

	    sections.forEach(function(mediaSection, sdpMLineIndex) {
	      var lines = sdp.splitLines(mediaSection);
	      var kind = sdp.getKind(mediaSection);
	      // treat bundle-only as not-rejected.
	      var rejected = sdp.isRejected(mediaSection) &&
	          sdp.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
	      var protocol = lines[0].substr(2).split(' ')[2];

	      var direction = sdp.getDirection(mediaSection, sessionpart);
	      var remoteMsid = sdp.parseMsid(mediaSection);

	      var mid = sdp.getMid(mediaSection) || sdp.generateIdentifier();

	      // Reject datachannels which are not implemented yet.
	      if (rejected || (kind === 'application' && (protocol === 'DTLS/SCTP' ||
	          protocol === 'UDP/DTLS/SCTP'))) {
	        // TODO: this is dangerous in the case where a non-rejected m-line
	        //     becomes rejected.
	        pc.transceivers[sdpMLineIndex] = {
	          mid: mid,
	          kind: kind,
	          protocol: protocol,
	          rejected: true
	        };
	        return;
	      }

	      if (!rejected && pc.transceivers[sdpMLineIndex] &&
	          pc.transceivers[sdpMLineIndex].rejected) {
	        // recycle a rejected transceiver.
	        pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
	      }

	      var transceiver;
	      var iceGatherer;
	      var iceTransport;
	      var dtlsTransport;
	      var rtpReceiver;
	      var sendEncodingParameters;
	      var recvEncodingParameters;
	      var localCapabilities;

	      var track;
	      // FIXME: ensure the mediaSection has rtcp-mux set.
	      var remoteCapabilities = sdp.parseRtpParameters(mediaSection);
	      var remoteIceParameters;
	      var remoteDtlsParameters;
	      if (!rejected) {
	        remoteIceParameters = sdp.getIceParameters(mediaSection,
	            sessionpart);
	        remoteDtlsParameters = sdp.getDtlsParameters(mediaSection,
	            sessionpart);
	        remoteDtlsParameters.role = 'client';
	      }
	      recvEncodingParameters =
	          sdp.parseRtpEncodingParameters(mediaSection);

	      var rtcpParameters = sdp.parseRtcpParameters(mediaSection);

	      var isComplete = sdp.matchPrefix(mediaSection,
	          'a=end-of-candidates', sessionpart).length > 0;
	      var cands = sdp.matchPrefix(mediaSection, 'a=candidate:')
	          .map(function(cand) {
	            return sdp.parseCandidate(cand);
	          })
	          .filter(function(cand) {
	            return cand.component === 1;
	          });

	      // Check if we can use BUNDLE and dispose transports.
	      if ((description.type === 'offer' || description.type === 'answer') &&
	          !rejected && usingBundle && sdpMLineIndex > 0 &&
	          pc.transceivers[sdpMLineIndex]) {
	        pc._disposeIceAndDtlsTransports(sdpMLineIndex);
	        pc.transceivers[sdpMLineIndex].iceGatherer =
	            pc.transceivers[0].iceGatherer;
	        pc.transceivers[sdpMLineIndex].iceTransport =
	            pc.transceivers[0].iceTransport;
	        pc.transceivers[sdpMLineIndex].dtlsTransport =
	            pc.transceivers[0].dtlsTransport;
	        if (pc.transceivers[sdpMLineIndex].rtpSender) {
	          pc.transceivers[sdpMLineIndex].rtpSender.setTransport(
	              pc.transceivers[0].dtlsTransport);
	        }
	        if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
	          pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
	              pc.transceivers[0].dtlsTransport);
	        }
	      }
	      if (description.type === 'offer' && !rejected) {
	        transceiver = pc.transceivers[sdpMLineIndex] ||
	            pc._createTransceiver(kind);
	        transceiver.mid = mid;

	        if (!transceiver.iceGatherer) {
	          transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
	              usingBundle);
	        }

	        if (cands.length && transceiver.iceTransport.state === 'new') {
	          if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
	            transceiver.iceTransport.setRemoteCandidates(cands);
	          } else {
	            cands.forEach(function(candidate) {
	              maybeAddCandidate(transceiver.iceTransport, candidate);
	            });
	          }
	        }

	        localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);

	        // filter RTX until additional stuff needed for RTX is implemented
	        // in adapter.js
	        if (edgeVersion < 15019) {
	          localCapabilities.codecs = localCapabilities.codecs.filter(
	              function(codec) {
	                return codec.name !== 'rtx';
	              });
	        }

	        sendEncodingParameters = transceiver.sendEncodingParameters || [{
	          ssrc: (2 * sdpMLineIndex + 2) * 1001
	        }];

	        // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
	        var isNewTrack = false;
	        if (direction === 'sendrecv' || direction === 'sendonly') {
	          isNewTrack = !transceiver.rtpReceiver;
	          rtpReceiver = transceiver.rtpReceiver ||
	              new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);

	          if (isNewTrack) {
	            var stream;
	            track = rtpReceiver.track;
	            // FIXME: does not work with Plan B.
	            if (remoteMsid && remoteMsid.stream === '-') ; else if (remoteMsid) {
	              if (!streams[remoteMsid.stream]) {
	                streams[remoteMsid.stream] = new window.MediaStream();
	                Object.defineProperty(streams[remoteMsid.stream], 'id', {
	                  get: function() {
	                    return remoteMsid.stream;
	                  }
	                });
	              }
	              Object.defineProperty(track, 'id', {
	                get: function() {
	                  return remoteMsid.track;
	                }
	              });
	              stream = streams[remoteMsid.stream];
	            } else {
	              if (!streams.default) {
	                streams.default = new window.MediaStream();
	              }
	              stream = streams.default;
	            }
	            if (stream) {
	              addTrackToStreamAndFireEvent(track, stream);
	              transceiver.associatedRemoteMediaStreams.push(stream);
	            }
	            receiverList.push([track, rtpReceiver, stream]);
	          }
	        } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
	          transceiver.associatedRemoteMediaStreams.forEach(function(s) {
	            var nativeTrack = s.getTracks().find(function(t) {
	              return t.id === transceiver.rtpReceiver.track.id;
	            });
	            if (nativeTrack) {
	              removeTrackFromStreamAndFireEvent(nativeTrack, s);
	            }
	          });
	          transceiver.associatedRemoteMediaStreams = [];
	        }

	        transceiver.localCapabilities = localCapabilities;
	        transceiver.remoteCapabilities = remoteCapabilities;
	        transceiver.rtpReceiver = rtpReceiver;
	        transceiver.rtcpParameters = rtcpParameters;
	        transceiver.sendEncodingParameters = sendEncodingParameters;
	        transceiver.recvEncodingParameters = recvEncodingParameters;

	        // Start the RTCRtpReceiver now. The RTPSender is started in
	        // setLocalDescription.
	        pc._transceive(pc.transceivers[sdpMLineIndex],
	            false,
	            isNewTrack);
	      } else if (description.type === 'answer' && !rejected) {
	        transceiver = pc.transceivers[sdpMLineIndex];
	        iceGatherer = transceiver.iceGatherer;
	        iceTransport = transceiver.iceTransport;
	        dtlsTransport = transceiver.dtlsTransport;
	        rtpReceiver = transceiver.rtpReceiver;
	        sendEncodingParameters = transceiver.sendEncodingParameters;
	        localCapabilities = transceiver.localCapabilities;

	        pc.transceivers[sdpMLineIndex].recvEncodingParameters =
	            recvEncodingParameters;
	        pc.transceivers[sdpMLineIndex].remoteCapabilities =
	            remoteCapabilities;
	        pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

	        if (cands.length && iceTransport.state === 'new') {
	          if ((isIceLite || isComplete) &&
	              (!usingBundle || sdpMLineIndex === 0)) {
	            iceTransport.setRemoteCandidates(cands);
	          } else {
	            cands.forEach(function(candidate) {
	              maybeAddCandidate(transceiver.iceTransport, candidate);
	            });
	          }
	        }

	        if (!usingBundle || sdpMLineIndex === 0) {
	          if (iceTransport.state === 'new') {
	            iceTransport.start(iceGatherer, remoteIceParameters,
	                'controlling');
	          }
	          if (dtlsTransport.state === 'new') {
	            dtlsTransport.start(remoteDtlsParameters);
	          }
	        }

	        // If the offer contained RTX but the answer did not,
	        // remove RTX from sendEncodingParameters.
	        var commonCapabilities = getCommonCapabilities(
	          transceiver.localCapabilities,
	          transceiver.remoteCapabilities);

	        var hasRtx = commonCapabilities.codecs.filter(function(c) {
	          return c.name.toLowerCase() === 'rtx';
	        }).length;
	        if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
	          delete transceiver.sendEncodingParameters[0].rtx;
	        }

	        pc._transceive(transceiver,
	            direction === 'sendrecv' || direction === 'recvonly',
	            direction === 'sendrecv' || direction === 'sendonly');

	        // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
	        if (rtpReceiver &&
	            (direction === 'sendrecv' || direction === 'sendonly')) {
	          track = rtpReceiver.track;
	          if (remoteMsid) {
	            if (!streams[remoteMsid.stream]) {
	              streams[remoteMsid.stream] = new window.MediaStream();
	            }
	            addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
	            receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
	          } else {
	            if (!streams.default) {
	              streams.default = new window.MediaStream();
	            }
	            addTrackToStreamAndFireEvent(track, streams.default);
	            receiverList.push([track, rtpReceiver, streams.default]);
	          }
	        } else {
	          // FIXME: actually the receiver should be created later.
	          delete transceiver.rtpReceiver;
	        }
	      }
	    });

	    if (pc._dtlsRole === undefined) {
	      pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
	    }

	    pc._remoteDescription = {
	      type: description.type,
	      sdp: description.sdp
	    };
	    if (description.type === 'offer') {
	      pc._updateSignalingState('have-remote-offer');
	    } else {
	      pc._updateSignalingState('stable');
	    }
	    Object.keys(streams).forEach(function(sid) {
	      var stream = streams[sid];
	      if (stream.getTracks().length) {
	        if (pc.remoteStreams.indexOf(stream) === -1) {
	          pc.remoteStreams.push(stream);
	          var event = new Event('addstream');
	          event.stream = stream;
	          window.setTimeout(function() {
	            pc._dispatchEvent('addstream', event);
	          });
	        }

	        receiverList.forEach(function(item) {
	          var track = item[0];
	          var receiver = item[1];
	          if (stream.id !== item[2].id) {
	            return;
	          }
	          fireAddTrack(pc, track, receiver, [stream]);
	        });
	      }
	    });
	    receiverList.forEach(function(item) {
	      if (item[2]) {
	        return;
	      }
	      fireAddTrack(pc, item[0], item[1], []);
	    });

	    // check whether addIceCandidate({}) was called within four seconds after
	    // setRemoteDescription.
	    window.setTimeout(function() {
	      if (!(pc && pc.transceivers)) {
	        return;
	      }
	      pc.transceivers.forEach(function(transceiver) {
	        if (transceiver.iceTransport &&
	            transceiver.iceTransport.state === 'new' &&
	            transceiver.iceTransport.getRemoteCandidates().length > 0) {
	          console.warn('Timeout for addRemoteCandidate. Consider sending ' +
	              'an end-of-candidates notification');
	          transceiver.iceTransport.addRemoteCandidate({});
	        }
	      });
	    }, 4000);

	    return Promise.resolve();
	  };

	  RTCPeerConnection.prototype.close = function() {
	    this.transceivers.forEach(function(transceiver) {
	      /* not yet
	      if (transceiver.iceGatherer) {
	        transceiver.iceGatherer.close();
	      }
	      */
	      if (transceiver.iceTransport) {
	        transceiver.iceTransport.stop();
	      }
	      if (transceiver.dtlsTransport) {
	        transceiver.dtlsTransport.stop();
	      }
	      if (transceiver.rtpSender) {
	        transceiver.rtpSender.stop();
	      }
	      if (transceiver.rtpReceiver) {
	        transceiver.rtpReceiver.stop();
	      }
	    });
	    // FIXME: clean up tracks, local streams, remote streams, etc
	    this._isClosed = true;
	    this._updateSignalingState('closed');
	  };

	  // Update the signaling state.
	  RTCPeerConnection.prototype._updateSignalingState = function(newState) {
	    this.signalingState = newState;
	    var event = new Event('signalingstatechange');
	    this._dispatchEvent('signalingstatechange', event);
	  };

	  // Determine whether to fire the negotiationneeded event.
	  RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
	    var pc = this;
	    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
	      return;
	    }
	    this.needNegotiation = true;
	    window.setTimeout(function() {
	      if (pc.needNegotiation) {
	        pc.needNegotiation = false;
	        var event = new Event('negotiationneeded');
	        pc._dispatchEvent('negotiationneeded', event);
	      }
	    }, 0);
	  };

	  // Update the ice connection state.
	  RTCPeerConnection.prototype._updateIceConnectionState = function() {
	    var newState;
	    var states = {
	      'new': 0,
	      closed: 0,
	      checking: 0,
	      connected: 0,
	      completed: 0,
	      disconnected: 0,
	      failed: 0
	    };
	    this.transceivers.forEach(function(transceiver) {
	      states[transceiver.iceTransport.state]++;
	    });

	    newState = 'new';
	    if (states.failed > 0) {
	      newState = 'failed';
	    } else if (states.checking > 0) {
	      newState = 'checking';
	    } else if (states.disconnected > 0) {
	      newState = 'disconnected';
	    } else if (states.new > 0) {
	      newState = 'new';
	    } else if (states.connected > 0) {
	      newState = 'connected';
	    } else if (states.completed > 0) {
	      newState = 'completed';
	    }

	    if (newState !== this.iceConnectionState) {
	      this.iceConnectionState = newState;
	      var event = new Event('iceconnectionstatechange');
	      this._dispatchEvent('iceconnectionstatechange', event);
	    }
	  };

	  // Update the connection state.
	  RTCPeerConnection.prototype._updateConnectionState = function() {
	    var newState;
	    var states = {
	      'new': 0,
	      closed: 0,
	      connecting: 0,
	      connected: 0,
	      completed: 0,
	      disconnected: 0,
	      failed: 0
	    };
	    this.transceivers.forEach(function(transceiver) {
	      states[transceiver.iceTransport.state]++;
	      states[transceiver.dtlsTransport.state]++;
	    });
	    // ICETransport.completed and connected are the same for this purpose.
	    states.connected += states.completed;

	    newState = 'new';
	    if (states.failed > 0) {
	      newState = 'failed';
	    } else if (states.connecting > 0) {
	      newState = 'connecting';
	    } else if (states.disconnected > 0) {
	      newState = 'disconnected';
	    } else if (states.new > 0) {
	      newState = 'new';
	    } else if (states.connected > 0) {
	      newState = 'connected';
	    }

	    if (newState !== this.connectionState) {
	      this.connectionState = newState;
	      var event = new Event('connectionstatechange');
	      this._dispatchEvent('connectionstatechange', event);
	    }
	  };

	  RTCPeerConnection.prototype.createOffer = function() {
	    var pc = this;

	    if (pc._isClosed) {
	      return Promise.reject(makeError('InvalidStateError',
	          'Can not call createOffer after close'));
	    }

	    var numAudioTracks = pc.transceivers.filter(function(t) {
	      return t.kind === 'audio';
	    }).length;
	    var numVideoTracks = pc.transceivers.filter(function(t) {
	      return t.kind === 'video';
	    }).length;

	    // Determine number of audio and video tracks we need to send/recv.
	    var offerOptions = arguments[0];
	    if (offerOptions) {
	      // Reject Chrome legacy constraints.
	      if (offerOptions.mandatory || offerOptions.optional) {
	        throw new TypeError(
	            'Legacy mandatory/optional constraints not supported.');
	      }
	      if (offerOptions.offerToReceiveAudio !== undefined) {
	        if (offerOptions.offerToReceiveAudio === true) {
	          numAudioTracks = 1;
	        } else if (offerOptions.offerToReceiveAudio === false) {
	          numAudioTracks = 0;
	        } else {
	          numAudioTracks = offerOptions.offerToReceiveAudio;
	        }
	      }
	      if (offerOptions.offerToReceiveVideo !== undefined) {
	        if (offerOptions.offerToReceiveVideo === true) {
	          numVideoTracks = 1;
	        } else if (offerOptions.offerToReceiveVideo === false) {
	          numVideoTracks = 0;
	        } else {
	          numVideoTracks = offerOptions.offerToReceiveVideo;
	        }
	      }
	    }

	    pc.transceivers.forEach(function(transceiver) {
	      if (transceiver.kind === 'audio') {
	        numAudioTracks--;
	        if (numAudioTracks < 0) {
	          transceiver.wantReceive = false;
	        }
	      } else if (transceiver.kind === 'video') {
	        numVideoTracks--;
	        if (numVideoTracks < 0) {
	          transceiver.wantReceive = false;
	        }
	      }
	    });

	    // Create M-lines for recvonly streams.
	    while (numAudioTracks > 0 || numVideoTracks > 0) {
	      if (numAudioTracks > 0) {
	        pc._createTransceiver('audio');
	        numAudioTracks--;
	      }
	      if (numVideoTracks > 0) {
	        pc._createTransceiver('video');
	        numVideoTracks--;
	      }
	    }

	    var sdp$$1 = sdp.writeSessionBoilerplate(pc._sdpSessionId,
	        pc._sdpSessionVersion++);
	    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
	      // For each track, create an ice gatherer, ice transport,
	      // dtls transport, potentially rtpsender and rtpreceiver.
	      var track = transceiver.track;
	      var kind = transceiver.kind;
	      var mid = transceiver.mid || sdp.generateIdentifier();
	      transceiver.mid = mid;

	      if (!transceiver.iceGatherer) {
	        transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
	            pc.usingBundle);
	      }

	      var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
	      // filter RTX until additional stuff needed for RTX is implemented
	      // in adapter.js
	      if (edgeVersion < 15019) {
	        localCapabilities.codecs = localCapabilities.codecs.filter(
	            function(codec) {
	              return codec.name !== 'rtx';
	            });
	      }
	      localCapabilities.codecs.forEach(function(codec) {
	        // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
	        // by adding level-asymmetry-allowed=1
	        if (codec.name === 'H264' &&
	            codec.parameters['level-asymmetry-allowed'] === undefined) {
	          codec.parameters['level-asymmetry-allowed'] = '1';
	        }

	        // for subsequent offers, we might have to re-use the payload
	        // type of the last offer.
	        if (transceiver.remoteCapabilities &&
	            transceiver.remoteCapabilities.codecs) {
	          transceiver.remoteCapabilities.codecs.forEach(function(remoteCodec) {
	            if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() &&
	                codec.clockRate === remoteCodec.clockRate) {
	              codec.preferredPayloadType = remoteCodec.payloadType;
	            }
	          });
	        }
	      });
	      localCapabilities.headerExtensions.forEach(function(hdrExt) {
	        var remoteExtensions = transceiver.remoteCapabilities &&
	            transceiver.remoteCapabilities.headerExtensions || [];
	        remoteExtensions.forEach(function(rHdrExt) {
	          if (hdrExt.uri === rHdrExt.uri) {
	            hdrExt.id = rHdrExt.id;
	          }
	        });
	      });

	      // generate an ssrc now, to be used later in rtpSender.send
	      var sendEncodingParameters = transceiver.sendEncodingParameters || [{
	        ssrc: (2 * sdpMLineIndex + 1) * 1001
	      }];
	      if (track) {
	        // add RTX
	        if (edgeVersion >= 15019 && kind === 'video' &&
	            !sendEncodingParameters[0].rtx) {
	          sendEncodingParameters[0].rtx = {
	            ssrc: sendEncodingParameters[0].ssrc + 1
	          };
	        }
	      }

	      if (transceiver.wantReceive) {
	        transceiver.rtpReceiver = new window.RTCRtpReceiver(
	            transceiver.dtlsTransport, kind);
	      }

	      transceiver.localCapabilities = localCapabilities;
	      transceiver.sendEncodingParameters = sendEncodingParameters;
	    });

	    // always offer BUNDLE and dispose on return if not supported.
	    if (pc._config.bundlePolicy !== 'max-compat') {
	      sdp$$1 += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
	        return t.mid;
	      }).join(' ') + '\r\n';
	    }
	    sdp$$1 += 'a=ice-options:trickle\r\n';

	    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
	      sdp$$1 += writeMediaSection(transceiver, transceiver.localCapabilities,
	          'offer', transceiver.stream, pc._dtlsRole);
	      sdp$$1 += 'a=rtcp-rsize\r\n';

	      if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' &&
	          (sdpMLineIndex === 0 || !pc.usingBundle)) {
	        transceiver.iceGatherer.getLocalCandidates().forEach(function(cand) {
	          cand.component = 1;
	          sdp$$1 += 'a=' + sdp.writeCandidate(cand) + '\r\n';
	        });

	        if (transceiver.iceGatherer.state === 'completed') {
	          sdp$$1 += 'a=end-of-candidates\r\n';
	        }
	      }
	    });

	    var desc = new window.RTCSessionDescription({
	      type: 'offer',
	      sdp: sdp$$1
	    });
	    return Promise.resolve(desc);
	  };

	  RTCPeerConnection.prototype.createAnswer = function() {
	    var pc = this;

	    if (pc._isClosed) {
	      return Promise.reject(makeError('InvalidStateError',
	          'Can not call createAnswer after close'));
	    }

	    if (!(pc.signalingState === 'have-remote-offer' ||
	        pc.signalingState === 'have-local-pranswer')) {
	      return Promise.reject(makeError('InvalidStateError',
	          'Can not call createAnswer in signalingState ' + pc.signalingState));
	    }

	    var sdp$$1 = sdp.writeSessionBoilerplate(pc._sdpSessionId,
	        pc._sdpSessionVersion++);
	    if (pc.usingBundle) {
	      sdp$$1 += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
	        return t.mid;
	      }).join(' ') + '\r\n';
	    }
	    sdp$$1 += 'a=ice-options:trickle\r\n';

	    var mediaSectionsInOffer = sdp.getMediaSections(
	        pc._remoteDescription.sdp).length;
	    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
	      if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
	        return;
	      }
	      if (transceiver.rejected) {
	        if (transceiver.kind === 'application') {
	          if (transceiver.protocol === 'DTLS/SCTP') { // legacy fmt
	            sdp$$1 += 'm=application 0 DTLS/SCTP 5000\r\n';
	          } else {
	            sdp$$1 += 'm=application 0 ' + transceiver.protocol +
	                ' webrtc-datachannel\r\n';
	          }
	        } else if (transceiver.kind === 'audio') {
	          sdp$$1 += 'm=audio 0 UDP/TLS/RTP/SAVPF 0\r\n' +
	              'a=rtpmap:0 PCMU/8000\r\n';
	        } else if (transceiver.kind === 'video') {
	          sdp$$1 += 'm=video 0 UDP/TLS/RTP/SAVPF 120\r\n' +
	              'a=rtpmap:120 VP8/90000\r\n';
	        }
	        sdp$$1 += 'c=IN IP4 0.0.0.0\r\n' +
	            'a=inactive\r\n' +
	            'a=mid:' + transceiver.mid + '\r\n';
	        return;
	      }

	      // FIXME: look at direction.
	      if (transceiver.stream) {
	        var localTrack;
	        if (transceiver.kind === 'audio') {
	          localTrack = transceiver.stream.getAudioTracks()[0];
	        } else if (transceiver.kind === 'video') {
	          localTrack = transceiver.stream.getVideoTracks()[0];
	        }
	        if (localTrack) {
	          // add RTX
	          if (edgeVersion >= 15019 && transceiver.kind === 'video' &&
	              !transceiver.sendEncodingParameters[0].rtx) {
	            transceiver.sendEncodingParameters[0].rtx = {
	              ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
	            };
	          }
	        }
	      }

	      // Calculate intersection of capabilities.
	      var commonCapabilities = getCommonCapabilities(
	          transceiver.localCapabilities,
	          transceiver.remoteCapabilities);

	      var hasRtx = commonCapabilities.codecs.filter(function(c) {
	        return c.name.toLowerCase() === 'rtx';
	      }).length;
	      if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
	        delete transceiver.sendEncodingParameters[0].rtx;
	      }

	      sdp$$1 += writeMediaSection(transceiver, commonCapabilities,
	          'answer', transceiver.stream, pc._dtlsRole);
	      if (transceiver.rtcpParameters &&
	          transceiver.rtcpParameters.reducedSize) {
	        sdp$$1 += 'a=rtcp-rsize\r\n';
	      }
	    });

	    var desc = new window.RTCSessionDescription({
	      type: 'answer',
	      sdp: sdp$$1
	    });
	    return Promise.resolve(desc);
	  };

	  RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
	    var pc = this;
	    var sections;
	    if (candidate && !(candidate.sdpMLineIndex !== undefined ||
	        candidate.sdpMid)) {
	      return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
	    }

	    // TODO: needs to go into ops queue.
	    return new Promise(function(resolve, reject) {
	      if (!pc._remoteDescription) {
	        return reject(makeError('InvalidStateError',
	            'Can not add ICE candidate without a remote description'));
	      } else if (!candidate || candidate.candidate === '') {
	        for (var j = 0; j < pc.transceivers.length; j++) {
	          if (pc.transceivers[j].rejected) {
	            continue;
	          }
	          pc.transceivers[j].iceTransport.addRemoteCandidate({});
	          sections = sdp.getMediaSections(pc._remoteDescription.sdp);
	          sections[j] += 'a=end-of-candidates\r\n';
	          pc._remoteDescription.sdp =
	              sdp.getDescription(pc._remoteDescription.sdp) +
	              sections.join('');
	          if (pc.usingBundle) {
	            break;
	          }
	        }
	      } else {
	        var sdpMLineIndex = candidate.sdpMLineIndex;
	        if (candidate.sdpMid) {
	          for (var i = 0; i < pc.transceivers.length; i++) {
	            if (pc.transceivers[i].mid === candidate.sdpMid) {
	              sdpMLineIndex = i;
	              break;
	            }
	          }
	        }
	        var transceiver = pc.transceivers[sdpMLineIndex];
	        if (transceiver) {
	          if (transceiver.rejected) {
	            return resolve();
	          }
	          var cand = Object.keys(candidate.candidate).length > 0 ?
	              sdp.parseCandidate(candidate.candidate) : {};
	          // Ignore Chrome's invalid candidates since Edge does not like them.
	          if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
	            return resolve();
	          }
	          // Ignore RTCP candidates, we assume RTCP-MUX.
	          if (cand.component && cand.component !== 1) {
	            return resolve();
	          }
	          // when using bundle, avoid adding candidates to the wrong
	          // ice transport. And avoid adding candidates added in the SDP.
	          if (sdpMLineIndex === 0 || (sdpMLineIndex > 0 &&
	              transceiver.iceTransport !== pc.transceivers[0].iceTransport)) {
	            if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
	              return reject(makeError('OperationError',
	                  'Can not add ICE candidate'));
	            }
	          }

	          // update the remoteDescription.
	          var candidateString = candidate.candidate.trim();
	          if (candidateString.indexOf('a=') === 0) {
	            candidateString = candidateString.substr(2);
	          }
	          sections = sdp.getMediaSections(pc._remoteDescription.sdp);
	          sections[sdpMLineIndex] += 'a=' +
	              (cand.type ? candidateString : 'end-of-candidates')
	              + '\r\n';
	          pc._remoteDescription.sdp =
	              sdp.getDescription(pc._remoteDescription.sdp) +
	              sections.join('');
	        } else {
	          return reject(makeError('OperationError',
	              'Can not add ICE candidate'));
	        }
	      }
	      resolve();
	    });
	  };

	  RTCPeerConnection.prototype.getStats = function(selector) {
	    if (selector && selector instanceof window.MediaStreamTrack) {
	      var senderOrReceiver = null;
	      this.transceivers.forEach(function(transceiver) {
	        if (transceiver.rtpSender &&
	            transceiver.rtpSender.track === selector) {
	          senderOrReceiver = transceiver.rtpSender;
	        } else if (transceiver.rtpReceiver &&
	            transceiver.rtpReceiver.track === selector) {
	          senderOrReceiver = transceiver.rtpReceiver;
	        }
	      });
	      if (!senderOrReceiver) {
	        throw makeError('InvalidAccessError', 'Invalid selector.');
	      }
	      return senderOrReceiver.getStats();
	    }

	    var promises = [];
	    this.transceivers.forEach(function(transceiver) {
	      ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
	          'dtlsTransport'].forEach(function(method) {
	            if (transceiver[method]) {
	              promises.push(transceiver[method].getStats());
	            }
	          });
	    });
	    return Promise.all(promises).then(function(allStats) {
	      var results = new Map();
	      allStats.forEach(function(stats) {
	        stats.forEach(function(stat) {
	          results.set(stat.id, stat);
	        });
	      });
	      return results;
	    });
	  };

	  // fix low-level stat names and return Map instead of object.
	  var ortcObjects = ['RTCRtpSender', 'RTCRtpReceiver', 'RTCIceGatherer',
	    'RTCIceTransport', 'RTCDtlsTransport'];
	  ortcObjects.forEach(function(ortcObjectName) {
	    var obj = window[ortcObjectName];
	    if (obj && obj.prototype && obj.prototype.getStats) {
	      var nativeGetstats = obj.prototype.getStats;
	      obj.prototype.getStats = function() {
	        return nativeGetstats.apply(this)
	        .then(function(nativeStats) {
	          var mapStats = new Map();
	          Object.keys(nativeStats).forEach(function(id) {
	            nativeStats[id].type = fixStatsType(nativeStats[id]);
	            mapStats.set(id, nativeStats[id]);
	          });
	          return mapStats;
	        });
	      };
	    }
	  });

	  // legacy callback shims. Should be moved to adapter.js some days.
	  var methods = ['createOffer', 'createAnswer'];
	  methods.forEach(function(method) {
	    var nativeMethod = RTCPeerConnection.prototype[method];
	    RTCPeerConnection.prototype[method] = function() {
	      var args = arguments;
	      if (typeof args[0] === 'function' ||
	          typeof args[1] === 'function') { // legacy
	        return nativeMethod.apply(this, [arguments[2]])
	        .then(function(description) {
	          if (typeof args[0] === 'function') {
	            args[0].apply(null, [description]);
	          }
	        }, function(error) {
	          if (typeof args[1] === 'function') {
	            args[1].apply(null, [error]);
	          }
	        });
	      }
	      return nativeMethod.apply(this, arguments);
	    };
	  });

	  methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
	  methods.forEach(function(method) {
	    var nativeMethod = RTCPeerConnection.prototype[method];
	    RTCPeerConnection.prototype[method] = function() {
	      var args = arguments;
	      if (typeof args[1] === 'function' ||
	          typeof args[2] === 'function') { // legacy
	        return nativeMethod.apply(this, arguments)
	        .then(function() {
	          if (typeof args[1] === 'function') {
	            args[1].apply(null);
	          }
	        }, function(error) {
	          if (typeof args[2] === 'function') {
	            args[2].apply(null, [error]);
	          }
	        });
	      }
	      return nativeMethod.apply(this, arguments);
	    };
	  });

	  // getStats is special. It doesn't have a spec legacy method yet we support
	  // getStats(something, cb) without error callbacks.
	  ['getStats'].forEach(function(method) {
	    var nativeMethod = RTCPeerConnection.prototype[method];
	    RTCPeerConnection.prototype[method] = function() {
	      var args = arguments;
	      if (typeof args[1] === 'function') {
	        return nativeMethod.apply(this, arguments)
	        .then(function() {
	          if (typeof args[1] === 'function') {
	            args[1].apply(null);
	          }
	        });
	      }
	      return nativeMethod.apply(this, arguments);
	    };
	  });

	  return RTCPeerConnection;
	};

	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */

	// Expose public methods.
	var getusermedia$1 = function(window) {
	  var navigator = window && window.navigator;

	  var shimError_ = function(e) {
	    return {
	      name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
	      message: e.message,
	      constraint: e.constraint,
	      toString: function() {
	        return this.name;
	      }
	    };
	  };

	  // getUserMedia error shim.
	  var origGetUserMedia = navigator.mediaDevices.getUserMedia.
	      bind(navigator.mediaDevices);
	  navigator.mediaDevices.getUserMedia = function(c) {
	    return origGetUserMedia(c).catch(function(e) {
	      return Promise.reject(shimError_(e));
	    });
	  };
	};

	var edge_shim = {
	  shimGetUserMedia: getusermedia$1,
	  shimPeerConnection: function(window) {
	    var browserDetails = utils.detectBrowser(window);

	    if (window.RTCIceGatherer) {
	      if (!window.RTCIceCandidate) {
	        window.RTCIceCandidate = function(args) {
	          return args;
	        };
	      }
	      if (!window.RTCSessionDescription) {
	        window.RTCSessionDescription = function(args) {
	          return args;
	        };
	      }
	      // this adds an additional event listener to MediaStrackTrack that signals
	      // when a tracks enabled property was changed. Workaround for a bug in
	      // addStream, see below. No longer required in 15025+
	      if (browserDetails.version < 15025) {
	        var origMSTEnabled = Object.getOwnPropertyDescriptor(
	            window.MediaStreamTrack.prototype, 'enabled');
	        Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
	          set: function(value) {
	            origMSTEnabled.set.call(this, value);
	            var ev = new Event('enabled');
	            ev.enabled = value;
	            this.dispatchEvent(ev);
	          }
	        });
	      }
	    }

	    // ORTC defines the DTMF sender a bit different.
	    // https://github.com/w3c/ortc/issues/714
	    if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
	      Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
	        get: function() {
	          if (this._dtmf === undefined) {
	            if (this.track.kind === 'audio') {
	              this._dtmf = new window.RTCDtmfSender(this);
	            } else if (this.track.kind === 'video') {
	              this._dtmf = null;
	            }
	          }
	          return this._dtmf;
	        }
	      });
	    }
	    // Edge currently only implements the RTCDtmfSender, not the
	    // RTCDTMFSender alias. See http://draft.ortc.org/#rtcdtmfsender2*
	    if (window.RTCDtmfSender && !window.RTCDTMFSender) {
	      window.RTCDTMFSender = window.RTCDtmfSender;
	    }

	    var RTCPeerConnectionShim = rtcpeerconnection(window,
	        browserDetails.version);
	    window.RTCPeerConnection = function(config) {
	      if (config && config.iceServers) {
	        config.iceServers = filtericeservers(config.iceServers);
	      }
	      return new RTCPeerConnectionShim(config);
	    };
	    window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
	  },
	  shimReplaceTrack: function(window) {
	    // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
	    if (window.RTCRtpSender &&
	        !('replaceTrack' in window.RTCRtpSender.prototype)) {
	      window.RTCRtpSender.prototype.replaceTrack =
	          window.RTCRtpSender.prototype.setTrack;
	    }
	  }
	};

	var logging$2 = utils.log;

	// Expose public methods.
	var getusermedia$2 = function(window) {
	  var browserDetails = utils.detectBrowser(window);
	  var navigator = window && window.navigator;
	  var MediaStreamTrack = window && window.MediaStreamTrack;

	  var shimError_ = function(e) {
	    return {
	      name: {
	        InternalError: 'NotReadableError',
	        NotSupportedError: 'TypeError',
	        PermissionDeniedError: 'NotAllowedError',
	        SecurityError: 'NotAllowedError'
	      }[e.name] || e.name,
	      message: {
	        'The operation is insecure.': 'The request is not allowed by the ' +
	        'user agent or the platform in the current context.'
	      }[e.message] || e.message,
	      constraint: e.constraint,
	      toString: function() {
	        return this.name + (this.message && ': ') + this.message;
	      }
	    };
	  };

	  // getUserMedia constraints shim.
	  var getUserMedia_ = function(constraints, onSuccess, onError) {
	    var constraintsToFF37_ = function(c) {
	      if (typeof c !== 'object' || c.require) {
	        return c;
	      }
	      var require = [];
	      Object.keys(c).forEach(function(key) {
	        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
	          return;
	        }
	        var r = c[key] = (typeof c[key] === 'object') ?
	            c[key] : {ideal: c[key]};
	        if (r.min !== undefined ||
	            r.max !== undefined || r.exact !== undefined) {
	          require.push(key);
	        }
	        if (r.exact !== undefined) {
	          if (typeof r.exact === 'number') {
	            r. min = r.max = r.exact;
	          } else {
	            c[key] = r.exact;
	          }
	          delete r.exact;
	        }
	        if (r.ideal !== undefined) {
	          c.advanced = c.advanced || [];
	          var oc = {};
	          if (typeof r.ideal === 'number') {
	            oc[key] = {min: r.ideal, max: r.ideal};
	          } else {
	            oc[key] = r.ideal;
	          }
	          c.advanced.push(oc);
	          delete r.ideal;
	          if (!Object.keys(r).length) {
	            delete c[key];
	          }
	        }
	      });
	      if (require.length) {
	        c.require = require;
	      }
	      return c;
	    };
	    constraints = JSON.parse(JSON.stringify(constraints));
	    if (browserDetails.version < 38) {
	      logging$2('spec: ' + JSON.stringify(constraints));
	      if (constraints.audio) {
	        constraints.audio = constraintsToFF37_(constraints.audio);
	      }
	      if (constraints.video) {
	        constraints.video = constraintsToFF37_(constraints.video);
	      }
	      logging$2('ff37: ' + JSON.stringify(constraints));
	    }
	    return navigator.mozGetUserMedia(constraints, onSuccess, function(e) {
	      onError(shimError_(e));
	    });
	  };

	  // Returns the result of getUserMedia as a Promise.
	  var getUserMediaPromise_ = function(constraints) {
	    return new Promise(function(resolve, reject) {
	      getUserMedia_(constraints, resolve, reject);
	    });
	  };

	  // Shim for mediaDevices on older versions.
	  if (!navigator.mediaDevices) {
	    navigator.mediaDevices = {getUserMedia: getUserMediaPromise_,
	      addEventListener: function() { },
	      removeEventListener: function() { }
	    };
	  }
	  navigator.mediaDevices.enumerateDevices =
	      navigator.mediaDevices.enumerateDevices || function() {
	        return new Promise(function(resolve) {
	          var infos = [
	            {kind: 'audioinput', deviceId: 'default', label: '', groupId: ''},
	            {kind: 'videoinput', deviceId: 'default', label: '', groupId: ''}
	          ];
	          resolve(infos);
	        });
	      };

	  if (browserDetails.version < 41) {
	    // Work around http://bugzil.la/1169665
	    var orgEnumerateDevices =
	        navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
	    navigator.mediaDevices.enumerateDevices = function() {
	      return orgEnumerateDevices().then(undefined, function(e) {
	        if (e.name === 'NotFoundError') {
	          return [];
	        }
	        throw e;
	      });
	    };
	  }
	  if (browserDetails.version < 49) {
	    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
	        bind(navigator.mediaDevices);
	    navigator.mediaDevices.getUserMedia = function(c) {
	      return origGetUserMedia(c).then(function(stream) {
	        // Work around https://bugzil.la/802326
	        if (c.audio && !stream.getAudioTracks().length ||
	            c.video && !stream.getVideoTracks().length) {
	          stream.getTracks().forEach(function(track) {
	            track.stop();
	          });
	          throw new DOMException('The object can not be found here.',
	                                 'NotFoundError');
	        }
	        return stream;
	      }, function(e) {
	        return Promise.reject(shimError_(e));
	      });
	    };
	  }
	  if (!(browserDetails.version > 55 &&
	      'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
	    var remap = function(obj, a, b) {
	      if (a in obj && !(b in obj)) {
	        obj[b] = obj[a];
	        delete obj[a];
	      }
	    };

	    var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
	        bind(navigator.mediaDevices);
	    navigator.mediaDevices.getUserMedia = function(c) {
	      if (typeof c === 'object' && typeof c.audio === 'object') {
	        c = JSON.parse(JSON.stringify(c));
	        remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
	        remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
	      }
	      return nativeGetUserMedia(c);
	    };

	    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
	      var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
	      MediaStreamTrack.prototype.getSettings = function() {
	        var obj = nativeGetSettings.apply(this, arguments);
	        remap(obj, 'mozAutoGainControl', 'autoGainControl');
	        remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
	        return obj;
	      };
	    }

	    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
	      var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
	      MediaStreamTrack.prototype.applyConstraints = function(c) {
	        if (this.kind === 'audio' && typeof c === 'object') {
	          c = JSON.parse(JSON.stringify(c));
	          remap(c, 'autoGainControl', 'mozAutoGainControl');
	          remap(c, 'noiseSuppression', 'mozNoiseSuppression');
	        }
	        return nativeApplyConstraints.apply(this, [c]);
	      };
	    }
	  }
	  navigator.getUserMedia = function(constraints, onSuccess, onError) {
	    if (browserDetails.version < 44) {
	      return getUserMedia_(constraints, onSuccess, onError);
	    }
	    // Replace Firefox 44+'s deprecation warning with unprefixed version.
	    utils.deprecated('navigator.getUserMedia',
	        'navigator.mediaDevices.getUserMedia');
	    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
	  };
	};

	var firefox_shim = {
	  shimGetUserMedia: getusermedia$2,
	  shimOnTrack: function(window) {
	    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
	        window.RTCPeerConnection.prototype)) {
	      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
	        get: function() {
	          return this._ontrack;
	        },
	        set: function(f) {
	          if (this._ontrack) {
	            this.removeEventListener('track', this._ontrack);
	            this.removeEventListener('addstream', this._ontrackpoly);
	          }
	          this.addEventListener('track', this._ontrack = f);
	          this.addEventListener('addstream', this._ontrackpoly = function(e) {
	            e.stream.getTracks().forEach(function(track) {
	              var event = new Event('track');
	              event.track = track;
	              event.receiver = {track: track};
	              event.transceiver = {receiver: event.receiver};
	              event.streams = [e.stream];
	              this.dispatchEvent(event);
	            }.bind(this));
	          }.bind(this));
	        },
	        enumerable: true,
	        configurable: true
	      });
	    }
	    if (typeof window === 'object' && window.RTCTrackEvent &&
	        ('receiver' in window.RTCTrackEvent.prototype) &&
	        !('transceiver' in window.RTCTrackEvent.prototype)) {
	      Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
	        get: function() {
	          return {receiver: this.receiver};
	        }
	      });
	    }
	  },

	  shimSourceObject: function(window) {
	    // Firefox has supported mozSrcObject since FF22, unprefixed in 42.
	    if (typeof window === 'object') {
	      if (window.HTMLMediaElement &&
	        !('srcObject' in window.HTMLMediaElement.prototype)) {
	        // Shim the srcObject property, once, when HTMLMediaElement is found.
	        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
	          get: function() {
	            return this.mozSrcObject;
	          },
	          set: function(stream) {
	            this.mozSrcObject = stream;
	          }
	        });
	      }
	    }
	  },

	  shimPeerConnection: function(window) {
	    var browserDetails = utils.detectBrowser(window);

	    if (typeof window !== 'object' || !(window.RTCPeerConnection ||
	        window.mozRTCPeerConnection)) {
	      return; // probably media.peerconnection.enabled=false in about:config
	    }
	    // The RTCPeerConnection object.
	    if (!window.RTCPeerConnection) {
	      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
	        if (browserDetails.version < 38) {
	          // .urls is not supported in FF < 38.
	          // create RTCIceServers with a single url.
	          if (pcConfig && pcConfig.iceServers) {
	            var newIceServers = [];
	            for (var i = 0; i < pcConfig.iceServers.length; i++) {
	              var server = pcConfig.iceServers[i];
	              if (server.hasOwnProperty('urls')) {
	                for (var j = 0; j < server.urls.length; j++) {
	                  var newServer = {
	                    url: server.urls[j]
	                  };
	                  if (server.urls[j].indexOf('turn') === 0) {
	                    newServer.username = server.username;
	                    newServer.credential = server.credential;
	                  }
	                  newIceServers.push(newServer);
	                }
	              } else {
	                newIceServers.push(pcConfig.iceServers[i]);
	              }
	            }
	            pcConfig.iceServers = newIceServers;
	          }
	        }
	        return new window.mozRTCPeerConnection(pcConfig, pcConstraints);
	      };
	      window.RTCPeerConnection.prototype =
	          window.mozRTCPeerConnection.prototype;

	      // wrap static methods. Currently just generateCertificate.
	      if (window.mozRTCPeerConnection.generateCertificate) {
	        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
	          get: function() {
	            return window.mozRTCPeerConnection.generateCertificate;
	          }
	        });
	      }

	      window.RTCSessionDescription = window.mozRTCSessionDescription;
	      window.RTCIceCandidate = window.mozRTCIceCandidate;
	    }

	    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
	    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
	        .forEach(function(method) {
	          var nativeMethod = window.RTCPeerConnection.prototype[method];
	          window.RTCPeerConnection.prototype[method] = function() {
	            arguments[0] = new ((method === 'addIceCandidate') ?
	                window.RTCIceCandidate :
	                window.RTCSessionDescription)(arguments[0]);
	            return nativeMethod.apply(this, arguments);
	          };
	        });

	    // support for addIceCandidate(null or undefined)
	    var nativeAddIceCandidate =
	        window.RTCPeerConnection.prototype.addIceCandidate;
	    window.RTCPeerConnection.prototype.addIceCandidate = function() {
	      if (!arguments[0]) {
	        if (arguments[1]) {
	          arguments[1].apply(null);
	        }
	        return Promise.resolve();
	      }
	      return nativeAddIceCandidate.apply(this, arguments);
	    };

	    // shim getStats with maplike support
	    var makeMapStats = function(stats) {
	      var map = new Map();
	      Object.keys(stats).forEach(function(key) {
	        map.set(key, stats[key]);
	        map[key] = stats[key];
	      });
	      return map;
	    };

	    var modernStatsTypes = {
	      inboundrtp: 'inbound-rtp',
	      outboundrtp: 'outbound-rtp',
	      candidatepair: 'candidate-pair',
	      localcandidate: 'local-candidate',
	      remotecandidate: 'remote-candidate'
	    };

	    var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
	    window.RTCPeerConnection.prototype.getStats = function(
	      selector,
	      onSucc,
	      onErr
	    ) {
	      return nativeGetStats.apply(this, [selector || null])
	        .then(function(stats) {
	          if (browserDetails.version < 48) {
	            stats = makeMapStats(stats);
	          }
	          if (browserDetails.version < 53 && !onSucc) {
	            // Shim only promise getStats with spec-hyphens in type names
	            // Leave callback version alone; misc old uses of forEach before Map
	            try {
	              stats.forEach(function(stat) {
	                stat.type = modernStatsTypes[stat.type] || stat.type;
	              });
	            } catch (e) {
	              if (e.name !== 'TypeError') {
	                throw e;
	              }
	              // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
	              stats.forEach(function(stat, i) {
	                stats.set(i, Object.assign({}, stat, {
	                  type: modernStatsTypes[stat.type] || stat.type
	                }));
	              });
	            }
	          }
	          return stats;
	        })
	        .then(onSucc, onErr);
	    };
	  },

	  shimSenderGetStats: function(window) {
	    if (!(typeof window === 'object' && window.RTCPeerConnection &&
	        window.RTCRtpSender)) {
	      return;
	    }
	    if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
	      return;
	    }
	    var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
	    if (origGetSenders) {
	      window.RTCPeerConnection.prototype.getSenders = function() {
	        var pc = this;
	        var senders = origGetSenders.apply(pc, []);
	        senders.forEach(function(sender) {
	          sender._pc = pc;
	        });
	        return senders;
	      };
	    }

	    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
	    if (origAddTrack) {
	      window.RTCPeerConnection.prototype.addTrack = function() {
	        var sender = origAddTrack.apply(this, arguments);
	        sender._pc = this;
	        return sender;
	      };
	    }
	    window.RTCRtpSender.prototype.getStats = function() {
	      return this.track ? this._pc.getStats(this.track) :
	          Promise.resolve(new Map());
	    };
	  },

	  shimReceiverGetStats: function(window) {
	    if (!(typeof window === 'object' && window.RTCPeerConnection &&
	        window.RTCRtpSender)) {
	      return;
	    }
	    if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
	      return;
	    }
	    var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
	    if (origGetReceivers) {
	      window.RTCPeerConnection.prototype.getReceivers = function() {
	        var pc = this;
	        var receivers = origGetReceivers.apply(pc, []);
	        receivers.forEach(function(receiver) {
	          receiver._pc = pc;
	        });
	        return receivers;
	      };
	    }
	    utils.wrapPeerConnectionEvent(window, 'track', function(e) {
	      e.receiver._pc = e.srcElement;
	      return e;
	    });
	    window.RTCRtpReceiver.prototype.getStats = function() {
	      return this._pc.getStats(this.track);
	    };
	  },

	  shimRemoveStream: function(window) {
	    if (!window.RTCPeerConnection ||
	        'removeStream' in window.RTCPeerConnection.prototype) {
	      return;
	    }
	    window.RTCPeerConnection.prototype.removeStream = function(stream) {
	      var pc = this;
	      utils.deprecated('removeStream', 'removeTrack');
	      this.getSenders().forEach(function(sender) {
	        if (sender.track && stream.getTracks().indexOf(sender.track) !== -1) {
	          pc.removeTrack(sender);
	        }
	      });
	    };
	  },

	  shimRTCDataChannel: function(window) {
	    // rename DataChannel to RTCDataChannel (native fix in FF60):
	    // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
	    if (window.DataChannel && !window.RTCDataChannel) {
	      window.RTCDataChannel = window.DataChannel;
	    }
	  },

	  shimGetDisplayMedia: function(window, preferredMediaSource) {
	    if ('getDisplayMedia' in window.navigator) {
	      return;
	    }
	    navigator.getDisplayMedia = function(constraints) {
	      if (!(constraints && constraints.video)) {
	        var err = new DOMException('getDisplayMedia without video ' +
	            'constraints is undefined');
	        err.name = 'NotFoundError';
	        // from https://heycam.github.io/webidl/#idl-DOMException-error-names
	        err.code = 8;
	        return Promise.reject(err);
	      }
	      if (constraints.video === true) {
	        constraints.video = {mediaSource: preferredMediaSource};
	      } else {
	        constraints.video.mediaSource = preferredMediaSource;
	      }
	      return navigator.mediaDevices.getUserMedia(constraints);
	    };
	  }
	};

	var safari_shim = {
	  shimLocalStreamsAPI: function(window) {
	    if (typeof window !== 'object' || !window.RTCPeerConnection) {
	      return;
	    }
	    if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
	      window.RTCPeerConnection.prototype.getLocalStreams = function() {
	        if (!this._localStreams) {
	          this._localStreams = [];
	        }
	        return this._localStreams;
	      };
	    }
	    if (!('getStreamById' in window.RTCPeerConnection.prototype)) {
	      window.RTCPeerConnection.prototype.getStreamById = function(id) {
	        var result = null;
	        if (this._localStreams) {
	          this._localStreams.forEach(function(stream) {
	            if (stream.id === id) {
	              result = stream;
	            }
	          });
	        }
	        if (this._remoteStreams) {
	          this._remoteStreams.forEach(function(stream) {
	            if (stream.id === id) {
	              result = stream;
	            }
	          });
	        }
	        return result;
	      };
	    }
	    if (!('addStream' in window.RTCPeerConnection.prototype)) {
	      var _addTrack = window.RTCPeerConnection.prototype.addTrack;
	      window.RTCPeerConnection.prototype.addStream = function(stream) {
	        if (!this._localStreams) {
	          this._localStreams = [];
	        }
	        if (this._localStreams.indexOf(stream) === -1) {
	          this._localStreams.push(stream);
	        }
	        var pc = this;
	        stream.getTracks().forEach(function(track) {
	          _addTrack.call(pc, track, stream);
	        });
	      };

	      window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
	        if (stream) {
	          if (!this._localStreams) {
	            this._localStreams = [stream];
	          } else if (this._localStreams.indexOf(stream) === -1) {
	            this._localStreams.push(stream);
	          }
	        }
	        return _addTrack.call(this, track, stream);
	      };
	    }
	    if (!('removeStream' in window.RTCPeerConnection.prototype)) {
	      window.RTCPeerConnection.prototype.removeStream = function(stream) {
	        if (!this._localStreams) {
	          this._localStreams = [];
	        }
	        var index = this._localStreams.indexOf(stream);
	        if (index === -1) {
	          return;
	        }
	        this._localStreams.splice(index, 1);
	        var pc = this;
	        var tracks = stream.getTracks();
	        this.getSenders().forEach(function(sender) {
	          if (tracks.indexOf(sender.track) !== -1) {
	            pc.removeTrack(sender);
	          }
	        });
	      };
	    }
	  },
	  shimRemoteStreamsAPI: function(window) {
	    if (typeof window !== 'object' || !window.RTCPeerConnection) {
	      return;
	    }
	    if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
	      window.RTCPeerConnection.prototype.getRemoteStreams = function() {
	        return this._remoteStreams ? this._remoteStreams : [];
	      };
	    }
	    if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
	      Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
	        get: function() {
	          return this._onaddstream;
	        },
	        set: function(f) {
	          if (this._onaddstream) {
	            this.removeEventListener('addstream', this._onaddstream);
	          }
	          this.addEventListener('addstream', this._onaddstream = f);
	        }
	      });
	      var origSetRemoteDescription =
	          window.RTCPeerConnection.prototype.setRemoteDescription;
	      window.RTCPeerConnection.prototype.setRemoteDescription = function() {
	        var pc = this;
	        if (!this._onaddstreampoly) {
	          this.addEventListener('track', this._onaddstreampoly = function(e) {
	            e.streams.forEach(function(stream) {
	              if (!pc._remoteStreams) {
	                pc._remoteStreams = [];
	              }
	              if (pc._remoteStreams.indexOf(stream) >= 0) {
	                return;
	              }
	              pc._remoteStreams.push(stream);
	              var event = new Event('addstream');
	              event.stream = stream;
	              pc.dispatchEvent(event);
	            });
	          });
	        }
	        return origSetRemoteDescription.apply(pc, arguments);
	      };
	    }
	  },
	  shimCallbacksAPI: function(window) {
	    if (typeof window !== 'object' || !window.RTCPeerConnection) {
	      return;
	    }
	    var prototype = window.RTCPeerConnection.prototype;
	    var createOffer = prototype.createOffer;
	    var createAnswer = prototype.createAnswer;
	    var setLocalDescription = prototype.setLocalDescription;
	    var setRemoteDescription = prototype.setRemoteDescription;
	    var addIceCandidate = prototype.addIceCandidate;

	    prototype.createOffer = function(successCallback, failureCallback) {
	      var options = (arguments.length >= 2) ? arguments[2] : arguments[0];
	      var promise = createOffer.apply(this, [options]);
	      if (!failureCallback) {
	        return promise;
	      }
	      promise.then(successCallback, failureCallback);
	      return Promise.resolve();
	    };

	    prototype.createAnswer = function(successCallback, failureCallback) {
	      var options = (arguments.length >= 2) ? arguments[2] : arguments[0];
	      var promise = createAnswer.apply(this, [options]);
	      if (!failureCallback) {
	        return promise;
	      }
	      promise.then(successCallback, failureCallback);
	      return Promise.resolve();
	    };

	    var withCallback = function(description, successCallback, failureCallback) {
	      var promise = setLocalDescription.apply(this, [description]);
	      if (!failureCallback) {
	        return promise;
	      }
	      promise.then(successCallback, failureCallback);
	      return Promise.resolve();
	    };
	    prototype.setLocalDescription = withCallback;

	    withCallback = function(description, successCallback, failureCallback) {
	      var promise = setRemoteDescription.apply(this, [description]);
	      if (!failureCallback) {
	        return promise;
	      }
	      promise.then(successCallback, failureCallback);
	      return Promise.resolve();
	    };
	    prototype.setRemoteDescription = withCallback;

	    withCallback = function(candidate, successCallback, failureCallback) {
	      var promise = addIceCandidate.apply(this, [candidate]);
	      if (!failureCallback) {
	        return promise;
	      }
	      promise.then(successCallback, failureCallback);
	      return Promise.resolve();
	    };
	    prototype.addIceCandidate = withCallback;
	  },
	  shimGetUserMedia: function(window) {
	    var navigator = window && window.navigator;

	    if (!navigator.getUserMedia) {
	      if (navigator.webkitGetUserMedia) {
	        navigator.getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
	      } else if (navigator.mediaDevices &&
	          navigator.mediaDevices.getUserMedia) {
	        navigator.getUserMedia = function(constraints, cb, errcb) {
	          navigator.mediaDevices.getUserMedia(constraints)
	          .then(cb, errcb);
	        }.bind(navigator);
	      }
	    }
	  },
	  shimRTCIceServerUrls: function(window) {
	    // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
	    var OrigPeerConnection = window.RTCPeerConnection;
	    window.RTCPeerConnection = function(pcConfig, pcConstraints) {
	      if (pcConfig && pcConfig.iceServers) {
	        var newIceServers = [];
	        for (var i = 0; i < pcConfig.iceServers.length; i++) {
	          var server = pcConfig.iceServers[i];
	          if (!server.hasOwnProperty('urls') &&
	              server.hasOwnProperty('url')) {
	            utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
	            server = JSON.parse(JSON.stringify(server));
	            server.urls = server.url;
	            delete server.url;
	            newIceServers.push(server);
	          } else {
	            newIceServers.push(pcConfig.iceServers[i]);
	          }
	        }
	        pcConfig.iceServers = newIceServers;
	      }
	      return new OrigPeerConnection(pcConfig, pcConstraints);
	    };
	    window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
	    // wrap static methods. Currently just generateCertificate.
	    if ('generateCertificate' in window.RTCPeerConnection) {
	      Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
	        get: function() {
	          return OrigPeerConnection.generateCertificate;
	        }
	      });
	    }
	  },
	  shimTrackEventTransceiver: function(window) {
	    // Add event.transceiver member over deprecated event.receiver
	    if (typeof window === 'object' && window.RTCPeerConnection &&
	        ('receiver' in window.RTCTrackEvent.prototype) &&
	        // can't check 'transceiver' in window.RTCTrackEvent.prototype, as it is
	        // defined for some reason even when window.RTCTransceiver is not.
	        !window.RTCTransceiver) {
	      Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
	        get: function() {
	          return {receiver: this.receiver};
	        }
	      });
	    }
	  },

	  shimCreateOfferLegacy: function(window) {
	    var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
	    window.RTCPeerConnection.prototype.createOffer = function(offerOptions) {
	      var pc = this;
	      if (offerOptions) {
	        if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
	          // support bit values
	          offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
	        }
	        var audioTransceiver = pc.getTransceivers().find(function(transceiver) {
	          return transceiver.sender.track &&
	              transceiver.sender.track.kind === 'audio';
	        });
	        if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
	          if (audioTransceiver.direction === 'sendrecv') {
	            if (audioTransceiver.setDirection) {
	              audioTransceiver.setDirection('sendonly');
	            } else {
	              audioTransceiver.direction = 'sendonly';
	            }
	          } else if (audioTransceiver.direction === 'recvonly') {
	            if (audioTransceiver.setDirection) {
	              audioTransceiver.setDirection('inactive');
	            } else {
	              audioTransceiver.direction = 'inactive';
	            }
	          }
	        } else if (offerOptions.offerToReceiveAudio === true &&
	            !audioTransceiver) {
	          pc.addTransceiver('audio');
	        }


	        if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
	          // support bit values
	          offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
	        }
	        var videoTransceiver = pc.getTransceivers().find(function(transceiver) {
	          return transceiver.sender.track &&
	              transceiver.sender.track.kind === 'video';
	        });
	        if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
	          if (videoTransceiver.direction === 'sendrecv') {
	            videoTransceiver.setDirection('sendonly');
	          } else if (videoTransceiver.direction === 'recvonly') {
	            videoTransceiver.setDirection('inactive');
	          }
	        } else if (offerOptions.offerToReceiveVideo === true &&
	            !videoTransceiver) {
	          pc.addTransceiver('video');
	        }
	      }
	      return origCreateOffer.apply(pc, arguments);
	    };
	  }
	};

	var common_shim = {
	  shimRTCIceCandidate: function(window) {
	    // foundation is arbitrarily chosen as an indicator for full support for
	    // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
	    if (!window.RTCIceCandidate || (window.RTCIceCandidate && 'foundation' in
	        window.RTCIceCandidate.prototype)) {
	      return;
	    }

	    var NativeRTCIceCandidate = window.RTCIceCandidate;
	    window.RTCIceCandidate = function(args) {
	      // Remove the a= which shouldn't be part of the candidate string.
	      if (typeof args === 'object' && args.candidate &&
	          args.candidate.indexOf('a=') === 0) {
	        args = JSON.parse(JSON.stringify(args));
	        args.candidate = args.candidate.substr(2);
	      }

	      if (args.candidate && args.candidate.length) {
	        // Augment the native candidate with the parsed fields.
	        var nativeCandidate = new NativeRTCIceCandidate(args);
	        var parsedCandidate = sdp.parseCandidate(args.candidate);
	        var augmentedCandidate = Object.assign(nativeCandidate,
	            parsedCandidate);

	        // Add a serializer that does not serialize the extra attributes.
	        augmentedCandidate.toJSON = function() {
	          return {
	            candidate: augmentedCandidate.candidate,
	            sdpMid: augmentedCandidate.sdpMid,
	            sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
	            usernameFragment: augmentedCandidate.usernameFragment,
	          };
	        };
	        return augmentedCandidate;
	      }
	      return new NativeRTCIceCandidate(args);
	    };
	    window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;

	    // Hook up the augmented candidate in onicecandidate and
	    // addEventListener('icecandidate', ...)
	    utils.wrapPeerConnectionEvent(window, 'icecandidate', function(e) {
	      if (e.candidate) {
	        Object.defineProperty(e, 'candidate', {
	          value: new window.RTCIceCandidate(e.candidate),
	          writable: 'false'
	        });
	      }
	      return e;
	    });
	  },

	  // shimCreateObjectURL must be called before shimSourceObject to avoid loop.

	  shimCreateObjectURL: function(window) {
	    var URL = window && window.URL;

	    if (!(typeof window === 'object' && window.HTMLMediaElement &&
	          'srcObject' in window.HTMLMediaElement.prototype &&
	        URL.createObjectURL && URL.revokeObjectURL)) {
	      // Only shim CreateObjectURL using srcObject if srcObject exists.
	      return undefined;
	    }

	    var nativeCreateObjectURL = URL.createObjectURL.bind(URL);
	    var nativeRevokeObjectURL = URL.revokeObjectURL.bind(URL);
	    var streams = new Map(), newId = 0;

	    URL.createObjectURL = function(stream) {
	      if ('getTracks' in stream) {
	        var url = 'polyblob:' + (++newId);
	        streams.set(url, stream);
	        utils.deprecated('URL.createObjectURL(stream)',
	            'elem.srcObject = stream');
	        return url;
	      }
	      return nativeCreateObjectURL(stream);
	    };
	    URL.revokeObjectURL = function(url) {
	      nativeRevokeObjectURL(url);
	      streams.delete(url);
	    };

	    var dsc = Object.getOwnPropertyDescriptor(window.HTMLMediaElement.prototype,
	                                              'src');
	    Object.defineProperty(window.HTMLMediaElement.prototype, 'src', {
	      get: function() {
	        return dsc.get.apply(this);
	      },
	      set: function(url) {
	        this.srcObject = streams.get(url) || null;
	        return dsc.set.apply(this, [url]);
	      }
	    });

	    var nativeSetAttribute = window.HTMLMediaElement.prototype.setAttribute;
	    window.HTMLMediaElement.prototype.setAttribute = function() {
	      if (arguments.length === 2 &&
	          ('' + arguments[0]).toLowerCase() === 'src') {
	        this.srcObject = streams.get(arguments[1]) || null;
	      }
	      return nativeSetAttribute.apply(this, arguments);
	    };
	  },

	  shimMaxMessageSize: function(window) {
	    if (window.RTCSctpTransport || !window.RTCPeerConnection) {
	      return;
	    }
	    var browserDetails = utils.detectBrowser(window);

	    if (!('sctp' in window.RTCPeerConnection.prototype)) {
	      Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
	        get: function() {
	          return typeof this._sctp === 'undefined' ? null : this._sctp;
	        }
	      });
	    }

	    var sctpInDescription = function(description) {
	      var sections = sdp.splitSections(description.sdp);
	      sections.shift();
	      return sections.some(function(mediaSection) {
	        var mLine = sdp.parseMLine(mediaSection);
	        return mLine && mLine.kind === 'application'
	            && mLine.protocol.indexOf('SCTP') !== -1;
	      });
	    };

	    var getRemoteFirefoxVersion = function(description) {
	      // TODO: Is there a better solution for detecting Firefox?
	      var match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
	      if (match === null || match.length < 2) {
	        return -1;
	      }
	      var version = parseInt(match[1], 10);
	      // Test for NaN (yes, this is ugly)
	      return version !== version ? -1 : version;
	    };

	    var getCanSendMaxMessageSize = function(remoteIsFirefox) {
	      // Every implementation we know can send at least 64 KiB.
	      // Note: Although Chrome is technically able to send up to 256 KiB, the
	      //       data does not reach the other peer reliably.
	      //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
	      var canSendMaxMessageSize = 65536;
	      if (browserDetails.browser === 'firefox') {
	        if (browserDetails.version < 57) {
	          if (remoteIsFirefox === -1) {
	            // FF < 57 will send in 16 KiB chunks using the deprecated PPID
	            // fragmentation.
	            canSendMaxMessageSize = 16384;
	          } else {
	            // However, other FF (and RAWRTC) can reassemble PPID-fragmented
	            // messages. Thus, supporting ~2 GiB when sending.
	            canSendMaxMessageSize = 2147483637;
	          }
	        } else if (browserDetails.version < 60) {
	          // Currently, all FF >= 57 will reset the remote maximum message size
	          // to the default value when a data channel is created at a later
	          // stage. :(
	          // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
	          canSendMaxMessageSize =
	            browserDetails.version === 57 ? 65535 : 65536;
	        } else {
	          // FF >= 60 supports sending ~2 GiB
	          canSendMaxMessageSize = 2147483637;
	        }
	      }
	      return canSendMaxMessageSize;
	    };

	    var getMaxMessageSize = function(description, remoteIsFirefox) {
	      // Note: 65536 bytes is the default value from the SDP spec. Also,
	      //       every implementation we know supports receiving 65536 bytes.
	      var maxMessageSize = 65536;

	      // FF 57 has a slightly incorrect default remote max message size, so
	      // we need to adjust it here to avoid a failure when sending.
	      // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
	      if (browserDetails.browser === 'firefox'
	           && browserDetails.version === 57) {
	        maxMessageSize = 65535;
	      }

	      var match = sdp.matchPrefix(description.sdp, 'a=max-message-size:');
	      if (match.length > 0) {
	        maxMessageSize = parseInt(match[0].substr(19), 10);
	      } else if (browserDetails.browser === 'firefox' &&
	                  remoteIsFirefox !== -1) {
	        // If the maximum message size is not present in the remote SDP and
	        // both local and remote are Firefox, the remote peer can receive
	        // ~2 GiB.
	        maxMessageSize = 2147483637;
	      }
	      return maxMessageSize;
	    };

	    var origSetRemoteDescription =
	        window.RTCPeerConnection.prototype.setRemoteDescription;
	    window.RTCPeerConnection.prototype.setRemoteDescription = function() {
	      var pc = this;
	      pc._sctp = null;

	      if (sctpInDescription(arguments[0])) {
	        // Check if the remote is FF.
	        var isFirefox = getRemoteFirefoxVersion(arguments[0]);

	        // Get the maximum message size the local peer is capable of sending
	        var canSendMMS = getCanSendMaxMessageSize(isFirefox);

	        // Get the maximum message size of the remote peer.
	        var remoteMMS = getMaxMessageSize(arguments[0], isFirefox);

	        // Determine final maximum message size
	        var maxMessageSize;
	        if (canSendMMS === 0 && remoteMMS === 0) {
	          maxMessageSize = Number.POSITIVE_INFINITY;
	        } else if (canSendMMS === 0 || remoteMMS === 0) {
	          maxMessageSize = Math.max(canSendMMS, remoteMMS);
	        } else {
	          maxMessageSize = Math.min(canSendMMS, remoteMMS);
	        }

	        // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
	        // attribute.
	        var sctp = {};
	        Object.defineProperty(sctp, 'maxMessageSize', {
	          get: function() {
	            return maxMessageSize;
	          }
	        });
	        pc._sctp = sctp;
	      }

	      return origSetRemoteDescription.apply(pc, arguments);
	    };
	  },

	  shimSendThrowTypeError: function(window) {
	    if (!(window.RTCPeerConnection &&
	        'createDataChannel' in window.RTCPeerConnection.prototype)) {
	      return;
	    }

	    // Note: Although Firefox >= 57 has a native implementation, the maximum
	    //       message size can be reset for all data channels at a later stage.
	    //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831

	    function wrapDcSend(dc, pc) {
	      var origDataChannelSend = dc.send;
	      dc.send = function() {
	        var data = arguments[0];
	        var length = data.length || data.size || data.byteLength;
	        if (dc.readyState === 'open' &&
	            pc.sctp && length > pc.sctp.maxMessageSize) {
	          throw new TypeError('Message too large (can send a maximum of ' +
	            pc.sctp.maxMessageSize + ' bytes)');
	        }
	        return origDataChannelSend.apply(dc, arguments);
	      };
	    }
	    var origCreateDataChannel =
	      window.RTCPeerConnection.prototype.createDataChannel;
	    window.RTCPeerConnection.prototype.createDataChannel = function() {
	      var pc = this;
	      var dataChannel = origCreateDataChannel.apply(pc, arguments);
	      wrapDcSend(dataChannel, pc);
	      return dataChannel;
	    };
	    utils.wrapPeerConnectionEvent(window, 'datachannel', function(e) {
	      wrapDcSend(e.channel, e.target);
	      return e;
	    });
	  }
	};

	// Shimming starts here.
	var adapter_factory = function(dependencies, opts) {
	  var window = dependencies && dependencies.window;

	  var options = {
	    shimChrome: true,
	    shimFirefox: true,
	    shimEdge: true,
	    shimSafari: true,
	  };

	  for (var key in opts) {
	    if (hasOwnProperty.call(opts, key)) {
	      options[key] = opts[key];
	    }
	  }

	  // Utils.
	  var logging = utils.log;
	  var browserDetails = utils.detectBrowser(window);

	  // Uncomment the line below if you want logging to occur, including logging
	  // for the switch statement below. Can also be turned on in the browser via
	  // adapter.disableLog(false), but then logging from the switch statement below
	  // will not appear.
	  // require('./utils').disableLog(false);

	  // Browser shims.
	  var chromeShim = chrome_shim || null;
	  var edgeShim = edge_shim || null;
	  var firefoxShim = firefox_shim || null;
	  var safariShim = safari_shim || null;
	  var commonShim = common_shim || null;

	  // Export to the adapter global object visible in the browser.
	  var adapter = {
	    browserDetails: browserDetails,
	    commonShim: commonShim,
	    extractVersion: utils.extractVersion,
	    disableLog: utils.disableLog,
	    disableWarnings: utils.disableWarnings
	  };

	  // Shim browser if found.
	  switch (browserDetails.browser) {
	    case 'chrome':
	      if (!chromeShim || !chromeShim.shimPeerConnection ||
	          !options.shimChrome) {
	        logging('Chrome shim is not included in this adapter release.');
	        return adapter;
	      }
	      logging('adapter.js shimming chrome.');
	      // Export to the adapter global object visible in the browser.
	      adapter.browserShim = chromeShim;
	      commonShim.shimCreateObjectURL(window);

	      chromeShim.shimGetUserMedia(window);
	      chromeShim.shimMediaStream(window);
	      chromeShim.shimSourceObject(window);
	      chromeShim.shimPeerConnection(window);
	      chromeShim.shimOnTrack(window);
	      chromeShim.shimAddTrackRemoveTrack(window);
	      chromeShim.shimGetSendersWithDtmf(window);
	      chromeShim.shimSenderReceiverGetStats(window);
	      chromeShim.fixNegotiationNeeded(window);

	      commonShim.shimRTCIceCandidate(window);
	      commonShim.shimMaxMessageSize(window);
	      commonShim.shimSendThrowTypeError(window);
	      break;
	    case 'firefox':
	      if (!firefoxShim || !firefoxShim.shimPeerConnection ||
	          !options.shimFirefox) {
	        logging('Firefox shim is not included in this adapter release.');
	        return adapter;
	      }
	      logging('adapter.js shimming firefox.');
	      // Export to the adapter global object visible in the browser.
	      adapter.browserShim = firefoxShim;
	      commonShim.shimCreateObjectURL(window);

	      firefoxShim.shimGetUserMedia(window);
	      firefoxShim.shimSourceObject(window);
	      firefoxShim.shimPeerConnection(window);
	      firefoxShim.shimOnTrack(window);
	      firefoxShim.shimRemoveStream(window);
	      firefoxShim.shimSenderGetStats(window);
	      firefoxShim.shimReceiverGetStats(window);
	      firefoxShim.shimRTCDataChannel(window);

	      commonShim.shimRTCIceCandidate(window);
	      commonShim.shimMaxMessageSize(window);
	      commonShim.shimSendThrowTypeError(window);
	      break;
	    case 'edge':
	      if (!edgeShim || !edgeShim.shimPeerConnection || !options.shimEdge) {
	        logging('MS edge shim is not included in this adapter release.');
	        return adapter;
	      }
	      logging('adapter.js shimming edge.');
	      // Export to the adapter global object visible in the browser.
	      adapter.browserShim = edgeShim;
	      commonShim.shimCreateObjectURL(window);

	      edgeShim.shimGetUserMedia(window);
	      edgeShim.shimPeerConnection(window);
	      edgeShim.shimReplaceTrack(window);

	      // the edge shim implements the full RTCIceCandidate object.

	      commonShim.shimMaxMessageSize(window);
	      commonShim.shimSendThrowTypeError(window);
	      break;
	    case 'safari':
	      if (!safariShim || !options.shimSafari) {
	        logging('Safari shim is not included in this adapter release.');
	        return adapter;
	      }
	      logging('adapter.js shimming safari.');
	      // Export to the adapter global object visible in the browser.
	      adapter.browserShim = safariShim;
	      commonShim.shimCreateObjectURL(window);

	      safariShim.shimRTCIceServerUrls(window);
	      safariShim.shimCreateOfferLegacy(window);
	      safariShim.shimCallbacksAPI(window);
	      safariShim.shimLocalStreamsAPI(window);
	      safariShim.shimRemoteStreamsAPI(window);
	      safariShim.shimTrackEventTransceiver(window);
	      safariShim.shimGetUserMedia(window);

	      commonShim.shimRTCIceCandidate(window);
	      commonShim.shimMaxMessageSize(window);
	      commonShim.shimSendThrowTypeError(window);
	      break;
	    default:
	      logging('Unsupported browser!');
	      break;
	  }

	  return adapter;
	};

	var adapter_core = adapter_factory({window: commonjsGlobal.window});

	var sip_min = createCommonjsModule(function (module, exports) {
	!function(e,t){module.exports=t();}(commonjsGlobal,function(){return function(e){var t={};function i(s){if(t[s])return t[s].exports;var r=t[s]={i:s,l:!1,exports:{}};return e[s].call(r.exports,r,r.exports,i),r.l=!0,r.exports}return i.m=e,i.c=t,i.d=function(e,t,s){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s});},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0});},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(s,r,function(t){return e[t]}.bind(null,r));return s},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=40)}([function(e,t){var i;i=function(){return this}();try{i=i||Function("return this")()||(0, eval)("this");}catch(e){"object"==typeof window&&(i=window);}e.exports=i;},function(e,t,i){e.exports=function(e){var t=function(e,t){};return t.prototype=Object.create(e.EventEmitter.prototype,{connect:{writable:!0,value:function(e){return e=e||{},this.connectPromise(e).then(function(e){!e.overrideEvent&&this.emit("connected");}.bind(this))}},connectPromise:{writable:!0,value:function(e){}},isConnected:{writable:!0,value:function(){}},send:{writable:!0,value:function(e,t){return t=t||{},this.sendPromise(e).then(function(e){!e.overrideEvent&&this.emit("messageSent",e.msg);}.bind(this))}},sendPromise:{writable:!0,value:function(e,t){}},onMessage:{writable:!0,value:function(e){}},disconnect:{writable:!0,value:function(e){return e=e||{},this.disconnectPromise(e).then(function(e){!e.overrideEvent&&this.emit("disconnected");}.bind(this))}},disconnectPromise:{writable:!0,value:function(e){}},afterConnected:{writable:!0,value:function(e){this.isConnected()?e():this.once("connected",e);}},waitForConnected:{writable:!0,value:function(){return console.warn("DEPRECATION WARNING Transport.waitForConnected(): use afterConnected() instead"),new e.Utils.Promise(function(e){this.afterConnected(e);}.bind(this))}}}),t};},function(e,t,i){(function(t){var s=t.window||t;function r(e,t){if(null!=e){var i=t.charAt(0).toUpperCase()+t.slice(1),s=[t,"webkit"+i,"moz"+i];for(var r in s){var n=e[s[r]];if(n)return n.bind(e)}}}e.exports={WebSocket:s.WebSocket,Transport:i(1),open:s.open,Promise:s.Promise,timers:s,console:s.console||{debug:function(){},log:function(){},warn:function(){},error:function(){}},addEventListener:r(s,"addEventListener"),removeEventListener:r(s,"removeEventListener")};}).call(this,i(0));},function(e,t,i){(function(t){e.exports=function(e){var i={STATUS_NULL:0,STATUS_NEW:1,STATUS_CONNECTING:2,STATUS_CONNECTED:3,STATUS_COMPLETED:4},s=function(s){if(s.media.remote.video?this.video=!0:this.video=!1,s.media.remote.audio?this.audio=!0:this.audio=!1,!this.audio&&!this.video)throw new Error("At least one remote audio or video element is required for Simple.");this.options=s;var r=t.navigator.userAgent.toLowerCase(),n=!1;r.indexOf("safari")>-1&&r.indexOf("chrome")<0&&(n=!0);var o={};return n&&(o.modifiers=[e.Web.Modifiers.stripG722]),this.options.ua.uri||(this.anonymous=!0),this.ua=new e.UA({uri:this.options.ua.uri,authorizationUser:this.options.ua.authorizationUser,password:this.options.ua.password,displayName:this.options.ua.displayName,userAgentString:this.options.ua.userAgentString,register:!0,sessionDescriptionHandlerFactoryOptions:o,transportOptions:{wsServers:this.options.ua.wsServers}}),this.state=i.STATUS_NULL,this.logger=this.ua.getLogger("sip.simple"),this.ua.on("registered",function(){this.emit("registered",this.ua);}.bind(this)),this.ua.on("unregistered",function(){this.emit("unregistered",this.ua);}.bind(this)),this.ua.on("failed",function(){this.emit("unregistered",this.ua);}.bind(this)),this.ua.on("invite",function(e){if(this.state!==i.STATUS_NULL&&this.state!==i.STATUS_COMPLETED)return this.logger.warn("Rejecting incoming call. Simple only supports 1 call at a time"),void e.reject();this.session=e,this.setupSession(),this.emit("ringing",this.session);}.bind(this)),this.ua.on("message",function(e){this.emit("message",e);}.bind(this)),this};return s.prototype=Object.create(e.EventEmitter.prototype),s.C=i,s.prototype.call=function(e){if(this.ua&&this.checkRegistration()){if(this.state===i.STATUS_NULL||this.state===i.STATUS_COMPLETED)return this.options.media.remote.audio&&(this.options.media.remote.audio.autoplay=!0),this.options.media.remote.video&&(this.options.media.remote.video.autoplay=!0),this.options.media.local&&this.options.media.local.video&&(this.options.media.local.video.autoplay=!0,this.options.media.local.video.volume=0),this.session=this.ua.invite(e,{sessionDescriptionHandlerOptions:{constraints:{audio:this.audio,video:this.video}}}),this.setupSession(),this.session;this.logger.warn("Cannot make more than a single call with Simple");}else this.logger.warn("A registered UA is required for calling");},s.prototype.answer=function(){if(this.state===i.STATUS_NEW||this.state===i.STATUS_CONNECTING)return this.options.media.remote.audio&&(this.options.media.remote.audio.autoplay=!0),this.options.media.remote.video&&(this.options.media.remote.video.autoplay=!0),this.session.accept({sessionDescriptionHandlerOptions:{constraints:{audio:this.audio,video:this.video}}});this.logger.warn("No call to answer");},s.prototype.reject=function(){if(this.state===i.STATUS_NEW||this.state===i.STATUS_CONNECTING)return this.session.reject();this.logger.warn("Call is already answered");},s.prototype.hangup=function(){if(this.state===i.STATUS_CONNECTED||this.state===i.STATUS_CONNECTING||this.state===i.STATUS_NEW)return this.state!==i.STATUS_CONNECTED?this.session.cancel():this.session.bye();this.logger.warn("No active call to hang up on");},s.prototype.hold=function(){if(this.state===i.STATUS_CONNECTED&&!this.session.local_hold)return this.mute(),this.logger.log("Placing session on hold"),this.session.hold();this.logger.warn("Cannot put call on hold");},s.prototype.unhold=function(){if(this.state===i.STATUS_CONNECTED&&this.session.local_hold)return this.unmute(),this.logger.log("Placing call off hold"),this.session.unhold();this.logger.warn("Cannot unhold a call that is not on hold");},s.prototype.mute=function(){this.state===i.STATUS_CONNECTED?(this.logger.log("Muting Audio"),this.toggleMute(!0),this.emit("mute",this)):this.logger.warn("An acitve call is required to mute audio");},s.prototype.unmute=function(){this.state===i.STATUS_CONNECTED?(this.logger.log("Unmuting Audio"),this.toggleMute(!1),this.emit("unmute",this)):this.logger.warn("An active call is required to unmute audio");},s.prototype.sendDTMF=function(e){this.state===i.STATUS_CONNECTED?(this.logger.log("Sending DTMF tone: "+e),this.session.dtmf(e)):this.logger.warn("An active call is required to send a DTMF tone");},s.prototype.message=function(e,t){this.ua&&this.checkRegistration()?e&&t?this.ua.message(e,t):this.logger.warn("A destination and message are required to send a message"):this.logger.warn("A registered UA is required to send a message");},s.prototype.checkRegistration=function(){return this.anonymous||this.ua&&this.ua.isRegistered()},s.prototype.setupRemoteMedia=function(){var e,i=this.session.sessionDescriptionHandler.peerConnection;i.getReceivers?(e=new t.window.MediaStream,i.getReceivers().forEach(function(t){var i=t.track;i&&e.addTrack(i);})):e=i.getRemoteStreams()[0],this.video?(this.options.media.remote.video.srcObject=e,this.options.media.remote.video.play().catch(function(){this.logger.log("play was rejected");}.bind(this))):this.audio&&(this.options.media.remote.audio.srcObject=e,this.options.media.remote.audio.play().catch(function(){this.logger.log("play was rejected");}.bind(this)));},s.prototype.setupLocalMedia=function(){if(this.video&&this.options.media.local&&this.options.media.local.video){var e,i=this.session.sessionDescriptionHandler.peerConnection;i.getSenders?(e=new t.window.MediaStream,i.getSenders().forEach(function(t){var i=t.track;i&&"video"===i.kind&&e.addTrack(i);})):e=i.getLocalStreams()[0],this.options.media.local.video.srcObject=e,this.options.media.local.video.volume=0,this.options.media.local.video.play();}},s.prototype.cleanupMedia=function(){this.video&&(this.options.media.remote.video.srcObject=null,this.options.media.remote.video.pause(),this.options.media.local&&this.options.media.local.video&&(this.options.media.local.video.srcObject=null,this.options.media.local.video.pause())),this.audio&&(this.options.media.remote.audio.srcObject=null,this.options.media.remote.audio.pause());},s.prototype.setupSession=function(){this.state=i.STATUS_NEW,this.emit("new",this.session),this.session.on("progress",this.onProgress.bind(this)),this.session.on("accepted",this.onAccepted.bind(this)),this.session.on("rejected",this.onEnded.bind(this)),this.session.on("failed",this.onFailed.bind(this)),this.session.on("terminated",this.onEnded.bind(this));},s.prototype.destroyMedia=function(){this.session.sessionDescriptionHandler.close();},s.prototype.toggleMute=function(e){var t=this.session.sessionDescriptionHandler.peerConnection;t.getSenders?t.getSenders().forEach(function(t){t.track&&(t.track.enabled=!e);}):t.getLocalStreams().forEach(function(t){t.getAudioTracks().forEach(function(t){t.enabled=!e;}),t.getVideoTracks().forEach(function(t){t.enabled=!e;});});},s.prototype.onAccepted=function(){this.state=i.STATUS_CONNECTED,this.emit("connected",this.session),this.setupLocalMedia(),this.setupRemoteMedia(),this.session.sessionDescriptionHandler.on("addTrack",function(){this.logger.log("A track has been added, triggering new remoteMedia setup"),this.setupRemoteMedia();}.bind(this)),this.session.sessionDescriptionHandler.on("addStream",function(){this.logger.log("A stream has been added, trigger new remoteMedia setup"),this.setupRemoteMedia();}.bind(this)),this.session.on("hold",function(){this.emit("hold",this.session);}.bind(this)),this.session.on("unhold",function(){this.emit("unhold",this.session);}.bind(this)),this.session.on("dtmf",function(e){this.emit("dtmf",e);}.bind(this)),this.session.on("bye",this.onEnded.bind(this));},s.prototype.onProgress=function(){this.state=i.STATUS_CONNECTING,this.emit("connecting",this.session);},s.prototype.onFailed=function(){this.onEnded();},s.prototype.onEnded=function(){this.state=i.STATUS_COMPLETED,this.emit("ended",this.session),this.cleanupMedia();},s};}).call(this,i(0));},function(e,t,i){e.exports=function(e){function t(e,t){var i,s,r=[],n=e.split(/\r\n/);for(i=0;i<n.length;){var o=n[i];if(/^m=(?:audio|video)/.test(o))s={index:i,stripped:[]},r.push(s);else if(s){var a=/^a=rtpmap:(\d+) ([^/]+)\//.exec(o);if(a&&t===a[2]){n.splice(i,1),s.stripped.push(a[1]);continue}}i++;}for(i=0;i<r.length;i++){for(var c=n[r[i].index].split(" "),h=3;h<c.length;)-1===r[i].stripped.indexOf(c[h])?h++:c.splice(h,1);n[r[i].index]=c.join(" ");}return n.join("\r\n")}return {stripTcpCandidates:function(t){return t.sdp=t.sdp.replace(/^a=candidate:\d+ \d+ tcp .*?\r\n/gim,""),e.Utils.Promise.resolve(t)},stripTelephoneEvent:function(i){return i.sdp=t(i.sdp,"telephone-event"),e.Utils.Promise.resolve(i)},cleanJitsiSdpImageattr:function(t){return t.sdp=t.sdp.replace(/^(a=imageattr:.*?)(x|y)=\[0-/gm,"$1$2=[1:"),e.Utils.Promise.resolve(t)},stripG722:function(i){return i.sdp=t(i.sdp,"G722"),e.Utils.Promise.resolve(i)},stripRtpPayload:function(i){return function(s){return s.sdp=t(s.sdp,i),e.Utils.Promise.resolve(s)}}}};},function(e,t,i){function s(e,t,i,r){this.message=e,this.expected=t,this.found=i,this.location=r,this.name="SyntaxError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(this,s);}!function(e,t){function i(){this.constructor=e;}i.prototype=t.prototype,e.prototype=new i;}(s,Error),s.buildMessage=function(e,t){var i={literal:function(e){return '"'+r(e.text)+'"'},class:function(e){var t,i="";for(t=0;t<e.parts.length;t++)i+=e.parts[t]instanceof Array?n(e.parts[t][0])+"-"+n(e.parts[t][1]):n(e.parts[t]);return "["+(e.inverted?"^":"")+i+"]"},any:function(e){return "any character"},end:function(e){return "end of input"},other:function(e){return e.description}};function s(e){return e.charCodeAt(0).toString(16).toUpperCase()}function r(e){return e.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,function(e){return "\\x0"+s(e)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(e){return "\\x"+s(e)})}function n(e){return e.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,function(e){return "\\x0"+s(e)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(e){return "\\x"+s(e)})}return "Expected "+function(e){var t,s,r,n=new Array(e.length);for(t=0;t<e.length;t++)n[t]=(r=e[t],i[r.type](r));if(n.sort(),n.length>0){for(t=1,s=1;t<n.length;t++)n[t-1]!==n[t]&&(n[s]=n[t],s++);n.length=s;}switch(n.length){case 1:return n[0];case 2:return n[0]+" or "+n[1];default:return n.slice(0,-1).join(", ")+", or "+n[n.length-1]}}(e)+" but "+function(e){return e?'"'+r(e)+'"':"end of input"}(t)+" found."},e.exports={SyntaxError:s,parse:function(e,t){t=void 0!==t?t:{};var i,r={},n={Contact:119,Name_Addr_Header:156,Record_Route:176,Request_Response:81,SIP_URI:45,Subscription_State:186,Supported:191,Require:182,Via:194,absoluteURI:84,Call_ID:118,Content_Disposition:130,Content_Length:135,Content_Type:136,CSeq:146,displayName:122,Event:149,From:151,host:52,Max_Forwards:154,Min_SE:213,Proxy_Authenticate:157,quoted_string:40,Refer_To:178,Replaces:179,Session_Expires:210,stun_URI:217,To:192,turn_URI:223,uuid:226,WWW_Authenticate:209,challenge:158,sipfrag:230,Referred_By:231},o=119,a=["\r\n",T("\r\n",!1),/^[0-9]/,E([["0","9"]],!1,!1),/^[a-zA-Z]/,E([["a","z"],["A","Z"]],!1,!1),/^[0-9a-fA-F]/,E([["0","9"],["a","f"],["A","F"]],!1,!1),/^[\0-\xFF]/,E([["\0","\xff"]],!1,!1),/^["]/,E(['"'],!1,!1)," ",T(" ",!1),"\t",T("\t",!1),/^[a-zA-Z0-9]/,E([["a","z"],["A","Z"],["0","9"]],!1,!1),";",T(";",!1),"/",T("/",!1),"?",T("?",!1),":",T(":",!1),"@",T("@",!1),"&",T("&",!1),"=",T("=",!1),"+",T("+",!1),"$",T("$",!1),",",T(",",!1),"-",T("-",!1),"_",T("_",!1),".",T(".",!1),"!",T("!",!1),"~",T("~",!1),"*",T("*",!1),"'",T("'",!1),"(",T("(",!1),")",T(")",!1),"%",T("%",!1),function(){return " "},function(){return ":"},/^[!-~]/,E([["!","~"]],!1,!1),/^[\x80-\uFFFF]/,E([["\x80","\uffff"]],!1,!1),/^[\x80-\xBF]/,E([["\x80","\xbf"]],!1,!1),/^[a-f]/,E([["a","f"]],!1,!1),"`",T("`",!1),"<",T("<",!1),">",T(">",!1),"\\",T("\\",!1),"[",T("[",!1),"]",T("]",!1),"{",T("{",!1),"}",T("}",!1),function(){return "*"},function(){return "/"},function(){return "="},function(){return "("},function(){return ")"},function(){return ">"},function(){return "<"},function(){return ","},function(){return ";"},function(){return ":"},function(){return '"'},/^[!-']/,E([["!","'"]],!1,!1),/^[*-[]/,E([["*","["]],!1,!1),/^[\]-~]/,E([["]","~"]],!1,!1),function(e){return e},/^[#-[]/,E([["#","["]],!1,!1),/^[\0-\t]/,E([["\0","\t"]],!1,!1),/^[\x0B-\f]/,E([["\v","\f"]],!1,!1),/^[\x0E-\x7F]/,E([["\x0e","\x7f"]],!1,!1),function(){t.data.uri=new t.SIP.URI(t.data.scheme,t.data.user,t.data.host,t.data.port),delete t.data.scheme,delete t.data.user,delete t.data.host,delete t.data.host_type,delete t.data.port;},function(){t.data.uri=new t.SIP.URI(t.data.scheme,t.data.user,t.data.host,t.data.port,t.data.uri_params,t.data.uri_headers),delete t.data.scheme,delete t.data.user,delete t.data.host,delete t.data.host_type,delete t.data.port,delete t.data.uri_params,"SIP_URI"===t.startRule&&(t.data=t.data.uri);},"sips",T("sips",!0),"sip",T("sip",!0),function(e){t.data.scheme=e;},function(){t.data.user=decodeURIComponent(f().slice(0,-1));},function(){t.data.password=f();},function(){return t.data.host=f(),t.data.host},function(){return t.data.host_type="domain",f()},/^[a-zA-Z0-9_\-]/,E([["a","z"],["A","Z"],["0","9"],"_","-"],!1,!1),/^[a-zA-Z0-9\-]/,E([["a","z"],["A","Z"],["0","9"],"-"],!1,!1),function(){return t.data.host_type="IPv6",f()},"::",T("::",!1),function(){return t.data.host_type="IPv6",f()},function(){return t.data.host_type="IPv4",f()},"25",T("25",!1),/^[0-5]/,E([["0","5"]],!1,!1),"2",T("2",!1),/^[0-4]/,E([["0","4"]],!1,!1),"1",T("1",!1),/^[1-9]/,E([["1","9"]],!1,!1),function(e){return e=parseInt(e.join("")),t.data.port=e,e},"transport=",T("transport=",!0),"udp",T("udp",!0),"tcp",T("tcp",!0),"sctp",T("sctp",!0),"tls",T("tls",!0),function(e){t.data.uri_params||(t.data.uri_params={}),t.data.uri_params.transport=e.toLowerCase();},"user=",T("user=",!0),"phone",T("phone",!0),"ip",T("ip",!0),function(e){t.data.uri_params||(t.data.uri_params={}),t.data.uri_params.user=e.toLowerCase();},"method=",T("method=",!0),function(e){t.data.uri_params||(t.data.uri_params={}),t.data.uri_params.method=e;},"ttl=",T("ttl=",!0),function(e){t.data.params||(t.data.params={}),t.data.params.ttl=e;},"maddr=",T("maddr=",!0),function(e){t.data.uri_params||(t.data.uri_params={}),t.data.uri_params.maddr=e;},"lr",T("lr",!0),function(){t.data.uri_params||(t.data.uri_params={}),t.data.uri_params.lr=void 0;},function(e,i){t.data.uri_params||(t.data.uri_params={}),i=null===i?void 0:i[1],t.data.uri_params[e.toLowerCase()]=i&&i.toLowerCase();},function(e,i){e=e.join("").toLowerCase(),i=i.join(""),t.data.uri_headers||(t.data.uri_headers={}),t.data.uri_headers[e]?t.data.uri_headers[e].push(i):t.data.uri_headers[e]=[i];},function(){"Refer_To"===t.startRule&&(t.data.uri=new t.SIP.URI(t.data.scheme,t.data.user,t.data.host,t.data.port,t.data.uri_params,t.data.uri_headers),delete t.data.scheme,delete t.data.user,delete t.data.host,delete t.data.host_type,delete t.data.port,delete t.data.uri_params);},"//",T("//",!1),function(){t.data.scheme=f();},T("SIP",!0),function(){t.data.sip_version=f();},"INVITE",T("INVITE",!1),"ACK",T("ACK",!1),"VXACH",T("VXACH",!1),"OPTIONS",T("OPTIONS",!1),"BYE",T("BYE",!1),"CANCEL",T("CANCEL",!1),"REGISTER",T("REGISTER",!1),"SUBSCRIBE",T("SUBSCRIBE",!1),"NOTIFY",T("NOTIFY",!1),"REFER",T("REFER",!1),"PUBLISH",T("PUBLISH",!1),function(){return t.data.method=f(),t.data.method},function(e){t.data.status_code=parseInt(e.join(""));},function(){t.data.reason_phrase=f();},function(){t.data=f();},function(){var e,i;for(i=t.data.multi_header.length,e=0;e<i;e++)if(null===t.data.multi_header[e].parsed){t.data=null;break}null!==t.data?t.data=t.data.multi_header:t.data=-1;},function(){var e;t.data.multi_header||(t.data.multi_header=[]);try{e=new t.SIP.NameAddrHeader(t.data.uri,t.data.displayName,t.data.params),delete t.data.uri,delete t.data.displayName,delete t.data.params;}catch(t){e=null;}t.data.multi_header.push({position:h,offset:m().start.offset,parsed:e});},function(e){'"'===(e=f().trim())[0]&&(e=e.substring(1,e.length-1)),t.data.displayName=e;},"q",T("q",!0),function(e){t.data.params||(t.data.params={}),t.data.params.q=e;},"expires",T("expires",!0),function(e){t.data.params||(t.data.params={}),t.data.params.expires=e;},function(e){return parseInt(e.join(""))},"0",T("0",!1),function(){return parseFloat(f())},function(e,i){t.data.params||(t.data.params={}),i=null===i?void 0:i[1],t.data.params[e.toLowerCase()]=i;},"render",T("render",!0),"session",T("session",!0),"icon",T("icon",!0),"alert",T("alert",!0),function(){"Content_Disposition"===t.startRule&&(t.data.type=f().toLowerCase());},"handling",T("handling",!0),"optional",T("optional",!0),"required",T("required",!0),function(e){t.data=parseInt(e.join(""));},function(){t.data=f();},"text",T("text",!0),"image",T("image",!0),"audio",T("audio",!0),"video",T("video",!0),"application",T("application",!0),"message",T("message",!0),"multipart",T("multipart",!0),"x-",T("x-",!0),function(e){t.data.value=parseInt(e.join(""));},function(e){t.data=e;},function(e){t.data.event=e.toLowerCase();},function(){var e=t.data.tag;t.data=new t.SIP.NameAddrHeader(t.data.uri,t.data.displayName,t.data.params),e&&t.data.setParam("tag",e);},"tag",T("tag",!0),function(e){t.data.tag=e;},function(e){t.data=parseInt(e.join(""));},function(e){t.data=e;},function(){t.data=new t.SIP.NameAddrHeader(t.data.uri,t.data.displayName,t.data.params);},"digest",T("Digest",!0),"realm",T("realm",!0),function(e){t.data.realm=e;},"domain",T("domain",!0),"nonce",T("nonce",!0),function(e){t.data.nonce=e;},"opaque",T("opaque",!0),function(e){t.data.opaque=e;},"stale",T("stale",!0),"true",T("true",!0),function(){t.data.stale=!0;},"false",T("false",!0),function(){t.data.stale=!1;},"algorithm",T("algorithm",!0),"md5",T("MD5",!0),"md5-sess",T("MD5-sess",!0),function(e){t.data.algorithm=e.toUpperCase();},"qop",T("qop",!0),"auth-int",T("auth-int",!0),"auth",T("auth",!0),function(e){t.data.qop||(t.data.qop=[]),t.data.qop.push(e.toLowerCase());},function(e){t.data.value=parseInt(e.join(""));},function(){var e,i;for(i=t.data.multi_header.length,e=0;e<i;e++)if(null===t.data.multi_header[e].parsed){t.data=null;break}null!==t.data?t.data=t.data.multi_header:t.data=-1;},function(){var e;t.data.multi_header||(t.data.multi_header=[]);try{e=new t.SIP.NameAddrHeader(t.data.uri,t.data.displayName,t.data.params),delete t.data.uri,delete t.data.displayName,delete t.data.params;}catch(t){e=null;}t.data.multi_header.push({position:h,offset:m().start.offset,parsed:e});},function(){t.data=new t.SIP.NameAddrHeader(t.data.uri,t.data.displayName,t.data.params);},function(){t.data.replaces_from_tag&&t.data.replaces_to_tag||(t.data=-1);},function(){t.data={call_id:t.data};},"from-tag",T("from-tag",!0),function(e){t.data.replaces_from_tag=e;},"to-tag",T("to-tag",!0),function(e){t.data.replaces_to_tag=e;},"early-only",T("early-only",!0),function(){t.data.early_only=!0;},function(e,t){return t},function(e,t){return function(e,t){return [e].concat(t)}(e,t)},function(e){"Require"===t.startRule&&(t.data=e||[]);},function(e){t.data.value=parseInt(e.join(""));},"active",T("active",!0),"pending",T("pending",!0),"terminated",T("terminated",!0),function(){t.data.state=f();},"reason",T("reason",!0),function(e){void 0!==e&&(t.data.reason=e);},function(e){void 0!==e&&(t.data.expires=e);},"retry_after",T("retry_after",!0),function(e){void 0!==e&&(t.data.retry_after=e);},"deactivated",T("deactivated",!0),"probation",T("probation",!0),"rejected",T("rejected",!0),"timeout",T("timeout",!0),"giveup",T("giveup",!0),"noresource",T("noresource",!0),"invariant",T("invariant",!0),function(e){"Supported"===t.startRule&&(t.data=e||[]);},function(){var e=t.data.tag;t.data=new t.SIP.NameAddrHeader(t.data.uri,t.data.displayName,t.data.params),e&&t.data.setParam("tag",e);},"ttl",T("ttl",!0),function(e){t.data.ttl=e;},"maddr",T("maddr",!0),function(e){t.data.maddr=e;},"received",T("received",!0),function(e){t.data.received=e;},"branch",T("branch",!0),function(e){t.data.branch=e;},"rport",T("rport",!0),function(){"undefined"!=typeof response_port&&(t.data.rport=response_port.join(""));},function(e){t.data.protocol=e;},T("UDP",!0),T("TCP",!0),T("TLS",!0),T("SCTP",!0),function(e){t.data.transport=e;},function(){t.data.host=f();},function(e){t.data.port=parseInt(e.join(""));},function(e){return parseInt(e.join(""))},function(e){"Session_Expires"===t.startRule&&(t.data.deltaSeconds=e);},"refresher",T("refresher",!1),"uas",T("uas",!1),"uac",T("uac",!1),function(e){"Session_Expires"===t.startRule&&(t.data.refresher=e);},function(e){"Min_SE"===t.startRule&&(t.data=e);},"stuns",T("stuns",!0),"stun",T("stun",!0),function(e){t.data.scheme=e;},function(e){t.data.host=e;},"?transport=",T("?transport=",!1),"turns",T("turns",!0),"turn",T("turn",!0),function(){t.data.transport=transport;},function(){t.data=f();},"Referred-By",T("Referred-By",!1),"b",T("b",!1),"cid",T("cid",!1)],c=[R('2 ""6 7!'),R('4"""5!7#'),R('4$""5!7%'),R('4&""5!7\''),R(";'.# &;("),R('4(""5!7)'),R('4*""5!7+'),R('2,""6,7-'),R('2.""6.7/'),R('40""5!71'),R('22""6273.\x89 &24""6475.} &26""6677.q &28""6879.e &2:""6:7;.Y &2<""6<7=.M &2>""6>7?.A &2@""6@7A.5 &2B""6B7C.) &2D""6D7E'),R(";).# &;,"),R('2F""6F7G.} &2H""6H7I.q &2J""6J7K.e &2L""6L7M.Y &2N""6N7O.M &2P""6P7Q.A &2R""6R7S.5 &2T""6T7U.) &2V""6V7W'),R('%%2X""6X7Y/5#;#/,$;#/#$+#)(#\'#("\'#&\'#/"!&,)'),R('%%$;$0#*;$&/,#; /#$+")("\'#&\'#." &"/=#$;$/&#0#*;$&&&#/\'$8":Z" )("\'#&\'#'),R(';.." &"'),R("%$;'.# &;(0)*;'.# &;(&/?#28\"\"6879/0$;//'$8#:[# )(#'#(\"'#&'#"),R('%%$;2/&#0#*;2&&&#/g#$%$;.0#*;.&/,#;2/#$+")("\'#&\'#0=*%$;.0#*;.&/,#;2/#$+")("\'#&\'#&/#$+")("\'#&\'#/"!&,)'),R('4\\""5!7].# &;3'),R('4^""5!7_'),R('4`""5!7a'),R(';!.) &4b""5!7c'),R('%$;).\x95 &2F""6F7G.\x89 &2J""6J7K.} &2L""6L7M.q &2X""6X7Y.e &2P""6P7Q.Y &2H""6H7I.M &2@""6@7A.A &2d""6d7e.5 &2R""6R7S.) &2N""6N7O/\x9e#0\x9b*;).\x95 &2F""6F7G.\x89 &2J""6J7K.} &2L""6L7M.q &2X""6X7Y.e &2P""6P7Q.Y &2H""6H7I.M &2@""6@7A.A &2d""6d7e.5 &2R""6R7S.) &2N""6N7O&&&#/"!&,)'),R('%$;).\x89 &2F""6F7G.} &2L""6L7M.q &2X""6X7Y.e &2P""6P7Q.Y &2H""6H7I.M &2@""6@7A.A &2d""6d7e.5 &2R""6R7S.) &2N""6N7O/\x92#0\x8f*;).\x89 &2F""6F7G.} &2L""6L7M.q &2X""6X7Y.e &2P""6P7Q.Y &2H""6H7I.M &2@""6@7A.A &2d""6d7e.5 &2R""6R7S.) &2N""6N7O&&&#/"!&,)'),R('2T""6T7U.\xe3 &2V""6V7W.\xd7 &2f""6f7g.\xcb &2h""6h7i.\xbf &2:""6:7;.\xb3 &2D""6D7E.\xa7 &22""6273.\x9b &28""6879.\x8f &2j""6j7k.\x83 &;&.} &24""6475.q &2l""6l7m.e &2n""6n7o.Y &26""6677.M &2>""6>7?.A &2p""6p7q.5 &2r""6r7s.) &;\'.# &;('),R('%$;).\u012b &2F""6F7G.\u011f &2J""6J7K.\u0113 &2L""6L7M.\u0107 &2X""6X7Y.\xfb &2P""6P7Q.\xef &2H""6H7I.\xe3 &2@""6@7A.\xd7 &2d""6d7e.\xcb &2R""6R7S.\xbf &2N""6N7O.\xb3 &2T""6T7U.\xa7 &2V""6V7W.\x9b &2f""6f7g.\x8f &2h""6h7i.\x83 &28""6879.w &2j""6j7k.k &;&.e &24""6475.Y &2l""6l7m.M &2n""6n7o.A &26""6677.5 &2p""6p7q.) &2r""6r7s/\u0134#0\u0131*;).\u012b &2F""6F7G.\u011f &2J""6J7K.\u0113 &2L""6L7M.\u0107 &2X""6X7Y.\xfb &2P""6P7Q.\xef &2H""6H7I.\xe3 &2@""6@7A.\xd7 &2d""6d7e.\xcb &2R""6R7S.\xbf &2N""6N7O.\xb3 &2T""6T7U.\xa7 &2V""6V7W.\x9b &2f""6f7g.\x8f &2h""6h7i.\x83 &28""6879.w &2j""6j7k.k &;&.e &24""6475.Y &2l""6l7m.M &2n""6n7o.A &26""6677.5 &2p""6p7q.) &2r""6r7s&&&#/"!&,)'),R("%;//?#2P\"\"6P7Q/0$;//'$8#:t# )(#'#(\"'#&'#"),R("%;//?#24\"\"6475/0$;//'$8#:u# )(#'#(\"'#&'#"),R("%;//?#2>\"\"6>7?/0$;//'$8#:v# )(#'#(\"'#&'#"),R("%;//?#2T\"\"6T7U/0$;//'$8#:w# )(#'#(\"'#&'#"),R("%;//?#2V\"\"6V7W/0$;//'$8#:x# )(#'#(\"'#&'#"),R('%2h""6h7i/0#;//\'$8":y" )("\'#&\'#'),R('%;//6#2f""6f7g/\'$8":z" )("\'#&\'#'),R("%;//?#2D\"\"6D7E/0$;//'$8#:{# )(#'#(\"'#&'#"),R("%;//?#22\"\"6273/0$;//'$8#:|# )(#'#(\"'#&'#"),R("%;//?#28\"\"6879/0$;//'$8#:}# )(#'#(\"'#&'#"),R("%;//0#;&/'$8\":~\" )(\"'#&'#"),R("%;&/0#;//'$8\":~\" )(\"'#&'#"),R("%;=/T#$;G.) &;K.# &;F0/*;G.) &;K.# &;F&/,$;>/#$+#)(#'#(\"'#&'#"),R('4\x7f""5!7\x80.A &4\x81""5!7\x82.5 &4\x83""5!7\x84.) &;3.# &;.'),R("%%;//Q#;&/H$$;J.# &;K0)*;J.# &;K&/,$;&/#$+$)($'#(#'#(\"'#&'#/\"!&,)"),R("%;//]#;&/T$%$;J.# &;K0)*;J.# &;K&/\"!&,)/1$;&/($8$:\x85$!!)($'#(#'#(\"'#&'#"),R(';..G &2L""6L7M.; &4\x86""5!7\x87./ &4\x83""5!7\x84.# &;3'),R('%2j""6j7k/J#4\x88""5!7\x89.5 &4\x8a""5!7\x8b.) &4\x8c""5!7\x8d/#$+")("\'#&\'#'),R("%;N/M#28\"\"6879/>$;O.\" &\"/0$;S/'$8$:\x8e$ )($'#(#'#(\"'#&'#"),R("%;N/d#28\"\"6879/U$;O.\" &\"/G$;S/>$;_/5$;l.\" &\"/'$8&:\x8f& )(&'#(%'#($'#(#'#(\"'#&'#"),R('%3\x90""5$7\x91.) &3\x92""5#7\x93/\' 8!:\x94!! )'),R('%;P/]#%28""6879/,#;R/#$+")("\'#&\'#." &"/6$2:""6:7;/\'$8#:\x95# )(#\'#("\'#&\'#'),R("$;+.) &;-.# &;Q/2#0/*;+.) &;-.# &;Q&&&#"),R('2<""6<7=.q &2>""6>7?.e &2@""6@7A.Y &2B""6B7C.M &2D""6D7E.A &22""6273.5 &26""6677.) &24""6475'),R('%$;+._ &;-.Y &2<""6<7=.M &2>""6>7?.A &2@""6@7A.5 &2B""6B7C.) &2D""6D7E0e*;+._ &;-.Y &2<""6<7=.M &2>""6>7?.A &2@""6@7A.5 &2B""6B7C.) &2D""6D7E&/& 8!:\x96! )'),R('%;T/J#%28""6879/,#;^/#$+")("\'#&\'#." &"/#$+")("\'#&\'#'),R("%;U.) &;\\.# &;X/& 8!:\x97! )"),R('%$%;V/2#2J""6J7K/#$+")("\'#&\'#0<*%;V/2#2J""6J7K/#$+")("\'#&\'#&/D#;W/;$2J""6J7K." &"/\'$8#:\x98# )(#\'#("\'#&\'#'),R('$4\x99""5!7\x9a/,#0)*4\x99""5!7\x9a&&&#'),R('%4$""5!7%/?#$4\x9b""5!7\x9c0)*4\x9b""5!7\x9c&/#$+")("\'#&\'#'),R('%2l""6l7m/?#;Y/6$2n""6n7o/\'$8#:\x9d# )(#\'#("\'#&\'#'),R('%%;Z/\xb3#28""6879/\xa4$;Z/\x9b$28""6879/\x8c$;Z/\x83$28""6879/t$;Z/k$28""6879/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+-)(-\'#(,\'#(+\'#(*\'#()\'#((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#.\u0790 &%2\x9e""6\x9e7\x9f/\xa4#;Z/\x9b$28""6879/\x8c$;Z/\x83$28""6879/t$;Z/k$28""6879/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+,)(,\'#(+\'#(*\'#()\'#((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#.\u06f9 &%2\x9e""6\x9e7\x9f/\x8c#;Z/\x83$28""6879/t$;Z/k$28""6879/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+*)(*\'#()\'#((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#.\u067a &%2\x9e""6\x9e7\x9f/t#;Z/k$28""6879/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+()((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#.\u0613 &%2\x9e""6\x9e7\x9f/\\#;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+&)(&\'#(%\'#($\'#(#\'#("\'#&\'#.\u05c4 &%2\x9e""6\x9e7\x9f/D#;Z/;$28""6879/,$;[/#$+$)($\'#(#\'#("\'#&\'#.\u058d &%2\x9e""6\x9e7\x9f/,#;[/#$+")("\'#&\'#.\u056e &%2\x9e""6\x9e7\x9f/,#;Z/#$+")("\'#&\'#.\u054f &%;Z/\x9b#2\x9e""6\x9e7\x9f/\x8c$;Z/\x83$28""6879/t$;Z/k$28""6879/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$++)(+\'#(*\'#()\'#((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#.\u04c7 &%;Z/\xaa#%28""6879/,#;Z/#$+")("\'#&\'#." &"/\x83$2\x9e""6\x9e7\x9f/t$;Z/k$28""6879/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+*)(*\'#()\'#((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#.\u0430 &%;Z/\xb9#%28""6879/,#;Z/#$+")("\'#&\'#." &"/\x92$%28""6879/,#;Z/#$+")("\'#&\'#." &"/k$2\x9e""6\x9e7\x9f/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+))()\'#((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#.\u038a &%;Z/\xc8#%28""6879/,#;Z/#$+")("\'#&\'#." &"/\xa1$%28""6879/,#;Z/#$+")("\'#&\'#." &"/z$%28""6879/,#;Z/#$+")("\'#&\'#." &"/S$2\x9e""6\x9e7\x9f/D$;Z/;$28""6879/,$;[/#$+()((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#.\u02d5 &%;Z/\xd7#%28""6879/,#;Z/#$+")("\'#&\'#." &"/\xb0$%28""6879/,#;Z/#$+")("\'#&\'#." &"/\x89$%28""6879/,#;Z/#$+")("\'#&\'#." &"/b$%28""6879/,#;Z/#$+")("\'#&\'#." &"/;$2\x9e""6\x9e7\x9f/,$;[/#$+\')(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#.\u0211 &%;Z/\xfe#%28""6879/,#;Z/#$+")("\'#&\'#." &"/\xd7$%28""6879/,#;Z/#$+")("\'#&\'#." &"/\xb0$%28""6879/,#;Z/#$+")("\'#&\'#." &"/\x89$%28""6879/,#;Z/#$+")("\'#&\'#." &"/b$%28""6879/,#;Z/#$+")("\'#&\'#." &"/;$2\x9e""6\x9e7\x9f/,$;Z/#$+()((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#.\u0126 &%;Z/\u011c#%28""6879/,#;Z/#$+")("\'#&\'#." &"/\xf5$%28""6879/,#;Z/#$+")("\'#&\'#." &"/\xce$%28""6879/,#;Z/#$+")("\'#&\'#." &"/\xa7$%28""6879/,#;Z/#$+")("\'#&\'#." &"/\x80$%28""6879/,#;Z/#$+")("\'#&\'#." &"/Y$%28""6879/,#;Z/#$+")("\'#&\'#." &"/2$2\x9e""6\x9e7\x9f/#$+()((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#/& 8!:\xa0! )'),R('%;#/M#;#." &"/?$;#." &"/1$;#." &"/#$+$)($\'#(#\'#("\'#&\'#'),R("%;Z/;#28\"\"6879/,$;Z/#$+#)(#'#(\"'#&'#.# &;\\"),R("%;]/o#2J\"\"6J7K/`$;]/W$2J\"\"6J7K/H$;]/?$2J\"\"6J7K/0$;]/'$8':\xa1' )(''#(&'#(%'#($'#(#'#(\"'#&'#"),R('%2\xa2""6\xa27\xa3/2#4\xa4""5!7\xa5/#$+")("\'#&\'#.\x98 &%2\xa6""6\xa67\xa7/;#4\xa8""5!7\xa9/,$;!/#$+#)(#\'#("\'#&\'#.j &%2\xaa""6\xaa7\xab/5#;!/,$;!/#$+#)(#\'#("\'#&\'#.B &%4\xac""5!7\xad/,#;!/#$+")("\'#&\'#.# &;!'),R('%%;!." &"/[#;!." &"/M$;!." &"/?$;!." &"/1$;!." &"/#$+%)(%\'#($\'#(#\'#("\'#&\'#/\' 8!:\xae!! )'),R('$%22""6273/,#;`/#$+")("\'#&\'#0<*%22""6273/,#;`/#$+")("\'#&\'#&'),R(";a.A &;b.; &;c.5 &;d./ &;e.) &;f.# &;g"),R('%3\xaf""5*7\xb0/a#3\xb1""5#7\xb2.G &3\xb3""5#7\xb4.; &3\xb5""5$7\xb6./ &3\xb7""5#7\xb8.# &;6/($8":\xb9"! )("\'#&\'#'),R('%3\xba""5%7\xbb/I#3\xbc""5%7\xbd./ &3\xbe""5"7\xbf.# &;6/($8":\xc0"! )("\'#&\'#'),R('%3\xc1""5\'7\xc2/1#;\x90/($8":\xc3"! )("\'#&\'#'),R('%3\xc4""5$7\xc5/1#;\xf0/($8":\xc6"! )("\'#&\'#'),R('%3\xc7""5&7\xc8/1#;T/($8":\xc9"! )("\'#&\'#'),R('%3\xca""5"7\xcb/N#%2>""6>7?/,#;6/#$+")("\'#&\'#." &"/\'$8":\xcc" )("\'#&\'#'),R('%;h/P#%2>""6>7?/,#;i/#$+")("\'#&\'#." &"/)$8":\xcd""! )("\'#&\'#'),R('%$;j/&#0#*;j&&&#/"!&,)'),R('%$;j/&#0#*;j&&&#/"!&,)'),R(";k.) &;+.# &;-"),R('2l""6l7m.e &2n""6n7o.Y &24""6475.M &28""6879.A &2<""6<7=.5 &2@""6@7A.) &2B""6B7C'),R('%26""6677/n#;m/e$$%2<""6<7=/,#;m/#$+")("\'#&\'#0<*%2<""6<7=/,#;m/#$+")("\'#&\'#&/#$+#)(#\'#("\'#&\'#'),R('%;n/A#2>""6>7?/2$;o/)$8#:\xce#"" )(#\'#("\'#&\'#'),R("$;p.) &;+.# &;-/2#0/*;p.) &;+.# &;-&&&#"),R("$;p.) &;+.# &;-0/*;p.) &;+.# &;-&"),R('2l""6l7m.e &2n""6n7o.Y &24""6475.M &26""6677.A &28""6879.5 &2@""6@7A.) &2B""6B7C'),R(";\x91.# &;r"),R("%;\x90/G#;'/>$;s/5$;'/,$;\x84/#$+%)(%'#($'#(#'#(\"'#&'#"),R(";M.# &;t"),R("%;\x7f/E#28\"\"6879/6$;u.# &;x/'$8#:\xcf# )(#'#(\"'#&'#"),R('%;v.# &;w/J#%26""6677/,#;\x83/#$+")("\'#&\'#." &"/#$+")("\'#&\'#'),R('%2\xd0""6\xd07\xd1/:#;\x80/1$;w." &"/#$+#)(#\'#("\'#&\'#'),R('%24""6475/,#;{/#$+")("\'#&\'#'),R("%;z/3#$;y0#*;y&/#$+\")(\"'#&'#"),R(";*.) &;+.# &;-"),R(';+.\x8f &;-.\x89 &22""6273.} &26""6677.q &28""6879.e &2:""6:7;.Y &2<""6<7=.M &2>""6>7?.A &2@""6@7A.5 &2B""6B7C.) &2D""6D7E'),R('%;|/e#$%24""6475/,#;|/#$+")("\'#&\'#0<*%24""6475/,#;|/#$+")("\'#&\'#&/#$+")("\'#&\'#'),R('%$;~0#*;~&/e#$%22""6273/,#;}/#$+")("\'#&\'#0<*%22""6273/,#;}/#$+")("\'#&\'#&/#$+")("\'#&\'#'),R("$;~0#*;~&"),R(';+.w &;-.q &28""6879.e &2:""6:7;.Y &2<""6<7=.M &2>""6>7?.A &2@""6@7A.5 &2B""6B7C.) &2D""6D7E'),R('%%;"/\x87#$;".G &;!.A &2@""6@7A.5 &2F""6F7G.) &2J""6J7K0M*;".G &;!.A &2@""6@7A.5 &2F""6F7G.) &2J""6J7K&/#$+")("\'#&\'#/& 8!:\xd2! )'),R(";\x81.# &;\x82"),R('%%;O/2#2:""6:7;/#$+")("\'#&\'#." &"/,#;S/#$+")("\'#&\'#." &"'),R('$;+.\x83 &;-.} &2B""6B7C.q &2D""6D7E.e &22""6273.Y &28""6879.M &2:""6:7;.A &2<""6<7=.5 &2>""6>7?.) &2@""6@7A/\x8c#0\x89*;+.\x83 &;-.} &2B""6B7C.q &2D""6D7E.e &22""6273.Y &28""6879.M &2:""6:7;.A &2<""6<7=.5 &2>""6>7?.) &2@""6@7A&&&#'),R("$;y0#*;y&"),R('%3\x92""5#7\xd3/q#24""6475/b$$;!/&#0#*;!&&&#/L$2J""6J7K/=$$;!/&#0#*;!&&&#/\'$8%:\xd4% )(%\'#($\'#(#\'#("\'#&\'#'),R('2\xd5""6\xd57\xd6'),R('2\xd7""6\xd77\xd8'),R('2\xd9""6\xd97\xda'),R('2\xdb""6\xdb7\xdc'),R('2\xdd""6\xdd7\xde'),R('2\xdf""6\xdf7\xe0'),R('2\xe1""6\xe17\xe2'),R('2\xe3""6\xe37\xe4'),R('2\xe5""6\xe57\xe6'),R('2\xe7""6\xe77\xe8'),R('2\xe9""6\xe97\xea'),R("%;\x85.Y &;\x86.S &;\x88.M &;\x89.G &;\x8a.A &;\x8b.; &;\x8c.5 &;\x8f./ &;\x8d.) &;\x8e.# &;6/& 8!:\xeb! )"),R("%;\x84/G#;'/>$;\x92/5$;'/,$;\x94/#$+%)(%'#($'#(#'#(\"'#&'#"),R("%;\x93/' 8!:\xec!! )"),R("%;!/5#;!/,$;!/#$+#)(#'#(\"'#&'#"),R("%$;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(0G*;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(&/& 8!:\xed! )"),R("%;\xb6/Y#$%;A/,#;\xb6/#$+\")(\"'#&'#06*%;A/,#;\xb6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),R('%;9/N#%2:""6:7;/,#;9/#$+")("\'#&\'#." &"/\'$8":\xee" )("\'#&\'#'),R("%;:.c &%;\x98/Y#$%;A/,#;\x98/#$+\")(\"'#&'#06*%;A/,#;\x98/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/& 8!:\xef! )"),R("%;L.# &;\x99/]#$%;B/,#;\x9b/#$+\")(\"'#&'#06*%;B/,#;\x9b/#$+\")(\"'#&'#&/'$8\":\xf0\" )(\"'#&'#"),R("%;\x9a.\" &\"/>#;@/5$;M/,$;?/#$+$)($'#(#'#(\"'#&'#"),R("%%;6/Y#$%;./,#;6/#$+\")(\"'#&'#06*%;./,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#.# &;H/' 8!:\xf1!! )"),R(";\x9c.) &;\x9d.# &;\xa0"),R("%3\xf2\"\"5!7\xf3/:#;</1$;\x9f/($8#:\xf4#! )(#'#(\"'#&'#"),R("%3\xf5\"\"5'7\xf6/:#;</1$;\x9e/($8#:\xf7#! )(#'#(\"'#&'#"),R("%$;!/&#0#*;!&&&#/' 8!:\xf8!! )"),R('%2\xf9""6\xf97\xfa/o#%2J""6J7K/M#;!." &"/?$;!." &"/1$;!." &"/#$+$)($\'#(#\'#("\'#&\'#." &"/\'$8":\xfb" )("\'#&\'#'),R('%;6/J#%;</,#;\xa1/#$+")("\'#&\'#." &"/)$8":\xfc""! )("\'#&\'#'),R(";6.) &;T.# &;H"),R("%;\xa3/Y#$%;B/,#;\xa4/#$+\")(\"'#&'#06*%;B/,#;\xa4/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),R('%3\xfd""5&7\xfe.G &3\xff""5\'7\u0100.; &3\u0101""5$7\u0102./ &3\u0103""5%7\u0104.# &;6/& 8!:\u0105! )'),R(";\xa5.# &;\xa0"),R('%3\u0106""5(7\u0107/M#;</D$3\u0108""5(7\u0109./ &3\u010a""5(7\u010b.# &;6/#$+#)(#\'#("\'#&\'#'),R("%;6/Y#$%;A/,#;6/#$+\")(\"'#&'#06*%;A/,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),R("%$;!/&#0#*;!&&&#/' 8!:\u010c!! )"),R("%;\xa9/& 8!:\u010d! )"),R("%;\xaa/k#;;/b$;\xaf/Y$$%;B/,#;\xb0/#$+\")(\"'#&'#06*%;B/,#;\xb0/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),R(";\xab.# &;\xac"),R('3\u010e""5$7\u010f.S &3\u0110""5%7\u0111.G &3\u0112""5%7\u0113.; &3\u0114""5%7\u0115./ &3\u0116""5+7\u0117.# &;\xad'),R('3\u0118""5\'7\u0119./ &3\u011a""5)7\u011b.# &;\xad'),R(";6.# &;\xae"),R('%3\u011c""5"7\u011d/,#;6/#$+")("\'#&\'#'),R(";\xad.# &;6"),R("%;6/5#;</,$;\xb1/#$+#)(#'#(\"'#&'#"),R(";6.# &;H"),R("%;\xb3/5#;./,$;\x90/#$+#)(#'#(\"'#&'#"),R("%$;!/&#0#*;!&&&#/' 8!:\u011e!! )"),R("%;\x9e/' 8!:\u011f!! )"),R('%;\xb6/^#$%;B/,#;\xa0/#$+")("\'#&\'#06*%;B/,#;\xa0/#$+")("\'#&\'#&/($8":\u0120"!!)("\'#&\'#'),R('%%;7/e#$%2J""6J7K/,#;7/#$+")("\'#&\'#0<*%2J""6J7K/,#;7/#$+")("\'#&\'#&/#$+")("\'#&\'#/"!&,)'),R("%;L.# &;\x99/]#$%;B/,#;\xb8/#$+\")(\"'#&'#06*%;B/,#;\xb8/#$+\")(\"'#&'#&/'$8\":\u0121\" )(\"'#&'#"),R(";\xb9.# &;\xa0"),R("%3\u0122\"\"5#7\u0123/:#;</1$;6/($8#:\u0124#! )(#'#(\"'#&'#"),R("%$;!/&#0#*;!&&&#/' 8!:\u0125!! )"),R("%;\x9e/' 8!:\u0126!! )"),R("%$;\x9a0#*;\x9a&/x#;@/o$;M/f$;?/]$$%;B/,#;\xa0/#$+\")(\"'#&'#06*%;B/,#;\xa0/#$+\")(\"'#&'#&/'$8%:\u0127% )(%'#($'#(#'#(\"'#&'#"),R(";\xbe"),R("%3\u0128\"\"5&7\u0129/k#;./b$;\xc1/Y$$%;A/,#;\xc1/#$+\")(\"'#&'#06*%;A/,#;\xc1/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#.# &;\xbf"),R("%;6/k#;./b$;\xc0/Y$$%;A/,#;\xc0/#$+\")(\"'#&'#06*%;A/,#;\xc0/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),R("%;6/;#;</2$;6.# &;H/#$+#)(#'#(\"'#&'#"),R(";\xc2.G &;\xc4.A &;\xc6.; &;\xc8.5 &;\xc9./ &;\xca.) &;\xcb.# &;\xc0"),R("%3\u012a\"\"5%7\u012b/5#;</,$;\xc3/#$+#)(#'#(\"'#&'#"),R("%;I/' 8!:\u012c!! )"),R("%3\u012d\"\"5&7\u012e/\x97#;</\x8e$;D/\x85$;\xc5/|$$%$;'/&#0#*;'&&&#/,#;\xc5/#$+\")(\"'#&'#0C*%$;'/&#0#*;'&&&#/,#;\xc5/#$+\")(\"'#&'#&/,$;E/#$+&)(&'#(%'#($'#(#'#(\"'#&'#"),R(";t.# &;w"),R("%3\u012f\"\"5%7\u0130/5#;</,$;\xc7/#$+#)(#'#(\"'#&'#"),R("%;I/' 8!:\u0131!! )"),R("%3\u0132\"\"5&7\u0133/:#;</1$;I/($8#:\u0134#! )(#'#(\"'#&'#"),R('%3\u0135""5%7\u0136/]#;</T$%3\u0137""5$7\u0138/& 8!:\u0139! ).4 &%3\u013a""5%7\u013b/& 8!:\u013c! )/#$+#)(#\'#("\'#&\'#'),R('%3\u013d""5)7\u013e/R#;</I$3\u013f""5#7\u0140./ &3\u0141""5(7\u0142.# &;6/($8#:\u0143#! )(#\'#("\'#&\'#'),R('%3\u0144""5#7\u0145/\x93#;</\x8a$;D/\x81$%;\xcc/e#$%2D""6D7E/,#;\xcc/#$+")("\'#&\'#0<*%2D""6D7E/,#;\xcc/#$+")("\'#&\'#&/#$+")("\'#&\'#/,$;E/#$+%)(%\'#($\'#(#\'#("\'#&\'#'),R('%3\u0146""5(7\u0147./ &3\u0148""5$7\u0149.# &;6/\' 8!:\u014a!! )'),R("%;6/Y#$%;A/,#;6/#$+\")(\"'#&'#06*%;A/,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),R("%;\xcf/G#;./>$;\xcf/5$;./,$;\x90/#$+%)(%'#($'#(#'#(\"'#&'#"),R("%$;!/&#0#*;!&&&#/' 8!:\u014b!! )"),R("%;\xd1/]#$%;A/,#;\xd1/#$+\")(\"'#&'#06*%;A/,#;\xd1/#$+\")(\"'#&'#&/'$8\":\u014c\" )(\"'#&'#"),R("%;\x99/]#$%;B/,#;\xa0/#$+\")(\"'#&'#06*%;B/,#;\xa0/#$+\")(\"'#&'#&/'$8\":\u014d\" )(\"'#&'#"),R('%;L.O &;\x99.I &%;@." &"/:#;t/1$;?." &"/#$+#)(#\'#("\'#&\'#/]#$%;B/,#;\xa0/#$+")("\'#&\'#06*%;B/,#;\xa0/#$+")("\'#&\'#&/\'$8":\u014e" )("\'#&\'#'),R("%;\xd4/]#$%;B/,#;\xd5/#$+\")(\"'#&'#06*%;B/,#;\xd5/#$+\")(\"'#&'#&/'$8\":\u014f\" )(\"'#&'#"),R("%;\x96/& 8!:\u0150! )"),R('%3\u0151""5(7\u0152/:#;</1$;6/($8#:\u0153#! )(#\'#("\'#&\'#.g &%3\u0154""5&7\u0155/:#;</1$;6/($8#:\u0156#! )(#\'#("\'#&\'#.: &%3\u0157""5*7\u0158/& 8!:\u0159! ).# &;\xa0'),R('%%;6/k#$%;A/2#;6/)$8":\u015a""$ )("\'#&\'#0<*%;A/2#;6/)$8":\u015a""$ )("\'#&\'#&/)$8":\u015b""! )("\'#&\'#." &"/\' 8!:\u015c!! )'),R("%;\xd8/Y#$%;A/,#;\xd8/#$+\")(\"'#&'#06*%;A/,#;\xd8/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),R("%;\x99/Y#$%;B/,#;\xa0/#$+\")(\"'#&'#06*%;B/,#;\xa0/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),R("%$;!/&#0#*;!&&&#/' 8!:\u015d!! )"),R("%;\xdb/Y#$%;B/,#;\xdc/#$+\")(\"'#&'#06*%;B/,#;\xdc/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),R('%3\u015e""5&7\u015f.; &3\u0160""5\'7\u0161./ &3\u0162""5*7\u0163.# &;6/& 8!:\u0164! )'),R("%3\u0165\"\"5&7\u0166/:#;</1$;\xdd/($8#:\u0167#! )(#'#(\"'#&'#.} &%3\xf5\"\"5'7\xf6/:#;</1$;\x9e/($8#:\u0168#! )(#'#(\"'#&'#.P &%3\u0169\"\"5+7\u016a/:#;</1$;\x9e/($8#:\u016b#! )(#'#(\"'#&'#.# &;\xa0"),R('3\u016c""5+7\u016d.k &3\u016e""5)7\u016f._ &3\u0170""5(7\u0171.S &3\u0172""5\'7\u0173.G &3\u0174""5&7\u0175.; &3\u0176""5*7\u0177./ &3\u0178""5)7\u0179.# &;6'),R(';1." &"'),R('%%;6/k#$%;A/2#;6/)$8":\u015a""$ )("\'#&\'#0<*%;A/2#;6/)$8":\u015a""$ )("\'#&\'#&/)$8":\u015b""! )("\'#&\'#." &"/\' 8!:\u017a!! )'),R("%;L.# &;\x99/]#$%;B/,#;\xe1/#$+\")(\"'#&'#06*%;B/,#;\xe1/#$+\")(\"'#&'#&/'$8\":\u017b\" )(\"'#&'#"),R(";\xb9.# &;\xa0"),R("%;\xe3/Y#$%;A/,#;\xe3/#$+\")(\"'#&'#06*%;A/,#;\xe3/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),R("%;\xea/k#;./b$;\xed/Y$$%;B/,#;\xe4/#$+\")(\"'#&'#06*%;B/,#;\xe4/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),R(";\xe5.; &;\xe6.5 &;\xe7./ &;\xe8.) &;\xe9.# &;\xa0"),R("%3\u017c\"\"5#7\u017d/:#;</1$;\xf0/($8#:\u017e#! )(#'#(\"'#&'#"),R("%3\u017f\"\"5%7\u0180/:#;</1$;T/($8#:\u0181#! )(#'#(\"'#&'#"),R("%3\u0182\"\"5(7\u0183/@#;</7$;\\.# &;Y/($8#:\u0184#! )(#'#(\"'#&'#"),R("%3\u0185\"\"5&7\u0186/:#;</1$;6/($8#:\u0187#! )(#'#(\"'#&'#"),R('%3\u0188""5%7\u0189/O#%;</3#$;!0#*;!&/#$+")("\'#&\'#." &"/\'$8":\u018a" )("\'#&\'#'),R("%;\xeb/G#;;/>$;6/5$;;/,$;\xec/#$+%)(%'#($'#(#'#(\"'#&'#"),R('%3\x92""5#7\xd3.# &;6/\' 8!:\u018b!! )'),R('%3\xb1""5#7\u018c.G &3\xb3""5#7\u018d.; &3\xb7""5#7\u018e./ &3\xb5""5$7\u018f.# &;6/\' 8!:\u0190!! )'),R('%;\xee/D#%;C/,#;\xef/#$+")("\'#&\'#." &"/#$+")("\'#&\'#'),R("%;U.) &;\\.# &;X/& 8!:\u0191! )"),R('%%;!." &"/[#;!." &"/M$;!." &"/?$;!." &"/1$;!." &"/#$+%)(%\'#($\'#(#\'#("\'#&\'#/\' 8!:\u0192!! )'),R('%%;!/?#;!." &"/1$;!." &"/#$+#)(#\'#("\'#&\'#/\' 8!:\u0193!! )'),R(";\xbe"),R('%;\x9e/^#$%;B/,#;\xf3/#$+")("\'#&\'#06*%;B/,#;\xf3/#$+")("\'#&\'#&/($8":\u0194"!!)("\'#&\'#'),R(";\xf4.# &;\xa0"),R('%2\u0195""6\u01957\u0196/L#;</C$2\u0197""6\u01977\u0198.) &2\u0199""6\u01997\u019a/($8#:\u019b#! )(#\'#("\'#&\'#'),R('%;\x9e/^#$%;B/,#;\xa0/#$+")("\'#&\'#06*%;B/,#;\xa0/#$+")("\'#&\'#&/($8":\u019c"!!)("\'#&\'#'),R("%;6/5#;0/,$;\xf7/#$+#)(#'#(\"'#&'#"),R("$;2.) &;4.# &;.0/*;2.) &;4.# &;.&"),R("$;%0#*;%&"),R("%;\xfa/;#28\"\"6879/,$;\xfb/#$+#)(#'#(\"'#&'#"),R('%3\u019d""5%7\u019e.) &3\u019f""5$7\u01a0/\' 8!:\u01a1!! )'),R('%;\xfc/J#%28""6879/,#;^/#$+")("\'#&\'#." &"/#$+")("\'#&\'#'),R("%;\\.) &;X.# &;\x82/' 8!:\u01a2!! )"),R(';".S &;!.M &2F""6F7G.A &2J""6J7K.5 &2H""6H7I.) &2N""6N7O'),R('2L""6L7M.\x95 &2B""6B7C.\x89 &2<""6<7=.} &2R""6R7S.q &2T""6T7U.e &2V""6V7W.Y &2P""6P7Q.M &2@""6@7A.A &2D""6D7E.5 &22""6273.) &2>""6>7?'),R('%;\u0100/b#28""6879/S$;\xfb/J$%2\u01a3""6\u01a37\u01a4/,#;\xec/#$+")("\'#&\'#." &"/#$+$)($\'#(#\'#("\'#&\'#'),R('%3\u01a5""5%7\u01a6.) &3\u01a7""5$7\u01a8/\' 8!:\u01a1!! )'),R('%;\xec/O#3\xb1""5#7\xb2.6 &3\xb3""5#7\xb4.* &$;+0#*;+&/\'$8":\u01a9" )("\'#&\'#'),R("%;\u0104/\x87#2F\"\"6F7G/x$;\u0103/o$2F\"\"6F7G/`$;\u0103/W$2F\"\"6F7G/H$;\u0103/?$2F\"\"6F7G/0$;\u0105/'$8):\u01aa) )()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#"),R("%;#/>#;#/5$;#/,$;#/#$+$)($'#(#'#(\"'#&'#"),R("%;\u0103/,#;\u0103/#$+\")(\"'#&'#"),R("%;\u0103/5#;\u0103/,$;\u0103/#$+#)(#'#(\"'#&'#"),R("%;\x84/U#;'/L$;\x92/C$;'/:$;\x90/1$; .\" &\"/#$+&)(&'#(%'#($'#(#'#(\"'#&'#"),R('%2\u01ab""6\u01ab7\u01ac.) &2\u01ad""6\u01ad7\u01ae/w#;0/n$;\u0108/e$$%;B/2#;\u0109.# &;\xa0/#$+")("\'#&\'#0<*%;B/2#;\u0109.# &;\xa0/#$+")("\'#&\'#&/#$+$)($\'#(#\'#("\'#&\'#'),R(";\x99.# &;L"),R("%2\u01af\"\"6\u01af7\u01b0/5#;</,$;\u010a/#$+#)(#'#(\"'#&'#"),R("%;D/S#;,/J$2:\"\"6:7;/;$;,.# &;T/,$;E/#$+%)(%'#($'#(#'#(\"'#&'#")],h=0,u=0,l=[{line:1,column:1}],d=0,p=[],g=0;if("startRule"in t){if(!(t.startRule in n))throw new Error("Can't start parsing from rule \""+t.startRule+'".');o=n[t.startRule];}function f(){return e.substring(u,h)}function m(){return S(u,h)}function T(e,t){return {type:"literal",text:e,ignoreCase:t}}function E(e,t,i){return {type:"class",parts:e,inverted:t,ignoreCase:i}}function _(t){var i,s=l[t];if(s)return s;for(i=t-1;!l[i];)i--;for(s={line:(s=l[i]).line,column:s.column};i<t;)10===e.charCodeAt(i)?(s.line++,s.column=1):s.column++,i++;return l[t]=s,s}function S(e,t){var i=_(e),s=_(t);return {start:{offset:e,line:i.line,column:i.column},end:{offset:t,line:s.line,column:s.column}}}function v(e){h<d||(h>d&&(d=h,p=[]),p.push(e));}function C(e,t,i){return new s(s.buildMessage(e,t),e,t,i)}function R(e){var t,i=new Array(e.length);for(t=0;t<e.length;t++)i[t]=e.charCodeAt(t)-32;return i}if(t.data={},(i=function t(i){for(var s,n,o=c[i],l=0,d=[],p=o.length,f=[],m=[];;){for(;l<p;)switch(o[l]){case 0:m.push(a[o[l+1]]),l+=2;break;case 1:m.push(void 0),l++;break;case 2:m.push(null),l++;break;case 3:m.push(r),l++;break;case 4:m.push([]),l++;break;case 5:m.push(h),l++;break;case 6:m.pop(),l++;break;case 7:h=m.pop(),l++;break;case 8:m.length-=o[l+1],l+=2;break;case 9:m.splice(-2,1),l++;break;case 10:m[m.length-2].push(m.pop()),l++;break;case 11:m.push(m.splice(m.length-o[l+1],o[l+1])),l+=2;break;case 12:m.push(e.substring(m.pop(),h)),l++;break;case 13:f.push(p),d.push(l+3+o[l+1]+o[l+2]),m[m.length-1]?(p=l+3+o[l+1],l+=3):(p=l+3+o[l+1]+o[l+2],l+=3+o[l+1]);break;case 14:f.push(p),d.push(l+3+o[l+1]+o[l+2]),m[m.length-1]===r?(p=l+3+o[l+1],l+=3):(p=l+3+o[l+1]+o[l+2],l+=3+o[l+1]);break;case 15:f.push(p),d.push(l+3+o[l+1]+o[l+2]),m[m.length-1]!==r?(p=l+3+o[l+1],l+=3):(p=l+3+o[l+1]+o[l+2],l+=3+o[l+1]);break;case 16:m[m.length-1]!==r?(f.push(p),d.push(l),p=l+2+o[l+1],l+=2):l+=2+o[l+1];break;case 17:f.push(p),d.push(l+3+o[l+1]+o[l+2]),e.length>h?(p=l+3+o[l+1],l+=3):(p=l+3+o[l+1]+o[l+2],l+=3+o[l+1]);break;case 18:f.push(p),d.push(l+4+o[l+2]+o[l+3]),e.substr(h,a[o[l+1]].length)===a[o[l+1]]?(p=l+4+o[l+2],l+=4):(p=l+4+o[l+2]+o[l+3],l+=4+o[l+2]);break;case 19:f.push(p),d.push(l+4+o[l+2]+o[l+3]),e.substr(h,a[o[l+1]].length).toLowerCase()===a[o[l+1]]?(p=l+4+o[l+2],l+=4):(p=l+4+o[l+2]+o[l+3],l+=4+o[l+2]);break;case 20:f.push(p),d.push(l+4+o[l+2]+o[l+3]),a[o[l+1]].test(e.charAt(h))?(p=l+4+o[l+2],l+=4):(p=l+4+o[l+2]+o[l+3],l+=4+o[l+2]);break;case 21:m.push(e.substr(h,o[l+1])),h+=o[l+1],l+=2;break;case 22:m.push(a[o[l+1]]),h+=a[o[l+1]].length,l+=2;break;case 23:m.push(r),0===g&&v(a[o[l+1]]),l+=2;break;case 24:u=m[m.length-1-o[l+1]],l+=2;break;case 25:u=h,l++;break;case 26:for(s=o.slice(l+4,l+4+o[l+3]),n=0;n<o[l+3];n++)s[n]=m[m.length-1-s[n]];m.splice(m.length-o[l+2],o[l+2],a[o[l+1]].apply(null,s)),l+=4+o[l+3];break;case 27:m.push(t(o[l+1])),l+=2;break;case 28:g++,l++;break;case 29:g--,l++;break;default:throw new Error("Invalid opcode: "+o[l]+".")}if(!(f.length>0))break;p=f.pop(),l=d.pop();}return m[0]}(o))!==r&&h===e.length)return i;throw i!==r&&h<e.length&&v({type:"end"}),C(p,d<e.length?e.charAt(d):null,d<e.length?S(d,d+1):S(d,d))}};},function(e,t,i){var s=i(5);e.exports=function(e){return {parse:function(t,i){var r={startRule:i,SIP:e};try{s.parse(t,r);}catch(e){r.data=-1;}return r.data}}};},function(e,t,i){var s;e.exports=(s=s||function(e,t){var i=Object.create||function(){function e(){}return function(t){var i;return e.prototype=t,i=new e,e.prototype=null,i}}(),s={},r=s.lib={},n=r.Base={extend:function(e){var t=i(this);return e&&t.mixIn(e),t.hasOwnProperty("init")&&this.init!==t.init||(t.init=function(){t.$super.init.apply(this,arguments);}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString);},clone:function(){return this.init.prototype.extend(this)}},o=r.WordArray=n.extend({init:function(e,t){e=this.words=e||[],this.sigBytes=void 0!=t?t:4*e.length;},toString:function(e){return (e||c).stringify(this)},concat:function(e){var t=this.words,i=e.words,s=this.sigBytes,r=e.sigBytes;if(this.clamp(),s%4)for(var n=0;n<r;n++){var o=i[n>>>2]>>>24-n%4*8&255;t[s+n>>>2]|=o<<24-(s+n)%4*8;}else for(var n=0;n<r;n+=4)t[s+n>>>2]=i[n>>>2];return this.sigBytes+=r,this},clamp:function(){var t=this.words,i=this.sigBytes;t[i>>>2]&=4294967295<<32-i%4*8,t.length=e.ceil(i/4);},clone:function(){var e=n.clone.call(this);return e.words=this.words.slice(0),e},random:function(t){for(var i,s=[],r=function(t){var t=t,i=987654321,s=4294967295;return function(){var r=((i=36969*(65535&i)+(i>>16)&s)<<16)+(t=18e3*(65535&t)+(t>>16)&s)&s;return r/=4294967296,(r+=.5)*(e.random()>.5?1:-1)}},n=0;n<t;n+=4){var a=r(4294967296*(i||e.random()));i=987654071*a(),s.push(4294967296*a()|0);}return new o.init(s,t)}}),a=s.enc={},c=a.Hex={stringify:function(e){for(var t=e.words,i=e.sigBytes,s=[],r=0;r<i;r++){var n=t[r>>>2]>>>24-r%4*8&255;s.push((n>>>4).toString(16)),s.push((15&n).toString(16));}return s.join("")},parse:function(e){for(var t=e.length,i=[],s=0;s<t;s+=2)i[s>>>3]|=parseInt(e.substr(s,2),16)<<24-s%8*4;return new o.init(i,t/2)}},h=a.Latin1={stringify:function(e){for(var t=e.words,i=e.sigBytes,s=[],r=0;r<i;r++){var n=t[r>>>2]>>>24-r%4*8&255;s.push(String.fromCharCode(n));}return s.join("")},parse:function(e){for(var t=e.length,i=[],s=0;s<t;s++)i[s>>>2]|=(255&e.charCodeAt(s))<<24-s%4*8;return new o.init(i,t)}},u=a.Utf8={stringify:function(e){try{return decodeURIComponent(escape(h.stringify(e)))}catch(e){throw new Error("Malformed UTF-8 data")}},parse:function(e){return h.parse(unescape(encodeURIComponent(e)))}},l=r.BufferedBlockAlgorithm=n.extend({reset:function(){this._data=new o.init,this._nDataBytes=0;},_append:function(e){"string"==typeof e&&(e=u.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes;},_process:function(t){var i=this._data,s=i.words,r=i.sigBytes,n=this.blockSize,a=4*n,c=r/a,h=(c=t?e.ceil(c):e.max((0|c)-this._minBufferSize,0))*n,u=e.min(4*h,r);if(h){for(var l=0;l<h;l+=n)this._doProcessBlock(s,l);var d=s.splice(0,h);i.sigBytes-=u;}return new o.init(d,u)},clone:function(){var e=n.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0}),d=(r.Hasher=l.extend({cfg:n.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset();},reset:function(){l.reset.call(this),this._doReset();},update:function(e){return this._append(e),this._process(),this},finalize:function(e){e&&this._append(e);var t=this._doFinalize();return t},blockSize:16,_createHelper:function(e){return function(t,i){return new e.init(i).finalize(t)}},_createHmacHelper:function(e){return function(t,i){return new d.HMAC.init(e,i).finalize(t)}}}),s.algo={});return s}(Math),s);},function(e,t,i){var s;e.exports=(s=i(7),function(e){var t=s,i=t.lib,r=i.WordArray,n=i.Hasher,o=t.algo,a=[];!function(){for(var t=0;t<64;t++)a[t]=4294967296*e.abs(e.sin(t+1))|0;}();var c=o.MD5=n.extend({_doReset:function(){this._hash=new r.init([1732584193,4023233417,2562383102,271733878]);},_doProcessBlock:function(e,t){for(var i=0;i<16;i++){var s=t+i,r=e[s];e[s]=16711935&(r<<8|r>>>24)|4278255360&(r<<24|r>>>8);}var n=this._hash.words,o=e[t+0],c=e[t+1],p=e[t+2],g=e[t+3],f=e[t+4],m=e[t+5],T=e[t+6],E=e[t+7],_=e[t+8],S=e[t+9],v=e[t+10],C=e[t+11],R=e[t+12],A=e[t+13],y=e[t+14],b=e[t+15],I=n[0],w=n[1],D=n[2],N=n[3];w=d(w=d(w=d(w=d(w=l(w=l(w=l(w=l(w=u(w=u(w=u(w=u(w=h(w=h(w=h(w=h(w,D=h(D,N=h(N,I=h(I,w,D,N,o,7,a[0]),w,D,c,12,a[1]),I,w,p,17,a[2]),N,I,g,22,a[3]),D=h(D,N=h(N,I=h(I,w,D,N,f,7,a[4]),w,D,m,12,a[5]),I,w,T,17,a[6]),N,I,E,22,a[7]),D=h(D,N=h(N,I=h(I,w,D,N,_,7,a[8]),w,D,S,12,a[9]),I,w,v,17,a[10]),N,I,C,22,a[11]),D=h(D,N=h(N,I=h(I,w,D,N,R,7,a[12]),w,D,A,12,a[13]),I,w,y,17,a[14]),N,I,b,22,a[15]),D=u(D,N=u(N,I=u(I,w,D,N,c,5,a[16]),w,D,T,9,a[17]),I,w,C,14,a[18]),N,I,o,20,a[19]),D=u(D,N=u(N,I=u(I,w,D,N,m,5,a[20]),w,D,v,9,a[21]),I,w,b,14,a[22]),N,I,f,20,a[23]),D=u(D,N=u(N,I=u(I,w,D,N,S,5,a[24]),w,D,y,9,a[25]),I,w,g,14,a[26]),N,I,_,20,a[27]),D=u(D,N=u(N,I=u(I,w,D,N,A,5,a[28]),w,D,p,9,a[29]),I,w,E,14,a[30]),N,I,R,20,a[31]),D=l(D,N=l(N,I=l(I,w,D,N,m,4,a[32]),w,D,_,11,a[33]),I,w,C,16,a[34]),N,I,y,23,a[35]),D=l(D,N=l(N,I=l(I,w,D,N,c,4,a[36]),w,D,f,11,a[37]),I,w,E,16,a[38]),N,I,v,23,a[39]),D=l(D,N=l(N,I=l(I,w,D,N,A,4,a[40]),w,D,o,11,a[41]),I,w,g,16,a[42]),N,I,T,23,a[43]),D=l(D,N=l(N,I=l(I,w,D,N,S,4,a[44]),w,D,R,11,a[45]),I,w,b,16,a[46]),N,I,p,23,a[47]),D=d(D,N=d(N,I=d(I,w,D,N,o,6,a[48]),w,D,E,10,a[49]),I,w,y,15,a[50]),N,I,m,21,a[51]),D=d(D,N=d(N,I=d(I,w,D,N,R,6,a[52]),w,D,g,10,a[53]),I,w,v,15,a[54]),N,I,c,21,a[55]),D=d(D,N=d(N,I=d(I,w,D,N,_,6,a[56]),w,D,b,10,a[57]),I,w,T,15,a[58]),N,I,A,21,a[59]),D=d(D,N=d(N,I=d(I,w,D,N,f,6,a[60]),w,D,C,10,a[61]),I,w,p,15,a[62]),N,I,S,21,a[63]),n[0]=n[0]+I|0,n[1]=n[1]+w|0,n[2]=n[2]+D|0,n[3]=n[3]+N|0;},_doFinalize:function(){var t=this._data,i=t.words,s=8*this._nDataBytes,r=8*t.sigBytes;i[r>>>5]|=128<<24-r%32;var n=e.floor(s/4294967296),o=s;i[15+(r+64>>>9<<4)]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8),i[14+(r+64>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),t.sigBytes=4*(i.length+1),this._process();for(var a=this._hash,c=a.words,h=0;h<4;h++){var u=c[h];c[h]=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8);}return a},clone:function(){var e=n.clone.call(this);return e._hash=this._hash.clone(),e}});function h(e,t,i,s,r,n,o){var a=e+(t&i|~t&s)+r+o;return (a<<n|a>>>32-n)+t}function u(e,t,i,s,r,n,o){var a=e+(t&s|i&~s)+r+o;return (a<<n|a>>>32-n)+t}function l(e,t,i,s,r,n,o){var a=e+(t^i^s)+r+o;return (a<<n|a>>>32-n)+t}function d(e,t,i,s,r,n,o){var a=e+(i^(t|~s))+r+o;return (a<<n|a>>>32-n)+t}t.MD5=n._createHelper(c),t.HmacMD5=n._createHmacHelper(c);}(Math),s.MD5);},function(e,t,i){var s=i(8);e.exports=function(e){var t;return (t=function(e){this.logger=e.getLogger("sipjs.digestauthentication"),this.username=e.configuration.authorizationUser,this.password=e.configuration.password,this.cnonce=null,this.nc=0,this.ncHex="00000000",this.response=null;}).prototype.authenticate=function(t,i){if(this.algorithm=i.algorithm,this.realm=i.realm,this.nonce=i.nonce,this.opaque=i.opaque,this.stale=i.stale,this.algorithm){if("MD5"!==this.algorithm)return this.logger.warn('challenge with Digest algorithm different than "MD5", authentication aborted'),!1}else this.algorithm="MD5";if(!this.realm)return this.logger.warn("challenge without Digest realm, authentication aborted"),!1;if(!this.nonce)return this.logger.warn("challenge without Digest nonce, authentication aborted"),!1;if(i.qop)if(i.qop.indexOf("auth")>-1)this.qop="auth";else{if(!(i.qop.indexOf("auth-int")>-1))return this.logger.warn('challenge without Digest qop different than "auth" or "auth-int", authentication aborted'),!1;this.qop="auth-int";}else this.qop=null;return this.method=t.method,this.uri=t.ruri,this.cnonce=e.createRandomToken(12),this.nc+=1,this.updateNcHex(),4294967296===this.nc&&(this.nc=1,this.ncHex="00000001"),this.calculateResponse(),!0},t.prototype.calculateResponse=function(){var e,t;e=s(this.username+":"+this.realm+":"+this.password),"auth"===this.qop?(t=s(this.method+":"+this.uri),this.response=s(e+":"+this.nonce+":"+this.ncHex+":"+this.cnonce+":auth:"+t)):"auth-int"===this.qop?(t=s(this.method+":"+this.uri+":"+s(this.body?this.body:"")),this.response=s(e+":"+this.nonce+":"+this.ncHex+":"+this.cnonce+":auth-int:"+t)):null===this.qop&&(t=s(this.method+":"+this.uri),this.response=s(e+":"+this.nonce+":"+t));},t.prototype.toString=function(){var e=[];if(!this.response)throw new Error("response field does not exist, cannot generate Authorization header");return e.push("algorithm="+this.algorithm),e.push('username="'+this.username+'"'),e.push('realm="'+this.realm+'"'),e.push('nonce="'+this.nonce+'"'),e.push('uri="'+this.uri+'"'),e.push('response="'+this.response+'"'),this.opaque&&e.push('opaque="'+this.opaque+'"'),this.qop&&(e.push("qop="+this.qop),e.push('cnonce="'+this.cnonce+'"'),e.push("nc="+this.ncHex)),"Digest "+e.join(", ")},t.prototype.updateNcHex=function(){var e=Number(this.nc).toString(16);this.ncHex="00000000".substr(0,8-e.length)+e;},t};},function(e,t,i){e.exports=function(e){var t,i=[],s=[],r=[];function n(t,i,s){for(var r,n=e.Utils.buildStatusLine(t),o=i.getHeaders("via"),a=o.length,c=0;c<a;c++)n+="Via: "+o[c]+"\r\n";r=i.getHeader("To"),i.to_tag||(r+=";tag="+e.Utils.newTag()),n+="To: "+r+"\r\n",n+="From: "+i.getHeader("From")+"\r\n",n+="Call-ID: "+i.call_id+"\r\n",n+="CSeq: "+i.cseq+" "+i.method+"\r\n",n+="\r\n",s.send(n);}i.push(function(e,t,i){if(!e.ruri||"sip"!==e.ruri.scheme)return n(416,e,i),!1}),i.push(function(e,t,i){if(!e.to_tag&&e.call_id.substr(0,5)===t.configuration.sipjsId)return n(482,e,i),!1}),i.push(function(t,i,s){if(e.Utils.str_utf8_length(t.body)<t.getHeader("content-length"))return n(400,t,s),!1}),i.push(function(t,i,s){var r,o,a=t.from_tag,c=t.call_id,h=t.cseq;if(!t.to_tag)if(t.method===e.C.INVITE){if(r=i.transactions.ist[t.via_branch])return;for(o in i.transactions.ist)if((r=i.transactions.ist[o]).request.from_tag===a&&r.request.call_id===c&&r.request.cseq===h)return n(482,t,s),!1}else{if(r=i.transactions.nist[t.via_branch])return;for(o in i.transactions.nist)if((r=i.transactions.nist[o]).request.from_tag===a&&r.request.call_id===c&&r.request.cseq===h)return n(482,t,s),!1}}),s.push(function(e,t){if(e.getHeaders("via").length>1)return t.getLogger("sip.sanitycheck").warn("More than one Via header field present in the response. Dropping the response"),!1}),s.push(function(e,t){var i=t.configuration.viaHost;if(e.via.host!==i||void 0!==e.via.port)return t.getLogger("sip.sanitycheck").warn("Via sent-by in the response does not match UA Via host value. Dropping the response"),!1}),s.push(function(t,i){if(e.Utils.str_utf8_length(t.body)<t.getHeader("content-length"))return i.getLogger("sip.sanitycheck").warn("Message body length is lower than the value in Content-Length header field. Dropping the response"),!1}),r.push(function(e,t){for(var i=["from","to","call_id","cseq","via"],s=i.length;s--;)if(!e.hasHeader(i[s]))return t.getLogger("sip.sanitycheck").warn("Missing mandatory header field : "+i[s]+". Dropping the response"),!1}),t=function(t,n,o){var a;for(a=r.length;a--;)if(!1===r[a](t,n,o))return !1;if(t instanceof e.IncomingRequest){for(a=i.length;a--;)if(!1===i[a](t,n,o))return !1}else if(t instanceof e.IncomingResponse)for(a=s.length;a--;)if(!1===s[a](t,n,o))return !1;return !0},e.sanityCheck=t;};},function(e,t,i){var s=function(e,t){this.session=e||{},this.options=t||{};};s.prototype={trackAdded:function(){this.session.emit("trackAdded");},directionChanged:function(){this.session.emit("directionChanged");}},e.exports=s;},function(e,t,i){(function(t){e.exports=function(e){var s=function(e,i,s){this.options=s||{},this.logger=e,this.observer=i,this.dtmfSender=null,this.shouldAcquireMedia=!0,this.CONTENT_TYPE="application/sdp",this.C={},this.C.DIRECTION={NULL:null,SENDRECV:"sendrecv",SENDONLY:"sendonly",RECVONLY:"recvonly",INACTIVE:"inactive"},this.logger.log("SessionDescriptionHandlerOptions: "+JSON.stringify(this.options)),this.direction=this.C.DIRECTION.NULL,this.modifiers=this.options.modifiers||[],Array.isArray(this.modifiers)||(this.modifiers=[this.modifiers]);var r=t.window||t;this.WebRTC={MediaStream:r.MediaStream,getUserMedia:r.navigator.mediaDevices.getUserMedia.bind(r.navigator.mediaDevices),RTCPeerConnection:r.RTCPeerConnection,RTCSessionDescription:r.RTCSessionDescription},this.iceGatheringDeferred=null,this.iceGatheringTimeout=!1,this.iceGatheringTimer=null,this.initPeerConnection(this.options.peerConnectionOptions),this.constraints=this.checkAndDefaultConstraints(this.options.constraints);};return s.defaultFactory=function(e,t){var r=e.ua.getLogger("sip.invitecontext.sessionDescriptionHandler",e.id),n=new(i(11))(e,t);return new s(r,n,t)},s.prototype=Object.create(e.SessionDescriptionHandler.prototype,{close:{writable:!0,value:function(){this.logger.log("closing PeerConnection"),this.peerConnection&&"closed"!==this.peerConnection.signalingState&&(this.peerConnection.getSenders?this.peerConnection.getSenders().forEach(function(e){e.track&&e.track.stop();}):(this.logger.warn("Using getLocalStreams which is deprecated"),this.peerConnection.getLocalStreams().forEach(function(e){e.getTracks().forEach(function(e){e.stop();});})),this.peerConnection.getReceivers?this.peerConnection.getReceivers().forEach(function(e){e.track&&e.track.stop();}):(this.logger.warn("Using getRemoteStreams which is deprecated"),this.peerConnection.getRemoteStreams().forEach(function(e){e.getTracks().forEach(function(e){e.stop();});})),this.resetIceGatheringComplete(),this.peerConnection.close());}},getDescription:{writable:!0,value:function(t,i){(t=t||{}).peerConnectionOptions&&this.initPeerConnection(t.peerConnectionOptions);var s=Object.assign({},this.constraints,t.constraints);return s=this.checkAndDefaultConstraints(s),JSON.stringify(s)!==JSON.stringify(this.constraints)&&(this.constraints=s,this.shouldAcquireMedia=!0),i=i||[],Array.isArray(i)||(i=[i]),i=i.concat(this.modifiers),e.Utils.Promise.resolve().then(function(){if(this.shouldAcquireMedia)return this.acquire(this.constraints).then(function(){this.shouldAcquireMedia=!1;}.bind(this))}.bind(this)).then(function(){return this.createOfferOrAnswer(t.RTCOfferOptions,i)}.bind(this)).then(function(e){return {body:e,contentType:this.CONTENT_TYPE}}.bind(this))}},hasDescription:{writable:!0,value:function(e){return e===this.CONTENT_TYPE}},holdModifier:{writable:!0,value:function(t){return /a=(sendrecv|sendonly|recvonly|inactive)/.test(t.sdp)?(t.sdp=t.sdp.replace(/a=sendrecv\r\n/g,"a=sendonly\r\n"),t.sdp=t.sdp.replace(/a=recvonly\r\n/g,"a=inactive\r\n")):t.sdp=t.sdp.replace(/(m=[^\r]*\r\n)/g,"$1a=sendonly\r\n"),e.Utils.Promise.resolve(t)}},setDescription:{writable:!0,value:function(t,i,s){var r=this;(i=i||{}).peerConnectionOptions&&this.initPeerConnection(i.peerConnectionOptions),s=s||[],Array.isArray(s)||(s=[s]),s=s.concat(this.modifiers);var n={type:this.hasOffer("local")?"answer":"offer",sdp:t};return e.Utils.Promise.resolve().then(function(){if(this.shouldAcquireMedia)return this.acquire(this.constrains).then(function(){this.shouldAcquireMedia=!1;}.bind(this))}.bind(this)).then(function(){return e.Utils.reducePromises(s,n)}).catch(function(e){throw r.logger.error("The modifiers did not resolve successfully"),r.logger.error(e),e}).then(function(e){return r.emit("setDescription",e),r.peerConnection.setRemoteDescription(new r.WebRTC.RTCSessionDescription(e))}).catch(function(e){throw r.logger.error(e),r.emit("peerConnection-setRemoteDescriptionFailed",e),e}).then(function(){r.peerConnection.getReceivers?r.emit("setRemoteDescription",r.peerConnection.getReceivers()):r.emit("setRemoteDescription",r.peerConnection.getRemoteStreams()),r.emit("confirmed",r);})}},sendDtmf:{writable:!0,value:function(e,t){if(!this.dtmfSender&&this.hasBrowserGetSenderSupport()){var i=this.peerConnection.getSenders();i.length>0&&(this.dtmfSender=i[0].dtmf);}if(!this.dtmfSender&&this.hasBrowserTrackSupport()){var s=this.peerConnection.getLocalStreams();if(s.length>0){var r=s[0].getAudioTracks();r.length>0&&(this.dtmfSender=this.peerConnection.createDTMFSender(r[0]));}}if(!this.dtmfSender)return !1;try{this.dtmfSender.insertDTMF(e,t.duration,t.interToneGap);}catch(e){if("InvalidStateError"===e.type||"InvalidCharacterError"===e.type)return this.logger.error(e),!1;throw e}return this.logger.log("DTMF sent via RTP: "+e.toString()),!0}},getDirection:{writable:!0,value:function(){return this.direction}},createOfferOrAnswer:{writable:!0,value:function(t,i){var s,r=this,n=this.peerConnection;return t=t||{},s=r.hasOffer("remote")?"createAnswer":"createOffer",n[s](t).catch(function(e){throw r.emit("peerConnection-"+s+"Failed",e),e}).then(function(t){return e.Utils.reducePromises(i,r.createRTCSessionDescriptionInit(t))}).then(function(e){return r.resetIceGatheringComplete(),n.setLocalDescription(e)}).catch(function(e){throw r.emit("peerConnection-SetLocalDescriptionFailed",e),e}).then(function(){return r.waitForIceGatheringComplete()}).then(function(){var t=r.createRTCSessionDescriptionInit(r.peerConnection.localDescription);return e.Utils.reducePromises(i,t)}).then(function(e){return r.emit("getDescription",e),r.setDirection(e.sdp),e.sdp}).catch(function(t){throw r.logger.error(t),new e.Exceptions.GetDescriptionError(t)})}},createRTCSessionDescriptionInit:{writable:!0,value:function(e){return {type:e.type,sdp:e.sdp}}},addDefaultIceCheckingTimeout:{writable:!0,value:function(e){return void 0===e.iceCheckingTimeout&&(e.iceCheckingTimeout=5e3),e}},addDefaultIceServers:{writable:!0,value:function(e){return e.iceServers||(e.iceServers=[{urls:"stun:stun.l.google.com:19302"}]),e}},checkAndDefaultConstraints:{writable:!0,value:function(e){var t={audio:!0,video:!0};return e=e||t,0===Object.keys(e).length&&e.constructor===Object?t:e}},hasBrowserTrackSupport:{writable:!0,value:function(){return Boolean(this.peerConnection.addTrack)}},hasBrowserGetSenderSupport:{writable:!0,value:function(){return Boolean(this.peerConnection.getSenders)}},initPeerConnection:{writable:!0,value:function(t){var i=this;t=t||{},(t=this.addDefaultIceCheckingTimeout(t)).rtcConfiguration=t.rtcConfiguration||{},t.rtcConfiguration=this.addDefaultIceServers(t.rtcConfiguration),this.logger.log("initPeerConnection"),this.peerConnection&&(this.logger.log("Already have a peer connection for this session. Tearing down."),this.resetIceGatheringComplete(),this.peerConnection.close()),this.peerConnection=new this.WebRTC.RTCPeerConnection(t.rtcConfiguration),this.logger.log("New peer connection created"),"ontrack"in this.peerConnection?this.peerConnection.addEventListener("track",function(e){i.logger.log("track added"),i.observer.trackAdded(),i.emit("addTrack",e);}):(this.logger.warn("Using onaddstream which is deprecated"),this.peerConnection.onaddstream=function(e){i.logger.log("stream added"),i.emit("addStream",e);}),this.peerConnection.onicecandidate=function(e){i.emit("iceCandidate",e),e.candidate&&i.logger.log("ICE candidate received: "+(null===e.candidate.candidate?null:e.candidate.candidate.trim()));},this.peerConnection.onicegatheringstatechange=function(){switch(i.logger.log("RTCIceGatheringState changed: "+this.iceGatheringState),this.iceGatheringState){case"gathering":i.emit("iceGathering",this),!i.iceGatheringTimer&&t.iceCheckingTimeout&&(i.iceGatheringTimeout=!1,i.iceGatheringTimer=e.Timers.setTimeout(function(){i.logger.log("RTCIceChecking Timeout Triggered after "+t.iceCheckingTimeout+" milliseconds"),i.iceGatheringTimeout=!0,i.triggerIceGatheringComplete();},t.iceCheckingTimeout));break;case"complete":i.triggerIceGatheringComplete();}},this.peerConnection.oniceconnectionstatechange=function(){var e;switch(this.iceConnectionState){case"new":e="iceConnection";break;case"checking":e="iceConnectionChecking";break;case"connected":e="iceConnectionConnected";break;case"completed":e="iceConnectionCompleted";break;case"failed":e="iceConnectionFailed";break;case"disconnected":e="iceConnectionDisconnected";break;case"closed":e="iceConnectionClosed";break;default:return void i.logger.warn("Unknown iceConnection state:",this.iceConnectionState)}i.emit(e,this);};}},acquire:{writable:!0,value:function(t){return t=this.checkAndDefaultConstraints(t),new e.Utils.Promise(function(e,i){this.logger.log("acquiring local media"),this.emit("userMediaRequest",t),t.audio||t.video?this.WebRTC.getUserMedia(t).then(function(t){this.observer.trackAdded(),this.emit("userMedia",t),e(t);}.bind(this)).catch(function(e){this.emit("userMediaFailed",e),i(e);}.bind(this)):e([]);}.bind(this)).catch(function(t){return this.logger.error("unable to acquire streams"),this.logger.error(t),e.Utils.Promise.reject(t)}.bind(this)).then(function(t){this.logger.log("acquired local media streams");try{return this.peerConnection.removeTrack&&this.peerConnection.getSenders().forEach(function(e){this.peerConnection.removeTrack(e);}),t}catch(t){return e.Utils.Promise.reject(t)}}.bind(this)).catch(function(t){return this.logger.error("error removing streams"),this.logger.error(t),e.Utils.Promise.reject(t)}.bind(this)).then(function(t){try{(t=[].concat(t)).forEach(function(e){this.peerConnection.addTrack?e.getTracks().forEach(function(t){this.peerConnection.addTrack(t,e);},this):this.peerConnection.addStream(e);},this);}catch(t){return e.Utils.Promise.reject(t)}return e.Utils.Promise.resolve()}.bind(this)).catch(function(t){return this.logger.error("error adding stream"),this.logger.error(t),e.Utils.Promise.reject(t)}.bind(this))}},hasOffer:{writable:!0,value:function(e){var t="have-"+e+"-offer";return this.peerConnection.signalingState===t}},isIceGatheringComplete:{writable:!0,value:function(){return "complete"===this.peerConnection.iceGatheringState||this.iceGatheringTimeout}},resetIceGatheringComplete:{writable:!0,value:function(){this.iceGatheringTimeout=!1,this.iceGatheringTimer&&(e.Timers.clearTimeout(this.iceGatheringTimer),this.iceGatheringTimer=null),this.iceGatheringDeferred&&(this.iceGatheringDeferred.reject(),this.iceGatheringDeferred=null);}},setDirection:{writable:!0,value:function(e){var t=e.match(/a=(sendrecv|sendonly|recvonly|inactive)/);if(null===t)return this.direction=this.C.DIRECTION.NULL,void this.observer.directionChanged();var i=t[1];switch(i){case this.C.DIRECTION.SENDRECV:case this.C.DIRECTION.SENDONLY:case this.C.DIRECTION.RECVONLY:case this.C.DIRECTION.INACTIVE:this.direction=i;break;default:this.direction=this.C.DIRECTION.NULL;}this.observer.directionChanged();}},triggerIceGatheringComplete:{writable:!0,value:function(){this.isIceGatheringComplete()&&(this.emit("iceGatheringComplete",this),this.iceGatheringTimer&&(e.Timers.clearTimeout(this.iceGatheringTimer),this.iceGatheringTimer=null),this.iceGatheringDeferred&&(this.iceGatheringDeferred.resolve(),this.iceGatheringDeferred=null));}},waitForIceGatheringComplete:{writable:!0,value:function(){return this.isIceGatheringComplete()?e.Utils.Promise.resolve():(this.isIceGatheringDeferred||(this.iceGatheringDeferred=e.Utils.defer()),this.iceGatheringDeferred.promise)}}}),s};}).call(this,i(0));},function(e,t,i){(function(t){e.exports=function(e){var i,s={STATUS_CONNECTING:0,STATUS_OPEN:1,STATUS_CLOSING:2,STATUS_CLOSED:3},r=(t.window||t).WebSocket;return (i=function(t,i){i=e.Utils.defaultOptions({},i),this.logger=t,this.ws=null,this.server=null,this.connectionPromise=null,this.connectDeferredResolve=null,this.connectionTimeout=null,this.disconnectionPromise=null,this.disconnectDeferredResolve=null,this.boundOnOpen=null,this.boundOnMessage=null,this.boundOnClose=null,this.reconnectionAttempts=0,this.reconnectTimer=null,this.keepAliveInterval=null,this.keepAliveDebounceTimeout=null,this.status=s.STATUS_CONNECTING,this.configuration={},this.loadConfig(i);}).prototype=Object.create(e.Transport.prototype,{isConnected:{writable:!0,value:function(){return this.status===s.STATUS_OPEN}},sendPromise:{writable:!0,value:function(t,i){if(i=i||{},!this.statusAssert(s.STATUS_OPEN,i.force))return this.onError("unable to send message - WebSocket not open"),e.Utils.Promise.reject();var r=t.toString();return this.ws?(!0===this.configuration.traceSip&&this.logger.log("sending WebSocket message:\n\n"+r+"\n"),this.ws.send(r),e.Utils.Promise.resolve({msg:r})):(this.onError("unable to send message - WebSocket does not exist"),e.Utils.Promise.reject())}},disconnectPromise:{writable:!0,value:function(t){return this.disconnectionPromise?this.disconnectionPromise:(t=t||{},this.statusTransition(s.STATUS_CLOSING,t.force)?(this.disconnectionPromise=new e.Utils.Promise(function(i,s){this.disconnectDeferredResolve=i,this.reconnectTimer&&(e.Timers.clearTimeout(this.reconnectTimer),this.reconnectTimer=null),this.ws?(this.stopSendingKeepAlives(),this.logger.log("closing WebSocket "+this.server.ws_uri),this.ws.close(t.code,t.reason)):s("Attempted to disconnect but the websocket doesn't exist");}.bind(this)),this.disconnectionPromise):e.Utils.Promise.reject("Failed status transition - attempted to disconnect a socket that was not open"))}},connectPromise:{writable:!0,value:function(t){return this.connectionPromise?this.connectionPromise:(t=t||{},this.server=this.server||this.getNextWsServer(t.force),this.connectionPromise=new e.Utils.Promise(function(i,n){if((this.status===s.STATUS_OPEN||this.status===s.STATUS_CLOSING)&&!t.force)return this.logger.warn("WebSocket "+this.server.ws_uri+" is already connected"),void n("Failed status check - attempted to open a connection but already open/closing");this.connectDeferredResolve=i,this.status=s.STATUS_CONNECTING,this.logger.log("connecting to WebSocket "+this.server.ws_uri),this.disposeWs();try{this.ws=new r(this.server.ws_uri,"sip");}catch(e){return this.ws=null,this.status=s.STATUS_CLOSED,this.onError("error connecting to WebSocket "+this.server.ws_uri+":"+e),void n("Failed to create a websocket")}this.ws?(this.connectionTimeout=e.Timers.setTimeout(function(){this.onError("took too long to connect - exceeded time set in configuration.connectionTimeout: "+this.configuration.connectionTimeout+"s");}.bind(this),1e3*this.configuration.connectionTimeout),this.boundOnOpen=this.onOpen.bind(this),this.boundOnMessage=this.onMessage.bind(this),this.boundOnClose=this.onClose.bind(this),this.ws.addEventListener("open",this.boundOnOpen),this.ws.addEventListener("message",this.boundOnMessage),this.ws.addEventListener("close",this.boundOnClose)):n("Unexpected instance websocket not set");}.bind(this)),this.connectionPromise)}},onOpen:{writable:!0,value:function(){this.status=s.STATUS_OPEN,this.emit("connected"),e.Timers.clearTimeout(this.connectionTimeout),this.logger.log("WebSocket "+this.server.ws_uri+" connected"),null!==this.reconnectTimer&&(e.Timers.clearTimeout(this.reconnectTimer),this.reconnectTimer=null),this.reconnectionAttempts=0,this.disconnectionPromise=null,this.disconnectDeferredResolve=null,this.startSendingKeepAlives(),this.connectDeferredResolve?this.connectDeferredResolve({overrideEvent:!0}):this.logger.warn("Unexpected websocket.onOpen with no connectDeferredResolve");}},onClose:{writable:!0,value:function(t){if(this.logger.log("WebSocket disconnected (code: "+t.code+(t.reason?"| reason: "+t.reason:"")+")"),this.emit("disconnected",{code:t.code,reason:t.reason}),this.status!==s.STATUS_CLOSING&&(this.logger.warn("WebSocket abrupt disconnection"),this.emit("transportError")),this.stopSendingKeepAlives(),e.Timers.clearTimeout(this.connectionTimeout),this.connectionTimeout=null,this.connectionPromise=null,this.connectDeferredResolve=null,this.disconnectDeferredResolve)return this.disconnectDeferredResolve({overrideEvent:!0}),this.statusTransition(s.STATUS_CLOSED),void(this.disconnectDeferredResolve=null);this.status=s.STATUS_CLOSED,this.reconnect();}},disposeWs:{writable:!0,value:function(){this.ws&&(this.ws.removeEventListener("open",this.boundOnOpen),this.ws.removeEventListener("message",this.boundOnMessage),this.ws.removeEventListener("close",this.boundOnClose),this.boundOnOpen=null,this.boundOnMessage=null,this.boundOnClose=null,this.ws=null);}},onMessage:{writable:!0,value:function(e){var t=e.data;if("\r\n"===t)return this.clearKeepAliveTimeout(),void(!0===this.configuration.traceSip&&this.logger.log("received WebSocket message with CRLF Keep Alive response"));if(t){if("string"!=typeof t){try{t=String.fromCharCode.apply(null,new Uint8Array(t));}catch(e){return void this.logger.warn("received WebSocket binary message failed to be converted into string, message discarded")}!0===this.configuration.traceSip&&this.logger.log("received WebSocket binary message:\n\n"+t+"\n");}else!0===this.configuration.traceSip&&this.logger.log("received WebSocket text message:\n\n"+t+"\n");this.emit("message",t);}else this.logger.warn("received empty message, message discarded");}},onError:{writable:!0,value:function(e){this.logger.warn("Transport error: "+e),this.emit("transportError");}},reconnect:{writable:!0,value:function(){if(this.reconnectionAttempts>0&&this.logger.log("Reconnection attempt "+this.reconnectionAttempts+" failed"),this.noAvailableServers())return this.logger.warn("no available ws servers left - going to closed state"),this.status=s.STATUS_CLOSED,void this.resetServerErrorStatus();this.isConnected()&&(this.logger.warn("attempted to reconnect while connected - forcing disconnect"),this.disconnect({force:!0})),this.reconnectionAttempts+=1,this.reconnectionAttempts>this.configuration.maxReconnectionAttempts?(this.logger.warn("maximum reconnection attempts for WebSocket "+this.server.ws_uri),this.logger.log("transport "+this.server.ws_uri+" failed | connection state set to 'error'"),this.server.isError=!0,this.emit("transportError"),this.server=this.getNextWsServer(),this.reconnectionAttempts=0,this.reconnect()):(this.logger.log("trying to reconnect to WebSocket "+this.server.ws_uri+" (reconnection attempt "+this.reconnectionAttempts+")"),this.reconnectTimer=e.Timers.setTimeout(function(){this.connect(),this.reconnectTimer=null;}.bind(this),1===this.reconnectionAttempts?0:1e3*this.configuration.reconnectionTimeout));}},resetServerErrorStatus:{writable:!0,value:function(){var e,t=this.configuration.wsServers.length;for(e=0;e<t;e++)this.configuration.wsServers[e].isError=!1;}},getNextWsServer:{writable:!0,value:function(e){if(!this.noAvailableServers()){var t,i,s,r=[];for(i=this.configuration.wsServers.length,t=0;t<i;t++)(s=this.configuration.wsServers[t]).isError&&!e||(0===r.length?r.push(s):s.weight>r[0].weight?r=[s]:s.weight===r[0].weight&&r.push(s));return r[t=Math.floor(Math.random()*r.length)]}this.logger.warn("attempted to get next ws server but there are no available ws servers left");}},noAvailableServers:{writable:!0,value:function(){var e;for(e in this.configuration.wsServers)if(!this.configuration.wsServers[e].isError)return !1;return !0}},sendKeepAlive:{writable:!0,value:function(){if(!this.keepAliveDebounceTimeout)return this.keepAliveDebounceTimeout=e.Timers.setTimeout(function(){this.emit("keepAliveDebounceTimeout");}.bind(this),1e3*this.configuration.keepAliveDebounce),this.send("\r\n\r\n")}},clearKeepAliveTimeout:{writable:!0,value:function(){e.Timers.clearTimeout(this.keepAliveDebounceTimeout),this.keepAliveDebounceTimeout=null;}},startSendingKeepAlives:{writable:!0,value:function(){var t,i;this.configuration.keepAliveInterval&&!this.keepAliveInterval&&(this.keepAliveInterval=e.Timers.setInterval(function(){this.sendKeepAlive(),this.startSendingKeepAlives();}.bind(this),(t=this.configuration.keepAliveInterval,i=.8*t,1e3*(Math.random()*(t-i)+i))));}},stopSendingKeepAlives:{writable:!0,value:function(){e.Timers.clearInterval(this.keepAliveInterval),e.Timers.clearTimeout(this.keepAliveDebounceTimeout),this.keepAliveInterval=null,this.keepAliveDebounceTimeout=null;}},statusAssert:{writable:!0,value:function(e,t){return e===this.status||(t?(this.logger.warn("Attempted to assert "+Object.keys(s)[this.status]+" as "+Object.keys(s)[e]+"- continuing with option: 'force'"),!0):(this.logger.warn("Tried to assert "+Object.keys(s)[e]+" but is currently "+Object.keys(s)[this.status]),!1))}},statusTransition:{writable:!0,value:function(e,t){return this.logger.log("Attempting to transition status from "+Object.keys(s)[this.status]+" to "+Object.keys(s)[e]),e===s.STATUS_OPEN&&this.statusAssert(s.STATUS_CONNECTING,t)||e===s.STATUS_CLOSING&&this.statusAssert(s.STATUS_OPEN,t)||e===s.STATUS_CLOSED&&this.statusAssert(s.STATUS_CLOSING,t)?(this.status=e,!0):(this.logger.warn("Status transition failed - result: no-op - reason: either gave an nonexistent status or attempted illegal transition"),!1)}},loadConfig:{writable:!0,value:function(t){var i,s,r,n={wsServers:[{scheme:"WSS",sip_uri:"<sip:edge.sip.onsip.com;transport=ws;lr>",weight:0,ws_uri:"wss://edge.sip.onsip.com",isError:!1}],connectionTimeout:5,maxReconnectionAttempts:3,reconnectionTimeout:4,keepAliveInterval:0,keepAliveDebounce:10,traceSip:!1};function o(e,i){var s=e.replace(/([a-z][A-Z])/g,function(e){return e[0]+"_"+e[1].toLowerCase()});if(e!==s){var r=t.hasOwnProperty(e);t.hasOwnProperty(s)&&(i.warn(s+" is deprecated, please use "+e),r&&i.warn(e+" overriding "+s)),t[e]=r?t[e]:t[s];}}var a=this.getConfigurationCheck();for(i in a.mandatory){if(o(i,this.logger),!t.hasOwnProperty(i))throw new e.Exceptions.ConfigurationError(i);if(s=t[i],void 0===(r=a.mandatory[i](s)))throw new e.Exceptions.ConfigurationError(i,s);n[i]=r;}for(i in a.optional)if(o(i,this.logger),t.hasOwnProperty(i)){if((s=t[i])instanceof Array&&0===s.length)continue;if(null===s||""===s||void 0===s)continue;if("number"==typeof s&&isNaN(s))continue;if(void 0===(r=a.optional[i](s)))throw new e.Exceptions.ConfigurationError(i,s);n[i]=r;}var c={};for(i in n)c[i]={value:n[i]};for(i in Object.defineProperties(this.configuration,c),this.logger.log("configuration parameters after validation:"),n)this.logger.log("\xb7 "+i+": "+JSON.stringify(n[i]));}},getConfigurationCheck:{writable:!0,value:function(){return {mandatory:{},optional:{wsServers:function(t){var i,s,r;if("string"==typeof t)t=[{ws_uri:t}];else{if(!(t instanceof Array))return;for(s=t.length,i=0;i<s;i++)"string"==typeof t[i]&&(t[i]={ws_uri:t[i]});}if(0===t.length)return !1;for(s=t.length,i=0;i<s;i++){if(!t[i].ws_uri)return;if(t[i].weight&&!Number(t[i].weight))return;if(-1===(r=e.Grammar.parse(t[i].ws_uri,"absoluteURI")))return;if(["wss","ws","udp"].indexOf(r.scheme)<0)return;t[i].sip_uri="<sip:"+r.host+(r.port?":"+r.port:"")+";transport="+r.scheme.replace(/^wss$/i,"ws")+";lr>",t[i].weight||(t[i].weight=0),t[i].isError=!1,t[i].scheme=r.scheme.toUpperCase();}return t},keepAliveInterval:function(t){var i;if(e.Utils.isDecimal(t)&&(i=Number(t))>0)return i},keepAliveDebounce:function(t){var i;if(e.Utils.isDecimal(t)&&(i=Number(t))>0)return i},traceSip:function(e){if("boolean"==typeof e)return e},connectionTimeout:function(t){var i;if(e.Utils.isDecimal(t)&&(i=Number(t))>0)return i},maxReconnectionAttempts:function(t){var i;if(e.Utils.isDecimal(t)&&(i=Number(t))>=0)return i},reconnectionTimeout:function(t){var i;if(e.Utils.isDecimal(t)&&(i=Number(t))>0)return i}}}}}}),i.C=s,e.Web.Transport=i,i};}).call(this,i(0));},function(e,t,i){(function(t){var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};e.exports=function(e,r){var n,o={STATUS_INIT:0,STATUS_STARTING:1,STATUS_READY:2,STATUS_USER_CLOSED:3,STATUS_NOT_READY:4,CONFIGURATION_ERROR:1,NETWORK_ERROR:2,ALLOWED_METHODS:["ACK","CANCEL","INVITE","MESSAGE","BYE","OPTIONS","INFO","NOTIFY","REFER"],ACCEPTED_BODY_TYPES:["application/sdp","application/dtmf-relay"],MAX_FORWARDS:70,TAG_LENGTH:10};function a(t){if(t instanceof Function)return t.initialize||(t.initialize=function(){return e.Utils.Promise.resolve()}),t}((n=function(t){var i=this;function s(e){return i.emit.bind(i,e)}o.ACCEPTED_BODY_TYPES=o.ACCEPTED_BODY_TYPES.toString(),this.log=new e.LoggerFactory,this.logger=this.getLogger("sip.ua"),this.cache={credentials:{}},this.configuration={},this.dialogs={},this.applicants={},this.data={},this.sessions={},this.subscriptions={},this.earlySubscriptions={},this.publishers={},this.transport=null,this.contact=null,this.status=o.STATUS_INIT,this.error=null,this.transactions={nist:{},nict:{},ist:{},ict:{}},Object.defineProperties(this,{transactionsCount:{get:function(){var e,t=["nist","nict","ist","ict"],i=0;for(e in t)i+=Object.keys(this.transactions[t[e]]).length;return i}},nictTransactionsCount:{get:function(){return Object.keys(this.transactions.nict).length}},nistTransactionsCount:{get:function(){return Object.keys(this.transactions.nist).length}},ictTransactionsCount:{get:function(){return Object.keys(this.transactions.ict).length}},istTransactionsCount:{get:function(){return Object.keys(this.transactions.ist).length}}}),void 0===t?t={}:("string"==typeof t||t instanceof String)&&(t={uri:t}),t.log&&(t.log.hasOwnProperty("builtinEnabled")&&(this.log.builtinEnabled=t.log.builtinEnabled),t.log.hasOwnProperty("level")&&(this.log.level=t.log.level),t.log.hasOwnProperty("connector")&&(this.log.connector=t.log.connector));try{this.loadConfig(t);}catch(e){throw this.status=o.STATUS_NOT_READY,this.error=o.CONFIGURATION_ERROR,e}this.registerContext=new e.RegisterContext(this),this.registerContext.on("failed",s("registrationFailed")),this.registerContext.on("registered",s("registered")),this.registerContext.on("unregistered",s("unregistered")),this.configuration.autostart&&this.start();}).prototype=Object.create(e.EventEmitter.prototype)).register=function(e){return this.configuration.register=!0,this.registerContext.register(e),this},n.prototype.unregister=function(e){this.configuration.register=!1;var t=this.registerContext;return this.transport.afterConnected(t.unregister.bind(t,e)),this},n.prototype.isRegistered=function(){return this.registerContext.registered},n.prototype.invite=function(t,i,s){var r=new e.InviteClientContext(this,t,i,s);return this.transport.afterConnected(function(){r.invite(),this.emit("inviteSent",r);}.bind(this)),r},n.prototype.subscribe=function(t,i,s){var r=new e.Subscription(this,t,i,s);return this.transport.afterConnected(r.subscribe.bind(r)),r},n.prototype.publish=function(t,i,s,r){var n=new e.PublishContext(this,t,i,r);return this.transport.afterConnected(n.publish.bind(n,s)),n},n.prototype.message=function(t,i,s){if(void 0===i)throw new TypeError("Not enough arguments");return (s=Object.create(s||Object.prototype)).contentType||(s.contentType="text/plain"),s.body=i,this.request(e.C.MESSAGE,t,s)},n.prototype.request=function(t,i,s){var r=new e.ClientContext(this,t,i,s);return this.transport.afterConnected(r.send.bind(r)),r},n.prototype.stop=function(){var e,i,s,n,a=this;if(this.logger.log("user requested closure..."),this.status===o.STATUS_USER_CLOSED)return this.logger.warn("UA already closed"),this;for(e in this.logger.log("closing registerContext"),this.registerContext.close(),this.sessions)this.logger.log("closing session "+e),this.sessions[e].terminate();for(i in this.subscriptions)this.logger.log("unsubscribing from subscription "+i),this.subscriptions[i].close();for(i in this.earlySubscriptions)this.logger.log("unsubscribing from early subscription "+i),this.earlySubscriptions[i].close();for(n in this.publishers)this.logger.log("unpublish "+n),this.publishers[n].close();for(s in this.applicants)this.applicants[s].close();return this.status=o.STATUS_USER_CLOSED,0===this.nistTransactionsCount&&0===this.nictTransactionsCount?this.transport.disconnect():this.on("transactionDestroyed",function e(){0===a.nistTransactionsCount&&0===a.nictTransactionsCount&&(a.removeListener("transactionDestroyed",e),a.transport.disconnect());}),"function"==typeof r.removeEventListener&&(t.chrome&&t.chrome.app&&t.chrome.app.runtime||r.removeEventListener("unload",this.environListener)),this},n.prototype.start=function(){if(this.logger.log("user requested startup..."),this.status===o.STATUS_INIT){if(this.status=o.STATUS_STARTING,!this.configuration.transportConstructor)throw new e.Exceptions.TransportError("Transport constructor not set");this.transport=new this.configuration.transportConstructor(this.getLogger("sip.transport"),this.configuration.transportOptions),this.setTransportListeners(),this.emit("transportCreated",this.transport),this.transport.connect();}else this.status===o.STATUS_USER_CLOSED?(this.logger.log("resuming"),this.status=o.STATUS_READY,this.transport.connect()):this.status===o.STATUS_STARTING?this.logger.log("UA is in STARTING status, not opening new connection"):this.status===o.STATUS_READY?this.logger.log("UA is in READY status, not resuming"):this.logger.error("Connection is down. Auto-Recovery system is trying to connect");return this.configuration.autostop&&"function"==typeof r.addEventListener&&(t.chrome&&t.chrome.app&&t.chrome.app.runtime||(this.environListener=this.stop.bind(this),r.addEventListener("unload",this.environListener))),this},n.prototype.normalizeTarget=function(t){return e.Utils.normalizeTarget(t,this.configuration.hostportParams)},n.prototype.saveCredentials=function(e){return this.cache.credentials[e.realm]=this.cache.credentials[e.realm]||{},this.cache.credentials[e.realm][e.uri]=e,this},n.prototype.getCredentials=function(e){var t,i;return t=e.ruri.host,this.cache.credentials[t]&&this.cache.credentials[t][e.ruri]&&((i=this.cache.credentials[t][e.ruri]).method=e.method),i},n.prototype.getLogger=function(e,t){return this.log.getLogger(e,t)},n.prototype.onTransportError=function(){this.status!==o.STATUS_USER_CLOSED&&(this.error&&this.error===o.NETWORK_ERROR||(this.status=o.STATUS_NOT_READY,this.error=o.NETWORK_ERROR));},n.prototype.setTransportListeners=function(){this.transport.on("connected",this.onTransportConnected.bind(this)),this.transport.on("message",this.onTransportReceiveMsg.bind(this)),this.transport.on("transportError",this.onTransportError.bind(this));},n.prototype.onTransportConnected=function(){this.configuration.register&&this.configuration.authenticationFactory.initialize().then(function(){this.registerContext.onTransportConnected();}.bind(this));},n.prototype.onTransportReceiveMsg=function(t){var i;if(t=e.Parser.parseMessage(t,this),this.status===e.UA.C.STATUS_USER_CLOSED&&t instanceof e.IncomingRequest)this.logger.warn("UA received message when status = USER_CLOSED - aborting");else if(e.sanityCheck(t,this,this.transport))if(t instanceof e.IncomingRequest)t.transport=this.transport,this.receiveRequest(t);else if(t instanceof e.IncomingResponse)switch(t.method){case e.C.INVITE:(i=this.transactions.ict[t.via_branch])&&i.receiveResponse(t);break;case e.C.ACK:break;default:(i=this.transactions.nict[t.via_branch])&&i.receiveResponse(t);}},n.prototype.newTransaction=function(e){this.transactions[e.type][e.id]=e,this.emit("newTransaction",{transaction:e});},n.prototype.destroyTransaction=function(e){delete this.transactions[e.type][e.id],this.emit("transactionDestroyed",{transaction:e});},n.prototype.receiveRequest=function(t){var i,s,r,n,a,c,h=t.method;function u(e){return e&&e.user===t.ruri.user}if(!(u(this.configuration.uri)||u(this.contact.uri)||u(this.contact.pub_gruu)||u(this.contact.temp_gruu)))return this.logger.warn("Request-URI does not point to us"),void(t.method!==e.C.ACK&&t.reply_sl(404));if(t.ruri.scheme!==e.C.SIPS){if(!e.Transactions.checkTransaction(this,t))if(h===e.C.OPTIONS?(new e.Transactions.NonInviteServerTransaction(t,this),t.reply(200,null,["Allow: "+e.UA.C.ALLOWED_METHODS.toString(),"Accept: "+o.ACCEPTED_BODY_TYPES])):h===e.C.MESSAGE?((r=new e.ServerContext(this,t)).body=t.body,r.content_type=t.getHeader("Content-Type")||"text/plain",t.reply(200,null),this.emit("message",r)):h!==e.C.INVITE&&h!==e.C.ACK&&new e.ServerContext(this,t),t.to_tag)(i=this.findDialog(t))?(h===e.C.INVITE&&new e.Transactions.InviteServerTransaction(t,this),i.receiveRequest(t)):h===e.C.NOTIFY?(s=this.findSession(t),n=this.findEarlySubscription(t),s?s.receiveRequest(t):n?n.receiveRequest(t):(this.logger.warn("received NOTIFY request for a non existent session or subscription"),t.reply(481,"Subscription does not exist"))):h!==e.C.ACK&&t.reply(481);else switch(h){case e.C.INVITE:if(a=this.configuration.replaces!==e.C.supported.UNSUPPORTED&&t.parseHeader("replaces")){if(!(c=this.dialogs[a.call_id+a.replaces_to_tag+a.replaces_from_tag]))return void t.reply_sl(481,null);if(c.owner.status===e.Session.C.STATUS_TERMINATED)return void t.reply_sl(603,null);if(c.state===e.Dialog.C.STATUS_CONFIRMED&&a.early_only)return void t.reply_sl(486,null)}(s=new e.InviteServerContext(this,t)).replacee=c&&c.owner,this.emit("invite",s);break;case e.C.BYE:t.reply(481);break;case e.C.CANCEL:(s=this.findSession(t))?s.receiveRequest(t):this.logger.warn("received CANCEL request for a non existent session");break;case e.C.ACK:break;case e.C.NOTIFY:this.configuration.allowLegacyNotifications&&this.listeners("notify").length>0?(t.reply(200,null),this.emit("notify",{request:t})):t.reply(481,"Subscription does not exist");break;case e.C.REFER:if(this.logger.log("Received an out of dialog refer"),this.configuration.allowOutOfDialogRefers){this.logger.log("Allow out of dialog refers is enabled on the UA");var l=new e.ReferServerContext(this,t);this.listeners("outOfDialogReferRequested").length?this.emit("outOfDialogReferRequested",l):(this.logger.log("No outOfDialogReferRequest listeners, automatically accepting and following the out of dialog refer"),l.accept({followRefer:!0}));break}t.reply(405);break;default:t.reply(405);}}else t.reply_sl(416);},n.prototype.findSession=function(e){return this.sessions[e.call_id+e.from_tag]||this.sessions[e.call_id+e.to_tag]||null},n.prototype.findDialog=function(e){return this.dialogs[e.call_id+e.from_tag+e.to_tag]||this.dialogs[e.call_id+e.to_tag+e.from_tag]||null},n.prototype.findEarlySubscription=function(e){return this.earlySubscriptions[e.call_id+e.to_tag+e.getHeader("event")]||null},n.prototype.loadConfig=function(t){var s,r,n,o,c,h={viaHost:e.Utils.createRandomToken(12)+".invalid",uri:new e.URI("sip","anonymous."+e.Utils.createRandomToken(6),"anonymous.invalid",null,null),custom:{},displayName:"",password:null,registerExpires:600,register:!0,registrarServer:null,transportConstructor:i(13)(e),transportOptions:{},userAgentString:e.C.USER_AGENT,noAnswerTimeout:60,hackViaTcp:!1,hackIpInContact:!1,hackWssInTransport:!1,hackAllowUnregisteredOptionTags:!1,sessionDescriptionHandlerFactoryOptions:{constraints:{},peerConnectionOptions:{}},contactName:e.Utils.createRandomToken(8),contactTransport:"ws",forceRport:!1,autostart:!0,autostop:!0,rel100:e.C.supported.UNSUPPORTED,dtmfType:e.C.dtmfType.INFO,replaces:e.C.supported.UNSUPPORTED,sessionDescriptionHandlerFactory:i(12)(e).defaultFactory,authenticationFactory:a(function(t){return new e.DigestAuthentication(t)}),allowLegacyNotifications:!1,allowOutOfDialogRefers:!1};function u(e,i){var s=e.replace(/([a-z][A-Z])/g,function(e){return e[0]+"_"+e[1].toLowerCase()});if(e!==s){var r=t.hasOwnProperty(e);t.hasOwnProperty(s)&&(i.warn(s+" is deprecated, please use "+e),r&&i.warn(e+" overriding "+s)),t[e]=r?t[e]:t[s];}}var l=this.getConfigurationCheck();for(s in l.mandatory){if(u(s,this.logger),!t.hasOwnProperty(s))throw new e.Exceptions.ConfigurationError(s);if(r=t[s],void 0===(n=l.mandatory[s](r)))throw new e.Exceptions.ConfigurationError(s,r);h[s]=n;}for(s in l.optional)if(u(s,this.logger),t.hasOwnProperty(s)){if((r=t[s])instanceof Array&&0===r.length)continue;if(null===r||""===r||void 0===r)continue;if("number"==typeof r&&isNaN(r))continue;if(void 0===(n=l.optional[s](r)))throw new e.Exceptions.ConfigurationError(s,r);h[s]=n;}0===h.displayName&&(h.displayName="0"),h.instanceId||(h.instanceId=e.Utils.newUUID()),h.sipjsId=e.Utils.createRandomToken(5),(o=h.uri.clone()).user=null,h.hostportParams=o.toRaw().replace(/^sip:/i,""),h.authorizationUser||(h.authorizationUser=h.uri.user),h.registrarServer||((c=h.uri.clone()).user=null,h.registrarServer=c),h.noAnswerTimeout=1e3*h.noAnswerTimeout,h.hackIpInContact&&("boolean"==typeof h.hackIpInContact?h.viaHost=e.Utils.getRandomTestNetIP():"string"==typeof h.hackIpInContact&&(h.viaHost=h.hackIpInContact)),h.hackWssInTransport&&(h.contactTransport="wss"),this.contact={pub_gruu:null,temp_gruu:null,uri:new e.URI("sip",h.contactName,h.viaHost,null,{transport:h.contactTransport}),toString:function(e){var t=(e=e||{}).anonymous||null,i=e.outbound||null,s="<";return s+=t?(this.temp_gruu||"sip:anonymous@anonymous.invalid;transport="+h.contactTransport).toString():(this.pub_gruu||this.uri).toString(),i&&(s+=";ob"),s+=">"}};var d={};for(s in h)d[s]=h[s];for(s in Object.assign(this.configuration,d),this.logger.log("configuration parameters after validation:"),h)switch(s){case"uri":case"registrarServer":case"sessionDescriptionHandlerFactory":this.logger.log("\xb7 "+s+": "+h[s]);break;case"password":this.logger.log("\xb7 "+s+": NOT SHOWN");break;case"transportConstructor":this.logger.log("\xb7 "+s+": "+h[s].name);break;default:this.logger.log("\xb7 "+s+": "+JSON.stringify(h[s]));}},n.prototype.getConfigurationCheck=function(){return {mandatory:{},optional:{uri:function(t){var i;return /^sip:/i.test(t)||(t=e.C.SIP+":"+t),(i=e.URI.parse(t))&&i.user?i:void 0},transportConstructor:function(e){if((void 0===e?"undefined":s(e))===Function)return e},transportOptions:function(e){if("object"===(void 0===e?"undefined":s(e)))return e},authorizationUser:function(t){return -1===e.Grammar.parse('"'+t+'"',"quoted_string")?void 0:t},displayName:function(t){return -1===e.Grammar.parse('"'+t+'"',"displayName")?void 0:t},dtmfType:function(t){switch(t){case e.C.dtmfType.RTP:return e.C.dtmfType.RTP;case e.C.dtmfType.INFO:default:return e.C.dtmfType.INFO}},hackViaTcp:function(e){if("boolean"==typeof e)return e},hackIpInContact:function(t){return "boolean"==typeof t?t:"string"==typeof t&&-1!==e.Grammar.parse(t,"host")?t:void 0},hackWssInTransport:function(e){if("boolean"==typeof e)return e},hackAllowUnregisteredOptionTags:function(e){if("boolean"==typeof e)return e},contactTransport:function(e){if("string"==typeof e)return e},forceRport:function(e){if("boolean"==typeof e)return e},instanceId:function(t){if("string"==typeof t)return /^uuid:/i.test(t)&&(t=t.substr(5)),-1===e.Grammar.parse(t,"uuid")?void 0:t},noAnswerTimeout:function(t){var i;if(e.Utils.isDecimal(t)&&(i=Number(t))>0)return i},password:function(e){return String(e)},rel100:function(t){return t===e.C.supported.REQUIRED?e.C.supported.REQUIRED:t===e.C.supported.SUPPORTED?e.C.supported.SUPPORTED:e.C.supported.UNSUPPORTED},replaces:function(t){return t===e.C.supported.REQUIRED?e.C.supported.REQUIRED:t===e.C.supported.SUPPORTED?e.C.supported.SUPPORTED:e.C.supported.UNSUPPORTED},register:function(e){if("boolean"==typeof e)return e},registerExpires:function(t){var i;if(e.Utils.isDecimal(t)&&(i=Number(t))>0)return i},registrarServer:function(t){var i;if("string"==typeof t)return /^sip:/i.test(t)||(t=e.C.SIP+":"+t),(i=e.URI.parse(t))?i.user?void 0:i:void 0},userAgentString:function(e){if("string"==typeof e)return e},autostart:function(e){if("boolean"==typeof e)return e},autostop:function(e){if("boolean"==typeof e)return e},sessionDescriptionHandlerFactory:function(e){if(e instanceof Function)return e},sessionDescriptionHandlerFactoryOptions:function(e){if("object"===(void 0===e?"undefined":s(e)))return e},authenticationFactory:a,allowLegacyNotifications:function(e){if("boolean"==typeof e)return e},custom:function(e){if("object"===(void 0===e?"undefined":s(e)))return e},contactName:function(e){if("string"==typeof e)return e}}}},n.C=o,e.UA=n;};}).call(this,i(0));},function(e,t,i){e.exports=function(e){var t;((t=function(t,i,s,r){if(this.options=r=r||{},this.options.extraHeaders=(r.extraHeaders||[]).slice(),this.options.contentType=r.contentType||"text/plain","number"!=typeof r.expires||r.expires%1!=0?this.options.expires=3600:this.options.expires=Number(r.expires),"boolean"!=typeof r.unpublishOnClose?this.options.unpublishOnClose=!0:this.options.unpublishOnClose=r.unpublishOnClose,void 0===i||null===i||""===i)throw new e.Exceptions.MethodParameterError("Publish","Target",i);if(this.target=t.normalizeTarget(i),void 0===s||null===s||""===s)throw new e.Exceptions.MethodParameterError("Publish","Event",s);this.event=s,e.ClientContext.call(this,t,e.C.PUBLISH,this.target,this.options),this.logger=this.ua.getLogger("sip.publish"),this.pubRequestBody=null,this.pubRequestExpires=this.options.expires,this.pubRequestEtag=null,this.publish_refresh_timer=null,t.on("transportCreated",function(e){e.on("transportError",this.onTransportError.bind(this));}.bind(this));}).prototype=Object.create(e.ClientContext.prototype)).constructor=t,t.prototype.publish=function(t){if(this.request=null,e.Timers.clearTimeout(this.publish_refresh_timer),void 0!==t&&null!==t&&""!==t)this.options.body=t,this.pubRequestBody=this.options.body,0===this.pubRequestExpires&&(this.pubRequestExpires=this.options.expires,this.pubRequestEtag=null),this.ua.publishers[this.target.toString()+":"+this.event]||(this.ua.publishers[this.target.toString()+":"+this.event]=this);else{if(this.pubRequestBody=null,null===this.pubRequestEtag)throw new e.Exceptions.MethodParameterError("Publish","Body",t);if(0===this.pubRequestExpires)throw new e.Exceptions.MethodParameterError("Publish","Expire",this.pubRequestExpires)}this.sendPublishRequest();},t.prototype.unpublish=function(){this.request=null,e.Timers.clearTimeout(this.publish_refresh_timer),this.pubRequestBody=null,this.pubRequestExpires=0,null!==this.pubRequestEtag&&this.sendPublishRequest();},t.prototype.close=function(){this.options.unpublishOnClose?this.unpublish():(this.request=null,e.Timers.clearTimeout(this.publish_refresh_timer),this.pubRequestBody=null,this.pubRequestExpires=0,this.pubRequestEtag=null),this.ua.publishers[this.target.toString()+":"+this.event]&&delete this.ua.publishers[this.target.toString()+":"+this.event];},t.prototype.sendPublishRequest=function(){var t;(t=Object.create(this.options||Object.prototype)).extraHeaders=(this.options.extraHeaders||[]).slice(),t.extraHeaders.push("Event: "+this.event),t.extraHeaders.push("Expires: "+this.pubRequestExpires),null!==this.pubRequestEtag&&t.extraHeaders.push("SIP-If-Match: "+this.pubRequestEtag),this.request=new e.OutgoingRequest(e.C.PUBLISH,this.target,this.ua,this.options.params,t.extraHeaders),null!==this.pubRequestBody&&(this.request.body={},this.request.body.body=this.pubRequestBody,this.request.body.contentType=this.options.contentType),this.send();},t.prototype.receiveResponse=function(t){var i,s,r=e.Utils.getReasonPhrase(t.status_code);switch(!0){case/^1[0-9]{2}$/.test(t.status_code):this.emit("progress",t,r);break;case/^2[0-9]{2}$/.test(t.status_code):t.hasHeader("SIP-ETag")?this.pubRequestEtag=t.getHeader("SIP-ETag"):this.logger.warn("SIP-ETag header missing in a 200-class response to PUBLISH"),t.hasHeader("Expires")?"number"==typeof(i=Number(t.getHeader("Expires")))&&i>=0&&i<=this.pubRequestExpires?this.pubRequestExpires=i:this.logger.warn("Bad Expires header in a 200-class response to PUBLISH"):this.logger.warn("Expires header missing in a 200-class response to PUBLISH"),0!==this.pubRequestExpires?(this.publish_refresh_timer=e.Timers.setTimeout(this.publish.bind(this),900*this.pubRequestExpires),this.emit("published",t,r)):this.emit("unpublished",t,r);break;case/^412$/.test(t.status_code):null!==this.pubRequestEtag&&0!==this.pubRequestExpires?(this.logger.warn("412 response to PUBLISH, recovering"),this.pubRequestEtag=null,this.emit("progress",t,r),this.publish(this.options.body)):(this.logger.warn("412 response to PUBLISH, recovery failed"),this.pubRequestExpires=0,this.emit("failed",t,r),this.emit("unpublished",t,r));break;case/^423$/.test(t.status_code):0!==this.pubRequestExpires&&t.hasHeader("Min-Expires")?"number"==typeof(s=Number(t.getHeader("Min-Expires")))||s>this.pubRequestExpires?(this.logger.warn("423 code in response to PUBLISH, adjusting the Expires value and trying to recover"),this.pubRequestExpires=s,this.emit("progress",t,r),this.publish(this.options.body)):(this.logger.warn("Bad 423 response Min-Expires header received for PUBLISH"),this.pubRequestExpires=0,this.emit("failed",t,r),this.emit("unpublished",t,r)):(this.logger.warn("423 response to PUBLISH, recovery failed"),this.pubRequestExpires=0,this.emit("failed",t,r),this.emit("unpublished",t,r));break;default:this.pubRequestExpires=0,this.emit("failed",t,r),this.emit("unpublished",t,r);}0===this.pubRequestExpires&&(e.Timers.clearTimeout(this.publish_refresh_timer),this.pubRequestBody=null,this.pubRequestEtag=null);},t.prototype.onRequestTimeout=function(){e.ClientContext.prototype.onRequestTimeout.call(this),this.emit("unpublished",null,e.C.causes.REQUEST_TIMEOUT);},t.prototype.onTransportError=function(){e.ClientContext.prototype.onTransportError.call(this),this.emit("unpublished",null,e.C.causes.CONNECTION_ERROR);},e.PublishContext=t;};},function(e,t,i){e.exports=function(e){e.Subscription=function(t,i,s,r){if(r=Object.create(r||Object.prototype),this.extraHeaders=r.extraHeaders=(r.extraHeaders||[]).slice(),this.id=null,this.state="init",!s)throw new TypeError("Event necessary to create a subscription.");this.event=s,"number"!=typeof r.expires?(t.logger.warn("expires must be a number. Using default of 3600."),this.expires=3600):this.expires=r.expires,this.requestedExpires=this.expires,r.extraHeaders.push("Event: "+this.event),r.extraHeaders.push("Expires: "+this.expires),r.body&&(this.body=r.body),this.contact=t.contact.toString(),r.extraHeaders.push("Contact: "+this.contact),r.extraHeaders.push("Allow: "+e.UA.C.ALLOWED_METHODS.toString()),e.Utils.augment(this,e.ClientContext,[t,e.C.SUBSCRIBE,i,r]),this.logger=t.getLogger("sip.subscription"),this.dialog=null,this.timers={N:null,sub_duration:null},this.errorCodes=[404,405,410,416,480,481,482,483,484,485,489,501,604];},e.Subscription.prototype={subscribe:function(){return "active"===this.state?(this.refresh(),this):"notify_wait"===this.state?this:(e.Timers.clearTimeout(this.timers.sub_duration),e.Timers.clearTimeout(this.timers.N),this.timers.N=e.Timers.setTimeout(this.timer_fire.bind(this),e.Timers.TIMER_N),this.ua.earlySubscriptions[this.request.call_id+this.request.from.parameters.tag+this.event]=this,this.send(),this.state="notify_wait",this)},refresh:function(){"terminated"!==this.state&&"pending"!==this.state&&"notify_wait"!==this.state&&this.dialog.sendRequest(this,e.C.SUBSCRIBE,{extraHeaders:this.extraHeaders,body:this.body});},receiveResponse:function(t){var i,s=e.Utils.getReasonPhrase(t.status_code);"notify_wait"===this.state&&t.status_code>=300||"notify_wait"!==this.state&&-1!==this.errorCodes.indexOf(t.status_code)?this.failed(t,null):/^2[0-9]{2}$/.test(t.status_code)?(this.emit("accepted",t,s),(i=t.getHeader("Expires"))&&i<=this.requestedExpires?(this.expires=i,this.timers.sub_duration=e.Timers.setTimeout(this.refresh.bind(this),900*i)):i?(this.logger.warn("Expires header in a 200-class response to SUBSCRIBE with a higher value than the one in the request"),this.failed(t,e.C.INVALID_EXPIRES_HEADER)):(this.logger.warn("Expires header missing in a 200-class response to SUBSCRIBE"),this.failed(t,e.C.EXPIRES_HEADER_MISSING))):t.statusCode>300&&(this.emit("failed",t,s),this.emit("rejected",t,s));},unsubscribe:function(){var t=[];this.state="terminated",t.push("Event: "+this.event),t.push("Expires: 0"),t.push("Contact: "+this.contact),t.push("Allow: "+e.UA.C.ALLOWED_METHODS.toString()),this.receiveResponse=function(){},this.dialog.sendRequest(this,this.method,{extraHeaders:t,body:this.body}),e.Timers.clearTimeout(this.timers.sub_duration),e.Timers.clearTimeout(this.timers.N),this.timers.N=e.Timers.setTimeout(this.timer_fire.bind(this),e.Timers.TIMER_N);},timer_fire:function(){"terminated"===this.state?(this.terminateDialog(),e.Timers.clearTimeout(this.timers.N),e.Timers.clearTimeout(this.timers.sub_duration),delete this.ua.subscriptions[this.id]):"notify_wait"===this.state||"pending"===this.state?this.close():this.refresh();},close:function(){"notify_wait"===this.state?(this.state="terminated",e.Timers.clearTimeout(this.timers.N),e.Timers.clearTimeout(this.timers.sub_duration),this.receiveResponse=function(){},delete this.ua.earlySubscriptions[this.request.call_id+this.request.from.parameters.tag+this.event]):"terminated"!==this.state&&this.unsubscribe();},createConfirmedDialog:function(t,i){var s;return this.terminateDialog(),(s=new e.Dialog(this,t,i)).invite_seqnum=this.request.cseq,s.local_seqnum=this.request.cseq,!s.error&&(this.dialog=s,!0)},terminateDialog:function(){this.dialog&&(delete this.ua.subscriptions[this.id],this.dialog.terminate(),delete this.dialog);},receiveRequest:function(t){var i,s=this;function r(){i.expires&&(e.Timers.clearTimeout(s.timers.sub_duration),i.expires=Math.min(s.expires,Math.max(i.expires,0)),s.timers.sub_duration=e.Timers.setTimeout(s.refresh.bind(s),900*i.expires));}if(this.matchEvent(t))if(this.dialog||this.createConfirmedDialog(t,"UAS")&&(this.id=this.dialog.id.toString(),delete this.ua.earlySubscriptions[this.request.call_id+this.request.from.parameters.tag+this.event],this.ua.subscriptions[this.id]=this),i=t.parseHeader("Subscription-State"),t.reply(200,e.C.REASON_200),e.Timers.clearTimeout(this.timers.N),this.emit("notify",{request:t}),"terminated"!==this.state)switch(i.state){case"active":this.state="active",r();break;case"pending":"notify_wait"===this.state&&r(),this.state="pending";break;case"terminated":if(e.Timers.clearTimeout(this.timers.sub_duration),i.reason)switch(this.logger.log("terminating subscription with reason "+i.reason),i.reason){case"deactivated":case"timeout":return void this.subscribe();case"probation":case"giveup":return void(i.params&&i.params["retry-after"]?this.timers.sub_duration=e.Timers.setTimeout(s.subscribe.bind(s),i.params["retry-after"]):this.subscribe())}this.close();}else"terminated"===i.state&&(this.terminateDialog(),e.Timers.clearTimeout(this.timers.N),e.Timers.clearTimeout(this.timers.sub_duration),delete this.ua.subscriptions[this.id]);else t.reply(489);},failed:function(e,t){return this.close(),this.emit("failed",e,t),this.emit("rejected",e,t),this},onDialogError:function(t){this.failed(t,e.C.causes.DIALOG_ERROR);},matchEvent:function(e){var t;return e.hasHeader("Event")?e.hasHeader("Subscription-State")?(t=e.parseHeader("event").event,this.event===t||(this.logger.warn("event match failed"),e.reply(481,"Event Match Failed"),!1)):(this.logger.warn("missing Subscription-State header"),!1):(this.logger.warn("missing Event header"),!1)}};};},function(e,t,i){e.exports=function(e){var t;return (t=function(i,s,r){var n,o;if(void 0===s)throw new TypeError("Not enough arguments");if(this.logger=i.ua.getLogger("sip.invitecontext.dtmf",i.id),this.owner=i,this.direction=null,n=(r=r||{}).duration||null,o=r.interToneGap||null,"string"==typeof s)s=s.toUpperCase();else{if("number"!=typeof s)throw new TypeError("Invalid tone: "+s);s=s.toString();}if(!s.match(/^[0-9A-D#*]$/))throw new TypeError("Invalid tone: "+s);if(this.tone=s,n&&!e.Utils.isDecimal(n))throw new TypeError("Invalid tone duration: "+n);if(n?n<t.C.MIN_DURATION?(this.logger.warn('"duration" value is lower than the minimum allowed, setting it to '+t.C.MIN_DURATION+" milliseconds"),n=t.C.MIN_DURATION):n>t.C.MAX_DURATION?(this.logger.warn('"duration" value is greater than the maximum allowed, setting it to '+t.C.MAX_DURATION+" milliseconds"),n=t.C.MAX_DURATION):n=Math.abs(n):n=t.C.DEFAULT_DURATION,this.duration=n,o&&!e.Utils.isDecimal(o))throw new TypeError("Invalid interToneGap: "+o);o?o<t.C.MIN_INTER_TONE_GAP?(this.logger.warn('"interToneGap" value is lower than the minimum allowed, setting it to '+t.C.MIN_INTER_TONE_GAP+" milliseconds"),o=t.C.MIN_INTER_TONE_GAP):o=Math.abs(o):o=t.C.DEFAULT_INTER_TONE_GAP,this.interToneGap=o;}).prototype=Object.create(e.EventEmitter.prototype),t.prototype.send=function(t){var i,s={};if(this.direction="outgoing",this.owner.status!==e.Session.C.STATUS_CONFIRMED&&this.owner.status!==e.Session.C.STATUS_WAITING_FOR_ACK)throw new e.Exceptions.InvalidStateError(this.owner.status);i=(t=t||{}).extraHeaders?t.extraHeaders.slice():[],s.contentType="application/dtmf-relay",s.body="Signal= "+this.tone+"\r\n",s.body+="Duration= "+this.duration,this.request=this.owner.dialog.sendRequest(this,e.C.INFO,{extraHeaders:i,body:s}),this.owner.emit("dtmf",this.request,this);},t.prototype.receiveResponse=function(t){var i;switch(!0){case/^1[0-9]{2}$/.test(t.status_code):break;case/^2[0-9]{2}$/.test(t.status_code):this.emit("succeeded",{originator:"remote",response:t});break;default:i=e.Utils.sipErrorCause(t.status_code),this.emit("failed",t,i);}},t.prototype.onRequestTimeout=function(){this.emit("failed",null,e.C.causes.REQUEST_TIMEOUT),this.owner.onRequestTimeout();},t.prototype.onTransportError=function(){this.emit("failed",null,e.C.causes.CONNECTION_ERROR),this.owner.onTransportError();},t.prototype.onDialogError=function(t){this.emit("failed",t,e.C.causes.DIALOG_ERROR),this.owner.onDialogError(t);},t.prototype.init_incoming=function(e){this.direction="incoming",this.request=e,e.reply(200),this.tone&&this.duration?this.owner.emit("dtmf",e,this):this.logger.warn("invalid INFO DTMF received, discarded");},t.C={MIN_DURATION:70,MAX_DURATION:6e3,DEFAULT_DURATION:100,MIN_INTER_TONE_GAP:50,DEFAULT_INTER_TONE_GAP:500},t};},function(e,t,i){e.exports=function(e){var t,s,r,n,o,a=i(17)(e),c={STATUS_NULL:0,STATUS_INVITE_SENT:1,STATUS_1XX_RECEIVED:2,STATUS_INVITE_RECEIVED:3,STATUS_WAITING_FOR_ANSWER:4,STATUS_ANSWERED:5,STATUS_WAITING_FOR_PRACK:6,STATUS_WAITING_FOR_ACK:7,STATUS_CANCELED:8,STATUS_TERMINATED:9,STATUS_ANSWERED_WAITING_FOR_PRACK:10,STATUS_EARLY_MEDIA:11,STATUS_CONFIRMED:12};(t=function(t){if(this.status=c.STATUS_NULL,this.dialog=null,this.pendingReinvite=!1,this.earlyDialogs={},!t)throw new e.Exceptions.SessionDescriptionHandlerMissing("A session description handler is required for the session to function");this.sessionDescriptionHandlerFactory=t,this.hasOffer=!1,this.hasAnswer=!1,this.timers={ackTimer:null,expiresTimer:null,invite2xxTimer:null,userNoAnswerTimer:null,rel1xxTimer:null,prackTimer:null},this.startTime=null,this.endTime=null,this.tones=null,this.local_hold=!1,this.early_sdp=null,this.rel100=e.C.supported.UNSUPPORTED;}).prototype={dtmf:function(t,i){var s=[],r=this,n=this.ua.configuration.dtmfType;if(i=i||{},void 0===t)throw new TypeError("Not enough arguments");if(this.status!==c.STATUS_CONFIRMED&&this.status!==c.STATUS_WAITING_FOR_ACK)throw new e.Exceptions.InvalidStateError(this.status);if("string"!=typeof t&&"number"!=typeof t||!t.toString().match(/^[0-9A-D#*,]+$/i))throw new TypeError("Invalid tones: "+t);(t=t.toString(),n===e.C.dtmfType.RTP)&&(this.sessionDescriptionHandler.sendDtmf(t,i)||(this.logger.warn("Attempt to use dtmfType 'RTP' has failed, falling back to INFO packet method"),n=e.C.dtmfType.INFO));if(n===e.C.dtmfType.INFO){for(t=t.split("");t.length>0;)s.push(new a(this,t.shift(),i));if(this.tones)return this.tones=this.tones.concat(s),this;this.tones=s,function t(){var s,n;if(r.status===c.STATUS_TERMINATED||!r.tones||0===r.tones.length)return r.tones=null,this;(s=r.tones.shift()).on("failed",function(){r.tones=null;}),s.send(i),n=s.duration+s.interToneGap,e.Timers.setTimeout(t,n);}();}return this},bye:function(t){var i=(t=Object.create(t||Object.prototype)).statusCode;if(this.status===c.STATUS_TERMINATED)return this.logger.error("Error: Attempted to send BYE in a terminated session."),this;if(this.logger.log("terminating Session"),i&&(i<200||i>=700))throw new TypeError("Invalid statusCode: "+i);return t.receiveResponse=function(){},this.sendRequest(e.C.BYE,t).terminated()},refer:function(t,i){if(i=i||{},this.status!==c.STATUS_CONFIRMED)throw new e.Exceptions.InvalidStateError(this.status);this.referContext=new e.ReferClientContext(this.ua,this,t,i),this.emit("referRequested",this.referContext),this.referContext.refer(i);},sendRequest:function(t,i){i=i||{};var s=this,r=new e.OutgoingRequest(t,this.dialog.remote_target,this.ua,{cseq:i.cseq||(this.dialog.local_seqnum+=1),call_id:this.dialog.id.call_id,from_uri:this.dialog.local_uri,from_tag:this.dialog.id.local_tag,to_uri:this.dialog.remote_uri,to_tag:this.dialog.id.remote_tag,route_set:this.dialog.route_set,statusCode:i.statusCode,reasonPhrase:i.reasonPhrase},i.extraHeaders||[],i.body);return new e.RequestSender({request:r,onRequestTimeout:function(){s.onRequestTimeout();},onTransportError:function(){s.onTransportError();},receiveResponse:i.receiveResponse||function(e){s.receiveNonInviteResponse(e);}},this.ua).send(),this.emit(t.toLowerCase(),r),this},close:function(){var t;if(this.status===c.STATUS_TERMINATED)return this;for(t in this.logger.log("closing INVITE session "+this.id),this.sessionDescriptionHandler&&this.sessionDescriptionHandler.close(),this.timers)e.Timers.clearTimeout(this.timers[t]);for(t in this.dialog&&(this.dialog.terminate(),delete this.dialog),this.earlyDialogs)this.earlyDialogs[t].terminate(),delete this.earlyDialogs[t];return this.status=c.STATUS_TERMINATED,this.ua.transport.removeListener("transportError",this.errorListener),delete this.ua.sessions[this.id],this},createDialog:function(t,i,s){var r,n,o=t["UAS"===i?"to_tag":"from_tag"],a=t["UAS"===i?"from_tag":"to_tag"],c=t.call_id+o+a;if(n=this.earlyDialogs[c],s)return !!n||((n=new e.Dialog(this,t,i,e.Dialog.C.STATUS_EARLY)).error?(this.logger.error(n.error),this.failed(t,e.C.causes.INTERNAL_ERROR),!1):(this.earlyDialogs[c]=n,!0));if(n){for(var h in n.update(t,i),this.dialog=n,delete this.earlyDialogs[c],this.earlyDialogs)this.earlyDialogs[h].terminate(),delete this.earlyDialogs[h];return !0}return (r=new e.Dialog(this,t,i)).error?(this.logger.error(r.error),this.failed(t,e.C.causes.INTERNAL_ERROR),!1):(this.to_tag=t.to_tag,this.dialog=r,!0)},hold:function(t,i){if(this.status!==c.STATUS_WAITING_FOR_ACK&&this.status!==c.STATUS_CONFIRMED)throw new e.Exceptions.InvalidStateError(this.status);this.local_hold?this.logger.log("Session is already on hold, cannot put it on hold again"):((t=t||{}).modifiers=i||[],t.modifiers.push(this.sessionDescriptionHandler.holdModifier),this.local_hold=!0,this.sendReinvite(t));},unhold:function(t,i){if(this.status!==c.STATUS_WAITING_FOR_ACK&&this.status!==c.STATUS_CONFIRMED)throw new e.Exceptions.InvalidStateError(this.status);this.local_hold?(t=t||{},i&&(t.modifiers=i),this.local_hold=!1,this.sendReinvite(t)):this.logger.log("Session is not on hold, cannot unhold it");},reinvite:function(e,t){return e=e||{},t&&(e.modifiers=t),this.sendReinvite(e)},receiveReinvite:function(t){var i,s=this;if(s.emit("reinvite",this),t.hasHeader("P-Asserted-Identity")&&(this.assertedIdentity=new e.NameAddrHeader.parse(t.getHeader("P-Asserted-Identity"))),"0"!==t.getHeader("Content-Length")||t.getHeader("Content-Type")){if(!this.sessionDescriptionHandler.hasDescription(t.getHeader("Content-Type")))return t.reply(415),void this.emit("reinviteFailed",s);i=this.sessionDescriptionHandler.setDescription(t.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(this.sessionDescriptionHandler.getDescription.bind(this.sessionDescriptionHandler,this.sessionDescriptionHandlerOptions,this.modifiers));}else i=this.sessionDescriptionHandler.getDescription(this.sessionDescriptionHandlerOptions,this.modifiers);this.receiveRequest=function(t){t.method===e.C.ACK&&this.status===c.STATUS_WAITING_FOR_ACK?this.sessionDescriptionHandler.hasDescription(t.getHeader("Content-Type"))?(this.hasAnswer=!0,this.sessionDescriptionHandler.setDescription(t.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(function(){e.Timers.clearTimeout(this.timers.ackTimer),e.Timers.clearTimeout(this.timers.invite2xxTimer),this.status=c.STATUS_CONFIRMED,this.emit("confirmed",t);}.bind(this))):(e.Timers.clearTimeout(this.timers.ackTimer),e.Timers.clearTimeout(this.timers.invite2xxTimer),this.status=c.STATUS_CONFIRMED,this.emit("confirmed",t)):e.Session.prototype.receiveRequest.apply(this,[t]);}.bind(this),i.catch(function(i){var r;i instanceof e.Exceptions.GetDescriptionError?r=500:i instanceof e.Exceptions.RenegotiationError?(s.emit("renegotiationError",i),s.logger.warn(i),r=488):(s.logger.error(i),r=488),t.reply(r),s.emit("reinviteFailed",s);}).then(function(e){var i=["Contact: "+s.contact];t.reply(200,null,i,e,function(){s.status=c.STATUS_WAITING_FOR_ACK,s.setACKTimer(),s.emit("reinviteAccepted",s);});});},sendReinvite:function(t){if(this.pendingReinvite)this.logger.warn("Reinvite in progress. Please wait until complete, then try again.");else{this.pendingReinvite=!0,(t=t||{}).modifiers=t.modifiers||[];var i=this,s=(t.extraHeaders||[]).slice();s.push("Contact: "+this.contact),s.push("Allow: "+e.UA.C.ALLOWED_METHODS.toString()),this.sessionDescriptionHandler.getDescription(t.sessionDescriptionHandlerOptions,t.modifiers).then(function(t){i.sendRequest(e.C.INVITE,{extraHeaders:s,body:t,receiveResponse:i.receiveReinviteResponse.bind(i)});}).catch(function(t){if(t instanceof e.Exceptions.RenegotiationError)return i.pendingReinvite=!1,i.emit("renegotiationError",t),i.logger.warn("Renegotiation Error"),void i.logger.warn(t);i.logger.error("sessionDescriptionHandler error"),i.logger.error(t);});}},receiveRequest:function(t){switch(t.method){case e.C.BYE:t.reply(200),this.status===c.STATUS_CONFIRMED&&(this.emit("bye",t),this.terminated(t,e.C.causes.BYE));break;case e.C.INVITE:this.status===c.STATUS_CONFIRMED&&(this.logger.log("re-INVITE received"),this.receiveReinvite(t));break;case e.C.INFO:if(this.status===c.STATUS_CONFIRMED||this.status===c.STATUS_WAITING_FOR_ACK){if(this.onInfo)return this.onInfo(t);var i,s,r,n=t.getHeader("content-type"),o=/^(Signal\s*?=\s*?)([0-9A-D#*]{1})(\s)?.*/,h=/^(Duration\s?=\s?)([0-9]{1,4})(\s)?.*/;n&&(n.match(/^application\/dtmf-relay/i)?(t.body&&2===(i=t.body.split("\r\n",2)).length&&(o.test(i[0])&&(s=i[0].replace(o,"$2")),h.test(i[1])&&(r=parseInt(i[1].replace(h,"$2"),10))),new a(this,s,{duration:r}).init_incoming(t)):t.reply(415,null,["Accept: application/dtmf-relay"]));}break;case e.C.REFER:if(this.status===c.STATUS_CONFIRMED)if(this.logger.log("REFER received"),this.referContext=new e.ReferServerContext(this.ua,t),this.listeners("referRequested").length)this.emit("referRequested",this.referContext);else{this.logger.log("No referRequested listeners, automatically accepting and following the refer");var u={followRefer:!0};this.passedOptions&&(u.inviteOptions=this.passedOptions),this.referContext.accept(u,this.modifiers);}break;case e.C.NOTIFY:if(this.referContext&&this.referContext instanceof e.ReferClientContext&&t.hasHeader("event")&&/^refer(;.*)?$/.test(t.getHeader("event")))return void this.referContext.receiveNotify(t);t.reply(200,"OK"),this.emit("notify",t);}},receiveReinviteResponse:function(t){var i=this;if(this.status!==c.STATUS_TERMINATED)switch(!0){case/^1[0-9]{2}$/.test(t.status_code):break;case/^2[0-9]{2}$/.test(t.status_code):if(this.status=c.STATUS_CONFIRMED,this.emit("ack",t.transaction.sendACK()),this.pendingReinvite=!1,e.Timers.clearTimeout(i.timers.invite2xxTimer),!this.sessionDescriptionHandler.hasDescription(t.getHeader("Content-Type"))){this.logger.error("2XX response received to re-invite but did not have a description"),this.emit("reinviteFailed",i),this.emit("renegotiationError",new e.Exceptions.RenegotiationError("2XX response received to re-invite but did not have a description"));break}this.sessionDescriptionHandler.setDescription(t.body,this.sessionDescriptionHandlerOptions,this.modifiers).catch(function(t){i.logger.error("Could not set the description in 2XX response"),i.logger.error(t),i.emit("reinviteFailed",i),i.emit("renegotiationError",t),i.sendRequest(e.C.BYE,{extraHeaders:["Reason: "+e.Utils.getReasonHeaderValue(488,"Not Acceptable Here")]}),i.terminated(null,e.C.causes.INCOMPATIBLE_SDP);}).then(function(){i.emit("reinviteAccepted",i);});break;default:this.pendingReinvite=!1,this.logger.log("Received a non 1XX or 2XX response to a re-invite"),this.emit("reinviteFailed",i),this.emit("renegotiationError",new e.Exceptions.RenegotiationError("Invalid response to a re-invite"));}},acceptAndTerminate:function(t,i,s){var r=[];return i&&r.push("Reason: "+e.Utils.getReasonHeaderValue(i,s)),(this.dialog||this.createDialog(t,"UAC"))&&(this.emit("ack",t.transaction.sendACK()),this.sendRequest(e.C.BYE,{extraHeaders:r})),this},setInvite2xxTimer:function(t,i){var s=this,r=e.Timers.T1;this.timers.invite2xxTimer=e.Timers.setTimeout(function n(){if(s.status===c.STATUS_WAITING_FOR_ACK){s.logger.log("no ACK received, attempting to retransmit OK");var o=["Contact: "+s.contact];t.reply(200,null,o,i),r=Math.min(2*r,e.Timers.T2),s.timers.invite2xxTimer=e.Timers.setTimeout(n,r);}},r);},setACKTimer:function(){var t=this;this.timers.ackTimer=e.Timers.setTimeout(function(){t.status===c.STATUS_WAITING_FOR_ACK&&(t.logger.log("no ACK received for an extended period of time, terminating the call"),e.Timers.clearTimeout(t.timers.invite2xxTimer),t.sendRequest(e.C.BYE),t.terminated(null,e.C.causes.NO_ACK));},e.Timers.TIMER_H);},onTransportError:function(){this.status!==c.STATUS_CONFIRMED&&this.status!==c.STATUS_TERMINATED&&this.failed(null,e.C.causes.CONNECTION_ERROR);},onRequestTimeout:function(){this.status===c.STATUS_CONFIRMED?this.terminated(null,e.C.causes.REQUEST_TIMEOUT):this.status!==c.STATUS_TERMINATED&&(this.failed(null,e.C.causes.REQUEST_TIMEOUT),this.terminated(null,e.C.causes.REQUEST_TIMEOUT));},onDialogError:function(t){this.status===c.STATUS_CONFIRMED?this.terminated(t,e.C.causes.DIALOG_ERROR):this.status!==c.STATUS_TERMINATED&&(this.failed(t,e.C.causes.DIALOG_ERROR),this.terminated(t,e.C.causes.DIALOG_ERROR));},failed:function(e,t){return this.status===c.STATUS_TERMINATED?this:(this.emit("failed",e||null,t||null),this)},rejected:function(e,t){return this.emit("rejected",e||null,t||null),this},canceled:function(){return this.sessionDescriptionHandler&&this.sessionDescriptionHandler.close(),this.emit("cancel"),this},accepted:function(t,i){return i=e.Utils.getReasonPhrase(t&&t.status_code,i),this.startTime=new Date,this.replacee&&(this.replacee.emit("replaced",this),this.replacee.terminate()),this.emit("accepted",t,i),this},terminated:function(e,t){return this.status===c.STATUS_TERMINATED?this:(this.endTime=new Date,this.close(),this.emit("terminated",e||null,t||null),this)},connecting:function(e){return this.emit("connecting",{request:e}),this}},t.C=c,e.Session=t,(s=function(t,i){var s,r=this,n=i.getHeader("Content-Type"),o=i.parseHeader("Content-Disposition");function a(e,t){i.hasHeader(e)&&i.getHeader(e).toLowerCase().indexOf("100rel")>=0&&(r.rel100=t);}if(e.Utils.augment(this,e.ServerContext,[t,i]),e.Utils.augment(this,e.Session,[t.configuration.sessionDescriptionHandlerFactory]),o&&"render"===o.type&&(this.renderbody=i.body,this.rendertype=n),this.status=c.STATUS_INVITE_RECEIVED,this.from_tag=i.from_tag,this.id=i.call_id+this.from_tag,this.request=i,this.contact=this.ua.contact.toString(),this.receiveNonInviteResponse=function(){},this.logger=t.getLogger("sip.inviteservercontext",this.id),this.ua.sessions[this.id]=this,i.hasHeader("expires")&&(s=1e3*i.getHeader("expires")),a("require",e.C.supported.REQUIRED),a("supported",e.C.supported.SUPPORTED),i.to_tag=e.Utils.newTag(),this.createDialog(i,"UAS",!0)){var h={extraHeaders:["Contact: "+r.contact]};r.rel100!==e.C.supported.REQUIRED&&r.progress(h),r.status=c.STATUS_WAITING_FOR_ANSWER,r.timers.userNoAnswerTimer=e.Timers.setTimeout(function(){i.reply(408),r.failed(i,e.C.causes.NO_ANSWER),r.terminated(i,e.C.causes.NO_ANSWER);},r.ua.configuration.noAnswerTimeout),s&&(r.timers.expiresTimer=e.Timers.setTimeout(function(){r.status===c.STATUS_WAITING_FOR_ANSWER&&(i.reply(487),r.failed(i,e.C.causes.EXPIRES),r.terminated(i,e.C.causes.EXPIRES));},s)),this.errorListener=this.onTransportError.bind(this),t.transport.on("transportError",this.errorListener);}else i.reply(500,"Missing Contact header field");}).prototype=Object.create({},{reject:{writable:!0,value:function(t){if(this.status===c.STATUS_TERMINATED)throw new e.Exceptions.InvalidStateError(this.status);return this.logger.log("rejecting RTCSession"),e.ServerContext.prototype.reject.call(this,t),this.terminated()}},terminate:{writable:!0,value:function(t){var i,s=((t=t||{}).extraHeaders||[]).slice(),r=t.body,n=this;return this.status===c.STATUS_WAITING_FOR_ACK&&this.request.server_transaction.state!==e.Transactions.C.STATUS_TERMINATED?(i=this.dialog,this.receiveRequest=function(t){t.method===e.C.ACK&&(this.sendRequest(e.C.BYE,{extraHeaders:s,body:r}),i.terminate());},this.request.server_transaction.on("stateChanged",function(){this.state===e.Transactions.C.STATUS_TERMINATED&&this.dialog&&(this.request=new e.OutgoingRequest(e.C.BYE,this.dialog.remote_target,this.ua,{cseq:this.dialog.local_seqnum+=1,call_id:this.dialog.id.call_id,from_uri:this.dialog.local_uri,from_tag:this.dialog.id.local_tag,to_uri:this.dialog.remote_uri,to_tag:this.dialog.id.remote_tag,route_set:this.dialog.route_set},s,r),new e.RequestSender({request:this.request,onRequestTimeout:function(){n.onRequestTimeout();},onTransportError:function(){n.onTransportError();},receiveResponse:function(){}},this.ua).send(),i.terminate());}),this.emit("bye",this.request),this.terminated(),this.dialog=i,this.ua.dialogs[i.id.toString()]=i):this.status===c.STATUS_CONFIRMED?this.bye(t):this.reject(t),this}},progress:{writable:!0,value:function(t){var i,s=(t=t||{}).statusCode||180,r=t.reasonPhrase,n=(t.extraHeaders||[]).slice(),o=t.body;if(s<100||s>199)throw new TypeError("Invalid statusCode: "+s);if(this.isCanceled||this.status===c.STATUS_TERMINATED)return this;function a(){s=t.statusCode||183,this.status=c.STATUS_WAITING_FOR_PRACK,n.push("Contact: "+this.contact),n.push("Require: 100rel"),n.push("RSeq: "+Math.floor(1e4*Math.random())),this.sessionDescriptionHandler.getDescription(t.sessionDescriptionHandlerOptions,t.modifiers).then(function(t){if(!this.isCanceled&&this.status!==c.STATUS_TERMINATED){this.early_sdp=t.body,this[this.hasOffer?"hasAnswer":"hasOffer"]=!0;var o=e.Timers.T1;this.timers.rel1xxTimer=e.Timers.setTimeout(function i(){this.request.reply(s,null,n,t),o*=2,this.timers.rel1xxTimer=e.Timers.setTimeout(i.bind(this),o);}.bind(this),o),this.timers.prackTimer=e.Timers.setTimeout(function(){this.status===c.STATUS_WAITING_FOR_PRACK&&(this.logger.log("no PRACK received, rejecting the call"),e.Timers.clearTimeout(this.timers.rel1xxTimer),this.request.reply(504),this.terminated(null,e.C.causes.NO_PRACK));}.bind(this),64*e.Timers.T1),i=this.request.reply(s,r,n,t),this.emit("progress",i,r);}}.bind(this),function(){this.request.reply(480),this.failed(null,e.C.causes.WEBRTC_ERROR),this.terminated(null,e.C.causes.WEBRTC_ERROR);}.bind(this));}return 100!==t.statusCode&&(this.rel100===e.C.supported.REQUIRED||this.rel100===e.C.supported.SUPPORTED&&t.rel100||this.rel100===e.C.supported.SUPPORTED&&this.ua.configuration.rel100===e.C.supported.REQUIRED)?(this.sessionDescriptionHandler=this.setupSessionDescriptionHandler(),this.emit("SessionDescriptionHandler-created",this.sessionDescriptionHandler),this.sessionDescriptionHandler.hasDescription(this.request.getHeader("Content-Type"))?(this.hasOffer=!0,this.sessionDescriptionHandler.setDescription(this.request.body,t.sessionDescriptionHandlerOptions,t.modifiers).then(a.apply(this)).catch(function(t){this.logger.warn("invalid description"),this.logger.warn(t),this.failed(null,e.C.causes.WEBRTC_ERROR),this.terminated(null,e.C.causes.WEBRTC_ERROR);}.bind(this))):a.apply(this)):function(){i=this.request.reply(s,r,n,o),this.emit("progress",i,r);}.apply(this),this}},accept:{writable:!0,value:function(t){t=t||{},this.onInfo=t.onInfo;var i=this,s=this.request,r=(t.extraHeaders||[]).slice(),n=function(t){var n;r.push("Contact: "+i.contact),r.push("Allow: "+e.UA.C.ALLOWED_METHODS.toString()),i.hasOffer?i.hasAnswer=!0:i.hasOffer=!0,n=s.reply(200,null,r,t,function(){i.status=c.STATUS_WAITING_FOR_ACK,i.setInvite2xxTimer(s,t),i.setACKTimer();},function(){i.failed(null,e.C.causes.CONNECTION_ERROR),i.terminated(null,e.C.causes.CONNECTION_ERROR);}),i.status!==c.STATUS_TERMINATED&&i.accepted(n,e.Utils.getReasonPhrase(200));},o=function(){i.status!==c.STATUS_TERMINATED&&(i.request.reply(480),i.failed(null,e.C.causes.WEBRTC_ERROR),i.terminated(null,e.C.causes.WEBRTC_ERROR));};if(this.status===c.STATUS_WAITING_FOR_PRACK)return this.status=c.STATUS_ANSWERED_WAITING_FOR_PRACK,this;if(this.status===c.STATUS_WAITING_FOR_ANSWER)this.status=c.STATUS_ANSWERED;else if(this.status!==c.STATUS_EARLY_MEDIA)throw new e.Exceptions.InvalidStateError(this.status);if(!this.createDialog(s,"UAS"))return s.reply(500,"Missing Contact header field"),this;if(e.Timers.clearTimeout(this.timers.userNoAnswerTimer),this.status===c.STATUS_EARLY_MEDIA)n({});else if(this.sessionDescriptionHandler=this.setupSessionDescriptionHandler(),this.emit("SessionDescriptionHandler-created",this.sessionDescriptionHandler),"0"!==this.request.getHeader("Content-Length")||this.request.getHeader("Content-Type")){if(!this.sessionDescriptionHandler.hasDescription(this.request.getHeader("Content-Type")))return void this.request.reply(415);this.hasOffer=!0,this.sessionDescriptionHandler.setDescription(this.request.body,t.sessionDescriptionHandlerOptions,t.modifiers).then(function(){return this.sessionDescriptionHandler.getDescription(t.sessionDescriptionHandlerOptions,t.modifiers)}.bind(this)).catch(o).then(n);}else this.sessionDescriptionHandler.getDescription(t.sessionDescriptionHandlerOptions,t.modifiers).catch(o).then(n);return this}},receiveRequest:{writable:!0,value:function(i){function s(){var t,s;e.Timers.clearTimeout(this.timers.ackTimer),e.Timers.clearTimeout(this.timers.invite2xxTimer),this.status=c.STATUS_CONFIRMED,t=i.getHeader("Content-Type"),(s=i.getHeader("Content-Disposition"))&&"render"===s.type&&(this.renderbody=i.body,this.rendertype=t),this.emit("confirmed",i);}switch(i.method){case e.C.CANCEL:this.status!==c.STATUS_WAITING_FOR_ANSWER&&this.status!==c.STATUS_WAITING_FOR_PRACK&&this.status!==c.STATUS_ANSWERED_WAITING_FOR_PRACK&&this.status!==c.STATUS_EARLY_MEDIA&&this.status!==c.STATUS_ANSWERED||(this.status=c.STATUS_CANCELED,this.request.reply(487),this.canceled(i),this.rejected(i,e.C.causes.CANCELED),this.failed(i,e.C.causes.CANCELED),this.terminated(i,e.C.causes.CANCELED));break;case e.C.ACK:this.status===c.STATUS_WAITING_FOR_ACK&&(this.sessionDescriptionHandler.hasDescription(i.getHeader("Content-Type"))?(this.hasAnswer=!0,this.sessionDescriptionHandler.setDescription(i.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(s.bind(this),function(t){this.logger.warn(t),this.terminate({statusCode:"488",reasonPhrase:"Bad Media Description"}),this.failed(i,e.C.causes.BAD_MEDIA_DESCRIPTION),this.terminated(i,e.C.causes.BAD_MEDIA_DESCRIPTION);}.bind(this))):s.apply(this));break;case e.C.PRACK:this.status===c.STATUS_WAITING_FOR_PRACK||this.status===c.STATUS_ANSWERED_WAITING_FOR_PRACK?this.hasAnswer?(e.Timers.clearTimeout(this.timers.rel1xxTimer),e.Timers.clearTimeout(this.timers.prackTimer),i.reply(200),this.status===c.STATUS_ANSWERED_WAITING_FOR_PRACK&&(this.status=c.STATUS_EARLY_MEDIA,this.accept()),this.status=c.STATUS_EARLY_MEDIA):(this.sessionDescriptionHandler=this.setupSessionDescriptionHandler(),this.emit("SessionDescriptionHandler-created",this.sessionDescriptionHandler),this.sessionDescriptionHandler.hasDescription(i.getHeader("Content-Type"))?(this.hasAnswer=!0,this.sessionDescriptionHandler.setDescription(i.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(function(){e.Timers.clearTimeout(this.timers.rel1xxTimer),e.Timers.clearTimeout(this.timers.prackTimer),i.reply(200),this.status===c.STATUS_ANSWERED_WAITING_FOR_PRACK&&(this.status=c.STATUS_EARLY_MEDIA,this.accept()),this.status=c.STATUS_EARLY_MEDIA;}.bind(this),function(t){this.logger.warn(t),this.terminate({statusCode:"488",reasonPhrase:"Bad Media Description"}),this.failed(i,e.C.causes.BAD_MEDIA_DESCRIPTION),this.terminated(i,e.C.causes.BAD_MEDIA_DESCRIPTION);}.bind(this))):(this.terminate({statusCode:"488",reasonPhrase:"Bad Media Description"}),this.failed(i,e.C.causes.BAD_MEDIA_DESCRIPTION),this.terminated(i,e.C.causes.BAD_MEDIA_DESCRIPTION))):this.status===c.STATUS_EARLY_MEDIA&&i.reply(200);break;default:t.prototype.receiveRequest.apply(this,[i]);}}},setupSessionDescriptionHandler:{writable:!0,value:function(){return this.sessionDescriptionHandler?this.sessionDescriptionHandler:this.sessionDescriptionHandlerFactory(this,this.ua.configuration.sessionDescriptionHandlerFactoryOptions)}},onTransportError:{writable:!0,value:function(){this.status!==c.STATUS_CONFIRMED&&this.status!==c.STATUS_TERMINATED&&this.failed(null,e.C.causes.CONNECTION_ERROR);}},onRequestTimeout:{writable:!0,value:function(){this.status===c.STATUS_CONFIRMED?this.terminated(null,e.C.causes.REQUEST_TIMEOUT):this.status!==c.STATUS_TERMINATED&&(this.failed(null,e.C.causes.REQUEST_TIMEOUT),this.terminated(null,e.C.causes.REQUEST_TIMEOUT));}}}),e.InviteServerContext=s,(r=function(t,i,s,r){s=s||{},this.passedOptions=s,s.params=Object.create(s.params||Object.prototype);var n=(s.extraHeaders||[]).slice(),o=t.configuration.sessionDescriptionHandlerFactory;if(this.sessionDescriptionHandlerFactoryOptions=t.configuration.sessionDescriptionHandlerFactoryOptions||{},this.sessionDescriptionHandlerOptions=s.sessionDescriptionHandlerOptions||{},this.modifiers=r,this.inviteWithoutSdp=s.inviteWithoutSdp||!1,this.anonymous=s.anonymous||!1,this.renderbody=s.renderbody||null,this.rendertype=s.rendertype||"text/plain",this.from_tag=e.Utils.newTag(),s.params.from_tag=this.from_tag,this.contact=t.contact.toString({anonymous:this.anonymous,outbound:this.anonymous?!t.contact.temp_gruu:!t.contact.pub_gruu}),this.anonymous&&(s.params.from_displayName="Anonymous",s.params.from_uri="sip:anonymous@anonymous.invalid",n.push("P-Preferred-Identity: "+t.configuration.uri.toString()),n.push("Privacy: id")),n.push("Contact: "+this.contact),n.push("Allow: "+e.UA.C.ALLOWED_METHODS.toString()),this.inviteWithoutSdp&&this.renderbody&&(n.push("Content-Type: "+this.rendertype),n.push("Content-Disposition: render;handling=optional")),t.configuration.rel100===e.C.supported.REQUIRED&&n.push("Require: 100rel"),t.configuration.replaces===e.C.supported.REQUIRED&&n.push("Require: replaces"),s.extraHeaders=n,e.Utils.augment(this,e.ClientContext,[t,e.C.INVITE,i,s]),e.Utils.augment(this,e.Session,[o]),this.status!==c.STATUS_NULL)throw new e.Exceptions.InvalidStateError(this.status);this.isCanceled=!1,this.received_100=!1,this.method=e.C.INVITE,this.receiveNonInviteResponse=this.receiveResponse,this.receiveResponse=this.receiveInviteResponse,this.logger=t.getLogger("sip.inviteclientcontext"),t.applicants[this]=this,this.id=this.request.call_id+this.from_tag,this.onInfo=s.onInfo,this.errorListener=this.onTransportError.bind(this),t.transport.on("transportError",this.errorListener);}).prototype=Object.create({},{invite:{writable:!0,value:function(){var t=this;return this.ua.sessions[this.id]=this,this.inviteWithoutSdp?(this.request.body=t.renderbody,this.status=c.STATUS_INVITE_SENT,this.send()):(this.sessionDescriptionHandler=this.sessionDescriptionHandlerFactory(this,this.sessionDescriptionHandlerFactoryOptions),this.emit("SessionDescriptionHandler-created",this.sessionDescriptionHandler),this.sessionDescriptionHandler.getDescription(this.sessionDescriptionHandlerOptions,this.modifiers).then(function(e){t.isCanceled||t.status===c.STATUS_TERMINATED||(t.hasOffer=!0,t.request.body=e,t.status=c.STATUS_INVITE_SENT,t.send());},function(){t.status!==c.STATUS_TERMINATED&&(t.failed(null,e.C.causes.WEBRTC_ERROR),t.terminated(null,e.C.causes.WEBRTC_ERROR));})),this}},receiveInviteResponse:{writable:!0,value:function(t){var i,s=this,r=t.call_id+t.from_tag+t.to_tag,n=[],o={};if(this.status!==c.STATUS_TERMINATED&&t.method===e.C.INVITE){if(this.dialog&&t.status_code>=200&&t.status_code<=299){if(r!==this.dialog.id.toString()){if(!this.createDialog(t,"UAC",!0))return;return this.emit("ack",t.transaction.sendACK({body:e.Utils.generateFakeSDP(t.body)})),this.earlyDialogs[r].sendRequest(this,e.C.BYE),void(this.status!==c.STATUS_CONFIRMED&&(this.failed(t,e.C.causes.WEBRTC_ERROR),this.terminated(t,e.C.causes.WEBRTC_ERROR)))}if(this.status===c.STATUS_CONFIRMED)return void this.emit("ack",t.transaction.sendACK());if(!this.hasAnswer)return}if(this.dialog&&t.status_code<200){if(-1!==this.dialog.pracked.indexOf(t.getHeader("rseq"))||this.dialog.pracked[this.dialog.pracked.length-1]>=t.getHeader("rseq")&&this.dialog.pracked.length>0)return;if(!this.earlyDialogs[r]&&!this.createDialog(t,"UAC",!0))return;if(-1!==this.earlyDialogs[r].pracked.indexOf(t.getHeader("rseq"))||this.earlyDialogs[r].pracked[this.earlyDialogs[r].pracked.length-1]>=t.getHeader("rseq")&&this.earlyDialogs[r].pracked.length>0)return;return n.push("RAck: "+t.getHeader("rseq")+" "+t.getHeader("cseq")),this.earlyDialogs[r].pracked.push(t.getHeader("rseq")),void this.earlyDialogs[r].sendRequest(this,e.C.PRACK,{extraHeaders:n,body:e.Utils.generateFakeSDP(t.body)})}if(this.isCanceled)t.status_code>=100&&t.status_code<200?(this.request.cancel(this.cancelReason,n),this.canceled(null)):t.status_code>=200&&t.status_code<299?(this.acceptAndTerminate(t),this.emit("bye",this.request)):t.status_code>=300&&(i=e.C.REASON_PHRASE[t.status_code]||e.C.causes.CANCELED,this.rejected(t,i),this.failed(t,i),this.terminated(t,i));else switch(!0){case/^100$/.test(t.status_code):this.received_100=!0,this.emit("progress",t);break;case/^1[0-9]{2}$/.test(t.status_code):if(!t.to_tag){this.logger.warn("1xx response received without to tag");break}if(t.hasHeader("contact")&&!this.createDialog(t,"UAC",!0))break;if(this.status=c.STATUS_1XX_RECEIVED,t.hasHeader("P-Asserted-Identity")&&(this.assertedIdentity=new e.NameAddrHeader.parse(t.getHeader("P-Asserted-Identity"))),t.hasHeader("require")&&-1!==t.getHeader("require").indexOf("100rel")){if(this.dialog||!this.earlyDialogs[r])break;if(-1!==this.earlyDialogs[r].pracked.indexOf(t.getHeader("rseq"))||this.earlyDialogs[r].pracked[this.earlyDialogs[r].pracked.length-1]>=t.getHeader("rseq")&&this.earlyDialogs[r].pracked.length>0)return;if(this.sessionDescriptionHandler=this.sessionDescriptionHandlerFactory(this,this.sessionDescriptionHandlerFactoryOptions),this.emit("SessionDescriptionHandler-created",this.sessionDescriptionHandler),this.sessionDescriptionHandler.hasDescription(t.getHeader("Content-Type")))if(this.hasOffer){if(!this.createDialog(t,"UAC"))break;this.hasAnswer=!0,this.dialog.pracked.push(t.getHeader("rseq")),this.sessionDescriptionHandler.setDescription(t.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(function(){n.push("RAck: "+t.getHeader("rseq")+" "+t.getHeader("cseq")),s.sendRequest(e.C.PRACK,{extraHeaders:n,receiveResponse:function(){}}),s.status=c.STATUS_EARLY_MEDIA,s.emit("progress",t);},function(i){s.logger.warn(i),s.acceptAndTerminate(t,488,"Not Acceptable Here"),s.failed(t,e.C.causes.BAD_MEDIA_DESCRIPTION);});}else{var a=this.earlyDialogs[r],h=a.sessionDescriptionHandler=this.sessionDescriptionHandlerFactory(this,this.sessionDescriptionHandlerFactoryOptions);this.emit("SessionDescriptionHandler-created",h),a.pracked.push(t.getHeader("rseq")),h.setDescription(t.body,s.sessionDescriptionHandlerOptions,s.modifers).then(h.getDescription.bind(h,s.sessionDescriptionHandlerOptions,s.modifiers)).then(function(i){n.push("RAck: "+t.getHeader("rseq")+" "+t.getHeader("cseq")),a.sendRequest(s,e.C.PRACK,{extraHeaders:n,body:i}),s.status=c.STATUS_EARLY_MEDIA,s.emit("progress",t);}).catch(function(i){if(i instanceof e.Exceptions.GetDescriptionError){if(a.pracked.push(t.getHeader("rseq")),s.status===c.STATUS_TERMINATED)return;s.failed(null,e.C.causes.WEBRTC_ERROR),s.terminated(null,e.C.causes.WEBRTC_ERROR);}else a.pracked.splice(a.pracked.indexOf(t.getHeader("rseq")),1),s.logger.warn("invalid description"),s.logger.warn(i);});}else n.push("RAck: "+t.getHeader("rseq")+" "+t.getHeader("cseq")),this.earlyDialogs[r].pracked.push(t.getHeader("rseq")),this.earlyDialogs[r].sendRequest(this,e.C.PRACK,{extraHeaders:n}),this.emit("progress",t);}else this.emit("progress",t);break;case/^2[0-9]{2}$/.test(t.status_code):if(this.request.cseq+" "+this.request.method!==t.getHeader("cseq"))break;if(t.hasHeader("P-Asserted-Identity")&&(this.assertedIdentity=new e.NameAddrHeader.parse(t.getHeader("P-Asserted-Identity"))),this.status===c.STATUS_EARLY_MEDIA&&this.dialog){this.status=c.STATUS_CONFIRMED,o={},this.renderbody&&(n.push("Content-Type: "+this.rendertype),o.extraHeaders=n,o.body=this.renderbody),this.emit("ack",t.transaction.sendACK(o)),this.accepted(t);break}if(this.dialog)break;if(this.hasOffer)if(this.hasAnswer)this.renderbody&&(n.push("Content-Type: "+s.rendertype),o.extraHeaders=n,o.body=this.renderbody),this.emit("ack",t.transaction.sendACK(o));else{if(!this.sessionDescriptionHandler.hasDescription(t.getHeader("Content-Type"))){this.acceptAndTerminate(t,400,"Missing session description"),this.failed(t,e.C.causes.BAD_MEDIA_DESCRIPTION);break}if(!this.createDialog(t,"UAC"))break;this.hasAnswer=!0,this.sessionDescriptionHandler.setDescription(t.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(function(){var e={};s.status=c.STATUS_CONFIRMED,s.renderbody&&(n.push("Content-Type: "+s.rendertype),e.extraHeaders=n,e.body=s.renderbody),s.emit("ack",t.transaction.sendACK(e)),s.accepted(t);},function(i){s.logger.warn(i),s.acceptAndTerminate(t,488,"Not Acceptable Here"),s.failed(t,e.C.causes.BAD_MEDIA_DESCRIPTION);});}else if(this.earlyDialogs[r]&&this.earlyDialogs[r].sessionDescriptionHandler){if(this.hasOffer=!0,this.hasAnswer=!0,this.sessionDescriptionHandler=this.earlyDialogs[r].sessionDescriptionHandler,!this.createDialog(t,"UAC"))break;this.status=c.STATUS_CONFIRMED,this.emit("ack",t.transaction.sendACK()),this.accepted(t);}else{if(this.sessionDescriptionHandler=this.sessionDescriptionHandlerFactory(this,this.sessionDescriptionHandlerFactoryOptions),this.emit("SessionDescriptionHandler-created",this.sessionDescriptionHandler),!this.sessionDescriptionHandler.hasDescription(t.getHeader("Content-Type"))){this.acceptAndTerminate(t,400,"Missing session description"),this.failed(t,e.C.causes.BAD_MEDIA_DESCRIPTION);break}if(!this.createDialog(t,"UAC"))break;this.hasOffer=!0,this.sessionDescriptionHandler.setDescription(t.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(this.sessionDescriptionHandler.getDescription.bind(this.sessionDescriptionHandler,this.sessionDescriptionHandlerOptions,this.modifiers)).then(function(e){s.isCanceled||s.status===c.STATUS_TERMINATED||(s.status=c.STATUS_CONFIRMED,s.hasAnswer=!0,s.emit("ack",t.transaction.sendACK({body:e})),s.accepted(t));}).catch(function(i){i instanceof e.Exceptions.GetDescriptionError?s.logger.warn("there was a problem"):(s.logger.warn("invalid description"),s.logger.warn(i),s.acceptAndTerminate(t,488,"Invalid session description"),s.failed(t,e.C.causes.BAD_MEDIA_DESCRIPTION));});}break;default:i=e.Utils.sipErrorCause(t.status_code),this.rejected(t,i),this.failed(t,i),this.terminated(t,i);}}}},cancel:{writable:!0,value:function(t){if((t=t||{}).extraHeaders=(t.extraHeaders||[]).slice(),this.status===c.STATUS_TERMINATED||this.status===c.STATUS_CONFIRMED)throw new e.Exceptions.InvalidStateError(this.status);this.logger.log("canceling RTCSession");var i=e.Utils.getCancelReason(t.status_code,t.reason_phrase);return this.status===c.STATUS_NULL||this.status===c.STATUS_INVITE_SENT&&!this.received_100?(this.isCanceled=!0,this.cancelReason=i):this.status!==c.STATUS_INVITE_SENT&&this.status!==c.STATUS_1XX_RECEIVED&&this.status!==c.STATUS_EARLY_MEDIA||this.request.cancel(i,t.extraHeaders),this.canceled()}},terminate:{writable:!0,value:function(e){return this.status===c.STATUS_TERMINATED?this:(this.status===c.STATUS_WAITING_FOR_ACK||this.status===c.STATUS_CONFIRMED?this.bye(e):this.cancel(e),this)}},receiveRequest:{writable:!0,value:function(i){return i.method,e.C.CANCEL,i.method===e.C.ACK&&this.status===c.STATUS_WAITING_FOR_ACK&&(e.Timers.clearTimeout(this.timers.ackTimer),e.Timers.clearTimeout(this.timers.invite2xxTimer),this.status=c.STATUS_CONFIRMED,this.accepted()),t.prototype.receiveRequest.apply(this,[i])}},onTransportError:{writable:!0,value:function(){this.status!==c.STATUS_CONFIRMED&&this.status!==c.STATUS_TERMINATED&&this.failed(null,e.C.causes.CONNECTION_ERROR);}},onRequestTimeout:{writable:!0,value:function(){this.status===c.STATUS_CONFIRMED?this.terminated(null,e.C.causes.REQUEST_TIMEOUT):this.status!==c.STATUS_TERMINATED&&(this.failed(null,e.C.causes.REQUEST_TIMEOUT),this.terminated(null,e.C.causes.REQUEST_TIMEOUT));}}}),e.InviteClientContext=r,(o=function(t,i,s,r){if(this.options=r||{},this.extraHeaders=(this.options.extraHeaders||[]).slice(),void 0===t||void 0===i||void 0===s)throw new TypeError("Not enough arguments");if(e.Utils.augment(this,e.ClientContext,[t,e.C.REFER,i.remoteIdentity.uri.toString(),r]),this.applicant=i,s instanceof e.InviteServerContext||s instanceof e.InviteClientContext)this.target='"'+s.remoteIdentity.friendlyName+'" <'+s.dialog.remote_target.toString()+"?Replaces="+s.dialog.id.call_id+"%3Bto-tag%3D"+s.dialog.id.remote_tag+"%3Bfrom-tag%3D"+s.dialog.id.local_tag+">";else{try{this.target=e.Grammar.parse(s,"Refer_To").uri||s;}catch(e){this.logger.debug(".refer() cannot parse Refer_To from",s),this.logger.debug("...falling through to normalizeTarget()");}if(this.target=this.ua.normalizeTarget(this.target),!this.target)throw new TypeError("Invalid target: "+s)}this.ua&&this.extraHeaders.push("Referred-By: <"+this.ua.configuration.uri+">"),this.extraHeaders.push("Contact: "+i.contact),this.extraHeaders.push("Allow: "+e.UA.C.ALLOWED_METHODS.toString()),this.extraHeaders.push("Refer-To: "+this.target),this.errorListener=this.onTransportError.bind(this),t.transport.on("transportError",this.errorListener);}).prototype=Object.create({},{refer:{writable:!0,value:function(t){t=t||{};var i=(this.extraHeaders||[]).slice();return t.extraHeaders&&i.concat(t.extraHeaders),this.applicant.sendRequest(e.C.REFER,{extraHeaders:this.extraHeaders,receiveResponse:function(e){/^1[0-9]{2}$/.test(e.status_code)?this.emit("referRequestProgress",this):/^2[0-9]{2}$/.test(e.status_code)?this.emit("referRequestAccepted",this):/^[4-6][0-9]{2}$/.test(e.status_code)&&this.emit("referRequestRejected",this),t.receiveResponse&&t.receiveResponse(e);}.bind(this)}),this}},receiveNotify:{writable:!0,value:function(t){if(t.hasHeader("Content-Type")&&-1!==t.getHeader("Content-Type").search(/^message\/sipfrag/)){var i=e.Grammar.parse(t.body,"sipfrag");if(-1===i)return void t.reply(489,"Bad Event");switch(!0){case/^1[0-9]{2}$/.test(i.status_code):this.emit("referProgress",this);break;case/^2[0-9]{2}$/.test(i.status_code):this.emit("referAccepted",this),!this.options.activeAfterTransfer&&this.applicant.terminate&&this.applicant.terminate();break;default:this.emit("referRejected",this);}return t.reply(200),void this.emit("notify",t)}t.reply(489,"Bad Event");}}}),e.ReferClientContext=o,(n=function(t,i){if(e.Utils.augment(this,e.ServerContext,[t,i]),this.ua=t,this.status=c.STATUS_INVITE_RECEIVED,this.from_tag=i.from_tag,this.id=i.call_id+this.from_tag,this.request=i,this.contact=this.ua.contact.toString(),this.logger=t.getLogger("sip.referservercontext",this.id),!this.request.hasHeader("refer-to"))return this.logger.warn("Invalid REFER packet. A refer-to header is required. Rejecting refer."),void this.reject();this.referTo=this.request.parseHeader("refer-to"),this.referredSession=this.ua.findSession(i),this.cseq=Math.floor(1e4*Math.random()),this.call_id=this.request.call_id,this.from_uri=this.request.to.uri,this.from_tag=this.request.to.parameters.tag,this.remote_target=this.request.headers.Contact[0].parsed.uri,this.to_uri=this.request.from.uri,this.to_tag=this.request.from_tag,this.route_set=this.request.getHeaders("record-route"),this.receiveNonInviteResponse=function(){},this.request.hasHeader("referred-by")&&(this.referredBy=this.request.getHeader("referred-by")),this.referTo.uri.hasHeader("replaces")&&(this.replaces=this.referTo.uri.getHeader("replaces")),this.errorListener=this.onTransportError.bind(this),t.transport.on("transportError",this.errorListener),this.status=c.STATUS_WAITING_FOR_ANSWER;}).prototype=Object.create({},{progress:{writable:!0,value:function(){if(this.status!==c.STATUS_WAITING_FOR_ANSWER)throw new e.Exceptions.InvalidStateError(this.status);this.request.reply(100);}},reject:{writable:!0,value:function(t){if(this.status===c.STATUS_TERMINATED)throw new e.Exceptions.InvalidStateError(this.status);this.logger.log("Rejecting refer"),this.status=c.STATUS_TERMINATED,e.ServerContext.prototype.reject.call(this,t),this.emit("referRequestRejected",this);}},accept:{writable:!0,value:function(t,i){if(t=t||{},this.status!==c.STATUS_WAITING_FOR_ANSWER)throw new e.Exceptions.InvalidStateError(this.status);if(this.status=c.STATUS_ANSWERED,this.request.reply(202,"Accepted"),this.emit("referRequestAccepted",this),t.followRefer){this.logger.log("Accepted refer, attempting to automatically follow it");var s=this.referTo.uri;if(!s.scheme.match("^sips?$"))return this.logger.error("SIP.js can only automatically follow SIP refer target"),void this.reject();var r=t.inviteOptions||{},n=(r.extraHeaders||[]).slice();this.replaces&&n.push("Replaces: "+decodeURIComponent(this.replaces)),this.referredBy&&n.push("Referred-By: "+this.referredBy),r.extraHeaders=n,s.clearHeaders(),this.targetSession=this.ua.invite(s,r,i),this.emit("referInviteSent",this),this.targetSession.once("progress",function(){this.sendNotify("SIP/2.0 100 Trying"),this.emit("referProgress",this),this.referredSession&&this.referredSession.emit("referProgress",this);}.bind(this)),this.targetSession.once("accepted",function(){this.logger.log("Successfully followed the refer"),this.sendNotify("SIP/2.0 200 OK"),this.emit("referAccepted",this),this.referredSession&&this.referredSession.emit("referAccepted",this);}.bind(this));var o=function(e){if(this.status!==c.STATUS_TERMINATED){if(this.logger.log("Refer was not successful. Resuming session"),e&&429===e.status_code)return this.logger.log("Alerting referrer that identity is required."),void this.sendNotify("SIP/2.0 429 Provide Referrer Identity");this.sendNotify("SIP/2.0 603 Declined"),this.status=c.STATUS_TERMINATED,this.emit("referRejected",this),this.referredSession&&this.referredSession.emit("referRejected");}};this.targetSession.once("rejected",o.bind(this)),this.targetSession.once("failed",o.bind(this));}else this.logger.log("Accepted refer, but did not automatically follow it"),this.sendNotify("SIP/2.0 200 OK"),this.emit("referAccepted",this),this.referredSession&&this.referredSession.emit("referAccepted",this);}},sendNotify:{writable:!0,value:function(t){if(this.status!==c.STATUS_ANSWERED)throw new e.Exceptions.InvalidStateError(this.status);if(-1===e.Grammar.parse(t,"sipfrag"))throw new Error("sipfrag body is required to send notify for refer");var i=new e.OutgoingRequest(e.C.NOTIFY,this.remote_target,this.ua,{cseq:this.cseq+=1,call_id:this.call_id,from_uri:this.from_uri,from_tag:this.from_tag,to_uri:this.to_uri,to_tag:this.to_tag,route_set:this.route_set},["Event: refer","Subscription-State: terminated","Content-Type: message/sipfrag"],t);new e.RequestSender({request:i,onRequestTimeout:function(){},onTransportError:function(){},receiveResponse:function(){}},this.ua).send();}}}),e.ReferServerContext=n;};},function(e,t,i){e.exports=function(e){var t;((t=function(t,i){this.ua=t,this.logger=t.getLogger("sip.servercontext"),this.request=i,i.method===e.C.INVITE?this.transaction=new e.Transactions.InviteServerTransaction(i,t):this.transaction=new e.Transactions.NonInviteServerTransaction(i,t),i.body&&(this.body=i.body),i.hasHeader("Content-Type")&&(this.contentType=i.getHeader("Content-Type")),this.method=i.method,this.data={},this.localIdentity=i.to,this.remoteIdentity=i.from,i.hasHeader("P-Asserted-Identity")&&(this.assertedIdentity=new e.NameAddrHeader.parse(i.getHeader("P-Asserted-Identity")));}).prototype=Object.create(e.EventEmitter.prototype)).progress=function(e){return (e=Object.create(e||Object.prototype)).statusCode||(e.statusCode=180),e.minCode=100,e.maxCode=199,e.events=["progress"],this.reply(e)},t.prototype.accept=function(e){return (e=Object.create(e||Object.prototype)).statusCode||(e.statusCode=200),e.minCode=200,e.maxCode=299,e.events=["accepted"],this.reply(e)},t.prototype.reject=function(e){return (e=Object.create(e||Object.prototype)).statusCode||(e.statusCode=480),e.minCode=300,e.maxCode=699,e.events=["rejected","failed"],this.reply(e)},t.prototype.reply=function(t){var i,s=(t=t||{}).statusCode||100,r=t.minCode||100,n=t.maxCode||699,o=e.Utils.getReasonPhrase(s,t.reasonPhrase),a=t.extraHeaders||[],c=t.body,h=t.events||[];if(s<r||s>n)throw new TypeError("Invalid statusCode: "+s);return i=this.request.reply(s,o,a,c),h.forEach(function(e){this.emit(e,i,o);},this),this},t.prototype.onRequestTimeout=function(){this.emit("failed",null,e.C.causes.REQUEST_TIMEOUT);},t.prototype.onTransportError=function(){this.emit("failed",null,e.C.causes.CONNECTION_ERROR);},e.ServerContext=t;};},function(e,t,i){e.exports=function(e){var t;((t=function(t,i,s,r){var n=s;if(void 0===s)throw new TypeError("Not enough arguments");if(this.ua=t,this.logger=t.getLogger("sip.clientcontext"),this.method=i,!(s=t.normalizeTarget(s)))throw new TypeError("Invalid target: "+n);(r=Object.create(r||Object.prototype)).extraHeaders=(r.extraHeaders||[]).slice(),this.request=new e.OutgoingRequest(this.method,s,this.ua,r.params,r.extraHeaders),r.body&&(this.body={},this.body.body=r.body,r.contentType&&(this.body.contentType=r.contentType),this.request.body=this.body),this.localIdentity=this.request.from,this.remoteIdentity=this.request.to,this.data={};}).prototype=Object.create(e.EventEmitter.prototype)).send=function(){return new e.RequestSender(this,this.ua).send(),this},t.prototype.cancel=function(t){(t=t||{}).extraHeaders=(t.extraHeaders||[]).slice();var i=e.Utils.getCancelReason(t.status_code,t.reason_phrase);this.request.cancel(i,t.extraHeaders),this.emit("cancel");},t.prototype.receiveResponse=function(t){var i=e.Utils.getReasonPhrase(t.status_code);switch(!0){case/^1[0-9]{2}$/.test(t.status_code):this.emit("progress",t,i);break;case/^2[0-9]{2}$/.test(t.status_code):this.ua.applicants[this]&&delete this.ua.applicants[this],this.emit("accepted",t,i);break;default:this.ua.applicants[this]&&delete this.ua.applicants[this],this.emit("rejected",t,i),this.emit("failed",t,i);}},t.prototype.onRequestTimeout=function(){this.emit("failed",null,e.C.causes.REQUEST_TIMEOUT);},t.prototype.onTransportError=function(){this.emit("failed",null,e.C.causes.CONNECTION_ERROR);},e.ClientContext=t;};},function(e,t,i){e.exports=function(e){var t=function(){};return t.prototype=Object.create(e.prototype,{close:{value:function(){}},getDescription:{value:function(e,t){}},hasDescription:{value:function(e){}},holdModifier:{value:function(e){}},setDescription:{value:function(e,t,i){}},sendDtmf:{value:function(e,t){}},getDirection:{value:function(){}}}),t};},function(e,t,i){e.exports=function(e){var t;(t=function(t){var i={};this.registrar=t.configuration.registrarServer,this.expires=t.configuration.registerExpires,this.contact=t.contact.toString(),this.contact+=";reg-id=1",this.contact+=';+sip.instance="<urn:uuid:'+t.configuration.instanceId+'>"',this.call_id=e.Utils.createRandomToken(22),this.cseq=Math.floor(1e4*Math.random()),this.to_uri=t.configuration.uri,i.to_uri=this.to_uri,i.to_displayName=t.configuration.displayName,i.call_id=this.call_id,i.cseq=this.cseq,e.Utils.augment(this,e.ClientContext,[t,"REGISTER",this.registrar,{params:i}]),this.registrationTimer=null,this.registrationExpiredTimer=null,this.registered=!1,this.logger=t.getLogger("sip.registercontext"),t.on("transportCreated",function(e){e.on("disconnected",this.onTransportDisconnected.bind(this));}.bind(this));}).prototype=Object.create({},{register:{writable:!0,value:function(t){var i,s=this;this.options=t||{},(i=(this.options.extraHeaders||[]).slice()).push("Contact: "+this.contact+";expires="+this.expires),i.push("Allow: "+e.UA.C.ALLOWED_METHODS.toString()),this.closeHeaders=this.options.closeWithHeaders?(this.options.extraHeaders||[]).slice():[],this.receiveResponse=function(t){var i,r,n,o=t.getHeaders("contact").length;if(t.cseq===this.cseq)switch(null!==this.registrationTimer&&(e.Timers.clearTimeout(this.registrationTimer),this.registrationTimer=null),!0){case/^1[0-9]{2}$/.test(t.status_code):this.emit("progress",t);break;case/^2[0-9]{2}$/.test(t.status_code):if(this.emit("accepted",t),t.hasHeader("expires")&&(r=t.getHeader("expires")),null!==this.registrationExpiredTimer&&(e.Timers.clearTimeout(this.registrationExpiredTimer),this.registrationExpiredTimer=null),!o){this.logger.warn("no Contact header in response to REGISTER, response ignored");break}for(;o--;){if((i=t.parseHeader("contact",o)).uri.user===this.ua.contact.uri.user){r=i.getParam("expires");break}i=null;}if(!i){this.logger.warn("no Contact header pointing to us, response ignored");break}r||(r=this.expires),this.registrationTimer=e.Timers.setTimeout(function(){s.registrationTimer=null,s.register(s.options);},1e3*r-3e3),this.registrationExpiredTimer=e.Timers.setTimeout(function(){s.logger.warn("registration expired"),s.registered&&s.unregistered(null,e.C.causes.EXPIRES);},1e3*r),i.hasParam("temp-gruu")&&(this.ua.contact.temp_gruu=e.URI.parse(i.getParam("temp-gruu").replace(/"/g,""))),i.hasParam("pub-gruu")&&(this.ua.contact.pub_gruu=e.URI.parse(i.getParam("pub-gruu").replace(/"/g,""))),this.registered=!0,this.emit("registered",t||null);break;case/^423$/.test(t.status_code):t.hasHeader("min-expires")?(this.expires=t.getHeader("min-expires"),this.register(this.options)):(this.logger.warn("423 response received for REGISTER without Min-Expires"),this.registrationFailure(t,e.C.causes.SIP_FAILURE_CODE));break;default:n=e.Utils.sipErrorCause(t.status_code),this.registrationFailure(t,n);}},this.onRequestTimeout=function(){this.registrationFailure(null,e.C.causes.REQUEST_TIMEOUT);},this.onTransportError=function(){this.registrationFailure(null,e.C.causes.CONNECTION_ERROR);},this.cseq++,this.request.cseq=this.cseq,this.request.setHeader("cseq",this.cseq+" REGISTER"),this.request.extraHeaders=i,this.send();}},registrationFailure:{writable:!0,value:function(e,t){this.emit("failed",e||null,t||null);}},onTransportDisconnected:{writable:!0,value:function(){this.registered_before=this.registered,null!==this.registrationTimer&&(e.Timers.clearTimeout(this.registrationTimer),this.registrationTimer=null),null!==this.registrationExpiredTimer&&(e.Timers.clearTimeout(this.registrationExpiredTimer),this.registrationExpiredTimer=null),this.registered&&this.unregistered(null,e.C.causes.CONNECTION_ERROR);}},onTransportConnected:{writable:!0,value:function(){this.register(this.options);}},close:{writable:!0,value:function(){var e={all:!1,extraHeaders:this.closeHeaders};this.registered_before=this.registered,this.registered&&this.unregister(e);}},unregister:{writable:!0,value:function(t){var i;t=t||{},this.registered||t.all||this.logger.warn("Already unregistered, but sending an unregister anyways."),i=(t.extraHeaders||[]).slice(),this.registered=!1,null!==this.registrationTimer&&(e.Timers.clearTimeout(this.registrationTimer),this.registrationTimer=null),t.all?(i.push("Contact: *"),i.push("Expires: 0")):i.push("Contact: "+this.contact+";expires=0"),this.receiveResponse=function(t){var i;switch(!0){case/^1[0-9]{2}$/.test(t.status_code):this.emit("progress",t);break;case/^2[0-9]{2}$/.test(t.status_code):this.emit("accepted",t),null!==this.registrationExpiredTimer&&(e.Timers.clearTimeout(this.registrationExpiredTimer),this.registrationExpiredTimer=null),this.unregistered(t);break;default:i=e.Utils.sipErrorCause(t.status_code),this.unregistered(t,i);}},this.onRequestTimeout=function(){},this.cseq++,this.request.cseq=this.cseq,this.request.setHeader("cseq",this.cseq+" REGISTER"),this.request.extraHeaders=i,this.send();}},unregistered:{writable:!0,value:function(e,t){this.registered=!1,this.emit("unregistered",e||null,t||null);}}}),e.RegisterContext=t;};},function(e,t,i){e.exports=function(e){var t;(t=function(t,i){this.logger=i.getLogger("sip.requestsender"),this.ua=i,this.applicant=t,this.method=t.request.method,this.request=t.request,this.credentials=null,this.challenged=!1,this.staled=!1,i.status!==e.UA.C.STATUS_USER_CLOSED||this.method===e.C.BYE&&this.method===e.C.ACK||this.onTransportError();}).prototype={send:function(){switch(this.method){case"INVITE":this.clientTransaction=new e.Transactions.InviteClientTransaction(this,this.request,this.ua.transport);break;case"ACK":this.clientTransaction=new e.Transactions.AckClientTransaction(this,this.request,this.ua.transport);break;default:this.clientTransaction=new e.Transactions.NonInviteClientTransaction(this,this.request,this.ua.transport);}return this.clientTransaction.send(),this.clientTransaction},onRequestTimeout:function(){this.applicant.onRequestTimeout();},onTransportError:function(){this.applicant.onTransportError();},receiveResponse:function(t){var i,s,r,n=t.status_code;if(401===n||407===n){if(401===t.status_code?(s=t.parseHeader("www-authenticate"),r="authorization"):(s=t.parseHeader("proxy-authenticate"),r="proxy-authorization"),!s)return this.logger.warn(t.status_code+" with wrong or missing challenge, cannot authenticate"),void this.applicant.receiveResponse(t);if(!this.challenged||!this.staled&&!0===s.stale){if(this.credentials||(this.credentials=this.ua.configuration.authenticationFactory(this.ua)),!this.credentials.authenticate(this.request,s))return void this.applicant.receiveResponse(t);this.challenged=!0,s.stale&&(this.staled=!0),t.method===e.C.REGISTER?i=this.applicant.cseq+=1:this.request.dialog?i=this.request.dialog.local_seqnum+=1:(i=this.request.cseq+1,this.request.cseq=i),this.request.setHeader("cseq",i+" "+this.method),this.request.setHeader(r,this.credentials.toString()),this.send();}else this.applicant.receiveResponse(t);}else this.applicant.receiveResponse(t);}},e.RequestSender=t;};},function(e,t,i){e.exports=function(e){var t;return (t=function(e,t,i){this.dialog=e,this.applicant=t,this.request=i,this.reattempt=!1,this.reattemptTimer=null;}).prototype={send:function(){var t=this,i=new e.RequestSender(this,this.dialog.owner.ua);i.send(),this.request.method===e.C.INVITE&&i.clientTransaction.state!==e.Transactions.C.STATUS_TERMINATED&&(this.dialog.uac_pending_reply=!0,i.clientTransaction.on("stateChanged",function i(){this.state!==e.Transactions.C.STATUS_ACCEPTED&&this.state!==e.Transactions.C.STATUS_COMPLETED&&this.state!==e.Transactions.C.STATUS_TERMINATED||(this.removeListener("stateChanged",i),t.dialog.uac_pending_reply=!1);}));},onRequestTimeout:function(){this.applicant.onRequestTimeout();},onTransportError:function(){this.applicant.onTransportError();},receiveResponse:function(t){var i=this;408===t.status_code||481===t.status_code?this.applicant.onDialogError(t):t.method===e.C.INVITE&&491===t.status_code?this.reattempt?this.applicant.receiveResponse(t):(this.request.cseq.value=this.dialog.local_seqnum+=1,this.reattemptTimer=e.Timers.setTimeout(function(){i.applicant.owner.status!==e.Session.C.STATUS_TERMINATED&&(i.reattempt=!0,i.request_sender.send());},this.getReattemptTimeout())):this.applicant.receiveResponse(t);}},t};},function(e,t,i){e.exports=function(e){var t,s=i(24)(e),r={STATUS_EARLY:1,STATUS_CONFIRMED:2};(t=function(t,i,s,n){var o;if(this.uac_pending_reply=!1,this.uas_pending_reply=!1,!i.hasHeader("contact"))return {error:"unable to create a Dialog without Contact header field"};n=i instanceof e.IncomingResponse?i.status_code<200?r.STATUS_EARLY:r.STATUS_CONFIRMED:n||r.STATUS_CONFIRMED,o=i.parseHeader("contact"),"UAS"===s?(this.id={call_id:i.call_id,local_tag:i.to_tag,remote_tag:i.from_tag,toString:function(){return this.call_id+this.local_tag+this.remote_tag}},this.state=n,this.remote_seqnum=i.cseq,this.local_uri=i.parseHeader("to").uri,this.remote_uri=i.parseHeader("from").uri,this.remote_target=o.uri,this.route_set=i.getHeaders("record-route"),this.invite_seqnum=i.cseq,this.local_seqnum=i.cseq):"UAC"===s&&(this.id={call_id:i.call_id,local_tag:i.from_tag,remote_tag:i.to_tag,toString:function(){return this.call_id+this.local_tag+this.remote_tag}},this.state=n,this.invite_seqnum=i.cseq,this.local_seqnum=i.cseq,this.local_uri=i.parseHeader("from").uri,this.pracked=[],this.remote_uri=i.parseHeader("to").uri,this.remote_target=o.uri,this.route_set=i.getHeaders("record-route").reverse()),this.logger=t.ua.getLogger("sip.dialog",this.id.toString()),this.owner=t,t.ua.dialogs[this.id.toString()]=this,this.logger.log("new "+s+" dialog created with status "+(this.state===r.STATUS_EARLY?"EARLY":"CONFIRMED")),t.emit("dialog",this);}).prototype={update:function(e,t){this.state=r.STATUS_CONFIRMED,this.logger.log("dialog "+this.id.toString()+"  changed to CONFIRMED state"),"UAC"===t&&(this.route_set=e.getHeaders("record-route").reverse());},terminate:function(){this.logger.log("dialog "+this.id.toString()+" deleted"),this.sessionDescriptionHandler&&this.state!==r.STATUS_CONFIRMED&&this.sessionDescriptionHandler.close(),delete this.owner.ua.dialogs[this.id.toString()];},createRequest:function(t,i,s){var r,n;return i=(i||[]).slice(),this.local_seqnum||(this.local_seqnum=Math.floor(1e4*Math.random())),r=t===e.C.CANCEL||t===e.C.ACK?this.invite_seqnum:this.local_seqnum+=1,(n=new e.OutgoingRequest(t,this.remote_target,this.owner.ua,{cseq:r,call_id:this.id.call_id,from_uri:this.local_uri,from_tag:this.id.local_tag,to_uri:this.remote_uri,to_tag:this.id.remote_tag,route_set:this.route_set},i,s)).dialog=this,n},checkInDialogRequest:function(t){var i=this;if(this.remote_seqnum){if(t.cseq<this.remote_seqnum)return t.method!==e.C.ACK&&t.reply(500),t.cseq===this.invite_seqnum}else this.remote_seqnum=t.cseq;switch(t.method){case e.C.INVITE:if(!0===this.uac_pending_reply)t.reply(491);else{if(!0===this.uas_pending_reply&&t.cseq>this.remote_seqnum){var s=1+(10*Math.random()|0);return t.reply(500,null,["Retry-After:"+s]),this.remote_seqnum=t.cseq,!1}this.uas_pending_reply=!0,t.server_transaction.on("stateChanged",function t(){this.state!==e.Transactions.C.STATUS_ACCEPTED&&this.state!==e.Transactions.C.STATUS_COMPLETED&&this.state!==e.Transactions.C.STATUS_TERMINATED||(this.removeListener("stateChanged",t),i.uas_pending_reply=!1);});}t.hasHeader("contact")&&t.server_transaction.on("stateChanged",function(){this.state===e.Transactions.C.STATUS_ACCEPTED&&(i.remote_target=t.parseHeader("contact").uri);});break;case e.C.NOTIFY:t.hasHeader("contact")&&t.server_transaction.on("stateChanged",function(){this.state===e.Transactions.C.STATUS_COMPLETED&&(i.remote_target=t.parseHeader("contact").uri);});}return t.cseq>this.remote_seqnum&&(this.remote_seqnum=t.cseq),!0},sendRequest:function(e,t,i){var r=((i=i||{}).extraHeaders||[]).slice(),n=null;i.body&&(i.body.body?n=i.body:((n={}).body=i.body,i.contentType&&(n.contentType=i.contentType)));var o=this.createRequest(t,r,n);return new s(this,e,o).send(),o},receiveRequest:function(e){this.checkInDialogRequest(e)&&this.owner.receiveRequest(e);}},t.C=r,e.Dialog=t;};},function(e,t,i){e.exports=function(e){var t={STATUS_TRYING:1,STATUS_PROCEEDING:2,STATUS_CALLING:3,STATUS_ACCEPTED:4,STATUS_COMPLETED:5,STATUS_TERMINATED:6,STATUS_CONFIRMED:7,NON_INVITE_CLIENT:"nict",NON_INVITE_SERVER:"nist",INVITE_CLIENT:"ict",INVITE_SERVER:"ist"};function i(e,t,i){var s;return s="SIP/2.0/"+(e.ua.configuration.hackViaTcp?"TCP":t.server.scheme),s+=" "+e.ua.configuration.viaHost+";branch="+i,e.ua.configuration.forceRport&&(s+=";rport"),s}var s=function(e,s,r){var n;this.type=t.NON_INVITE_CLIENT,this.transport=r,this.id="z9hG4bK"+Math.floor(1e7*Math.random()),this.request_sender=e,this.request=s,this.logger=e.ua.getLogger("sip.transaction.nict",this.id),n=i(e,r,this.id),this.request.setHeader("via",n),this.request_sender.ua.newTransaction(this);};(s.prototype=Object.create(e.EventEmitter.prototype)).stateChanged=function(e){this.state=e,this.emit("stateChanged");},s.prototype.send=function(){this.stateChanged(t.STATUS_TRYING),this.F=e.Timers.setTimeout(this.timer_F.bind(this),e.Timers.TIMER_F),this.transport.send(this.request).catch(function(){this.onTransportError();}.bind(this));},s.prototype.onTransportError=function(){this.logger.log("transport error occurred, deleting non-INVITE client transaction "+this.id),e.Timers.clearTimeout(this.F),e.Timers.clearTimeout(this.K),this.stateChanged(t.STATUS_TERMINATED),this.request_sender.ua.destroyTransaction(this),this.request_sender.onTransportError();},s.prototype.timer_F=function(){this.logger.debug("Timer F expired for non-INVITE client transaction "+this.id),this.stateChanged(t.STATUS_TERMINATED),this.request_sender.ua.destroyTransaction(this),this.request_sender.onRequestTimeout();},s.prototype.timer_K=function(){this.stateChanged(t.STATUS_TERMINATED),this.request_sender.ua.destroyTransaction(this);},s.prototype.receiveResponse=function(i){var s=i.status_code;if(s<200)switch(this.state){case t.STATUS_TRYING:case t.STATUS_PROCEEDING:this.stateChanged(t.STATUS_PROCEEDING),this.request_sender.receiveResponse(i);}else switch(this.state){case t.STATUS_TRYING:case t.STATUS_PROCEEDING:this.stateChanged(t.STATUS_COMPLETED),e.Timers.clearTimeout(this.F),408===s?this.request_sender.onRequestTimeout():this.request_sender.receiveResponse(i),this.K=e.Timers.setTimeout(this.timer_K.bind(this),e.Timers.TIMER_K);}};var r=function(e,s,r){var n,o=this;this.type=t.INVITE_CLIENT,this.transport=r,this.id="z9hG4bK"+Math.floor(1e7*Math.random()),this.request_sender=e,this.request=s,this.logger=e.ua.getLogger("sip.transaction.ict",this.id),n=i(e,r,this.id),this.request.setHeader("via",n),this.request_sender.ua.newTransaction(this),this.request.cancel=function(e,t){for(var i=(t=(t||[]).slice()).length,s=null,r=0;r<i;r++)s=(s||"")+t[r].trim()+"\r\n";o.cancel_request(o,e,s);};};(r.prototype=Object.create(e.EventEmitter.prototype)).stateChanged=function(e){this.state=e,this.emit("stateChanged");},r.prototype.send=function(){this.stateChanged(t.STATUS_CALLING),this.B=e.Timers.setTimeout(this.timer_B.bind(this),e.Timers.TIMER_B),this.transport.send(this.request).catch(function(){this.onTransportError();}.bind(this));},r.prototype.onTransportError=function(){this.logger.log("transport error occurred, deleting INVITE client transaction "+this.id),e.Timers.clearTimeout(this.B),e.Timers.clearTimeout(this.D),e.Timers.clearTimeout(this.M),this.stateChanged(t.STATUS_TERMINATED),this.request_sender.ua.destroyTransaction(this),this.state!==t.STATUS_ACCEPTED&&this.request_sender.onTransportError();},r.prototype.timer_M=function(){this.logger.debug("Timer M expired for INVITE client transaction "+this.id),this.state===t.STATUS_ACCEPTED&&(e.Timers.clearTimeout(this.B),this.stateChanged(t.STATUS_TERMINATED),this.request_sender.ua.destroyTransaction(this));},r.prototype.timer_B=function(){this.logger.debug("Timer B expired for INVITE client transaction "+this.id),this.state===t.STATUS_CALLING&&(this.stateChanged(t.STATUS_TERMINATED),this.request_sender.ua.destroyTransaction(this),this.request_sender.onRequestTimeout());},r.prototype.timer_D=function(){this.logger.debug("Timer D expired for INVITE client transaction "+this.id),e.Timers.clearTimeout(this.B),this.stateChanged(t.STATUS_TERMINATED),this.request_sender.ua.destroyTransaction(this);},r.prototype.sendACK=function(t){var i,s=this;t=t||{},i=this.response.getHeader("contact")?this.response.parseHeader("contact").uri:this.request.ruri;var r=new e.OutgoingRequest("ACK",i,this.request.ua,{cseq:this.response.cseq,call_id:this.response.call_id,from_uri:this.response.from.uri,from_tag:this.response.from_tag,to_uri:this.response.to.uri,to_tag:this.response.to_tag,route_set:this.response.getHeaders("record-route").reverse()},t.extraHeaders||[],t.body);return this.ackSender=new e.RequestSender({request:r,onRequestTimeout:this.request_sender.applicant.applicant?this.request_sender.applicant.applicant.onRequestTimeout:function(){s.logger.warn("ACK Request timed out");},onTransportError:this.request_sender.applicant.applicant?this.request_sender.applicant.applicant.onRequestTransportError:function(){s.logger.warn("ACK Request had a transport error");},receiveResponse:t.receiveResponse||function(){s.logger.warn("Received a response to an ACK which was unexpected. Dropping Response.");}},this.request.ua).send(),r},r.prototype.cancel_request=function(i,s,r){var n=i.request;this.cancel=e.C.CANCEL+" "+n.ruri+" SIP/2.0\r\n",this.cancel+="Via: "+n.headers.Via.toString()+"\r\n",this.request.headers.Route&&(this.cancel+="Route: "+n.headers.Route.toString()+"\r\n"),this.cancel+="To: "+n.headers.To.toString()+"\r\n",this.cancel+="From: "+n.headers.From.toString()+"\r\n",this.cancel+="Call-ID: "+n.headers["Call-ID"].toString()+"\r\n",this.cancel+="Max-Forwards: "+e.UA.C.MAX_FORWARDS+"\r\n",this.cancel+="CSeq: "+n.headers.CSeq.toString().split(" ")[0]+" CANCEL\r\n",s&&(this.cancel+="Reason: "+s+"\r\n"),r&&(this.cancel+=r),this.cancel+="Content-Length: 0\r\n\r\n",this.state===t.STATUS_PROCEEDING&&this.transport.send(this.cancel);},r.prototype.receiveResponse=function(i){var s=i.status_code;if(i.transaction=this,this.response&&this.response.status_code===i.status_code&&this.response.cseq===i.cseq)return this.logger.debug("ICT Received a retransmission for cseq: "+i.cseq),void(this.ackSender&&this.ackSender.send());if(this.response=i,s>=100&&s<=199)switch(this.state){case t.STATUS_CALLING:this.stateChanged(t.STATUS_PROCEEDING),this.request_sender.receiveResponse(i),this.cancel&&this.transport.send(this.cancel);break;case t.STATUS_PROCEEDING:this.request_sender.receiveResponse(i);}else if(s>=200&&s<=299)switch(this.state){case t.STATUS_CALLING:case t.STATUS_PROCEEDING:this.stateChanged(t.STATUS_ACCEPTED),this.M=e.Timers.setTimeout(this.timer_M.bind(this),e.Timers.TIMER_M),this.request_sender.receiveResponse(i);break;case t.STATUS_ACCEPTED:this.request_sender.receiveResponse(i);}else if(s>=300&&s<=699)switch(this.state){case t.STATUS_CALLING:case t.STATUS_PROCEEDING:this.stateChanged(t.STATUS_COMPLETED),this.sendACK(),this.request_sender.receiveResponse(i);break;case t.STATUS_COMPLETED:this.sendACK();}};var n=function(e,t,s){var r;this.transport=s,this.id="z9hG4bK"+Math.floor(1e7*Math.random()),this.request_sender=e,this.request=t,this.logger=e.ua.getLogger("sip.transaction.nict",this.id),r=i(e,s,this.id),this.request.setHeader("via",r);};(n.prototype=Object.create(e.EventEmitter.prototype)).send=function(){this.transport.send(this.request).catch(function(){this.onTransportError();}.bind(this));},n.prototype.onTransportError=function(){this.logger.log("transport error occurred, for an ACK client transaction "+this.id),this.request_sender.onTransportError();};var o=function(e,i){this.type=t.NON_INVITE_SERVER,this.id=e.via_branch,this.request=e,this.transport=i.transport,this.ua=i,this.last_response="",e.server_transaction=this,this.logger=i.getLogger("sip.transaction.nist",this.id),this.state=t.STATUS_TRYING,i.newTransaction(this);};(o.prototype=Object.create(e.EventEmitter.prototype)).stateChanged=function(e){this.state=e,this.emit("stateChanged");},o.prototype.timer_J=function(){this.logger.debug("Timer J expired for non-INVITE server transaction "+this.id),this.stateChanged(t.STATUS_TERMINATED),this.ua.destroyTransaction(this);},o.prototype.onTransportError=function(){this.transportError||(this.transportError=!0,this.logger.log("transport error occurred, deleting non-INVITE server transaction "+this.id),e.Timers.clearTimeout(this.J),this.stateChanged(t.STATUS_TERMINATED),this.ua.destroyTransaction(this));},o.prototype.receiveResponse=function(i,s){var r=e.Utils.defer();if(100===i)switch(this.state){case t.STATUS_TRYING:this.stateChanged(t.STATUS_PROCEEDING),this.transport.send(s).catch(function(){this.onTransportError();}.bind(this));break;case t.STATUS_PROCEEDING:this.last_response=s,this.transport.send(s).then(function(){r.resolve();}).catch(function(){this.onTransportError(),r.reject();}.bind(this));}else if(i>=200&&i<=699)switch(this.state){case t.STATUS_TRYING:case t.STATUS_PROCEEDING:this.stateChanged(t.STATUS_COMPLETED),this.last_response=s,this.J=e.Timers.setTimeout(this.timer_J.bind(this),e.Timers.TIMER_J),this.transport.send(s).then(function(){r.resolve();}).catch(function(){this.onTransportError(),r.reject();}.bind(this));}return r.promise};var a=function(e,i){this.type=t.INVITE_SERVER,this.id=e.via_branch,this.request=e,this.transport=i.transport,this.ua=i,this.last_response="",e.server_transaction=this,this.logger=i.getLogger("sip.transaction.ist",this.id),this.state=t.STATUS_PROCEEDING,i.newTransaction(this),this.resendProvisionalTimer=null,e.reply(100);};(a.prototype=Object.create(e.EventEmitter.prototype)).stateChanged=function(e){this.state=e,this.emit("stateChanged");},a.prototype.timer_H=function(){this.logger.debug("Timer H expired for INVITE server transaction "+this.id),this.state===t.STATUS_COMPLETED&&this.logger.warn("transactions","ACK for INVITE server transaction was never received, call will be terminated"),this.stateChanged(t.STATUS_TERMINATED),this.ua.destroyTransaction(this);},a.prototype.timer_I=function(){this.stateChanged(t.STATUS_TERMINATED),this.ua.destroyTransaction(this);},a.prototype.timer_L=function(){this.logger.debug("Timer L expired for INVITE server transaction "+this.id),this.state===t.STATUS_ACCEPTED&&(this.stateChanged(t.STATUS_TERMINATED),this.ua.destroyTransaction(this));},a.prototype.onTransportError=function(){this.transportError||(this.transportError=!0,this.logger.log("transport error occurred, deleting INVITE server transaction "+this.id),null!==this.resendProvisionalTimer&&(e.Timers.clearInterval(this.resendProvisionalTimer),this.resendProvisionalTimer=null),e.Timers.clearTimeout(this.L),e.Timers.clearTimeout(this.H),e.Timers.clearTimeout(this.I),this.stateChanged(t.STATUS_TERMINATED),this.ua.destroyTransaction(this));},a.prototype.resend_provisional=function(){this.transport.send(this.request).catch(function(){this.onTransportError();}.bind(this));},a.prototype.receiveResponse=function(i,s){var r=this,n=e.Utils.defer();if(i>=100&&i<=199)switch(this.state){case t.STATUS_PROCEEDING:this.transport.send(s).catch(function(){this.onTransportError();}.bind(this)),this.last_response=s;}if(i>100&&i<=199&&this.state===t.STATUS_PROCEEDING)null===this.resendProvisionalTimer&&(this.resendProvisionalTimer=e.Timers.setInterval(r.resend_provisional.bind(r),e.Timers.PROVISIONAL_RESPONSE_INTERVAL));else if(i>=200&&i<=299)switch(this.state){case t.STATUS_PROCEEDING:this.stateChanged(t.STATUS_ACCEPTED),this.last_response=s,this.L=e.Timers.setTimeout(r.timer_L.bind(r),e.Timers.TIMER_L),null!==this.resendProvisionalTimer&&(e.Timers.clearInterval(this.resendProvisionalTimer),this.resendProvisionalTimer=null);case t.STATUS_ACCEPTED:this.transport.send(s).then(function(){n.resolve();}).catch(function(e){this.logger.error(e),this.onTransportError(),n.reject();}.bind(this));}else if(i>=300&&i<=699)switch(this.state){case t.STATUS_PROCEEDING:null!==this.resendProvisionalTimer&&(e.Timers.clearInterval(this.resendProvisionalTimer),this.resendProvisionalTimer=null),this.transport.send(s).then(function(){this.stateChanged(t.STATUS_COMPLETED),this.H=e.Timers.setTimeout(r.timer_H.bind(r),e.Timers.TIMER_H),n.resolve();}.bind(this)).catch(function(e){this.logger.error(e),this.onTransportError(),n.reject();}.bind(this));}return n.promise};e.Transactions={C:t,checkTransaction:function(i,s){var r;switch(s.method){case e.C.INVITE:if(r=i.transactions.ist[s.via_branch]){switch(r.state){case t.STATUS_PROCEEDING:r.transport.send(r.last_response);}return !0}break;case e.C.ACK:if(!(r=i.transactions.ist[s.via_branch]))return !1;if(r.state===t.STATUS_ACCEPTED)return !1;if(r.state===t.STATUS_COMPLETED)return r.stateChanged(t.STATUS_CONFIRMED),r.I=e.Timers.setTimeout(r.timer_I.bind(r),e.Timers.TIMER_I),!0;break;case e.C.CANCEL:return (r=i.transactions.ist[s.via_branch])?(s.reply_sl(200),r.state!==t.STATUS_PROCEEDING):(s.reply_sl(481),!0);default:if(r=i.transactions.nist[s.via_branch]){switch(r.state){case t.STATUS_TRYING:break;case t.STATUS_PROCEEDING:case t.STATUS_COMPLETED:r.transport.send(r.last_response);}return !0}}},NonInviteClientTransaction:s,InviteClientTransaction:r,AckClientTransaction:n,NonInviteServerTransaction:o,InviteServerTransaction:a};};},function(e,t,i){e.exports=function(e){var t;(t=function(t,i,s){var r;if(!(t&&t instanceof e.URI))throw new TypeError('missing or invalid "uri" parameter');for(r in this.uri=t,this.parameters={},s)this.setParam(r,s[r]);Object.defineProperties(this,{friendlyName:{get:function(){return this.displayName||t.aor}},displayName:{get:function(){return i},set:function(e){i=0===e?"0":e;}}});}).prototype={setParam:function(e,t){e&&(this.parameters[e.toLowerCase()]=void 0===t||null===t?null:t.toString());},getParam:e.URI.prototype.getParam,hasParam:e.URI.prototype.hasParam,deleteParam:e.URI.prototype.deleteParam,clearParams:e.URI.prototype.clearParams,clone:function(){return new t(this.uri.clone(),this.displayName,JSON.parse(JSON.stringify(this.parameters)))},toString:function(){var e,t;for(t in e=this.displayName||0===this.displayName?'"'+this.displayName+'" ':"",e+="<"+this.uri.toString()+">",this.parameters)e+=";"+t,null!==this.parameters[t]&&(e+="="+this.parameters[t]);return e}},t.parse=function(t){return -1!==(t=e.Grammar.parse(t,"Name_Addr_Header"))?t:void 0},e.NameAddrHeader=t;};},function(e,t,i){e.exports=function(e){var t;(t=function(t,i,s,r,n,o){var a,c,h,u;if(!s)throw new TypeError('missing or invalid "host" parameter');for(a in t=t||e.C.SIP,this.parameters={},this.headers={},n)this.setParam(a,n[a]);for(c in o)this.setHeader(c,o[c]);h={scheme:t,user:i,host:s,port:r},u={scheme:t.toLowerCase(),user:i,host:s.toLowerCase(),port:r},Object.defineProperties(this,{_normal:{get:function(){return u}},_raw:{get:function(){return h}},scheme:{get:function(){return u.scheme},set:function(e){h.scheme=e,u.scheme=e.toLowerCase();}},user:{get:function(){return u.user},set:function(e){u.user=h.user=e;}},host:{get:function(){return u.host},set:function(e){h.host=e,u.host=e.toLowerCase();}},aor:{get:function(){return u.user+"@"+u.host}},port:{get:function(){return u.port},set:function(e){u.port=h.port=0===e?e:parseInt(e,10)||null;}}});}).prototype={setParam:function(e,t){e&&(this.parameters[e.toLowerCase()]=void 0===t||null===t?null:t.toString().toLowerCase());},getParam:function(e){if(e)return this.parameters[e.toLowerCase()]},hasParam:function(e){if(e)return !!this.parameters.hasOwnProperty(e.toLowerCase())},deleteParam:function(e){var t;if(e=e.toLowerCase(),this.parameters.hasOwnProperty(e))return t=this.parameters[e],delete this.parameters[e],t},clearParams:function(){this.parameters={};},setHeader:function(t,i){this.headers[e.Utils.headerize(t)]=i instanceof Array?i:[i];},getHeader:function(t){if(t)return this.headers[e.Utils.headerize(t)]},hasHeader:function(t){if(t)return !!this.headers.hasOwnProperty(e.Utils.headerize(t))},deleteHeader:function(t){var i;if(t=e.Utils.headerize(t),this.headers.hasOwnProperty(t))return i=this.headers[t],delete this.headers[t],i},clearHeaders:function(){this.headers={};},clone:function(){return new t(this._raw.scheme,this._raw.user,this._raw.host,this._raw.port,JSON.parse(JSON.stringify(this.parameters)),JSON.parse(JSON.stringify(this.headers)))},toRaw:function(){return this._toString(this._raw)},toString:function(){return this._toString(this._normal)},_toString:function(t){var i,s,r,n,o=[];for(s in n=t.scheme+":",t.scheme.toLowerCase().match("^sips?$")||(n+="//"),t.user&&(n+=e.Utils.escapeUser(t.user)+"@"),n+=t.host,(t.port||0===t.port)&&(n+=":"+t.port),this.parameters)n+=";"+s,null!==this.parameters[s]&&(n+="="+this.parameters[s]);for(i in this.headers)for(r in this.headers[i])o.push(i+"="+this.headers[i][r]);return o.length>0&&(n+="?"+o.join("&")),n}},t.parse=function(t){return -1!==(t=e.Grammar.parse(t,"SIP_URI"))?t:void 0},e.URI=t;};},function(e,t,i){e.exports=function(e){var t,i,s,r;function n(t){var i=t.ua.configuration.hackAllowUnregisteredOptionTags,s=[],r={};return t.method===e.C.REGISTER?s.push("path","gruu"):t.method===e.C.INVITE&&(t.ua.contact.pub_gruu||t.ua.contact.temp_gruu)&&s.push("gruu"),t.ua.configuration.rel100===e.C.supported.SUPPORTED&&s.push("100rel"),t.ua.configuration.replaces===e.C.supported.SUPPORTED&&s.push("replaces"),s.push("outbound"),"Supported: "+(s=(s=s.concat(t.ua.configuration.extraSupported)).filter(function(t){var s=e.C.OPTION_TAGS[t],n=!r[t];return r[t]=!0,(s||i)&&n})).join(", ")+"\r\n"}(t=function(t,i,s,r,n,o){var a,c,h,u,l,d;if(r=r||{},!t||!i||!s)return null;this.logger=s.getLogger("sip.sipmessage"),this.ua=s,this.headers={},this.method=t,this.ruri=i,this.body=o,this.extraHeaders=(n||[]).slice(),this.statusCode=r.status_code,this.reasonPhrase=r.reason_phrase,r.route_set?this.setHeader("route",r.route_set):s.configuration.usePreloadedRoute&&this.setHeader("route",s.transport.server.sip_uri),this.setHeader("via",""),this.setHeader("max-forwards",e.UA.C.MAX_FORWARDS),l=r.to_uri||i,a=r.to_displayName||0===r.to_displayName?'"'+r.to_displayName+'" ':"",a+="<"+(l&&l.toRaw?l.toRaw():l)+">",a+=r.to_tag?";tag="+r.to_tag:"",this.to=new e.NameAddrHeader.parse(a),this.setHeader("to",a),d=r.from_uri||s.configuration.uri,c=r.from_displayName||0===r.from_displayName?'"'+r.from_displayName+'" ':s.configuration.displayName?'"'+s.configuration.displayName+'" ':"",c+="<"+(d&&d.toRaw?d.toRaw():d)+">;tag=",c+=r.from_tag||e.Utils.newTag(),this.from=new e.NameAddrHeader.parse(c),this.setHeader("from",c),h=r.call_id||s.configuration.sipjsId+e.Utils.createRandomToken(15),this.call_id=h,this.setHeader("call-id",h),u=r.cseq||Math.floor(1e4*Math.random()),this.cseq=u,this.setHeader("cseq",u+" "+t);}).prototype={setHeader:function(t,i){this.headers[e.Utils.headerize(t)]=i instanceof Array?i:[i];},getHeader:function(t){var i,s,r=this.extraHeaders.length,n=this.headers[e.Utils.headerize(t)];if(n){if(n[0])return n[0]}else for(i=new RegExp("^\\s*"+t+"\\s*:","i"),s=0;s<r;s++)if(n=this.extraHeaders[s],i.test(n))return n.substring(n.indexOf(":")+1).trim()},getHeaders:function(t){var i,s,r,n=this.headers[e.Utils.headerize(t)],o=[];if(n){for(s=n.length,i=0;i<s;i++)o.push(n[i]);return o}for(s=this.extraHeaders.length,r=new RegExp("^\\s*"+t+"\\s*:","i"),i=0;i<s;i++)n=this.extraHeaders[i],r.test(n)&&o.push(n.substring(n.indexOf(":")+1).trim());return o},hasHeader:function(t){var i,s,r=this.extraHeaders.length;if(this.headers[e.Utils.headerize(t)])return !0;for(i=new RegExp("^\\s*"+t+"\\s*:","i"),s=0;s<r;s++)if(i.test(this.extraHeaders[s]))return !0;return !1},toString:function(){var t,i,s,r="";for(t in r+=this.method+" "+(this.ruri.toRaw?this.ruri.toRaw():this.ruri)+" SIP/2.0\r\n",this.headers)for(i=this.headers[t].length,s=0;s<i;s++)r+=t+": "+this.headers[t][s]+"\r\n";for(i=this.extraHeaders.length,s=0;s<i;s++)r+=this.extraHeaders[s].trim()+"\r\n";return r+=n(this),r+="User-Agent: "+this.ua.configuration.userAgentString+"\r\n",this.body?"string"==typeof this.body?(r+="Content-Length: "+(i=e.Utils.str_utf8_length(this.body))+"\r\n\r\n",r+=this.body):this.body.body&&this.body.contentType?(i=e.Utils.str_utf8_length(this.body.body),r+="Content-Type: "+this.body.contentType+"\r\n",r+="Content-Length: "+i+"\r\n\r\n",r+=this.body.body):r+="Content-Length: 0\r\n\r\n":r+="Content-Length: 0\r\n\r\n",r}},(i=function(){this.data=null,this.headers=null,this.method=null,this.via=null,this.via_branch=null,this.call_id=null,this.cseq=null,this.from=null,this.from_tag=null,this.to=null,this.to_tag=null,this.body=null;}).prototype={addHeader:function(t,i){var s={raw:i};t=e.Utils.headerize(t),this.headers[t]?this.headers[t].push(s):this.headers[t]=[s];},getHeader:function(t){var i=this.headers[e.Utils.headerize(t)];if(i)return i[0]?i[0].raw:void 0},getHeaders:function(t){var i,s,r=this.headers[e.Utils.headerize(t)],n=[];if(!r)return [];for(s=r.length,i=0;i<s;i++)n.push(r[i].raw);return n},hasHeader:function(t){return !!this.headers[e.Utils.headerize(t)]},parseHeader:function(t,i){var s,r,n;if(t=e.Utils.headerize(t),i=i||0,this.headers[t]){if(!(i>=this.headers[t].length))return r=(s=this.headers[t][i]).raw,s.parsed?s.parsed:-1===(n=e.Grammar.parse(r,t.replace(/-/g,"_")))?(this.headers[t].splice(i,1),void this.logger.warn('error parsing "'+t+'" header field with value "'+r+'"')):(s.parsed=n,n);this.logger.log('not so many "'+t+'" headers present');}else this.logger.log('header "'+t+'" not present');},s:function(e,t){return this.parseHeader(e,t)},setHeader:function(t,i){var s={raw:i};this.headers[e.Utils.headerize(t)]=[s];},toString:function(){return this.data}},((s=function(e){this.logger=e.getLogger("sip.sipmessage"),this.ua=e,this.headers={},this.ruri=null,this.transport=null,this.server_transaction=null;}).prototype=new i).reply=function(t,i,s,r,o,a){var c,h,u,l,d,p=this.getHeader("To"),g=0,f=0;if(d=e.Utils.buildStatusLine(t,i),s=(s||[]).slice(),this.method===e.C.INVITE&&t>100&&t<=200)for(u=(c=this.getHeaders("record-route")).length;g<u;g++)d+="Record-Route: "+c[g]+"\r\n";for(u=(h=this.getHeaders("via")).length;f<u;f++)d+="Via: "+h[f]+"\r\n";for(!this.to_tag&&t>100?p+=";tag="+e.Utils.newTag():this.to_tag&&!this.s("to").hasParam("tag")&&(p+=";tag="+this.to_tag),d+="To: "+p+"\r\n",d+="From: "+this.getHeader("From")+"\r\n",d+="Call-ID: "+this.call_id+"\r\n",d+="CSeq: "+this.cseq+" "+this.method+"\r\n",u=s.length,l=0;l<u;l++)d+=s[l].trim()+"\r\n";return d+=n(this),d+="User-Agent: "+this.ua.configuration.userAgentString+"\r\n",r?"string"==typeof r?(d+="Content-Type: application/sdp\r\n",d+="Content-Length: "+(u=e.Utils.str_utf8_length(r))+"\r\n\r\n",d+=r):r.body&&r.contentType?(u=e.Utils.str_utf8_length(r.body),d+="Content-Type: "+r.contentType+"\r\n",d+="Content-Length: "+u+"\r\n\r\n",d+=r.body):d+="Content-Length: 0\r\n\r\n":d+="Content-Length: 0\r\n\r\n",this.server_transaction.receiveResponse(t,d).then(o,a),d},s.prototype.reply_sl=function(t,i){var s,r,n=0,o=this.getHeaders("via"),a=o.length;for(r=e.Utils.buildStatusLine(t,i);n<a;n++)r+="Via: "+o[n]+"\r\n";s=this.getHeader("To"),!this.to_tag&&t>100?s+=";tag="+e.Utils.newTag():this.to_tag&&!this.s("to").hasParam("tag")&&(s+=";tag="+this.to_tag),r+="To: "+s+"\r\n",r+="From: "+this.getHeader("From")+"\r\n",r+="Call-ID: "+this.call_id+"\r\n",r+="CSeq: "+this.cseq+" "+this.method+"\r\n",r+="User-Agent: "+this.ua.configuration.userAgentString+"\r\n",r+="Content-Length: 0\r\n\r\n",this.transport.send(r);},(r=function(e){this.logger=e.getLogger("sip.sipmessage"),this.headers={},this.status_code=null,this.reason_phrase=null;}).prototype=new i,e.OutgoingRequest=t,e.IncomingRequest=s,e.IncomingResponse=r;};},function(e,t,i){e.exports=function(e){var t;function i(e,t){var i=t,s=0,r=0;if(e.substring(i,i+2).match(/(^\r\n)/))return -2;for(;0===s;){if(-1===(r=e.indexOf("\r\n",i)))return r;!e.substring(r+2,r+4).match(/(^\r\n)/)&&e.charAt(r+2).match(/(^\s+)/)?i=r+2:s=r;}return s}function s(t,i,s,r){var n,o,a,c,h=i.indexOf(":",s),u=i.substring(s,h).trim(),l=i.substring(h+1,r).trim();switch(u.toLowerCase()){case"via":case"v":t.addHeader("via",l),1===t.getHeaders("via").length?(c=t.parseHeader("Via"))&&(t.via=c,t.via_branch=c.branch):c=0;break;case"from":case"f":t.setHeader("from",l),(c=t.parseHeader("from"))&&(t.from=c,t.from_tag=c.getParam("tag"));break;case"to":case"t":t.setHeader("to",l),(c=t.parseHeader("to"))&&(t.to=c,t.to_tag=c.getParam("tag"));break;case"record-route":if(-1===(c=e.Grammar.parse(l,"Record_Route"))){c=void 0;break}for(a=c.length,o=0;o<a;o++)n=c[o],t.addHeader("record-route",l.substring(n.position,n.offset)),t.headers["Record-Route"][t.getHeaders("record-route").length-1].parsed=n.parsed;break;case"call-id":case"i":t.setHeader("call-id",l),(c=t.parseHeader("call-id"))&&(t.call_id=l);break;case"contact":case"m":if(-1===(c=e.Grammar.parse(l,"Contact"))){c=void 0;break}for(a=c.length,o=0;o<a;o++)n=c[o],t.addHeader("contact",l.substring(n.position,n.offset)),t.headers.Contact[t.getHeaders("contact").length-1].parsed=n.parsed;break;case"content-length":case"l":t.setHeader("content-length",l),c=t.parseHeader("content-length");break;case"content-type":case"c":t.setHeader("content-type",l),c=t.parseHeader("content-type");break;case"cseq":t.setHeader("cseq",l),(c=t.parseHeader("cseq"))&&(t.cseq=c.value),t instanceof e.IncomingResponse&&(t.method=c.method);break;case"max-forwards":t.setHeader("max-forwards",l),c=t.parseHeader("max-forwards");break;case"www-authenticate":t.setHeader("www-authenticate",l),c=t.parseHeader("www-authenticate");break;case"proxy-authenticate":t.setHeader("proxy-authenticate",l),c=t.parseHeader("proxy-authenticate");break;case"refer-to":case"r":t.setHeader("refer-to",l),(c=t.parseHeader("refer-to"))&&(t.refer_to=c);break;default:t.setHeader(u,l),c=0;}return void 0!==c||{error:'error parsing header "'+u+'"'}}(t={}).parseMessage=function(t,r){var n,o,a,c,h,u=0,l=t.indexOf("\r\n"),d=r.getLogger("sip.parser");if(-1!==l){if(o=t.substring(0,l),-1!==(h=e.Grammar.parse(o,"Request_Response"))){for(h.status_code?((n=new e.IncomingResponse(r)).status_code=h.status_code,n.reason_phrase=h.reason_phrase):((n=new e.IncomingRequest(r)).method=h.method,n.ruri=h.uri),n.data=t,u=l+2;;){if(-2===(l=i(t,u))){c=u+2;break}if(-1===l)return void d.error("malformed message");if(!0!==(h=s(n,t,u,l)))return void d.error(h.error);u=l+2;}return n.hasHeader("content-length")?(a=n.getHeader("content-length"),n.body=t.substr(c,a)):n.body=t.substring(c),n}d.warn('error parsing first line of SIP message: "'+o+'"');}else d.warn("no CRLF found, not a SIP message, discarded");},e.Parser=t;};},function(e,t,i){var s=500;e.exports=function(e){var t={T1:s,T2:4e3,T4:5e3,TIMER_B:32e3,TIMER_D:0,TIMER_F:32e3,TIMER_H:32e3,TIMER_I:0,TIMER_J:0,TIMER_K:0,TIMER_L:32e3,TIMER_M:32e3,TIMER_N:32e3,PROVISIONAL_RESPONSE_INTERVAL:6e4};return ["setTimeout","clearTimeout","setInterval","clearInterval"].forEach(function(i){t[i]=function(){return e[i].apply(e,arguments)};}),t};},function(e,t,i){var s;e.exports={ConfigurationError:(s=function(e,t){this.code=1,this.name="CONFIGURATION_ERROR",this.parameter=e,this.value=t,this.message=this.value?"Invalid value "+JSON.stringify(this.value)+' for parameter "'+this.parameter+'"':"Missing parameter: "+this.parameter;},s.prototype=new Error,s),InvalidStateError:function(){var e=function(e){this.code=2,this.name="INVALID_STATE_ERROR",this.status=e,this.message="Invalid status: "+e;};return e.prototype=new Error,e}(),NotSupportedError:function(){var e=function(e){this.code=3,this.name="NOT_SUPPORTED_ERROR",this.message=e;};return e.prototype=new Error,e}(),GetDescriptionError:function(){var e=function(e){this.code=4,this.name="GET_DESCRIPTION_ERROR",this.message=e;};return e.prototype=new Error,e}(),RenegotiationError:function(){var e=function(e){this.code=5,this.name="RENEGOTIATION_ERROR",this.message=e;};return e.prototype=new Error,e}(),MethodParameterError:function(){var e=function(e,t,i){this.code=6,this.name="METHOD_PARAMETER_ERROR",this.method=e,this.parameter=t,this.value=i,this.message=this.value?"Invalid value "+JSON.stringify(this.value)+' for parameter "'+this.parameter+'"':"Missing parameter: "+this.parameter;};return e.prototype=new Error,e}(),TransportError:function(){var e=function(e){this.code=7,this.name="TRANSPORT_ERROR",this.message=e;};return e.prototype=new Error,e}()};},function(e,t,i){e.exports=function(e,t){return {USER_AGENT:e+"/"+t,SIP:"sip",SIPS:"sips",causes:{CONNECTION_ERROR:"Connection Error",REQUEST_TIMEOUT:"Request Timeout",SIP_FAILURE_CODE:"SIP Failure Code",INTERNAL_ERROR:"Internal Error",BUSY:"Busy",REJECTED:"Rejected",REDIRECTED:"Redirected",UNAVAILABLE:"Unavailable",NOT_FOUND:"Not Found",ADDRESS_INCOMPLETE:"Address Incomplete",INCOMPATIBLE_SDP:"Incompatible SDP",AUTHENTICATION_ERROR:"Authentication Error",DIALOG_ERROR:"Dialog Error",WEBRTC_NOT_SUPPORTED:"WebRTC Not Supported",WEBRTC_ERROR:"WebRTC Error",CANCELED:"Canceled",NO_ANSWER:"No Answer",EXPIRES:"Expires",NO_ACK:"No ACK",NO_PRACK:"No PRACK",USER_DENIED_MEDIA_ACCESS:"User Denied Media Access",BAD_MEDIA_DESCRIPTION:"Bad Media Description",RTP_TIMEOUT:"RTP Timeout"},supported:{UNSUPPORTED:"none",SUPPORTED:"supported",REQUIRED:"required"},SIP_ERROR_CAUSES:{REDIRECTED:[300,301,302,305,380],BUSY:[486,600],REJECTED:[403,603],NOT_FOUND:[404,604],UNAVAILABLE:[480,410,408,430],ADDRESS_INCOMPLETE:[484],INCOMPATIBLE_SDP:[488,606],AUTHENTICATION_ERROR:[401,407]},ACK:"ACK",BYE:"BYE",CANCEL:"CANCEL",INFO:"INFO",INVITE:"INVITE",MESSAGE:"MESSAGE",NOTIFY:"NOTIFY",OPTIONS:"OPTIONS",REGISTER:"REGISTER",UPDATE:"UPDATE",SUBSCRIBE:"SUBSCRIBE",PUBLISH:"PUBLISH",REFER:"REFER",PRACK:"PRACK",REASON_PHRASE:{100:"Trying",180:"Ringing",181:"Call Is Being Forwarded",182:"Queued",183:"Session Progress",199:"Early Dialog Terminated",200:"OK",202:"Accepted",204:"No Notification",300:"Multiple Choices",301:"Moved Permanently",302:"Moved Temporarily",305:"Use Proxy",380:"Alternative Service",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",410:"Gone",412:"Conditional Request Failed",413:"Request Entity Too Large",414:"Request-URI Too Long",415:"Unsupported Media Type",416:"Unsupported URI Scheme",417:"Unknown Resource-Priority",420:"Bad Extension",421:"Extension Required",422:"Session Interval Too Small",423:"Interval Too Brief",428:"Use Identity Header",429:"Provide Referrer Identity",430:"Flow Failed",433:"Anonymity Disallowed",436:"Bad Identity-Info",437:"Unsupported Certificate",438:"Invalid Identity Header",439:"First Hop Lacks Outbound Support",440:"Max-Breadth Exceeded",469:"Bad Info Package",470:"Consent Needed",478:"Unresolvable Destination",480:"Temporarily Unavailable",481:"Call/Transaction Does Not Exist",482:"Loop Detected",483:"Too Many Hops",484:"Address Incomplete",485:"Ambiguous",486:"Busy Here",487:"Request Terminated",488:"Not Acceptable Here",489:"Bad Event",491:"Request Pending",493:"Undecipherable",494:"Security Agreement Required",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Server Time-out",505:"Version Not Supported",513:"Message Too Large",580:"Precondition Failure",600:"Busy Everywhere",603:"Decline",604:"Does Not Exist Anywhere",606:"Not Acceptable"},OPTION_TAGS:{"100rel":!0,199:!0,answermode:!0,"early-session":!0,eventlist:!0,explicitsub:!0,"from-change":!0,"geolocation-http":!0,"geolocation-sip":!0,gin:!0,gruu:!0,histinfo:!0,ice:!0,join:!0,"multiple-refer":!0,norefersub:!0,nosub:!0,outbound:!0,path:!0,policy:!0,precondition:!0,pref:!0,privacy:!0,"recipient-list-invite":!0,"recipient-list-message":!0,"recipient-list-subscribe":!0,replaces:!0,"resource-priority":!0,"sdp-anat":!0,"sec-agree":!0,tdialog:!0,timer:!0,uui:!0},dtmfType:{INFO:"info",RTP:"rtp"}}};},function(e,t){function i(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0;}function s(e){return "function"==typeof e}function r(e){return "object"==typeof e&&null!==e}function n(e){return void 0===e}e.exports=i,i.EventEmitter=i,i.prototype._events=void 0,i.prototype._maxListeners=void 0,i.defaultMaxListeners=10,i.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},i.prototype.emit=function(e){var t,i,o,a,c,h;if(this._events||(this._events={}),"error"===e&&(!this._events.error||r(this._events.error)&&!this._events.error.length)){if((t=arguments[1])instanceof Error)throw t;var u=new Error('Uncaught, unspecified "error" event. ('+t+")");throw u.context=t,u}if(n(i=this._events[e]))return !1;if(s(i))switch(arguments.length){case 1:i.call(this);break;case 2:i.call(this,arguments[1]);break;case 3:i.call(this,arguments[1],arguments[2]);break;default:a=Array.prototype.slice.call(arguments,1),i.apply(this,a);}else if(r(i))for(a=Array.prototype.slice.call(arguments,1),o=(h=i.slice()).length,c=0;c<o;c++)h[c].apply(this,a);return !0},i.prototype.addListener=function(e,t){var o;if(!s(t))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,s(t.listener)?t.listener:t),this._events[e]?r(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,r(this._events[e])&&!this._events[e].warned&&(o=n(this._maxListeners)?i.defaultMaxListeners:this._maxListeners)&&o>0&&this._events[e].length>o&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace()),this},i.prototype.on=i.prototype.addListener,i.prototype.once=function(e,t){if(!s(t))throw TypeError("listener must be a function");var i=!1;function r(){this.removeListener(e,r),i||(i=!0,t.apply(this,arguments));}return r.listener=t,this.on(e,r),this},i.prototype.removeListener=function(e,t){var i,n,o,a;if(!s(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(o=(i=this._events[e]).length,n=-1,i===t||s(i.listener)&&i.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(r(i)){for(a=o;a-- >0;)if(i[a]===t||i[a].listener&&i[a].listener===t){n=a;break}if(n<0)return this;1===i.length?(i.length=0,delete this._events[e]):i.splice(n,1),this._events.removeListener&&this.emit("removeListener",e,t);}return this},i.prototype.removeAllListeners=function(e){var t,i;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(s(i=this._events[e]))this.removeListener(e,i);else if(i)for(;i.length;)this.removeListener(e,i[i.length-1]);return delete this._events[e],this},i.prototype.listeners=function(e){return this._events&&this._events[e]?s(this._events[e])?[this._events[e]]:this._events[e].slice():[]},i.prototype.listenerCount=function(e){if(this._events){var t=this._events[e];if(s(t))return 1;if(t)return t.length}return 0},i.listenerCount=function(e,t){return e.listenerCount(t)};},function(e,t,i){var s=i(34).EventEmitter;e.exports=function(){function e(){s.call(this);}return e.prototype=Object.create(s.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),e};},function(e,t,i){var s={error:0,warn:1,log:2,debug:3};e.exports=function(e){var t=function(){var e,t=2,i=!0,r=null;this.loggers={},e=this.getLogger("sip.loggerfactory"),Object.defineProperties(this,{builtinEnabled:{get:function(){return i},set:function(t){"boolean"==typeof t?i=t:e.error('invalid "builtinEnabled" parameter value: '+JSON.stringify(t));}},level:{get:function(){return t},set:function(i){i>=0&&i<=3?t=i:i>3?t=3:s.hasOwnProperty(i)?t=s[i]:e.error('invalid "level" parameter value: '+JSON.stringify(i));}},connector:{get:function(){return r},set:function(t){null===t||""===t||void 0===t?r=null:"function"==typeof t?r=t:e.error('invalid "connector" parameter value: '+JSON.stringify(t));}}});};function i(e,t,i){this.logger=e,this.category=t,this.label=i;}return t.prototype.print=function(t,i,s,r){if("string"==typeof r){var n=[new Date,i];s&&n.push(s),r=n.concat(r).join(" | ");}t.call(e,r);},Object.keys(s).forEach(function(r){i.prototype[r]=function(e){this.logger[r](this.category,this.label,e);},t.prototype[r]=function(t,i,n){this.level>=s[r]&&(this.builtinEnabled&&this.print(e[r],t,i,n),this.connector&&this.connector(r,t,i,n));};}),t.prototype.getLogger=function(e,t){var s;return t&&3===this.level?new i(this,e,t):this.loggers[e]?this.loggers[e]:(s=new i(this,e),this.loggers[e]=s,s)},t};},function(e,t,i){e.exports=function(e,t){var i;i={Promise:t.Promise,defer:function(){var e={};return e.promise=new i.Promise(function(t,i){e.resolve=t,e.reject=i;}),e},reducePromises:function(t,i){return t.reduce(function(e,t){return e=e.then(t)},e.Utils.Promise.resolve(i))},augment:function(e,t,i,s){var r,n;for(r in n=t.prototype)(s||void 0===e[r])&&(e[r]=n[r]);t.apply(e,i);},defaultOptions:function(e,t){return e=e||{},t=t||{},Object.assign({},e,t)},optionsOverride:function(e,t,i,s,r,n){s&&e[i]&&r.warn(i+" is deprecated, please use "+t+" instead"),e[t]&&e[i]&&r.warn(t+" overriding "+i),e[t]=e[t]||e[i]||n;},str_utf8_length:function(e){return encodeURIComponent(e).replace(/%[A-F\d]{2}/g,"U").length},generateFakeSDP:function(e){if(e){var t=e.indexOf("o="),i=e.indexOf("\r\n",t);return "v=0\r\n"+e.slice(t,i)+"\r\ns=-\r\nt=0 0\r\nc=IN IP4 0.0.0.0"}},isFunction:function(e){return void 0!==e&&"[object Function]"===Object.prototype.toString.call(e)},isDecimal:function(e){return !isNaN(e)&&parseFloat(e)===parseInt(e,10)},createRandomToken:function(e,t){var i,s="";for(t=t||32,i=0;i<e;i++)s+=(Math.random()*t|0).toString(t);return s},newTag:function(){return e.Utils.createRandomToken(e.UA.C.TAG_LENGTH)},newUUID:function(){return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return ("x"===e?t:3&t|8).toString(16)})},hostType:function(t){if(t)return -1!==(t=e.Grammar.parse(t,"host"))?t.host_type:void 0},normalizeTarget:function(t,i){var s,r,n;if(t){if(t instanceof e.URI)return t;if("string"==typeof t){switch((s=t.split("@")).length){case 1:if(!i)return;r=t,n=i;break;case 2:r=s[0],n=s[1];break;default:r=s.slice(0,s.length-1).join("@"),n=s[s.length-1];}return r=r.replace(/^(sips?|tel):/i,""),/^[\-\.\(\)]*\+?[0-9\-\.\(\)]+$/.test(r)&&(r=r.replace(/[\-\.\(\)]/g,"")),t=e.C.SIP+":"+e.Utils.escapeUser(r)+"@"+n,e.URI.parse(t)}}},escapeUser:function(e){return encodeURIComponent(decodeURIComponent(e)).replace(/%3A/gi,":").replace(/%2B/gi,"+").replace(/%3F/gi,"?").replace(/%2F/gi,"/")},headerize:function(e){var t,i={"Call-Id":"Call-ID",Cseq:"CSeq","Min-Se":"Min-SE",Rack:"RAck",Rseq:"RSeq","Www-Authenticate":"WWW-Authenticate"},s=e.toLowerCase().replace(/_/g,"-").split("-"),r="",n=s.length;for(t=0;t<n;t++)0!==t&&(r+="-"),r+=s[t].charAt(0).toUpperCase()+s[t].substring(1);return i[r]&&(r=i[r]),r},sipErrorCause:function(t){var i;for(i in e.C.SIP_ERROR_CAUSES)if(-1!==e.C.SIP_ERROR_CAUSES[i].indexOf(t))return e.C.causes[i];return e.C.causes.SIP_FAILURE_CODE},getReasonPhrase:function(t,i){return i||e.C.REASON_PHRASE[t]||""},getReasonHeaderValue:function(t,i){return "SIP;cause="+t+';text="'+(i=e.Utils.getReasonPhrase(t,i))+'"'},getCancelReason:function(t,i){if(t&&t<200||t>699)throw new TypeError("Invalid status_code: "+t);if(t)return e.Utils.getReasonHeaderValue(t,i)},buildStatusLine:function(e,t){if(e=e||null,t=t||null,!e||e<100||e>699)throw new TypeError("Invalid status_code: "+e);if(t&&"string"!=typeof t&&!(t instanceof String))throw new TypeError("Invalid reason_phrase: "+t);return "SIP/2.0 "+e+" "+(t=i.getReasonPhrase(e,t))+"\r\n"},getRandomTestNetIP:function(){return "192.0.2."+(e=1,t=254,Math.floor(Math.random()*(t-e+1)+e));var e,t;}},e.Utils=i;};},function(e){e.exports={name:"sip.js",title:"SIP.js",description:"A simple, intuitive, and powerful JavaScript signaling library",version:"0.11.1",main:"dist/sip.min.js",browser:{"./src/environment.js":"./src/environment_browser.js"},homepage:"https://sipjs.com",author:"OnSIP <developer@onsip.com> (https://sipjs.com/aboutus/)",contributors:[{url:"https://github.com/onsip/SIP.js/blob/master/THANKS.md"}],repository:{type:"git",url:"https://github.com/onsip/SIP.js.git"},keywords:["sip","websocket","webrtc","library","javascript"],devDependencies:{"babel-core":"^6.26.0","babel-loader":"^7.1.2","babel-preset-env":"^1.6.1",eslint:"^4.9.0",jasmine:"^3.1.0",karma:"^2.0.2","karma-cli":"^1.0.1","karma-jasmine":"^1.1.0","karma-jasmine-html-reporter":"^1.1.0","karma-mocha-reporter":"^2.2.5","karma-phantomjs-launcher":"^1.0.4","karma-webpack":"^3.0.0",pegjs:"^0.10.0","pegjs-loader":"^0.5.4","phantomjs-polyfill-object-assign":"0.0.2","uglifyjs-webpack-plugin":"^1.2.5",webpack:"^4.8.3","webpack-cli":"^2.1.3"},engines:{node:">=6.0"},license:"MIT",scripts:{prebuild:"eslint src/*.js src/**/*.js","build-dev":"webpack --progress --env.buildType dev","build-prod":"webpack --progress --env.buildType prod","copy-dist-files":"cp dist/sip.js dist/sip-$npm_package_version.js && cp dist/sip.min.js  dist/sip-$npm_package_version.min.js",build:"npm run build-dev && npm run build-prod && npm run copy-dist-files",browserTest:"sleep 2 && open http://0.0.0.0:9876/debug.html & karma start --reporters kjhtml --no-single-run",commandLineTest:"karma start --reporters mocha --browsers PhantomJS --single-run",buildAndTest:"npm run build && npm run commandLineTest",buildAndBrowserTest:"npm run build && npm run browserTest"},dependencies:{"crypto-js":"^3.1.9-1"},optionalDependencies:{promiscuous:"^0.6.0"}};},function(e,t,i){e.exports=function(e){var t=i(38),s=t.version,r=t.title,n=Object.defineProperties({},{version:{get:function(){return s}},name:{get:function(){return r}}});return i(37)(n,e),n.LoggerFactory=i(36)(e.console),n.EventEmitter=i(35)(),n.C=i(33)(n.name,n.version),n.Exceptions=i(32),n.Timers=i(31)(e.timers),n.Transport=i(1)(n),i(30)(n),i(29)(n),i(28)(n),i(27)(n),i(26)(n),i(25)(n),i(23)(n),i(22)(n),n.SessionDescriptionHandler=i(21)(n.EventEmitter),i(20)(n),i(19)(n),i(18)(n),i(16)(n),i(15)(n),i(14)(n,e),i(10)(n),n.DigestAuthentication=i(9)(n.Utils),n.Grammar=i(6)(n),n.Web={Modifiers:i(4)(n),Simple:i(3)(n)},n};},function(e,t,i){e.exports=i(39)(i(2));}])});
	});

	var SIP = unwrapExports(sip_min);
	var sip_min_1 = sip_min.SIP;

	/**
	 * @fileoverview SessionDescriptionHandlerObserver
	 */

	 /* SessionDescriptionHandlerObserver
	  * @class SessionDescriptionHandler Observer Class.
	  * @param {SIP.Session} session
	  * @param {Object} [options]
	  */

	// Constructor
	var SessionDescriptionHandlerObserver = function(session, options) {
	  this.session = session || {};
	  this.options = options || {};
	};

	SessionDescriptionHandlerObserver.prototype = {
	  trackAdded: function() {
	    this.session.emit('trackAdded');
	  },

	  directionChanged: function() {
	    this.session.emit('directionChanged');
	  },
	};

	var SessionDescriptionHandlerObserver_1 = SessionDescriptionHandlerObserver;

	/**
	 * @fileoverview SessionDescriptionHandler
	 */

	 /* SessionDescriptionHandler
	  * @class PeerConnection helper Class.
	  * @param {SIP.Session} session
	  * @param {Object} [options]
	  */
	var SessionDescriptionHandler = function (SIP) {

	// Constructor
	var SessionDescriptionHandler = function(logger, observer, options) {
	  // TODO: Validate the options
	  this.options = options || {};

	  this.logger = logger;
	  this.observer = observer;
	  this.dtmfSender = null;

	  this.shouldAcquireMedia = true;

	  this.CONTENT_TYPE = 'application/sdp';

	  this.C = {};
	  this.C.DIRECTION = {
	    NULL:     null,
	    SENDRECV: "sendrecv",
	    SENDONLY: "sendonly",
	    RECVONLY: "recvonly",
	    INACTIVE: "inactive"
	  };

	  this.logger.log('SessionDescriptionHandlerOptions: ' + JSON.stringify(this.options));

	  this.direction = this.C.DIRECTION.NULL;

	  this.modifiers = this.options.modifiers || [];
	  if (!Array.isArray(this.modifiers)) {
	    this.modifiers = [this.modifiers];
	  }

	  var environment = commonjsGlobal.window || commonjsGlobal;
	  this.WebRTC = {
	    MediaStream           : environment.MediaStream,
	    getUserMedia          : environment.navigator.mediaDevices.getUserMedia.bind(environment.navigator.mediaDevices),
	    RTCPeerConnection     : environment.RTCPeerConnection,
	    RTCSessionDescription : environment.RTCSessionDescription
	  };

	  this.iceGatheringDeferred = null;
	  this.iceGatheringTimeout = false;
	  this.iceGatheringTimer = null;

	  this.initPeerConnection(this.options.peerConnectionOptions);

	  this.constraints = this.checkAndDefaultConstraints(this.options.constraints);
	};

	/**
	 * @param {SIP.Session} session
	 * @param {Object} [options]
	 */

	SessionDescriptionHandler.defaultFactory = function defaultFactory (session, options) {
	  var logger = session.ua.getLogger('sip.invitecontext.sessionDescriptionHandler', session.id);
	  var SessionDescriptionHandlerObserver = SessionDescriptionHandlerObserver_1;
	  var observer = new SessionDescriptionHandlerObserver(session, options);
	  return new SessionDescriptionHandler(logger, observer, options);
	};

	SessionDescriptionHandler.prototype = Object.create(SIP.SessionDescriptionHandler.prototype, {
	  // Functions the sesssion can use

	  /**
	   * Destructor
	   */
	  close: {writable: true, value: function () {
	    this.logger.log('closing PeerConnection');
	    // have to check signalingState since this.close() gets called multiple times
	    if(this.peerConnection && this.peerConnection.signalingState !== 'closed') {
	      if (this.peerConnection.getSenders) {
	        this.peerConnection.getSenders().forEach(function(sender) {
	          if (sender.track) {
	            sender.track.stop();
	          }
	        });
	      } else {
	        this.logger.warn('Using getLocalStreams which is deprecated');
	        this.peerConnection.getLocalStreams().forEach(function(stream) {
	          stream.getTracks().forEach(function(track) {
	            track.stop();
	          });
	        });
	      }
	      if (this.peerConnection.getReceivers) {
	        this.peerConnection.getReceivers().forEach(function(receiver) {
	          if (receiver.track) {
	            receiver.track.stop();
	          }
	        });
	      } else {
	        this.logger.warn('Using getRemoteStreams which is deprecated');
	        this.peerConnection.getRemoteStreams().forEach(function(stream) {
	          stream.getTracks().forEach(function(track) {
	            track.stop();
	          });
	        });
	      }
	      this.resetIceGatheringComplete();
	      this.peerConnection.close();
	    }
	  }},

	  /**
	   * Gets the local description from the underlying media implementation
	   * @param {Object} [options] Options object to be used by getDescription
	   * @param {MediaStreamConstraints} [options.constraints] MediaStreamConstraints https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
	   * @param {Object} [options.peerConnectionOptions] If this is set it will recreate the peer connection with the new options
	   * @param {Array} [modifiers] Array with one time use description modifiers
	   * @returns {Promise} Promise that resolves with the local description to be used for the session
	   */
	  getDescription: {writable: true, value: function (options, modifiers) {
	    options = options || {};
	    if (options.peerConnectionOptions) {
	      this.initPeerConnection(options.peerConnectionOptions);
	    }

	    // Merge passed constraints with saved constraints and save
	    var newConstraints = Object.assign({}, this.constraints, options.constraints);
	    newConstraints = this.checkAndDefaultConstraints(newConstraints);
	    if (JSON.stringify(newConstraints) !== JSON.stringify(this.constraints)) {
	        this.constraints = newConstraints;
	        this.shouldAcquireMedia = true;
	    }

	    modifiers = modifiers || [];
	    if (!Array.isArray(modifiers)) {
	      modifiers = [modifiers];
	    }
	    modifiers = modifiers.concat(this.modifiers);

	    return SIP.Utils.Promise.resolve()
	    .then(function() {
	      if (this.shouldAcquireMedia) {
	        return this.acquire(this.constraints).then(function() {
	          this.shouldAcquireMedia = false;
	        }.bind(this));
	      }
	    }.bind(this))
	    .then(function() {
	      return this.createOfferOrAnswer(options.RTCOfferOptions, modifiers);
	    }.bind(this))
	    .then(function(sdp) {
	      return {
	        body: sdp,
	        contentType: this.CONTENT_TYPE
	      };
	    }.bind(this));
	  }},

	  /**
	   * Check if the Session Description Handler can handle the Content-Type described by a SIP Message
	   * @param {String} contentType The content type that is in the SIP Message
	   * @returns {boolean}
	   */
	  hasDescription: {writable: true, value: function hasDescription (contentType) {
	    return contentType === this.CONTENT_TYPE;
	  }},

	  /**
	   * The modifier that should be used when the session would like to place the call on hold
	   * @param {String} [sdp] The description that will be modified
	   * @returns {Promise} Promise that resolves with modified SDP
	   */
	  holdModifier: {writable: true, value: function holdModifier (description) {
	    if (!(/a=(sendrecv|sendonly|recvonly|inactive)/).test(description.sdp)) {
	      description.sdp = description.sdp.replace(/(m=[^\r]*\r\n)/g, '$1a=sendonly\r\n');
	    } else {
	      description.sdp = description.sdp.replace(/a=sendrecv\r\n/g, 'a=sendonly\r\n');
	      description.sdp = description.sdp.replace(/a=recvonly\r\n/g, 'a=inactive\r\n');
	    }
	    return SIP.Utils.Promise.resolve(description);
	  }},

	  /**
	   * Set the remote description to the underlying media implementation
	   * @param {String} sessionDescription The description provided by a SIP message to be set on the media implementation
	   * @param {Object} [options] Options object to be used by getDescription
	   * @param {MediaStreamConstraints} [options.constraints] MediaStreamConstraints https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
	   * @param {Object} [options.peerConnectionOptions] If this is set it will recreate the peer connection with the new options
	   * @param {Array} [modifiers] Array with one time use description modifiers
	   * @returns {Promise} Promise that resolves once the description is set
	   */
	  setDescription: {writable:true, value: function setDescription (sessionDescription, options, modifiers) {
	    var self = this;

	    options = options || {};
	    if (options.peerConnectionOptions) {
	      this.initPeerConnection(options.peerConnectionOptions);
	    }

	    modifiers = modifiers || [];
	    if (!Array.isArray(modifiers)) {
	      modifiers = [modifiers];
	    }
	    modifiers = modifiers.concat(this.modifiers);

	    var description = {
	      type: this.hasOffer('local') ? 'answer' : 'offer',
	      sdp: sessionDescription
	    };

	    return SIP.Utils.Promise.resolve()
	    .then(function() {
	      if (this.shouldAcquireMedia) {
	        return this.acquire(this.constrains).then(function() {
	          this.shouldAcquireMedia = false;
	        }.bind(this));
	      }
	    }.bind(this))
	    .then(function() {
	      return SIP.Utils.reducePromises(modifiers, description);
	    })
	    .catch(function modifierError(e) {
	      self.logger.error("The modifiers did not resolve successfully");
	      self.logger.error(e);
	      throw e;
	    })
	    .then(function(modifiedDescription) {
	      self.emit('setDescription', modifiedDescription);
	      return self.peerConnection.setRemoteDescription(new self.WebRTC.RTCSessionDescription(modifiedDescription));
	    })
	    .catch(function setRemoteDescriptionError(e) {
	      self.logger.error(e);
	      self.emit('peerConnection-setRemoteDescriptionFailed', e);
	      throw e;
	    })
	    .then(function setRemoteDescriptionSuccess() {
	      if (self.peerConnection.getReceivers) {
	        self.emit('setRemoteDescription', self.peerConnection.getReceivers());
	      } else {
	        self.emit('setRemoteDescription', self.peerConnection.getRemoteStreams());
	      }
	      self.emit('confirmed', self);
	    });
	  }},

	  /**
	   * Send DTMF via RTP (RFC 4733)
	   * @param {String} tones A string containing DTMF digits
	   * @param {Object} [options] Options object to be used by sendDtmf
	   * @returns {boolean} true if DTMF send is successful, false otherwise
	   */
	  sendDtmf: {writable: true, value: function sendDtmf (tones, options) {
	    if (!this.dtmfSender && this.hasBrowserGetSenderSupport()) {
	      var senders = this.peerConnection.getSenders();
	      if (senders.length > 0) {
	        this.dtmfSender = senders[0].dtmf;
	      }
	    }
	    if (!this.dtmfSender && this.hasBrowserTrackSupport()) {
	      var streams = this.peerConnection.getLocalStreams();
	      if (streams.length > 0) {
	        var audioTracks = streams[0].getAudioTracks();
	        if (audioTracks.length > 0) {
	          this.dtmfSender = this.peerConnection.createDTMFSender(audioTracks[0]);
	        }
	      }
	    }
	    if (!this.dtmfSender) {
	      return false;
	    }
	    try {
	      this.dtmfSender.insertDTMF(tones, options.duration, options.interToneGap);
	    }
	    catch (e) {
	      if (e.type ===  "InvalidStateError" || e.type ===  "InvalidCharacterError") {
	        this.logger.error(e);
	        return false;
	      } else {
	        throw e;
	      }
	    }
	    this.logger.log('DTMF sent via RTP: ' + tones.toString());
	    return true;
	  }},

	  getDirection: {writable: true, value: function getDirection() {
	    return this.direction;
	  }},

	  // Internal functions
	  createOfferOrAnswer: {writable: true, value: function createOfferOrAnswer (RTCOfferOptions, modifiers) {
	    var self = this;
	    var methodName;
	    var pc = this.peerConnection;

	    RTCOfferOptions = RTCOfferOptions || {};

	    methodName = self.hasOffer('remote') ? 'createAnswer' : 'createOffer';

	    return pc[methodName](RTCOfferOptions)
	      .catch(function methodError(e) {
	        self.emit('peerConnection-' + methodName + 'Failed', e);
	        throw e;
	      })
	      .then(function(sdp) {
	        return SIP.Utils.reducePromises(modifiers, self.createRTCSessionDescriptionInit(sdp));
	      })
	      .then(function(sdp) {
	        self.resetIceGatheringComplete();
	        return pc.setLocalDescription(sdp);
	      })
	      .catch(function localDescError(e) {
	        self.emit('peerConnection-SetLocalDescriptionFailed', e);
	        throw e;
	      })
	      .then(function onSetLocalDescriptionSuccess() {
	        return self.waitForIceGatheringComplete();
	      })
	      .then(function readySuccess() {
	        var localDescription = self.createRTCSessionDescriptionInit(self.peerConnection.localDescription);
	        return SIP.Utils.reducePromises(modifiers, localDescription);
	      })
	      .then(function(localDescription) {
	        self.emit('getDescription', localDescription);
	        self.setDirection(localDescription.sdp);
	        return localDescription.sdp;
	      })
	      .catch(function createOfferOrAnswerError (e) {
	        self.logger.error(e);
	        // TODO: Not sure if this is correct
	        throw new SIP.Exceptions.GetDescriptionError(e);
	      });
	  }},

	  // Creates an RTCSessionDescriptionInit from an RTCSessionDescription
	  createRTCSessionDescriptionInit: {writable: true, value: function createRTCSessionDescriptionInit(RTCSessionDescription) {
	    return {
	      type: RTCSessionDescription.type,
	      sdp: RTCSessionDescription.sdp
	    };
	  }},

	  addDefaultIceCheckingTimeout: {writable: true, value: function addDefaultIceCheckingTimeout (peerConnectionOptions) {
	    if (peerConnectionOptions.iceCheckingTimeout === undefined) {
	      peerConnectionOptions.iceCheckingTimeout = 5000;
	    }
	    return peerConnectionOptions;
	  }},

	  addDefaultIceServers: {writable: true, value: function addDefaultIceServers (rtcConfiguration) {
	    if (!rtcConfiguration.iceServers) {
	      rtcConfiguration.iceServers = [{urls: 'stun:stun.l.google.com:19302'}];
	    }
	    return rtcConfiguration;
	  }},

	  checkAndDefaultConstraints: {writable: true, value: function checkAndDefaultConstraints (constraints) {
	    var defaultConstraints = {audio: true, video: true};
	    constraints = constraints || defaultConstraints;
	    // Empty object check
	    if (Object.keys(constraints).length === 0 && constraints.constructor === Object) {
	      return defaultConstraints;
	    }
	    return constraints;
	  }},

	  hasBrowserTrackSupport: {writable: true, value: function hasBrowserTrackSupport () {
	    return Boolean(this.peerConnection.addTrack);
	  }},

	  hasBrowserGetSenderSupport: {writable: true, value: function hasBrowserGetSenderSupport () {
	    return Boolean(this.peerConnection.getSenders);
	  }},

	  initPeerConnection: {writable: true, value: function initPeerConnection(options) {
	    var self = this;
	    options = options || {};
	    options = this.addDefaultIceCheckingTimeout(options);
	    options.rtcConfiguration = options.rtcConfiguration || {};
	    options.rtcConfiguration = this.addDefaultIceServers(options.rtcConfiguration);

	    this.logger.log('initPeerConnection');

	    if (this.peerConnection) {
	      this.logger.log('Already have a peer connection for this session. Tearing down.');
	      this.resetIceGatheringComplete();
	      this.peerConnection.close();
	    }

	    this.peerConnection = new this.WebRTC.RTCPeerConnection(options.rtcConfiguration);

	    this.logger.log('New peer connection created');

	    if ('ontrack' in this.peerConnection) {
	      this.peerConnection.addEventListener('track', function(e) {
	        self.logger.log('track added');
	        self.observer.trackAdded();
	        self.emit('addTrack', e);
	      });
	    } else {
	      this.logger.warn('Using onaddstream which is deprecated');
	      this.peerConnection.onaddstream = function(e) {
	        self.logger.log('stream added');
	        self.emit('addStream', e);
	      };
	    }

	    this.peerConnection.onicecandidate = function(e) {
	      self.emit('iceCandidate', e);
	      if (e.candidate) {
	        self.logger.log('ICE candidate received: '+ (e.candidate.candidate === null ? null : e.candidate.candidate.trim()));
	      }
	    };

	    this.peerConnection.onicegatheringstatechange = function () {
	      self.logger.log('RTCIceGatheringState changed: ' + this.iceGatheringState);
	      switch (this.iceGatheringState) {
	      case 'gathering':
	        self.emit('iceGathering', this);
	        if (!self.iceGatheringTimer && options.iceCheckingTimeout) {
	          self.iceGatheringTimeout = false;
	          self.iceGatheringTimer = SIP.Timers.setTimeout(function() {
	            self.logger.log('RTCIceChecking Timeout Triggered after ' + options.iceCheckingTimeout + ' milliseconds');
	            self.iceGatheringTimeout = true;
	            self.triggerIceGatheringComplete();
	          }, options.iceCheckingTimeout);
	        }
	        break;
	      case 'complete':
	        self.triggerIceGatheringComplete();
	        break;
	      }
	    };

	    this.peerConnection.oniceconnectionstatechange = function() {  //need e for commented out case
	      var stateEvent;

	      switch (this.iceConnectionState) {
	      case 'new':
	        stateEvent = 'iceConnection';
	        break;
	      case 'checking':
	        stateEvent = 'iceConnectionChecking';
	        break;
	      case 'connected':
	        stateEvent = 'iceConnectionConnected';
	        break;
	      case 'completed':
	        stateEvent = 'iceConnectionCompleted';
	        break;
	      case 'failed':
	        stateEvent = 'iceConnectionFailed';
	        break;
	      case 'disconnected':
	        stateEvent = 'iceConnectionDisconnected';
	        break;
	      case 'closed':
	        stateEvent = 'iceConnectionClosed';
	        break;
	      default:
	        self.logger.warn('Unknown iceConnection state:', this.iceConnectionState);
	        return;
	      }
	      self.emit(stateEvent, this);
	    };
	  }},

	  acquire: {writable: true, value: function acquire (constraints) {
	    // Default audio & video to true
	    constraints = this.checkAndDefaultConstraints(constraints);

	    return new SIP.Utils.Promise(function(resolve, reject) {
	      /*
	       * Make the call asynchronous, so that ICCs have a chance
	       * to define callbacks to `userMediaRequest`
	       */
	      this.logger.log('acquiring local media');
	      this.emit('userMediaRequest', constraints);

	      if (constraints.audio || constraints.video) {
	        this.WebRTC.getUserMedia(constraints)
	        .then(function(streams) {
	          this.observer.trackAdded();
	          this.emit('userMedia', streams);
	          resolve(streams);
	        }.bind(this)).catch(function(e) {
	          this.emit('userMediaFailed', e);
	          reject(e);
	        }.bind(this));
	      } else {
	        // Local streams were explicitly excluded.
	        resolve([]);
	      }
	    }.bind(this))
	    .catch(function acquireFailed(err) {
	      this.logger.error('unable to acquire streams');
	      this.logger.error(err);
	      return SIP.Utils.Promise.reject(err);
	    }.bind(this))
	    .then(function acquireSucceeded(streams) {
	      this.logger.log('acquired local media streams');
	      try {
	        // Remove old tracks
	        if (this.peerConnection.removeTrack) {
	          this.peerConnection.getSenders().forEach(function (sender) {
	            this.peerConnection.removeTrack(sender);
	          });
	        }
	        return streams;
	      } catch(e) {
	        return SIP.Utils.Promise.reject(e);
	      }
	    }.bind(this))
	    .catch(function removeStreamsFailed(err) {
	      this.logger.error('error removing streams');
	      this.logger.error(err);
	      return SIP.Utils.Promise.reject(err);
	    }.bind(this))
	    .then(function addStreams(streams) {
	      try {
	        streams = [].concat(streams);
	        streams.forEach(function (stream) {
	          if (this.peerConnection.addTrack) {
	            stream.getTracks().forEach(function (track) {
	              this.peerConnection.addTrack(track, stream);
	            }, this);
	          } else {
	            // Chrome 59 does not support addTrack
	            this.peerConnection.addStream(stream);
	          }
	        }, this);
	      } catch(e) {
	        return SIP.Utils.Promise.reject(e);
	      }
	      return SIP.Utils.Promise.resolve();
	    }.bind(this))
	    .catch(function addStreamsFailed(err) {
	      this.logger.error('error adding stream');
	      this.logger.error(err);
	      return SIP.Utils.Promise.reject(err);
	    }.bind(this));
	  }},

	  hasOffer: {writable: true, value: function hasOffer (where) {
	    var offerState = 'have-' + where + '-offer';
	    return this.peerConnection.signalingState === offerState;
	  }},

	  // ICE gathering state handling

	  isIceGatheringComplete: {writable: true, value: function isIceGatheringComplete() {
	    return this.peerConnection.iceGatheringState === 'complete' || this.iceGatheringTimeout;
	  }},

	  resetIceGatheringComplete: {writable: true, value: function resetIceGatheringComplete() {
	    this.iceGatheringTimeout = false;

	    if (this.iceGatheringTimer) {
	      SIP.Timers.clearTimeout(this.iceGatheringTimer);
	      this.iceGatheringTimer = null;
	    }

	    if (this.iceGatheringDeferred) {
	      this.iceGatheringDeferred.reject();
	      this.iceGatheringDeferred = null;
	    }
	  }},

	  setDirection: {writable: true, value: function setDirection(sdp) {
	    var match = sdp.match(/a=(sendrecv|sendonly|recvonly|inactive)/);
	    if (match === null) {
	      this.direction = this.C.DIRECTION.NULL;
	      this.observer.directionChanged();
	      return;
	    }
	    var direction = match[1];
	    switch (direction) {
	      case this.C.DIRECTION.SENDRECV:
	      case this.C.DIRECTION.SENDONLY:
	      case this.C.DIRECTION.RECVONLY:
	      case this.C.DIRECTION.INACTIVE:
	        this.direction = direction;
	        break;
	      default:
	        this.direction = this.C.DIRECTION.NULL;
	        break;
	    }
	    this.observer.directionChanged();
	  }},

	  triggerIceGatheringComplete: {writable: true, value: function triggerIceGatheringComplete() {
	    if (this.isIceGatheringComplete()) {
	      this.emit('iceGatheringComplete', this);

	      if (this.iceGatheringTimer) {
	        SIP.Timers.clearTimeout(this.iceGatheringTimer);
	        this.iceGatheringTimer = null;
	      }

	      if (this.iceGatheringDeferred) {
	        this.iceGatheringDeferred.resolve();
	        this.iceGatheringDeferred = null;
	      }
	    }
	  }},

	  waitForIceGatheringComplete: {writable: true, value: function waitForIceGatheringComplete() {
	    if (this.isIceGatheringComplete()) {
	      return SIP.Utils.Promise.resolve();
	    } else if (!this.isIceGatheringDeferred) {
	      this.iceGatheringDeferred = SIP.Utils.defer();
	    }
	    return this.iceGatheringDeferred.promise;
	  }}
	});

	return SessionDescriptionHandler;
	};

	//      

	class CallbacksHandler {
	                    

	  constructor() {
	    this.callbacks = {};
	  }

	  on(event        , callback          ) {
	    this.callbacks[event] = callback;
	  }

	  // trigger callback registered with .on('name', ...)
	  triggerCallback(eventName        , ...args            ) {
	    // Add event name at last argument, so we can know the event name if we do on('*', ...)
	    args.push(eventName);

	    if (this.callbacks['*']) {
	      this.callbacks['*'].apply(undefined, args);
	    }

	    if (!(eventName in this.callbacks)) {
	      return null;
	    }

	    return this.callbacks[eventName].apply(undefined, args);
	  }
	}

	/* eslint-disable */

	/* SessionDescriptionHandler
	 * @class PeerConnection helper Class.
	 * @param {SIP.Session} session
	 * @param {Object} [options]
	 */
	var MobileSessionDescriptionHandler = SIP => {
	  // Constructor
	  function MobileSessionDescriptionHandler(logger, observer, options) {
	    // TODO: Validate the options
	    this.options = options || {};

	    this.logger = logger;
	    this.observer = observer;
	    this.dtmfSender = null;

	    this.shouldAcquireMedia = true;

	    this.CONTENT_TYPE = 'application/sdp';

	    this.C = {};
	    this.C.DIRECTION = {
	      NULL: null,
	      SENDRECV: 'sendrecv',
	      SENDONLY: 'sendonly',
	      RECVONLY: 'recvonly',
	      INACTIVE: 'inactive'
	    };

	    this.logger.log(`SessionDescriptionHandlerOptions: ${JSON.stringify(this.options)}`);

	    this.direction = this.C.DIRECTION.NULL;

	    this.modifiers = this.options.modifiers || [];
	    if (!Array.isArray(this.modifiers)) {
	      this.modifiers = [this.modifiers];
	    }

	    const environment = global.window || global;
	    this.WebRTC = {
	      MediaStream: environment.MediaStream,
	      getUserMedia: environment.navigator.mediaDevices.getUserMedia.bind(environment.navigator.mediaDevices),
	      RTCPeerConnection: environment.RTCPeerConnection,
	      RTCSessionDescription: environment.RTCSessionDescription
	    };

	    this.iceGatheringDeferred = null;
	    this.iceGatheringTimeout = false;
	    this.iceGatheringTimer = null;

	    this.initPeerConnection(this.options.peerConnectionOptions);

	    this.constraints = this.checkAndDefaultConstraints(this.options.constraints);
	  }

	  /**
	   * @param {SIP.Session} session
	   * @param {Object} [options]
	   */

	  MobileSessionDescriptionHandler.defaultFactory = function defaultFactory(session, options) {
	    const logger = session.ua.getLogger('sip.invitecontext.sessionDescriptionHandler', session.id);
	    const observer = new SessionDescriptionHandlerObserver_1(session, options);

	    return new MobileSessionDescriptionHandler(logger, observer, options);
	  };

	  MobileSessionDescriptionHandler.prototype = Object.create(SessionDescriptionHandler(SIP).prototype, {
	    // Functions the sesssion can use

	    /**
	     * Destructor
	     */
	    close: {
	      writable: true,
	      value: function() {
	        this.logger.log('closing PeerConnection');
	        // have to check signalingState since this.close() gets called multiple times
	        if (this.peerConnection && this.peerConnection.signalingState !== 'closed') {
	          if (this.peerConnection.getSenders) {
	            this.peerConnection.getSenders().forEach(function(sender) {
	              if (sender.track) {
	                sender.track.stop();
	              }
	            });
	          } else {
	            this.logger.warn('Using getLocalStreams which is deprecated');
	            this.peerConnection.getLocalStreams().forEach(function(stream) {
	              stream.getTracks().forEach(function(track) {
	                track.stop();
	              });
	            });
	          }
	          if (this.peerConnection.getReceivers) {
	            this.peerConnection.getReceivers().forEach(function(receiver) {
	              if (receiver.track) {
	                receiver.track.stop();
	              }
	            });
	          } else {
	            this.logger.warn('Using getRemoteStreams which is deprecated');
	            this.peerConnection.getRemoteStreams().forEach(function(stream) {
	              stream.getTracks().forEach(function(track) {
	                track.stop();
	              });
	            });
	          }
	          this.resetIceGatheringComplete();
	          this.peerConnection.close();
	        }
	      }
	    },

	    /**
	     * Gets the local description from the underlying media implementation
	     * @param {Object} [options] Options object to be used by getDescription
	     * @param {MediaStreamConstraints} [options.constraints] MediaStreamConstraints https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
	     * @param {Object} [options.peerConnectionOptions] If this is set it will recreate the peer connection with the new options
	     * @param {Array} [modifiers] Array with one time use description modifiers
	     * @returns {Promise} Promise that resolves with the local description to be used for the session
	     */
	    getDescription: {
	      writable: true,
	      value: function(options, modifiers) {
	        options = options || {};
	        if (options.peerConnectionOptions) {
	          this.initPeerConnection(options.peerConnectionOptions);
	        }

	        // Merge passed constraints with saved constraints and save
	        var newConstraints = Object.assign({}, this.constraints, options.constraints);
	        newConstraints = this.checkAndDefaultConstraints(newConstraints);

	        modifiers = modifiers || [];
	        if (!Array.isArray(modifiers)) {
	          modifiers = [modifiers];
	        }
	        modifiers = modifiers.concat(this.modifiers);

	        return SIP.Utils.Promise.resolve()
	          .then(
	            function() {
	              if (this.shouldAcquireMedia) {
	                return this.acquire(this.constraints).then(
	                  function() {
	                    this.shouldAcquireMedia = false;
	                  }.bind(this)
	                );
	              }
	            }.bind(this)
	          )
	          .then(
	            function() {
	              return this.createOfferOrAnswer(options.RTCOfferOptions, modifiers);
	            }.bind(this)
	          )
	          .then(
	            function(sdp) {
	              return {
	                body: sdp,
	                contentType: this.CONTENT_TYPE
	              };
	            }.bind(this)
	          );
	      }
	    },

	    /**
	     * Check if the Session Description Handler can handle the Content-Type described by a SIP Message
	     * @param {String} contentType The content type that is in the SIP Message
	     * @returns {boolean}
	     */
	    hasDescription: {
	      writable: true,
	      value: function hasDescription(contentType) {
	        return contentType === this.CONTENT_TYPE;
	      }
	    },

	    /**
	     * The modifier that should be used when the session would like to place the call on hold
	     * @param {String} [sdp] The description that will be modified
	     * @returns {Promise} Promise that resolves with modified SDP
	     */
	    holdModifier: {
	      writable: true,
	      value: function holdModifier(description) {
	        if (!/a=(sendrecv|sendonly|recvonly|inactive)/.test(description.sdp)) {
	          description.sdp = description.sdp.replace(/(m=[^\r]*\r\n)/g, '$1a=sendonly\r\n');
	        } else {
	          description.sdp = description.sdp.replace(/a=sendrecv\r\n/g, 'a=sendonly\r\n');
	          description.sdp = description.sdp.replace(/a=recvonly\r\n/g, 'a=inactive\r\n');
	        }
	        return SIP.Utils.Promise.resolve(description);
	      }
	    },

	    /**
	     * Set the remote description to the underlying media implementation
	     * @param {String} sessionDescription The description provided by a SIP message to be set on the media implementation
	     * @param {Object} [options] Options object to be used by getDescription
	     * @param {MediaStreamConstraints} [options.constraints] MediaStreamConstraints https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
	     * @param {Object} [options.peerConnectionOptions] If this is set it will recreate the peer connection with the new options
	     * @param {Array} [modifiers] Array with one time use description modifiers
	     * @returns {Promise} Promise that resolves once the description is set
	     */
	    setDescription: {
	      writable: true,
	      value: function setDescription(sessionDescription, options, modifiers) {
	        var self = this;
	        const type = this.hasOffer('local') ? 'answer' : 'offer';

	        options = options || {};
	        if (options.peerConnectionOptions) {
	          this.initPeerConnection(options.peerConnectionOptions);
	        }

	        modifiers = modifiers || [];
	        if (!Array.isArray(modifiers)) {
	          modifiers = [modifiers];
	        }
	        modifiers = modifiers.concat(this.modifiers);

	        // Fix to allow incoming calls in iOS devices
	        // @see https://github.com/oney/react-native-webrtc/issues/293
	        if (sessionDescription.indexOf('BUNDLE audio') === -1 && type === 'offer') {
	          sessionDescription = sessionDescription.replace('\r\nm=audio', '\r\na=group:BUNDLE audio\r\nm=audio');
	        }

	        var description = {
	          type,
	          sdp: sessionDescription
	        };

	        return SIP.Utils.Promise.resolve()
	          .then(
	            function() {
	              if (this.shouldAcquireMedia) {
	                return this.acquire(this.constraints).then(
	                  function() {
	                    this.shouldAcquireMedia = false;
	                  }.bind(this)
	                );
	              }
	            }.bind(this)
	          )
	          .then(function() {
	            return SIP.Utils.reducePromises(modifiers, description);
	          })
	          .catch(function modifierError(e) {
	            self.logger.error('The modifiers did not resolve successfully');
	            self.logger.error(e);
	            throw e;
	          })
	          .then(function(modifiedDescription) {
	            self.emit('setDescription', description);
	            return self.peerConnection.setRemoteDescription(new self.WebRTC.RTCSessionDescription(modifiedDescription));
	          })
	          .catch(function setRemoteDescriptionError(e) {
	            self.logger.error(e);
	            self.emit('peerConnection-setRemoteDescriptionFailed', e);
	            throw e;
	          })
	          .then(function setRemoteDescriptionSuccess() {
	            if (self.peerConnection.getReceivers) {
	              self.emit('setRemoteDescription', self.peerConnection.getReceivers());
	            } else {
	              self.emit('setRemoteDescription', self.peerConnection.getRemoteStreams());
	            }
	            self.emit('confirmed', self);
	          });
	      }
	    },

	    getDirection: {
	      writable: true,
	      value: function getDirection() {
	        return this.direction;
	      }
	    },

	    // Internal functions
	    createOfferOrAnswer: {
	      writable: true,
	      value: function createOfferOrAnswer(RTCOfferOptions, modifiers) {
	        var self = this;
	        var methodName;
	        var pc = this.peerConnection;

	        RTCOfferOptions = RTCOfferOptions || {};

	        methodName = self.hasOffer('remote') ? 'createAnswer' : 'createOffer';

	        return pc[methodName](RTCOfferOptions)
	          .catch(function methodError(e) {
	            self.emit('peerConnection-' + methodName + 'Failed', e);
	            throw e;
	          })
	          .then(function(sdp) {
	            return SIP.Utils.reducePromises(modifiers, self.createRTCSessionDescriptionInit(sdp));
	          })
	          .then(function(sdp) {
	            self.resetIceGatheringComplete();
	            return pc.setLocalDescription(new self.WebRTC.RTCSessionDescription(sdp));
	          })
	          .catch(function localDescError(e) {
	            self.emit('peerConnection-SetLocalDescriptionFailed', e);
	            throw e;
	          })
	          .then(function onSetLocalDescriptionSuccess() {
	            return self.waitForIceGatheringComplete();
	          })
	          .then(function readySuccess() {
	            var localDescription = self.createRTCSessionDescriptionInit(self.peerConnection.localDescription);
	            return SIP.Utils.reducePromises(modifiers, localDescription);
	          })
	          .then(function(localDescription) {
	            self.emit('getDescription', localDescription);
	            self.setDirection(localDescription.sdp);
	            return localDescription.sdp;
	          })
	          .catch(function createOfferOrAnswerError(e) {
	            self.logger.error(e);
	            // TODO: Not sure if this is correct
	            throw new SIP.Exceptions.GetDescriptionError(e);
	          });
	      }
	    },

	    // Creates an RTCSessionDescriptionInit from an RTCSessionDescription
	    createRTCSessionDescriptionInit: {
	      writable: true,
	      value: function createRTCSessionDescriptionInit(RTCSessionDescription) {
	        return new this.WebRTC.RTCSessionDescription({
	          type: RTCSessionDescription.type,
	          sdp: RTCSessionDescription.sdp
	        });
	      }
	    },

	    addDefaultIceCheckingTimeout: {
	      writable: true,
	      value: function addDefaultIceCheckingTimeout(peerConnectionOptions) {
	        if (peerConnectionOptions.iceCheckingTimeout === undefined) {
	          peerConnectionOptions.iceCheckingTimeout = 5000;
	        }
	        return peerConnectionOptions;
	      }
	    },

	    checkAndDefaultConstraints: {
	      writable: true,
	      value: function checkAndDefaultConstraints(constraints) {
	        var defaultConstraints = { audio: true, video: true };
	        constraints = constraints || defaultConstraints;
	        // Empty object check
	        if (Object.keys(constraints).length === 0 && constraints.constructor === Object) {
	          return defaultConstraints;
	        }
	        return constraints;
	      }
	    },

	    initPeerConnection: {
	      writable: true,
	      value: function initPeerConnection(options) {
	        var self = this;
	        options = options || {};
	        options = this.addDefaultIceCheckingTimeout(options);
	        options.rtcConfiguration = options.rtcConfiguration || {};
	        options.rtcConfiguration = this.addDefaultIceServers(options.rtcConfiguration);

	        this.logger.log('initPeerConnection');

	        if (this.peerConnection) {
	          this.logger.log('Already have a peer connection for this session. Tearing down.');
	          this.resetIceGatheringComplete();
	          this.peerConnection.close();
	        }

	        this.peerConnection = new this.WebRTC.RTCPeerConnection(options.rtcConfiguration);

	        this.logger.log('New peer connection created');

	        if ('ontrack' in this.peerConnection) {
	          this.peerConnection.addEventListener('track', function(e) {
	            self.logger.log('track added');
	            self.observer.trackAdded();
	            self.emit('addTrack', e);
	          });
	        } else {
	          this.logger.warn('Using onaddstream which is deprecated');
	          this.peerConnection.onaddstream = function(e) {
	            self.logger.log('stream added');
	            self.emit('addStream', e);
	          };
	        }

	        this.peerConnection.onicecandidate = function(e) {
	          self.emit('iceCandidate', e);
	          if (e.candidate) {
	            self.logger.log(
	              'ICE candidate received: ' + (e.candidate.candidate === null ? null : e.candidate.candidate.trim())
	            );
	          }
	        };

	        this.peerConnection.onnegotiationneeded = function(e) {
	          console.log('onnegotiationneeded', e);
	        };

	        this.peerConnection.onicegatheringstatechange = function() {
	          self.logger.log('RTCIceGatheringState changed: ' + this.iceGatheringState);
	          switch (this.iceGatheringState) {
	            case 'gathering':
	              self.emit('iceGathering', this);
	              if (!self.iceGatheringTimer && options.iceCheckingTimeout) {
	                self.iceGatheringTimeout = false;
	                self.iceGatheringTimer = SIP.Timers.setTimeout(function() {
	                  self.logger.log(
	                    'RTCIceChecking Timeout Triggered after ' + options.iceCheckingTimeout + ' milliseconds'
	                  );
	                  self.iceGatheringTimeout = true;
	                  self.triggerIceGatheringComplete();
	                }, options.iceCheckingTimeout);
	              }
	              break;
	            case 'complete':
	              self.triggerIceGatheringComplete();
	              break;
	          }
	        };

	        this.peerConnection.oniceconnectionstatechange = function() {
	          //need e for commented out case
	          var stateEvent;

	          switch (this.iceConnectionState) {
	            case 'new':
	              stateEvent = 'iceConnection';
	              break;
	            case 'checking':
	              stateEvent = 'iceConnectionChecking';
	              break;
	            case 'connected':
	              stateEvent = 'iceConnectionConnected';
	              break;
	            case 'completed':
	              stateEvent = 'iceConnectionCompleted';
	              break;
	            case 'failed':
	              stateEvent = 'iceConnectionFailed';
	              break;
	            case 'disconnected':
	              stateEvent = 'iceConnectionDisconnected';
	              break;
	            case 'closed':
	              stateEvent = 'iceConnectionClosed';
	              break;
	            default:
	              self.logger.warn('Unknown iceConnection state:', this.iceConnectionState);
	              return;
	          }
	          self.emit(stateEvent, this);
	        };
	      }
	    },

	    acquire: {
	      writable: true,
	      value: function acquire(constraints) {
	        // Default audio & video to true
	        constraints = this.checkAndDefaultConstraints(constraints);

	        return new SIP.Utils.Promise(
	          function(resolve, reject) {
	            /*
	             * Make the call asynchronous, so that ICCs have a chance
	             * to define callbacks to `userMediaRequest`
	             */
	            this.logger.log('acquiring local media');
	            this.emit('userMediaRequest', constraints);

	            if (constraints.audio || constraints.video) {
	              this.WebRTC.getUserMedia(constraints)
	                .then(
	                  function(streams) {
	                    this.observer.trackAdded();
	                    this.emit('userMedia', streams);
	                    resolve(streams);
	                  }.bind(this)
	                )
	                .catch(
	                  function(e) {
	                    this.emit('userMediaFailed', e);
	                    reject(e);
	                  }.bind(this)
	                );
	            } else {
	              // Local streams were explicitly excluded.
	              resolve([]);
	            }
	          }.bind(this)
	        )
	          .catch(
	            function acquireFailed(err) {
	              this.logger.error('unable to acquire streams');
	              this.logger.error(err);
	              return SIP.Utils.Promise.reject(err);
	            }.bind(this)
	          )
	          .then(
	            function acquireSucceeded(streams) {
	              this.logger.log('acquired local media streams');
	              try {
	                // Remove old tracks
	                if (this.peerConnection.removeTrack) {
	                  this.peerConnection.getSenders().forEach(function(sender) {
	                    this.peerConnection.removeTrack(sender);
	                  });
	                }
	                return streams;
	              } catch (e) {
	                return SIP.Utils.Promise.reject(e);
	              }
	            }.bind(this)
	          )
	          .catch(
	            function removeStreamsFailed(err) {
	              this.logger.error('error removing streams');
	              this.logger.error(err);
	              return SIP.Utils.Promise.reject(err);
	            }.bind(this)
	          )
	          .then(
	            function addStreams(streams) {
	              try {
	                streams = [].concat(streams);
	                streams.forEach(function(stream) {
	                  if (this.peerConnection.addTrack) {
	                    stream.getTracks().forEach(function(track) {
	                      this.peerConnection.addTrack(track, stream);
	                    }, this);
	                  } else {
	                    // Chrome 59 does not support addTrack
	                    this.peerConnection.addStream(stream);
	                  }
	                }, this);
	              } catch (e) {
	                return SIP.Utils.Promise.reject(e);
	              }
	              return SIP.Utils.Promise.resolve();
	            }.bind(this)
	          )
	          .catch(
	            function addStreamsFailed(err) {
	              this.logger.error('error adding stream');
	              this.logger.error(err);
	              return SIP.Utils.Promise.reject(err);
	            }.bind(this)
	          );
	      }
	    },

	    hasOffer: {
	      writable: true,
	      value: function hasOffer(where) {
	        var offerState = 'have-' + where + '-offer';

	        return this.peerConnection.signalingState === offerState;
	      }
	    },

	    // ICE gathering state handling

	    isIceGatheringComplete: {
	      writable: true,
	      value: function isIceGatheringComplete() {
	        return this.peerConnection.iceGatheringState === 'complete' || this.iceGatheringTimeout;
	      }
	    },

	    resetIceGatheringComplete: {
	      writable: true,
	      value: function resetIceGatheringComplete() {
	        this.iceGatheringTimeout = false;

	        if (this.iceGatheringTimer) {
	          SIP.Timers.clearTimeout(this.iceGatheringTimer);
	          this.iceGatheringTimer = null;
	        }

	        if (this.iceGatheringDeferred) {
	          this.iceGatheringDeferred.reject();
	          this.iceGatheringDeferred = null;
	        }
	      }
	    },

	    setDirection: {
	      writable: true,
	      value: function setDirection(sdp) {
	        var match = sdp.match(/a=(sendrecv|sendonly|recvonly|inactive)/);
	        if (match === null) {
	          this.direction = this.C.DIRECTION.NULL;
	          this.observer.directionChanged();
	          return;
	        }
	        var direction = match[1];
	        switch (direction) {
	          case this.C.DIRECTION.SENDRECV:
	          case this.C.DIRECTION.SENDONLY:
	          case this.C.DIRECTION.RECVONLY:
	          case this.C.DIRECTION.INACTIVE:
	            this.direction = direction;
	            break;
	          default:
	            this.direction = this.C.DIRECTION.NULL;
	            break;
	        }
	        this.observer.directionChanged();
	      }
	    },

	    triggerIceGatheringComplete: {
	      writable: true,
	      value: function triggerIceGatheringComplete() {
	        if (this.isIceGatheringComplete()) {
	          this.emit('iceGatheringComplete', this);

	          if (this.iceGatheringTimer) {
	            SIP.Timers.clearTimeout(this.iceGatheringTimer);
	            this.iceGatheringTimer = null;
	          }

	          if (this.iceGatheringDeferred) {
	            this.iceGatheringDeferred.resolve();
	            this.iceGatheringDeferred = null;
	          }
	        }
	      }
	    },

	    waitForIceGatheringComplete: {
	      writable: true,
	      value: function waitForIceGatheringComplete() {
	        if (this.isIceGatheringComplete()) {
	          return SIP.Utils.Promise.resolve();
	        } else if (!this.isIceGatheringDeferred) {
	          this.iceGatheringDeferred = SIP.Utils.defer();
	        }
	        return this.iceGatheringDeferred.promise;
	      }
	    }
	  });

	  return MobileSessionDescriptionHandler;
	};

	//      

	const states = ['STATUS_NULL', 'STATUS_NEW', 'STATUS_CONNECTING', 'STATUS_CONNECTED', 'STATUS_COMPLETED'];
	const events = [
	  'connected',
	  'disconnected',
	  'registered',
	  'unregistered',
	  'registrationFailed',
	  'invite',
	  'inviteSent',
	  'transportCreated',
	  'newTransaction',
	  'transactionDestroyed',
	  'notify',
	  'outOfDialogReferRequested',
	  'message'
	];

	                    
	                          
	                          
	                               
	  

	                     
	                      
	               
	                
	                            
	                   
	                     
	              
	  

	// @see https://github.com/onsip/SIP.js/blob/master/src/Web/Simple.js
	class WebRTCClient {
	                       
	                    
	                                     
	                          
	                          
	                                 

	  static isAPrivateIp(ip        )          {
	    const regex = /^(?:10|127|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\..*/;
	    return regex.exec(ip) == null;
	  }

	  static getIceServers(ip        )                                 {
	    if (WebRTCClient.isAPrivateIp(ip)) {
	      return [
	        {
	          urls: [
	            'stun:stun.l.google.com:19302',
	            'stun:stun1.l.google.com:19302',
	            'stun:stun2.l.google.com:19302',
	            'stun:stun3.l.google.com:19302',
	            'stun:stun4.l.google.com:19302'
	          ]
	        }
	      ];
	    }
	    return [];
	  }

	  constructor(config              ) {
	    this.config = config;
	    this.callbacksHandler = new CallbacksHandler();

	    this.configureMedia(config.media);
	    this.userAgent = this.createUserAgent();
	  }

	  configureMedia(media             ) {
	    this.audio = media.audio;
	    this.video = media.video;
	    this.localVideo = media.localVideo;
	  }

	  createUserAgent()         {
	    const webRTCConfiguration = this._createWebRTCConfiguration();
	    const userAgent = new SIP.UA(webRTCConfiguration);

	    events
	      .filter(eventName => eventName !== 'invite')
	      .forEach(eventName => {
	        userAgent.on(eventName, event => {
	          this.callbacksHandler.triggerCallback(eventName, event);
	        });
	      });

	    // Particular case for `invite` event
	    userAgent.on('invite', (session                               ) => {
	      this._setupSession(session);

	      this.callbacksHandler.triggerCallback('invite', session);
	    });
	    return userAgent;
	  }

	  on(event        , callback          ) {
	    this.callbacksHandler.on(event, callback);
	  }

	  call(number        )                                {
	    // Safari hack, because you cannot call .play() from a non user action
	    if (this.audio && this._isWeb()) {
	      this.audio.autoplay = true;
	    }
	    if (this.video && this._isWeb()) {
	      this.video.autoplay = true;
	    }
	    if (this.localVideo && this._isWeb()) {
	      this.localVideo.autoplay = true;
	      this.localVideo.volume = 0;
	    }

	    const session = this.userAgent.invite(number, this._getMediaConfiguration());
	    this._fixLocalDescription(session);

	    this._setupSession(session);

	    return session;
	  }

	  answer(session                               ) {
	    // Safari hack, because you cannot call .play() from a non user action
	    if (this.audio && this._isWeb()) {
	      this.audio.autoplay = true;
	    }
	    if (this.video && this._isWeb()) {
	      this.video.autoplay = true;
	    }

	    return session.accept(this._getMediaConfiguration());
	  }

	  hangup(session                               ) {
	    if (session.hasAnswer && session.bye) {
	      return session.bye();
	    }

	    if (!session.hasAnswer && session.cancel) {
	      return session.cancel();
	    }

	    if (session.reject) {
	      return session.reject();
	    }

	    return null;
	  }

	  reject(session                               ) {
	    return session.reject();
	  }

	  mute(session                               ) {
	    this._toggleMute(session, true);
	  }

	  unmute(session                               ) {
	    this._toggleMute(session, false);
	  }

	  hold(session                               ) {
	    this.mute(session);

	    return session.hold();
	  }

	  unhold(session                               ) {
	    this.unmute(session);

	    return session.unhold();
	  }

	  sendDTMF(session                               , tone        ) {
	    return session.dtmf(tone);
	  }

	  message(destination        , message        ) {
	    return this.userAgent.message(destination, message);
	  }

	  transfert(session                               , target        ) {
	    this.hold(session);

	    setTimeout(() => {
	      session.refer(target);
	      this.hangup(session);
	    }, 50);
	  }

	  getState() {
	    return states[this.userAgent.state];
	  }

	  close() {
	    this._cleanupMedia();

	    this.userAgent.transport.disconnect();

	    return this.userAgent.stop();
	  }

	  _isWeb() {
	    return typeof this.audio === 'object' || typeof this.video === 'object';
	  }

	  _hasAudio() {
	    return !!this.audio;
	  }

	  _hasVideo() {
	    return !!this.video;
	  }

	  _hasLocalVideo() {
	    return !!this.localVideo;
	  }

	  _fixLocalDescription(session                               ) {
	    if (!session.sessionDescriptionHandler) {
	      return;
	    }

	    const pc = session.sessionDescriptionHandler.peerConnection;
	    let count = 0;
	    let fixed = false;

	    pc.onicecandidate = () => {
	      if (count > 0 && !fixed) {
	        fixed = true;
	        pc.createOffer().then(offer => pc.setLocalDescription(offer));
	      }
	      count += 1;
	    };
	  }

	  _createWebRTCConfiguration() {
	    return {
	      authorizationUser: this.config.authorizationUser,
	      displayName: this.config.displayName,
	      hackIpInContact: true,
	      hackWssInTransport: true,
	      log: this.config.log || { builtinEnabled: false },
	      password: this.config.password,
	      uri: `${this.config.authorizationUser}@${this.config.host}`,
	      transportOptions: {
	        traceSip: false,
	        wsServers: `wss://${this.config.host}:${this.config.port || 443}/api/asterisk/ws`
	      },
	      sessionDescriptionHandlerFactory: (session                               , options        ) =>
	        this._isWeb()
	          ? SessionDescriptionHandler(SIP).defaultFactory(session, options)
	          : MobileSessionDescriptionHandler(SIP).defaultFactory(session, options),
	      sessionDescriptionHandlerFactoryOptions: {
	        constraints: {
	          audio: this._hasAudio(),
	          video: this._hasVideo()
	        },
	        peerConnectionOptions: {
	          iceCheckingTimeout: 5000,
	          rtcConfiguration: {
	            rtcpMuxPolicy: 'require',
	            bundlePolicy: 'balanced',
	            iceServers: WebRTCClient.getIceServers(this.config.host),
	            mandatory: {
	              OfferToReceiveAudio: this._hasAudio(),
	              OfferToReceiveVideo: this._hasVideo()
	            }
	          }
	        }
	      }
	    };
	  }

	  _getMediaConfiguration() {
	    return {
	      sessionDescriptionHandlerOptions: {
	        constraints: {
	          audio: this._hasAudio(),
	          video: this._hasVideo()
	        },
	        RTCOfferOptions: {
	          mandatory: {
	            OfferToReceiveAudio: this._hasAudio(),
	            OfferToReceiveVideo: this._hasVideo()
	          }
	        }
	      }
	    };
	  }

	  _setupSession(session                               ) {
	    session.on('accepted', () => this._onAccepted(session));
	  }

	  _onAccepted(session                               ) {
	    this._setupLocalMedia(session);
	    this._setupRemoteMedia(session);

	    session.sessionDescriptionHandler.on('addTrack', () => {
	      this._setupRemoteMedia(session);
	    });

	    session.sessionDescriptionHandler.on('addStream', () => {
	      this._setupRemoteMedia(session);
	    });

	    this.callbacksHandler.triggerCallback('accepted', session);
	  }

	  _setupRemoteMedia(session                               ) {
	    // If there is a video track, it will attach the video and audio to the same element
	    const pc = session.sessionDescriptionHandler.peerConnection;
	    let remoteStream;

	    if (pc.getReceivers) {
	      remoteStream = typeof global !== 'undefined' ? new global.window.MediaStream() : new window.MediaStream();
	      pc.getReceivers().forEach(receiver => {
	        const { track } = receiver;
	        if (track) {
	          remoteStream.addTrack(track);
	        }
	      });
	    } else {
	      [remoteStream] = pc.getRemoteStreams();
	    }

	    if (this._hasVideo() && this._isWeb()) {
	      this.video.srcObject = remoteStream;
	      this.video.play();
	    } else if (this._hasAudio() && this._isWeb()) {
	      this.audio.srcObject = remoteStream;
	      this.audio.play();
	    }
	  }

	  _setupLocalMedia(session                               ) {
	    if (!this.localVideo) {
	      return;
	    }

	    const pc = session.sessionDescriptionHandler.peerConnection;
	    let localStream;

	    if (pc.getSenders) {
	      localStream = typeof global !== 'undefined' ? new global.window.MediaStream() : new window.MediaStream();
	      pc.getSenders().forEach(sender => {
	        const { track } = sender;
	        if (track && track.kind === 'video') {
	          localStream.addTrack(track);
	        }
	      });
	    } else {
	      [localStream] = pc.getLocalStreams();
	    }

	    this.localVideo.srcObject = localStream;
	    this.localVideo.volume = 0;
	    this.localVideo.play();
	  }

	  _cleanupMedia() {
	    if (this.video && this._isWeb()) {
	      this.video.srcObject = null;
	      this.video.pause();

	      if (this.localVideo) {
	        this.localVideo.srcObject = null;
	        this.localVideo.pause();
	      }
	    }

	    if (this.audio && this._isWeb()) {
	      this.audio.srcObject = null;
	      this.audio.pause();
	    }
	  }

	  _toggleMute(session                               , mute         ) {
	    const pc = session.sessionDescriptionHandler.peerConnection;

	    if (pc.getSenders) {
	      pc.getSenders().forEach(sender => {
	        if (sender.track) {
	          // eslint-disable-next-line
	          sender.track.enabled = !mute;
	        }
	      });
	    } else {
	      pc.getLocalStreams().forEach(stream => {
	        stream.getAudioTracks().forEach(track => {
	          // eslint-disable-next-line
	          track.enabled = !mute;
	        });
	        stream.getVideoTracks().forEach(track => {
	          // eslint-disable-next-line
	          track.enabled = !mute;
	        });
	      });
	    }
	  }
	}

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var Event$1 = /** @class */ (function () {
	    function Event(type, target) {
	        this.target = target;
	        this.type = type;
	    }
	    return Event;
	}());
	var ErrorEvent = /** @class */ (function (_super) {
	    __extends(ErrorEvent, _super);
	    function ErrorEvent(error, target) {
	        var _this = _super.call(this, 'error', target) || this;
	        _this.message = error.message;
	        _this.error = error;
	        return _this;
	    }
	    return ErrorEvent;
	}(Event$1));
	var CloseEvent = /** @class */ (function (_super) {
	    __extends(CloseEvent, _super);
	    function CloseEvent(code, reason, target) {
	        if (code === void 0) { code = 1000; }
	        if (reason === void 0) { reason = ''; }
	        var _this = _super.call(this, 'close', target) || this;
	        _this.wasClean = true;
	        _this.code = code;
	        _this.reason = reason;
	        return _this;
	    }
	    return CloseEvent;
	}(Event$1));

	/*!
	 * Reconnecting WebSocket
	 * by Pedro Ladaria <pedro.ladaria@gmail.com>
	 * https://github.com/pladaria/reconnecting-websocket
	 * License MIT
	 */
	var getGlobalWebSocket = function () {
	    if (typeof WebSocket !== 'undefined') {
	        // @ts-ignore
	        return WebSocket;
	    }
	};
	/**
	 * Returns true if given argument looks like a WebSocket class
	 */
	var isWebSocket = function (w) { return typeof w === 'function' && w.CLOSING === 2; };
	var DEFAULT = {
	    maxReconnectionDelay: 10000,
	    minReconnectionDelay: 1000 + Math.random() * 4000,
	    minUptime: 5000,
	    reconnectionDelayGrowFactor: 1.3,
	    connectionTimeout: 4000,
	    maxRetries: Infinity,
	    debug: false,
	};
	var ReconnectingWebSocket = /** @class */ (function () {
	    function ReconnectingWebSocket(url, protocols, options) {
	        if (options === void 0) { options = {}; }
	        var _this = this;
	        this._listeners = {
	            error: [],
	            message: [],
	            open: [],
	            close: [],
	        };
	        this._retryCount = -1;
	        this._shouldReconnect = true;
	        this._connectLock = false;
	        this._binaryType = 'blob';
	        this._closeCalled = false;
	        this._messageQueue = [];
	        /**
	         * An event listener to be called when the WebSocket connection's readyState changes to CLOSED
	         */
	        this.onclose = undefined;
	        /**
	         * An event listener to be called when an error occurs
	         */
	        this.onerror = undefined;
	        /**
	         * An event listener to be called when a message is received from the server
	         */
	        this.onmessage = undefined;
	        /**
	         * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
	         * this indicates that the connection is ready to send and receive data
	         */
	        this.onopen = undefined;
	        this._handleOpen = function (event) {
	            _this._debug('open event');
	            var _a = _this._options.minUptime, minUptime = _a === void 0 ? DEFAULT.minUptime : _a;
	            clearTimeout(_this._connectTimeout);
	            _this._uptimeTimeout = setTimeout(function () { return _this._acceptOpen(); }, minUptime);
	            // @ts-ignore
	            _this._ws.binaryType = _this._binaryType;
	            // send enqueued messages (messages sent before websocket open event)
	            _this._messageQueue.forEach(function (message) { return _this._ws.send(message); });
	            _this._messageQueue = [];
	            if (_this.onopen) {
	                _this.onopen(event);
	            }
	            _this._listeners.open.forEach(function (listener) { return _this._callEventListener(event, listener); });
	        };
	        this._handleMessage = function (event) {
	            _this._debug('message event');
	            if (_this.onmessage) {
	                _this.onmessage(event);
	            }
	            _this._listeners.message.forEach(function (listener) { return _this._callEventListener(event, listener); });
	        };
	        this._handleError = function (event) {
	            _this._debug('error event', event.message);
	            _this._disconnect(undefined, event.message === 'TIMEOUT' ? 'timeout' : undefined);
	            if (_this.onerror) {
	                _this.onerror(event);
	            }
	            _this._debug('exec error listeners');
	            _this._listeners.error.forEach(function (listener) { return _this._callEventListener(event, listener); });
	            _this._connect();
	        };
	        this._handleClose = function (event) {
	            _this._debug('close event');
	            _this._clearTimeouts();
	            if (_this._shouldReconnect) {
	                _this._connect();
	            }
	            if (_this.onclose) {
	                _this.onclose(event);
	            }
	            _this._listeners.close.forEach(function (listener) { return _this._callEventListener(event, listener); });
	        };
	        this._url = url;
	        this._protocols = protocols;
	        this._options = options;
	        this._connect();
	    }
	    Object.defineProperty(ReconnectingWebSocket, "CONNECTING", {
	        get: function () {
	            return 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket, "OPEN", {
	        get: function () {
	            return 1;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket, "CLOSING", {
	        get: function () {
	            return 2;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket, "CLOSED", {
	        get: function () {
	            return 3;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "CONNECTING", {
	        get: function () {
	            return ReconnectingWebSocket.CONNECTING;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "OPEN", {
	        get: function () {
	            return ReconnectingWebSocket.OPEN;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSING", {
	        get: function () {
	            return ReconnectingWebSocket.CLOSING;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSED", {
	        get: function () {
	            return ReconnectingWebSocket.CLOSED;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "binaryType", {
	        get: function () {
	            return this._ws ? this._ws.binaryType : this._binaryType;
	        },
	        set: function (value) {
	            this._binaryType = value;
	            if (this._ws) {
	                // @ts-ignore
	                this._ws.binaryType = value;
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "retryCount", {
	        /**
	         * Returns the number or connection retries
	         */
	        get: function () {
	            return Math.max(this._retryCount, 0);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "bufferedAmount", {
	        /**
	         * The number of bytes of data that have been queued using calls to send() but not yet
	         * transmitted to the network. This value resets to zero once all queued data has been sent.
	         * This value does not reset to zero when the connection is closed; if you keep calling send(),
	         * this will continue to climb. Read only
	         */
	        get: function () {
	            var bytes = this._messageQueue.reduce(function (acc, message) {
	                if (typeof message === 'string') {
	                    acc += message.length; // not byte size
	                }
	                else if (message instanceof Blob) {
	                    acc += message.size;
	                }
	                else {
	                    acc += message.byteLength;
	                }
	                return acc;
	            }, 0);
	            return bytes + (this._ws ? this._ws.bufferedAmount : 0);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "extensions", {
	        /**
	         * The extensions selected by the server. This is currently only the empty string or a list of
	         * extensions as negotiated by the connection
	         */
	        get: function () {
	            return this._ws ? this._ws.extensions : '';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "protocol", {
	        /**
	         * A string indicating the name of the sub-protocol the server selected;
	         * this will be one of the strings specified in the protocols parameter when creating the
	         * WebSocket object
	         */
	        get: function () {
	            return this._ws ? this._ws.protocol : '';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "readyState", {
	        /**
	         * The current state of the connection; this is one of the Ready state constants
	         */
	        get: function () {
	            return this._ws ? this._ws.readyState : ReconnectingWebSocket.CONNECTING;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "url", {
	        /**
	         * The URL as resolved by the constructor
	         */
	        get: function () {
	            return this._ws ? this._ws.url : '';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Closes the WebSocket connection or connection attempt, if any. If the connection is already
	     * CLOSED, this method does nothing
	     */
	    ReconnectingWebSocket.prototype.close = function (code, reason) {
	        if (code === void 0) { code = 1000; }
	        this._closeCalled = true;
	        this._shouldReconnect = false;
	        this._clearTimeouts();
	        if (!this._ws) {
	            this._debug('close enqueued: no ws instance');
	            return;
	        }
	        if (this._ws.readyState === this.CLOSED) {
	            this._debug('close: already closed');
	            return;
	        }
	        this._ws.close(code, reason);
	    };
	    /**
	     * Closes the WebSocket connection or connection attempt and connects again.
	     * Resets retry counter;
	     */
	    ReconnectingWebSocket.prototype.reconnect = function (code, reason) {
	        this._shouldReconnect = true;
	        this._closeCalled = false;
	        this._retryCount = -1;
	        if (!this._ws || this._ws.readyState === this.CLOSED) {
	            this._connect();
	        }
	        else {
	            this._disconnect(code, reason);
	            this._connect();
	        }
	    };
	    /**
	     * Enqueue specified data to be transmitted to the server over the WebSocket connection
	     */
	    ReconnectingWebSocket.prototype.send = function (data) {
	        if (this._ws && this._ws.readyState === this.OPEN) {
	            this._debug('send', data);
	            this._ws.send(data);
	        }
	        else {
	            this._debug('enqueue', data);
	            this._messageQueue.push(data);
	        }
	    };
	    /**
	     * Register an event handler of a specific event type
	     */
	    ReconnectingWebSocket.prototype.addEventListener = function (type, listener) {
	        if (this._listeners[type]) {
	            // @ts-ignore
	            this._listeners[type].push(listener);
	        }
	    };
	    /**
	     * Removes an event listener
	     */
	    ReconnectingWebSocket.prototype.removeEventListener = function (type, listener) {
	        if (this._listeners[type]) {
	            // @ts-ignore
	            this._listeners[type] = this._listeners[type].filter(function (l) { return l !== listener; });
	        }
	    };
	    ReconnectingWebSocket.prototype._debug = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        if (this._options.debug) {
	            // not using spread because compiled version uses Symbols
	            // tslint:disable-next-line
	            console.log.apply(console, ['RWS>'].concat(args));
	        }
	    };
	    ReconnectingWebSocket.prototype._getNextDelay = function () {
	        var _a = this._options, _b = _a.reconnectionDelayGrowFactor, reconnectionDelayGrowFactor = _b === void 0 ? DEFAULT.reconnectionDelayGrowFactor : _b, _c = _a.minReconnectionDelay, minReconnectionDelay = _c === void 0 ? DEFAULT.minReconnectionDelay : _c, _d = _a.maxReconnectionDelay, maxReconnectionDelay = _d === void 0 ? DEFAULT.maxReconnectionDelay : _d;
	        var delay = minReconnectionDelay;
	        if (this._retryCount > 0) {
	            delay =
	                minReconnectionDelay * Math.pow(reconnectionDelayGrowFactor, this._retryCount - 1);
	            if (delay > maxReconnectionDelay) {
	                delay = maxReconnectionDelay;
	            }
	        }
	        this._debug('next delay', delay);
	        return delay;
	    };
	    ReconnectingWebSocket.prototype._wait = function () {
	        var _this = this;
	        return new Promise(function (resolve) {
	            setTimeout(resolve, _this._getNextDelay());
	        });
	    };
	    ReconnectingWebSocket.prototype._getNextUrl = function (urlProvider) {
	        if (typeof urlProvider === 'string') {
	            return Promise.resolve(urlProvider);
	        }
	        if (typeof urlProvider === 'function') {
	            var url = urlProvider();
	            if (typeof url === 'string') {
	                return Promise.resolve(url);
	            }
	            if (url.then) {
	                return url;
	            }
	        }
	        throw Error('Invalid URL');
	    };
	    ReconnectingWebSocket.prototype._connect = function () {
	        var _this = this;
	        if (this._connectLock || !this._shouldReconnect) {
	            return;
	        }
	        this._connectLock = true;
	        var _a = this._options, _b = _a.maxRetries, maxRetries = _b === void 0 ? DEFAULT.maxRetries : _b, _c = _a.connectionTimeout, connectionTimeout = _c === void 0 ? DEFAULT.connectionTimeout : _c, _d = _a.WebSocket, WebSocket = _d === void 0 ? getGlobalWebSocket() : _d;
	        if (this._retryCount >= maxRetries) {
	            this._debug('max retries reached', this._retryCount, '>=', maxRetries);
	            return;
	        }
	        this._retryCount++;
	        this._debug('connect', this._retryCount);
	        this._removeListeners();
	        if (!isWebSocket(WebSocket)) {
	            throw Error('No valid WebSocket class provided');
	        }
	        this._wait()
	            .then(function () { return _this._getNextUrl(_this._url); })
	            .then(function (url) {
	            // close could be called before creating the ws
	            if (_this._closeCalled) {
	                _this._connectLock = false;
	                return;
	            }
	            _this._debug('connect', { url: url, protocols: _this._protocols });
	            _this._ws = _this._protocols
	                ? new WebSocket(url, _this._protocols)
	                : new WebSocket(url);
	            // @ts-ignore
	            _this._ws.binaryType = _this._binaryType;
	            _this._connectLock = false;
	            _this._addListeners();
	            _this._connectTimeout = setTimeout(function () { return _this._handleTimeout(); }, connectionTimeout);
	        });
	    };
	    ReconnectingWebSocket.prototype._handleTimeout = function () {
	        this._debug('timeout event');
	        this._handleError(new ErrorEvent(Error('TIMEOUT'), this));
	    };
	    ReconnectingWebSocket.prototype._disconnect = function (code, reason) {
	        if (code === void 0) { code = 1000; }
	        this._clearTimeouts();
	        if (!this._ws) {
	            return;
	        }
	        this._removeListeners();
	        try {
	            this._ws.close(code, reason);
	            this._handleClose(new CloseEvent(code, reason, this));
	        }
	        catch (error) {
	            // ignore
	        }
	    };
	    ReconnectingWebSocket.prototype._acceptOpen = function () {
	        this._debug('accept open');
	        this._retryCount = 0;
	    };
	    ReconnectingWebSocket.prototype._callEventListener = function (event, listener) {
	        if ('handleEvent' in listener) {
	            // @ts-ignore
	            listener.handleEvent(event);
	        }
	        else {
	            // @ts-ignore
	            listener(event);
	        }
	    };
	    ReconnectingWebSocket.prototype._removeListeners = function () {
	        if (!this._ws) {
	            return;
	        }
	        this._debug('removeListeners');
	        this._ws.removeEventListener('open', this._handleOpen);
	        this._ws.removeEventListener('close', this._handleClose);
	        this._ws.removeEventListener('message', this._handleMessage);
	        // @ts-ignore
	        this._ws.removeEventListener('error', this._handleError);
	    };
	    ReconnectingWebSocket.prototype._addListeners = function () {
	        if (!this._ws) {
	            return;
	        }
	        this._debug('addListeners');
	        this._ws.addEventListener('open', this._handleOpen);
	        this._ws.addEventListener('close', this._handleClose);
	        this._ws.addEventListener('message', this._handleMessage);
	        // @ts-ignore
	        this._ws.addEventListener('error', this._handleError);
	    };
	    ReconnectingWebSocket.prototype._clearTimeouts = function () {
	        clearTimeout(this._connectTimeout);
	        clearTimeout(this._uptimeTimeout);
	    };
	    return ReconnectingWebSocket;
	}());

	//      

	                                 
	               
	                
	                       
	  

	class WebSocketClient {
	                       
	               
	                
	                        
	                                     
	                  
	                                 

	  /**
	   *
	   * @param host
	   * @param token
	   * @param events
	   * @param options @see https://github.com/pladaria/reconnecting-websocket#available-options
	   */
	  constructor({ host, token, events = [] }                          , options         = {}) {
	    this.initialized = false;
	    this.callbacksHandler = new CallbacksHandler();

	    this.socket = null;
	    this.host = host;
	    this.token = token;
	    this.events = events;
	    this.options = options;
	  }

	  connect() {
	    this.socket = new ReconnectingWebSocket(`wss://${this.host}/api/websocketd/?token=${this.token}`, [], this.options);
	    if (this.options.binaryType) {
	      this.socket.binaryType = this.options.binaryType;
	    }

	    this.socket.onmessage = (event              ) => {
	      const message = JSON.parse(typeof event.data === 'string' ? event.data : '{}');

	      if (!this.initialized) {
	        this.handleMessage(message, this.socket);
	      } else {
	        this.callbacksHandler.triggerCallback(message.name, message);
	      }
	    };

	    this.socket.onclose = e => {
	      switch (e.code) {
	        case 4002:
	          break;
	        case 4003:
	          break;
	        default:
	      }
	    };
	  }

	  close()       {
	    if (!this.socket) {
	      return;
	    }

	    this.socket.close();
	  }

	  on(event        , callback          ) {
	    this.callbacksHandler.on(event, callback);
	  }

	  handleMessage(message        , sock                       ) {
	    switch (message.op) {
	      case 'init':
	        this.events.forEach(event => {
	          const op = {
	            op: 'subscribe',
	            data: { event_name: event }
	          };

	          sock.send(JSON.stringify(op));
	        });

	        sock.send(JSON.stringify({ op: 'start' }));
	        break;
	      case 'subscribe':
	        break;
	      case 'start':
	        this.initialized = true;
	        break;
	      default:
	        this.callbacksHandler.triggerCallback('message', message);
	    }
	  }
	}

	var COUNTRIES = {
	  BELGIUM: 'BE',
	  CANADA: 'CA',
	  FRANCE: 'FR',
	  GERMANY: 'DE',
	  ITALY: 'IT',
	  PORTUGAL: 'PT',
	  SPAIN: 'ES',
	  SWITZERLAND: 'CH',
	  UNITED_KINGDOM: 'GB',
	  UNITED_STATES: 'US'
	};

	//      

	                                   
	                 
	                    
	  

	                                     
	                 
	                    
	  

	class NotificationOptions {
	                 
	                     

	  static parse(plain                            )                      {
	    if (!plain) {
	      return new NotificationOptions({ sound: true, vibration: true });
	    }

	    return new NotificationOptions({
	      sound: plain.sound,
	      vibration: plain.vibration
	    });
	  }

	  static newFrom(profile                     ) {
	    return newFrom(profile, NotificationOptions);
	  }

	  constructor({ sound = true, vibration = true }                               = {}) {
	    this.sound = sound;
	    this.vibration = vibration;
	  }

	  setSound(sound         )                      {
	    this.sound = sound;

	    return this;
	  }

	  setVibration(vibration         )                      {
	    this.vibration = vibration;

	    return this;
	  }

	  enable() {
	    this.vibration = true;
	    this.sound = true;

	    return this;
	  }

	  disable() {
	    this.vibration = false;
	    this.sound = false;

	    return this;
	  }

	  isEnabled() {
	    return this.sound || this.vibration;
	  }
	}

	//      
	/* eslint-disable */

	                                     

	class DebugPhone                  {
	  makeCall(number        ) {
	    console.info('DebugPhone - calling: ${number}');
	  }

	  acceptCall() {
	    console.info('DebugPhone - Accept call');
	  }

	  mute() {
	    console.info('DebugPhone - Mute phone');
	  }

	  unmute() {
	    console.info('DebugPhone - Unmute phone');
	  }

	  hold() {
	    console.info('DebugPhone - Put on hold');
	  }

	  unhold() {
	    console.info('DebugPhone - Put on unhold');
	  }

	  transfer(target        ) {
	    console.info(`DebugPhone - Transferring to ${target}`);
	  }

	  sendKey(key        ) {
	    console.info('DebugPhone - sending: ${key}');
	  }

	  putOnSpeaker() {
	    console.info('DebugPhone - Put on speaker');
	  }

	  putOffSpeaker() {
	    console.info('DebugPhone - Put off speaker');
	  }

	  endCall() {
	    console.info('DebugPhone - Hang up');
	  }

	  onConnectionMade() {
	    console.info('DebugPhone - Connection made');
	  }

	  close() {
	    console.info('DebugPhone - Close');
	  }
	}

	//      
	/* eslint-disable */

	                                       

	class DebugDevice                   {
	  connectToCall() {
	    console.info('DebugDevice - Connected to call');
	  }

	  disconnectFromCall() {
	    console.info('DebugDevice - Disconnected from call');
	  }

	  ringback() {
	    console.info('DebugDevice - Ringback');
	  }

	  stopRingback() {
	    console.info('DebugDevice - Stop ringback');
	  }

	  playRingtone() {
	    console.info('DebugDevice - Play ringtone');
	  }

	  stopRingtone() {
	    console.info('DebugDevice - Stop ringtone');
	  }

	  mute() {
	    console.info('DebugDevice - Mute');
	  }

	  unmute() {
	    console.info('DebugDevice - Unmute');
	  }

	  putOnSpeaker() {
	    console.info('DebugDevice - Put on speaker');
	  }

	  putOffSpeaker() {
	    console.info('DebugDevice - Put off speaker');
	  }
	}

	//      

	                                        
	                              
	                                                          
	                                

	var index = {
	  WazoApiClient: ApiClient,
	  WazoWebRTCClient: WebRTCClient,
	  WazoWebSocketClient: WebSocketClient,
	  BadResponse,
	  ServerError,
	  Call,
	  CallLog,
	  ChatMessage,
	  Contact,
	  COUNTRIES,
	  ForwardOption,
	  Line,
	  NotificationOptions,
	  Profile,
	  Session,
	  Voicemail,
	  DebugPhone,
	  DebugDevice,
	  PRESENCE,
	  FORWARD_KEYS
	};

	return index;

})));
//# sourceMappingURL=wazo-sdk.js.map
