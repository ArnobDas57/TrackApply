import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";
import GLOBE from "vanta/dist/vanta.globe.min";

const VantaBackground = ({ themeMode }) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  const getEffectAndOptions = () => {
    if (themeMode === "dark") {
      return {
        effect: GLOBE,
        options: {
          backgroundColor: 0x130928,
          color: 0x3fffd3,
          color2: 0xffffff,
          size: 1.5,
          spacing: 20.0,
        },
      };
    } else {
      // light mode
      return {
        effect: FOG,
        options: {
          highlightColor: 0xf9e7b7,
          midtoneColor: 0xffd600,
          lowlightColor: 0x2d00ff,
          baseColor: 0xffebeb,
          blurFactor: 0.48,
        },
      };
    }
  };

  useEffect(() => {
    // Destroy existing Vanta effect before creating a new one
    if (vantaEffect) vantaEffect.destroy();

    const { effect: VantaType, options: vantaOptions } = getEffectAndOptions();

    const effect = VantaType({
      el: vantaRef.current,
      THREE, // Pass THREE.js library
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      speed: 1.6,
      scaleMobile: 1.0,
      ...vantaOptions, // Spread the theme-specific options here
    });

    setVantaEffect(effect);

    // Cleanup function to destroy Vanta effect when component unmounts or dependencies change
    return () => {
      if (effect) effect.destroy();
    };
  }, [themeMode]); // Only re-run when themeMode changes, as location.pathname is no longer a dependency

  return (
    <div
      ref={vantaRef}
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: -10,
      }}
    ></div>
  );
};

export default VantaBackground;
