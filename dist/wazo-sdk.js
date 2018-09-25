(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('cross-fetch/polyfill'), require('js-base64'), require('immutable'), require('moment'), require('sip.js'), require('reconnecting-websocket')) :
  typeof define === 'function' && define.amd ? define(['cross-fetch/polyfill', 'js-base64', 'immutable', 'moment', 'sip.js', 'reconnecting-websocket'], factory) :
  (global['@wazo/sdk'] = factory(null,global.jsBase64,global.Immutable,global.moment,global.SIP,global.ReconnectingWebSocket));
}(this, (function (polyfill,jsBase64,immutable,moment,SIP,ReconnectingWebSocket) { 'use strict';

  moment = moment && moment.hasOwnProperty('default') ? moment['default'] : moment;
  SIP = SIP && SIP.hasOwnProperty('default') ? SIP['default'] : SIP;
  ReconnectingWebSocket = ReconnectingWebSocket && ReconnectingWebSocket.hasOwnProperty('default') ? ReconnectingWebSocket['default'] : ReconnectingWebSocket;

  /*       */

  class BadResponse {
    static fromResponse(response        ) {
      return new BadResponse(response.message, response.timestamp, response.error_id, response.details);
    }

    static fromText(response        ) {
      return new BadResponse(response);
    }

                    
                       
                     
                     

    constructor(message        , timestamp          = null, errorId          = null, details          = null) {
      this.message = message;
      this.timestamp = timestamp;
      this.errorId = errorId;
      this.details = details;
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

  class ApiRequester {
                   
                   

                   
                  
                   
                  
                     

    // eslint-disable-next-line
    static successResponseParser(response        , isJson         ) {
      return response.status === 204;
    }

    static parseBadResponse(parse          ) {
      return (response        ) => (response instanceof BadResponse ? response : parse(response));
    }

    static defaultParser(response        , isJson         ) {
      if (!response.ok) {
        return (isJson ? response.json() : response.text()).then(
          error => (isJson ? BadResponse.fromResponse(error) : BadResponse.fromText(error))
        );
      }

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
      return typeof btoa !== 'undefined' ? btoa(str) : jsBase64.Base64.encode(str);
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
      const newParse = method === 'delete' || method === 'head' ? ApiRequester.successResponseParser : parse;
      const options = {
        method,
        body: newBody,
        headers: headers ? ApiRequester.getHeaders(headers) : {},
        agent: this.agent
      };

      return fetch(url, options).then(response => {
        const contentType = response.headers.get('content-type') || '';
        const isJson = contentType.indexOf('application/json') !== -1;

        Logger.logRequest(url, options, response);

        // Throw an error only if status >= 500
        if (response.status >= 500) {
          const promise = isJson ? response.json() : response.text();

          return promise.then(err => {
            throw err;
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

                    
                    
                  
               
                                                
    

                       
                             
                           
                                 
              
    

  const LineRecord = immutable.Record({
    id: undefined,
    extensions: []
  });

  class Line extends LineRecord {
               
                                 

    static parse(plain              )       {
      return new Line({
        id: plain.id,
        extensions: plain.extensions
      });
    }
  }

  //      

                   
                        
                    
    

  const FORWARD_KEYS = {
    BUSY: 'busy',
    NO_ANSWER: 'noanswer',
    UNCONDITIONAL: 'unconditional'
  };

  const ForwardOptionRecord = immutable.Record({
    destination: undefined,
    enabled: undefined,
    key: undefined
  });

  class ForwardOption extends ForwardOptionRecord {
                        
                     
                

    static parse(plain          , key        )                {
      return new ForwardOption({
        destination: plain.destination || '',
        enabled: plain.enabled,
        key
      });
    }

    setDestination(number        ) {
      return this.set('destination', number);
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

                          
                                                
                      
                     
                 
                  
                 
                                                                                                                      
                                
                             
       
               
                     
                      
                     
                  
               
             
                            
                        
        
                 
                            
                        
        
                      
                            
                        
       
      
                                 
               
            
                        
       
     
    

  const ProfileRecord = immutable.Record({
    id: undefined,
    firstname: undefined,
    lastname: undefined,
    email: undefined,
    lines: undefined,
    username: undefined,
    mobileNumber: undefined,
    forwards: undefined,
    doNotDisturb: undefined,
    presence: PRESENCE.AVAILABLE
  });

  class Profile extends ProfileRecord {
               
                      
                     
                  
                       
                     
                         
                                   
                          
                     

    static parse(plain                 )          {
      return new Profile({
        id: plain.uuid,
        firstname: plain.firstname,
        lastname: plain.lastname,
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

    hasId(id        ) {
      return id === this.id;
    }

    setMobileNumber(number        ) {
      return this.set('mobileNumber', number);
    }

    setForwardOption(forwardOption               ) {
      const updatedForwardOptions = this.forwards.slice();
      const index = updatedForwardOptions.findIndex(forward => forward.is(forwardOption));
      updatedForwardOptions.splice(index, 1, forwardOption);
      return this.set('forwards', updatedForwardOptions);
    }

    setDoNotDisturb(enabled         ) {
      return this.set('doNotDisturb', enabled);
    }

    setPresence(presence        ) {
      return this.set('presence', presence);
    }
  }

  //      

                            
                      
                     
                        
                   
                     
                        
                      
                 
    

                          
                   
                                            
                
                      
                      
                        
                          
                        
                             
     
    

                           
                                 
                 
                                  
                                   
    

                                  
               
                       
                      
                    
                   
                        
                      
                     
                  
                      
                       
                     
    

  const ContactRecord = immutable.Record({
    name: undefined,
    number: undefined,
    favorited: undefined,
    email: undefined,
    endpointId: undefined,
    entreprise: undefined,
    birthday: undefined,
    address: undefined,
    note: undefined,
    personal: undefined,
    presence: undefined,
    source: undefined,
    sourceId: undefined,
    status: undefined,
    uuid: undefined
  });

  class Contact extends ContactRecord {
                 
                   
                       
                  
                       
                     
                    
                 
                       
                      
                     
                   
                     
                   
                 

    static merge(oldContacts                , newContacts                )                 {
      return newContacts.map(current => {
        const old = oldContacts.find(contact => contact.is(current));
        if (old !== undefined) {
          return current.merge(old);
        }

        return current;
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

    static parseManyPersonal(results                                )                 {
      return results.map(r => Contact.parsePersonal(r));
    }

    static parsePersonal(plain                         )          {
      return new Contact({
        name: `${plain.firstName || plain.firstname || ''} ${plain.lastName || plain.lastname || ''}`,
        number: plain.number || '',
        email: plain.email || '',
        source: 'personal',
        sourceId: plain.id,
        entreprise: plain.entreprise || '',
        birthday: plain.birthday || '',
        address: plain.address || '',
        note: plain.note || ''
      });
    }

    setFavorite(value         ) {
      return this.set('favorited', value);
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
      return this.set('presence', old.presence).set('status', old.status);
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
                                             

                   
           
                   
                          
                             
                        
                        
                      
                         
                             
                  
                         
                   
                          
                             
                              
                        
                                       
                     
       
     
    

  const SessionRecord = immutable.Record({
    token: undefined,
    uuid: undefined,
    profile: undefined
  });

  class Session extends SessionRecord {
                  
                 
                     

    static parse(plain          )          {
      return new Session({
        token: plain.data.token,
        uuid: plain.data.xivo_user_uuid
      });
    }

    static using(profile         )          {
      return this.set('profile', profile);
    }

    is(contact         )          {
      return Boolean(contact) && this.uuid === contact.uuid;
    }

    displayName()         {
      return `${this.profile.firstname} ${this.profile.lastname}`;
    }

    primaryLine()       {
      return this.profile.lines[0];
    }

    primaryContext()         {
      return this.primaryLine().extensions[0].context;
    }

    primaryNumber()         {
      return this.primaryLine().extensions[0].exten;
    }
  }

  /*       */

  const DEFAULT_BACKEND_USER = 'wazo_user';
  const DETAULT_EXPIRATION = 3600;

  var authMethods = (client              , baseUrl        ) => ({
    checkToken(token       )                   {
      return client.head(`${baseUrl}/token/${token}`, null, {});
    },

    authenticate(token       )                                 {
      return client
        .get(`${baseUrl}/token/${token}`, null, {})
        .then(ApiRequester.parseBadResponse(response => Session.parse(response)));
    },

    logIn(params         = {})                                 {
      const body = {
        backend: params.backend || DEFAULT_BACKEND_USER,
        expiration: params.expiration || DETAULT_EXPIRATION
      };
      const headers = {
        Authorization: `Basic ${ApiRequester.base64Encode(`${params.username}:${params.password}`)}`,
        'Content-Type': 'application/json'
      };

      return client
        .post(`${baseUrl}/token`, body, headers)
        .then(ApiRequester.parseBadResponse(response => Session.parse(response)));
    },

    logOut(token       )                                        {
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
      return client.get(`${baseUrl}/users`, 'get', null, token);
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

      return client.post(url, body, token, res => res.data.uuid).then(nodeUuid =>
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

      return client.delete(url, 'delete', null, token);
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
      return client.delete(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`, 'delete', null, token);
    }
  });

  /*       */

  var confdMethods = (client              , baseUrl        ) => ({
    listUsers(token       )                                  {
      return client.get(`${baseUrl}/users`, null, token);
    },

    getUser(token       , userUuid        )                     {
      return client.get(`${baseUrl}/users/${userUuid}`, null, token);
    },

    updateUser(token       , userUuid        , profile         )                   {
      const body = {
        firstname: profile.firstName,
        lastname: profile.lastName,
        email: profile.profile,
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
      return client.put(`${baseUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip`, null, token);
    },

    listApplications(token       )                                    {
      const url = `${baseUrl}/applications?recurse=true`;

      return client.get(url, null, token);
    },

    getSIP(token       , userUuid      , lineId        ) {
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

      const headers         = { 'X-Auth-Token': token };
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

  const ChatMessageRecord = immutable.Record({
    id: undefined,
    date: undefined,
    message: undefined,
    direction: undefined,
    destination: {
      serverId: undefined,
      userId: undefined
    },
    source: {
      serverId: undefined,
      userId: undefined
    },
    read: true
  });

  class ChatMessage extends ChatMessageRecord {
               
                 
                    
                      
                  
                       
                    
      

             
                       
                    
      

                  

    static parseMany(plain          )                     {
      return plain.items.map(item => ChatMessage.parse(item));
    }

    static parse(plain              )              {
      return new ChatMessage({
        id: uuid(),
        date: moment(plain.date),
        message: plain.msg,
        direction: plain.direction,
        destination: {
          serverId: plain.destination_server_uuid,
          userId: plain.destination_user_uuid
        },
        source: {
          serverId: plain.source_server_uuid,
          userId: plain.source_user_uuid
        }
      });
    }

    static parseMessageSent(plain                      )              {
      return new ChatMessage({
        id: uuid(),
        date: moment(),
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
        date: moment(),
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

    is(other             ) {
      return this.id === other.id;
    }

    isIncoming() {
      return this.direction === 'received';
    }

    acknowledge() {
      return this.set('read', true);
    }

    getTheOtherParty() {
      if (this.direction === 'sent') {
        return this.destination.userId;
      }
      return this.source.userId;
    }
  }

  //      

                          
                           
                          
                     
               
                   
                     
    

                   
               
                 
                   
                    
                 
                   
                   
                                      
      
    

  const VoicemailRecord = immutable.Record({
    id: undefined,
    date: undefined,
    duration: undefined,
    caller: {
      name: undefined,
      number: undefined
    },
    unread: undefined
  });

  class Voicemail extends VoicemailRecord {
               
                 
                              
             
                   
                    
      

                    

    static parse(plain                 )            {
      return new Voicemail({
        id: plain.id,
        date: moment.unix(plain.timestamp),
        duration: moment.duration(plain.duration, 'seconds'),
        caller: {
          name: plain.caller_id_name,
          number: plain.caller_id_num
        },
        unread: plain.folder ? plain.folder.type === 'new' : undefined
      });
    }

    static parseMany(plain          )                   {
      const plainUnread = plain.folders.filter(folder => folder.type === 'new')[0].messages;
      const plainRead = plain.folders.filter(folder => folder.type === 'old')[0].messages;

      const unread = plainUnread.map(message => Voicemail.parse(message)).map(voicemail => voicemail.set('unread', true));
      const read = plainRead.map(message => Voicemail.parse(message)).map(voicemail => voicemail.set('unread', false));

      return [...unread, ...read];
    }

    is(other           )          {
      return other && this.id === other.id;
    }

    acknowledge() {
      return this.set('unread', false);
    }

    contains(query        )          {
      if (!query) {
        return true;
      }
      return this.caller.name.toUpperCase().includes(query.toUpperCase()) || this.caller.number.includes(query);
    }
  }

  //      

                       
                    
                                
                                  
                   
                         
    

  const CallRecord = immutable.Record({
    id: undefined,
    calleeName: undefined,
    calleeNumber: undefined,
    status: undefined,
    startingTime: undefined
  });

  class Call extends CallRecord {
               
                       
                         
                   
                         

    static parseMany(plain                     )              {
      return plain.map((plainCall              ) => Call.parse(plainCall));
    }

    static parse(plain              )       {
      return new Call({
        id: plain.call_id,
        calleeName: plain.peer_caller_id_name,
        calleeNumber: plain.peer_caller_id_number,
        status: plain.status,
        startingTime: moment(plain.creation_time)
      });
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

    isUp()          {
      return this.status === 'Up';
    }

    isDown()          {
      return this.status === 'Down';
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
  }

  /*       */

  var ctidNgMethods = (client              , baseUrl        ) => ({
    updatePresence(token       , presence        )                   {
      return client.put(`${baseUrl}/users/me/presences`, { presence }, token, ApiRequester.successResponseParser);
    },

    listMessages(token       , participantUuid       )                                            {
      const body = participantUuid ? { participant_user_uuid: participantUuid } : null;

      return client
        .get(`${baseUrl}/users/me/chats`, body, token)
        .then(ApiRequester.parseBadResponse(response => ChatMessage.parseMany(response)));
    },

    sendMessage(token       , alias        , message        , toUserId        ) {
      const body = { alias, message, to: toUserId };

      return client.post(`${baseUrl}/users/me/chats`, body, token);
    },

    makeCall(token       , extension        ) {
      return client.post(`${baseUrl}/users/me/calls`, { from_mobile: true, extension }, token);
    },

    cancelCall(token       , callId        )                   {
      return client.delete(`${baseUrl}/users/me/calls/${callId}`, null, token);
    },

    listCalls(token       )                                     {
      return client
        .get(`${baseUrl}/users/me/calls`, null, token)
        .then(ApiRequester.parseBadResponse(response => Call.parseMany(response.items)));
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
      return client
        .get(`${baseUrl}/users/me/voicemails`, null, token)
        .then(ApiRequester.parseBadResponse(response => Voicemail.parseMany(response)));
    },

    deleteVoicemail(token       , voicemailId        )                   {
      return client.delete(`${baseUrl}/users/me/voicemails/messages/${voicemailId}`, null, token);
    },

    getPresence(token       , contactUuid      ) {
      return client.get(`${baseUrl}/users/${contactUuid}/presences`, null, token);
    },

    getStatus(token       , lineUuid      ) {
      return client.get(`${baseUrl}/lines/${lineUuid}/presences`, null, token);
    }
  });

  /*       */
                                                      

  const getContactPayload = (contact                      ) => ({
    email: contact.email,
    firstname: contact.firstName,
    lastname: contact.lastName,
    number: contact.phoneNumber,
    entreprise: contact.entreprise,
    birthday: contact.birthday,
    address: contact.address,
    note: contact.note
  });

  var dirdMethods = (client              , baseUrl        ) => ({
    search(token       , context        , term        )                                        {
      return client
        .get(`${baseUrl}/directories/lookup/${context}`, { term }, token)
        .then(ApiRequester.parseBadResponse(response => Contact.parseMany(response)));
    },

    listPersonalContacts(token       )                                        {
      return client
        .get(`${baseUrl}/personal`, null, token)
        .then(ApiRequester.parseBadResponse(response => Contact.parseManyPersonal(response)));
    },

    addContact(token       , contact            )                                 {
      return client
        .post(`${baseUrl}/personal`, getContactPayload(contact), token)
        .then(ApiRequester.parseBadResponse(response => Contact.parsePersonal(response)));
    },

    editContact(token       , contact         )                                 {
      return client.put(`${baseUrl}/personal/${contact.id}`, getContactPayload(contact), token);
    },

    deleteContact(token       , contactUuid      ) {
      return client.delete(`${baseUrl}/personal/${contactUuid}`, null, token);
    },

    listFavorites(token       , context        )                                        {
      return client
        .get(`${baseUrl}/directories/favorites/${context}`, null, token)
        .then(ApiRequester.parseBadResponse(response => Contact.parseMany(response)));
    },

    markAsFavorite(token       , source        , sourceId        )                   {
      const url = `${baseUrl}/directories/favorites/${source}/${sourceId}`;

      return client.put(url, 'put', null, token, ApiRequester.successResponseParser);
    },

    removeFavorite(token       , source        , sourceId        ) {
      return client.delete(`${baseUrl}/directories/favorites/${source}/${sourceId}`, null, token);
    }
  });

  //      

                          
                   
                      
                           
                                  
                              
                     
                
               
                             
                        
                 
    

                   
                     
                                  
                 
    

  const CallLogRecord = immutable.Record({
    answer: undefined,
    answered: undefined,
    newMissedCall: false,
    callDirection: undefined,
    destination: undefined,
    source: undefined,
    id: undefined,
    duration: undefined,
    start: undefined,
    end: undefined
  });

  class CallLog extends CallLogRecord {
                   
                      
                           
                          
                  
                        
                  
      

             
                        
                  
      

               
                     
                  
                

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
        answer: moment(plain.answer),
        answered: plain.answered,
        callDirection: plain.call_direction,
        destination: {
          extension: plain.destination_extension,
          name: plain.destination_name
        },
        source: {
          extension: plain.source_extension,
          name: plain.source_name
        },
        id: plain.id,
        duration: (plain.duration || 0) * 1000, // duration is in seconds
        start: moment(plain.start),
        end: moment(plain.end)
      });
    }

    static parseNew(plain                 , session         )          {
      return new CallLog({
        answer: moment(plain.answer),
        answered: plain.answered,
        callDirection: plain.call_direction,
        destination: {
          extension: plain.destination_extension,
          name: plain.destination_name
        },
        source: {
          extension: plain.source_extension,
          name: plain.source_name
        },
        id: plain.id,
        duration: (plain.duration || 0) * 1000, // duration is in seconds
        start: moment(plain.start),
        end: moment(plain.end),
        // @TODO: FIXME add verification declined vs missed call
        newMissedCall: plain.destination_extension === session.primaryNumber() && !plain.answered
      });
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
      return this.set('newMissedCall', false);
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
    search(token       , search        , limit         = 5)                                        {
      return client
        .get(`${baseUrl}/users/me/cdr`, { search, limit }, token)
        .then(ApiRequester.parseBadResponse(response => CallLog.parseMany(response)));
    },

    listCallLogs(token       , offset        , limit         = 5)                                        {
      return client
        .get(`${baseUrl}/users/me/cdr`, { offset, limit }, token)
        .then(ApiRequester.parseBadResponse(response => CallLog.parseMany(response)));
    },

    listCallLogsFromDate(token       , from            , number        )                                        {
      return client
        .get(`${baseUrl}/users/me/cdr`, { from, number }, token)
        .then(ApiRequester.parseBadResponse(response => CallLog.parseMany(response)));
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

  //      

  const states = ['STATUS_NULL', 'STATUS_NEW', 'STATUS_CONNECTING', 'STATUS_CONNECTED', 'STATUS_COMPLETED'];

  const getCallerID = session => ({
    caller_id_name: session.remoteIdentity.displayName,
    caller_id_number: session.remoteIdentity.uri.user
  });

  const getAutoAnswer = request => !!request.getHeader('alert-info');
  const DESTINATION_REGEXP = /^\+?[0-9#*]+$/;

                       
                        
                             
                              
                     
                
            
                   
     
    

  const defaultCallback = () => {
    console.warn('Please set a callback for WazoWebRTCClient');
  };

  class WebRTCClient {
                   
                      
                       

    constructor(config              , callback           = defaultCallback) {
      this.config = config;
      this.userAgent = this.configureUserAgent();
      this.callback = callback;
    }

    configureUserAgent() {
      const userAgent = new SIP.Web.Simple(this.getConfig());

      userAgent.on('registered', () => {
        this.callback('phone-events-registered');
      });

      userAgent.on('unregistered', () => {
        this.callback('phone-events-unregistered');
      });

      userAgent.on('new', session => {
        const info = {
          callerid: getCallerID(session),
          autoanswer: getAutoAnswer(session.request)
        };
        this.callback('phone-events-new', info);
      });

      userAgent.on('ringing', () => {
        this.callback('phone-events-ringing');
      });

      userAgent.on('connected', () => {
        this.callback('phone-events-connected');
      });

      userAgent.on('ended', () => {
        this.callback('phone-events-ended');
      });

      return userAgent;
    }

    getConfig() {
      return {
        media: {
          remote: {
            audio: this.config.media.audio
          }
        },
        ua: {
          traceSip: false,
          displayName: this.config.displayName,
          uri: this.config.uri,
          wsServers: this.config.wsServers,
          authorizationUser: this.config.authorizationUser,
          password: this.config.password,
          sessionDescriptionHandlerFactoryOptions: {
            peerConnectionOptions: {
              iceCheckingTimeout: 500,
              rtcpMuxPolicy: 'negotiate',
              rtcConfiguration: {
                iceServers: {
                  urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302']
                }
              }
            }
          }
        }
      };
    }

    getState() {
      return states[this.userAgent.state];
    }

    call(destination        ) {
      if (DESTINATION_REGEXP.exec(destination)) {
        this.userAgent.call(destination);
      }
    }

    answer() {
      this.userAgent.answer();
    }

    reject() {
      this.userAgent.reject();
    }

    hangup() {
      this.userAgent.hangup();
    }

    close() {
      this.userAgent.transport.disconnect();
    }
  }

  //      

                                                                                                      

  class WebSocketClient {
                         
                       
                 
                  
                          

    constructor({ callback, host, token, events = [] }                   ) {
      this.initialized = false;
      this.callback = callback;
      this.host = host;
      this.token = token;
      this.events = events;
    }

    connect() {
      const sock = new ReconnectingWebSocket(`wss://${this.host}/api/websocketd/?token=${this.token}`);
      sock.debug = false;

      sock.onmessage = (event              ) => {
        const message = JSON.parse(typeof event.data === 'string' ? event.data : '{}');

        if (!this.initialized) {
          this.handleMessage(message, sock);
        } else {
          this.callback(message);
        }
      };

      sock.onclose = e => {
        switch (e.code) {
          case 4002:
            break;
          case 4003:
            break;
          default:
        }
      };

      return sock;
    }

    handleMessage(message        , sock           ) {
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
        // nothing
      }
    }
  }

  var Country = {
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

                                     
                  
                     
    

  const NotificationOptionsRecord = immutable.Record({
    sound: true,
    vibration: true
  });

  class NotificationOptions extends NotificationOptionsRecord {
                   
                       

    static parse(plain                            )                      {
      if (!plain) {
        return new NotificationOptions();
      }

      return new NotificationOptions({
        sound: plain.sound,
        vibration: plain.vibration
      });
    }

    setSound(sound         )          {
      return this.set('sound', sound);
    }

    setVibration(vibration         ) {
      return this.set('vibration', vibration);
    }

    enable() {
      return this.set('vibration', true).set('sound', true);
    }

    disable() {
      return this.set('vibration', false).set('sound', false);
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
    Call,
    CallLog,
    ChatMessage,
    Contact,
    Country,
    ForwardOption,
    Line,
    NotificationOptions,
    Profile,
    Session,
    Voicemail,
    DebugPhone,
    DebugDevice
  };

  return index;

})));
