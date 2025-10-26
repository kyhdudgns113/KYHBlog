import * as T from '@type'

export function NULL_extraDirs(): T.ExtraDirObjectType {
  return {
    dirOIdsArr: [],
    directories: {}
  }
}
export function NULL_extraFileRows(): T.ExtraFileRowObjectType {
  return {
    fileOIdsArr: [],
    fileRows: {}
  }
}

export function NULL_File(): T.FileType {
  return {
    fileOId: '',
    fileName: '',
    content: '',
    createdAt: undefined,
    dirOId: '',
    fileIdx: 0,
    fileStatus: 0,
    updatedAt: undefined,
    userName: '',
    userOId: ''
  }
}

export function NULL_User(): T.UserType {
  return {
    createdAt: undefined,
    updatedAt: undefined,
    userAuth: 0,
    userName: '',
    userOId: '',
    userId: '',
    userMail: ''
  }
}
