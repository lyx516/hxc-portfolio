import { portfolioBodyHtml } from '@/config/portfolio-body';
import PortfolioScript from '@/components/portfolio-script';

/**
 * 作品集页面由原始单文件页面（reference/胡雪纯｜美术教师作品集.html）的
 * <body> 正文整体迁移而来，正文 HTML 见 src/config/portfolio-body.ts。
 * 这里用 display:contents 的容器承载它，容器本身不产生盒子，
 * 页面布局（含吸顶顶栏）仍与原始单文件页面一致。
 */
export default function Home() {
  return (
    <>
      <div
        style={{ display: 'contents' }}
        dangerouslySetInnerHTML={{ __html: portfolioBodyHtml }}
      />
      <PortfolioScript />
    </>
  );
}
