/**
 * Multilingual Blog Post Generator
 *
 * Generates static HTML blog posts from keywords using DeepSeek API
 * Generates content in all supported languages
 * Run: node scripts/generate-blog.js
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const KEYWORDS_FILE = path.join(__dirname, '../data/keywords.json');
const BLOG_DIR = path.join(__dirname, '..');
const TEMPLATE_FILE = path.join(__dirname, '../templates/blog-post.html');
const SITEMAP_FILE = path.join(__dirname, '..', 'sitemap.xml');
const POSTS_PER_RUN = 2;

const LANGUAGES = [
    { code: 'en', dir: '', name: 'English', nativeName: 'English' },
    { code: 'zh', dir: '/zh', name: 'Chinese (Simplified)', nativeName: '简体中文' },
    { code: 'ja', dir: '/ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', dir: '/ko', name: 'Korean', nativeName: '한국어' },
    { code: 'es', dir: '/es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', dir: '/fr', name: 'French', nativeName: 'Français' },
    { code: 'pt', dir: '/pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ar', dir: '/ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
    { code: 'de', dir: '/de', name: 'German', nativeName: 'Deutsch' },
    { code: 'ru', dir: '/ru', name: 'Russian', nativeName: 'Русский' }
];

/**
 * Call DeepSeek API
 */
