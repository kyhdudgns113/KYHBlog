import {useCallback, useEffect, useRef} from 'react'
import {useBlogSelector, useCommentActions} from '@redux'
import {CancelReplyReplyButton, SubmitReplyReplyButton} from '../buttons'
import {ReplyLength} from '../components'

import type {ChangeEvent, FC} from 'react'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import './_styles/ReplyNewReplyF.scss'

type ReplyNewReplyFProps = DivCommonProps & {reply: LT.ReplyTypeLocal}
export const ReplyNewReplyF: FC<ReplyNewReplyFProps> = ({reply, className, style, ...props}) => {
  const replyContent = useBlogSelector(state => state.comment.replyContent)
  const {setReplyContent} = useCommentActions()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const _resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '100px'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeReplyContent = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value)
    _resizeTextarea()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 자동 초기화: textarea 높이
  useEffect(() => {
    _resizeTextarea()
  }, [replyContent]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`ReplyNewReply_F _newReplyContainer  ${className || ''}`} style={style} {...props}>
      {/* 1. 대댓글 대상자 표시 */}
      <div className={`_targetUserNameContainer`}>
        <div className={`_targetUserName`}>{reply.userName}</div>
        {`님에게`}
      </div>

      {/* 2. 대댓글 내용 */}
      <textarea className={`_newReplyContent`} onChange={onChangeReplyContent} ref={textareaRef} value={replyContent} />

      {/* 3. 대댓글 길이, 제출 버튼, 취소 버튼 */}
      <div className={`_newReplyBottomRow`}>
        <ReplyLength reply={replyContent} />
        <SubmitReplyReplyButton reply={reply} replyContent={replyContent} />
        <CancelReplyReplyButton />
      </div>
    </div>
  )
}
