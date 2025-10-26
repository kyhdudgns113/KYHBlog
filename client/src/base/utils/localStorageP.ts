export const readItemFromStorageP = (key: string) =>
  new Promise<string | null>((resolve, reject) => {
    try {
      const value = localStorage.getItem(key)
      resolve(value)
    } catch (e) {
      reject(e)
    }
  })
export const writeItemToStorageP = (key: string, value: string) =>
  new Promise<string>((resolve, reject) => {
    try {
      localStorage.setItem(key, value)
      resolve(value)
    } catch (e) {
      reject(e)
    }
  })

export const readStringP = readItemFromStorageP
export const writeStringP = writeItemToStorageP
