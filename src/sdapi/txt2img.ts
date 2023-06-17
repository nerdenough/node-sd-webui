import {
  mapControlNetOptions,
  ControlNetOptions,
} from '../extensions/controlNet/index.js'

export type Txt2ImgOptions = {
  hires?: {
    steps: number
    denoisingStrength: number
    upscaler: string
    upscaleBy?: number
    resizeWidthTo?: number
    resizeHeigthTo?: number
  }
  prompt: string
  negativePrompt?: string
  width?: number
  height?: number
  samplingMethod?: string
  seed?: number
  variationSeed?: number
  variationSeedStrength?: number
  resizeSeedFromHeight?: number
  resizeSeedFromWidth?: number
  batchSize?: number
  batchCount?: number
  steps?: number
  cfgScale?: number
  restoreFaces?: boolean
  // tiling: false
  // eta: 0
  // s_churn: 0
  // s_tmax: 0
  // s_tmin: 0
  // s_noise: 1
  // override_settings: {}
  // override_settings_restore_afterwards: true
  // sampler_index: 'Euler'
  script?: {
    name: string
    args?: string[]
  }
  extensions?: {
    controlNet?: ControlNetOptions[]
  }
}

export type Txt2ImgResponse = {
  images: string[]
  parameters: object
  info: string
}

const mapTxt2ImgOptions = (options: Txt2ImgOptions) => {
  let body: any = {
    prompt: options.prompt,
    negative_prompt: options.negativePrompt,
    seed: options.seed,
    subseed: options.variationSeed,
    subseed_strength: options.variationSeedStrength,
    sampler_name: options.samplingMethod,
    batch_size: options.batchSize,
    n_iter: options.batchCount,
    steps: options.steps,
    width: options.width,
    height: options.height,
    cfg_scale: options.cfgScale,
    seed_resize_from_w: options.resizeSeedFromWidth,
    seed_resize_from_h: options.resizeSeedFromHeight,
    restore_faces: options.restoreFaces,
  }

  if (options.hires) {
    body = {
      ...body,
      enable_hr: true,
      denoising_strength: options.hires.denoisingStrength,
      hr_upscaler: options.hires.upscaler,
      hr_scale: options.hires.upscaleBy,
      hr_resize_x: options.hires.resizeWidthTo,
      hr_resize_y: options.hires.resizeHeigthTo,
      hr_second_pass_steps: options.hires.steps,
    }
  }

  if (options.script) {
    body = {
      ...body,
      script_name: options.script.name,
      script_args: options.script.args || [],
    }
  }

  const { extensions } = options
  if (extensions?.controlNet) {
    body.controlnet_units = extensions.controlNet.map(mapControlNetOptions)
  }

  return body
}

export const txt2img = async (
  options: Txt2ImgOptions,
  apiUrl: string = 'http://localhost:7860'
): Promise<Txt2ImgResponse> => {
  const body = mapTxt2ImgOptions(options)

  let endpoint = '/sdapi/v1/txt2img'
  if (options.extensions?.controlNet) {
    endpoint = '/controlnet/txt2img'
  }

  /* @ts-ignore */
  const result = await fetch(`${apiUrl}${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (result.status !== 200) {
    throw new Error(result.statusText)
  }

  const data: any = await result.json()
  if (!data?.images) {
    throw new Error('api returned an invalid response')
  }

  return data as Txt2ImgResponse
}
