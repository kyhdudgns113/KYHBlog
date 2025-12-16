import {useCallback, useEffect, useState} from 'react'

import {Modal} from '@component'
import {useDirectoryCallbacksContext} from '@context'
import {useBlogSelector, useDirectoryActions, useModalActions} from '@redux'

import type {KeyboardEvent, MouseEvent} from 'react'
import type {APIReturnType} from '@type'

import './ModalSetFile.scss'

export function ModalSetFile() {
  const fileRows = useBlogSelector(state => state.directory.fileRows)
  const editFileOId = useBlogSelector(state => state.directory.fileOId_editFile)

  const {initFileOId_editFile} = useDirectoryActions()
  const {closeModal} = useModalActions()
  const {changeFileName, deleteFile} = useDirectoryCallbacksContext()

  const [fileName, setFileName] = useState<string>('')

  const onClickDelete = useCallback(
    (fileOId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()
      deleteFile(fileOId) // ::
        .then((res: APIReturnType) => {
          if (res.isSuccess) {
            initFileOId_editFile()
            closeModal()
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onClickSubmit = useCallback(
    (fileOId: string, fileName: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()

      // 모달 닫기도 changeFileName 에서 실행한다.
      changeFileName(fileOId, fileName) // ::
        .then((res: APIReturnType) => {
          if (res.isSuccess) {
            initFileOId_editFile()
            closeModal()
          } // ::
          else {
            // changeFileName 에서 에러 메시지 출력
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onKeyDownModal = useCallback(
    (fileOId: string, fileName: string) => (e: KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (e.key === 'Enter') {
        e.preventDefault()
        onClickSubmit(fileOId, fileName)
      } // ::
      else if (e.key === 'Escape') {
        e.preventDefault()
        initFileOId_editFile()
      }
    },
    [initFileOId_editFile, onClickSubmit]
  )

  // 초기화: dirName
  useEffect(() => {
    if (fileRows[editFileOId]) {
      setFileName(fileRows[editFileOId].fileName)
    } // ::
    else {
      setFileName('--이름 로딩 오류--')
    }
  }, [fileRows, editFileOId])

  return (
    <Modal onClose={() => {}} onKeyDown={onKeyDownModal(editFileOId, fileName)}>
      <div className="ModalSetFile_Main" tabIndex={0}>
        {/* 1. Title */}
        <p className="_Title">파일 이름 변경</p>

        {/* 2. Input: Name */}
        <div className="_InputRow">
          <p className="__Label">파일 이름</p>
          <input
            className="__Input"
            onChange={e => setFileName(e.currentTarget.value)}
            placeholder="파일 이름(빈칸이면 변경X)"
            value={fileName} // ::
          />
        </div>

        {/* 3. Button: Save */}
        <div className="_ButtonRow">
          <button className="AppButton_Sakura" onClick={onClickSubmit(editFileOId, fileName)}>
            저장
          </button>
          <button className="AppButton_Sakura" onClick={onClickDelete(editFileOId)}>
            삭제
          </button>
          <button className="AppButton_Sakura" onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    </Modal>
  )
}
