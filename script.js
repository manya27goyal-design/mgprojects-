// Interactive Scripts for V Mighty Agro Limited
// This file contains all client-side JavaScript functionality.

// Crop Technical Specifications Database
const CROP_DATABASE = {
    'cucumber': {
        name: 'Premium Cucumber',
        category: 'Vegetable (Protected Farming)',
        description: 'Cultivated in our specialized sandy-clay soil matrices within naturally ventilated dome polyhouses. Our vertical trellising lines ensure straight growth geometry and complete avoidance of ground rot.',
        cultivation: 'Vertical trellis support in climate-controlled domes',
        tds: '550 - 700 ppm (RO Regulated)',
        harvest: 'Daily harvest cycles (45-50 days from seeding)',
        packaging: 'Plastic crates / Individual shrink-wrap trays (custom wholesale bounds)',
        keyEdge: 'Pesticide-free biological defense, uniform straight geometry, highly hydrated crisp texture.'
    },
    'capsicum': {
        name: 'Coloured Capsicum (Bell Peppers)',
        category: 'Vegetable (Protected Farming)',
        description: 'Vibrant Red, Yellow, and Orange sweet peppers grown under micro-nutrient drip feeding. The domes shield them from desert UV scorch, producing uniform thick walls and sweet crisp flesh.',
        cultivation: 'Drip-fertigation in high-span dome polyhouses',
        tds: '650 - 800 ppm (Precision Controlled)',
        harvest: 'Continuous cycle with bi-weekly selective harvesting',
        packaging: '5 kg or 10 kg high-strength corrugated cardboard cartons',
        keyEdge: 'Consistent blocky 4-lobe shape, high shelf life, premium skin gloss, thick wall texture.'
    },
    'cherry-tomatoes': {
        name: 'Sweet Cherry Tomatoes',
        category: 'Vegetable (Protected Farming)',
        description: 'Cultivated on vertical high-wire setups with customized relative humidity limits to maximize brix sugar content and develop an outstanding natural sweetness.',
        cultivation: 'High-wire crop guidance under shade automation',
        tds: '800 - 1000 ppm (Enhanced Minerals)',
        harvest: 'Weekly harvests (bunches selected at red vine-ripe stage)',
        packaging: '250g/500g transparent PET clamshell punnets',
        keyEdge: 'High sugar profile (brix), crack-resistant skin, clean cluster geometry, high lycopene concentration.'
    },
    'zucchini': {
        name: 'Exotic Zucchini (Green & Gold)',
        category: 'Vegetable (Protected Farming)',
        description: 'Grown inside pristine soil-beds. Polyhouse structures shield zucchini flowers from extreme desert winds, allowing perfect pollination and scratch-free growth.',
        cultivation: 'Ground-mound rows with inline drip irrigation',
        tds: '600 - 750 ppm',
        harvest: 'Daily early morning harvesting to guarantee tenderness',
        packaging: 'Safe pack corrugated nested boxes (sorted by size)',
        keyEdge: 'Tenderness at small diameters, zero wind friction scarring, uniform green/gold pigmentation.'
    },
    'broccoli': {
        name: 'Nutritive Broccoli',
        category: 'Vegetable (Protected Farming)',
        description: 'Cultivated during temperate cycles under shading screens to shield the heads from scorching desert heat. Grown soil-free to prevent sand infiltration in the florets.',
        cultivation: 'Micro-climate cooling dome beds',
        tds: '700 - 850 ppm',
        harvest: 'Single-head select harvesting (cut with 15cm stalks)',
        packaging: 'Reusable plastic crates packed with food-grade ice',
        keyEdge: 'Densely compact crowns, deep blue-green pigmentation, 100% sand-free and ready for shipping.'
    },
    'lettuce': {
        name: 'Crisp Iceberg & Romaine Lettuce',
        category: 'Vegetable (Protected Farming)',
        description: 'Grown on clean raised frames away from desert dust. We regulate moisture and air flow to eliminate root rot and guarantee fresh, crisp leaves.',
        cultivation: 'Raised-bed soil-less setup with micro-misting',
        tds: '450 - 600 ppm (Low TDS RO water)',
        harvest: 'Harvested weekly at crisp pre-dawn temperatures',
        packaging: 'Individual micro-perforated flow-wrap bags',
        keyEdge: 'Dirt-free clean leaves, zero bitterness, crispy sweet foliage, immediate hydro-cooling post-harvest.'
    },
    'dutch-rose': {
        name: 'Premium Dutch Rose',
        category: 'Flower (Protected Floriculture)',
        description: 'Our pride. Grown using custom soft water (TDS controlled via our RO plant) to stimulate healthy bud growth and produce long, robust stems with high petal count.',
        cultivation: 'Optimized raised beds with dynamic relative humidity systems',
        tds: '400 - 550 ppm (RO Purified)',
        harvest: 'Daily morning harvests at tight bud-burst stage',
        packaging: 'Bunch sleeves in specialized upright rose transit boxes',
        keyEdge: 'Stem lengths 40-70cm, high petal density, vibrant deep coloration, extended vase life.'
    },
    'gerbera': {
        name: 'Vibrant Gerbera Daisies',
        category: 'Flower (Protected Floriculture)',
        description: 'Cultivated in customized pathogen-free soil-less substrates. The dome structures eliminate rain splash damage and insect bites, yielding flawless blossoms.',
        cultivation: 'Raised soil-less troughs with automatic drip-fertigation',
        tds: '500 - 650 ppm',
        harvest: 'Harvested thrice a week (cut at full petal expansion)',
        packaging: 'Cardboard grids protecting individual flower heads',
        keyEdge: 'Perfect stem straightness, thick disc symmetry, long vase shelf life, clean colors.'
    },
    'orchids': {
        name: 'Exotic Dendrobium Orchids',
        category: 'Flower (Protected Floriculture)',
        description: 'Grown under custom microclimate misting protocols that duplicate humid tropical canopy conditions. Supported by ultra-purified RO water to protect delicate root systems.',
        cultivation: 'Suspended mesh platforms with automated humidity nozzles',
        tds: '250 - 350 ppm (Ultra-Low TDS RO)',
        harvest: 'Continuous cycle based on spike development',
        packaging: 'Spikes placed in individual water vials, shipped in insulated boxes',
        keyEdge: 'Exotic coloration, large spike flower count, robust stems, outstanding commercial florist grade.'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 0. Splash Screen dismiss logic
    const splashScreen = document.getElementById('splashScreen');
    const enterBtn = document.getElementById('enterBtn');
    if (sessionStorage.getItem('splashEntered') === 'true') {
        if (splashScreen) {
            splashScreen.style.display = 'none';
        }
        document.body.style.overflow = '';
    } else {
        document.body.style.overflow = 'hidden';
        if (enterBtn && splashScreen) {
            enterBtn.addEventListener('click', () => {
                splashScreen.classList.add('fade-out');
                document.body.style.overflow = '';
                sessionStorage.setItem('splashEntered', 'true');
            });
        }
    }

    // 1. Sticky Header scroll handling
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Nav Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('open');
        mainNav.classList.toggle('open');
    });

    // Close mobile nav when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('open');
            mainNav.classList.remove('open');
        });
    });

    // 3. Highlight Nav Link on Scroll (Scrollspy)
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset + 120; // offset header height

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.main-nav a[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.main-nav a[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    });

    // 4. Produce Filter logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cropCards = document.querySelectorAll('.crop-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            cropCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Card transitions
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Close crop modal on clicking outside content
    const cropModal = document.getElementById('cropModal');
    cropModal.addEventListener('click', (e) => {
        if (e.target === cropModal) {
            closeCropModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cropModal.classList.contains('open')) {
            closeCropModal();
        }
    });

    // Bind inquiry form submission inside DOMContentLoaded
    document.getElementById('inquiryForm').addEventListener('submit', handleInquirySubmit);
});

