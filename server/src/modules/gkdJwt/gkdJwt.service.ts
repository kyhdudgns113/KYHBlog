import {Injectable} from '@nestjs/common'
import {JwtService, JwtSignOptions} from '@nestjs/jwt'
import {
  decodeJwtFromClient,
  encodeJwtFromServer,
  generateRandomString,
  getJwtFromHeader,
  gkdJwtSignOption,
  jwtHeaderLenBase,
  jwtHeaderLenVali
} from '@secret'
import {JwtPayloadType} from '@type'

@Injectable()
export class GKDJwtService {
  private userOIdToHeaderToUrl: {[userOId: string]: {[header: string]: string}} = {}
  constructor(private jwtService: JwtService) {}

  checkUOIdToHeaderToUrl(userOId: string, header: string) {
    return (this.userOIdToHeaderToUrl[userOId] && this.userOIdToHeaderToUrl[userOId][header]) || null
  }

  /**
   * JWT 인증을 처음 요청할때 호출된다.
   * 클라이언트가 복호 및 암호화해야 할 숙제를 전달한다
   * body.jwtFromServer 로 전달한다.
   *
   * @param headers : http 요청 헤더
   * @returns : http 기본 응답 Object
   */
  async requestValidation(headers: any) {
    try {
      const url = headers.url
      const {jwtFromClient} = getJwtFromHeader(headers)
      const {jwt} = decodeJwtFromClient(jwtFromClient, jwtHeaderLenBase)
      const extractedPayload = (await this.jwtService.verifyAsync(jwt)) as JwtPayloadType

      const {userId, userName, userOId, signUpType} = extractedPayload

      const jwtPayload: JwtPayloadType = {
        userId,
        userName,
        userOId,
        signUpType
      }
      const newHeader = generateRandomString(jwtHeaderLenVali)
      const newJwt = await this.jwtService.signAsync(jwtPayload)

      if (!this.userOIdToHeaderToUrl[userOId]) {
        this.userOIdToHeaderToUrl[userOId] = {}
      }
      this.userOIdToHeaderToUrl[userOId][newHeader] = url

      setTimeout(() => {
        delete this.userOIdToHeaderToUrl[userOId][newHeader]
      }, 3000)

      const {jwtFromServer} = encodeJwtFromServer(newHeader, newJwt)

      return {ok: true, body: {jwtFromServer}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      return {ok: false, body: {}, errObj}
    }
  }

  /**
   * Socket 에서 사용하는 JWT 인증
   */
  async requestValidationSocket(jwtFromClient: string) {
    try {
      const {jwt} = decodeJwtFromClient(jwtFromClient, jwtHeaderLenBase)
      const extractedPayload = (await this.jwtService.verifyAsync(jwt)) as JwtPayloadType

      const {userId, userName, userOId, signUpType} = extractedPayload

      const jwtPayload: JwtPayloadType = {
        userId,
        userName,
        userOId,
        signUpType
      }
      const newHeader = generateRandomString(jwtHeaderLenVali)
      const newJwt = await this.jwtService.signAsync(jwtPayload)

      const {jwtFromServer} = encodeJwtFromServer(newHeader, newJwt)

      return {ok: true, body: {jwtFromServer}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      return {ok: false, body: {}, errObj}
    }
  }
  resetUOIdToHeaderToUrl(userOId: string, header: string) {
    if (this.userOIdToHeaderToUrl[userOId]) {
      delete this.userOIdToHeaderToUrl[userOId][header]
    }
  }

  async signAsync(payload: JwtPayloadType, options: JwtSignOptions = gkdJwtSignOption) {
    try {
      const jwt = await this.jwtService.signAsync(payload, options)
      const header = generateRandomString(jwtHeaderLenBase)
      const {jwtFromServer} = encodeJwtFromServer(header, jwt)
      return {jwtFromServer}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * Validation 위한 토큰 생성에만 쓴다.
   */
  async signAsyncValidation(payload: JwtPayloadType, options: JwtSignOptions = gkdJwtSignOption) {
    try {
      const jwt = await this.jwtService.signAsync(payload, options)
      const header = generateRandomString(jwtHeaderLenVali)
      const {jwtFromServer} = encodeJwtFromServer(header, jwt)
      return {jwtFromServer}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async verifyAsync(jwtFromClient: string, headerLen: number) {
    try {
      const {jwt} = decodeJwtFromClient(jwtFromClient, headerLen)
      return (await this.jwtService.verifyAsync(jwt)) as JwtPayloadType
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
