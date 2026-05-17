#!/usr/bin/env node
/**
 * 相机品牌 Logo 下载脚本
 *
 * 从各品牌官网 / Wikipedia 下载官方 logo 到 public/assets/logos/
 * 用法: node scripts/download-logos.mjs
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/logos');

// 品牌 → 官方域名 / Wikipedia 文件名
const BRAND_SOURCES = {
  'nikon':       { file: 'nikon.png',       url: 'https://logo.clearbit.com/nikon.com' },
  'nikon_full':  { file: 'nikon_full.png',  url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Nikon_logo.svg' },
  'canon':       { file: 'canon.png',       url: 'https://logo.clearbit.com/canon.com' },
  'sony':        { file: 'sony.png',        url: 'https://logo.clearbit.com/sony.com' },
  'fujifilm':    { file: 'fujifilm.png',    url: 'https://logo.clearbit.com/fujifilm.com' },
  'hasselblad':  { file: 'hasselblad.png',  url: 'https://logo.clearbit.com/hasselblad.com' },
  'hasselblad-t':{ file: 'hasselblad-t.png',url: 'https://logo.clearbit.com/hasselblad.com' },
  'leica':       { file: 'leica.png',       url: 'https://logo.clearbit.com/leica-camera.com' },
  'leica_full':  { file: 'leica_full.png',  url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Leica_logo.svg' },
  'leica_red_full': { file: 'leica_red_full.png', url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Leica_logo.svg' },
  'red':         { file: 'red.png',         url: 'https://logo.clearbit.com/red.com' },
  'red_full':    { file: 'red_full.png',    url: 'https://logo.clearbit.com/red.com' },
  'dji':         { file: 'dji.png',         url: 'https://logo.clearbit.com/dji.com' },
  'insta360':    { file: 'insta360.png',    url: 'https://logo.clearbit.com/insta360.com' },
  'kodak':       { file: 'kodak.png',       url: 'https://logo.clearbit.com/kodak.com' },
  'lumix':       { file: 'lumix.png',       url: 'https://logo.clearbit.com/panasonic.com' },
  'mamiya':      { file: 'mamiya.png',      url: 'https://logo.clearbit.com/mamiya.com' },
  'olympus':     { file: 'olympus.png',     url: 'https://logo.clearbit.com/getolympus.com' },
  'panasonic':   { file: 'panasonic.png',   url: 'https://logo.clearbit.com/panasonic.com' },
  'pentax':      { file: 'pentax.png',      url: 'https://logo.clearbit.com/pentax.com' },
  'phase_one':   { file: 'phase_one.png',   url: 'https://logo.clearbit.com/phaseone.com' },
  'ricoh':       { file: 'ricoh.png',       url: 'https://logo.clearbit.com/ricoh.com' },
  'rolleiflex':  { file: 'rolleiflex.png',  url: '' },
  'sigma':       { file: 'sigma.png',       url: 'https://logo.clearbit.com/sigma-global.com' },
  'tamron':      { file: 'tamron.png',      url: 'https://logo.clearbit.com/tamron.com' },
  'zeiss_full':  { file: 'zeiss_full.png',  url: 'https://logo.clearbit.com/zeiss.com' },
};

function download(url, dest) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    const file = fs.createWriteStream(dest);
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(true); });
      } else if (res.statusCode >= 300 && res.headers.location) {
        file.close();
        try { fs.unlinkSync(dest); } catch {}
        download(res.headers.location, dest).then(resolve);
      } else {
        file.close();
        try { fs.unlinkSync(dest); } catch {}
        resolve(false);
      }
    }).on('error', () => {
      file.close();
      try { fs.unlinkSync(dest); } catch {}
      resolve(false);
    });
  });
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let success = 0;
  let fail = 0;

  for (const [_key, src] of Object.entries(BRAND_SOURCES)) {
    const dest = path.join(OUTPUT_DIR, src.file);
    if (fs.existsSync(dest)) {
      console.log(`✓ ${src.file} — 已存在，跳过`);
      success++;
      continue;
    }
    process.stdout.write(`⟳ ${src.file} — 下载中... `);
    const ok = await download(src.url, dest);
    if (ok) {
      console.log('✓');
      success++;
    } else {
      console.log('✗ 失败');
      fail++;
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n完成: ${success} 成功, ${fail} 失败`);
}

main().catch(console.error);
