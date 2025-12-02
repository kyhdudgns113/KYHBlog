import {createContext, useCallback, useContext} from 'react'

import {useCommentActions} from '@redux'

import type {FC, PropsWithChildren} from 'react'

import * as F from '@fetch'
import * as HTTP from '@httpType'
import * as U from '@util'

import type {APIReturnType} from '@type'

// prettier-ignore
type ContextType = {
  addComment: (userOId: string, userName: string, fileOId: string, content: string) => Promise<APIReturnType>
  addReply: (userOId: string, userName: string, targetUserOId: string, targetUserName: string, commentOId: string, content: string) => Promise<APIReturnType>

  deleteComment: (commentOId: string) => Promise<APIReturnType>
  deleteReply: (replyOId: string) => Promise<APIReturnType>

  editComment: (commentOId: string, newContent: string) => Promise<APIReturnType>
  editReply: (replyOId: string, newContent: string) => Promise<APIReturnType>
}
// prettier-ignore
export const CommentCallbacksContext = createContext<ContextType>({
  addComment: () => Promise.resolve({isSuccess: false}),
  addReply: () => Promise.resolve({isSuccess: false}),

  deleteComment: () => Promise.resolve({isSuccess: false}),
  deleteReply: () => Promise.resolve({isSuccess: false}),

  editComment: () => Promise.resolve({isSuccess: false}),
  editReply: () => Promise.resolve({isSuccess: false})
})

export const useCommentCallbacksContext = () => useContext(CommentCallbacksContext)

export const CommentCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setCommentReplyArr} = useCommentActions()

  const addComment = useCallback(async (userOId: string, userName: string, fileOId: string, content: string) => {
    const url = `/client/file/addComment`
    const data: HTTP.AddCommentType = {userOId, userName, fileOId, content}

    return F.postWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          alert(`댓글 작성이 완료되었습니다`)
          setCommentReplyArr(body.commentReplyArr)
          U.writeJwtFromServer(jwtFromServer)
          return {isSuccess: true}
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return {isSuccess: false}
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return {isSuccess: false}
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addReply = useCallback(
    async (userOId: string, userName: string, targetUserOId: string, targetUserName: string, commentOId: string, content: string) => {
      const url = `/client/file/addReply`
      const data: HTTP.AddReplyType = {userOId, userName, targetUserOId, targetUserName, commentOId, content}

      return F.postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            setCommentReplyArr(body.commentReplyArr)
            U.writeJwtFromServer(jwtFromServer)
            return {isSuccess: true}
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return {isSuccess: false}
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return {isSuccess: false}
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const deleteComment = useCallback(async (commentOId: string) => {
    const url = `/client/file/deleteComment/${commentOId}`

    return F.delWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          alert(`댓글 삭제가 완료되었습니다`)
          setCommentReplyArr(body.commentReplyArr)
          U.writeJwtFromServer(jwtFromServer)
          return {isSuccess: true}
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return {isSuccess: false}
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return {isSuccess: false}
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const deleteReply = useCallback(async (replyOId: string) => {
    const url = `/client/file/deleteReply/${replyOId}`

    return F.delWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          alert(`대댓글 삭제가 완료되었습니다`)
          setCommentReplyArr(body.commentReplyArr)
          U.writeJwtFromServer(jwtFromServer)
          return {isSuccess: true}
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return {isSuccess: false}
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return {isSuccess: false}
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const editComment = useCallback(async (commentOId: string, newContent: string) => {
    const url = `/client/file/editComment`
    const data: HTTP.EditCommentType = {commentOId, newContent}

    return F.putWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          setCommentReplyArr(body.commentReplyArr)
          U.writeJwtFromServer(jwtFromServer)
          return {isSuccess: true}
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return {isSuccess: false}
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return {isSuccess: false}
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const editReply = useCallback(async (replyOId: string, newContent: string) => {
    const url = `/client/file/editReply`
    const data: HTTP.EditReplyType = {replyOId, newContent}

    return F.putWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          setCommentReplyArr(body.commentReplyArr)
          U.writeJwtFromServer(jwtFromServer)
          return {isSuccess: true}
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return {isSuccess: false}
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return {isSuccess: false}
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // prettier-ignore
  const value: ContextType = {
    addComment,
    addReply,

    deleteComment,
    deleteReply,
    
    editComment,
    editReply
  }
  return <CommentCallbacksContext.Provider value={value}>{children}</CommentCallbacksContext.Provider>
}
