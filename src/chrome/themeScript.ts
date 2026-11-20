/** localStorage key that ThemeToggle and themeInitScript share. */
export const themeStorageKey = 'eylulg-ui-theme';

/** Class ThemeToggle writes on <html> for dark mode. theme.css also accepts `dark`. */
export const darkModeClass = 'dark-mode';

/**
 * Put this in a <script> in <head>, before any stylesheet paints, so the
 * stored or system theme applies before first paint and there is no flash:
 *
 *   <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
 *
 * It is a plain string, safe to import from a React Server Component.
 */
export const themeInitScript = `(function(){try{var p=localStorage.getItem('${themeStorageKey}');var d=p==='dark'||(p!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('${darkModeClass}',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;
