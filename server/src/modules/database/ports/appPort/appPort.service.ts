import {Injectable} from '@nestjs/common'
import {DBHubService} from '../../dbHub'

@Injectable()
export class AppPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  // GET AREA:

  async getSitemap() {
    /**
     * sitemap.xml 생성용 데이터 가져오기
     * - 모든 블로그 포스트 (숨김 파일 제외)
     * - 모든 공개 QnA 게시글
     */
    const where = '/app/sitemap'

    try {
      // 1. 모든 파일 가져오기 (숨김 파일 제외)
      const {fileRowArr} = await this.dbHubService.readFileRowArrAll(where)

      // 2. 공개 QnA 가져오기
      const {qnAArr} = await this.dbHubService.readQnAArr(where)
      const publicQnAArr = qnAArr.filter(qna => !qna.isPrivate)

      return {fileRowArr, publicQnAArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
