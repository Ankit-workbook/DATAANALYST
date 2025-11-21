document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loadingScreen");
    const heroHeadline = document.getElementById("typedHeadline");
    const dataCounter = document.getElementById("dataCounter");
    const metricCounters = document.querySelectorAll(".metric-value");
    const progressItems = document.querySelectorAll(".progress-item");
    const skillNodes = document.querySelectorAll(".skill-node");
    const projectCards = document.querySelectorAll(".project-card");
    const skillDetail = document.getElementById("skillDetail");
    const resetFilterBtn = document.getElementById("resetFilter");
    const backToTopBtn = document.getElementById("backToTop");
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    const commandConsole = document.getElementById("commandConsole");
    const consoleBody = document.getElementById("consoleBody");
    const closeConsole = document.getElementById("closeConsole");
    const currentYear = document.getElementById("currentYear");
    const contactTerminal = document.querySelector(".contact-terminal");
    const cursorTrail = document.getElementById("cursorTrail");
    const heroVisual = document.querySelector(".hero-visual");
    const heroValueElements = document.querySelectorAll("[data-hero-value]");
    const domainCtx = document.getElementById("projectDomainChart");

    let animationFrame;
    let consoleActive = false;
    let heroTypingTimeout;
    let domainChart;
    let heroVisualAnimated = false;

    window.setTimeout(() => {
        loadingScreen.classList.add("fade-out");
        window.setTimeout(() => loadingScreen.remove(), 900);
    }, 1200);

    // Initialize AOS only if it's loaded
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: false,
            duration: 900,
            easing: "ease-out-cubic"
        });
    }

    const animateNumericValue = (element, targetValue, { duration = 1600, prefix = "", suffix = "", decimals = 0 } = {}) => {
        const formatter = new Intl.NumberFormat(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        const startValue = 0;
        const startTime = performance.now();

        const step = now => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = startValue + (targetValue - startValue) * eased;
            element.textContent = `${prefix}${formatter.format(current)}${suffix}`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    };

    const seedHeroValues = () => {
        heroValueElements.forEach(element => {
            const decimals = parseInt(element.dataset.heroDecimals || "0", 10);
            const formatter = new Intl.NumberFormat(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
            element.textContent = `${element.dataset.heroPrefix || ""}${formatter.format(0)}${element.dataset.heroSuffix || ""}`;
        });
    };

    seedHeroValues();

    const startHeroVisual = () => {
        if (heroVisualAnimated) {
            return;
        }
        heroVisualAnimated = true;
        if (heroVisual) {
            heroVisual.classList.add("active");
        }
        heroValueElements.forEach(element => {
            const targetValue = parseFloat(element.dataset.heroValue);
            if (Number.isNaN(targetValue)) {
                return;
            }
            animateNumericValue(element, targetValue, {
                duration: 1600,
                prefix: element.dataset.heroPrefix || "",
                suffix: element.dataset.heroSuffix || "",
                decimals: parseInt(element.dataset.heroDecimals || "0", 10)
            });
        });
    };

    if (heroVisual) {
        // Start animation immediately after a short delay
        setTimeout(() => {
            startHeroVisual();
        }, 1500);
        
        // Also use IntersectionObserver as fallback
        const heroObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startHeroVisual();
                    heroObserver.disconnect();
                }
            });
        }, { threshold: 0.1 });

        heroObserver.observe(heroVisual);
    }

