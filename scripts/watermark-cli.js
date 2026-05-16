#!/usr/bin/env node

/**
 * Camera Vision - 边框水印 CLI 批量处理工具
 *
 * Usage:
 *   node scripts/watermark-cli.js --input ./photos --output ./output
 *   node scripts/watermark-cli.js --input ./photos --config ./config.json --output ./out
 *   node scripts/watermark-cli.js --input photo.jpg --output ./out --blur 100 --corner-radius 20
 */

import fs from 'fs';
import path from 'path';

// Default configuration
const DEFAULTS = {
  blurRadius: 150,
  cornerRadius: 40,
  shadowOffset: 100,
  logo: null,
  model: '',
  fontSize: 40,
  fontColor: '#ffffff',
  fontFamily: 'Arial',
  maxDimension: 6000,
  suffix: '_watermarked',
  verbose: false,
};

function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULTS };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--input': case '-i': config.input = args[++i]; break;
      case '--output': case '-o': config.output = args[++i]; break;
      case '--config': case '-c': config.configFile = args[++i]; break;
      case '--logo': config.logo = args[++i]; break;
      case '--model': config.model = args[++i]; break;
      case '--font-size': config.fontSize = parseInt(args[++i], 10); break;
      case '--font-color': config.fontColor = args[++i]; break;
      case '--font-family': config.fontFamily = args[++i]; break;
      case '--blur': config.blurRadius = parseInt(args[++i], 10); break;
      case '--corner-radius': config.cornerRadius = parseInt(args[++i], 10); break;
      case '--shadow-offset': config.shadowOffset = parseInt(args[++i], 10); break;
      case '--max-dimension': config.maxDimension = parseInt(args[++i], 10); break;
      case '--suffix': config.suffix = args[++i]; break;
      case '--verbose': case '-v': config.verbose = true; break;
      case '--help': case '-h': showHelp(); process.exit(0);
      default:
        console.error(`未知参数: ${args[i]}`);
        console.error('使用 --help 查看帮助');
        process.exit(1);
    }
  }

  return config;
}

function showHelp() {
  console.log(`
Camera Vision - 边框水印 CLI 批量处理工具

用法:
  node scripts/watermark-cli.js --input <路径> --output <路径> [选项]

必填:
  --input, -i   输入目录或文件路径
  --output, -o  输出目录路径

选项:
  --config, -c          JSON 配置文件路径
  --logo                相机品牌 LOGO 名称
  --model               相机型号文字
  --font-size           水印字号 (默认: 40)
  --font-color          水印字体颜色 (默认: #ffffff)
  --font-family         水印字体 (默认: Arial)
  --blur                虚化程度 px (默认: 150)
  --corner-radius       圆角半径 px (默认: 40)
  --shadow-offset       阴影偏移 px (默认: 100)
  --max-dimension       最大边长 px (默认: 6000)
  --suffix              输出文件名后缀 (默认: _watermarked)
  --verbose, -v         详细日志输出
  --help, -h            显示此帮助

示例:
  node scripts/watermark-cli.js -i ./photos -o ./output
  node scripts/watermark-cli.js -i ./photos -c config.json -o ./output --blur 100
  `);
}

function loadConfig(configPath) {
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`读取配置文件失败: ${configPath}`);
    console.error(err.message);
    process.exit(1);
  }
}

function isImageFile(filePath) {
  return /\.(jpg|jpeg|png|webp)$/i.test(filePath);
}

function collectImageFiles(inputPath) {
  const stats = fs.statSync(inputPath);
  if (stats.isFile()) {
    return [inputPath];
  }

  const results = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (isImageFile(entry)) {
        results.push(fullPath);
      }
    }
  }
  walk(inputPath);
  return results;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function processImage(inputFile, outputFile, config) {
  try {
    const { renderWatermarkNode } = await import('../src/utils/frame-renderer/node-renderer.js');

    await renderWatermarkNode({
      config: {
        frame: {
          blurRadius: config.blurRadius,
          cornerRadius: config.cornerRadius,
          shadowOffset: config.shadowOffset,
          watermark: {
            logo: config.logo,
            model: config.model,
            exifText: config.exifText || '',
            fontFamily: config.fontFamily,
            fontSize: config.fontSize,
            fontColor: config.fontColor,
          },
        },
        maxDimension: config.maxDimension,
      },
      inputPath: inputFile,
      outputPath: outputFile,
      maxDimension: config.maxDimension,
    });

    return true;
  } catch (err) {
    return { error: err.message };
  }
}

async function main() {
  const cliArgs = parseArgs();

  // Check required args
  if (!cliArgs.input || !cliArgs.output) {
    console.error('错误: --input 和 --output 是必填参数');
    console.error('使用 --help 查看帮助');
    process.exit(1);
  }

  // Load JSON config if provided (CLI args override JSON config)
  if (cliArgs.configFile) {
    const fileConfig = loadConfig(cliArgs.configFile);
    Object.assign(cliArgs, { ...fileConfig, ...cliArgs });
  }

  // Collect input files
  const files = collectImageFiles(cliArgs.input);
  if (files.length === 0) {
    console.error('未找到图片文件');
    process.exit(1);
  }

  ensureDir(cliArgs.output);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const inputFile = files[i];
    const ext = path.extname(inputFile);
    const baseName = path.basename(inputFile, ext);
    const outputFile = path.join(cliArgs.output, `${baseName}${cliArgs.suffix}${ext}`);

    process.stdout.write(`[${i + 1}/${files.length}] ${baseName}... `);

    const result = await processImage(inputFile, outputFile, cliArgs);
    if (result === true) {
      console.log(`✓ ${path.basename(outputFile)}`);
      success++;
    } else {
      console.log(`✗ ${result.error}`);
      failed++;
    }
  }

  console.log(`\n处理完成: ${success}成功${failed > 0 ? `, ${failed}失败` : ''}`);
}

main().catch((err) => {
  console.error('处理过程中出现错误:', err.message);
  process.exit(1);
});
