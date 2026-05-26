/**
 * Generate SEO-optimized index pages for all languages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const LANGUAGES = [
    { code: 'en', dir: '', name: 'English', nativeName: 'English', locale: 'en_US', hreflang: 'en' },
    { code: 'zh', dir: '/zh', name: 'Chinese', nativeName: '简体中文', locale: 'zh_CN', hreflang: 'zh' },
    { code: 'ja', dir: '/ja', name: 'Japanese', nativeName: '日本語', locale: 'ja_JP', hreflang: 'ja' },
    { code: 'ko', dir: '/ko', name: 'Korean', nativeName: '한국어', locale: 'ko_KR', hreflang: 'ko' },
    { code: 'es', dir: '/es', name: 'Spanish', nativeName: 'Español', locale: 'es_ES', hreflang: 'es' },
    { code: 'fr', dir: '/fr', name: 'French', nativeName: 'Français', locale: 'fr_FR', hreflang: 'fr' },
    { code: 'pt', dir: '/pt', name: 'Portuguese', nativeName: 'Português', locale: 'pt_BR', hreflang: 'pt' },
    { code: 'ar', dir: '/ar', name: 'Arabic', nativeName: 'العربية', locale: 'ar_SA', hreflang: 'ar', rtl: true },
    { code: 'de', dir: '/de', name: 'German', nativeName: 'Deutsch', locale: 'de_DE', hreflang: 'de' },
    { code: 'ru', dir: '/ru', name: 'Russian', nativeName: 'Русский', locale: 'ru_RU', hreflang: 'ru' }
];

const i18n = {
    'en': {
        title: 'OldPhotoFixer - Free AI Old Photo Restoration in Browser',
        description: 'Restore old, blurry, damaged photos instantly in your browser. Free, private, no uploads. AI-powered photo restoration without any server costs.',
        keywords: 'old photo restoration, restore old photos, photo enhancer, AI photo restoration, free photo restoration, photo fix, blurry photo, photo editing',
        h1: 'Restore Old Photos with AI',
        h1Accent: 'Completely Free & Private',
        subtitle: 'No uploads. No server costs. Your photos never leave your device. Powered by AI running directly in your browser.',
        badge1: '100% Private',
        badge2: 'Instant Processing',
        badge3: '100% Free',
        uploadText: 'Drop your old photo here',
        uploadSubtext: 'or click to browse',
        uploadFormats: 'Supports JPG, PNG, WebP (max 10MB)',
        processBtn: 'Restore Photo',
        loadingModels: 'Loading Models...',
        resultHeader: 'Restoration Complete!',
        download: 'Download Restored Photo',
        before: 'Before',
        after: 'After',
        featuresTitle: 'Why Choose OldPhotoFixer?',
        feature1Title: '100% Private',
        feature1Desc: 'Your photos never leave your device. All processing happens locally in your browser. No uploads, no servers, no data collection.',
        feature2Title: 'Lightning Fast',
        feature2Desc: 'Process your photos in seconds. No waiting for server responses or dealing with upload failures.',
        feature3Title: 'Always Free',
        feature3Desc: 'No subscriptions, no credit packs, no watermarks. Restore as many photos as you want, completely free forever.',
        howItWorksTitle: 'How It Works',
        step1Title: 'Upload Your Photo',
        step1Desc: 'Drag and drop or click to select any old, blurry, or damaged photo from your device.',
        step2Title: 'AI Restoration',
        step2Desc: 'Our AI model runs directly in your browser to enhance clarity, fix damage, and upscale your photo.',
        step3Title: 'Download Result',
        step3Desc: 'Compare the before and after, then download your restored photo in full quality.',
        ctaTitle: 'Ready to Restore Your Memories?',
        ctaDesc: 'Bring your old photos back to life in seconds. No signup required.',
        ctaBtn: 'Try OldPhotoFixer Now',
        navTool: 'Tool',
        navBlog: 'Blog',
        navFeatures: 'Features',
        navPrivacy: 'Privacy',
        footerHome: 'Home',
        footerBlog: 'Blog',
        footerPrivacy: 'Privacy Policy',
        footerCopy: 'All rights reserved.',
        noWebglTitle: 'Browser Not Supported',
        noWebglDesc: 'Your browser doesn\'t support WebGL, which is required for AI photo processing. Please try a modern browser like Chrome, Firefox, or Edge.',
        heroTitle: 'Restore Old Photos with AI',
        changePhoto: 'Change Photo',
        initializing: 'Initializing...'
    },
    'zh': {
        title: 'OldPhotoFixer - 浏览器中免费的AI老照片修复工具',
        description: '直接在浏览器中即时修复老旧、模糊、损坏的照片。免费，保护隐私、无需上传。无需任何服务器成本的AI驱动照片修复。',
        keywords: '老照片修复, 修复老照片, 照片增强, AI照片修复, 免费照片修复, 照片修复, 模糊照片, 照片编辑',
        h1: '用AI修复老照片',
        h1Accent: '完全免费且保护隐私',
        subtitle: '无需上传，无服务器成本。您的照片永远不会离开您的设备。由直接在浏览器中运行的AI驱动。',
        badge1: '100% 隐私保护',
        badge2: '即时处理',
        badge3: '完全免费',
        uploadText: '拖放老照片到这里',
        uploadSubtext: '或点击浏览',
        uploadFormats: '支持 JPG、PNG、WebP（最大 10MB）',
        processBtn: '修复照片',
        loadingModels: '加载模型中...',
        resultHeader: '修复完成！',
        download: '下载修复后的照片',
        before: '修复前',
        after: '修复后',
        featuresTitle: '为什么选择 OldPhotoFixer？',
        feature1Title: '100% 隐私保护',
        feature1Desc: '您的照片永远不会离开您的设备。所有处理都在浏览器本地完成。不上传、不使用服务器、不收集数据。',
        feature2Title: '闪电般快速',
        feature2Desc: '几秒钟内处理您的照片。无需等待服务器响应，也不必担心上传失败。',
        feature3Title: '永久免费',
        feature3Desc: '无需订阅、无需积分包、无水印。想修复多少照片就修复多少，完全免费。',
        howItWorksTitle: '工作原理',
        step1Title: '上传您的照片',
        step1Desc: '拖放或点击选择设备中的任何老旧、模糊或损坏的照片。',
        step2Title: 'AI修复',
        step2Desc: '我们的AI模型直接在您的浏览器中运行，增强清晰度、修复损坏，提升照片分辨率。',
        step3Title: '下载结果',
        step3Desc: '对比修复前后的效果，然后以完整质量下载修复后的照片。',
        ctaTitle: '准备好恢复您的记忆了吗？',
        ctaDesc: '几秒钟即可让您的老照片重焕新生。无需注册。',
        ctaBtn: '立即使用 OldPhotoFixer',
        navTool: '工具',
        navBlog: '博客',
        navFeatures: '功能',
        navPrivacy: '隐私',
        footerHome: '首页',
        footerBlog: '博客',
        footerPrivacy: '隐私政策',
        footerCopy: '保留所有权利。',
        noWebglTitle: '浏览器不支持',
        noWebglDesc: '您的浏览器不支持 WebGL，这是 AI 照片处理所必需的。请使用 Chrome、Firefox 或 Edge 等现代浏览器。',
        heroTitle: '用AI修复老照片',
        changePhoto: '更换照片',
        initializing: '初始化中...'
    }
};

function generateHreflangLinks(currentLang) {
    return LANGUAGES.map(lang => {
        const url = lang.code === 'en' ? 'https://oldphotoixer.ai-world.top/index.html' : `https://oldphotoixer.ai-world.top/${lang.code}/index.html`;
        return `<link rel="alternate" hreflang="${lang.hreflang}" href="${url}">`;
    }).join('\n    ');
}

function generateJsonLd(lang) {
    const locale = lang === 'en' ? 'en_US' : `${lang}_${lang.toUpperCase()}`;
    return `<script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "OldPhotoFixer",
        "url": "https://oldphotoixer.ai-world.top",
        "description": "Free AI-powered old photo restoration tool that works entirely in your browser.",
        "inLanguage": "${lang}",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://oldphotoixer.ai-world.top/?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
    </script>`;
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Generate index pages for all languages
console.log('Generating SEO-optimized index pages...\n');

for (const langInfo of LANGUAGES) {
    const outputDir = path.join(ROOT_DIR, langInfo.dir || '.');
    ensureDir(outputDir);
    const outputFile = path.join(outputDir, 'index.html');

    const t = i18n[langInfo.code] || i18n['en'];
    const isDefaultLang = langInfo.code === 'en';
    const cssPath = isDefaultLang ? '' : '../';
    const homeUrl = isDefaultLang ? '/index.html' : `/${langInfo.code}/index.html`;
    const blogUrl = isDefaultLang ? '/blog/index.html' : `/${langInfo.code}/blog/index.html`;
    const privacyUrl = isDefaultLang ? '/privacy.html' : `/${langInfo.code}/privacy.html`;

    const html = `<!DOCTYPE html>
<html lang="${langInfo.code}"${langInfo.rtl ? ' dir="rtl"' : ''}>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title}</title>
    <meta name="description" content="${t.description}">
    <meta name="keywords" content="${t.keywords}">
    <meta name="author" content="OldPhotoFixer">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="googlebot" content="index, follow">

    <!-- Geographic Meta Tags -->
    <meta name="geo.region" content="US">
    <meta name="geo.placename" content="San Francisco">
    <meta name="geo.position" content="37.7749;-122.4194">
    <meta name="ICBM" content="37.7749, -122.4194">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://oldphotoixer.ai-world.top${isDefaultLang ? '' : '/' + langInfo.code}/index.html">
    <meta property="og:title" content="${t.title}">
    <meta property="og:description" content="${t.description}">
    <meta property="og:image" content="https://oldphotoixer.ai-world.top/images/og-image.png">
    <meta property="og:locale" content="${langInfo.locale}">
    <meta property="og:site_name" content="OldPhotoFixer">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${t.title}">
    <meta name="twitter:description" content="${t.description}">
    <meta name="twitter:image" content="https://oldphotoixer.ai-world.top/images/og-image.png">

    <!-- Canonical and hreflang -->
    <link rel="canonical" href="https://oldphotoixer.ai-world.top${isDefaultLang ? '' : '/' + langInfo.code}/index.html">
    ${generateHreflangLinks(langInfo.code)}
    <link rel="alternate" hreflang="x-default" href="https://oldphotoixer.ai-world.top/index.html">

    <!-- Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Styles -->
    <link rel="stylesheet" href="${cssPath}css/style.css">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📷</text></svg>">

    <!-- JSON-LD -->
    ${generateJsonLd(langInfo.code)}
</head>
<body>
    <header class="header" id="header">
        <div class="container header-inner">
            <a href="${homeUrl}" class="logo"><img src="../images/logo.svg" alt="OldPhotoFixer - Free AI Photo Restoration Tool" width="170" height="36" loading="lazy"></a>
            <nav class="nav" aria-label="Main navigation">
                <a href="${homeUrl}#tool" class="nav-link">${t.navTool}</a>
                <a href="${blogUrl}" class="nav-link">${t.navBlog}</a>
                <a href="${homeUrl}#features" class="nav-link">${t.navFeatures}</a>
                <a href="${privacyUrl}" class="nav-link">${t.navPrivacy}</a>
                <div class="lang-dropdown">
                    <button class="lang-btn" id="langBtn" aria-label="Select language">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        <span class="lang-current">${langInfo.nativeName.split(' ')[0]}</span>
                        <svg class="lang-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="lang-menu" id="langMenu" role="menu">
                        ${LANGUAGES.map(l => `<a href="${l.code === 'en' ? '/index.html' : '/' + l.code + '/index.html'}" class="lang-option${l.code === langInfo.code ? ' active' : ''}" role="menuitem">${l.nativeName}</a>`).join('\n                        ')}
                    </div>
                </div>
            </nav>
            <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
        </div>
    </header>

    <div class="mobile-nav" id="mobileNav" role="navigation" aria-label="Mobile navigation">
        <a href="${homeUrl}#tool" class="mobile-nav-link">${t.navTool}</a>
        <a href="${blogUrl}" class="mobile-nav-link">${t.navBlog}</a>
        <a href="${homeUrl}#features" class="mobile-nav-link">${t.navFeatures}</a>
        <a href="${privacyUrl}" class="mobile-nav-link">${t.navPrivacy}</a>
        <div class="mobile-nav-lang">
            <div class="mobile-nav-lang-label">Language</div>
            ${LANGUAGES.map(l => `<a href="${l.code === 'en' ? '/index.html' : '/' + l.code + '/index.html'}" class="mobile-nav-lang-link${l.code === langInfo.code ? ' active' : ''}">${l.nativeName}</a>`).join('\n            ')}
        </div>
    </div>

    <main>
        <section class="hero" id="hero">
            <div class="container">
                <h1 class="hero-title">${t.h1}<br><span class="accent">${t.h1Accent}</span></h1>
                <p class="hero-subtitle">${t.subtitle}</p>
                <div class="hero-badges">
                    <span class="badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        ${t.badge1}
                    </span>
                    <span class="badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
                        ${t.badge2}
                    </span>
                    <span class="badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        ${t.badge3}
                    </span>
                </div>
            </div>
        </section>

        <section class="tool-section" id="tool">
            <div class="container">
                <div class="upload-zone" id="uploadZone">
                    <div class="upload-content" id="uploadContent">
                        <svg class="upload-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <p class="upload-text">${t.uploadText}</p>
                        <p class="upload-subtext">${t.uploadSubtext}</p>
                        <p class="upload-formats">${t.uploadFormats}</p>
                    </div>
                    <div class="preview-content" id="previewContent" style="display: none;">
                        <img id="previewImage" class="preview-image" alt="Preview">
                        <button class="change-photo-btn" id="changePhotoBtn">${t.changePhoto}</button>
                    </div>
                    <input type="file" id="fileInput" accept="image/jpeg,image/png,image/webp" hidden>
                </div>

                <div class="error-message" id="errorMessage" style="display: none;"></div>

                <button class="process-btn" id="processBtn" disabled>
                    <span class="btn-text">${t.processBtn}</span>
                    <span class="btn-loading" style="display: none;">
                        <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10" stroke-opacity="0.3"></circle>
                            <path d="M12 2a10 10 0 0 1 10 10"></path>
                        </svg>
                        <span class="loading-text">${t.loadingModels}</span>
                    </span>
                </button>

                <div class="progress-container" id="progressContainer" style="display: none;">
                    <div class="progress-header">
                        <span class="progress-status" id="progressStatus">${t.initializing}</span>
                        <span class="progress-percent" id="progressPercent">0%</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                </div>

                <div class="result-container" id="resultContainer" style="display: none;">
                    <div class="result-header">
                        <h2>${t.resultHeader}</h2>
                        <button class="download-btn" id="downloadBtn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            ${t.download}
                        </button>
                    </div>
                    <div class="comparison-container" id="comparisonContainer">
                        <div class="comparison-wrapper">
                            <img id="beforeImage" class="comparison-image before-image" alt="${t.before}">
                            <img id="afterImage" class="comparison-image after-image" alt="${t.after}">
                            <div class="comparison-slider" id="comparisonSlider">
                                <div class="slider-line"></div>
                                <div class="slider-handle" id="sliderHandle">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="comparison-labels">
                            <span class="comparison-label">${t.before}</span>
                            <span class="comparison-label">${t.after}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="features-section" id="features">
            <div class="container">
                <h2 class="section-title">${t.featuresTitle}</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </div>
                        <h3>${t.feature1Title}</h3>
                        <p>${t.feature1Desc}</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                        </div>
                        <h3>${t.feature2Title}</h3>
                        <p>${t.feature2Desc}</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                        </div>
                        <h3>${t.feature3Title}</h3>
                        <p>${t.feature3Desc}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="how-it-works" id="how-it-works">
            <div class="container">
                <h2 class="section-title">${t.howItWorksTitle}</h2>
                <div class="steps">
                    <div class="step">
                        <div class="step-number">1</div>
                        <h3>${t.step1Title}</h3>
                        <p>${t.step1Desc}</p>
                    </div>
                    <div class="step-arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <h3>${t.step2Title}</h3>
                        <p>${t.step2Desc}</p>
                    </div>
                    <div class="step-arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <h3>${t.step3Title}</h3>
                        <p>${t.step3Desc}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="cta-section">
            <div class="container">
                <h2>${t.ctaTitle}</h2>
                <p>${t.ctaDesc}</p>
                <a href="${homeUrl}#tool" class="cta-btn">${t.ctaBtn}</a>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-links">
                <a href="${homeUrl}">${t.footerHome}</a>
                <a href="${blogUrl}">${t.footerBlog}</a>
                <a href="${privacyUrl}">${t.footerPrivacy}</a>
            </div>
            <p class="footer-copy">&copy; 2025 ${t.footerCopy}</p>
        </div>
    </footer>

    <div class="no-webgl-overlay" id="noWebglOverlay" style="display: none;">
        <div class="no-webgl-content">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h2>${t.noWebglTitle}</h2>
            <p>${t.noWebglDesc}</p>
        </div>
    </div>

    <script src="${cssPath}js/app.js" type="module"></script>
</body>
</html>`;

    fs.writeFileSync(outputFile, html, 'utf-8');
    console.log(`✅ Generated index.html for ${langInfo.name} (${langInfo.code})`);
}

console.log('\nDone!');
