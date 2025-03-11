export const startCamera = async (): Promise<Blob> => {
  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: { 
      facingMode: 'environment',
      width: { ideal: 1920 },
      height: { ideal: 1080 }
    } 
  });

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    
    // Create camera UI
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black flex items-center justify-center z-50';
    
    const cameraUI = document.createElement('div');
    cameraUI.className = 'relative w-full max-w-2xl mx-4';
    
    const videoContainer = document.createElement('div');
    videoContainer.className = 'relative aspect-[4/3] bg-black rounded-lg overflow-hidden';
    
    const captureButton = document.createElement('button');
    captureButton.className = 'absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2';
    closeButton.innerHTML = '✕';
    
    video.className = 'w-full h-full object-cover';
    video.srcObject = stream;
    video.setAttribute('playsinline', 'true');
    
    videoContainer.appendChild(video);
    videoContainer.appendChild(captureButton);
    videoContainer.appendChild(closeButton);
    cameraUI.appendChild(videoContainer);
    overlay.appendChild(cameraUI);
    document.body.appendChild(overlay);

    const cleanup = () => {
      stream.getTracks().forEach(track => track.stop());
      overlay.remove();
    };

    closeButton.onclick = () => {
      cleanup();
      reject(new Error('Camera closed'));
    };

    captureButton.onclick = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob(blob => {
        if (blob) {
          cleanup();
          resolve(blob);
        } else {
          reject(new Error('Failed to capture photo'));
        }
      }, 'image/jpeg', 0.8);
    };

    video.onloadedmetadata = () => {
      video.play();
    };
  });
};