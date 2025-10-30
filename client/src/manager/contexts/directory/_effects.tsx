import {createContext, useContext, useEffect} from 'react'

import {useDirectoryCallbacksContext} from './_callbacks'

import {useDirectoryActions, useDirectoryStates} from '@redux'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const DirectoryEffectsContext = createContext<ContextType>({})

export const useDirectoryEffectsContext = () => useContext(DirectoryEffectsContext)

export const DirectoryEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {directories, rootDirOId} = useDirectoryStates()
  const {setRootDir} = useDirectoryActions()
  const {loadRootDirectory} = useDirectoryCallbacksContext()

  // 시작시: 루트 디렉토리를 불러온다.
  useEffect(() => {
    loadRootDirectory()
  }, [])

  // 자동 갱신: 루트 디렉토리
  useEffect(() => {
    if (rootDirOId) {
      setRootDir(directories[rootDirOId])
    }
  }, [directories, rootDirOId])
  //
  return <DirectoryEffectsContext.Provider value={{}}>{children}</DirectoryEffectsContext.Provider>
}
