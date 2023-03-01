import test from 'ava'
import { readFileSync } from 'fs'
import sdwebui, { SamplingMethod } from '../src/index.js'

test.serial('runs txt2img', async (t) => {
  const { images } = await sdwebui().txt2img({
    prompt: 'A painting of a mushroom',
    width: 256,
    height: 256,
    steps: 10,
  })
  t.is(images.length, 1)
})

test.serial('runs img2img', async (t) => {
  const imageData = readFileSync('./test/images/mushroom.png', 'base64')
  const { images } = await sdwebui().img2img({
    imageData: [imageData],
    prompt: 'A painting of a mushroom',
    width: 256,
    height: 256,
    steps: 10,
  })
  t.is(images.length, 1)
})

test.serial('runs pngInfo', async (t) => {
  const imageData = readFileSync('./test/images/mushroom.png', 'base64')
  const info = await sdwebui().pngInfo({
    imageData,
  })

  t.deepEqual(info, {
    prompt: 'a macro photo of a mushroom in the snow',
    steps: 20,
    samplingMethod: SamplingMethod.Euler_A,
    cfgScale: 7,
    seed: 3546656951,
    width: 768,
    height: 768,
    modelHash: 'dcd690123c',
    model: 'v2-1_768-ema-pruned',
  })
})
