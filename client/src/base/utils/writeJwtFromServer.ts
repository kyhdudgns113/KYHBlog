import * as U from '@util'

/**
 * jwtFromServer 가 있을때만 이거 호출하자.
 */
export const writeJwtFromServer = (jwtFromServer: string) => {
  if (!jwtFromServer) {
    throw new Error('/utils/writeJwtFromServer: JWT 가 비었는데?')
  }
  U.writeStringP('jwtFromServer', jwtFromServer)
}
