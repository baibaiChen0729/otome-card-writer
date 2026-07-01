#!/usr/bin/env node
/**
 * otome-card-writer · gen_docx.js
 * 将角色卡 Markdown 文件渲染为带排版的 .docx
 *
 * 用法：
 *   node gen_docx.js --input path/to/card.md --output path/to/card.docx
 *
 * 依赖（全局安装）：
 *   npm install -g docx
 *   NODE_PATH=/home/node/.npm-global/lib/node_modules node gen_docx.js ...
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, LevelFormat,
} = require('docx');
const fs   = require('fs');
const path = require('path');

// ── CLI args ──
const args = process.argv.slice(2);
const get  = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const inputFile  = get('--input');
const outputFile = get('--output');
if (!inputFile || !outputFile) {
  console.error('Usage: node gen_docx.js --input <md> --output <docx>');
  process.exit(1);
}
const mdText = fs.readFileSync(inputFile, 'utf8');

// ── 颜色常量 ──
const BLACK  = "1A1A1A";
const DARK   = "2C2C2C";
const RED    = "8B1A1A";
const ACCENT = "4A3728";
const HEADBG = "1E1E1E";
const TABBG  = "2A2118";
const TABALT = "F5F0EB";
const DIV    = "6B4C3B";
const WHITE  = "FFFFFF";
const GRAY   = "888888";

const PAGE_W = 11906;
const MARGIN = 720;
const CONT   = PAGE_W - MARGIN * 2;

const border  = (c = "DDDDDD") => ({ style: BorderStyle.SINGLE, size: 1, color: c });
const borders = (c = "DDDDDD") => ({ top: border(c), bottom: border(c), left: border(c), right: border(c) });

// ── 基础段落工厂 ──
function p(text, opts = {}) {
  const { bold=false, size=22, color=BLACK, italic=false,
          indent=0, spacing={before:60,after:60}, center=false } = opts;
  const runs = [];
  if (Array.isArray(text)) { runs.push(...text); }
  else {
    for (const part of String(text).split(/(「[^」]*」)/g)) {
      if (/^「.*」$/.test(part))
        runs.push(new TextRun({ text: part, bold, size, color: ACCENT, italic, font: "SimSun" }));
      else if (part)
        runs.push(new TextRun({ text: part, bold, size, color, italic, font: "SimSun" }));
    }
  }
  return new Paragraph({
    children: runs, alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing, indent: indent ? { left: indent } : undefined,
  });
}

function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: DIV, space: 4 } },
    spacing: { before: 180, after: 180 }, children: [],
  });
}
function sectionTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text: `  ${text}  `, bold: true, size: 26, color: WHITE, font: "SimHei",
      shading: { fill: HEADBG, type: ShadingType.CLEAR } })],
    spacing: { before: 300, after: 160 },
  });
}
function h1(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 40, color: RED, font: "SimHei" })],
    alignment: AlignmentType.CENTER, spacing: { before: 240, after: 80 },
  });
}
function h2(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 26, color: ACCENT, font: "SimSun" })],
    alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 },
  });
}
function h3(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24, color: DARK, font: "SimHei" })],
    spacing: { before: 200, after: 80 },
  });
}
function nodeTitle(label) {
  const [num, ...rest] = label.split('：');
  return new Paragraph({
    children: [
      new TextRun({ text: ` ${num} `, bold: true, size: 24, color: WHITE, font: "SimHei",
        shading: { fill: RED, type: ShadingType.CLEAR } }),
      new TextRun({ text: `  ${rest.join('：')}`, bold: true, size: 24, color: RED, font: "SimHei" }),
    ],
    spacing: { before: 280, after: 120 },
  });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [new TextRun({ text, size: 22, color: DARK, font: "SimSun" })],
    spacing: { before: 40, after: 40 },
  });
}
function quoteBox(lines) {
  return new Table({
    width: { size: CONT, type: WidthType.DXA }, columnWidths: [CONT],
    rows: [new TableRow({ children: [new TableCell({
      borders: borders(DIV), width: { size: CONT, type: WidthType.DXA },
      shading: { fill: "FBF7F2", type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 240, right: 240 },
      children: lines.map(l => new Paragraph({
        children: [new TextRun({ text: l, size: 22, color: ACCENT, font: "SimSun" })],
        spacing: { before: 60, after: 60 },
      })),
    })] })],
  });
}
function twoColTable(rows) {
  const C1 = 2800, C2 = CONT - C1;
  return new Table({
    width: { size: CONT, type: WidthType.DXA }, columnWidths: [C1, C2],
    rows: rows.map(([h, v], i) => new TableRow({ children: [
      new TableCell({
        borders: borders("BBBBBB"), width: { size: C1, type: WidthType.DXA },
        shading: { fill: i === 0 ? TABBG : "F0EBE5", type: ShadingType.CLEAR },
        margins: { top:80, bottom:80, left:160, right:120 },
        children: [new Paragraph({ children: [new TextRun({
          text: h, bold: true, size: 22, color: i===0?WHITE:ACCENT, font: "SimHei" })] })],
      }),
      new TableCell({
        borders: borders("BBBBBB"), width: { size: C2, type: WidthType.DXA },
        shading: { fill: i===0 ? "2E2320" : WHITE, type: ShadingType.CLEAR },
        margins: { top:80, bottom:80, left:160, right:120 },
        children: [new Paragraph({ children: [new TextRun({
          text: v, size: 22, color: i===0?"DDCCBB":DARK, font: "SimSun" })] })],
      }),
    ] })),
  });
}

// ── Markdown → docx 段落转换 ──
function convertMd(lines) {
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // 标题
    if (/^# /.test(line))  { out.push(h1(line.slice(2).trim())); i++; continue; }
    if (/^## /.test(line)) { out.push(h2(line.slice(3).trim())); i++; continue; }
    if (/^### /.test(line)) { out.push(h3(line.slice(4).trim())); i++; continue; }
    if (/^#### /.test(line)) {
      const t = line.slice(5).trim();
      // 节点标题识别
      if (/^🖤\s*节点/.test(t)) {
        const label = t.replace('🖤 ', '').replace(/^节点/, '').trim();
        out.push(nodeTitle('节点' + label)); i++; continue;
      }
      out.push(h3(t)); i++; continue;
    }

    // 分割线
    if (/^---+$/.test(line.trim())) { out.push(divider()); i++; continue; }

    // 节标题（一、二、三…）
    if (/^### /.test(line) || /^【.+】$/.test(line.trim())) {
      out.push(sectionTitle(line.replace(/^#+\s*/, '').trim())); i++; continue;
    }

    // 引用块 (>)
    if (/^>/.test(line)) {
      const qLines = [];
      while (i < lines.length && /^>/.test(lines[i])) {
        qLines.push(lines[i].replace(/^>\s?/, '').trim()); i++;
      }
      if (qLines.length) out.push(quoteBox(qLines));
      continue;
    }

    // 表格（| 开头）
    if (/^\|/.test(line)) {
      const tableLines = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        tableLines.push(lines[i]); i++;
      }
      // 解析表格
      const rows = tableLines
        .filter(l => !/^\|[-: |]+\|$/.test(l.trim()))
        .map(l => l.split('|').filter((_, j, a) => j > 0 && j < a.length - 1).map(c => c.trim()));
      if (rows.length >= 1) out.push(twoColTable(rows.slice(0, 2).length >= 2 ? rows : rows));
      continue;
    }

    // 无序列表
    if (/^[-*]\s/.test(line)) {
      out.push(bullet(line.replace(/^[-*]\s/, '').trim())); i++; continue;
    }
    // 选项行（□ 开头 或 emoji 开头）
    if (/^[-□🟢🟡🟠🔴🟣]/.test(line.trim())) {
      out.push(p(line.trim(), { indent: 360 })); i++; continue;
    }

    // 空行
    if (line.trim() === '') { out.push(new Paragraph({ spacing: { before: 60, after: 60 }, children: [] })); i++; continue; }

    // 普通段落（含粗体/引号检测）
    const isBold = /^\*\*/.test(line.trim()) || /^【/.test(line.trim());
    const cleaned = line.replace(/\*\*/g, '').trim();
    out.push(p(cleaned, { bold: isBold }));
    i++;
  }
  return out;
}

// ── 主流程 ──
const lines = mdText.split('\n');
const children = convertMd(lines);

const doc = new Document({
  numbering: { config: [{ reference: "bullets", levels: [{
    level: 0, format: LevelFormat.BULLET, text: "·",
    alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 480, hanging: 240 } } },
  }] }] },
  styles: { default: { document: { run: { font: "SimSun", size: 22 } } } },
  sections: [{ properties: {
    page: {
      size: { width: PAGE_W, height: 16838 },
      margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
    }
  }, children }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outputFile, buf);
  console.log(`done: ${buf.length} bytes → ${outputFile}`);
}).catch(e => { console.error(e); process.exit(1); });
