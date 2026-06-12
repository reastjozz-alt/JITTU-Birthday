// =====================================
// LOADER
// =====================================

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (!loader) return;

    setTimeout(() => {

        loader.style.opacity = "0";
        loader.style.pointerEvents = "none";

        setTimeout(() => {
            loader.style.display = "none";
        }, 600);

    }, 1500);

});

// =====================================
// SMOOTH SCROLL
// =====================================

// =====================================
// MUSIC CONTROL
// =====================================

const music =
document.getElementById("birthdayMusic");

const playBtn =
document.getElementById("playMusicBtn");

let musicPlaying = false;
let musicButtonClicked = false;
let journeyButtonClicked = false;
let scrollUnlocked = false;

function unlockPageScroll() {

    if (scrollUnlocked) return;

    document.documentElement.classList.remove(
        "no-scroll"
    );

    document.body.classList.remove(
        "no-scroll"
    );

    scrollUnlocked = true;

}

function tryUnlockAndScroll() {

    if (!musicButtonClicked || !journeyButtonClicked) return;

    unlockPageScroll();

    const journeyPreview =
        document.getElementById("journeyPreview");

    if (journeyPreview) {

        journeyPreview.scrollIntoView({
            behavior: "smooth"
        });

    }

}

async function startMusic() {

    if (!music || musicPlaying) return;

    try {

        music.currentTime = 31;

        await music.play();

        if (playBtn) {

            playBtn.innerText =
                "Pause Music ⏸";

            playBtn.classList.add(
                "music-active"
            );

        }

        musicPlaying = true;

    } catch (error) {

        console.error(
            "Music Error:",
            error
        );

    }

}

function stopMusic() {

    if (!music || !musicPlaying) return;

    music.pause();

    if (playBtn) {

        playBtn.innerText =
            "Play Music 🎵";

        playBtn.classList.remove(
            "music-active"
        );

    }

    musicPlaying = false;

}

if (playBtn && music) {

    playBtn.addEventListener("click", () => {

        musicButtonClicked = true;

        if (!musicPlaying) {
            startMusic();
        } else {
            stopMusic();
        }

        tryUnlockAndScroll();

    });

}

const startBtn = document.getElementById("startJourneyBtn");

if (startBtn) {

    document.documentElement.classList.add(
        "no-scroll"
    );

    document.body.classList.add(
        "no-scroll"
    );

    startBtn.addEventListener("click", () => {

        journeyButtonClicked = true;

        tryUnlockAndScroll();

    });

}

// =====================================
// SCROLL REVEAL
// =====================================

const scroll3dElements =
Array.from(
    document.querySelectorAll(
        "section, .timeline-card, .award-card, .gallery-viewer"
    )
);

scroll3dElements.forEach(el => {

    el.classList.add("scroll-3d");

});

let scrollAnimationFrame = null;

