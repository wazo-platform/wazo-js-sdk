(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('sip.js/dist/sip-0.11.1')) :
	typeof define === 'function' && define.amd ? define(['sip.js/dist/sip-0.11.1'], factory) :
	(global['@wazo/sdk'] = factory(global.SIP));
}(this, (function (SIP) { 'use strict';

	SIP = SIP && SIP.hasOwnProperty('default') ? SIP['default'] : SIP;

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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
	      .post(url, body, token, res => res.uuid)
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
	var SessionDescriptionHandler = function (SIP$$1) {

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
	    RTCPeerConnection     : environment.RTCPeerConnection
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

	SessionDescriptionHandler.prototype = Object.create(SIP$$1.SessionDescriptionHandler.prototype, {
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

	    return SIP$$1.Utils.Promise.resolve()
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
	    .then(function(description) {
	      this.emit('getDescription', description);
	      return {
	        body: description.sdp,
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
	    return SIP$$1.Utils.Promise.resolve(description);
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

	    return SIP$$1.Utils.Promise.resolve()
	    .then(function() {
	      // Media should be acquired in getDescription unless we need to do it sooner for some reason (FF61+)
	      if (this.shouldAcquireMedia && this.options.alwaysAcquireMediaFirst) {
	        return this.acquire(this.constraints).then(function() {
	          this.shouldAcquireMedia = false;
	        }.bind(this));
	      }
	    }.bind(this))
	    .then(function() {
	      return SIP$$1.Utils.reducePromises(modifiers, description);
	    })
	    .catch((e) => {
	      if (e instanceof SIP$$1.Exceptions.SessionDescriptionHandlerError) {
	        throw e;
	      }
	      const error = new SIP$$1.Exceptions.SessionDescriptionHandlerError("setDescription", e, "The modifiers did not resolve successfully");
	      this.logger.error(error.message);
	      self.emit('peerConnection-setRemoteDescriptionFailed', error);
	      throw error;
	    })
	    .then(function(modifiedDescription) {
	      self.emit('setDescription', modifiedDescription);
	      return self.peerConnection.setRemoteDescription(modifiedDescription);
	    })
	    .catch((e) => {
	      if (e instanceof SIP$$1.Exceptions.SessionDescriptionHandlerError) {
	        throw e;
	      }
	      // Check the original SDP for video, and ensure that we have want to do audio fallback
	      if ((/^m=video.+$/gm).test(sessionDescription) && !options.disableAudioFallback) {
	        // Do not try to audio fallback again
	        options.disableAudioFallback = true;
	        // Remove video first, then do the other modifiers
	        return this.setDescription(sessionDescription, options, [SIP$$1.Web.Modifiers.stripVideo].concat(modifiers));
	      }
	      const error = new SIP$$1.Exceptions.SessionDescriptionHandlerError("setDescription", e);
	      this.logger.error(error.error);
	      this.emit('peerConnection-setRemoteDescriptionFailed', error);
	      throw error;
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
	      .catch((e) => {
	        if (e instanceof SIP$$1.Exceptions.SessionDescriptionHandlerError) {
	          throw e;
	        }
	        const error = new SIP$$1.Exceptions.SessionDescriptionHandlerError("createOfferOrAnswer", e, 'peerConnection-' + methodName + 'Failed');
	        this.emit('peerConnection-' + methodName + 'Failed', error);
	        throw error;
	      })
	      .then(function(sdp) {
	        return SIP$$1.Utils.reducePromises(modifiers, self.createRTCSessionDescriptionInit(sdp));
	      })
	      .then(function(sdp) {
	        self.resetIceGatheringComplete();
	        return pc.setLocalDescription(sdp);
	      })
	      .catch((e) => {
	        if (e instanceof SIP$$1.Exceptions.SessionDescriptionHandlerError) {
	          throw e;
	        }
	        const error = new SIP$$1.Exceptions.SessionDescriptionHandlerError("createOfferOrAnswer", e, 'peerConnection-SetLocalDescriptionFailed');
	        this.emit('peerConnection-SetLocalDescriptionFailed', error);
	        throw error;
	      })
	      .then(function onSetLocalDescriptionSuccess() {
	        return self.waitForIceGatheringComplete();
	      })
	      .then(function readySuccess() {
	        var localDescription = self.createRTCSessionDescriptionInit(self.peerConnection.localDescription);
	        return SIP$$1.Utils.reducePromises(modifiers, localDescription);
	      })
	      .then(function(localDescription) {
	        self.setDirection(localDescription.sdp);
	        return localDescription;
	      })
	      .catch((e) => {
	        if (e instanceof SIP$$1.Exceptions.SessionDescriptionHandlerError) {
	          throw e;
	        }
	        const error = new SIP$$1.Exceptions.SessionDescriptionHandlerError("createOfferOrAnswer", e);
	        this.logger.error(error);
	        throw error;
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
	    var defaultConstraints = {audio: true, video: !this.options.alwaysAcquireMediaFirst};

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

	    this.peerConnection.onicecandidate = function (e) {
	      self.emit('iceCandidate', e);
	      if (e.candidate) {
	        self.logger.log('ICE candidate received: ' + (e.candidate.candidate === null ? null : e.candidate.candidate.trim()));
	      } else if (e.candidate === null) {
	        // indicates the end of candidate gathering
	        self.logger.log('ICE candidate gathering complete');
	        self.triggerIceGatheringComplete();
	      }
	    };

	    this.peerConnection.onicegatheringstatechange = function () {
	      self.logger.log('RTCIceGatheringState changed: ' + this.iceGatheringState);
	      switch (this.iceGatheringState) {
	      case 'gathering':
	        self.emit('iceGathering', this);
	        if (!self.iceGatheringTimer && options.iceCheckingTimeout) {
	          self.iceGatheringTimeout = false;
	          self.iceGatheringTimer = SIP$$1.Timers.setTimeout(function() {
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

	    return new SIP$$1.Utils.Promise(function(resolve, reject) {
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
	    .catch((e) => {
	      // TODO: This propogates downwards
	      if (e instanceof SIP$$1.Exceptions.SessionDescriptionHandlerError) {
	        throw e;
	      }
	      const error = new SIP$$1.Exceptions.SessionDescriptionHandlerError("acquire", e, "unable to acquire streams");
	      this.logger.error(error.message);
	      this.logger.error(error.error);
	      throw error;
	    })
	    .then(function acquireSucceeded(streams) {
	      this.logger.log('acquired local media streams');
	      try {
	        // Remove old tracks
	        if (this.peerConnection.removeTrack) {
	          this.peerConnection.getSenders().forEach(function (sender) {
	            this.peerConnection.removeTrack(sender);
	          }, this);
	        }
	        return streams;
	      } catch(e) {
	        return SIP$$1.Utils.Promise.reject(e);
	      }
	    }.bind(this))
	    .catch((e) => {
	      if (e instanceof SIP$$1.Exceptions.SessionDescriptionHandlerError) {
	        throw e;
	      }
	      const error = new SIP$$1.Exceptions.SessionDescriptionHandlerError("acquire", e, "error removing streams");
	      this.logger.error(error.message);
	      this.logger.error(error.error);
	      throw error;
	    })
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
	        return SIP$$1.Utils.Promise.reject(e);
	      }
	      return SIP$$1.Utils.Promise.resolve();
	    }.bind(this))
	    .catch((e) => {
	      if (e instanceof SIP$$1.Exceptions.SessionDescriptionHandlerError) {
	        throw e;
	      }
	      const error = new SIP$$1.Exceptions.SessionDescriptionHandlerError("acquire", e, "error adding stream");
	      this.logger.error(error.message);
	      this.logger.error(error.error);
	      throw error;
	    });
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
	      SIP$$1.Timers.clearTimeout(this.iceGatheringTimer);
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
	        SIP$$1.Timers.clearTimeout(this.iceGatheringTimer);
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
	      return SIP$$1.Utils.Promise.resolve();
	    } else if (!this.isIceGatheringDeferred) {
	      this.iceGatheringDeferred = SIP$$1.Utils.defer();
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
	var MobileSessionDescriptionHandler = SIP$$1 => {
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

	    this.modifiers.push(MobileSessionDescriptionHandler.fixMissingBundleModifier);

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

	  MobileSessionDescriptionHandler.fixMissingBundleModifier = function(description) {
	    // Fix to allow incoming calls in iOS devices
	    // @see https://github.com/oney/react-native-webrtc/issues/293
	    if (description.sdp.indexOf('BUNDLE audio') === -1 && type === 'offer') {
	      description.sdp = description.sdp.replace('\r\nm=audio', '\r\na=group:BUNDLE audio\r\nm=audio');
	    }

	    return SIP$$1.Utils.Promise.resolve(description);
	  };

	  MobileSessionDescriptionHandler.prototype = Object.create(SessionDescriptionHandler(SIP$$1).prototype, {
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

	        return SIP$$1.Utils.Promise.resolve()
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
	        return SIP$$1.Utils.Promise.resolve(description);
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

	        var description = {
	          type,
	          sdp: sessionDescription
	        };

	        return SIP$$1.Utils.Promise.resolve()
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
	            return SIP$$1.Utils.reducePromises(modifiers, description);
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
	            return SIP$$1.Utils.reducePromises(modifiers, self.createRTCSessionDescriptionInit(sdp));
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
	            return SIP$$1.Utils.reducePromises(modifiers, localDescription);
	          })
	          .then(function(localDescription) {
	            self.emit('getDescription', localDescription);
	            self.setDirection(localDescription.sdp);
	            return localDescription.sdp;
	          })
	          .catch(function createOfferOrAnswerError(e) {
	            self.logger.error(e);
	            // TODO: Not sure if this is correct
	            throw new SIP$$1.Exceptions.GetDescriptionError(e);
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
	                self.iceGatheringTimer = SIP$$1.Timers.setTimeout(function() {
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

	        return new SIP$$1.Utils.Promise(
	          function(resolve, reject) {
	            /*
	             * Make the call asynchronous, so that ICCs have a chance
	             * to define callbacks to `userMediaRequest`
	             */
	            this.logger.log('acquiring local media');
	            this.emit('userMediaRequest', constraints);

	            if (constraints.audio || constraints.video) {
	              // Avoid exception on immutable object, can't use destructuring because android crashes
	              this.WebRTC.getUserMedia({ audio: constraints.audio, video: constraints.video })
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
	              return SIP$$1.Utils.Promise.reject(err);
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
	                return SIP$$1.Utils.Promise.reject(e);
	              }
	            }.bind(this)
	          )
	          .catch(
	            function removeStreamsFailed(err) {
	              this.logger.error('error removing streams');
	              this.logger.error(err);
	              return SIP$$1.Utils.Promise.reject(err);
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
	                return SIP$$1.Utils.Promise.reject(e);
	              }
	              return SIP$$1.Utils.Promise.resolve();
	            }.bind(this)
	          )
	          .catch(
	            function addStreamsFailed(err) {
	              this.logger.error('error adding stream');
	              this.logger.error(err);
	              return SIP$$1.Utils.Promise.reject(err);
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
	          SIP$$1.Timers.clearTimeout(this.iceGatheringTimer);
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
	            SIP$$1.Timers.clearTimeout(this.iceGatheringTimer);
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
	          return SIP$$1.Utils.Promise.resolve();
	        } else if (!this.isIceGatheringDeferred) {
	          this.iceGatheringDeferred = SIP$$1.Utils.defer();
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
