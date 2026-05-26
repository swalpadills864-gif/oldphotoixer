/**
 * Generate localized privacy policy pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const LANGUAGES = [
    { code: 'en', dir: '', name: 'English' },
    { code: 'zh', dir: '/zh', name: 'Chinese' },
    { code: 'ja', dir: '/ja', name: 'Japanese' },
    { code: 'ko', dir: '/ko', name: 'Korean' },
    { code: 'es', dir: '/es', name: 'Spanish' },
    { code: 'fr', dir: '/fr', name: 'French' },
    { code: 'pt', dir: '/pt', name: 'Portuguese' },
    { code: 'ar', dir: '/ar', name: 'Arabic', rtl: true },
    { code: 'de', dir: '/de', name: 'German' },
    { code: 'ru', dir: '/ru', name: 'Russian' }
];

const i18n = {
    'en': {
        title: 'Privacy Policy',
        lastUpdated: 'Last updated: May 2025',
        h2Overview: 'Overview',
        pOverview: 'OldPhotoFixer is a privacy-first photo restoration tool. Your photos are processed entirely within your web browser using artificial intelligence, and <strong>never leave your device</strong>. We do not collect, store, upload, or transmit your photos to any server.',
        h2Data: 'Data Collection',
        pData: 'We collect minimal data to operate our website:',
        li1NoPhotos: '<strong>No photos</strong>: Your photos are processed locally in your browser and never sent to our servers.',
        li2NoPersonal: '<strong>No personal information</strong>: We do not require registration, email, or any personal information to use our tool.',
        li3NoCookies: '<strong>No cookies</strong>: We do not use tracking cookies or any similar technologies.',
        li4NoAnalytics: '<strong>No analytics</strong>: We do not use analytics services that track your browsing behavior.',
        h2Process: 'How We Process Photos',
        pProcess: 'When you use OldPhotoFixer:',
        liStep1: 'Your photo is loaded directly into your browser\'s memory',
        liStep2: 'Our AI model runs entirely within your browser to process the image',
        liStep3: 'The processed result is displayed on your screen',
        liStep4: 'You can download the result directly to your device',
        pNeverLeaves: 'At no point does your photo data leave your device.',
        h2ThirdParty: 'Third-Party Services',
        pThirdParty: 'We use the following third-party services:',
        liONNX: '<strong>ONNX Runtime Web</strong>: An open-source AI engine that runs in your browser to process images',
        liGoogleFonts: '<strong>Google Fonts</strong>: For typography on our website',
        liVercel: '<strong>Vercel</strong>: Our hosting provider for the website itself (static files only)',
        h2Children: 'Children\'s Privacy',
        pChildren: 'Our service is not directed to children under 13 years of age. We do not knowingly collect information from children under 13.',
        h2Changes: 'Changes to This Policy',
        pChanges: 'We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.',
        h2Contact: 'Contact Us',
        pContact: 'If you have any questions about this privacy policy, please contact us at:',
        email: 'Email:',
        navTool: 'Tool',
        navBlog: 'Blog',
        navFeatures: 'Features',
        navPrivacy: 'Privacy',
        footerHome: 'Home',
        footerBlog: 'Blog',
        footerPrivacy: 'Privacy Policy',
        footerCopy: 'All rights reserved.'
    },
    'zh': {
        title: '隐私政策',
        lastUpdated: '最后更新：2025年5月',
        h2Overview: '概述',
        pOverview: 'OldPhotoFixer 是一个注重隐私的照片修复工具。您的照片使用人工智能在 Web 浏览器中完全处理，<strong>永远不会离开您的设备</strong>。我们不会收集、存储、上传或传输您的照片到任何服务器。',
        h2Data: '数据收集',
        pData: '我们收集最少的数据来运营我们的网站：',
        li1NoPhotos: '<strong>无照片</strong>：您的照片在浏览器本地处理，永远不会发送到我们的服务器。',
        li2NoPersonal: '<strong>无个人信息</strong>：我们不需要注册、电子邮件或任何个人信息来使用我们的工具。',
        li3NoCookies: '<strong>无Cookie</strong>：我们不使用跟踪Cookie或任何类似技术。',
        li4NoAnalytics: '<strong>无分析</strong>：我们不使用跟踪您浏览行为的分析服务。',
        h2Process: '我们如何处理照片',
        pProcess: '当您使用 OldPhotoFixer 时：',
        liStep1: '您的照片直接加载到浏览器的内存中',
        liStep2: '我们的 AI 模型在您的浏览器内完全运行来处理图像',
        liStep3: '处理结果直接显示在您的屏幕上',
        liStep4: '您可以直接将结果下载到您的设备',
        pNeverLeaves: '您的照片数据绝不会离开您的设备。',
        h2ThirdParty: '第三方服务',
        pThirdParty: '我们使用以下第三方服务：',
        liONNX: '<strong>ONNX Runtime Web</strong>：一个开源 AI 引擎，在您的浏览器中运行以处理图像',
        liGoogleFonts: '<strong>Google Fonts</strong>：为我们网站提供排版支持',
        liVercel: '<strong>Vercel</strong>：我们网站的托管服务提供商（仅静态文件）',
        h2Children: '儿童隐私',
        pChildren: '我们的服务不面向13岁以下的儿童。我们不会故意收集13岁以下儿童的信息。',
        h2Changes: '政策变更',
        pChanges: '我们可能会不时更新此隐私政策。任何更改都将发布在此页面上，并更新修订日期。',
        h2Contact: '联系我们',
        pContact: '如果您对此隐私政策有任何疑问，请通过以下方式联系我们：',
        email: '电子邮件：',
        navTool: '工具',
        navBlog: '博客',
        navFeatures: '功能',
        navPrivacy: '隐私',
        footerHome: '首页',
        footerBlog: '博客',
        footerPrivacy: '隐私政策',
        footerCopy: '保留所有权利。'
    },
    'ja': {
        title: 'プライバシー方針',
        lastUpdated: '最終更新：2025年5月',
        h2Overview: '概要',
        pOverview: 'OldPhotoFixerは、プライバシーを優先する写真修復ツールです。写真は人工知能を使用してWebブラウザ内で完全に処理され、<strong>デバイスから決して離れませんでした</strong>。当社は写真を収集、保存、アップロード、またはサーバーに送信しません。',
        h2Data: 'データ収集',
        pData: '当社は、Webサイトを運営するために最小限のデータを収集します：',
        li1NoPhotos: '<strong>写真なし</strong>：写真はブラウザでローカルに処理され、当社のサーバーに送信されることはありません。',
        li2NoPersonal: '<strong>個人情報なし</strong>：当社のツールを使用するために登録、Eメール、または個人情報を必要としません。',
        li3NoCookies: '<strong>Cookieなし</strong>：当社はトラッキングCookieや同様の技術を使用しません。',
        li4NoAnalytics: '<strong>分析なし</strong>：当社はお客様の閲覧行動をトラッキングする分析サービスを使用しません。',
        h2Process: '写真の処理方法',
        pProcess: 'OldPhotoFixerを使用する場合：',
        liStep1: '写真はブラウザのメモリに直接ロードされます',
        liStep2: 'AIモデルは画像を処理するためにブラウザ内で完全に実行されます',
        liStep3: '処理結果は画面に表示されます',
        liStep4: '結果をデバイスに直接ダウンロードできます',
        pNeverLeaves: '写真データがデバイスから離れることは決してありません。',
        h2ThirdParty: 'サードパーティサービス',
        pThirdParty: '当社は次のサードパーティサービスを使用しています：',
        liONNX: '<strong>ONNX Runtime Web</strong>：画像処理のためにブラウザ内で実行されるオープンソースAIエンジン',
        liGoogleFonts: '<strong>Google Fonts</strong>：Webサイトのタイポグラフィ用',
        liVercel: '<strong>Vercel</strong>：Webサイトのホスティングプロバイダー（静的ファイルのみ）',
        h2Children: '子供のプライバシー',
        pChildren: '当社のサービスは13歳未満の子供を対象としていません。当社は13歳未満の子供から情報を意図的に収集しません。',
        h2Changes: 'この方針の変更',
        pChanges: '当社はこのプライバシー方針を時折更新することがあります。変更は更新された改訂日と共にこのページに表示されます。',
        h2Contact: 'お問い合わせ',
        pContact: 'このプライバシー方針についてご質問がある場合は、以下まで联系我们：',
        email: 'メール：',
        navTool: 'ツール',
        navBlog: 'ブログ',
        navFeatures: '機能',
        navPrivacy: 'プライバシー',
        footerHome: 'ホーム',
        footerBlog: 'ブログ',
        footerPrivacy: 'プライバシー方針',
        footerCopy: '全著作権所有。'
    },
    'ko': {
        title: '개인정보 처리방침',
        lastUpdated: '최종 업데이트: 2025년 5월',
        h2Overview: '개요',
        pOverview: 'OldPhotoFixer는 개인정보 보호를 우선시하는 사진 복원 도구입니다. 사진은 인공지능을 사용하여 웹 브라우저 내에서 완전히 처리되며 <strong>절대로 기기를 떠나지 않습니다</strong>. 당사는 사진을 수집, 저장, 업로드 또는 서버로 전송하지 않습니다.',
        h2Data: '데이터 수집',
        pData: '당사는 웹사이트 운영을 위해 최소한의 데이터를 수집합니다:',
        li1NoPhotos: '<strong>사진 없음</strong>: 사진은 브라우저에서 로컬로 처리되어 당사 서버로 전송되지 않습니다.',
        li2NoPersonal: '<strong>개인정보 없음</strong>: 당사 도구를 사용하기 위해 등록, 이메일 또는 개인정보가 필요하지 않습니다.',
        li3NoCookies: '<strong>쿠키 없음</strong>: 당사는 추적 쿠키 또는 유사한 기술을 사용하지 않습니다.',
        li4NoAnalytics: '<strong>분석 없음</strong>: 당사는 고객님의浏览 행동을 추적하는 분석 서비스를 사용하지 않습니다.',
        h2Process: '사진 처리 방법',
        pProcess: 'OldPhotoFixer를 사용할 때:',
        liStep1: '사진이 브라우저 메모리로 직접 로드됩니다',
        liStep2: 'AI 모델이 이미지를 처리하기 위해 브라우저 내에서 완전히 실행됩니다',
        liStep3: '처리된 결과가 화면에 표시됩니다',
        liStep4: '결과를 기기로 직접 다운로드할 수 있습니다',
        pNeverLeaves: '사진 데이터가 기기를 떠나지 않습니다.',
        h2ThirdParty: '타사 서비스',
        pThirdParty: '당사는 다음 타사 서비스를 사용합니다:',
        liONNX: '<strong>ONNX Runtime Web</strong>: 이미지 처리를 위해 브라우저에서 실행되는 오픈소스 AI 엔진',
        liGoogleFonts: '<strong>Google Fonts</strong>: 웹사이트의 타이포그래피용',
        liVercel: '<strong>Vercel</strong>: 웹사이트용 호스팅 제공업체 (정적 파일만)',
        h2Children: '어린이 개인정보',
        pChildren: '당사 서비스는 13세 미만의 어린이를 대상으로 하지 않습니다. 당사는 의도적으로 13세 미만의 어린の方から 정보를 수집하지 않습니다.',
        h2Changes: '이方针의 변경',
        pChanges: '당사는 이 개인정보 처리방침을 수시로 업데이트할 수 있습니다. 변경사항은 업데이트된 개정일과 함께 이 페이지에 게시됩니다.',
        h2Contact: '문의하기',
        pContact: '이 개인정보 처리방침에 대한 질문이 있으시면 다음으로 문의하세요:',
        email: '이메일:',
        navTool: '도구',
        navBlog: '블로그',
        navFeatures: '기능',
        navPrivacy: '개인정보',
        footerHome: '홈',
        footerBlog: '블로그',
        footerPrivacy: '개인정보 처리방침',
        footerCopy: '전 저작권 소유.'
    },
    'es': {
        title: 'Política de Privacidad',
        lastUpdated: 'Última actualización: Mayo 2025',
        h2Overview: 'Resumen',
        pOverview: 'OldPhotoFixer es una herramienta de restauración de fotos con enfoque en la privacidad. Tus fotos se procesan completamente dentro de tu navegador web usando inteligencia artificial y <strong>nunca salen de tu dispositivo</strong>. No recopilamos, almacenamos, cargamos ni transmitimos tus fotos a ningún servidor.',
        h2Data: 'Recopilación de Datos',
        pData: 'Recopilamos datos mínimos para operar nuestro sitio web:',
        li1NoPhotos: '<strong>Sin fotos</strong>: Tus fotos se procesan localmente en tu navegador y nunca se envían a nuestros servidores.',
        li2NoPersonal: '<strong>Sin información personal</strong>: No requerimos registro, correo electrónico ni ninguna información personal para usar nuestra herramienta.',
        li3NoCookies: '<strong>Sin cookies</strong>: No utilizamos cookies de seguimiento ni tecnologías similares.',
        li4NoAnalytics: '<strong>Sin análisis</strong>: No utilizamos servicios de análisis que rastreen tu comportamiento de navegación.',
        h2Process: 'Cómo Procesamos las Fotos',
        pProcess: 'Cuando usas OldPhotoFixer:',
        liStep1: 'Tu foto se carga directamente en la memoria de tu navegador',
        liStep2: 'Nuestro modelo de IA se ejecuta completamente dentro de tu navegador para procesar la imagen',
        liStep3: 'El resultado procesado se muestra en tu pantalla',
        liStep4: 'Puedes descargar el resultado directamente a tu dispositivo',
        pNeverLeaves: 'En ningún momento los datos de tu foto salen de tu dispositivo.',
        h2ThirdParty: 'Servicios de Terceros',
        pThirdParty: 'Utilizamos los siguientes servicios de terceros:',
        liONNX: '<strong>ONNX Runtime Web</strong>: Un motor de IA de código abierto que se ejecuta en tu navegador para procesar imágenes',
        liGoogleFonts: '<strong>Google Fonts</strong>: Para la tipografía de nuestro sitio web',
        liVercel: '<strong>Vercel</strong>: Nuestro proveedor de alojamiento para el sitio web (solo archivos estáticos)',
        h2Children: 'Privacidad de los Niños',
        pChildren: 'Nuestro servicio no está dirigido a niños menores de 13 años. No recopilamos deliberadamente información de niños menores de 13 años.',
        h2Changes: 'Cambios en Esta Política',
        pChanges: 'Podemos actualizar esta política de privacidad de vez en cuando. Cualquier cambio se publicará en esta página con una fecha de revisión actualizada.',
        h2Contact: 'Contáctenos',
        pContact: 'Si tienes alguna pregunta sobre esta política de privacidad, contáctanos en:',
        email: 'Correo electrónico:',
        navTool: 'Herramienta',
        navBlog: 'Blog',
        navFeatures: 'Características',
        navPrivacy: 'Privacidad',
        footerHome: 'Inicio',
        footerBlog: 'Blog',
        footerPrivacy: 'Política de Privacidad',
        footerCopy: 'Todos los derechos reservados.'
    },
    'fr': {
        title: 'Politique de Confidentialité',
        lastUpdated: 'Dernière mise à jour : Mai 2025',
        h2Overview: 'Vue d\'Ensemble',
        pOverview: 'OldPhotoFixer est un outil de restauration de photos axé sur la confidentialité. Vos photos sont traitées entièrement dans votre navigateur Web à l\'aide de l\'intelligence artificielle et <strong>ne quittent jamais votre appareil</strong>. Nous ne collectons, ne stockons, n\'envoyons ni ne transmettons vos photos vers aucun serveur.',
        h2Data: 'Collecte de Données',
        pData: 'Nous collectons un minimum de données pour faire fonctionner notre site Web :',
        li1NoPhotos: '<strong>Aucune photo</strong> : Vos photos sont traitées localement dans votre navigateur et ne sont jamais envoyées à nos serveurs.',
        li2NoPersonal: '<strong>Aucune information personnelle</strong> : Nous ne Requireons aucune inscription, adresse e-mail ou information personnelle pour utiliser notre outil.',
        li3NoCookies: '<strong>Aucun cookie</strong> : Nous n\'utilisons pas de cookies de suivi ni de technologies similaires.',
        li4NoAnalytics: '<strong>Aucune analyse</strong> : Nous n\'utilisons pas de services d\'analyse qui suivent votre comportement de navigation.',
        h2Process: 'Comment Nous Traitons les Photos',
        pProcess: 'Lorsque vous utilisez OldPhotoFixer :',
        liStep1: 'Votre photo est chargée directement dans la mémoire de votre navigateur',
        liStep2: 'Notre modèle d\'IA s\'exécute entièrement dans votre navigateur pour traiter l\'image',
        liStep3: 'Le résultat traité est affiché sur votre écran',
        liStep4: 'Vous pouvez télécharger le résultat directement sur votre appareil',
        pNeverLeaves: 'À aucun moment vos données photo ne quittent votre appareil.',
        h2ThirdParty: 'Services Tiers',
        pThirdParty: 'Nous utilisons les services tiers suivants :',
        liONNX: '<strong>ONNX Runtime Web</strong> : Un moteur d\'IA open source qui s\'exécute dans votre navigateur pour traiter les images',
        liGoogleFonts: '<strong>Google Fonts</strong> : Pour la typographie de notre site Web',
        liVercel: '<strong>Vercel</strong> : Notre hébergeur pour le site Web (fichiers statiques uniquement)',
        h2Children: 'Confidentialité des Enfants',
        pChildren: 'Notre service n\'est pas destiné aux enfants de moins de 13 ans. Nous ne collectons pas sciemment d\'informations auprès d\'enfants de moins de 13 ans.',
        h2Changes: 'Modifications de Cette Politique',
        pChanges: 'Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Toute modification sera publiée sur cette page avec une date de révision mise à jour.',
        h2Contact: 'Contactez-nous',
        pContact: 'Si vous avez des questions concernant cette politique de confidentialité, Veuillez nous contacter à :',
        email: 'E-mail :',
        navTool: 'Outil',
        navBlog: 'Blog',
        navFeatures: 'Fonctionnalités',
        navPrivacy: 'Confidentialité',
        footerHome: 'Accueil',
        footerBlog: 'Blog',
        footerPrivacy: 'Politique de Confidentialité',
        footerCopy: 'Tous droits réservés.'
    },
    'pt': {
        title: 'Política de Privacidade',
        lastUpdated: 'Última atualização: Maio 2025',
        h2Overview: 'Visão Geral',
        pOverview: 'OldPhotoFixer é uma ferramenta de restauração de fotos com foco em privacidade. Suas fotos são processadas inteiramente dentro do seu navegador web usando inteligência artificial e <strong>nunca saem do seu dispositivo</strong>. Não coletamos, armazenamos, enviamos ou transmitimos suas fotos para nenhum servidor.',
        h2Data: 'Coleta de Dados',
        pData: 'Coletamos dados mínimos para operar nosso site:',
        li1NoPhotos: '<strong>Sem fotos</strong>: Suas fotos são processadas localmente no seu navegador e nunca são enviadas para nossos servidores.',
        li2NoPersonal: '<strong>Sem informações pessoais</strong>: Não requeremos registro, e-mail ou qualquer informação pessoal para usar nossa ferramenta.',
        li3NoCookies: '<strong>Sem cookies</strong>: Não usamos cookies de rastreamento ou tecnologias semelhantes.',
        li4NoAnalytics: '<strong>Sem análise</strong>: Não usamos serviços de análise que rastreiam seu comportamento de navegação.',
        h2Process: 'Como Processamos as Fotos',
        pProcess: 'Quando você usa o OldPhotoFixer:',
        liStep1: 'Sua foto é carregada diretamente na memória do seu navegador',
        liStep2: 'Nosso modelo de IA é executado inteiramente dentro do seu navegador para processar a imagem',
        liStep3: 'O resultado processado é exibido na sua tela',
        liStep4: 'Você pode baixar o resultado diretamente para o seu dispositivo',
        pNeverLeaves: 'Em nenhum momento os dados da sua foto saem do seu dispositivo.',
        h2ThirdParty: 'Serviços de Terceiros',
        pThirdParty: 'Usamos os seguintes serviços de terceiros:',
        liONNX: '<strong>ONNX Runtime Web</strong>: Um mecanismo de IA de código aberto que é executado no seu navegador para processar imagens',
        liGoogleFonts: '<strong>Google Fonts</strong>: Para tipografia do nosso site',
        liVercel: '<strong>Vercel</strong>: Nosso provedor de hospedagem para o site (apenas arquivos estáticos)',
        h2Children: 'Privacidade das Crianças',
        pChildren: 'Nosso serviço não é direcionado a crianças menores de 13 anos. Não coletamos intencionalmente informações de crianças menores de 13 anos.',
        h2Changes: 'Mudanças nesta Política',
        pChanges: 'Podemos atualizar esta política de privacidade de tempos em tempos. Quaisquer mudanças serão publicadas nesta página com uma data de revisão atualizada.',
        h2Contact: 'Contate-nos',
        pContact: 'Se você tiver alguma dúvida sobre esta política de privacidade, entre em contato conosco em:',
        email: 'E-mail:',
        navTool: 'Ferramenta',
        navBlog: 'Blog',
        navFeatures: 'Recursos',
        navPrivacy: 'Privacidade',
        footerHome: 'Início',
        footerBlog: 'Blog',
        footerPrivacy: 'Política de Privacidade',
        footerCopy: 'Todos os direitos reservados.'
    },
    'ar': {
        title: 'سياسة الخصوصية',
        lastUpdated: 'آخر تحديث: مايو 2025',
        h2Overview: 'نظرة عامة',
        pOverview: 'OldPhotoFixer هو أداة لاستعادة الصور تركز على الخصوصية. تتم معالجة صورك بالكامل داخل متصفح الويب باستخدام الذكاء الاصطناعي و<strong>لا تغادر جهازك أبداً</strong>. لا نجمع أو نخزن أو نرفع أو ننقل صورك إلى أي خادم.',
        h2Data: 'جمع البيانات',
        pData: 'نجمع الحد الأدنى من البيانات لتشغيل موقعنا:',
        li1NoPhotos: '<strong>لا صور</strong>: تتم معالجة صورك محلياً في متصفحك ولا تُرسل أبداً إلى خوادمنا.',
        li2NoPersonal: '<strong>لا معلومات شخصية</strong>: لا نطلب تسجيلاً أو بريداً إلكترونياً أو أي معلومات شخصية لاستخدام أدواتنا.',
        li3NoCookies: '<strong>لا ملفات تعريف الارتباط</strong>: لا نستخدم ملفات تعريف الارتباط للتتبع أو أي تقنيات مماثلة.',
        li4NoAnalytics: '<strong>لا تحليلات</strong>: لا نستخدم خدمات تحليل تتعقب سلوك تصفحك.',
        h2Process: 'كيف نعالج الصور',
        pProcess: 'عند استخدام OldPhotoFixer:',
        liStep1: 'يتم تحميل صورتك مباشرة في ذاكرة متصفحك',
        liStep2: 'يتم تشغيل نموذج الذكاء الاصطناعي الخاص بنا بالكامل داخل متصفحك لمعالجة الصورة',
        liStep3: 'يتم عرض النتيجة المعالجة على شاشتك',
        liStep4: 'يمكنك تنزيل النتيجة مباشرة على جهازك',
        pNeverLeaves: 'في أي لحظة لا تغادر بيانات صورتك جهازك.',
        h2ThirdParty: 'خدمات الطرف الثالث',
        pThirdParty: 'نستخدم خدمات الطرف الثالث التالية:',
        liONNX: '<strong>ONNX Runtime Web</strong>: محرك ذكاء اصطناعي مفتوح المصدر يعمل في متصفحك لمعالجة الصور',
        liGoogleFonts: '<strong>Google Fonts</strong>: للطباعة على موقعنا',
        liVercel: '<strong>Vercel</strong>: مزود الاستضافة لموقعنا (ملفات ثابتة فقط)',
        h2Children: 'خصوصية الأطفال',
        pChildren: 'خدماتنا ليست موجهة للأطفال دون سن 13 عاماً. لا نجمع عن قصد معلومات من الأطفال دون سن 13.',
        h2Changes: 'التغييرات في هذه السياسة',
        pChanges: 'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة مع تاريخ مراجعة محدث.',
        h2Contact: 'اتصل بنا',
        pContact: 'إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على:',
        email: 'البريد الإلكتروني:',
        navTool: 'الأداة',
        navBlog: 'المدونة',
        navFeatures: 'الميزات',
        navPrivacy: 'الخصوصية',
        footerHome: 'الرئيسية',
        footerBlog: 'المدونة',
        footerPrivacy: 'سياسة الخصوصية',
        footerCopy: 'جميع الحقوق محفوظة.'
    },
    'de': {
        title: 'Datenschutzrichtlinie',
        lastUpdated: 'Zuletzt aktualisiert: Mai 2025',
        h2Overview: 'Übersicht',
        pOverview: 'OldPhotoFixer ist ein Datenschutz-fokussiertes Foto-Restaurierungstool. Ihre Fotos werden vollständig in Ihrem Webbrowser mit künstlicher Intelligenz verarbeitet und <strong>verlassen Ihr Gerät niemals</strong>. Wir sammeln, speichern, laden keine Fotos hoch und übertragen sie nicht an any Server.',
        h2Data: 'Datensammlung',
        pData: 'Wir sammeln minimale Daten, um unsere Website zu betreiben:',
        li1NoPhotos: '<strong>Keine Fotos</strong>: Ihre Fotos werden lokal in Ihrem Browser verarbeitet und niemals an unsere Server gesendet.',
        li2NoPersonal: '<strong>Keine personenbezogenen Daten</strong>: Wir erfordern keine Registrierung, E-Mail oder personenbezogene Daten, um unser Tool zu nutzen.',
        li3NoCookies: '<strong>Keine Cookies</strong>: Wir verwenden keine Tracking-Cookies oder ähnliche Technologien.',
        li4NoAnalytics: '<strong>Keine Analysen</strong>: Wir verwenden keine Analysedienste, die Ihr Surfverhalten verfolgen.',
        h2Process: 'Wie Wir Fotos Verarbeiten',
        pProcess: 'Wenn Sie OldPhotoFixer verwenden:',
        liStep1: 'Ihr Foto wird direkt in den Speicher Ihres Browsers geladen',
        liStep2: 'Unser KI-Modell läuft vollständig in Ihrem Browser, um das Bild zu verarbeiten',
        liStep3: 'Das verarbeitete Ergebnis wird auf Ihrem Bildschirm angezeigt',
        liStep4: 'Sie können das Ergebnis direkt auf Ihr Gerät herunterladen',
        pNeverLeaves: 'Zu keiner Zeit verlassen Ihre Fotodaten Ihr Gerät.',
        h2ThirdParty: 'Drittanbieterdienste',
        pThirdParty: 'Wir verwenden die folgenden Drittanbieterdienste:',
        liONNX: '<strong>ONNX Runtime Web</strong>: Eine Open-Source-KI-Engine, die in Ihrem Browser läuft, um Bilder zu verarbeiten',
        liGoogleFonts: '<strong>Google Fonts</strong>: Für die Typografie unserer Website',
        liVercel: '<strong>Vercel</strong>: Unser Hosting-Anbieter für die Website selbst (nur statische Dateien)',
        h2Children: 'Kinderprivacy',
        pChildren: 'Unser Service richtet sich nicht an Kinder unter 13 Jahren. Wir sammeln wissentlich keine Informationen von Kindern unter 13 Jahren.',
        h2Changes: 'Änderungen Dieser Richtlinie',
        pChanges: 'Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Alle Änderungen werden auf dieser Seite mit einem aktualisierten Überarbeitungsdatum veröffentlicht.',
        h2Contact: 'Kontaktieren Sie Uns',
        pContact: 'Wenn Sie Fragen zu dieser Datenschutzrichtlinie haben, kontaktieren Sie uns bitte unter:',
        email: 'E-Mail:',
        navTool: 'Werkzeug',
        navBlog: 'Blog',
        navFeatures: 'Funktionen',
        navPrivacy: 'Datenschutz',
        footerHome: 'Startseite',
        footerBlog: 'Blog',
        footerPrivacy: 'Datenschutzrichtlinie',
        footerCopy: 'Alle Rechte vorbehalten.'
    },
    'ru': {
        title: 'Политика Конфиденциальности',
        lastUpdated: 'Последнее обновление: Май 2025',
        h2Overview: 'Обзор',
        pOverview: 'OldPhotoFixer — это инструмент для восстановления фотографий, ориентированный на конфиденциальность. Ваши фотографии обрабатываются полностью в вашем веб-браузере с помощью искусственного интеллекта и <strong>никогда не покидают ваше устройство</strong>. Мы не собираем, не храним, не загружаем и не передаём ваши фотографии на какой-либо сервер.',
        h2Data: 'Сбор Данных',
        pData: 'Мы собираем минимальные данные для работы нашего веб-сайта:',
        li1NoPhotos: '<strong>Без фотографий</strong>: Ваши фотографии обрабатываются локально в вашем браузере и никогда не отправляются на наши серверы.',
        li2NoPersonal: '<strong>Без персональной информации</strong>: Нам не требуется регистрация, адрес электронной почты или какая-либо персональная информация для использования нашего инструмента.',
        li3NoCookies: '<strong>Без cookies</strong>: Мы не используем файлы cookies для отслеживания или подобные технологии.',
        li4NoAnalytics: '<strong>Без аналитики</strong>: Мы не используем аналитические сервисы, которые отслеживают ваше поведение при просмотре.',
        h2Process: 'Как Мы Обрабатываем Фотографии',
        pProcess: 'При использовании OldPhotoFixer:',
        liStep1: 'Ваша фотография загружается непосредственно в память вашего браузера',
        liStep2: 'Наша модель ИИ полностью работает в вашем браузере для обработки изображения',
        liStep3: 'Обработанный результат отображается на вашем экране',
        liStep4: 'Вы можете скачать результат прямо на своё устройство',
        pNeverLeaves: 'Ни в какой момент данные вашей фотографии не покидают ваше устройство.',
        h2ThirdParty: 'Сторонние Сервисы',
        pThirdParty: 'Мы используем следующие сторонние сервисы:',
        liONNX: '<strong>ONNX Runtime Web</strong>: Движок ИИ с открытым исходным кодом, который работает в вашем браузере для обработки изображений',
        liGoogleFonts: '<strong>Google Fonts</strong>: Для типографики нашего веб-сайта',
        liVercel: '<strong>Vercel</strong>: Наш хостинг-провайдер для самого веб-сайта (только статические файлы)',
        h2Children: 'Конфиденциальность Детей',
        pChildren: 'Наш сервис не предназначен для детей младше 13 лет. Мы сознательно не собираем информацию от детей младше 13 лет.',
        h2Changes: 'Изменения в Этой Политике',
        pChanges: 'Мы можем время от времени обновлять эту политику конфиденциальности. Любые изменения будут опубликованы на этой странице с обновлённой датой редакции.',
        h2Contact: 'Свяжитесь с Нами',
        pContact: 'Если у вас есть какие-либо вопросы об этой политике конфиденциальности, пожалуйста, свяжитесь с нами:',
        email: 'Электронная почта:',
        navTool: 'Инструмент',
        navBlog: 'Блог',
        navFeatures: 'Функции',
        navPrivacy: 'Конфиденциальность',
        footerHome: 'Главная',
        footerBlog: 'Блог',
        footerPrivacy: 'Политика Конфиденциальности',
        footerCopy: 'Все права защищены.'
    }
};

function generatePrivacyPage(lang) {
    const t = i18n[lang];
    const isDefaultLang = lang === 'en';
    const cssPath = isDefaultLang ? '' : '../';
    const homeUrl = isDefaultLang ? '/index.html' : `/${lang}/index.html`;
    const blogUrl = isDefaultLang ? '/blog/index.html' : `/${lang}/blog/index.html`;
    const privacyUrl = isDefaultLang ? '/privacy.html' : `/${lang}/privacy.html`;

    return `<!DOCTYPE html>
<html lang="${lang}"${lang === 'ar' ? ' dir="rtl"' : ''}>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title} - OldPhotoFixer</title>
    <meta name="description" content="${t.pOverview.replace(/<[^>]*>/g, '').substring(0, 160)}">
    <link rel="canonical" href="https://oldphotoixer.ai-world.top${privacyUrl}">
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
                <a href="${homeUrl}" class="nav-link">${t.navTool}</a>
                <a href="${blogUrl}" class="nav-link">${t.navBlog}</a>
                <a href="${homeUrl}#features" class="nav-link">${t.navFeatures}</a>
                <a href="${privacyUrl}" class="nav-link active">${t.navPrivacy}</a>
            </nav>
        </div>
    </header>

    <main class="privacy-page">
        <div class="container">
            <h1>${t.title}</h1>
            <p class="last-updated">${t.lastUpdated}</p>

            <section>
                <h2>${t.h2Overview}</h2>
                <p>${t.pOverview}</p>
            </section>

            <section>
                <h2>${t.h2Data}</h2>
                <p>${t.pData}</p>
                <ul>
                    <li>${t.li1NoPhotos}</li>
                    <li>${t.li2NoPersonal}</li>
                    <li>${t.li3NoCookies}</li>
                    <li>${t.li4NoAnalytics}</li>
                </ul>
            </section>

            <section>
                <h2>${t.h2Process}</h2>
                <p>${t.pProcess}</p>
                <ol>
                    <li>${t.liStep1}</li>
                    <li>${t.liStep2}</li>
                    <li>${t.liStep3}</li>
                    <li>${t.liStep4}</li>
                </ol>
                <p>${t.pNeverLeaves}</p>
            </section>

            <section>
                <h2>${t.h2ThirdParty}</h2>
                <p>${t.pThirdParty}</p>
                <ul>
                    <li>${t.liONNX}</li>
                    <li>${t.liGoogleFonts}</li>
                    <li>${t.liVercel}</li>
                </ul>
            </section>

            <section>
                <h2>${t.h2Children}</h2>
                <p>${t.pChildren}</p>
            </section>

            <section>
                <h2>${t.h2Changes}</h2>
                <p>${t.pChanges}</p>
            </section>

            <section>
                <h2>${t.h2Contact}</h2>
                <p>${t.pContact}</p>
                <p><strong>${t.email}</strong> privacy@oldphotoixer.ai-world.top</p>
            </section>
        </div>
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

    <script src="${cssPath}js/header-scroll.js"></script>
</body>
</html>`;
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Generate privacy pages for all languages
console.log('Generating localized privacy pages...\n');

for (const langInfo of LANGUAGES) {
    const outputDir = path.join(ROOT_DIR, langInfo.dir);
    ensureDir(outputDir);
    const outputFile = path.join(outputDir, 'privacy.html');
    const html = generatePrivacyPage(langInfo.code);
    fs.writeFileSync(outputFile, html, 'utf-8');
    console.log(`✅ Generated privacy.html for ${langInfo.name} (${langInfo.code})`);
}

console.log('\nDone!');
