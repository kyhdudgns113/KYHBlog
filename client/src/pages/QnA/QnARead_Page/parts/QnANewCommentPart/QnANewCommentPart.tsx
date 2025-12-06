import {useState, useCallback} from 'react'

import {useAuthStatesContext, useQnACallbacksContext} from '@context'
import {useBlogSelector} from '@redux'
import {COMMENT_MAX_LENGTH} from '@shareValue'

import type {FC, FormEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './QnANewCommentPart.scss'

type QnANewCommentPartProps = DivCommonProps

export const QnANewCommentPart: FC<QnANewCommentPartProps> = ({...props}) => {
  const [commentContent, setCommentContent] = useState<string>('')

  const qnA = useBlogSelector(state => state.qna.qnA)
  const {userOId, userName} = useAuthStatesContext()
  const {addQnAComment} = useQnACallbacksContext()

  const onSubmitComment = useCallback(
    (commentContent: string, qnAOId: string, userOId: string, userName: string) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (commentContent.trim().length === 0) {
        alert('댓글 내용을 입력해주세요')
        return
      }

      if (commentContent.length > COMMENT_MAX_LENGTH) {
        alert(`댓글은 ${COMMENT_MAX_LENGTH}자 이하로 작성해주세요`)
        return
      }

      if (!userOId || !userName) {
        alert('로그인 후 이용해주세요')
        return
      }

      if (!qnAOId) {
        alert('QnA 정보를 불러올 수 없습니다')
        return
      }

      addQnAComment(qnAOId, userOId, userName, commentContent, null) // ::
        .then(res => {
          const {isSuccess} = res
          if (isSuccess) {
            // 작성 후 초기화
            setCommentContent('')
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onChangeComment = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= COMMENT_MAX_LENGTH) {
      setCommentContent(value)
    }
  }, [])

  return (
    <div className={`QnAComment_Part`} {...props}>
      {/* 1. 댓글 작성 제목 */}
      <p className="_title_object">댓글 작성</p>

      {/* 2. 댓글 작성 폼 */}
      <form className="_comment_form" onSubmit={onSubmitComment(commentContent, qnA.qnAOId, userOId, userName)}>
        <textarea className="_comment_textarea" value={commentContent} onChange={onChangeComment} placeholder="댓글을 입력해주세요" rows={4} />

        {/* 3. 글자수 표시 및 제출 버튼 */}
        <div className="_comment_footer">
          <span className="_comment_length">
            {commentContent.length} / {COMMENT_MAX_LENGTH}
          </span>
          <button className="_submit_button" type="submit">
            작성하기
          </button>
        </div>
      </form>
    </div>
  )
}
