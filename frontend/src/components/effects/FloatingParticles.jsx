import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const FloatingParticles = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
            options={{
                fpsLimit: 60,
                particles: {
                    number: {
                        value: 25,
                        density: {
                            enable: false
                        }
                    },
                    color: {
                        value: "#2D4B37"
                    },
                    shape: {
                        type: "circle"
                    },
                    opacity: {
                        value: { min: 0.1, max: 0.3 },
                        animation: {
                            enable: true,
                            speed: 0.5,
                            sync: false
                        }
                    },
                    size: {
                        value: { min: 1, max: 3 }
                    },
                    move: {
                        enable: true,
                        speed: { min: 0.3, max: 0.8 },
                        direction: "top",
                        random: true,
                        straight: false,
                        outModes: {
                            default: "out"
                        }
                    }
                },
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "parallax"
                        }
                    },
                    modes: {
                        parallax: {
                            enable: true,
                            force: 2,
                            smooth: 10
                        }
                    }
                },
                detectRetina: true
            }}
        />
    );
};

export default FloatingParticles;
