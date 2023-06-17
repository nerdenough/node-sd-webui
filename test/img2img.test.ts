import test from 'ava'
import { readFileSync } from 'fs'
import { Preprocessor } from '../src/extensions/controlNet/index.js'
import { img2img, Img2ImgOptions } from '../src/sdapi/img2img.js'
import { pngInfo, PngInfoResponse } from '../src/sdapi/pngInfo.js'
import { SamplingMethod } from '../src/types.js'

const imageData = readFileSync('./test/images/mushroom.png', 'base64')

type TestCase = {
  name: string
  options: Img2ImgOptions
  expected: Partial<PngInfoResponse>[]
}

const testCases: TestCase[] = [
  {
    name: 'image with only a prompt provided',
    options: {
      imageData: [imageData],
      prompt: 'A painting of a mushroom',
    },
    expected: [
      {
        prompt: 'A painting of a mushroom',
        steps: 50,
        samplingMethod: SamplingMethod.Euler,
        cfgScale: 7,
        width: 512,
        height: 512,
      },
    ],
  },
  {
    name: 'image with basic custom options',
    options: {
      imageData: [imageData],
      prompt: 'A painting of a mushroom',
      negativePrompt: 'blurry, cartoon, photo',
      samplingMethod: SamplingMethod.DPMPlusPlus_2M_Karras,
      seed: 12345,
      width: 256,
      height: 256,
      steps: 20,
      cfgScale: 10,
      restoreFaces: true,
    },
    expected: [
      {
        prompt: 'A painting of a mushroom',
        negativePrompt: 'blurry, cartoon, photo',
        samplingMethod: SamplingMethod.DPMPlusPlus_2M_Karras,
        width: 256,
        height: 256,
        steps: 20,
        cfgScale: 10,
      },
    ],
  },
  {
    name: 'controlnet extension support',
    options: {
      imageData: [imageData],
      prompt: 'A photo of a red mushroom',
      steps: 20,
      samplingMethod: SamplingMethod.LMS_Karras,
      extensions: {
        controlNet: [
          {
            inputImageData: imageData,
            preprocessor: Preprocessor.Canny,
            model: 'control_canny-fp16 [e3fe7712]',
          },
        ],
      },
    },
    expected: [
      { prompt: 'A photo of a red mushroom', width: 512, height: 512 },
    ],
  },
]

testCases.forEach((tc) =>
  test.serial(tc.name, async (t) => {
    const result = await img2img(tc.options)
    if (!tc.expected) {
      t.pass('passed with no expectations')
      return
    }

    t.is(result.images.length, tc.expected.length)

    for (let i = 0; i < result.images.length; i++) {
      if (!Object.keys(tc.expected[i]).length) {
        continue
      }

      const imageData = result.images[i]
      const info = await pngInfo({
        imageData,
      })
      Object.entries(tc.expected[i]).forEach(([key, value]) =>
        t.is(info[key as keyof PngInfoResponse], value)
      )
    }
  })
)
