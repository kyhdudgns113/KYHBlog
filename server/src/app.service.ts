import {Injectable} from '@nestjs/common'
import {AppPortService} from './modules/database'

@Injectable()
export class AppService {
  constructor(private readonly portService: AppPortService) {}

  async getSitemap() {
    /**
     * sitemap.xml 생성
     * - 모든 블로그 포스트 (숨김 파일 제외)
     * - 모든 공개 QnA 게시글
     * - 정적 페이지들
     */
    try {
      const {fileRowArr, publicQnAArr} = await this.portService.getSitemap()

      // 기본 URL (실제 도메인으로 변경 필요)
      const baseUrl = 'https://your-domain.com'

      // sitemap.xml 생성
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 정적 페이지 -->
  <url>
    <loc>${baseUrl}/main/home</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/main/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/main/qna</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/main/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- 블로그 포스트 -->
${fileRowArr
  .map(fileRow => {
    const lastmod = new Date(fileRow.updatedAt).toISOString().split('T')[0]
    return `  <url>
    <loc>${baseUrl}/main/blog/${fileRow.fileOId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  })
  .join('\n')}
  
  <!-- 공개 QnA 게시글 -->
${publicQnAArr
  .map(qna => {
    const lastmod = new Date(qna.updatedAt).toISOString().split('T')[0]
    return `  <url>
    <loc>${baseUrl}/main/qna/read/${qna.qnAOId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  })
  .join('\n')}
</urlset>`

      return {sitemap}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