// ============================================
    // TYPING ANIMATION - WORD BY WORD
    // ============================================
    
    console.log("===== TYPING ANIMATION STARTING =====");
    console.log("Hero headline element:", heroHeadline);
    
    if (heroHeadline) {
        let words = ["DATA", "ANALYST", "BUSINESS", "ANALYST"];
        let currentIndex = 0;
        
        function showNextWord() {
            if (currentIndex < 2) {
                // Show DATA ANALYST
                heroHeadline.textContent = words.slice(0, currentIndex + 1).join(' ');
                console.log("Showing:", heroHeadline.textContent);
                currentIndex++;
                setTimeout(showNextWord, 800);
            } else if (currentIndex === 2) {
                // Wait, then clear
                setTimeout(() => {
                    heroHeadline.textContent = "";
                    console.log("Cleared");
                    currentIndex++;
                    setTimeout(showNextWord, 300);
                }, 2000);
            } else if (currentIndex < 6) {
                // Show BUSINESS ANALYST
                let businessWords = ["BUSINESS", "ANALYST"];
                let businessIndex = currentIndex - 3;
                heroHeadline.textContent = businessWords.slice(0, businessIndex + 1).join(' ');
                console.log("Showing:", heroHeadline.textContent);
                currentIndex++;
                setTimeout(showNextWord, 800);
            } else {
                // Reset and loop
                setTimeout(() => {
                    heroHeadline.textContent = "";
                    currentIndex = 0;
                    setTimeout(showNextWord, 300);
                }, 2000);
            }
        }
        
        // Start immediately
        showNextWord();
    } else {
        console.error("ERROR: Hero headline NOT FOUND!");
    }

    const updateDataCounter = () => {
        const maxDataPoints = 240000;
        const scrollFactor = Math.min(window.scrollY, 2600);
        const computed = Math.floor(scrollFactor * 120);
        const value = Math.min(computed, maxDataPoints);
        dataCounter.textContent = value.toLocaleString();
        animationFrame = window.requestAnimationFrame(updateDataCounter);
    };

    animationFrame = window.requestAnimationFrame(updateDataCounter);

    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetValue = parseFloat(element.dataset.count);
                const prefix = element.dataset.prefix || "";
                const suffix = element.dataset.suffix || "";
                const duration = 1800;
                const step = timestamp => {
                    if (!element._startTime) {
                        element._startTime = timestamp;
                    }
                    const progress = Math.min((timestamp - element._startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = targetValue >= 1 ? Math.floor(eased * targetValue) : (eased * targetValue).toFixed(1);
                    element.textContent = `${prefix}${targetValue >= 1000 ? Math.floor(current).toLocaleString() : current}${suffix}`;
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                };
                window.requestAnimationFrame(step);
                counterObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    metricCounters.forEach(counter => counterObserver.observe(counter));

    const progressObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressValue = entry.target.dataset.progress;
                const bar = entry.target.querySelector(".progress-bar span");
                bar.style.width = `${progressValue}%`;
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    progressItems.forEach(item => progressObserver.observe(item));

    function renderDomainChart() {
        if (!domainCtx || typeof Chart === "undefined") {
            return;
        }
        const styles = window.getComputedStyle(document.body);
    const legendColor = styles.getPropertyValue("--text-secondary").trim() || "#64748b";
    const borderColor = styles.getPropertyValue("--bg-secondary").trim() || "rgba(10, 14, 39, 0.9)";

        if (domainChart) {
            domainChart.options.plugins.legend.labels.color = legendColor;
            domainChart.data.datasets[0].borderColor = borderColor;
            domainChart.update();
            return;
        }

        domainChart = new Chart(domainCtx, {
            type: "doughnut",
            data: {
                labels: ["Retail Operations", "Financial Services", "Urban Mobility"],
                datasets: [{
                    data: [42, 35, 23],
                    backgroundColor: [
                        "rgba(0, 217, 255, 0.85)",
                        "rgba(124, 58, 237, 0.85)",
                        "rgba(16, 185, 129, 0.85)"
                    ],
                    borderColor,
                    borderWidth: 3,
                    hoverOffset: 16
                }]
            },
            options: {
                responsive: true,
                cutout: "62%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: legendColor,
                            padding: 18,
                            font: { family: "Inter" }
                        }
                    }
                }
            }
        });
    }

    if (window.tsParticles) {
        window.tsParticles.load("tsparticles", {
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "light" },
                    resize: true
                },
                modes: {
                    light: {
                        area: {
                            gradient: {
                                start: "#00d9ff",
                                stop: "#7c3aed"
                            }
                        },
                        radius: 160
                    }
                }
            },
            particles: {
                color: { value: "#00d9ff" },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: { default: "out" },
                    speed: 0.6
                },
                number: { value: 60, density: { enable: true, area: 800 } },
                opacity: { value: 0.3 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } },
                links: {
                    enable: true,
                    distance: 130,
                    color: "#7c3aed",
                    opacity: 0.15,
                    width: 1
                }
            },
            detectRetina: true
        });
    }

    renderDomainChart();

    const createCursorTrail = () => {
        const points = 12;
        const fragments = [];
        for (let i = 0; i < points; i += 1) {
            const span = document.createElement("span");
            span.style.position = "absolute";
            span.style.width = "8px";
            span.style.height = "8px";
            span.style.borderRadius = "50%";
            span.style.background = i % 2 === 0 ? "rgba(0, 217, 255, 0.35)" : "rgba(124, 58, 237, 0.35)";
            span.style.pointerEvents = "none";
            span.style.transform = "translate(-50%, -50%)";
            cursorTrail.appendChild(span);
            fragments.push(span);
        }

        let positions = Array(points).fill({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        window.addEventListener("pointermove", event => {
            positions = [{ x: event.clientX, y: event.clientY }, ...positions.slice(0, points - 1)];
            fragments.forEach((fragment, index) => {
                const delay = index * 0.04;
                fragment.style.transition = `transform ${0.25 + delay}s ease-out`;
                fragment.style.transform = `translate(${positions[index].x}px, ${positions[index].y}px)`;
            });
        });
    };

    createCursorTrail();

    const highlightSkills = skills => {
        const normalized = skills.map(skill => skill.trim());
        projectCards.forEach(card => {
            const cardSkills = card.dataset.skills.split(",").map(item => item.trim());
            const hasOverlap = normalized.some(skill => cardSkills.includes(skill));
            card.classList.toggle("highlighted", hasOverlap);
        });

        skillNodes.forEach(node => {
            const skill = node.dataset.skill.trim();
            node.classList.toggle("active", normalized.includes(skill));
        });
    };

    const updateSkillDetail = ({ title, level, projects }) => {
        skillDetail.innerHTML = `<h3>${title}</h3><p>Proficiency Level: <strong>${level}</strong></p><p>Deployed in: <strong>${projects}</strong></p>`;
    };

    projectCards.forEach(card => {
        card.addEventListener("click", () => {
            const skills = card.dataset.skills.split(",");
            highlightSkills(skills);
            updateSkillDetail({
                title: card.querySelector("h3").textContent,
                level: "Project Skill Map",
                projects: "Highlights skills powering this case study."
            });
        });

        card.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                card.click();
            }
        });
    });

    skillNodes.forEach(node => {
        node.addEventListener("click", () => {
            const skill = node.dataset.skill;
            highlightSkills([skill]);
            updateSkillDetail({
                title: node.textContent,
                level: node.dataset.level,
                projects: node.dataset.projects
            });
        });

        node.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                node.click();
            }
        });
    });

    resetFilterBtn.addEventListener("click", () => {
        projectCards.forEach(card => card.classList.remove("highlighted"));
        skillNodes.forEach(node => node.classList.remove("active"));
        skillDetail.innerHTML = "<h3>Skill Intelligence</h3><p>Select a skill or project to reveal how it powers measurable outcomes.</p>";
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 420) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => navLinks.classList.remove("open"));
    });

    currentYear.textContent = new Date().getFullYear();

    if (contactTerminal) {
        contactTerminal.addEventListener("submit", event => {
            event.preventDefault();
            const submitButton = contactTerminal.querySelector("button[type='submit']");
            submitButton.disabled = true;
            submitButton.textContent = "Transmitting...";
            window.setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = "Transmit Brief";
                contactTerminal.reset();
                alert("Brief received. Ankit will follow up shortly.");
            }, 1200);
        });
    }

    const renderConsoleData = () => {
        const rows = [
            "> EXEC SUMMARY",
            "|_ ROI_PROGRAM           : 340%",
            "|_ ANNUALIZED_SAVINGS    : $2.8M",
            "|_ SEGMENTED_INVESTORS   : 12,000+",
            "|_ OPTIMIZED_RIDES       : 100,000+",
            "|_ ANALYTICS_STACK       : Python · SQL · Tableau · Power BI",
            "|_ CERTIFICATIONS        : IBM · Google · Microsoft",
            "> engage_collaboration('Big Four Internship Track');"
        ];
        consoleBody.textContent = rows.join("\n");
    };

    const toggleConsole = () => {
        if (consoleActive) {
            commandConsole.setAttribute("hidden", "");
            consoleActive = false;
        } else {
            renderConsoleData();
            commandConsole.removeAttribute("hidden");
            consoleActive = true;
        }
    };

    document.addEventListener("keydown", event => {
        if (event.key === "`" && !event.metaKey && !event.ctrlKey && event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA") {
            event.preventDefault();
            toggleConsole();
        }
    });

    closeConsole.addEventListener("click", toggleConsole);

    window.addEventListener("beforeunload", () => {
        window.cancelAnimationFrame(animationFrame);
        window.clearTimeout(heroTypingTimeout);
    });
});
