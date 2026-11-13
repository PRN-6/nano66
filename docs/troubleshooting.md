# Troubleshooting & FAQ

### 1. Canvas overlay blocks clicking on underlying elements
**Solution:** Nano66 overlay canvas automatically sets `pointer-events: none !important;`. If you inject custom CSS on the canvas, ensure `pointer-events: none` is preserved so all clicks pass directly through to your website's DOM.

---

### 2. Cross-origin images (CORS) are not emitting colored particles
**Explanation:** If an `<img>` points to a third-party domain that does not supply `Access-Control-Allow-Origin: *`, HTML5 Canvas security prevents pixel reading via `getImageData()`.
**Solution:** Nano66 automatically catches `SecurityError` and falls back to generating a geometric silhouette border and grid outline so the animation continues without interruption. To enable full color pixel sampling, configure CORS headers on your image host or add `crossorigin="anonymous"`.

---

### 3. Elements flash before the particle animation starts
**Solution:** Nano66 injects `.nano66-concealed { visibility: hidden !important; }` immediately on initialization. If you have heavy external assets delaying script execution, you can add `.nano66-concealed` to your critical elements or target container in your CSS, or call `new Nano66()` early in your HTML bundle.

---

### 4. How do I exclude fixed navigation bars or control panels?
**Solution:** Add the `data-nano-ignore` attribute:
```html
<nav data-nano-ignore>
  <!-- Stays fully visible and interactive immediately -->
</nav>
```

---

### 5. Memory usage and resource cleanup in SPAs
**Solution:** Always call `nano.destroy()` when unmounting components in single-page applications (React `useEffect` cleanup, Vue `onUnmounted`, Svelte cleanup). This fully releases PixiJS GPU textures, sprite pools, ResizeObservers, and event listeners.
