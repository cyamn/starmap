"use client";

import React, { useEffect } from "react";

interface Properties {
  speedFactor?: number;
  backgroundColor?: string;
  starColor?: [number, number, number];
  starCount?: number;
  acceleration?: number;
  maxSpeedFactor?: number;
  colorNoise?: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function color(value: number) {
  return clamp(value, 0, 255);
}

export default function Starfield(properties: Properties) {
  const {
    speedFactor: speedFactor_ = 0.05,
    backgroundColor = "black",
    starColor = [255, 255, 255],
    starCount = 5000,
    acceleration = 1,
    maxSpeedFactor = 0.8,
    colorNoise = 100,
  } = properties;

  const speedFactor = speedFactor_;

  useEffect(() => {
    const canvas = document.querySelector("#starfield") as HTMLCanvasElement;

    if (canvas) {
      const c = canvas.getContext("2d");

      if (c) {
        let w = window.innerWidth;
        let h = window.innerHeight;

        const setCanvasExtents = () => {
          canvas.width = w;
          canvas.height = h;
        };

        setCanvasExtents();

        window.addEventListener("resize", () => {
          setCanvasExtents();
        });

        const makeStars = (count: number) => {
          const out = [];
          for (let index = 0; index < count; index++) {
            const s = {
              x: Math.random() * 1600 - 800,
              y: Math.random() * 1600 - 800,
              z: Math.random() * 1000,
              size: Math.floor(Math.random() * 2 + 1),
              r: Math.round(Math.random() * colorNoise - colorNoise / 2),
              g: Math.round(Math.random() * colorNoise - colorNoise / 2),
              b: Math.round(Math.random() * colorNoise - colorNoise / 2),
            };
            out.push(s);
          }
          return out;
        };

        const stars = makeStars(starCount);

        const clear = () => {
          c.fillStyle = backgroundColor;
          c.fillRect(0, 0, canvas.width, canvas.height);
        };

        const putPixel = (
          x: number,
          y: number,
          brightness: number,
          size: number,
          r: number,
          g: number,
          b: number,
        ) => {
          const rgb =
            "rgba(" +
            color(starColor[0] + r) +
            "," +
            color(starColor[1] + g) +
            "," +
            color(starColor[2] + b) +
            "," +
            brightness +
            ")";
          c.fillStyle = rgb;
          c.fillRect(x, y, size, size);
        };

        const moveStars = (distance: number, angle: number) => {
          const count = stars.length;
          for (let index = 0; index < count; index++) {
            const s = stars[index];
            s.z -= distance;
            while (s.z <= 1) {
              s.z += 1000;
            }

            const x = s.x;
            const y = s.y;

            s.x = x * Math.cos(angle) + y * Math.sin(angle);
            s.y = -x * Math.sin(angle) + y * Math.cos(angle);
          }
        };

        let previousTime: number;
        const init = (time: number) => {
          previousTime = time;
          requestAnimationFrame(tick);
        };

        let angleSpeed = 0;
        let angleAccumulator = 0;
        const maxAngleSpeed = 0.1;
        const maxAngleAccumulator = 0.01;

        let speedFactor = 0;

        const tick = (time: number) => {
          const elapsed = time - previousTime;
          previousTime = time;

          angleAccumulator = clamp(
            (angleAccumulator + (Math.random() - 0.5)) / 1000,
            -maxAngleAccumulator,
            maxAngleAccumulator,
          );
          angleSpeed = clamp(
            angleSpeed + angleAccumulator,
            -maxAngleSpeed,
            maxAngleSpeed,
          );

          speedFactor = clamp(
            speedFactor + (Math.random() - 0.5) / 10,
            0.01,
            maxSpeedFactor,
          );

          moveStars(elapsed * speedFactor, angleSpeed);
          // if (speedFactor < maxSpeedFactor) speedFactor *= acceleration;

          clear();

          const cx = w / 2;
          const cy = h / 2;

          const count = stars.length;
          for (let index = 0; index < count; index++) {
            const star = stars[index];

            const x = cx + star.x / (star.z * 0.001);
            const y = cy + star.y / (star.z * 0.001);

            if (x < 0 || x >= w || y < 0 || y >= h) {
              continue;
            }

            const d = star.z / 1000;
            const b = 1 - d * d;

            putPixel(x, y, b, star.size, star.r, star.g, star.b);
          }

          requestAnimationFrame(tick);
        };

        requestAnimationFrame(init);

        // add window resize listener:
        window.addEventListener("resize", function () {
          w = window.innerWidth;
          h = window.innerHeight;
          setCanvasExtents();
        });
      } else {
        console.error("Could not get 2d context from canvas element");
      }
    } else {
      console.error('Could not find canvas element with id "starfield"');
    }

    return () => {
      window.onresize = null;
    };
  }, [starColor, backgroundColor, speedFactor, starCount]);

  return (
    <canvas
      id="starfield"
      style={{
        padding: 0,
        margin: 0,
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 10,
        opacity: 1,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    ></canvas>
  );
}
