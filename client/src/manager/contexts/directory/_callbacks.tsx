import {createContext, useCallback, useContext} from 'react'
import {useDirectoryActions} from '@redux'

import type {FC, PropsWithChildren} from 'react'

import * as F from '@fetch'
import * as U from '@util'

// prettier-ignore
type ContextType = {
  loadDirectory: (dirOId: string) => Promise<boolean>
  loadRootDirectory: () => Promise<boolean>
}
// prettier-ignore
export const DirectoryCallbacksContext = createContext<ContextType>({
  loadDirectory: async () => false,
  loadRootDirectory: async () => false
})

export const useDirectoryCallbacksContext = () => useContext(DirectoryCallbacksContext)

export const DirectoryCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {initDirectories, initFileRows, setRootDirOId, writeExtraDirectory, writeExtraFileRow} = useDirectoryActions()

  // GET AREA:

  const loadDirectory = useCallback(
    async (dirOId: string) => {
      const url = `/client/directory/loadDirectory/${dirOId}`
      const NULL_JWT = ''

      return F.get(url, NULL_JWT)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res
          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            return true
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return false
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return false
        })
    },
    [writeExtraDirectory, writeExtraFileRow]
  )

  const loadRootDirectory = useCallback(async () => {
    const url = '/client/directory/loadRootDirectory'
    const NULL_JWT = ''

    return F.get(url, NULL_JWT)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message} = res

        initDirectories()
        initFileRows()

        if (ok) {
          setRootDirOId(body.rootDirOId)
          writeExtraDirectory(body.extraDirs)
          writeExtraFileRow(body.extraFileRows)
          return true
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return false
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return false
      })
  }, [initDirectories, initFileRows, setRootDirOId, writeExtraDirectory, writeExtraFileRow])

  // prettier-ignore
  const value: ContextType = {
    loadDirectory,
    loadRootDirectory
  }
  return <DirectoryCallbacksContext.Provider value={value}>{children}</DirectoryCallbacksContext.Provider>
}
