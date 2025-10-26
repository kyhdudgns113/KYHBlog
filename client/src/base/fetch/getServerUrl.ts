import {serverUrl} from '@secret'

export const getServerUrl = (path: string) => {
  const host = serverUrl
  return [host, path].join('')
}
