import {useState, useCallback, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import {useQnACallbacksContext} from '@context'
import {useBlogSelector, useLockActions} from '@redux'
import {QNA_CONTENT_LENGTH_MAX, QNA_TITLE_LENGTH_MAX} from '@shareValue'

import type {FC, FormEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {APIReturnType} from '@type'

import './QnAEditFormPart.scss'

type QnAEditFormPartProps = DivCommonProps & {}

export const QnAEditFormPart: FC<QnAEditFormPartProps> = ({...props}) => {
  const qnaWriteLock = useBlogSelector(state => state.lock.qnaWriteLock)
  const qnA = useBlogSelector(state => state.qna.qnA)

  const {lockQnaWrite, unlockQnaWrite} = useLockActions()

  const {modifyQnA} = useQnACallbacksContext()

  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [isPrivate, setIsPrivate] = useState<boolean>(false)

  const navigate = useNavigate()

  /**
   * 초기화: 기존 QnA 데이터 로드
   */
  useEffect(() => {
    if (qnA.qnAOId) {
      setTitle(qnA.title)
      setContent(qnA.content)
      setIsPrivate(qnA.isPrivate)
    }
  }, [qnA])

  const _executeSubmit = useCallback(
    (qnaWriteLock: boolean, qnAOId: string, title: string, content: string, isPrivate: boolean) => {
      if (qnaWriteLock) {
        alert('QnA 수정 중입니다')
        return
      }

      if (title.trim().length === 0) {
        alert('제목을 입력해주세요')
        return
      }

      if (title.length > QNA_TITLE_LENGTH_MAX) {
        alert(`제목은 ${QNA_TITLE_LENGTH_MAX}자 이하로 작성해주세요`)
        return
      }

      if (content.trim().length === 0) {
        alert('내용을 입력해주세요')
        return
      }

      if (content.length > QNA_CONTENT_LENGTH_MAX) {
        alert(`내용은 ${QNA_CONTENT_LENGTH_MAX}자 이하로 작성해주세요`)
        return
      }

      lockQnaWrite()

      modifyQnA(qnAOId, title, content, isPrivate) // ::
        .then((res: APIReturnType) => {
          const {isSuccess} = res
          if (isSuccess) {
            alert('QnA 수정이 완료되었습니다')
            navigate(`/main/qna/read/${qnAOId}`)
          } // ::
          else {
            alert('QnA 수정에 실패했습니다')
          }
        })
        .finally(() => {
          unlockQnaWrite()
        })
    },
    [navigate, lockQnaWrite, unlockQnaWrite]
  )

  const onSubmit = useCallback(
    (qnaWriteLock: boolean, qnAOId: string, title: string, content: string, isPrivate: boolean) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()

      _executeSubmit(qnaWriteLock, qnAOId, title, content, isPrivate)
    },
    [_executeSubmit, modifyQnA, navigate, lockQnaWrite, unlockQnaWrite] // eslint-disable-line react-hooks/exhaustive-deps
  )

  if (!qnA.qnAOId) {
    return (
      <div className={`QnAEditForm_Part`} {...props}>
        로딩 중...
      </div>
    )
  }

  return (
    <div className={`QnAEditForm_Part`} {...props}>
      <form className="form_part" onSubmit={onSubmit(qnaWriteLock, qnA.qnAOId, title, content, isPrivate)}>
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
          <button type="submit">수정하기</button>
        </div>
      </form>
    </div>
  )
}