function updateScroll3dEffects() {

    const viewportCenter =
        window.innerHeight / 2;

    scroll3dElements.forEach((el, index) => {

        const rect = el.getBoundingClientRect();

        const elementCenter =
            rect.top + rect.height / 2;

        const distance =
            elementCenter - viewportCenter;

        const normalized =
            Math.max(-1, Math.min(1, distance / viewportCenter));

        const depthShift =
            Math.abs(normalized) * 18;

        const tiltX =
            normalized * -7;

        const tiltY =
            (index % 2 === 0 ? 1 : -1) * normalized * 6;

        const scale =
            1 - Math.min(Math.abs(normalized) * 0.04, 0.04);

        const opacity =
            1 - Math.min(Math.abs(normalized) * 0.18, 0.18);

        el.style.transform =
            `perspective(1300px) translateY(${depthShift * (normalized > 0 ? 1 : -1)}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;

        el.style.opacity =
            opacity.toString();

    });

    scrollAnimationFrame = null;

}

function requestScroll3dUpdate() {

    if (scrollAnimationFrame !== null) return;

    scrollAnimationFrame = requestAnimationFrame(
        updateScroll3dEffects
    );

}

window.addEventListener(
    "scroll",
    requestScroll3dUpdate,
    { passive: true }
);

window.addEventListener(
    "resize",
    requestScroll3dUpdate
);

requestScroll3dUpdate();

const revealElements =
document.querySelectorAll(
".timeline-card, .award-card, .gallery-grid img, .story-section, .music-section, .final-section"
);

const revealObserver =
new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add(
                    "active"
                );

                revealObserver.unobserve(
                    entry.target
                );

            }

        });

    },

    {
        threshold: 0.15
    }

);

revealElements.forEach(el => {

    el.classList.add("reveal");

    revealObserver.observe(el);

});

// =====================================
// GALLERY LIGHTBOX
// =====================================

const galleryImages =
document.querySelectorAll(
".gallery-grid img"
);

const lightbox =
document.getElementById(
"lightbox"
);

const lightboxImage =
document.getElementById(
"lightboxImage"
);

const lightboxClose =
document.querySelector(
".lightbox-close"
);

const happyBirthdayBtn =
document.getElementById(
"happyBirthdayBtn"
);

const galleryItems = [
    {
        src: "images/photo1.jpeg",
        alt: "Jittu Memory 1"
    },
    {
        src: "images/photo2.jpeg",
        alt: "Jittu Memory 2"
    },
    {
        src: "images/photo3.jpeg",
        alt: "Jittu Memory 3"
    },
    {
        src: "images/photo4.jpeg",
        alt: "Jittu Memory 4"
    },
    {
        src: "images/photo5.jpeg",
        alt: "Jittu Memory 5"
    },
    {
        src: "images/photo6.jpeg",
        alt: "Jittu Memory 6"
    },
    {
        src: "images/photo7.jpeg",
        alt: "Jittu Memory 7"
    },
    {
        src: "images/photo8.jpeg",
        alt: "Jittu Memory 8"
    },
    {
        src: "images/photo10.jpeg",
        alt: "Jittu Memory 10"
    }
];

const galleryViewerImage =
document.getElementById(
    "galleryViewerImage"
);

const galleryCounter =
document.getElementById(
    "galleryCounter"
);

const prevPhotoBtn =
document.getElementById(
    "prevPhotoBtn"
);

const nextPhotoBtn =
document.getElementById(
    "nextPhotoBtn"
);

let currentGalleryIndex = 0;
let gallerySwitchTimeout = null;
let galleryCelebrationInterval = null;
let galleryCelebrationTimeout = null;
const galleryIntroAnimations = [
    "galleryIntroFadeZoom",
    "galleryIntroSlideLeft",
    "galleryIntroSlideRight",
    "galleryIntroPopSpin",
    "galleryIntroTiltUp",
    "galleryIntroGlowSweep"
];

function playGalleryIntro(effectName) {

    if (!galleryViewerImage) return;

    galleryViewerImage.style.animation = "none";

    void galleryViewerImage.offsetWidth;

    galleryViewerImage.style.animation =
        `${effectName} 700ms cubic-bezier(.2,.85,.2,1)`;

    setTimeout(() => {
        if (galleryViewerImage) {
            galleryViewerImage.style.animation = "none";
        }
    }, 760);

}

function stopGalleryCelebration() {

    if (galleryCelebrationInterval) {
        clearInterval(galleryCelebrationInterval);
        galleryCelebrationInterval = null;
    }

    if (galleryCelebrationTimeout) {
        clearTimeout(galleryCelebrationTimeout);
        galleryCelebrationTimeout = null;
    }

}

function revealHappyBirthdayButton() {

    if (!happyBirthdayBtn) return;

    happyBirthdayBtn.classList.remove(
        "is-hidden"
    );

}

function startGalleryCelebration() {

    if (!galleryViewerImage || !galleryCounter) return;

    stopGalleryCelebration();

    currentGalleryIndex = 0;
    updateGalleryViewer(false);

    const gallerySection =
        document.getElementById("gallery");

    if (gallerySection) {

        gallerySection.classList.remove(
            "gallery-locked"
        );

        gallerySection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    galleryCelebrationTimeout = setTimeout(() => {

        galleryCelebrationInterval = setInterval(() => {

            if (currentGalleryIndex >= galleryItems.length - 1) {

                stopGalleryCelebration();

                if (nextPhotoBtn) {
                    nextPhotoBtn.disabled = true;
                }

                revealHappyBirthdayButton();

                return;

            }

            currentGalleryIndex += 1;
            updateGalleryViewer(true);

        }, 1150);

    }, 800);

}

function updateGalleryViewer(animateChange = false) {

    if (!galleryViewerImage || !galleryCounter) return;

    const currentItem =
        galleryItems[currentGalleryIndex];

    const effectName =
        galleryIntroAnimations[
            currentGalleryIndex % galleryIntroAnimations.length
        ];

    const applyGalleryContent = () => {

        galleryViewerImage.src =
            currentItem.src;

        galleryViewerImage.alt =
            currentItem.alt;

        galleryCounter.innerText =
            `${currentGalleryIndex + 1} / ${galleryItems.length}`;

        if (prevPhotoBtn) {
            prevPhotoBtn.disabled =
                currentGalleryIndex === 0;
        }

        if (nextPhotoBtn) {
            nextPhotoBtn.disabled =
                currentGalleryIndex === galleryItems.length - 1;
        }

    };

    if (!animateChange) {
        applyGalleryContent();
        playGalleryIntro(effectName);
        return;
    }

    galleryViewerImage.classList.add(
        "is-switching"
    );

    if (gallerySwitchTimeout) {
        clearTimeout(gallerySwitchTimeout);
    }

    gallerySwitchTimeout = setTimeout(
        () => {

            applyGalleryContent();

            playGalleryIntro(effectName);

            requestAnimationFrame(() => {
                galleryViewerImage.classList.remove(
                    "is-switching"
                );
            });

        },
        180
    );

}

if (prevPhotoBtn) {

    prevPhotoBtn.addEventListener(
        "click",
        () => {

            stopGalleryCelebration();

            if (currentGalleryIndex > 0) {
                currentGalleryIndex -= 1;
                updateGalleryViewer(true);
            }

        }
    );

}

if (nextPhotoBtn) {

    nextPhotoBtn.addEventListener(
        "click",
        () => {

            stopGalleryCelebration();

            if (currentGalleryIndex < galleryItems.length - 1) {
                currentGalleryIndex += 1;
                updateGalleryViewer(true);
            }

        }
    );

}

if (happyBirthdayBtn) {

    happyBirthdayBtn.addEventListener(
        "click",
        () => {

            currentGalleryIndex = 0;
            updateGalleryViewer(true);

            if (galleryViewerImage) {
                galleryViewerImage.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

        }
    );

}

updateGalleryViewer();

galleryImages.forEach(img => {

    img.addEventListener("click", () => {

        if (
            lightbox &&
            lightboxImage
        ) {

            lightbox.classList.add(
                "active"
            );

            lightboxImage.src =
                img.src;

        }

    });

});

if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        () => {

            if (lightbox) {

                lightbox.classList.remove(
                    "active"
                );

            }

        }
    );

}

if (lightbox) {

    lightbox.addEventListener(
        "click",
        (e) => {

            if (
                e.target === lightbox
            ) {

                lightbox.classList.remove(
                    "active"
                );

            }

        }
    );

}

// =====================================
// ESC CLOSE
// =====================================

document.addEventListener(
"keydown",
(e) => {

    if (
        e.key === "Escape" &&
        lightbox
    ) {

        lightbox.classList.remove(
            "active"
        );

    }

}

);

// =====================================
// FLOATING PARTICLES
// =====================================

const particlesContainer =
document.getElementById(
"particlesContainer"
);

function createParticle() {

    if (!particlesContainer) return;

    const particle =
        document.createElement(
            "span"
        );

    particle.classList.add(
        "particle"
    );

    particle.style.left =
        Math.random() * 100 + "%";

    particle.style.animationDuration =
        (8 + Math.random() * 8) + "s";

    particle.style.opacity =
        Math.random();

    particlesContainer.appendChild(
        particle
    );

    setTimeout(() => {

        particle.remove();

    }, 16000);

}

setInterval(
createParticle,
500
);

// =====================================
// CONFETTI
// =====================================

const canvas =
document.getElementById(
"confettiCanvas"
);

const celebrateBtn =
document.getElementById(
"celebrateBtn"
);

let confettiRunning = false;

if (canvas) {

    const ctx =
        canvas.getContext("2d");

    function resizeCanvas() {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;

    }

    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );

    const confetti = [];

    function launchConfetti() {

        confetti.length = 0;

        for (
            let i = 0;
            i < 200;
            i++
        ) {

            confetti.push({

                x:
                    Math.random()
                    * canvas.width,

                y:
                    Math.random()
                    * canvas.height
                    - canvas.height,

                size:
                    Math.random() * 8 + 4,

                speed:
                    Math.random() * 4 + 2,

                color:
                    `hsl(${Math.random() * 360},100%,60%)`

            });

        }

        if (!confettiRunning) {

            confettiRunning = true;

            animateConfetti();

        }

    }

    function animateConfetti() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        confetti.forEach(c => {

            ctx.fillStyle =
                c.color;

            ctx.fillRect(
                c.x,
                c.y,
                c.size,
                c.size
            );

            c.y += c.speed;

            c.x +=
                Math.sin(c.y * 0.02);

        });

        requestAnimationFrame(
            animateConfetti
        );

    }

    if (celebrateBtn) {

        celebrateBtn.addEventListener(
            "click",
            () => {

                launchConfetti();

                startGalleryCelebration();

                celebrateBtn.innerText =
                    "🎉 Happy Birthday Jittu 🎉";

            }
        );

    }

}

// =====================================
// CONSOLE MESSAGE
// =====================================

console.log(`

🎂 Happy Birthday Jittu ❤️
Built With Friendship & Memories
================================

`);
