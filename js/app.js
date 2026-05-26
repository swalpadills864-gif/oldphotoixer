import * as ui from './ui.js';
import { initORT, loadModel, processImage, checkWebGLSupport } from './ort-setup.js';

class OldPhotoFixer {
    constructor() {
        this.originalFile = null;
        this.originalImage = null;
        this.processedBlob = null;
        this.isProcessing = false;

        this.init();
    }

    init() {
        // Check WebGL support
        if (!checkWebGLSupport()) {
            ui.showElement('#noWebglOverlay');
            return;
        }

        this.bindEvents();
        this.initORT();
    }

    bindEvents() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        const processBtn = document.getElementById('processBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const changePhotoBtn = document.getElementById('changePhotoBtn');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        // Upload zone events
        uploadZone.addEventListener('click', () => fileInput.click());
        uploadZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadZone.addEventListener('dragleave', () => this.handleDragLeave());
        uploadZone.addEventListener('drop', (e) => this.handleDrop(e));
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Process button
        processBtn.addEventListener('click', () => this.handleProcess());

        // Download button
        downloadBtn.addEventListener('click', () => this.handleDownload());

        // Change photo button
        changePhotoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        // Mobile menu
        mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());

        // Language dropdown
        const langBtn = document.getElementById('langBtn');
        const langDropdown = document.querySelector('.lang-dropdown');
        if (langBtn) {
            langBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropdown.classList.toggle('open');
            });
            document.addEventListener('click', () => {
                langDropdown.classList.remove('open');
            });
        }

        // Header scroll
        window.addEventListener('scroll', () => this.handleScroll());

        // Keyboard navigation for slider (global)
        document.addEventListener('keydown', (e) => {
            const resultContainer = document.getElementById('resultContainer');
            if (resultContainer.style.display !== 'none') {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const delta = e.key === 'ArrowLeft' ? -5 : 5;
                    const slider = document.getElementById('comparisonSlider');
                    const beforeImage = document.querySelector('.before-image');
                    if (!slider || !beforeImage) return;

                    const wrapper = slider.parentElement;
                    const rect = wrapper.getBoundingClientRect();
                    let currentX = parseFloat(slider.style.left) || 50;
                    currentX = Math.max(0, Math.min(currentX + delta, 100));
                    slider.style.left = `${currentX}%`;
                    beforeImage.style.clipPath = `inset(0 ${100 - currentX}% 0 0)`;
                }
            }
        });
    }

    async initORT() {
        try {
            await initORT();
        } catch (error) {
            ui.showError(error.message);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        ui.addClass('#uploadZone', 'dragging');
    }

    handleDragLeave() {
        ui.removeClass('#uploadZone', 'dragging');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        ui.removeClass('#uploadZone', 'dragging');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    async handleFile(file) {
        ui.clearError();

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            ui.showError('Please select a JPG, PNG, or WebP image.');
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            ui.showError('Image is too large. Please select an image under 10MB.');
            return;
        }

        // Warn for large files
        if (file.size > 5 * 1024 * 1024) {
            ui.showError('Large image may take longer to process. Consider using a smaller image for faster results.');
        }

        this.originalFile = file;

        try {
            this.originalImage = await ui.createImageFromFile(file);
            this.showPreview();
            ui.showElement('#processBtn');
            ui.enableElement('#processBtn');
            ui.setElementText('#processBtn .btn-text', 'Restore Photo');
        } catch (error) {
            ui.showError('Failed to load image. Please try again.');
            console.error(error);
        }
    }

    showPreview() {
        const uploadContent = document.getElementById('uploadContent');
        const previewContent = document.getElementById('previewContent');
        const previewImage = document.getElementById('previewImage');

        ui.hideElement(uploadContent);
        ui.showElement(previewContent);
        previewImage.src = this.originalImage.src;

        ui.removeClass('#uploadZone', 'error');
        ui.addClass('#uploadZone', 'success');
    }

    async handleProcess() {
        if (this.isProcessing || !this.originalImage) return;

        this.isProcessing = true;
        this.showLoadingOverlay('Loading AI Models...', 'This may take a few moments');

        try {
            // Load model
            await loadModel((percent, status) => {
                this.updateLoadingProgress(percent, status);
            });

            // Process image
            this.processedBlob = await processImage(this.originalImage, (percent, status) => {
                this.updateLoadingProgress(percent, status);
            });

            // Show result
            this.hideLoadingOverlay();
            this.showResult();
        } catch (error) {
            this.hideLoadingOverlay();
            ui.showError(error.message || 'Failed to process image. Please try again.');
            this.resetToReady();
        } finally {
            this.isProcessing = false;
        }
    }

    showLoadingOverlay(title, subtitle) {
        const overlay = document.getElementById('loadingOverlay');
        const titleEl = document.getElementById('loadingTitle');
        const subtitleEl = document.getElementById('loadingSubtitle');
        const barFill = document.getElementById('loadingBarFill');
        const percent = document.getElementById('loadingPercent');

        if (titleEl) titleEl.textContent = title;
        if (subtitleEl) subtitleEl.textContent = subtitle;
        if (barFill) barFill.style.width = '0%';
        if (percent) percent.textContent = '0%';

        if (overlay) {
            overlay.style.display = 'flex';
            // Trigger reflow for animation
            overlay.offsetHeight;
            overlay.classList.add('active');
        }
    }

    updateLoadingProgress(percent, status) {
        const barFill = document.getElementById('loadingBarFill');
        const percentEl = document.getElementById('loadingPercent');
        const titleEl = document.getElementById('loadingTitle');
        const subtitleEl = document.getElementById('loadingSubtitle');

        if (barFill) barFill.style.width = `${percent}%`;
        if (percentEl) percentEl.textContent = `${Math.round(percent)}%`;
        if (status) {
            if (titleEl) titleEl.textContent = status;
            if (subtitleEl) subtitleEl.textContent = `Processing... ${Math.round(percent)}%`;
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    showProcessingState() {
        const processBtn = document.getElementById('processBtn');
        const progressContainer = document.getElementById('progressContainer');
        const resultContainer = document.getElementById('resultContainer');

        ui.hideElement(resultContainer);
        ui.showElement(progressContainer);

        processBtn.classList.add('loading');
        processBtn.disabled = true;
        processBtn.querySelector('.btn-text').style.display = 'none';
        processBtn.querySelector('.btn-loading').style.display = 'flex';
        processBtn.querySelector('.loading-text').textContent = 'Processing...';
    }

    resetToReady() {
        const processBtn = document.getElementById('processBtn');
        const progressContainer = document.getElementById('progressContainer');

        ui.hideElement(progressContainer);
        this.hideLoadingOverlay();

        processBtn.classList.remove('loading');
        processBtn.disabled = false;
        processBtn.querySelector('.btn-text').style.display = '';
        processBtn.querySelector('.btn-loading').style.display = 'none';
        processBtn.querySelector('.loading-text').textContent = 'Loading Models...';
    }

    showResult() {
        const processBtn = document.getElementById('processBtn');
        const progressContainer = document.getElementById('progressContainer');
        const resultContainer = document.getElementById('resultContainer');
        const beforeImage = document.getElementById('beforeImage');
        const afterImage = document.getElementById('afterImage');

        // Set images
        beforeImage.src = this.originalImage.src;
        afterImage.src = URL.createObjectURL(this.processedBlob);

        // Show result container
        ui.hideElement(progressContainer);
        this.hideLoadingOverlay();
        ui.showElement(resultContainer);

        // Update button to show complete
        processBtn.classList.remove('loading');
        processBtn.classList.add('complete');
        processBtn.querySelector('.btn-text').textContent = 'Complete!';
        processBtn.querySelector('.btn-loading').style.display = 'none';

        // Hide process button after a moment
        setTimeout(() => {
            ui.hideElement(processBtn);
        }, 2000);
    }

    handleDownload() {
        if (!this.processedBlob || !this.originalFile) return;

        const filename = `restored_${this.originalFile.name.replace(/\.[^.]+$/, '')}.png`;
        ui.downloadBlob(this.processedBlob, filename);
    }

    toggleMobileMenu() {
        const mobileNav = document.getElementById('mobileNav');
        mobileNav.classList.toggle('open');
    }

    handleScroll() {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    new OldPhotoFixer();
});

// Slider functionality
function initSlider() {
    const slider = document.getElementById('comparisonSlider');
    const handle = document.getElementById('sliderHandle');
    const beforeImage = document.querySelector('.before-image');
    const wrapper = document.querySelector('.comparison-wrapper');

    if (!slider || !beforeImage || !wrapper) return;

    let isDragging = false;

    function updateSliderPosition(clientX) {
        const rect = wrapper.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const percent = (x / rect.width) * 100;

        slider.style.left = `${percent}%`;
        beforeImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    }

    handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        document.body.style.cursor = 'ew-resize';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSliderPosition(e.clientX);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.cursor = '';
    });

    // Touch support
    handle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updateSliderPosition(e.touches[0].clientX);
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Click to move slider
    wrapper.addEventListener('click', (e) => {
        if (e.target === handle || handle.contains(e.target)) return;
        updateSliderPosition(e.clientX);
    });
}