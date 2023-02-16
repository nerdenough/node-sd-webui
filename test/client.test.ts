import test from 'ava'
import sdwebui from '../src/index.js'

test('runs txt2img', async (t) => {
  const { images } = await sdwebui().txt2img({
    prompt: 'A painting of a mushroom',
    width: 256,
    height: 256,
    steps: 10,
  })
  t.is(images.length, 1)
})
