import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import WebXRPolyfill from 'webxr-polyfill';

interface ARViewProps {
  layers: any[]; // Replace 'any' with your actual layer type
}

const ARView: React.FC<ARViewProps> = ({ layers }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize WebXR polyfill
    new WebXRPolyfill();

    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let arSession: XRSession | null = null;

    const init = async () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
      
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: canvasRef.current as HTMLCanvasElement,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;

      // Check if AR is supported
      if ('xr' in navigator) {
        try {
          const supported = await (navigator as any).xr.isSessionSupported('immersive-ar');
          if (supported) {
            const startARButton = document.createElement('button');
            startARButton.textContent = 'Start AR';
            startARButton.onclick = startAR;
            document.body.appendChild(startARButton);
          } else {
            setError('AR not supported on this device');
            setupEmulation();
          }
        } catch (error) {
          console.error('Error checking AR support:', error);
          setError('Error checking AR support');
          setupEmulation();
        }
      } else {
        setError('WebXR not supported in this browser');
        setupEmulation();
      }

      // Add some test geometry
      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(0, 0, -0.5);
      cube.name = 'cube';
      scene.add(cube);

      window.addEventListener('resize', onWindowResize, false);
    };

    const setupEmulation = () => {
      camera.position.set(0, 1.6, 0);
      renderer.setAnimationLoop(render);
    };

    const startAR = async () => {
      if (!('xr' in navigator)) {
        setError('WebXR not supported');
        setupEmulation();
        return;
      }

      try {
        const session = await (navigator as any).xr.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay'],
          domOverlay: { root: document.body }
        });

        session.addEventListener('end', () => {
          arSession = null;
          setupEmulation();
        });

        await renderer.xr.setSession(session);
        arSession = session;

        // Set up the WebXR camera
        const onXRFrame = (time: number, frame: XRFrame) => {
          session.requestAnimationFrame(onXRFrame);
          const referenceSpace = renderer.xr.getReferenceSpace();
          if (referenceSpace) {
            const pose = frame.getViewerPose(referenceSpace);
            if (pose) {
              const view = pose.views[0];
              const viewport = session.renderState.baseLayer?.getViewport(view);
              if (viewport) {
                renderer.setSize(viewport.width, viewport.height);
              }
            }
          }
          renderer.render(scene, camera);
        };
        session.requestAnimationFrame(onXRFrame);
      } catch (error) {
        console.error('Failed to start AR session:', error);
        setError('Failed to start AR session. Please ensure camera permissions are granted.');
        setupEmulation();
      }
    };

    const render = () => {
      const cube = scene.getObjectByName('cube');
      if (cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    init();

    return () => {
      if (arSession) {
        arSession.end().catch(console.error);
      }
      renderer.dispose();
      window.removeEventListener('resize', onWindowResize);
    };
  }, [layers]);

  return (
    <div>
      <canvas ref={canvasRef} />
      {error && <div style={{ color: 'red', position: 'absolute', top: 10, left: 10 }}>{error}</div>}
    </div>
  );
};

export default ARView;