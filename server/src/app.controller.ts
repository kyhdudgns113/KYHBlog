import {Body, Controller, Get, Headers, Param, Post} from '@nestjs/common'
import {ApiBody, ApiOperation, ApiResponse} from '@nestjs/swagger'

/**
 * Swagger 사용 예시
 * - 다른 API 들은 Swagger 를 적용하지 않음
 *   - 혼자 개발하기에 Swagger 가 필요하지 않음
 *   - Decorator 들로 인해 서버측 코드가 지저분해짐
 */
@Controller('/app')
export class AppController {
  constructor() {}

  @Post('/hello')
  @ApiOperation({
    summary: 'Swagger 사용 예시',

    description: 'Swagger 사용 예시. 혼자 개발하기에 Swagger 가 굳이 필요하지 않고, 깔끔한 코드작성을 위해 여기서만 Swagger 적용'
  })
  @ApiBody({
    schema: {
      properties: {
        userId: {type: 'string'},
        userName: {type: 'string'}
      }
    }
  })
  @ApiResponse({status: 200, description: '호출 성공'})
  @ApiResponse({status: 400, description: '호출 실패'})
  async hello(@Body() data: {userId: string; userName: string}) {
    const {userId, userName} = data
    if (!userId || userName) {
      return {ok: false, body: {}, errObj: {status: 400, errMsg: 'userId 또는 userName이 없습니다.'}}
    } // ::
    else {
      return {ok: true, body: `안녕하세요 ${userName} 님!`, errObj: {status: 200}}
    }
  }

  @Get('/getHello')
  @ApiOperation({
    summary: 'Swagger 사용 예시',
    description: 'Swagger 사용 예시. 혼자 개발하기에 Swagger 가 굳이 필요하지 않고, 깔끔한 코드작성을 위해 여기서만 Swagger 적용'
  })
  @ApiResponse({status: 200, description: '호출 성공'})
  @ApiResponse({status: 400, description: '호출 실패'})
  async getHello() {
    return {ok: true, body: '안녕하세요.', errObj: {status: 200}}
  }
}
