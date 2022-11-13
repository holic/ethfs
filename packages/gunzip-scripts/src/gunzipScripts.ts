import { gunzipSync } from "fflate";

declare global {
  interface Window {
    gunzipSync: typeof gunzipSync;
    gunzipScripts: () => void;
  }
}

const gunzipScripts = () => {
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[type="text/javascript+gzip"][src]'
  );
  for (const script of scripts) {
    try {
      const parsed = script.src.match(/^data:(.*?)(?:;(base64))?,(.*)$/);
      if (!parsed) continue;
      const [_, _type, encoding, data] = parsed;
      const buffer = Uint8Array.from(
        encoding ? atob(data) : decodeURIComponent(data),
        (c) => c.charCodeAt(0)
      );
      const decoder = new TextDecoder();
      const contents = decoder.decode(gunzipSync(buffer));
      const newScript = document.createElement("script");
      newScript.textContent = contents;
      script.parentNode?.replaceChild(newScript, script);
    } catch (e) {
      console.error("Could not gunzip script", script, e);
    }
  }
};

gunzipScripts();

window.gunzipSync = gunzipSync;
window.gunzipScripts = gunzipScripts;

export { gunzipScripts, gunzipSync };
