window.addEventListener("load", () => {
  // Local Video
  const localImageEl = $("#local-image");
  const localVideoEl = $("#local-video");

  // Remote Videos
  const remoteVideosEl = $("#remote-videos");
  let remoteVideosCount = 0;

  // Hide cameras until they are initialized
  localVideoEl.hide();

  // create our webrtc connection
  const webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: "local-video",
    // the id/element dom element that will hold remote videos
    remoteVideosEl: "remote-videos",
    // immediately ask for camera access
    autoRequestMedia: true,
    debug: false,
    detectSpeakingEvents: true,
    autoAdjustMic: false
  });

  // We got access to local camera
  webrtc.on("localStream", () => {
    localImageEl.hide();
    localVideoEl.show();
  });

  // Remote video was added
  webrtc.on("videoAdded", (video, peer) => {
    // eslint-disable-next-line no-console
    console.log("new client added");
    //   const id = webrtc.getDomId(peer);
    //   const html = remoteVideoTemplate({ id });
    //   if (remoteVideosCount === 0) {
    //     remoteVideosEl.html(html);
    //   } else {
    //     remoteVideosEl.append(html);
    //   }
    //   $(`#${id}`).html(video);
    //   $(`#${id} video`).addClass('ui image medium'); // Make video element responsive
    //   remoteVideosCount += 1;
  });

  function createRoom(roomName) {
    console.info(`Creating new room: ${roomName}`);
    webrtc.createRoom(roomName, (err, name) => {
      console.info(`Created new room: ${roomName}`);
    });
  }

  // Join existing Chat Room
  const joinRoom = roomName => {
    // eslint-disable-next-line no-console
    console.log(`Joining Room: ${roomName}`);
    webrtc.joinRoom(roomName);
    console.log("joined");
  };
});
