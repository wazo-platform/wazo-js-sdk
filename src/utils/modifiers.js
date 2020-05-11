// Remove `video=*` from SDP bundle
export const fixVideoBundle = (description) => Promise.resolve({
  ...description,
  sdp: description.sdp.replace(/((?!a=group:BUNDLE) )(video-\d+)*/g, '$1').replace('  ', ' ').replace(/\s+$/, ''),
});

// Replace video port to 0 to stop video flow
export const replaceVideoPort = (description) => Promise.resolve({
  ...description,
  sdp: description.sdp.replace(/m=video \d+/, 'm=video 0'),
});
