// import { 
//   CallControls,
//   CallingState, 
//   ParticipantView, 
//   SpeakerLayout, 
//   StreamCall, 
//   StreamTheme, 
//   StreamVideo, 
//   StreamVideoClient, 
//   useCall, 
//   useCallStateHooks 
// } from '@stream-io/video-react-sdk';

// const apiKey = 'mmhfdzb5evj2';
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL05vbV9Bbm9yIiwidXNlcl9pZCI6Ik5vbV9Bbm9yIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3NDE2NzEwMDEsImV4cCI6MTc0MjI3NTgwMX0.aIzseG8Z0wPd5GNMblRPxR3GHGhmANFRGF4uU6IsutQ';
// const userId = 'Nom_Anor';
// const callId = '8SebCNMv7njD';

// // Set up the user object
// const user = {
//   id: userId,
//   name: 'Oliver',
//   image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
// };

// // Initialize Stream Video Client
// const client = new StreamVideoClient({ apiKey, user, token });
// const call = client.call('default', callId);
// call.join({ create: true });

// export default function App() {
//   return (
//     <StreamVideo client={client}>
//       <StreamCall call={call}>
//         <MyUILayout />
//       </StreamCall>
//     </StreamVideo>
//   );
// }

// export const MyParticipantList = (props) => {const { participants } = props;
//   return (
//     <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
//       {participants.map((participant) => (
//         <ParticipantView participant={participant} key={participant.sessionId} />
//       ))}
//     </div>
//   );
// };
// export const MyFloatingLocalParticipant = (props) => {
//   const { participant } = props;
//   return (
//     <div
//       style={{
//         position: 'absolute',
//         top: '15px',
//         left: '15px',
//         width: '240px',
//         height: '135px',
//         boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 3px',
//         borderRadius: '12px',
//       }}
//     >
//       <ParticipantView participant={participant} />
//     </div>
//   );
// };


// export const MyUILayout = () => {
//   const call = useCall();
//   const { useCallCallingState } = useCallStateHooks();
//   const callingState = useCallCallingState();

//   if (callingState !== CallingState.JOINED) {
//     return <div>Loading...</div>;
//   }

//   return (
   
//       <StreamTheme style={{position:"relative "}}>
//         <SpeakerLayout participantsBarPosition={'bottom'} />
//         <CallControls/>
//       </StreamTheme>

//    );
// };
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCall,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import '@stream-io/video-react-sdk/dist/css/styles.css';


const apiKey = "mmhfdzb5evj2";
// action.tokenGenerate
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0tpcl9LYW5vcyIsInVzZXJfaWQiOiJLaXJfS2Fub3MiLCJ2YWxpZGl0eV9pbl9zZWNvbmRzIjo2MDQ4MDAsImlhdCI6MTc0MTE4MzMxNSwiZXhwIjoxNzQxNzg4MTE1fQ.tg-zVpBpMerJsY4_TaoRkmdfhq3ZcQJkpp4GfNqYkRM";
const userId = "Kir_Kanos";
const callId = "P3f6H2IY5KpV";

// set up the user object
const user = {
  id: userId,
  name: "Oliver",
  image: "https://getstream.io/random_svg/?id=oliver&name=Oliver",
};


const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call("default", callId);
call.join({ create: true });

export default function App() {
  return (
    // streamClient provider
      <StreamVideo client={client}> 
          <StreamCall call={call}>
              <MyUILayout />
          </StreamCall>
      </StreamVideo>
  );
}

export const MyUILayout = () => {
  // const call = useCall();

  const { useCallCallingState, useParticipantCount, useLocalParticipant, useRemoteParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  // const participantCount = useParticipantCount();
  // const localParticipant=useLocalParticipant()
  // const remoteParticipants=useRemoteParticipants()

  if (callingState !== CallingState.JOINED) {
      return <div>Loading...</div>;
  }

  return (
      //     <div>
      //       {/* Call "{call.id}" has {participantCount} participants */}
      //       <StreamTheme>
      //       {/* <MyParticipantList participants={remoteParticipants} /> */}
      //       {/* <MyFloatingLocalParticipant participant={localParticipant} /> */}
      //       <SpeakerLayout participantsBarPosition='bottom'/>
      // <CallControls/>
      //       </StreamTheme>
      //     </div>
      <StreamTheme>
        <SpeakerLayout />

          <CallControls /> 
          {/* <VideoPreview /> */}
      </StreamTheme>
  );
};