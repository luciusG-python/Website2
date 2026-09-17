(function () {
    if (window.__stashrnodeProtectInstalled) {
        return;
    }
    window.__stashrnodeProtectInstalled = true;

    // Block the context menu only when it targets an image, so normal
    // right-click behaviour (text selection, devtools, custom menus) is kept.
    document.addEventListener('contextmenu', function (e) {
        var t = e.target;
        var isImage = t && (t.tagName === 'IMG' ||
            (t.tagName === 'DIV' && t.style && t.style.backgroundImage) ||
            t.closest && t.closest('img, [style*="background-image"], picture, figure'));
        if (isImage) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    // Stop image dragging (the ghost-drag that lets you drop an image out).
    document.addEventListener('dragstart', function (e) {
        var t = e.target;
        if (t && (t.tagName === 'IMG' || (t.closest && t.closest('a img')))) {
            e.preventDefault();
            return false;
        }
    }, true);

    // Mobile: stop the long-press "Save image" callout and tap-to-copy.
    var style = document.createElement('style');
    style.textContent = [
        'img, picture, figure, svg,',
        '[style*="background-image"] {',
        '  -webkit-touch-callout: none;',
        '  -webkit-user-select: none;',
        '  -khtml-user-select: none;',
        '  -moz-user-select: none;',
        '  user-select: none;',
        '}'
    ].join('');
    document.addEventListener('DOMContentLoaded', function () {
        document.head.appendChild(style);
    });
    if (document.head) {
        document.head.appendChild(style);
    }
})();
