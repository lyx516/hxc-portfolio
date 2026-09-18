import type { Metadata } from 'next';
import { portfolioBodyHtml } from '@/config/portfolio-body';
import PortfolioScript from '@/components/portfolio-script';
import './globals.css';

export const metadata: Metadata = {
  title: '美术教师作品集｜胡雪纯',
  description:
    '胡雪纯，中学美术教师应聘作品集：十四个栏目，含教学、书法、剪纸、国画、版画、油画、综合材料、水彩、马克笔、设计、动画、素描、微课与 AI 数字美育，另含个人实践，每件作品附课堂可用性说明。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
