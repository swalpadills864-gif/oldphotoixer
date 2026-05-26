// UI helper functions

export function showElement(el) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }
    if (el) el.style.display = '';
}

export function hideElement(el) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }
    if (el) el.style.display = 'none';
}

export function setElementText(el, text) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }
    if (el) el.textContent = text;
}

export function addClass(el, className) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }
    if (el) el.classList.add(className);
}

export function removeClass(el, className) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }
    if (el) el.classList.remove(className);
}

export function setProgress(percent) {
    const fill = document.getElementById('progressFill');
    const percentText = document.getElementById('progressPercent');
    if (fill) fill.style.width = `${percent}%`;
    if (percentText) percentText.textContent = `${Math.round(percent)}%`;
}

export function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    const uploadZone = document.getElementById('uploadZone');
    if (errorEl) {
        errorEl.textContent = message;
        showElement(errorEl);
    }
    if (uploadZone) {
        addClass(uploadZone, 'error');
    }
}

export function clearError() {
    const errorEl = document.getElementById('errorMessage');
    const uploadZone = document.getElementById('uploadZone');
    if (errorEl) hideElement(errorEl);
    if (uploadZone) removeClass(uploadZone, 'error');
}

export function createImageFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function fileToBlob(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Blob([reader.result], { type: file.type }));
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function disableElement(el) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }
    if (el) el.disabled = true;
}

export function enableElement(el) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }
    if (el) el.disabled = false;
}