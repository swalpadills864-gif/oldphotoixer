/**
 * Multi-language HTML Generator
 *
 * Generates static HTML pages for all supported languages
 * Run: node scripts/generate-i18n.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const I18N_DIR = path.join(__dirname, '../i18n');
const OUTPUT_DIR = path.join(__dirname, '..');
const TEMPLATE_FILE = path.join(__dirname, '../templates/index.html');

const LANGUAGES = [
    { code: 'en', dir: '', isDefault: true },
    { code: 'zh-Hans', dir: '/zh', isDefault: false },
    { code: 'ja', dir: '/ja', isDefault: false },
    { code: 'ko', dir: '/ko', isDefault: false },
    { code: 'es', dir: '/es', isDefault: false },
    { code: 'fr', dir: '/fr', isDefault: false },
    { code: 'pt', dir: '/pt', isDefault: false },
    { code: 'ar', dir: '/ar', isDefault: false, rtl: true },
    { code: 'de', dir: '/de', isDefault: false },
    { code: 'ru', dir: '/ru', isDefault: false }
];

/**
 * Load translation file
 */
function loadTranslations(langCode) {
    const file = path.join(I18N_DIR, `${langCode}.json`);
    if (!fs.existsSync(file)) {
        throw new Error(`Translation file not found: ${file}`);
    }
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

/**
 * Flatten nested object to dot notation
 */
function flatten(obj, prefix = '') {
    const result = {};
    for (const key in obj) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(result, flatten(obj[key], newKey));
        } else {
            result[newKey] = obj[key];
        }
    }
    return result;
}

/**
 * Generate index.html for a language
 */
function generateIndexHtml(translations, langInfo) {
    // Read template
    let html = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

    // Build replacement context
    const flat = flatten(translations);
    const ctx = { ...flat };

    // Set lang and dir
    ctx.lang = translations.lang;
    ctx.dir = translations.dir;

    // Build paths based on language
    const isDefault = langInfo.isDefault;
    ctx.homeUrl = isDefault ? '/' : `/${langInfo.code}/`;
    ctx.blogUrl = isDefault ? '/blog/index.html' : `/${langInfo.code}/blog/index.html`;
    ctx.privacyUrl = isDefault ? '/privacy.html' : `/${langInfo.code}/privacy.html`;
    ctx.canonicalUrl = `https://oldphotoixer.ai-world.top${isDefault ? '/' : `/${langInfo.code}/`}`;
    ctx.cssFile = isDefault ? 'css/style.css' : '../css/style.css';
    ctx.jsFile = isDefault ? 'js/app.js' : '../js/app.js';

    // Replace all {{key}} placeholders
    for (const [key, value] of Object.entries(ctx)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        html = html.replace(regex, value);
    }

    // Set html[dir] attribute for RTL
    if (langInfo.rtl) {
        html = html.replace('<html lang="{{lang}}">', `<html lang="{{lang}}" dir="rtl">`);
    }

    // Clean up any remaining {{unmatched}} placeholders
    html = html.replace(/\{\{[^}]+\}\}/g, '');

    return html;
}

/**
 * Generate privacy.html for a language
 */
function generatePrivacyHtml(translations, langInfo, templateHtml) {
    const flat = flatten(translations);
    const ctx = { ...flat };

    // Set lang and dir
    ctx.lang = translations.lang;
    ctx.dir = translations.dir;

    // Build paths based on language
    const isDefault = langInfo.isDefault;
    ctx.homeUrl = isDefault ? '/' : `/${langInfo.code}/`;
    ctx.blogUrl = isDefault ? '/blog/index.html' : `/${langInfo.code}/blog/index.html`;
    ctx.privacyUrl = isDefault ? '/privacy.html' : `/${langInfo.code}/privacy.html`;
    ctx.canonicalUrl = `https://oldphotoixer.ai-world.top${isDefault ? '/' : `/${langInfo.code}/`}`;
    ctx.cssFile = isDefault ? 'css/style.css' : '../css/style.css';
    ctx.jsFile = isDefault ? 'js/app.js' : '../js/app.js';

    // Read privacy template
    let html = fs.readFileSync(path.join(__dirname, '../templates/privacy.html'), 'utf-8');

    // Replace {{key}} placeholders
    for (const [key, value] of Object.entries(ctx)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        html = html.replace(regex, value);
    }

    // Set RTL if needed
    if (langInfo.rtl) {
        html = html.replace('<html lang="{{lang}}">', `<html lang="{{lang}}" dir="rtl">`);
    }

    // Clean up
    html = html.replace(/\{\{[^}]+\}\}/g, '');

    return html;
}

/**
 * Copy and update blog index for a language
 */
function copyBlogIndex(langInfo) {
    const isDefault = langInfo.isDefault;
    const blogDir = path.join(OUTPUT_DIR, langInfo.code, 'blog');

    if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
    }

    // Read original blog index
    const blogIndexSrc = path.join(OUTPUT_DIR, 'blog', 'index.html');
    if (!fs.existsSync(blogIndexSrc)) return;

    let blogHtml = fs.readFileSync(blogIndexSrc, 'utf-8');

    // Update paths
    blogHtml = blogHtml.replace(/index.html"(?:\.\.\/)+css\/style\.css"/g, isDefault ? '"css/style.css"' : '"../css/style.css"');
    blogHtml = blogHtml.replace(/index.html"(?:\.\.\/)+js\/header-scroll\.js"/g, isDefault ? '"js/header-scroll.js"' : '"../js/header-scroll.js"');
    blogHtml = blogHtml.replace(/index.html"(?:\.\.\/)+sitemap\.xml"/g, isDefault ? '"../sitemap.xml"' : '"../../sitemap.xml"');

    fs.writeFileSync(path.join(blogDir, 'index.html'), blogHtml, 'utf-8');
}

/**
 * Main generation function
 */
async function main() {
    console.log('🌐 Starting multi-language HTML generation...\n');

    // Load privacy template once
    let successCount = 0;
    let errorCount = 0;

    for (const langInfo of LANGUAGES) {
        try {
            console.log(`📄 Generating ${langInfo.code}${langInfo.rtl ? ' (RTL)' : ''}...`);

            // Load translations
            const translations = loadTranslations(langInfo.code);

            // Output directory for this language
            const langDir = path.join(OUTPUT_DIR, langInfo.dir);
            if (langDir !== OUTPUT_DIR) {
                if (!fs.existsSync(langDir)) {
                    fs.mkdirSync(langDir, { recursive: true });
                }
            }

            // Generate index.html
            const indexHtml = generateIndexHtml(translations, langInfo);
            const indexPath = path.join(langDir, 'index.html');
            fs.writeFileSync(indexPath, indexHtml, 'utf-8');

            // Generate privacy.html
            const privacyHtml = generatePrivacyHtml(translations, langInfo);
            const privacyPath = path.join(langDir, 'privacy.html');
            fs.writeFileSync(privacyPath, privacyHtml, 'utf-8');

            // Copy blog index for non-default languages
            if (!langInfo.isDefault) {
                copyBlogIndex(langInfo);
            }

            successCount++;
            console.log(`✅ ${langInfo.code} complete\n`);
        } catch (e) {
            errorCount++;
            console.error(`❌ Failed to generate ${langInfo.code}:`, e.message, '\n');
        }
    }

    console.log('═══════════════════════════════════════');
    console.log(`📊 Generation complete!`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log('═══════════════════════════════════════');
}

main().catch(console.error);