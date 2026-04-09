/**
 * ColorWalk - Interactive Color Wheel
 */

(function() {
    'use strict';

    const allColors = [
        { name: "樱桃红", color: "#FF6B6B" },
        { name: "西瓜红", color: "#FF4757" },
        { name: "珊瑚粉", color: "#FF7F50" },
        { name: "蜜桃粉", color: "#FFABAB" },
        { name: "玫瑰粉", color: "#FF6B9D" },
        { name: "樱花粉", color: "#FFB7C5" },
        { name: "亮橙色", color: "#FF9F43" },
        { name: "太阳橙", color: "#FF8C00" },
        { name: "芒果橙", color: "#FFA502" },
        { name: "金黄", color: "#F9CA24" },
        { name: "柠檬黄", color: "#F7DC6F" },
        { name: "小鸡黄", color: "#FFF3CD" },
        { name: "鸭蛋黄", color: "#FFEAA7" },
        { name: "青柠绿", color: "#7bed9f" },
        { name: "薄荷绿", color: "#A8E6CF" },
        { name: "苹果绿", color: "#82E0AA" },
        { name: "草绿", color: "#6DD55A" },
        { name: "翠绿", color: "#2ECC71" },
        { name: "森林绿", color: "#27AE60" },
        { name: "青碧色", color: "#1ABC9C" },
        { name: "水青色", color: "#00D2D3" },
        { name: "天青蓝", color: "#48DBFB" },
        { name: "天空蓝", color: "#74B9FF" },
        { name: "海洋蓝", color: "#0984E3" },
        { name: "宝石蓝", color: "#2E86DE" },
        { name: "浅紫蓝", color: "#A29BFE" },
        { name: "薰衣草", color: "#D6A2E8" },
        { name: "紫罗兰", color: "#9B59B6" },
        { name: "葡萄紫", color: "#A55EEA" },
        { name: "梅子紫", color: "#BE2EDD" },
        { name: "藕荷紫", color: "#E0BBE4" },
        { name: "丁香紫", color: "#B8A9C9" },
        { name: "香槟金", color: "#FFC312" },
        { name: "铂金色", color: "#EAB543" },
        { name: "桃心红", color: "#FD79A8" },
        { name: "霓虹粉", color: "#F368E0" },
    ];

    let wheelColors = [];
    let availableColors = [];
    let isSpinning = false;
    let currentRotation = 0;

    const wheel = document.getElementById("wheel");
    const spinBtn = document.getElementById("spinBtn");

    // ==================== Parallax Orbs ====================
    function initParallaxOrbs() {
        const orbs = document.querySelectorAll('.orb');
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function animate() {
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;

            orbs.forEach((orb, index) => {
                const factor = (index + 1) * 15;
                orb.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // ==================== Utility Functions ====================
    function shuffleArray(arr) {
        const newArr = [...arr];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }

    function initColors() {
        const shuffled = shuffleArray(allColors);
        wheelColors = shuffled.slice(0, 8);
        availableColors = shuffled.slice(8);
        renderAll();
    }

    function randomizeColors() {
        // Add subtle animation feedback
        const btn = document.querySelector('.refresh-btn');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);

        initColors();
    }

    // ==================== Render Functions ====================
    function renderWheel() {
        wheel.innerHTML = "";
        const segmentAngle = 360 / wheelColors.length;

        wheelColors.forEach((item, index) => {
            const segment = document.createElement("div");
            segment.className = "wheel-segment";
            segment.style.background = item.color;
            segment.style.transform = `rotate(${index * segmentAngle}deg) skew(${90 - segmentAngle}deg)`;

            wheel.appendChild(segment);
        });
    }

    function renderColorList() {
        const list = document.getElementById("colorList");
        list.innerHTML = "";
        wheelColors.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "color-item";
            div.innerHTML = `<div class="color-dot" style="background: ${item.color}"></div> <span>${item.name}</span> <button onclick="removeWheelColor(${index})" aria-label="Remove ${item.name}">×</button>`;
            list.appendChild(div);
        });
    }

    function renderAvailableColors() {
        const grid = document.getElementById("availableColors");
        grid.innerHTML = "";
        availableColors.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "available-color";
            div.innerHTML = `<div class="color-dot" style="background: ${item.color}"></div> <span>${item.name}</span>`;
            div.onclick = () => addToWheel(index);
            div.setAttribute('role', 'button');
            div.setAttribute('aria-label', `Add ${item.name} to wheel`);
            grid.appendChild(div);
        });
    }

    function renderAll() {
        renderWheel();
        renderColorList();
        renderAvailableColors();
    }

    // ==================== Color Management ====================
    function removeWheelColor(index) {
        if (wheelColors.length <= 2) {
            alert("转盘至少需要保留2个颜色");
            return;
        }
        const removed = wheelColors.splice(index, 1)[0];
        availableColors.unshift(removed);
        renderAll();
    }

    function addToWheel(index) {
        if (wheelColors.length >= 12) {
            alert("转盘最多添加12个颜色");
            return;
        }
        const added = availableColors.splice(index, 1)[0];
        wheelColors.push(added);
        renderAll();
    }

    // ==================== Spin Logic ====================
    function spin() {
        if (isSpinning) return;

        isSpinning = true;
        spinBtn.classList.add("spinning");
        spinBtn.querySelector('.btn-text').textContent = "Wait";

        const spins = 5 + Math.random() * 3;
        const randomAngle = Math.random() * 360;
        const totalRotation = currentRotation + spins * 360 + randomAngle;

        wheel.style.transform = `rotate(${totalRotation}deg)`;
        currentRotation = totalRotation;
    }

    spinBtn.addEventListener("click", spin);

    wheel.addEventListener("transitionend", () => {
        if (isSpinning) {
            isSpinning = false;
            spinBtn.classList.remove("spinning");
            spinBtn.querySelector('.btn-text').textContent = "Spin";

            // Add a little celebration bounce
            spinBtn.style.transform = "translate(-50%, -50%) scale(1.08)";
            setTimeout(() => {
                spinBtn.style.transform = "";
            }, 150);
        }
    });

    // ==================== Expose functions to global scope ====================
    window.removeWheelColor = removeWheelColor;
    window.addToWheel = addToWheel;
    window.randomizeColors = randomizeColors;

    // ==================== Initialize ====================
    function init() {
        initColors();
        initParallaxOrbs();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
