// import { useRef, useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5500"); // Connect to the signaling server

// const VideoComponent = () => {
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnectionRef = useRef(null);
//   const [roomId, setRoomId] = useState("");
//   const [connected, setConnected] = useState(false);

//   const joinRoom = () => {
//     if (roomId) {
//       socket.emit("join-room", roomId);
//       console.log(`Joined room ${roomId}`);
//     }
//   };
//   useEffect(() => {
//     socket.on("signal", async (data) => {
//       if (!peerConnectionRef.current) return;

//       if (data.type === "offer") {
//         await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
//         const answer = await peerConnectionRef.current.createAnswer();
//         await peerConnectionRef.current.setLocalDescription(answer);
//         socket.emit("signal", { to: data.from, type: "answer", answer });
//       } else if (data.type === "answer") {
//         await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
//       } else if (data.type === "candidate") {
//         await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//       }
//     });

//     return () => socket.off("signal");
//   }, []);

//   const startCall = async () => {
//     joinRoom()
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     localVideoRef.current.srcObject = stream;

//     peerConnectionRef.current = new RTCPeerConnection({
//       iceServers: [
//         { urls: "stun:stun.l.google.com:19302" }, // Free STUN server
//       ],
//     });

//     stream.getTracks().forEach((track) => peerConnectionRef.current.addTrack(track, stream));

//     peerConnectionRef.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("signal", { to: roomId, type: "candidate", candidate: event.candidate });
//       }
//     };

//     peerConnectionRef.current.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     const offer = await peerConnectionRef.current.createOffer();
//     await peerConnectionRef.current.setLocalDescription(offer);

//     socket.emit("signal", { to: roomId, type: "offer", offer });
//     setConnected(true);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <input
//         type="text"
//         placeholder="Enter Room ID"
//         value={roomId}
//         onChange={(e) => setRoomId(e.target.value)}
//         className="p-2 border rounded mb-4"
//       />
//       {!connected && <button onClick={startCall} className="p-2 bg-blue-500 text-white rounded">Start Call</button>}
//       <div className="mt-4 flex gap-4">
//         <video ref={localVideoRef} autoPlay playsInline className="w-1/2 border border-blue-500 rounded" />
//         <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 border border-red-500 rounded" />
//       </div>
//     </div>
//   );
// };

// export default VideoComponent;


// import { useRef, useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const VideoComponent = () => {
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnectionRef = useRef(null);
//   const [socket, setSocket] = useState(null); // Store unique socket instance
//   const [socketId, setSocketId] = useState("");
//   const [peerSocketId, setPeerSocketId] = useState(""); // Store peer's Socket ID
//   const [connected, setConnected] = useState(false);

//   useEffect(() => {
//     const newSocket = io("http://localhost:5500", { forceNew: true }); // Create a fresh socket
//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       setSocketId(newSocket.id);
//       console.log("My Socket ID:", newSocket.id);
//     });

//     // Listen for available peers
//     newSocket.on("new-peer", (peerId) => {
//       if (peerId !== newSocket.id) {
//         setPeerSocketId(peerId);
//         console.log("Peer Connected:", peerId);
//       }
//     });

//     // Handle WebRTC signaling
//     newSocket.on("signal", async (data) => {
//       if (!peerConnectionRef.current) return;

//       if (data.type === "offer") {
//         await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
//         const answer = await peerConnectionRef.current.createAnswer();
//         await peerConnectionRef.current.setLocalDescription(answer);
//         newSocket.emit("signal", { to: data.from, type: "answer", answer });
//       } else if (data.type === "answer") {
//         await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
//       } else if (data.type === "candidate") {
//         await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//       }
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   const startCall = async () => {
//     if (!peerSocketId) {
//       alert("No peer available yet!");
//       return;
//     }

//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     localVideoRef.current.srcObject = stream;

//     peerConnectionRef.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     stream.getTracks().forEach((track) => peerConnectionRef.current.addTrack(track, stream));

//     peerConnectionRef.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("signal", { to: peerSocketId, type: "candidate", candidate: event.candidate });
//       }
//     };

//     peerConnectionRef.current.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     const offer = await peerConnectionRef.current.createOffer();
//     await peerConnectionRef.current.setLocalDescription(offer);

//     socket.emit("signal", { to: peerSocketId, type: "offer", offer });
//     setConnected(true);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <p>My Socket ID: {socketId}</p>
//       <p>Peer Socket ID: {peerSocketId || "Waiting for a peer..."}</p>
//       {!connected && <button onClick={startCall} className="p-2 bg-blue-500 text-white rounded">Start Call</button>}
//       <div className="mt-4 flex gap-4">
//         <video ref={localVideoRef} autoPlay playsInline className="w-1/2 border border-blue-500 rounded" />
//         <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 border border-red-500 rounded" />
//       </div>
//     </div>
//   );
// };

// export default VideoComponent;

import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5500"); // Connect to signaling server

const VideoComponent = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [socketId, setSocketId] = useState("");
  const [peerSocketId, setPeerSocketId] = useState(""); // Manual peer ID entry
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Get assigned Socket ID
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("My Socket ID:", socket.id);
    });

    // Handle WebRTC signaling
    socket.on("signal", async (data) => {
      if (!peerConnectionRef.current) return;

      if (data.type === "offer") {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit("signal", { to: data.from, type: "answer", answer });
      } else if (data.type === "answer") {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.type === "candidate") {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    return () => {
      socket.off("connect");
      socket.off("signal");
    };
  }, []);

  const startCall = async () => {
    if (!peerSocketId) {
      alert("Enter the peer's Socket ID!");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;

    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    stream.getTracks().forEach((track) => peerConnectionRef.current.addTrack(track, stream));

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", { to: peerSocketId, type: "candidate", candidate: event.candidate });
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socket.emit("signal", { to: peerSocketId, type: "offer", offer });
    setConnected(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <p>My Socket ID: <strong>{socketId}</strong></p>

      <input
        type="text"
        placeholder="Enter Peer Socket ID"
        value={peerSocketId}
        onChange={(e) => setPeerSocketId(e.target.value)}
        className="p-2 border rounded mb-4"
      />

      {!connected && <button onClick={startCall} className="p-2 bg-blue-500 text-white rounded">Start Call</button>}
      <div className="mt-4 flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline className="w-1/2 border border-blue-500 rounded" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/3 border border-red-500 rounded" style={{width:"200px"}} />
      </div>
    </div>
  );
};

export default VideoComponent;
