# Node Stable Diffusion WebUI Client

A Node.js client for using Automatic1111's Stable Diffusion Web UI.

## Current Features

This project is a work in progress. Current features include:

- [x] txt2img generation
- [x] img2img generation
- [x] pngInfo support

### Extensions

- [x] ControlNet support both txt2img and img2img

## Getting Started

### Requirements

- Node.js >= 18
- Automatic1111's
  [Stable Diffusion Web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui/)
- ControlNet support requires
  [sd-webui-controlnet](https://github.com/Mikubill/sd-webui-controlnet)

### Installation

Add `node-sd-webui` to your project.

Using npm:

```sh
npm i -S node-sd-webui
```

Using yarn:

```sh
yarn add node-sd-webui
```

Using pnpm:

```sh
pnpm add node-sd-webui
```

## Usage

### txt2img

The `txt2img` function allows you to generate an image using the `txt2img`
functionality of the Stable Diffusion WebUI.

Basic Example:

```js
import sdwebui from 'node-sd-webui'
import { writeFileSync } from 'fs'

sdwebui()
  .txt2img({
    prompt: 'A photo of a mushroom',
  })
  .then(({ images }) => writeFileSync('path/to/image.png', images[0], 'base64'))
  .catch((err) => console.error(err))
```

Another example with a few more options:

```js
import sdwebui, { SamplingMethod } from 'node-sd-webui'
import { writeFileSync } from 'fs'

sdwebui()
  .txt2img({
    prompt: 'A photo of a mushroom, red cap, white spots',
    negativePrompt: 'blurry, cartoon, drawing, illustration',
    samplingMethod: SamplingMethod.Euler_A,
    width: 768,
    height: 512,
    steps: 20,
    batchSize: 5,
  })
  .then(({ images }) => {
    images.forEach((image, i) =>
      writeFileSync(`path/to/image-${i}.png`, images[i], 'base64')
    )
  })
  .catch((err) => console.error(err))
```
