export type PngInfoOptions = {
  imageData: string
}

export type PngInfoResponse = {
  prompt: string
  negativePrompt?: string
  steps: number
  samplingMethod: string
  cfgScale: number
  seed: number
  width: number
  height: number
  modelHash: string
  model: string
}

export const pngInfo = async (
  options: PngInfoOptions,
  apiUrl: string = 'http://localhost:7860'
): Promise<PngInfoResponse> => {
  const body = {
    image: options.imageData,
  }

  const result = await fetch(`${apiUrl}/sdapi/v1/png-info`, {
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
  if (!data?.info) {
    throw new Error('api returned an invalid response')
  }

  const split = data.info.split('\n')
  let offset = 0

  let negativePrompt: string | undefined
  if (split[1].startsWith('Negative prompt:')) {
    negativePrompt = split[1].slice(split[1].indexOf(':') + 1).trim()
    offset++
  }

  const values = split[offset + 1]
    .split(',')
    .map((val: string) => val.split(': ')[1])
  const size = values[4].split('x')

  const response: PngInfoResponse = {
    prompt: split[0],
    steps: Number.parseInt(values[0]),
    samplingMethod: values[1],
    cfgScale: Number.parseInt(values[2]),
    seed: Number.parseInt(values[3]),
    width: Number.parseInt(size[0]),
    height: Number.parseInt(size[1]),
    modelHash: values[5],
    model: values[6],
  }

  if (negativePrompt) {
    response.negativePrompt = negativePrompt
  }

  return response
}