// 5. Open Crop Specification Modal
function openCropModal(cropKey) {
    const cropData = CROP_DATABASE[cropKey];
    if (!cropData) return;

    const modalBody = document.getElementById('modalBody');
    const cropModal = document.getElementById('cropModal');

    modalBody.innerHTML = `
        <div class="modal-header-desc">
            <span class="subtitle">${cropData.category}</span>
            <h2>${cropData.name}</h2>
            <p>${cropData.description}</p>
        </div>
        
        <div class="modal-specs">
            <div class="spec-item">
                <h5>Growing Method</h5>
                <p>${cropData.cultivation}</p>
            </div>
            <div class="spec-item">
                <h5>Target Water TDS</h5>
                <p>${cropData.tds}</p>
            </div>
            <div class="spec-item">
                <h5>Harvest Frequency</h5>
                <p>${cropData.harvest}</p>
            </div>
            <div class="spec-item">
                <h5>Wholesale Packaging</h5>
                <p>${cropData.packaging}</p>
            </div>
        </div>
        
        <div style="margin-top: 2rem; border-top: 1px solid rgba(15, 56, 35, 0.1); padding-top: 1.5rem;">
            <h4 style="font-size: 1rem; color: var(--color-primary); margin-bottom: 0.5rem;">The V Mighty Quality Standard:</h4>
            <p style="font-size: 0.9rem; font-style: italic;">"${cropData.keyEdge}"</p>
        </div>
    `;

    cropModal.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent background scroll
}