async function callDeepSeek(prompt, lang = 'en') {
    if (!DEEPSEEK_API_KEY) {
        throw new Error('DEEPSEEK_API_KEY environment variable not set');
    }

    return new Promise((resolve, reject) => {
        const langNames = {
            'en': 'English',
            'zh': 'Chinese (Simplified)',
            'ja': 'Japanese',
            'ko': 'Korean',
            'es': 'Spanish',
            'fr': 'French',
            'pt': 'Portuguese',
            'ar': 'Arabic',
            'de': 'German',
            'ru': 'Russian'
        };

        const data = JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `You are a professional tech writer creating SEO-optimized blog posts about photo restoration and AI tools. Write engaging, informative content in ${langNames[lang] || 'English'} that is original and provides real value. Target 600-800 words. Use markdown formatting. Write the title and all content in ${langNames[lang] || 'English'}.`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2500
        });

        const options = {
            hostname: 'api.deepseek.com',
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (parsed.error) {
                        reject(new Error(parsed.error.message));
                    } else {
                        resolve(parsed.choices[0].message.content);
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse API response: ${body}`));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

/**
 * Convert keyword to URL slug
 */
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Format date for meta tags
 */
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Calculate reading time
 */
function calculateReadTime(text) {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate blog post content using DeepSeek for a specific language
 */
async function generatePostContent(keyword, lang) {
    const langInstructions = {
        'en': 'Write the entire post in English.',
        'zh': 'Write the entire post in Simplified Chinese. The title should also be in Chinese.',
        'ja': 'Write the entire post in Japanese. The title should also be in Japanese.',
        'ko': 'Write the entire post in Korean. The title should also be in Korean.',
        'es': 'Write the entire post in Spanish. The title should also be in Spanish.',
        'fr': 'Write the entire post in French. The title should also be in French.',
        'pt': 'Write the entire post in Portuguese. The title should also be in Portuguese.',
        'ar': 'Write the entire post in Arabic with RTL direction. The title should also be in Arabic.',
        'de': 'Write the entire post in German. The title should also be in German.',
        'ru': 'Write the entire post in Russian. The title should also be in Russian.'
    };

    const prompt = `${langInstructions[lang]}

Write an SEO-optimized blog post about "${keyword}". The post should:
1. Have a compelling title that includes the keyword naturally
2. Start with an engaging introduction (2-3 paragraphs)
3. Include practical tips or steps where relevant
4. Include at least 2 subheadings (H2)
5. End with a clear conclusion and call-to-action
6. Be 600-800 words
7. Be informative and valuable, not just keyword stuffing

Target keyword: ${keyword}`;

    const content = await callDeepSeek(prompt, lang);
    return content;
}

/**
 * Parse markdown to HTML (basic conversion)
 */
function markdownToHtml(markdown) {
    let html = markdown
        // Headers
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Lists
        .replace(/^\- (.+)$/gm, '<li>$1</li>')
        .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
        // Paragraphs (double newline)
        .replace(/\n\n/g, '</p><p>')
        // Line breaks
        .replace(/\n/g, '<br>');

    // Wrap list items
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

    // Wrap in paragraph
    html = `<p>${html}</p>`;

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p><br>/g, '<p>');
    html = html.replace(/<br><\/p>/g, '</p>');

    return html;
}

/**
 * Generate blog post HTML for a specific language
 */
async function generateBlogPost(keyword, langInfo) {
    // Read template
    let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

    // Generate content in target language
    const contentMarkdown = await generatePostContent(keyword, langInfo.code);

    // Extract title from first line (remove # and whitespace)
    const titleMatch = contentMarkdown.match(/^#\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : keyword;

    // Clean up content (remove the title line)
    const contentClean = contentMarkdown.replace(/^#\s*.+\n+/, '');

    // Convert to HTML
    const contentHtml = markdownToHtml(contentClean);

    // Generate meta
    const slug = slugify(keyword);
    const description = contentMarkdown.split('\n').slice(1, 3).join(' ').substring(0, 160);
    const date = new Date();
    const readTime = calculateReadTime(contentMarkdown);

    // Build paths
    const isDefaultLang = langInfo.code === 'en';
    const cssPath = isDefaultLang ? '' : '../';
    const homeUrl = isDefaultLang ? '/index.html' : `/${langInfo.code}/index.html`;
    const blogIndexUrl = isDefaultLang ? '/blog/index.html' : `/${langInfo.code}/blog/index.html`;
    const privacyUrl = isDefaultLang ? '/privacy.html' : `/${langInfo.code}/privacy.html`;
    const canonicalUrl = `https://oldphotoixer.ai-world.top${isDefaultLang ? '' : `/${langInfo.code}`}/blog/${slug}.html`;

    // Localized date format
    const localeMap = {
        'en': 'en-US',
        'zh': 'zh-CN',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'pt': 'pt-PT',
        'ar': 'ar-SA',
        'de': 'de-DE',
        'ru': 'ru-RU'
    };

    const formattedDate = date.toLocaleDateString(localeMap[langInfo.code] || 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Replace placeholders
    let html = template
        .replace(/\{\{title\}\}/g, title)
        .replace(/\{\{description\}\}/g, description.substring(0, 160))
        .replace(/\{\{keywords\}\}/g, keyword)
        .replace(/\{\{slug\}\}/g, slug)
        .replace(/\{\{content\}\}/g, contentHtml)
        .replace(/\{\{date\}\}/g, formatDate(date))
        .replace(/\{\{formattedDate\}\}/g, formattedDate)
        .replace(/\{\{readTime\}\}/g, readTime)
        .replace(/\{\{lang\}\}/g, langInfo.code)
        .replace(/\{\{dir\}\}/g, langInfo.rtl ? 'rtl' : 'ltr')
        .replace(/\{\{cssPath\}\}/g, cssPath)
        .replace(/\{\{homeUrl\}\}/g, homeUrl)
        .replace(/\{\{blogIndexUrl\}\}/g, blogIndexUrl)
        .replace(/\{\{privacyUrl\}\}/g, privacyUrl)
        .replace(/\{\{canonicalUrl\}\}/g, canonicalUrl);

    return { slug, html };
}

/**
 * Generate sitemap for all languages
 */
function generateSitemap(allPosts) {
    const today = new Date().toISOString().split('T')[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://oldphotoixer.ai-world.top/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
`;

    // Add main blog index
    sitemap += `  <url>
    <loc>https://oldphotoixer.ai-world.top/blog/index.html</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>
`;

    // Add language-specific blog indices
    for (const langInfo of LANGUAGES) {
        if (langInfo.code !== 'en') {
            sitemap += `  <url>
    <loc>https://oldphotoixer.ai-world.top/${langInfo.code}/blog/index.html</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>
`;
        }
    }

    // Add each post in each language
    for (const post of allPosts) {
        for (const langInfo of LANGUAGES) {
            const langPrefix = langInfo.code === 'en' ? '' : `/${langInfo.code}`;
            sitemap += `  <url>
    <loc>https://oldphotoixer.ai-world.top${langPrefix}/blog/${post.slug}.html</loc>
    <lastmod>${post.date}</lastmod>
    <priority>0.6</priority>
  </url>
`;
        }
    }

    sitemap += '</urlset>';
    return sitemap;
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * Extract title from blog post HTML
 */
function extractTitle(html) {
    const match = html.match(/<h1>(.*?)<\/h1>/);
    return match ? match[1] : '';
}

/**
 * Generate localized blog index page
 */
function generateBlogIndex(posts, langInfo) {
    const isDefaultLang = langInfo.code === 'en';
    const localeMap = {
        'en': 'en-US',
        'zh': 'zh-CN',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'pt': 'pt-PT',
        'ar': 'ar-SA',
        'de': 'de-DE',
        'ru': 'ru-RU'
    };

    const i18n = {
        'en': { title: 'Photo Restoration Blog', subtitle: 'Tips, tutorials, and guides about restoring old photos with AI', loading: 'Loading articles...', noPosts: 'No articles yet. Check back soon!', home: 'Home', blog: 'Blog', privacy: 'Privacy Policy', tool: 'Tool', features: 'Features' },
        'zh': { title: '照片修复博客', subtitle: '关于使用AI恢复老照片的技巧、教程和指南', loading: '正在加载文章...', noPosts: '暂无文章。敬请期待！', home: '首页', blog: '博客', privacy: '隐私政策', tool: '工具', features: '功能' },
        'ja': { title: '写真修復ブログ', subtitle: 'AIで古い写真を復元するためのヒント、チュートリアル、ガイド', loading: '記事を読み込み中...', noPosts: 'まだ記事がありません。しばらくお待ちください！', home: 'ホーム', blog: 'ブログ', privacy: 'プライバシー', tool: 'ツール', features: '機能' },
        'ko': { title: '사진 복원 블로그', subtitle: 'AI로 오래된 사진을 복원하는 방법에 대한 팁, 튜토리얼, 가이드', loading: '문서를 불러오는 중...', noPosts: '아직 문서가 없습니다. 곧 확인해 주세요!', home: '홈', blog: '블로그', privacy: '개인정보', tool: '도구', features: '기능' },
        'es': { title: 'Blog de Restauración de Fotos', subtitle: 'Consejos, tutoriales y guías sobre la restauración de fotos antiguas con IA', loading: 'Cargando artículos...', noPosts: 'Aún no hay artículos. ¡Vuelve pronto!', home: 'Inicio', blog: 'Blog', privacy: 'Privacidad', tool: 'Herramienta', features: 'Características' },
        'fr': { title: 'Blog de Restauration de Photos', subtitle: 'Conseils, tutoriels et guides sur la restauration de photos anciennes avec l\'IA', loading: 'Chargement des articles...', noPosts: 'Pas encore d\'articles. Revenez bientôt !', home: 'Accueil', blog: 'Blog', privacy: 'Confidentialité', tool: 'Outil', features: 'Fonctionnalités' },
        'pt': { title: 'Blog de Restauração de Fotos', subtitle: 'Dicas, tutoriais e guias sobre restauração de fotos antigas com IA', loading: 'Carregando artigos...', noPosts: 'Ainda não há artigos. Volte em breve!', home: 'Início', blog: 'Blog', privacy: 'Privacidade', tool: 'Ferramenta', features: 'Recursos' },
        'ar': { title: 'مدونة استعادة الصور', subtitle: 'نصائح وبرامج تعليمية وأدلة حول استعادة الصور القديمة باستخدام الذكاء الاصطناعي', loading: 'جارٍ تحميل المقالات...', noPosts: 'لا توجد مقالات بعد. ترجع لاحقاً!', home: 'الرئيسية', blog: 'المدونة', privacy: 'الخصوصية', tool: 'الأداة', features: 'الميزات' },
        'de': { title: 'Blog zur Fotorestaurierung', subtitle: 'Tipps, Tutorials und Anleitungen zur Restaurierung alter Fotos mit KI', loading: 'Artikel werden geladen...', noPosts: 'Noch keine Artikel. Schauen Sie bald wieder vorbei!', home: 'Startseite', blog: 'Blog', privacy: 'Datenschutz', tool: 'Werkzeug', features: 'Funktionen' },
        'ru': { title: 'Блог о восстановлении фотографий', subtitle: 'Советы, учебные пособия и руководства по восстановлению старых фотографий с помощью ИИ', loading: 'Загрузка статей...', noPosts: 'Пока нет статей. Загляните позже!', home: 'Главная', blog: 'Блог', privacy: 'Конфиденциальность', tool: 'Инструмент', features: 'Функции' }
    };

    const t = i18n[langInfo.code] || i18n['en'];
    const locale = localeMap[langInfo.code] || 'en-US';
    const cssPath = isDefaultLang ? '' : '../';
    const homeUrl = isDefaultLang ? '/index.html' : `/${langInfo.code}/index.html`;
    const blogIndexUrl = isDefaultLang ? '/blog/index.html' : `/${langInfo.code}/blog/index.html`;
    const privacyUrl = isDefaultLang ? '/privacy.html' : `/${langInfo.code}/privacy.html`;

    const postsHtml = posts.map(post => {
        const date = new Date(post.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
        const postUrl = isDefaultLang ? `/blog/${post.slug}.html` : `/${langInfo.code}/blog/${post.slug}.html`;
        return `<article class="blog-card">
                <h2><a href="${postUrl}">${post.title}</a></h2>
                <div class="blog-card-meta"><time>${date}</time></div>
            </article>`;
    }).join('');

    return `<!DOCTYPE html>
<html lang="${langInfo.code}"${langInfo.rtl ? ' dir="rtl"' : ''}>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title} - OldPhotoFixer</title>
    <meta name="description" content="${t.subtitle}">
    <link rel="canonical" href="https://oldphotoixer.ai-world.top${blogIndexUrl}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${cssPath}css/style.css">
</head>
<body>
    <header class="header" id="header">
        <div class="container header-inner">
            <a href="${homeUrl}" class="logo"><img src="../images/logo.svg" alt="OldPhotoFixer - Free AI Photo Restoration Tool" width="170" height="36" loading="lazy"></a>
            <nav class="nav">
                <a href="${homeUrl}" class="nav-link">${t.tool}</a>
                <a href="${blogIndexUrl}" class="nav-link active">${t.blog}</a>
                <a href="${homeUrl}#features" class="nav-link">${t.features}</a>
                <a href="${privacyUrl}" class="nav-link">${t.privacy}</a>
            </nav>
        </div>
    </header>
    <main class="blog-index">
        <div class="container">
            <header class="blog-header">
                <h1>${t.title}</h1>
                <p>${t.subtitle}</p>
            </header>
            <div class="blog-grid">${postsHtml || `<p class="no-posts">${t.noPosts}</p>`}</div>
        </div>
    </main>
    <footer class="footer">
        <div class="container">
            <div class="footer-links">
                <a href="${homeUrl}">${t.home}</a>
                <a href="${blogIndexUrl}">${t.blog}</a>
                <a href="${privacyUrl}">${t.privacy}</a>
            </div>
            <p class="footer-copy">&copy; 2025 OldPhotoFixer.</p>
        </div>
    </footer>
    <script src="${cssPath}js/header-scroll.js"></script>
    <style>
        .blog-index { padding: 120px 0 80px; }
        .blog-header { text-align: center; margin-bottom: 64px; }
        .blog-header h1 { font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 12px; }
        .blog-header p { font-size: 1.1rem; color: var(--gray-500); }
        .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 32px; }
        .blog-card { background: var(--white); padding: 32px; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); transition: transform var(--transition), box-shadow var(--transition); }
        .blog-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .blog-card h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 12px; }
        .blog-card h2 a { color: var(--primary); transition: color var(--transition); }
        .blog-card h2 a:hover { color: var(--accent); }
        .blog-card-meta { font-size: 0.85rem; color: var(--gray-400); }
        .no-posts { text-align: center; color: var(--gray-500); padding: 48px; }
        @media (max-width: 768px) {
            .blog-header h1 { font-size: 1.75rem; }
            .blog-grid { grid-template-columns: 1fr; }
        }
    </style>
</body>
</html>`;
}

/**
 * Main generation function
 */
async function main() {
    console.log('🚀 Starting multilingual blog generation...\n');

    // Check API key
    if (!DEEPSEEK_API_KEY) {
        console.error('❌ Error: DEEPSEEK_API_KEY environment variable not set');
        console.log('   Set it with: export DEEPSEEK_API_KEY=your_api_key');
        process.exit(1);
    }

    // Load keywords
    let keywords;
    try {
        keywords = JSON.parse(fs.readFileSync(KEYWORDS_FILE, 'utf-8'));
    } catch (e) {
        console.error('❌ Failed to load keywords:', e.message);
        process.exit(1);
    }

    // Find ungenerated keywords (check if ANY language version is missing)
    const keywordsToCheck = [];
    for (const keyword of keywords) {
        const slug = slugify(keyword);
        // Check if we need to generate ANY language version
        const needsGeneration = LANGUAGES.some(langInfo => {
            const blogDir = path.join(BLOG_DIR, langInfo.dir, 'blog');
            const outputFile = path.join(blogDir, `${slug}.html`);
            return !fs.existsSync(outputFile);
        });
        if (needsGeneration) {
            keywordsToCheck.push(keyword);
        }
    }

    if (keywordsToCheck.length === 0) {
        console.log('✅ All keywords already generated for all languages! No new posts to create.');
        console.log('   Add more keywords to data/keywords.json to generate more posts.');
        process.exit(0);
    }

    // Pick only POSTS_PER_RUN keywords
    const keywordsToGenerate = keywordsToCheck.slice(0, POSTS_PER_RUN);

    console.log(`📝 Found ${keywords.length} total keywords, ${keywordsToCheck.length} need generation`);
    console.log(`📝 Generating ${keywordsToGenerate.length} keywords × ${LANGUAGES.length} languages = ${keywordsToGenerate.length * LANGUAGES.length} posts\n`);

    let successCount = 0;
    let errorCount = 0;
    const allPosts = [];

    for (const keyword of keywordsToGenerate) {
        const slug = slugify(keyword);
        console.log(`\n${'═'.repeat(50)}`);
        console.log(`📝 Keyword: "${keyword}"`);
        console.log(`${'═'.repeat(50)}`);

        // Generate for each language
        for (const langInfo of LANGUAGES) {
            const outputDir = path.join(BLOG_DIR, langInfo.dir, 'blog');
            ensureDir(outputDir);
            const outputFile = path.join(outputDir, `${slug}.html`);

            // Skip if already exists
            if (fs.existsSync(outputFile)) {
                console.log(`⏭️  ${langInfo.code}: already exists, skipping`);
                continue;
            }

            try {
                console.log(`📄 ${langInfo.code} (${langInfo.nativeName}): generating...`);
                const { slug: postSlug, html } = await generateBlogPost(keyword, langInfo);

                fs.writeFileSync(outputFile, html, 'utf-8');
                successCount++;
                console.log(`✅ ${langInfo.code}: Saved ${postSlug}.html`);
            } catch (e) {
                errorCount++;
                console.error(`❌ ${langInfo.code}: Failed - ${e.message}`);
            }

            // Rate limit - wait between API calls
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Add to all posts
        allPosts.push({ slug, date: formatDate(new Date()) });
    }

    // Collect all existing posts for sitemap (with titles per language)
    const existingPosts = [];
    for (const langInfo of LANGUAGES) {
        const blogDir = path.join(BLOG_DIR, langInfo.dir, 'blog');
        if (fs.existsSync(blogDir)) {
            const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
            for (const f of files) {
                const slug = f.replace('.html', '');
                if (!existingPosts.find(p => p.slug === slug)) {
                    const stats = fs.statSync(path.join(blogDir, f));
                    // Try to extract title from the first available language version
                    let title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    for (const checkLang of LANGUAGES) {
                        const checkFile = path.join(BLOG_DIR, checkLang.dir, 'blog', f);
                        if (fs.existsSync(checkFile)) {
                            const content = fs.readFileSync(checkFile, 'utf-8');
                            const extracted = extractTitle(content);
                            if (extracted) {
                                title = extracted;
                                break;
                            }
                        }
                    }
                    existingPosts.push({ slug, date: formatDate(stats.mtime), title });
                }
            }
        }
    }

    // Merge all posts
    const allPostsMerged = [...existingPosts];
    for (const p of allPosts) {
        if (!allPostsMerged.find(e => e.slug === p.slug)) {
            allPostsMerged.push(p);
        }
    }

    // Generate localized blog index pages
    console.log('\n📝 Generating localized blog index pages...');
    for (const langInfo of LANGUAGES) {
        const blogDir = path.join(BLOG_DIR, langInfo.dir, 'blog');
        ensureDir(blogDir);
        const indexFile = path.join(blogDir, 'index.html');

        // Collect posts for this language with localized titles
        const langPosts = [];
        for (const post of allPostsMerged) {
            const postFile = path.join(blogDir, `${post.slug}.html`);
            let title = post.title;
            if (fs.existsSync(postFile)) {
                const content = fs.readFileSync(postFile, 'utf-8');
                const extracted = extractTitle(content);
                if (extracted) title = extracted;
            }
            langPosts.push({ slug: post.slug, date: post.date, title });
        }

        const indexHtml = generateBlogIndex(langPosts, langInfo);
        fs.writeFileSync(indexFile, indexHtml, 'utf-8');
        console.log(`✅ ${langInfo.code}: Generated blog index`);
    }

    // Update sitemap
    const sitemap = generateSitemap(allPostsMerged);
    fs.writeFileSync(SITEMAP_FILE, sitemap, 'utf-8');
    console.log('\n📍 Updated sitemap.xml');

    // Summary
    console.log('\n' + '═'.repeat(50));
    console.log('📊 Generation complete!');
    console.log(`   ✅ New posts: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📰 Total posts in sitemap: ${allPostsMerged.length}`);
    console.log('═'.repeat(50));

    // Git add hint
    if (successCount > 0) {
        console.log('\n📦 Run these commands to commit:');
        console.log('   git add blog/ sitemap.xml');
        console.log('   git commit -m "Add new blog posts"');
        console.log('   git push');
    }
}

main().catch(console.error);