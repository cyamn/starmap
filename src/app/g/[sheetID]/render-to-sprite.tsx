// src/renderToSprite.tsx

import html2canvas from "html2canvas";
import React from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";

interface RenderToSpriteOptions {
  width: number;
  height: number;
}

export async function renderToSprite(
  element: React.ReactElement,
  options: RenderToSpriteOptions,
): Promise<THREE.Sprite> {
  const { width, height } = options;

  // Create a temporary div to render the component
  const temporaryDiv = document.createElement("div");
  temporaryDiv.style.width = `${width}px`;
  temporaryDiv.style.height = `${height}px`;
  temporaryDiv.style.position = "absolute";
  temporaryDiv.style.top = "0";
  temporaryDiv.style.left = "0";
  temporaryDiv.style.pointerEvents = "none";
  document.body.append(temporaryDiv);

  ReactDOM.render(element, temporaryDiv);

  const canvas = await html2canvas(temporaryDiv, { backgroundColor: null });
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(width / 10, height / 10, 1); // Scale sprite appropriately

  // Clean up
  ReactDOM.unmountComponentAtNode(temporaryDiv);
  temporaryDiv.remove();

  return sprite;
}
