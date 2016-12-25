export const IS_SECURE = location.protocol === 'https:'
export const WS_PREFIX = IS_SECURE ? 'wss' : 'ws'

export const DELTA_HOST = 'jarvis-delta.ironbay.digital'
// export const DELTA_HOST = 'localhost:12000'
export const DELTA_URL = `${WS_PREFIX}://${DELTA_HOST}/socket`
