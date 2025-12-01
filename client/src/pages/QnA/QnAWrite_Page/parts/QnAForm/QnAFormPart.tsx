import {useState, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useAuthStatesContext, useQnACallbacksContext} from '@context'
import {useBlogSelector, useLockActions} from '@redux'

import type {FC, FormEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAFormPart.scss'

type QnAFormPartProps = DivCommonProps & {}

export const QnAFormPart: FC<QnAFormPartProps> = ({...props}) => {
  const {lockQnaWrite, unlockQnaWrite} = useLockActions()

  const {userOId} = useAuthStatesContext()
  const {addQnAFile} = useQnACallbacksContext()

  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [isPrivate, setIsPrivate] = useState<boolean>(false)

  const navigate = useNavigate()

  const _executeSubmit = useCallback((userOId: string, title: string, content: string, isPrivate: boolean) => {
    const qnaWriteLock = useBlogSelector(state => state.lock.qnaWriteLock)

    if (qnaWriteLock) {
      alert('QnA 작성 중입니다')
      return
    }

    if (title.trim().length === 0) {
      alert('제목을 입력해주세요')
      return
    }

    if (content.trim().length === 0) {
      alert('내용을 입력해주세요')
      return
    }

    lockQnaWrite()

    addQnAFile(userOId, title, content, isPrivate) // ::
      .then(isSuccess => {
        if (isSuccess) {
          alert('QnA 작성이 완료되었습니다')
          navigate('/main/qna')
        } // ::
        else {
          alert('QnA 작성에 실패했습니다')
        }
      })
      .finally(() => {
        unlockQnaWrite()
      })
  }, [])

  const onSubmit = useCallback(
    (userOId: string, title: string, content: string, isPrivate: boolean) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()

      _executeSubmit(userOId, title, content, isPrivate)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`QnAForm_Part`} {...props}>
      <form className="form_part" onSubmit={onSubmit(userOId, title, content, isPrivate)}>
        {/* 1. 제목 입력 */}
        <div className="form_item">
          <label htmlFor="qnaTitle">제목</label>
          <input
            type="text"
            id="qnaTitle"
            name="qnaTitle"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="질문 제목을 입력해주세요"
            required
            autoFocus
          />
        </div>

        {/* 2. 내용 입력 */}
        <div className="form_item">
          <label htmlFor="qnaContent">내용</label>
          <textarea
            id="qnaContent"
            name="qnaContent"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="질문 내용을 입력해주세요"
            required
            rows={10}
          />
        </div>

        {/* 3. 비공개 체크박스 */}
        <div className="form_item">
          <div className="form_checkbox">
            <input type="checkbox" checked={isPrivate} onClick={() => setIsPrivate(prev => !prev)} id="qnaIsPrivate" name="qnaIsPrivate" />
            <label htmlFor="qnaIsPrivate">비공개 질문글로 작성하기</label>
          </div>
        </div>

        {/* 4. 버튼 행 */}
        <div className="form_button_row">
          <button type="submit">작성하기</button>
        </div>
      </form>
    </div>
  )
}
