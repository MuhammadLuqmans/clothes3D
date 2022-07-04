import { proxy, useSnapshot } from "valtio"

const snapState = proxy({
  current: null,
  items: {},
  textures: {},
})

export default snapState