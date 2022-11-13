window.onload = () => {
  const o = (o) => (
    void 0 !== o && (l = o % 2147483647) <= 0 && (l += 2147483646),
    ((l = (16807 * l) % 2147483647) - 1) / 2147483646
  );
  o(tokenId);
  const t = 2 * Math.PI,
    i = window.innerWidth,
    n = window.innerHeight;
  let e,
    a,
    r,
    s = 0,
    d = 0,
    E = window.innerHeight / 2,
    p = window.innerWidth / 2,
    c = !1,
    w = [];
  function h() {
    (E = window.innerHeight / 2),
      (p = window.innerWidth / 2),
      (e.aspect = window.innerWidth / window.innerHeight),
      e.updateProjectionMatrix(),
      r.setSize(window.innerWidth, window.innerHeight);
  }
  function y(o) {
    !1 !== o.isPrimary && ((s = o.clientY - E), (d = o.clientX - p));
  }
  !(function () {
    var s = o() > 0.88,
      d = o() > 0.9;
    (c = o() > 0.7),
      ((e = new THREE.PerspectiveCamera(80, i / n, 1, 3e3)).position.z = 1500),
      ((a = new THREE.Scene()).background = new THREE.Color(s ? 16777215 : 0));
    const l = new THREE.HemisphereLight(16777147, 526368, 1);
    (l.position.y = 1e3), a.add(l);
    var E = new THREE.MeshPhongMaterial();
    E.color.set(39168);
    var p = new THREE.MeshPhongMaterial();
    p.color.set(65280);
    var H = new THREE.MeshPhongMaterial();
    H.color.set(16711680), (H.shading = THREE.FlatShading);
    const m = new THREE.MeshBasicMaterial();
    (m.transparent = !0),
      (m.opacity = 0.2 + 0.2 * o()),
      (m.blending = THREE.AdditiveBlending),
      m.color.set(16777147);
    var M = new THREE.LineBasicMaterial();
    M.color.set(16777147),
      (M.transparent = !0),
      (M.opacity = 0.2),
      (M.blending = THREE.AdditiveBlending),
      s &&
        ((M = new THREE.LineBasicMaterial()).color.set(0),
        (M.transparent = !0),
        (M.opacity = 0.2),
        (M.blending = THREE.NormalBlending),
        (m.blending = THREE.NormalBlending),
        m.color.set(0));
    d &&
      ((E = new THREE.MeshNormalMaterial()),
      (p = new THREE.MeshNormalMaterial()),
      (H = new THREE.MeshNormalMaterial()));
    for (var R = 2, T = 0; T < 20; T++) {
      const i = new THREE.BoxGeometry(
          10 + 50 * o(),
          50 + 50 * o(),
          10 + 50 * o()
        ),
        n = new THREE.Mesh(i, E);
      (n.position.y = 50 * T - 600),
        (n.rotation.x = o() * t),
        (n.rotation.y = o() * t),
        (n.rotation.z = o() * t),
        a.add(n);
      const e = new THREE.WireframeGeometry(i),
        r = new THREE.LineSegments(e);
      (r.material = M),
        (r.position.x = n.position.x),
        (r.position.y = n.position.y),
        (r.position.z = n.position.z),
        (r.rotation.x = n.rotation.x),
        (r.rotation.y = n.rotation.y),
        (r.rotation.z = n.rotation.z),
        r.scale.multiplyScalar(R),
        a.add(r);
    }
    for (var R = 2, v = 3 + Math.ceil(3 * o()), T = 0; T < v; T++)
      for (
        var f = o() * t,
          x = 700 * o() - 500,
          g = 4 + Math.ceil(4 * o()),
          z = 20 + 20 * o(),
          u = 1;
        u < g;
        u++
      ) {
        const i = new THREE.TetrahedronGeometry(z + o() * z, 0),
          n = new THREE.Mesh(i, p);
        (n.position.y = x),
          (n.rotation.x = o() * t),
          (n.rotation.y = o() * t),
          (n.rotation.z = o() * t),
          (n.position.x = z * u * Math.cos(f)),
          (n.position.z = z * u * Math.sin(f)),
          (x += 5 * u),
          a.add(n);
        const e = new THREE.WireframeGeometry(i),
          r = new THREE.LineSegments(e);
        (r.material = M),
          (r.position.x = n.position.x),
          (r.position.y = n.position.y),
          (r.position.z = n.position.z),
          (r.rotation.x = n.rotation.x),
          (r.rotation.y = n.rotation.y),
          (r.rotation.z = n.rotation.z),
          r.scale.multiplyScalar(R),
          a.add(r);
      }
    for (var R = 2, T = 0; T < 20; T++)
      for (
        var f = o() * t,
          x = 400,
          g = 4 + Math.ceil(4 * o()),
          S = 20 + 20 * o(),
          u = 1;
        u < g;
        u++
      ) {
        const i = new THREE.BoxGeometry(
            10 + 50 * o(),
            50 + 50 * o(),
            10 + 50 * o()
          ),
          n = new THREE.Mesh(i, H);
        (n.position.x = S * u * Math.cos(f)),
          (n.position.z = S * u * Math.sin(f)),
          (n.position.y = x),
          (n.rotation.x = o() * t),
          (n.rotation.y = o() * t),
          (n.rotation.z = o() * t),
          a.add(n),
          (x += 10 * u);
        const e = new THREE.WireframeGeometry(i),
          r = new THREE.LineSegments(e);
        (r.material = M),
          (r.position.x = n.position.x),
          (r.position.y = n.position.y),
          (r.position.z = n.position.z),
          (r.rotation.x = n.rotation.x),
          (r.rotation.y = n.rotation.y),
          (r.rotation.z = n.rotation.z),
          r.scale.multiplyScalar(R),
          a.add(r);
      }
    var B = 50 + Math.ceil(50 * o());
    o() < 0.5 && (B = 0);
    for (var b = o() > 0.8, T = 0; T < B; T++) {
      var f = o() * t,
        x = -600,
        g = 4 + Math.ceil(4 * o()),
        S = 20 + 500 * o(),
        G = 5;
      b && o() > 0.8 && (G = 20);
      for (var u = 1; u < g; u++) {
        const i = new THREE.BoxGeometry(G, G, G),
          n = new THREE.Mesh(i, m);
        (n.position.x = S * u * Math.cos(f)),
          (n.position.z = S * u * Math.sin(f)),
          (n.position.y = x),
          (n.rotation.x = o() * t),
          (n.rotation.y = o() * t),
          (n.rotation.z = o() * t),
          a.add(n),
          (x += 100 * u),
          (n.floatAmount = o()),
          (n.floatSpeed = o()),
          w.push(n);
      }
    }
    geometry = new THREE.SphereGeometry(500, 3);
    var L = new THREE.MeshBasicMaterial({ color: 16777215 }),
      P = new THREE.Mesh(geometry, L);
    (P.position.x = -100),
      (P.position.y = 130),
      (P.position.z = 500),
      (r = new THREE.WebGLRenderer({ antialias: !0 })).setPixelRatio(
        window.devicePixelRatio
      ),
      r.setSize(i, n),
      document.body.appendChild(r.domElement),
      (document.body.style.touchAction = "none"),
      document.body.addEventListener("pointermove", y),
      window.addEventListener("resize", h);
  })(),
    (function o() {
      requestAnimationFrame(o);
      !(function () {
        (e.position.y += 0.05 * (200 - s - e.position.y)),
          (a.rotation.y -= 0.005),
          e.lookAt(a.position),
          r.render(a, e);
        const o = 0.001 * Date.now();
        var t = Math.sin(o);
        for (var i of w) {
          var n = i.position.y;
          n /= 100;
          var d = Math.sin(o * i.floatSpeed),
            l = Math.cos(o * i.floatSpeed * 2);
          (i.position.y -= d * i.floatAmount),
            (i.position.x -= l * i.floatAmount);
        }
        if (!c) return;
        for (var E of a.children) {
          if (-1 != w.indexOf(E)) return;
          var n = E.position.y + 500;
          (n /= 1e4), (E.position.y += 10 * t * n), (E.rotation.y += 0.1 * n);
        }
      })();
    })();
};
