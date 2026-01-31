import {Helmet} from 'react-helmet-async'

import {IntroPart, NullPart, RecentPostsPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as SV from '@shareValue'

import './HomePage.scss'

type HomePageProps = DivCommonProps & {}

export const HomePage: FC<HomePageProps> = ({...props}) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KYH Blog',
    description: 'KYH Blog - 개발 블로그 및 기술 공유',
    url: `${SV.CLIENT_URL}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SV.CLIENT_URL}/main/blog?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <>
      <Helmet>
        <title>홈 - KYH Blog</title>
        <meta name="description" content="KYH Blog 홈페이지 - 최신 블로그 포스트와 소개" />
        <link rel="canonical" href={`${SV.CLIENT_URL}/main/home`} />

        <meta property="og:title" content="홈 - KYH Blog" />
        <meta property="og:description" content="KYH Blog 홈페이지 - 최신 블로그 포스트와 소개" />
        <meta property="og:url" content={`${SV.CLIENT_URL}/main/home`} />

        <meta property="twitter:title" content="홈 - KYH Blog" />
        <meta property="twitter:description" content="KYH Blog 홈페이지 - 최신 블로그 포스트와 소개" />

        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className={`HomePage`} {...props}>
        <IntroPart />

        <div className="_recent_row_page">
          <RecentPostsPart />
          <NullPart />
          <NullPart />
        </div>
      </div>
    </>
  )
}
