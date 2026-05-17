document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MOBILE MENU TOGGLE
       ========================================================================== */
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('is-open');
            const isOpen = navMenu.classList.contains('is-open');
            
            // Switch hamburger icon to close icon
            const icon = mobileToggle.querySelector('i');
            if (isOpen) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
        
        // Close menu when clicking navigation link
        const navLinks = navMenu.querySelectorAll('.nav-link, .nav-btn-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('is-open');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    /* ==========================================================================
       2. ACTIVE MENU SCROLL SPY
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset header height
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    /* ==========================================================================
       3. SUGGESTIONS TEXTAREA CHARACTER COUNTER
       ========================================================================== */
    const suggestionsInput = document.getElementById('suggestions');
    const charCountDisplay = document.getElementById('charCount');
    
    if (suggestionsInput && charCountDisplay) {
        suggestionsInput.addEventListener('input', () => {
            const length = suggestionsInput.value.length;
            charCountDisplay.textContent = length;
            
            // Subtle color shift when reaching limit
            if (length >= 180) {
                charCountDisplay.style.color = 'var(--color-error)';
            } else if (length >= 150) {
                charCountDisplay.style.color = 'var(--color-accent)';
            } else {
                charCountDisplay.style.color = 'var(--color-text-muted)';
            }
        });
    }

    /* ==========================================================================
       4. FORM FIELD DEFINITIONS & REGEX VALIDATION
       ========================================================================== */
    const form = document.getElementById('travelForm');
    
    const userName = document.getElementById('userName');
    const userPhone = document.getElementById('userPhone');
    const userEmail = document.getElementById('userEmail');
    const userAddress = document.getElementById('userAddress');
    const tourDate = document.getElementById('tourDate');
    
    // Explicit Date boundaries check
    const minHolidayDate = new Date('2027-01-15');
    const maxHolidayDate = new Date('2027-03-01');
    
    // Taiwanese Phone regex:
    // Mobile formats: 0912-345-678 or 0912345678
    // Landline formats: 02-2345-6789, 02-23456789, 03-1234567, 03-1234-5678
    const phoneRegex = /^(09[0-9]{8}|09[0-9]{2}-[0-9]{3}-[0-9]{3}|0[2-8]-[0-9]{3,4}-[0-9]{4}|0[2-8][0-9]{7,8})$/;
    
    // Email regex (standard RFC 5322)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Helper functions to show success / error
    const showValid = (element) => {
        const formGroup = element.closest('.form-group');
        formGroup.classList.remove('is-invalid');
        formGroup.classList.add('is-valid');
    };
    
    const showInvalid = (element) => {
        const formGroup = element.closest('.form-group');
        formGroup.classList.remove('is-valid');
        formGroup.classList.add('is-invalid');
    };
    
    const clearStatus = (element) => {
        const formGroup = element.closest('.form-group');
        formGroup.classList.remove('is-valid', 'is-invalid');
    };

    // Live validation rules
    const validateName = () => {
        const value = userName.value.trim();
        if (value.length < 2) {
            showInvalid(userName);
            return false;
        }
        showValid(userName);
        return true;
    };
    
    const validatePhone = () => {
        const value = userPhone.value.trim();
        if (!phoneRegex.test(value)) {
            showInvalid(userPhone);
            return false;
        }
        showValid(userPhone);
        return true;
    };
    
    const validateEmail = () => {
        const value = userEmail.value.trim();
        if (!emailRegex.test(value)) {
            showInvalid(userEmail);
            return false;
        }
        showValid(userEmail);
        return true;
    };
    
    const validateAddress = () => {
        const value = userAddress.value.trim();
        if (value.length < 6) {
            showInvalid(userAddress);
            return false;
        }
        showValid(userAddress);
        return true;
    };
    
    const validateTourSelect = () => {
        const selectedRadio = form.querySelector('input[name="selectTour"]:checked');
        const radioGroup = document.getElementById('group-tour');
        if (!selectedRadio) {
            radioGroup.classList.add('is-invalid');
            return false;
        }
        radioGroup.classList.remove('is-invalid');
        return true;
    };
    
    const validateTourDate = () => {
        const dateValue = tourDate.value;
        if (!dateValue) {
            showInvalid(tourDate);
            return false;
        }
        
        const inputDate = new Date(dateValue);
        // Compare values
        if (inputDate < minHolidayDate || inputDate > maxHolidayDate) {
            showInvalid(tourDate);
            return false;
        }
        
        showValid(tourDate);
        return true;
    };

    // Attach listeners for interactive real-time response
    userName.addEventListener('input', validateName);
    userName.addEventListener('blur', validateName);
    
    userPhone.addEventListener('input', validatePhone);
    userPhone.addEventListener('blur', validatePhone);
    
    userEmail.addEventListener('input', validateEmail);
    userEmail.addEventListener('blur', validateEmail);
    
    userAddress.addEventListener('input', validateAddress);
    userAddress.addEventListener('blur', validateAddress);
    
    tourDate.addEventListener('change', validateTourDate);
    tourDate.addEventListener('blur', validateTourDate);
    
    // Radio selection cards change listener
    const tourRadios = form.querySelectorAll('input[name="selectTour"]');
    tourRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            validateTourSelect();
        });
    });

    /* ==========================================================================
       5. FORM SUBMISSION HANDLER
       ========================================================================== */
    const submitBtn = document.getElementById('submitBtn');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Block direct refresh
        
        // Trigger verification across all fields
        const isNameOk = validateName();
        const isPhoneOk = validatePhone();
        const isEmailOk = validateEmail();
        const isAddressOk = validateAddress();
        const isTourOk = validateTourSelect();
        const isDateOk = validateTourDate();
        
        const isFormValid = isNameOk && isPhoneOk && isEmailOk && isAddressOk && isTourOk && isDateOk;
        
        if (!isFormValid) {
            // Find first erroneous group and scroll to it smoothly
            const firstErrorGroup = form.querySelector('.is-invalid, .form-group.is-invalid');
            if (firstErrorGroup) {
                firstErrorGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Temporary slight wiggle attention call
                firstErrorGroup.style.animation = 'shakeError 0.35s ease-in-out';
                setTimeout(() => {
                    firstErrorGroup.style.animation = '';
                }, 350);
            }
            return;
        }
        
        // Form is perfectly valid! Execute loading phase
        submitBtn.classList.add('is-loading');
        
        // Simulate API network latency
        setTimeout(() => {
            submitBtn.classList.remove('is-loading');
            
            // Extract selected itinerary text mapping
            const selectedRadio = form.querySelector('input[name="selectTour"]:checked');
            let itineraryName = "";
            switch (selectedRadio.value) {
                case "A":
                    itineraryName = "行程 A：冬日雪祭與極致溫泉五日遊";
                    break;
                case "B":
                    itineraryName = "行程 B：霓虹聖誕與都市時尚六日遊";
                    break;
                case "C":
                    itineraryName = "行程 C：美食秘境與歷史文青五日遊";
                    break;
            }
            
            // Format output date display nicely
            const rawDate = new Date(tourDate.value);
            const formattedDate = `${rawDate.getFullYear()} 年 ${rawDate.getMonth() + 1} 月 ${rawDate.getDate()} 日`;
            
            // Fill Modal elements with input values
            document.getElementById('summaryName').textContent = userName.value.trim();
            document.getElementById('summaryTour').textContent = itineraryName;
            document.getElementById('summaryDate').textContent = formattedDate;
            document.getElementById('summaryEmail').textContent = userEmail.value.trim();
            
            // Open Modal
            const successModal = document.getElementById('successModal');
            successModal.classList.add('is-active');
            
            // Reset form controls
            form.reset();
            
            // Remove success styles across all wrappers
            const allFormGroups = form.querySelectorAll('.form-group');
            allFormGroups.forEach(group => {
                group.classList.remove('is-valid', 'is-invalid');
            });
            
            // Reset word counter
            charCountDisplay.textContent = "0";
            charCountDisplay.style.color = "var(--color-text-muted)";
            
        }, 1500); // 1.5 seconds simulated call delay
    });

    /* ==========================================================================
       6. SUCCESS MODAL CONTROL
       ========================================================================== */
    const successModal = document.getElementById('successModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const btnModalCloseDone = document.getElementById('btnModalCloseDone');
    const btnCopyCoupon = document.getElementById('btnCopyCoupon');
    const couponCode = document.getElementById('couponCode');
    
    const closeModal = () => {
        successModal.classList.remove('is-active');
    };
    
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (btnModalCloseDone) btnModalCloseDone.addEventListener('click', closeModal);
    
    // Close modal when clicking dark overlay outside card
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeModal();
            }
        });
    }
    
    // Copy Coupon Code feature
    if (btnCopyCoupon && couponCode) {
        btnCopyCoupon.addEventListener('click', () => {
            const textToCopy = couponCode.textContent.trim();
            
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Update button UI state to show visual copy success feedback
                    btnCopyCoupon.innerHTML = '<i class="fa-solid fa-circle-check"></i> 已複製！';
                    btnCopyCoupon.classList.add('copied');
                    
                    // Revert UI state back after 2 seconds
                    setTimeout(() => {
                        btnCopyCoupon.innerHTML = '<i class="fa-regular fa-copy"></i> 複製';
                        btnCopyCoupon.classList.remove('copied');
                    }, 2000);
                })
                .catch(err => {
                    console.error('折扣碼複製失敗: ', err);
                });
        });
    }
});
