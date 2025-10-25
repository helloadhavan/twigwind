const highlightAll = (stylesheet_path="hljs_styles/defalt.css") => {
    const codeBlocks = document.querySelectorAll('pre code');
    if (codeBlocks.length === 0) return; // No code blocks, skip

    // 1. Load CSS theme dynamically
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = stylesheet_path;
    document.head.appendChild(link);

    // 2. Collect unique languages from code blocks
    const languages = new Set();
    codeBlocks.forEach(block => {
        const classes = block.className.split(/\s+/);
        classes.forEach(cls => {
            if (cls.startsWith('language-')) {
                languages.add(cls.replace('language-', '').toLowerCase());
            }
        });
    });

    if (languages.size === 0) {
        // No language classes, fallback to auto-detect
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js";
        script.onload = () => {
            if (typeof hljs !== 'undefined') {
                hljs.highlightAll();
            }
        };
        script.onerror = () => {
            console.warn('Failed to load Highlight.js core');
        };
        document.head.appendChild(script);
        return;
    }

    // 3. Load Highlight.js core first
    const coreScript = document.createElement('script');
    coreScript.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js";
    coreScript.onload = () => {
        // 4. Dynamically load each required language
        const promises = Array.from(languages).map(lang => {
            return new Promise((resolve, reject) => {
                const langScript = document.createElement('script');
                langScript.src = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/languages/${lang}.min.js`;
                langScript.onload = resolve;
                langScript.onerror = () => {
                    console.warn(`Failed to load Highlight.js language: ${lang}`);
                    resolve(); // resolve anyway to continue
                };
                document.head.appendChild(langScript);
            });
        });

        // 5. Once all languages are loaded, highlight code
        Promise.all(promises).then(() => {
            if (typeof hljs !== 'undefined') {
                hljs.highlightAll();
            }
        }).catch(error => {
            console.warn('Error loading language modules:', error);
            // Fallback to basic highlighting
            if (typeof hljs !== 'undefined') {
                hljs.highlightAll();
            }
        });
    };
    coreScript.onerror = () => {
        console.warn('Failed to load Highlight.js core script');
    };
    document.head.appendChild(coreScript);
}