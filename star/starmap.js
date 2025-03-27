// StarMap Explorer - Main Application
class StarMapExplorer {
    constructor() {
        this.initElements();
        this.initEventListeners();
        this.initThreeJS();
        this.loadStarData();
        this.currentLocation = null;
        this.nightMode = false;
        this.selectedObject = null;
    }

    initElements() {
        this.container = document.getElementById('starmap-container');
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.nightModeToggle = document.getElementById('nightModeToggle');
        this.locationButton = document.getElementById('locationButton');
        this.loadingScreen = document.getElementById('loading');
        this.infoPanel = document.getElementById('infoPanel');
        this.celestialName = document.getElementById('celestialName');
        this.celestialInfo = document.getElementById('celestialInfo');
        this.closeInfo = document.getElementById('closeInfo');
        this.tooltip = document.getElementById('tooltip');
        this.raValue = document.getElementById('raValue');
        this.decValue = document.getElementById('decValue');
        this.zoomValue = document.getElementById('zoomValue');
    }

    initEventListeners() {
        this.searchButton.addEventListener('click', () => this.searchCelestialObject());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCelestialObject();
        });
        
        this.nightModeToggle.addEventListener('click', () => this.toggleNightMode());
        this.locationButton.addEventListener('click', () => this.getUserLocation());
        this.closeInfo.addEventListener('click', () => this.hideInfoPanel());
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    initThreeJS() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.container.clientWidth / this.container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 50;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 500;
        
        // Stars container
        this.starsContainer = new THREE.Group();
        this.scene.add(this.starsContainer);
        
        // Grid helper (for debugging)
        // const gridHelper = new THREE.GridHelper(100, 100);
        // this.scene.add(gridHelper);
        
        // Raycaster for object selection
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Event listeners for Three.js
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('click', (e) => this.onClick(e));
        
        // Start animation loop
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        this.updateCoordinatesDisplay();
        this.updateZoomDisplay();
        
        this.renderer.render(this.scene, this.controls.object);
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    loadStarData() {
        // In a real app, you would fetch this from an API or large dataset
        // For this example, we'll use a simplified dataset
        const stars = [
            // Brightest Stars (continued)
            { name: "Spica", ra: 201.2983, dec: -11.1614, magnitude: 0.98, color: 0x99ccff, type: "Star" },
            { name: "Pollux", ra: 116.3290, dec: 28.0262, magnitude: 1.14, color: 0xffcc99, type: "Star" },
            { name: "Fomalhaut", ra: 344.4127, dec: -29.6222, magnitude: 1.16, color: 0xffffff, type: "Star" },
            { name: "Deneb", ra: 310.3580, dec: 45.2803, magnitude: 1.25, color: 0x99ccff, type: "Star" },
            { name: "Regulus", ra: 152.0928, dec: 11.9672, magnitude: 1.36, color: 0xffffff, type: "Star" },
            { name: "Castor", ra: 113.6495, dec: 31.8886, magnitude: 1.58, color: 0xffffff, type: "Star" },
            { name: "Bellatrix", ra: 81.2828, dec: 6.3497, magnitude: 1.64, color: 0x99ccff, type: "Star" },
            { name: "Elnath", ra: 81.5729, dec: 28.6075, magnitude: 1.65, color: 0xffffff, type: "Star" },
            { name: "Miaplacidus", ra: 138.2999, dec: -69.7172, magnitude: 1.67, color: 0xffffff, type: "Star" },
            { name: "Alnilam", ra: 84.0534, dec: -1.2019, magnitude: 1.69, color: 0x99ccff, type: "Star" },
        
            // Notable Binary/Multiple Stars
            { name: "Alpha Centauri", ra: 219.9021, dec: -60.8340, magnitude: -0.27, color: 0xffff99, type: "Binary Star" },
            { name: "Albireo", ra: 292.6803, dec: 27.9597, magnitude: 3.05, color: 0x99ccff, type: "Binary Star" },
            { name: "Mizar", ra: 200.9814, dec: 54.9254, magnitude: 2.23, color: 0xffffff, type: "Binary Star" },
            { name: "Epsilon Lyrae", ra: 284.9059, dec: 39.6129, magnitude: 4.7, color: 0xffffff, type: "Double Double Star" },
        
            // Planets (with placeholder positions - would update dynamically in real app)
            { name: "Mercury", ra: 120, dec: 5, magnitude: -0.4, color: 0xcccccc, type: "Planet", size: 0.8 },
            { name: "Venus", ra: 90, dec: -10, magnitude: -4.6, color: 0xffffcc, type: "Planet", size: 0.9 },
            { name: "Mars", ra: 300, dec: 15, magnitude: -1.3, color: 0xff6666, type: "Planet", size: 0.85 },
            { name: "Saturn", ra: 180, dec: -5, magnitude: 0.7, color: 0xffcc99, type: "Planet", size: 1.1 },
            { name: "Uranus", ra: 45, dec: 20, magnitude: 5.7, color: 0x99ffcc, type: "Planet", size: 0.7 },
            { name: "Neptune", ra: 330, dec: -15, magnitude: 7.8, color: 0x6699ff, type: "Planet", size: 0.7 },
        
            // Messier Objects (Galaxies, Nebulae, Clusters)
            { name: "Messier 1 (Crab Nebula)", ra: 83.6331, dec: 22.0145, magnitude: 8.4, color: 0x99ff99, type: "Supernova Remnant", size: 1.2 },
            { name: "Messier 13 (Hercules Cluster)", ra: 250.4233, dec: 36.4617, magnitude: 5.8, color: 0x99ccff, type: "Globular Cluster", size: 1.5 },
            { name: "Messier 31 (Andromeda Galaxy)", ra: 10.6847, dec: 41.2692, magnitude: 3.44, color: 0x9999ff, type: "Galaxy", size: 2.5 },
            { name: "Messier 42 (Orion Nebula)", ra: 83.8221, dec: -5.3911, magnitude: 4.0, color: 0x99ff99, type: "Nebula", size: 1.8 },
            { name: "Messier 45 (Pleiades)", ra: 56.7500, dec: 24.1167, magnitude: 1.6, color: 0x99ccff, type: "Open Cluster", size: 1.8 },
            { name: "Messier 57 (Ring Nebula)", ra: 283.3964, dec: 33.0292, magnitude: 8.8, color: 0x66ffcc, type: "Planetary Nebula", size: 1.0 },
            { name: "Messier 81 (Bode's Galaxy)", ra: 148.8883, dec: 69.0653, magnitude: 6.9, color: 0x9999ff, type: "Galaxy", size: 1.5 },
            { name: "Messier 82 (Cigar Galaxy)", ra: 148.9667, dec: 69.6797, magnitude: 8.4, color: 0x9999ff, type: "Galaxy", size: 1.3 },
            { name: "Messier 101 (Pinwheel Galaxy)", ra: 210.8025, dec: 54.3489, magnitude: 7.9, color: 0x9999ff, type: "Galaxy", size: 1.2 },
        
            // Other Interesting Deep Sky Objects
            { name: "Hyades Cluster", ra: 66.75, dec: 15.95, magnitude: 0.5, color: 0xffcc99, type: "Open Cluster", size: 2.0 },
            { name: "Double Cluster", ra: 34.7425, dec: 57.1436, magnitude: 3.8, color: 0x99ccff, type: "Open Cluster", size: 1.7 },
            { name: "Omega Centauri", ra: 201.6970, dec: -47.4795, magnitude: 3.9, color: 0x99ccff, type: "Globular Cluster", size: 1.8 },
            { name: "Lagoon Nebula", ra: 271.1333, dec: -24.3750, magnitude: 6.0, color: 0xff99cc, type: "Nebula", size: 1.5 },
            { name: "Trifid Nebula", ra: 270.6708, dec: -23.0200, magnitude: 6.3, color: 0xff99ff, type: "Nebula", size: 1.3 },
            { name: "Eagle Nebula", ra: 274.7000, dec: -13.8067, magnitude: 6.0, color: 0xcc99ff, type: "Nebula", size: 1.4 },
            { name: "Carina Nebula", ra: 160.8958, dec: -59.6850, magnitude: 1.0, color: 0xff99cc, type: "Nebula", size: 2.0 },
            { name: "Helix Nebula", ra: 337.4158, dec: -20.8325, magnitude: 7.6, color: 0x66ffcc, type: "Planetary Nebula", size: 1.1 },
        
            // Zodiacal Constellations (Sample Stars)
            { name: "Hamal", ra: 31.7933, dec: 23.4625, magnitude: 2.01, color: 0xff9966, type: "Star", constellation: "Aries" },
            { name: "Aldebaran", ra: 68.9800, dec: 16.5092, magnitude: 0.87, color: 0xff9966, type: "Star", constellation: "Taurus" },
            { name: "Pollux", ra: 116.3290, dec: 28.0262, magnitude: 1.14, color: 0xffcc99, type: "Star", constellation: "Gemini" },
            { name: "Regulus", ra: 152.0928, dec: 11.9672, magnitude: 1.36, color: 0xffffff, type: "Star", constellation: "Leo" },
            { name: "Spica", ra: 201.2983, dec: -11.1614, magnitude: 0.98, color: 0x99ccff, type: "Star", constellation: "Virgo" },
            { name: "Antares", ra: 247.3517, dec: -26.4320, magnitude: 0.96, color: 0xff6666, type: "Star", constellation: "Scorpius" }
        ];

        // Create star objects
        stars.forEach(star => {
            const size = star.size || (1.0 - (star.magnitude / 10)) * 2;
            const geometry = new THREE.SphereGeometry(size, 16, 16);
            const material = new THREE.MeshBasicMaterial({ color: star.color });
            const sphere = new THREE.Mesh(geometry, material);
            
            // Convert RA/Dec to Cartesian coordinates
            const raRad = THREE.MathUtils.degToRad(star.ra);
            const decRad = THREE.MathUtils.degToRad(star.dec);
            const distance = 100 - (star.magnitude * 2); // Brighter stars appear closer
            
            sphere.position.x = distance * Math.cos(decRad) * Math.cos(raRad);
            sphere.position.y = distance * Math.cos(decRad) * Math.sin(raRad);
            sphere.position.z = distance * Math.sin(decRad);
            
            sphere.userData = {
                name: star.name,
                ra: star.ra,
                dec: star.dec,
                magnitude: star.magnitude,
                type: star.type,
                info: this.generateStarInfo(star)
            };
            
            this.starsContainer.add(sphere);
        });

        // Hide loading screen after a short delay
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 1500);
    }

    generateStarInfo(star) {
        let info = '';
        switch(star.type) {
            case 'Star':
                info = `Magnitude: ${star.magnitude}\nRight Ascension: ${star.ra}°\nDeclination: ${star.dec}°`;
                break;
            case 'Planet':
                info = `Current magnitude: ${star.magnitude}\nVisible in the night sky`;
                break;
            case 'Galaxy':
                info = `Messier object: M31\nMagnitude: ${star.magnitude}\nDistance: ~2.5 million light years`;
                break;
            case 'Nebula':
                info = `Messier object: M42\nMagnitude: ${star.magnitude}\nDistance: ~1,344 light years`;
                break;
            default:
                info = `Right Ascension: ${star.ra}°\nDeclination: ${star.dec}°`;
        }
        return info;
    }

    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        
        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.starsContainer.children);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.tooltip.textContent = object.userData.name;
            this.tooltip.style.opacity = '1';
            
            // Position tooltip near mouse
            this.tooltip.style.left = `${event.clientX + 15}px`;
            this.tooltip.style.top = `${event.clientY + 15}px`;
        } else {
            this.tooltip.style.opacity = '0';
        }
    }

    onClick(event) {
        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.starsContainer.children);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.selectedObject = object;
            this.showInfoPanel(object.userData);
            
            // Center the camera on the selected object
            this.controls.target.copy(object.position);
        } else {
            this.hideInfoPanel();
        }
    }

    showInfoPanel(data) {
        this.celestialName.textContent = data.name;
        this.celestialInfo.textContent = data.info;
        this.infoPanel.classList.remove('hidden');
    }

    hideInfoPanel() {
        this.infoPanel.classList.add('hidden');
        this.selectedObject = null;
    }

    searchCelestialObject() {
        const searchTerm = this.searchInput.value.trim().toLowerCase();
        if (!searchTerm) return;
        
        let foundObject = null;
        
        // Search through all celestial objects
        this.starsContainer.children.forEach(object => {
            if (object.userData.name.toLowerCase().includes(searchTerm)) {
                foundObject = object;
            }
        });
        
        if (foundObject) {
            // Center on the found object
            this.controls.target.copy(foundObject.position);
            
            // Show info panel
            this.selectedObject = foundObject;
            this.showInfoPanel(foundObject.userData);
            
            // Highlight the object (pulse effect)
            const originalScale = foundObject.scale.clone();
            const pulseScale = originalScale.clone().multiplyScalar(1.5);
            
            const pulseIn = new TWEEN.Tween(foundObject.scale)
                .to(pulseScale, 300)
                .easing(TWEEN.Easing.Quadratic.InOut);
                
            const pulseOut = new TWEEN.Tween(foundObject.scale)
                .to(originalScale, 300)
                .easing(TWEEN.Easing.Quadratic.InOut);
                
            pulseIn.chain(pulseOut).start();
        } else {
            alert(`No celestial object found matching "${searchTerm}"`);
        }
    }

    toggleNightMode() {
        this.nightMode = !this.nightMode;
        document.body.classList.toggle('night-mode', this.nightMode);
        this.nightModeToggle.textContent = this.nightMode ? 'Day Mode' : 'Night Mode';
    }

    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    alert(`Location set to: ${this.currentLocation.latitude.toFixed(4)}° N, ${this.currentLocation.longitude.toFixed(4)}° E`);
                    // In a real app, you would adjust the view based on location and time
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not get your location. Using default view.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    }

    updateCoordinatesDisplay() {
        if (this.selectedObject) {
            this.raValue.textContent = this.selectedObject.userData.ra.toFixed(2);
            this.decValue.textContent = this.selectedObject.userData.dec.toFixed(2);
        } else {
            // Calculate center of view
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            
            // Convert to RA/Dec (simplified)
            const ra = THREE.MathUtils.radToDeg(Math.atan2(direction.y, direction.x));
            const dec = THREE.MathUtils.radToDeg(Math.asin(direction.z));
            
            this.raValue.textContent = ra.toFixed(2);
            this.decValue.textContent = dec.toFixed(2);
        }
    }

    updateZoomDisplay() {
        const distance = this.controls.getDistance();
        const zoomLevel = (100 / distance).toFixed(1);
        this.zoomValue.textContent = zoomLevel;
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new StarMapExplorer();
});

