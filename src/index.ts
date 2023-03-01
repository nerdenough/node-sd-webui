import { img2img, Img2ImgOptions, Img2ImgResponse } from './sdapi/img2img.js'
import { pngInfo, PngInfoOptions, PngInfoResponse } from './sdapi/pngInfo.js'
import { txt2img, Txt2ImgOptions, Txt2ImgResponse } from './sdapi/txt2img.js'
export * from './sdapi/types.js'

type Props = {
  apiUrl?: string
}

export type Client = {
  apiUrl: string
  pngInfo: (options: PngInfoOptions) => Promise<PngInfoResponse>
  img2img: (options: Img2ImgOptions) => Promise<Img2ImgResponse>
  txt2img: (options: Txt2ImgOptions) => Promise<Txt2ImgResponse>
}

const sdwebui = (props?: Props): Client => {
  const apiUrl = props?.apiUrl || 'http://localhost:7860'

  return {
    apiUrl,
    pngInfo: (options: PngInfoOptions) => pngInfo(options, apiUrl),
    img2img: (options: Img2ImgOptions) => img2img(options, apiUrl),
    txt2img: (options: Txt2ImgOptions) => txt2img(options, apiUrl),
  }
}

export default sdwebui
