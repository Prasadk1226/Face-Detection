document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        textInput: document.getElementById('text-input'),
        fontSelect: document.getElementById('font-select'),
        sizeSlider: document.getElementById('size-slider'),
        sizeValue: document.getElementById('size-value'),
        colorPicker: document.getElementById('color-picker'),
        opacitySlider: document.getElementById('opacity-slider'),
        opacityValue: document.getElementById('opacity-value'),
        glowStyle: document.getElementById('glow-style'),
        glowSlider: document.getElementById('glow-slider'),
        glowValue: document.getElementById('glow-value'),
        blurSlider: document.getElementById('blur-slider'),
        blurValue: document.getElementById('blur-value'),
        animationSelect: document.getElementById('animation-select'),
        animationSpeed: document.getElementById('animation-speed'),
        speedValue: document.getElementById('speed-value'),
        bgSelect: document.getElementById('bg-select'),
        bgColor: document.getElementById('bg-color'),
        neonPreview: document.getElementById('neon-preview'),
        previewContainer: document.getElementById('preview-container'),
        copyCssBtn: document.getElementById('copy-css'),
        downloadPngBtn: document.getElementById('download-png'),
        downloadSvgBtn: document.getElementById('download-svg'),
        cssCode: document.getElementById('css-code')
    };

    // Initialize with animations ready
    document.body.style.opacity = 1;
    elements.neonPreview.style.setProperty('--text-animation', 'none');
    
    // Add animation class immediately
    setTimeout(() => {
        const animation = elements.animationSelect.value;
        if (animation !== 'none') {
            elements.neonPreview.classList.add(animation);
            elements.neonPreview.style.setProperty(
                '--animation-speed', 
                elements.animationSpeed.value + 's'
            );
        }
        document.body.classList.add('animations-ready');
    }, 10);

    // Initialize
    updatePreview();
    setupEventListeners();

    function setupEventListeners() {
        // Add input event listeners to all controls
        Object.values(elements).forEach(el => {
            if (el && el.addEventListener) {
                el.addEventListener('input', updatePreview);
                el.addEventListener('change', updatePreview);
            }
        });

        // Special handling for background color
        elements.bgSelect.addEventListener('change', function() {
            elements.bgColor.style.display = this.value === 'custom' ? 'block' : 'none';
            updatePreview();
        });

        // Animation speed special handling
        elements.animationSpeed.addEventListener('input', function() {
            if (elements.animationSelect.value !== 'none') {
                elements.neonPreview.style.setProperty(
                    '--animation-speed', 
                    this.value + 's'
                );
            }
            updatePreview();
        });

        // Animation select special handling
        elements.animationSelect.addEventListener('change', function() {
            elements.neonPreview.className = 'neon-text';
            if (this.value !== 'none') {
                elements.neonPreview.classList.add(this.value);
                elements.neonPreview.style.setProperty(
                    '--animation-speed', 
                    elements.animationSpeed.value + 's'
                );
            }
            updatePreview();
        });

        // Copy CSS button
        elements.copyCssBtn.addEventListener('click', copyCssToClipboard);

        // Download buttons
        elements.downloadPngBtn.addEventListener('click', downloadAsPng);
        elements.downloadSvgBtn.addEventListener('click', downloadAsSvg);
    }

    function updatePreview() {
        // Get all current values
        const settings = {
            text: elements.textInput.value || 'NEON',
            font: elements.fontSelect.value,
            size: `${elements.sizeSlider.value}px`,
            color: elements.colorPicker.value,
            opacity: elements.opacitySlider.value,
            glowStyle: elements.glowStyle.value,
            glowIntensity: elements.glowSlider.value,
            blurAmount: `${elements.blurSlider.value}px`,
            animation: elements.animationSelect.value,
            animationSpeed: elements.animationSpeed.value,
            background: elements.bgSelect.value,
            bgColor: elements.bgColor.value
        };

        // Update display values
        elements.sizeValue.textContent = settings.size;
        elements.glowValue.textContent = settings.glowIntensity;
        elements.blurValue.textContent = settings.blurAmount;
        elements.opacityValue.textContent = `${settings.opacity}%`;
        elements.speedValue.textContent = settings.animationSpeed;

        // Apply styles to preview
        applyNeonEffect(settings);
        updateCssCode(settings);
    }

    function applyNeonEffect(settings) {
        const { neonPreview, previewContainer } = elements;
        const colorWithOpacity = `${settings.color}${Math.round(settings.opacity * 2.55).toString(16).padStart(2, '0')}`;
        
        // Apply basic styles
        neonPreview.textContent = settings.text;
        neonPreview.style.fontFamily = settings.font;
        neonPreview.style.fontSize = settings.size;
        neonPreview.style.color = settings.color;
        neonPreview.style.opacity = `${settings.opacity}%`;

        // Apply glow effect based on selected style
        let textShadow;
        switch(settings.glowStyle) {
            case 'double':
                textShadow = `
                    0 0 ${settings.blurAmount} ${colorWithOpacity},
                    0 0 ${parseInt(settings.blurAmount) * 2}px ${colorWithOpacity},
                    0 0 ${settings.glowIntensity}px ${settings.color},
                    0 0 ${parseInt(settings.glowIntensity) * 2}px ${settings.color}80
                `;
                break;
            case 'outer':
                textShadow = `
                    0 0 ${settings.glowIntensity}px ${settings.color}00,
                    0 0 ${settings.glowIntensity * 2}px ${settings.color}40,
                    0 0 ${settings.glowIntensity * 3}px ${settings.color}80
                `;
                break;
            case 'retro':
                textShadow = `
                    0 0 ${settings.blurAmount} ${settings.color},
                    0 0 ${settings.blurAmount} ${settings.color},
                    0 0 ${settings.blurAmount} ${settings.color},
                    0 0 ${settings.glowIntensity}px ${settings.color}80,
                    0 0 ${settings.glowIntensity * 1.5}px ${settings.color}40
                `;
                break;
            default: // classic
                textShadow = `
                    0 0 ${settings.glowIntensity}px ${colorWithOpacity},
                    0 0 ${settings.blurAmount} ${colorWithOpacity},
                    0 0 ${parseInt(settings.blurAmount) * 1.5}px ${colorWithOpacity}
                `;
        }
        neonPreview.style.textShadow = textShadow;

        // Apply background
        previewContainer.className = 'preview-container';
        if (settings.background === 'gradient') {
            previewContainer.style.background = 'linear-gradient(135deg, #ff00ff 0%, #00bfff 100%)';
        } else if (settings.background === 'custom') {
            previewContainer.style.backgroundColor = settings.bgColor;
        } else if (settings.background === 'darker') {
            previewContainer.style.backgroundColor = 'var(--darker-bg)';
        } else {
            previewContainer.style.backgroundColor = 'var(--bg-color)';
        }
    }

    function updateCssCode(settings) {
        let css = `.neon-text {\n`;
        css += `    font-family: ${settings.font};\n`;
        css += `    font-size: ${settings.size};\n`;
        css += `    color: ${settings.color};\n`;
        css += `    opacity: ${settings.opacity}%;\n`;
        
        // Generate text-shadow based on glow style
        let textShadow;
        switch(settings.glowStyle) {
            case 'double':
                textShadow = `0 0 ${settings.blurAmount} ${settings.color},\n`;
                textShadow += `    0 0 ${parseInt(settings.blurAmount) * 2}px ${settings.color},\n`;
                textShadow += `    0 0 ${settings.glowIntensity}px ${settings.color},\n`;
                textShadow += `    0 0 ${parseInt(settings.glowIntensity) * 2}px ${settings.color}80`;
                break;
            case 'outer':
                textShadow = `0 0 ${settings.glowIntensity}px ${settings.color}00,\n`;
                textShadow += `    0 0 ${settings.glowIntensity * 2}px ${settings.color}40,\n`;
                textShadow += `    0 0 ${settings.glowIntensity * 3}px ${settings.color}80`;
                break;
            case 'retro':
                textShadow = `0 0 ${settings.blurAmount} ${settings.color},\n`;
                textShadow += `    0 0 ${settings.blurAmount} ${settings.color},\n`;
                textShadow += `    0 0 ${settings.blurAmount} ${settings.color},\n`;
                textShadow += `    0 0 ${settings.glowIntensity}px ${settings.color}80,\n`;
                textShadow += `    0 0 ${settings.glowIntensity * 1.5}px ${settings.color}40`;
                break;
            default: // classic
                textShadow = `0 0 ${settings.glowIntensity}px ${settings.color},\n`;
                textShadow += `    0 0 ${settings.blurAmount} ${settings.color},\n`;
                textShadow += `    0 0 ${parseInt(settings.blurAmount) * 1.5}px ${settings.color}`;
        }
        css += `    text-shadow: ${textShadow};\n`;
        
        // Add animation if selected
        if (settings.animation !== 'none') {
            css += `    animation: ${settings.animation}-animation ${settings.animationSpeed}s infinite alternate;\n`;
        }
        
        css += `}`;
        
        elements.cssCode.value = css;
    }

    function copyCssToClipboard() {
        elements.cssCode.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = elements.copyCssBtn.textContent;
        elements.copyCssBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            elements.copyCssBtn.textContent = originalText;
        }, 2000);
    }

    async function downloadAsPng() {
        // Create a canvas with higher resolution
        const canvas = document.createElement('canvas');
        const scale = 4; // Scale factor for higher resolution
        canvas.width = elements.previewContainer.offsetWidth * scale;
        canvas.height = elements.previewContainer.offsetHeight * scale;
        const context = canvas.getContext('2d');
        
        // Draw background
        if (elements.bgSelect.value === 'custom') {
            context.fillStyle = elements.bgColor.value;
        } else if (elements.bgSelect.value === 'gradient') {
            const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#ff00ff');
            gradient.addColorStop(1, '#00bfff');
            context.fillStyle = gradient;
        } else if (elements.bgSelect.value === 'darker') {
            context.fillStyle = '#0a0a0a';
        } else {
            context.fillStyle = '#1a1a1a';
        }
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Apply text styles
        context.font = `${parseInt(elements.sizeSlider.value) * scale}px ${elements.fontSelect.value}`;
        context.fillStyle = elements.colorPicker.value;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Apply glow effect (multiple layers for better quality)
        const glowColor = elements.colorPicker.value;
        const blurAmount = parseInt(elements.blurSlider.value) * scale;
        const glowIntensity = parseInt(elements.glowSlider.value) * scale;
        
        // Draw glow layers
        for (let i = 0; i < 8; i++) {
            context.shadowColor = glowColor;
            context.shadowBlur = blurAmount + (i * 5);
            context.fillText(
                elements.textInput.value || 'NEON',
                canvas.width / 2,
                canvas.height / 2
            );
        }
        
        // Draw main text
        context.shadowColor = 'transparent';
        context.fillText(
            elements.textInput.value || 'NEON',
            canvas.width / 2,
            canvas.height / 2
        );
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'neon-text.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function downloadAsSvg() {
        const settings = {
            text: elements.textInput.value || 'NEON',
            font: elements.fontSelect.value,
            size: elements.sizeSlider.value,
            color: elements.colorPicker.value,
            opacity: elements.opacitySlider.value,
            glowIntensity: elements.glowSlider.value,
            blurAmount: elements.blurSlider.value
        };

        // Create SVG markup
        const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="400" viewBox="0 0 1000 400">
    <rect width="100%" height="100%" fill="${elements.bgSelect.value === 'custom' ? elements.bgColor.value : '#1a1a1a'}"/>
    <text x="50%" y="50%" 
          font-family="${settings.font}" 
          font-size="${settings.size}" 
          fill="${settings.color}" 
          opacity="${settings.opacity}%" 
          text-anchor="middle" 
          dominant-baseline="middle"
          filter="url(#neon-glow)">
        ${settings.text}
    </text>
    <filter id="neon-glow">
        <feGaussianBlur stdDeviation="${settings.blurAmount}" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
</svg>`.trim();

        // Create download link
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'neon-text.svg';
        link.href = url;
        link.click();
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
});