/**
 * Sets data-theme on <html> BEFORE first paint to avoid a flash.
 * Priority: saved choice → time-of-day (dark 18:00–06:00, like the reference site).
 */
export function ThemeScript() {
  const code = `(function(){try{
    var s=localStorage.getItem('theme');
    var h=new Date().getHours();
    var dark = s ? s==='dark' : (h<6||h>=18);
    document.documentElement.setAttribute('data-theme', dark?'dark':'light');
  }catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
