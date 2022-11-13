# gunzip-scripts

An easy way decompress on-chain, gzipped libraries in the browser.

## How it works

This library looks for any `<script>` tags on the page with `type="text/javascript+gzip"` and inline source via `src="data:text/javascript;base64,…"`.

> The non-standard `type` attribute here prevents the browser from parsing/evaluating it immediately, allowing us to handle it ourselves.

For each script found, it decompresses the gzipped contents of the data URI and replaces the `<script>` element with a new one that includes the decompressed source code.

> This is currently a destructive operation that does not preserve other `<script>` attributes. Please open an issue or PR if you need certain attributes preserved!

## How to use

When building your on-chain HTML string, it's best to include this library once between the gzipped libraries and where those libraries are used. For example:

```html
<!-- gzipped libs -->
<script type="text/javascript+gzip" src="three.js.gz"></script>

<!-- decompress gzipped libs -->
<script src="gunzipScripts.js"></script>

<!-- use decompressed libs -->
<script>
  const scene = new THREE.Scene();
  …
</script>
```

The `gunzipScripts.js` library will run immediately after inclusion on the page. If you have a situation where you need to run it again, but don't want to include the library again, you can call `gunzipScripts()`. This is a ~no-op if no elements are found that match the conditions mentioned above, so it's safe to call multiple times.

```html
<!-- only need to include once -->
<script src="gunzipScripts.js"></script>

<!-- more gzipped libs are added -->
<script type="text/javascript+gzip" src="three.js.gz"></script>

<!-- decompress before using -->
<script>
  gunzipScripts();

  const scene = new THREE.Scene();
  …
</script>
```
