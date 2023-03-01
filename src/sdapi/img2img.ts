export type Img2ImgOptions = {
  imageData: string[]
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
}

export type Img2ImgResponse = {
  images: string[]
  parameters: object
  info: string
}

export const img2img = async (
  options: Img2ImgOptions,
  apiUrl: string = 'http://localhost:7860'
): Promise<Img2ImgResponse> => {
  let body: any = {
    init_images: options.imageData,
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
  }

  /* @ts-ignore */
  const result = await fetch(`${apiUrl}/sdapi/v1/img2img`, {
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

  return data as Img2ImgResponse
}
