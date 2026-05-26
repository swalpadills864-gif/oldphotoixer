// Canvas 2D Photo Enhancement - Denoise + Sharpen Pipeline

export function checkWebGLSupport() {
    return true;
}

export async function initORT() {
    return true;
}

export async function loadModel() {
    return true;
}

export async function processImage(imageElement, progressCallback) {
    if (progressCallback) progressCallback(10, 'Initializing...');
    await new Promise(r => setTimeout(r, 30));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let { width, height } = imageElement;

    const maxSize = 2048;
    if (width > maxSize || height > maxSize) {
        const s = maxSize / Math.max(width, height);
        width = Math.round(width * s);
        height = Math.round(height * s);
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imageElement, 0, 0, width, height);

    if (progressCallback) progressCallback(20, 'Processing...');

    let imageData = ctx.getImageData(0, 0, width, height);

    // Step 1: Stronger bilateral-like smoothing to reduce grain (but preserve edges)
    if (progressCallback) progressCallback(30, 'Reducing grain...');
    imageData = bilateralSmooth(imageData, 5, 25);

    // Step 2: Sharpen with stronger kernel
    if (progressCallback) progressCallback(55, 'Sharpening...');
    imageData = unsharpMask(imageData, 1.8, 1, 0);

    // Step 3: Light contrast enhancement
    if (progressCallback) progressCallback(80, 'Enhancing contrast...');
    imageData = contrastBoost(imageData, 1.12);

    // Step 4: Final subtle sharpen
    if (progressCallback) progressCallback(90, 'Finalizing...');
    imageData = unsharpMask(imageData, 1.3, 1, 0);

    ctx.putImageData(imageData, 0, 0);

    const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png', 1.0);
    });

    if (progressCallback) progressCallback(100, 'Complete!');
    return blob;
}

// Bilateral filter approximation - edge-preserving smoothing
// Reduces grain while keeping edges sharp
function bilateralSmooth(imageData, kernelSize, sigma) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new Uint8ClampedArray(data.length);
    const half = Math.floor(kernelSize / 2);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;

            // Sample center pixel
            const centerR = data[idx];
            const centerG = data[idx + 1];
            const centerB = data[idx + 2];

            let sumR = 0, sumG = 0, sumB = 0;
            let weightSum = 0;

            for (let ky = -half; ky <= half; ky++) {
                for (let kx = -half; kx <= half; kx++) {
                    const px = Math.min(width - 1, Math.max(0, x + kx));
                    const py = Math.min(height - 1, Math.max(0, y + ky));
                    const pidx = (py * width + px) * 4;

                    const diffR = centerR - data[pidx];
                    const diffG = centerG - data[pidx + 1];
                    const diffB = centerB - data[pidx + 2];

                    // Spatial weight (Gaussian)
                    const spatialWeight = Math.exp(-(kx * kx + ky * ky) / (2 * sigma * sigma));

                    // Range weight (based on color difference)
                    const colorDiff = diffR * diffR + diffG * diffG + diffB * diffB;
                    const rangeWeight = Math.exp(-colorDiff / (2 * sigma * sigma * 20));

                    const weight = spatialWeight * rangeWeight;

                    sumR += data[pidx] * weight;
                    sumG += data[pidx + 1] * weight;
                    sumB += data[pidx + 2] * weight;
                    weightSum += weight;
                }
            }

            output[idx] = Math.round(sumR / weightSum);
            output[idx + 1] = Math.round(sumG / weightSum);
            output[idx + 2] = Math.round(sumB / weightSum);
            output[idx + 3] = data[idx + 3];
        }
    }

    return new ImageData(output, width, height);
}

// Unsharp mask - proper PS-style sharpening
// amount: strength (1.0-2.5), radius: edge width, threshold: minimum contrast
function unsharpMask(imageData, amount = 1.5, radius = 1, threshold = 0) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Create blurred version (the "unsharp" mask)
    const blurred = gaussianBlur(imageData, radius * 2);

    const output = new Uint8ClampedArray(data.length);

    for (let i = 0; i < data.length; i += 4) {
        const idx = i;

        // Calculate difference (edge detail)
        const diffR = data[idx] - blurred.data[idx];
        const diffG = data[idx + 1] - blurred.data[idx + 1];
        const diffB = data[idx + 2] - blurred.data[idx + 2];

        // Calculate magnitude
        const mag = Math.sqrt(diffR * diffR + diffG * diffG + diffB * diffB);

        // Apply only if above threshold
        if (mag > threshold) {
            output[idx] = Math.max(0, Math.min(255, data[idx] + diffR * amount));
            output[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + diffG * amount));
            output[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + diffB * amount));
        } else {
            output[idx] = data[idx];
            output[idx + 1] = data[idx + 1];
            output[idx + 2] = data[idx + 2];
        }
        output[idx + 3] = data[idx + 3];
    }

    return new ImageData(output, width, height);
}

// Simple Gaussian blur
function gaussianBlur(imageData, sigma) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const size = Math.ceil(sigma * 3) * 2 + 1;
    const half = Math.floor(size / 2);

    // Generate Gaussian kernel
    const kernel = [];
    let sum = 0;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = x - half;
            const dy = y - half;
            const value = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
            kernel.push(value);
            sum += value;
        }
    }
    for (let i = 0; i < kernel.length; i++) {
        kernel[i] /= sum;
    }

    const output = new Uint8ClampedArray(data.length);
    const kSize = Math.sqrt(kernel.length);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0;

            for (let ky = 0; ky < kSize; ky++) {
                for (let kx = 0; kx < kSize; kx++) {
                    const px = Math.min(width - 1, Math.max(0, x + kx - half));
                    const py = Math.min(height - 1, Math.max(0, y + ky - half));
                    const pidx = (py * width + px) * 4;
                    const kidx = ky * kSize + kx;
                    const k = kernel[kidx];

                    r += data[pidx] * k;
                    g += data[pidx + 1] * k;
                    b += data[pidx + 2] * k;
                }
            }

            const idx = (y * width + x) * 4;
            output[idx] = Math.round(r);
            output[idx + 1] = Math.round(g);
            output[idx + 2] = Math.round(b);
            output[idx + 3] = data[idx + 3];
        }
    }

    return new ImageData(output, width, height);
}

// Contrast boost
function contrastBoost(imageData, factor) {
    const data = imageData.data;
    const output = new Uint8ClampedArray(data.length);

    for (let i = 0; i < data.length; i += 4) {
        let r = factor * (data[i] - 128) + 128;
        let g = factor * (data[i + 1] - 128) + 128;
        let b = factor * (data[i + 2] - 128) + 128;

        output[i] = Math.max(0, Math.min(255, r));
        output[i + 1] = Math.max(0, Math.min(255, g));
        output[i + 2] = Math.max(0, Math.min(255, b));
        output[i + 3] = data[i + 3];
    }

    return new ImageData(output, imageData.width, imageData.height);
}