// Simple tweening library for animations
const TWEEN = {
    Tweens: [],
    get now() { return performance.now(); },
    
    Tween: function(object) {
        this.object = object;
        this.properties = {};
        this.duration = 1000;
        this.easing = TWEEN.Easing.Linear.None;
        this.startTime = 0;
        this.onComplete = null;
        
        this.to = function(props) {
            this.properties = {};
            for (const prop in props) {
                if (object[prop] !== undefined) {
                    this.properties[prop] = {
                        start: object[prop].clone ? object[prop].clone() : object[prop],
                        end: props[prop]
                    };
                }
            }
            return this;
        };
        
        this.start = function(time = TWEEN.now) {
            this.startTime = time;
            TWEEN.Tweens.push(this);
            return this;
        };
        
        this.update = function(time) {
            const elapsed = time - this.startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            const easedProgress = this.easing(progress);
            
            for (const prop in this.properties) {
                const propData = this.properties[prop];
                if (propData.start.lerp) {
                    // For THREE.Vector3
                    this.object[prop].lerpVectors(
                        propData.start, 
                        propData.end, 
                        easedProgress
                    );
                } else {
                    // For simple numbers
                    this.object[prop] = propData.start + 
                        (propData.end - propData.start) * easedProgress;
                }
            }
            
            if (progress === 1) {
                const index = TWEEN.Tweens.indexOf(this);
                if (index !== -1) TWEEN.Tweens.splice(index, 1);
                if (this.onComplete) this.onComplete();
            }
        };
        
        this.chain = function(tween) {
            this.onComplete = () => tween.start();
            return this;
        };
    },
    
    Easing: {
        Quadratic: {
            InOut: function(k) {
                if ((k *= 2) < 1) return 0.5 * k * k;
                return -0.5 * (--k * (k - 2) - 1);
            }
        }
    },
    
    update: function() {
        const time = TWEEN.now;
        for (let i = 0; i < TWEEN.Tweens.length; i++) {
            TWEEN.Tweens[i].update(time);
        }
    }
};

// Start TWEEN update loop
(function animateTWEEN() {
    requestAnimationFrame(animateTWEEN);
    TWEEN.update();
})();