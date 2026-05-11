/* ── Three.js Scene ─────────────────────────────────────────── */

(function () {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
    camera.position.set(0, 0, 22);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 8);
    scene.add(dirLight);

    const pointA = new THREE.PointLight(0x667eea, 2, 40);
    pointA.position.set(-8, 6, 5);
    scene.add(pointA);

    const pointB = new THREE.PointLight(0xf093fb, 2, 40);
    pointB.position.set(8, -4, 3);
    scene.add(pointB);

    /* ── Colour palette ── */
    const COLORS = [0x667eea, 0x764ba2, 0xf093fb, 0x4facfe, 0xa18cd1];

    /* ── Floating meshes ── */
    const COUNT = 55;
    const meshes = [];

    const geometries = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.TetrahedronGeometry(1, 0),
        new THREE.BoxGeometry(1.2, 1.2, 1.2),
        new THREE.TorusGeometry(0.7, 0.28, 6, 8),
    ];

    for (let i = 0; i < COUNT; i++) {
        const geo = geometries[Math.floor(Math.random() * geometries.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const wireframe = Math.random() < 0.4;

        const mat = new THREE.MeshPhongMaterial({
            color,
            shininess: 90,
            wireframe,
            transparent: true,
            opacity: wireframe ? 0.55 : 0.82,
        });

        const mesh = new THREE.Mesh(geo, mat);
        const spread = 26;
        mesh.position.set(
            (Math.random() - 0.5) * spread,
            (Math.random() - 0.5) * spread * 0.7,
            (Math.random() - 0.5) * spread * 0.5 - 4
        );
        const s = 0.35 + Math.random() * 1.1;
        mesh.scale.setScalar(s);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

        mesh.userData = {
            rotX: (Math.random() - 0.5) * 0.012,
            rotY: (Math.random() - 0.5) * 0.012,
            floatSpeed: 0.4 + Math.random() * 0.6,
            floatAmp: 0.15 + Math.random() * 0.25,
            floatOffset: Math.random() * Math.PI * 2,
            baseY: mesh.position.y,
        };

        scene.add(mesh);
        meshes.push(mesh);
    }

    /* ── Mouse parallax ── */
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Resize ── */
    function onResize() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    /* ── Animate ── */
    let t = 0;
    function animate() {
        requestAnimationFrame(animate);
        t += 0.016;

        meshes.forEach((m) => {
            m.rotation.x += m.userData.rotX;
            m.rotation.y += m.userData.rotY;
            m.position.y = m.userData.baseY +
                Math.sin(t * m.userData.floatSpeed + m.userData.floatOffset) * m.userData.floatAmp;
        });

        camera.position.x += (mouseX * 2 - camera.position.x) * 0.03;
        camera.position.y += (-mouseY * 1 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
})();
