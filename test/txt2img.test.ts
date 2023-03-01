import test from 'ava'
import { readFileSync } from 'fs'
import { pngInfo, PngInfoResponse } from '../src/sdapi/pngInfo.js'
import { txt2img, Txt2ImgOptions } from '../src/sdapi/txt2img.js'
import { SamplingMethod } from '../src/types.js'

type TestCase = {
  name: string
  options: Txt2ImgOptions
  expected?: Partial<PngInfoResponse>[]
}

const testCases: TestCase[] = [
  {
    name: 'image with only a prompt provided',
    options: {
      prompt: 'A photo of a mushroom',
    },
    expected: [{ width: 512, height: 512 }],
  },
  {
    name: 'image with basic custom options',
    options: {
      prompt: 'A photo of a mushroom, red cap, white spots',
      negativePrompt: 'blurry, cartoon, drawing, illustration',
      samplingMethod: SamplingMethod.DPMPlusPlus_2M_Karras,
      width: 256,
      height: 256,
      steps: 20,
      batchSize: 2,
    },
    expected: [
      {
        prompt: 'A photo of a mushroom, red cap, white spots',
        negativePrompt: 'blurry, cartoon, drawing, illustration',
        samplingMethod: SamplingMethod.DPMPlusPlus_2M_Karras,
        width: 256,
        height: 256,
        steps: 20,
      },
      {
        prompt: 'A photo of a mushroom, red cap, white spots',
        negativePrompt: 'blurry, cartoon, drawing, illustration',
        samplingMethod: SamplingMethod.DPMPlusPlus_2M_Karras,
        width: 256,
        height: 256,
        steps: 20,
      },
    ],
  },
  {
    name: 'controlnet extension support',
    options: {
      prompt: 'A photo of a man',
      steps: 20,
      samplingMethod: SamplingMethod.LMS_Karras,
      extensions: {
        controlNet: [
          {
            inputImageData: readFileSync(
              './test/images/openpose.png',
              'base64'
            ),
            model: 'control_sd15_openpose [fef5e48e]',
          },
        ],
      },
    },
    expected: [{ prompt: 'A photo of a man', width: 512, height: 512 }, {}],
  },
]

testCases.forEach((tc) =>
  test.serial(tc.name, async (t) => {
    const result = await txt2img(tc.options)
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
      const info = await pngInfo({ imageData })
      Object.entries(tc.expected[i]).forEach(([key, value]) =>
        t.is(info[key as keyof PngInfoResponse], value)
      )
    }
  })
)
