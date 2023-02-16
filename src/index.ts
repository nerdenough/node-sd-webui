import { txt2img, Txt2ImgOptions, Txt2ImgResponse } from './sdapi/txt2img.js'

type Props = {
  apiUrl?: string
}

export type Client = {
  apiUrl: string
  txt2img: (options: Txt2ImgOptions) => Promise<Txt2ImgResponse>
}

const sdwebui = (props?: Props): Client => {
  const apiUrl = props?.apiUrl || 'http://localhost:7860'

  return {
    apiUrl,
    txt2img: (options: Txt2ImgOptions) => txt2img(options, apiUrl),
  }
}

export default sdwebui
