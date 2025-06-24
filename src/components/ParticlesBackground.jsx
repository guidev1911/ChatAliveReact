import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticlesBackground = React.memo(() => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute w-full h-full z-0"
        options={{
            background: { color: { value: "transparent" } },
            fpsLimit: 120,
            interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 } },
            },
            particles: {
            color: { value: "#00FFFF" },
            links: {
                enable: true,
                color: "#00FFFF",
                distance: 150,
                opacity: 0.4,
                width: 1,
            },
            move: { enable: true, speed: 1 },
            number: { value: 60, density: { enable: true, area: 600 } },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: 2 },
            },
            detectRetina: true,
        }}
    />
  );
});

export default ParticlesBackground;
