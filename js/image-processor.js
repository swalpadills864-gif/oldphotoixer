// Image processor module
// Handles the actual image processing pipeline

export class ImageProcessor {
    constructor() {
        this.maxSize = 800;
    }

    async process(imageElement, progressCallback) {
        // Calculate dimensions
        let { width, height } = imageElement;

        // Scale down if too large
        if (width > this.maxSize || height > this.maxSize) {
            const ratio = Math.min(this.maxSize / width, this.maxSize / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw original
        ctx.drawImage(imageElement, 0, 0, width, height);

        if (progressCallback) progressCallback(30, 'Applying enhancements...');

        // Get image data
        const imageData = ctx.getImageData(0, 0, width, height);
        const enhanced = this.enhanceImageData(imageData);

        if (progressCallback) progressCallback(60, 'Finalizing...');

        // Put enhanced data
        ctx.putImageData(enhanced, 0, 0);

        // Convert to blob
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png', 1.0);
        });

        if (progressCallback) progressCallback(100, 'Complete!');

        return blob;
    }

    enhanceImageData(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;

        // First pass: contrast and saturation enhancement
        const contrast = 1.15;
        const saturation = 1.08;
        const tempData = new Uint8ClampedArray(data.length);

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // Apply contrast
            r = contrast * (r - 128) + 128;
            g = contrast * (g - 128) + 128;
            b = contrast * (b - 128) + 128;

            // Saturation
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            r = gray + saturation * (r - gray);
            g = gray + saturation * (g - gray);
            b = gray + saturation * (b - gray);

            tempData[i] = Math.max(0, Math.min(255, r));
            tempData[i + 1] = Math.max(0, Math.min(255, g));
            tempData[i + 2] = Math.max(0, Math.min(255, b));
            tempData[i + 3] = data[i + 3];
        }

        // Second pass: gentle noise reduction using 3x3 blur
        const smoothedData = new Uint8ClampedArray(tempData.length);
        const noiseReduction = 0.3;

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                const prevIdx = ((y - 1) * width + x) * 4;
                const nextIdx = ((y + 1) * width + x) * 4;
                const leftIdx = (y * width + (x - 1)) * 4;
                const rightIdx = (y * width + (x + 1)) * 4;

                for (let c = 0; c < 3; c++) {
                    // Average of neighbors for noise reduction
                    const avg = (tempData[prevIdx + c] + tempData[nextIdx + c] +
                               tempData[leftIdx + c] + tempData[rightIdx + c]) / 4;
                    // Blend with original to reduce noise while preserving detail
                    smoothedData[idx + c] = tempData[idx + c] * (1 - noiseReduction) + avg * noiseReduction;
                }
                smoothedData[idx + 3] = tempData[idx + 3];
            }
        }

        // Third pass: light sharpening
        const output = new ImageData(width, height);
        const outData = output.data;
        const sharpenAmount = 0.8;

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;

                for (let c = 0; c < 3; c++) {
                    const center = smoothedData[idx + c];
                    const top = smoothedData[((y - 1) * width + x) * 4 + c];
                    const bottom = smoothedData[((y + 1) * width + x) * 4 + c];
                    const left = smoothedData[(y * width + (x - 1)) * 4 + c];
                    const right = smoothedData[(y * width + (x + 1)) * 4 + c];

                    // Laplacian sharpening
                    const sharpened = center + sharpenAmount * (center * 4 - top - bottom - left - right);

                    outData[idx + c] = Math.max(0, Math.min(255, sharpened));
                }
                outData[idx + 3] = smoothedData[idx + 3];
            }
        }

        // Copy edge pixels unchanged
        for (let i = 0; i < width; i++) {
            const topIdx = i * 4;
            const bottomIdx = ((height - 1) * width + i) * 4;
            outData[topIdx] = smoothedData[topIdx];
            outData[topIdx + 1] = smoothedData[topIdx + 1];
            outData[topIdx + 2] = smoothedData[topIdx + 2];
            outData[topIdx + 3] = smoothedData[topIdx + 3];
            outData[bottomIdx] = smoothedData[bottomIdx];
            outData[bottomIdx + 1] = smoothedData[bottomIdx + 1];
            outData[bottomIdx + 2] = smoothedData[bottomIdx + 2];
            outData[bottomIdx + 3] = smoothedData[bottomIdx + 3];
        }
        for (let y = 0; y < height; y++) {
            const leftIdx = y * width * 4;
            const rightIdx = (y * width + width - 1) * 4;
            outData[leftIdx] = smoothedData[leftIdx];
            outData[leftIdx + 1] = smoothedData[leftIdx + 1];
            outData[leftIdx + 2] = smoothedData[leftIdx + 2];
            outData[leftIdx + 3] = smoothedData[leftIdx + 3];
            outData[rightIdx] = smoothedData[rightIdx];
            outData[rightIdx + 1] = smoothedData[rightIdx + 1];
            outData[rightIdx + 2] = smoothedData[rightIdx + 2];
            outData[rightIdx + 3] = smoothedData[rightIdx + 3];
        }

        return output;
    }
}