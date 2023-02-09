# HarmonyXR

<p align="center"><img src="https://user-images.githubusercontent.com/20539422/200205654-5167ec1e-7f52-4e76-b1a0-7cf3dceab172.png" width="30%" height="30%"></p>

HarmonyXR is a project to implement real-time music performance in the virtual reality environment.

HarmonyXR is a project that uses [WebXR](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Fundamentals). It builds a web server with Node.js, implements 3D graphics with Three.js, and implements real-time communication between users with WebRTC using PeerJS.

## Project Features

- Virtual Music Stage
- Real-time multi-user experience
- Real-time Voice Chat
- Cross platform (Any platform you can use a browser that [supports WebXR](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API#browser_compatibility).)

## Run on localhost

WebXR only supports HTTPS environment, so for testing, you need to issue an SSL certificate or enable `#unsafely-treat-insecure-origin-as-secure` in the chrome flags page.

```zsh
docker build --tag harmonyxr .
docker run -d -p 8006:8006 --name harmonyxr harmonyxr
```

Open <http://localhost:8006> on web browser.

## Implementation

### Networking Structure

<p align="center"><img src="https://user-images.githubusercontent.com/20539422/200207223-192dc0c2-1809-4a4a-9f8b-7e21f420097b.png" width="50%" height="50%"></p>

It builds a web server using Nodejs and communicates with users using Socket.io to implement room functions and manage the user's connection status.

Then, real-time communication between users is implemented using WebRTC technology using PeerJS.<br>
At this time, the real-time voice chat and location information are synchronized through user-to-user communication. This P2P communication is defined in `/public/networking.js`.

### Virtual Environment

<p align="center"><img src="https://user-images.githubusercontent.com/20539422/200207817-02251089-a5cf-4736-b362-3b1ecbcfd59b.png" width="80%" height="80%"></p>

HarmonyXR implemented 3D graphics using Three.js.<br>
To implement various things, MusicRoom, Partner, Piano, Drum, Guitar objects, etc. were defined.

We also implemented collision handling between controllers and instruments using the Box3 object of Three.js.

The 3D models were used free resources from Sketchfab.

## TODO

- Update human models
- Optimize animation and rendering, Improve FPS
- There is no wall. it would be better to add wooden or cementic wall would be better to added
- Add More Instuments


## Members

Beomgi Kim | chromato99@gmail.com<br>
Doyeon Hyun | 118ssun@naver.com<br>
Siwoo Lim | siwoo5530@gmail.com<br>
Jaejun Park | jpark3971@gmail.com

## Reference

3D Models from Sketchfab<br>
Icons from Flaticon