// Close Crop Specification Modal
function closeCropModal() {
    const cropModal = document.getElementById('cropModal');
    cropModal.classList.remove('open');
    document.body.style.overflow = ''; // restore scroll
}

// 6. Handle Contact B2B Inquiry Form Submission
// 6. Handle Contact B2B Inquiry Form Submission
function handleInquirySubmit(event) {
    console.log('Inquiry form submitted'); // debug
    event.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const companyName = document.getElementById('companyName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const interest = document.getElementById('interest').value;
    const message = document.getElementById('message').value.trim();

    // Ensure an option other than the placeholder is selected
    if (!interest) {
        showFormFeedback('Please select an Area of Interest.', 'error');
        return;
    }

    // Basic Validation Check
    if (!fullName || !companyName || !email || !phone || !interest || !message) {
        showFormFeedback('Please fill out all required fields.', 'error');
        return;
    }

    // Email Pattern Check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showFormFeedback('Please enter a valid email address.', 'error');
        return;
    }

    // Build Gmail compose URL
    const subject = encodeURIComponent(`New inquiry from ${fullName}`);
    const body = encodeURIComponent(`Full Name: ${fullName}\nCompany: ${companyName}\nEmail: ${email}\nPhone: ${phone}\nInterest: ${interest}\nMessage: ${message}`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=vmightyagro@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
    showFormFeedback('Your email draft has been opened in Gmail.', 'info');
    document.getElementById('inquiryForm').reset();
}



// Helper to convert selection keys to readable labels
function getInterestLabel(key) {
    const labels = {
        'wholesale': 'Wholesale Supply Options',
        'retail': 'Supermarket Supply Agreement',
        'export': 'Export Procurement',
        'vendor': 'Vendor Partnerships',
        'corporate': 'General Corporate Inquiry',
        'other': 'Other'
    };
    return labels[key] || 'Inquiry';
}

function showFormFeedback(message, type) {
    const formFeedback = document.getElementById('formFeedback');
    formFeedback.textContent = message;
    // Reset classes
    formFeedback.className = 'form-feedback';
    if (type === 'success') {
        formFeedback.classList.add('success');
    } else if (type === 'info') {
        formFeedback.classList.add('info');
    } else {
        formFeedback.classList.add('error');
    }
}
