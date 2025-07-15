(function () {
    let scrollStep = 0.5;
    let intervalTime = 10;
    let direction = 1;
    let scrollDuration = 27500;
    let scrolling = true;
    let currentInterval = null;
    let resumeTimeout = null;
    let currentScrollableElement = null;
    let scrollableElements = [];
    let currentElementIndex = 0;

    function isScrollable(element) {
        if (!element || element === document.documentElement) return false;
        
        const style = window.getComputedStyle(element);
        const overflowY = style.overflowY;
        const overflowX = style.overflowX;
        
        const hasScrollableOverflow = overflowY === 'scroll' || overflowY === 'auto' || 
                                    overflowX === 'scroll' || overflowX === 'auto';
        
        const hasVerticalScroll = element.scrollHeight > element.clientHeight;
        const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
        
        return hasScrollableOverflow && (hasVerticalScroll || hasHorizontalScroll);
    }

    function findScrollableElements() {
        const elements = [];
        
        if (document.documentElement.scrollHeight > window.innerHeight ||
            document.documentElement.scrollWidth > window.innerWidth) {
            elements.push({
                element: window,
                type: 'window',
                name: 'Main Page'
            });
        }

        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (isScrollable(el)) {
                let name = el.id || el.className || el.tagName.toLowerCase();
                if (name.length > 50) name = name.substring(0, 50) + '...';
                
                elements.push({
                    element: el,
                    type: 'element',
                    name: name
                });
            }
        });

        return elements;
    }

    function scrollElement(elementObj, step, dir) {
        if (elementObj.type === 'window') {
            window.scrollBy(0, step * dir);
        } else {
            elementObj.element.scrollTop += step * dir;
        }
    }

    function canScroll(elementObj, dir) {
        if (elementObj.type === 'window') {
            const atTop = window.pageYOffset <= 0;
            const atBottom = window.pageYOffset >= document.documentElement.scrollHeight - window.innerHeight;
            return dir > 0 ? !atBottom : !atTop;
        } else {
            const el = elementObj.element;
            const atTop = el.scrollTop <= 0;
            const atBottom = el.scrollTop >= el.scrollHeight - el.clientHeight;
            return dir > 0 ? !atBottom : !atTop;
        }
    }

    function switchToNextElement() {
        if (scrollableElements.length === 0) return false;
        
        currentElementIndex = (currentElementIndex + 1) % scrollableElements.length;
        currentScrollableElement = scrollableElements[currentElementIndex];
        
        console.log(`Switching to scroll element: ${currentScrollableElement.name}`);
        
        if (currentScrollableElement.type === 'element') {
            const el = currentScrollableElement.element;
            const originalOutline = el.style.outline;
            el.style.outline = '2px solid red';
            setTimeout(() => {
                el.style.outline = originalOutline;
            }, 1000);
        }
        
        return true;
    }

    function scrollCycle() {
        if (!scrolling) return;
        
        scrollableElements = findScrollableElements();
        
        if (scrollableElements.length === 0) {
            console.log("No scrollable elements found on this page.");
            return;
        }

        if (!currentScrollableElement || currentElementIndex >= scrollableElements.length) {
            currentElementIndex = 0;
            currentScrollableElement = scrollableElements[0];
            console.log(`Starting scroll on: ${currentScrollableElement.name}`);
        }

        const startTime = Date.now();
        currentInterval = setInterval(() => {
            if (!scrolling) return;
            
            const elapsed = Date.now() - startTime;
            
            if (!canScroll(currentScrollableElement, direction)) {
                direction *= -1;
                if (!canScroll(currentScrollableElement, direction)) {
                    if (switchToNextElement()) {
                        direction = 1;
                    }
                }
            }
            
            if (currentScrollableElement && canScroll(currentScrollableElement, direction)) {
                scrollElement(currentScrollableElement, scrollStep, direction);
            }
            
            if (elapsed >= scrollDuration) {
                clearInterval(currentInterval);
                direction *= -1;
                
                if (direction === 1) {
                    if (Math.random() > 0.7 && scrollableElements.length > 1) {
                        switchToNextElement();
                    }
                }
                
                scrollCycle();
            }
        }, intervalTime);
    }

    function stopScrolling() {
        scrolling = false;
        if (currentInterval) clearInterval(currentInterval);
        console.log("Scrolling stopped.");
        
        if (resumeTimeout) clearTimeout(resumeTimeout);
        
        resumeTimeout = setTimeout(() => {
            scrolling = true;
            console.log("Resuming scrolling after 15 seconds of inactivity.");
            
            scrollableElements = findScrollableElements();
            console.log(`Found ${scrollableElements.length} scrollable elements.`);
            
            scrollCycle();
        }, 15000);
    }

    function forceQuit() {
        scrolling = false;
        if (currentInterval) clearInterval(currentInterval);
        if (resumeTimeout) clearTimeout(resumeTimeout);
        
        document.removeEventListener('click', stopScrolling);
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('wheel', stopScrolling);
        
        console.log("Auto-scroll script force quit and completely stopped.");
    }

    function handleKeydown(event) {
        if (event.altKey && event.code === 'KeyA') {
            event.preventDefault();
            forceQuit();
            return;
        }
        
        stopScrolling();
    }

    document.addEventListener('click', stopScrolling);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('wheel', stopScrolling);

    console.log("Enhanced auto-scroll script initialized.");
    scrollableElements = findScrollableElements();
    console.log(`Found ${scrollableElements.length} scrollable elements:`, 
                scrollableElements.map(el => el.name));
    
    scrollCycle();
})();