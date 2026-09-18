'use client';

import { useEffect } from 'react';

/**
 * 原始单文件页面的交互脚本（放大查看、方向键切换、顶栏当前位置高亮）
 * 存放在 public/portfolio.js，由 npm run sync 从原始 HTML 生成。
 * 脚本是普通脚本（非模块），所以在这里动态插入一个 <script> 执行一次。
 */
export default function PortfolioScript() {
  useEffect(() => {
    const w = window as Window & { __portfolioScriptLoaded?: boolean };
    if (w.__portfolioScriptLoaded) return;
    w.__portfolioScriptLoaded = true;

    const el = document.createElement('script');
    el.src = 'portfolio.js';
    document.body.appendChild(el);
  }, []);

  return null;
}
