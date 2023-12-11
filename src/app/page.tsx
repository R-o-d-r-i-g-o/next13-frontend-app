"use client"

import { useEffect, useState, useRef } from 'react';

const splitVideoIntoChunks = (videoBytes, chunkSize) => {
  const chunks = [];
  let byteIndex = 0;

  while (byteIndex < videoBytes?.byteLength) {
    const remainingBytes = videoBytes.byteLength - byteIndex;
    const currentChunkSize = Math.min(chunkSize, remainingBytes);
    const chunk = videoBytes.slice(byteIndex, byteIndex + currentChunkSize);
    chunks.push(chunk);
    byteIndex += currentChunkSize;
  }

  return chunks;
};

const concatenateChunks = (chunks) => {
  if (chunks.length === 1) {
    return chunks;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
  const concatenatedVideo = new Uint8Array(totalLength);

  let offset = 0;

  chunks.forEach((chunk) => {
    concatenatedVideo.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  });

  return concatenatedVideo.buffer;
};

const VideoPlayer = ({ videoBytes }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const chunks = splitVideoIntoChunks(videoBytes, 1024 * 1024);

    console.log('oq ue vieo nos chunks', chunks)

    videoBytes = concatenateChunks(chunks)

    if (videoRef.current && videoBytes) {
      const videoBlob = new Blob([videoBytes], { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(videoBlob);
      videoRef.current.src = videoUrl;
    }
  }, [videoBytes]);

  return <video ref={videoRef} width="640" height="480" controls />;
};


// const VideoPlayer = ({ videoBytes }) => {
//   const videoRef = useRef(null);
//   const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

//   useEffect(() => {

//     const chunks = splitVideoIntoChunks(videoBytes, 1024 * 1024);

//     console.log('oq ue vieo nos chunks', chunks)

//     const videoChunks = concatenateChunks(chunks)

//     const playChunks = async () => {
//       if (videoChunks?.length === 0) {
//         console.log('saiu aqui ')
//         return;
//       }

//       const mediaSource = new MediaSource();
//       videoRef.current.src = URL.createObjectURL(mediaSource);

//       mediaSource.addEventListener('sourceopen', async () => {
//         const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');

//         const playNextChunk = async () => {
//           console.log('veio auqui 123', currentChunkIndex, videoChunks.length)
//           if (mediaSource.readyState === 'open' && !sourceBuffer.updating) {

//             if (currentChunkIndex < videoChunks.length) {
//               console.log('entrou auqui 123', )
//               const chunk = videoChunks[currentChunkIndex];
//               sourceBuffer.appendBuffer(chunk);

//               // Avança para o próximo chunk
//               setCurrentChunkIndex((prevIndex) => prevIndex + 1);
//             }
//           }
//         };

//         sourceBuffer.addEventListener('updateend', playNextChunk);

//         // Inicia a reprodução
//         playNextChunk();
//       });
//     };

//     playChunks();
//   }, [videoBytes, currentChunkIndex]);

//   return <video ref={videoRef} width="640" height="480" controls />;
// };


const CameraCapture = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [capturedVideoBytes, setCapturedVideoBytes] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          mediaRecorderRef.current = new MediaRecorder(stream);

          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunksRef.current.push(event.data);
            }
          };

          mediaRecorderRef.current.onstop = () => {
            const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
            const videoArrayBuffer = new Uint8Array(videoBlob.size);
            const fileReader = new FileReader();

            fileReader.onloadend = () => {
              const videoBytes = fileReader.result;
              // Aqui você pode enviar os bytes para o servidor em tempo real
              setCapturedVideoBytes(videoBytes);
              console.log('Video Bytes:', videoBytes);
            };

            fileReader.readAsArrayBuffer(videoBlob);
          };

          mediaRecorderRef.current.start();
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    // Cleanup function to stop the camera and media recorder when the component unmounts
    return () => {
      const tracks = videoRef.current?.srcObject?.getTracks();
      tracks && tracks.forEach(track => track.stop());

      mediaRecorderRef.current?.stop();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay playsInline />
      <button onClick={() => mediaRecorderRef.current?.stop()}>Stop Recording</button>
      <VideoPlayer videoBytes={capturedVideoBytes} />
    </div>
  );
};

export default CameraCapture;
