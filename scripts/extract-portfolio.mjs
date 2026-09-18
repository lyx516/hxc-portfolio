#!/usr/bin/env node
/**
 * 从 reference/胡雪纯｜美术教师作品集.html（桌面作品集的原始单文件页面）
 * 拆出样式、正文与交互脚本，生成 Next.js 侧的三个文件：
 *   src/app/globals.css          页面样式
 *   src/config/portfolio-body.ts 正文 HTML（作为字符串导出）
 *   public/portfolio.js          交互脚本
 * 同时核对正文引用的图片是否都在 public/assets/ 里。
 *
 * 用法：npm run sync
 * 这个脚本只读 reference/ 下的原始 HTML，不改动它。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(root, 'reference', '胡雪纯｜美术教师作品集.html');

const raw = fs.readFileSync(SOURCE, 'utf8').replace(/^\uFEFF/, '');

function slice(startTag, endTag) {
  const i = raw.indexOf(startTag);
  const j = raw.indexOf(endTag);
  if (i === -1 || j === -1 || j < i) {
    throw new Error(`原始页面里找不到 ${startTag} … ${endTag}`);
  }
  return { start: i, end: j, text: raw.slice(i + startTag.length, j) };
}

const style = slice('<style>', '</style>');
const head = slice('<head>', '</head>');
const body = slice('<body>', '<script>');
const script = slice('<script>', '</script>');

const styleText = style.text.trim();
const bodyHtml = body.text.trim();
const scriptText = script.text.trim();

const title = (head.text.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1].trim();
const description = (head.text.match(/<meta name="description" content="([\s\S]*?)">/) || [, ''])[1].trim();

const cssOut = path.join(root, 'src/app/globals.css');
fs.writeFileSync(
  cssOut,
  `/* 由 scripts/extract-portfolio.mjs 从 reference/胡雪纯｜美术教师作品集.html 生成，请勿手改；\n   要改样式请改原始页面后重跑 npm run sync。 */\n${styleText}\n`,
  'utf8',
);

const bodyOut = path.join(root, 'src/config/portfolio-body.ts');
fs.writeFileSync(
  bodyOut,
  `/* 由 scripts/extract-portfolio.mjs 生成，请勿手改。内容为原始页面的 <body> 正文（不含交互脚本）。 */\n` +
    `export const portfolioBodyHtml: string = ${JSON.stringify(bodyHtml)};\n`,
  'utf8',
);

const jsOut = path.join(root, 'public/portfolio.js');
fs.writeFileSync(jsOut, `/* 由 scripts/extract-portfolio.mjs 生成，请勿手改。原始页面的内联交互脚本。 */\n${scriptText}\n`, 'utf8');

// 核对正文引用的资源
const refs = new Set();
for (const m of bodyHtml.matchAll(/(?:src|data-src)="(assets\/[^"]+)"/g)) refs.add(m[1]);
const missing = [...refs].filter((r) => !fs.existsSync(path.join(root, 'public', r)));
const onDisk = fs.readdirSync(path.join(root, 'public/assets'));
const unused = onDisk.filter((f) => !refs.has(`assets/${f}`));

console.log(`来源        ${path.relative(root, SOURCE)}`);
console.log(`标题        ${title}`);
console.log(`描述        ${description.slice(0, 40)}…`);
console.log(`写出        ${path.relative(root, cssOut)} (${Buffer.byteLength(styleText)} B)`);
console.log(`写出        ${path.relative(root, bodyOut)} (${Buffer.byteLength(bodyHtml)} B)`);
console.log(`写出        ${path.relative(root, jsOut)} (${Buffer.byteLength(scriptText)} B)`);
console.log(`正文引用图片 ${refs.size} 个；assets 目录 ${onDisk.length} 个文件`);
if (missing.length) {
  console.error(`缺失资源：\n  ${missing.join('\n  ')}`);
  process.exitCode = 1;
} else {
  console.log('✓ 正文引用的图片全部存在');
}
if (unused.length) console.log(`（assets 里未被正文引用：${unused.join('、')}）`);
