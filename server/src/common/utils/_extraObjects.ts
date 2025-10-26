import * as T from '@shareType'

/**
 *
 */
export function pushExtraDirs_Arr(where: string, extraDirs: T.ExtraDirObjectType, directoryArr: T.DirectoryType[]) {
  directoryArr.forEach((directory: T.DirectoryType) => {
    pushExtraDirs_Single(where, extraDirs, directory)
  })
}

/**
 *
 */
export function pushExtraDirs_Single(where: string, extraDirs: T.ExtraDirObjectType, directory: T.DirectoryType) {
  extraDirs.dirOIdsArr.push(directory.dirOId)
  extraDirs.directories[directory.dirOId] = directory
}

/**
 *
 */
export function pushExtraFileRows_Arr(where: string, extraFileRows: T.ExtraFileRowObjectType, fileRowArr: T.FileRowType[]) {
  fileRowArr.forEach((fileRow: T.FileRowType) => {
    pushExtraFileRows_Single(where, extraFileRows, fileRow)
  })
}

/**
 *
 */
export function pushExtraFileRows_Single(where: string, extraFileRows: T.ExtraFileRowObjectType, fileRow: T.FileRowType) {
  extraFileRows.fileOIdsArr.push(fileRow.fileOId)
  extraFileRows.fileRows[fileRow.fileOId] = fileRow
}
