# ICE Connectivity Warmup

This feature enables ICE (Interactive Connectivity Establishment) warmup after successful registration to improve call setup times and detect connectivity issues early.

## Configuration

Enable ICE warmup in your WebRTC configuration:

```javascript
const config = {
  host: 'your.wazo.server',
  authorizationUser: 'username',
  password: 'password',
  iceWarmupEnabled: true, // Enable ICE warmup (default: true)
  // ... other config options
};

const client = new WebRTCClient(config);
```

## Events

Listen for ICE warmup events:

```javascript
// ICE warmup completed successfully
client.on(client.ON_ICE_WARMUP_COMPLETED, (result) => {
  console.log('ICE warmup completed:', result);
  // result = { candidatesCount: 4, hasValidCandidate: true }
});

// ICE warmup failed
client.on(client.ON_ICE_WARMUP_FAILED, (error) => {
  console.error('ICE warmup failed:', error);
  // May indicate network issues or firewall restrictions
});
```

## Manual Warmup

You can also trigger ICE warmup manually:

```javascript
try {
  await client.warmupIceConnectivity();
  console.log('ICE warmup successful');
} catch (error) {
  console.error('ICE warmup failed:', error);
}
```

## How It Works

1. **After Successful Registration**: ICE warmup automatically starts after the WebRTC client successfully registers with the server.

2. **Creates Test Connection**: A temporary RTCPeerConnection is created using the same ICE servers configuration as actual calls.

3. **Gathers ICE Candidates**: The test connection gathers ICE candidates, including STUN reflexive (srflx) and TURN relay candidates.

4. **Validates Connectivity**: The warmup succeeds if valid candidates (srflx or relay) are found, indicating good network connectivity.

5. **Early Detection**: Network issues, NAT problems, or firewall restrictions are detected before making actual calls.

6. **Cleanup**: The test connection is automatically cleaned up after completion or timeout.

## Benefits

- **Faster Call Setup**: Pre-warmed NAT bindings reduce ICE gathering time during actual calls
- **Early Problem Detection**: Network connectivity issues are identified before call attempts
- **Better User Experience**: Reduced call establishment delays
- **Improved Reliability**: Early validation of STUN/TURN server accessibility

## Configuration Options

```javascript
const config = {
  iceWarmupEnabled: true,     // Enable/disable ICE warmup (default: true)
  iceCheckingTimeout: 1000,   // ICE checking timeout for actual calls (default: 1000ms)
  // ICE warmup uses a fixed 8-second timeout
};
```

## Error Handling

ICE warmup failures are non-blocking and won't prevent normal operation:

```javascript
client.on(client.ON_ICE_WARMUP_FAILED, (error) => {
  if (error.message.includes('timeout')) {
    console.warn('ICE warmup timed out - possible slow network');
  } else if (error.message.includes('No valid ICE candidates')) {
    console.warn('No STUN/TURN connectivity - calls may have issues');
  }
  
  // Calls can still be made, but may experience longer setup times
});
```

## Integration with Existing Code

ICE warmup integrates seamlessly with existing code:

```javascript
// No changes needed to existing call logic
const session = client.call('1234', true); // Video call

// ICE warmup runs in background after registration
// and doesn't affect call behavior
```

## Debugging

Enable detailed logging to debug ICE warmup:

```javascript
const config = {
  log: {
    builtinEnabled: true,
    logLevel: 'debug'
  }
};
```

Look for these log messages:
- `Starting ICE connectivity warmup`
- `ICE warmup candidate gathered`
- `Valid ICE candidate found during warmup`
- `ICE warmup completed` 