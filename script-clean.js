// Portfolio website animations and interactions

document.addEventListener('DOMContentLoaded', function () {
  // Sequential spring blur animation system
  const elementsToAnimate = [
    { selector: '.navbar', delay: 300 },
    { selector: '.hero', delay: 500 },
    { selector: '.video-intro', delay: 700 },
    { selector: '.case-studies', delay: 900 },
    { selector: '.my-products-section', delay: 1100 },
  ];

  // Start sequential animations
  elementsToAnimate.forEach(({ selector, delay }) => {
    const element = document.querySelector(selector);
    if (element) {
      // Apply initial animation class and transitions
      element.classList.add('fade-blur-up');

      // Trigger animation after delay
      setTimeout(() => {
        element.classList.add('animate');
      }, delay);
    }
  });
  // Navbar remains static at top of page; no scroll background behavior

  // Logo click handler for home navigation
  const logoLink = document.querySelector('.logo-link');
  if (logoLink) {
    logoLink.addEventListener('click', function (e) {
      e.preventDefault();
      // Scroll to top of page for home navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Navigation links functionality
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove('active'));

      // Add active class to clicked link
      this.classList.add('active');
    });
  });

  // Mobile menu functionality
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuToggle && mobileMenuOverlay) {
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isActive = mobileMenuToggle.classList.contains('active');

      if (isActive) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (
        mobileMenuOverlay.classList.contains('active') &&
        !mobileMenuOverlay.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Handle mobile nav link clicks
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove active class from all mobile links
        mobileNavLinks.forEach((l) => l.classList.remove('active'));
        // Remove active class from desktop links too
        navLinks.forEach((l) => l.classList.remove('active'));

        // Add active class to clicked mobile link
        this.classList.add('active');

        // Add active class to corresponding desktop link
        const linkText = this.textContent;
        const correspondingDesktopLink = Array.from(navLinks).find(
          (link) => link.textContent === linkText
        );
        if (correspondingDesktopLink) {
          correspondingDesktopLink.classList.add('active');
        }

        // Close mobile menu after selection
        closeMobileMenu();
      });
    });

    function openMobileMenu() {
      mobileMenuToggle.classList.add('active');
      mobileMenuOverlay.classList.add('active');
    }

    function closeMobileMenu() {
      mobileMenuToggle.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
    }
  }

  // Feature flag: Set to true to enable video intro button, false to disable
  const VIDEO_INTRO_ENABLED = false;

  // Video interaction handlers
  const watchBtn = document.querySelector('.watch-btn');
  const videoThumbnail = document.querySelector('.video-thumbnail');
  const videoModal = document.getElementById('video-modal');
  const videoModalClose = document.querySelector('.video-modal-close');
  const videoModalOverlay = document.querySelector('.video-modal-overlay');
  const loomEmbedContainer = document.getElementById('loom-embed-container');

  // Loom video configuration
  const loomVideoId = '2ea578cee6d74116b211a16accde633d';
  const loomVideoUrl = `https://www.loom.com/share/${loomVideoId}`;

  // Loom embed code
  const loomEmbedHTML = `<div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/${loomVideoId}?sid=ff0ac7cc-1a10-474a-877e-26d861031448" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>`;

  // Mobile detection function
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  // Initialize mobile GIF thumbnail if on mobile
  function initializeMobileVideoThumbnail() {
    // No longer replacing thumbnail content on mobile
    // Let CSS handle the custom video-icon.png background
    return isMobileDevice(); // Just return if it's mobile for other logic
  }

  // Function to open video modal
  function openVideoModal() {
    // Add the Loom embed to the container
    loomEmbedContainer.innerHTML = loomEmbedHTML;

    // Show the modal
    videoModal.style.display = 'flex';

    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    // Focus on the close button for accessibility
    setTimeout(() => {
      videoModalClose.focus();
    }, 300);
  }

  // Function to close video modal
  function closeVideoModal() {
    // Hide the modal
    videoModal.style.display = 'none';

    // Remove the embed to stop the video
    loomEmbedContainer.innerHTML = '';

    // Restore body scrolling
    document.body.style.overflow = 'auto';
  }

  // Function to handle video play
  function handleVideoPlay() {
    openVideoModal();
  }

  // Initialize video thumbnail based on device type
  const isMobile = initializeMobileVideoThumbnail();

  // Apply feature flag: disable interactions if flag is off
  if (!VIDEO_INTRO_ENABLED) {
    // Disable watch button
    if (watchBtn) {
      watchBtn.style.pointerEvents = 'none';
      watchBtn.setAttribute('disabled', 'true');
      watchBtn.setAttribute('aria-disabled', 'true');
    }

    // Disable video thumbnail
    if (videoThumbnail) {
      videoThumbnail.style.pointerEvents = 'none';
      videoThumbnail.setAttribute('tabindex', '-1');
      videoThumbnail.setAttribute('aria-disabled', 'true');
    }

    // Disable entire video-intro section on mobile
    const videoIntroSection = document.querySelector('.video-intro');
    if (videoIntroSection) {
      videoIntroSection.style.pointerEvents = 'none';
      videoIntroSection.setAttribute('tabindex', '-1');
      videoIntroSection.setAttribute('aria-disabled', 'true');
    }
  } else {
    // Feature is enabled - add event handlers as normal
    // Add modal event handlers for both mobile and desktop
    // Watch button
    if (watchBtn) {
      watchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        handleVideoPlay();
      });
    }

    // Video thumbnail click
    if (videoThumbnail) {
      videoThumbnail.addEventListener('click', function () {
        handleVideoPlay();
      });

      // Keyboard accessibility for thumbnail
      videoThumbnail.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleVideoPlay();
        }
      });
    }

    // Make entire video-intro section clickable on mobile
    const videoIntroSection = document.querySelector('.video-intro');
    if (videoIntroSection && isMobileDevice()) {
      videoIntroSection.addEventListener('click', function (e) {
        // Only trigger if the click wasn't on the thumbnail (to avoid double-triggering)
        if (!videoThumbnail || !videoThumbnail.contains(e.target)) {
          handleVideoPlay();
        }
      });

      // Add cursor pointer style for mobile
      videoIntroSection.style.cursor = 'pointer';

      // Keyboard accessibility for the entire section on mobile
      videoIntroSection.setAttribute('tabindex', '0');
      videoIntroSection.setAttribute('role', 'button');
      videoIntroSection.setAttribute(
        'aria-label',
        "Play Chan's video introduction"
      );

      videoIntroSection.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleVideoPlay();
        }
      });
    }
  }

  // Modal close event listeners
  if (videoModalClose) {
    videoModalClose.addEventListener('click', closeVideoModal);
  }

  if (videoModalOverlay) {
    videoModalOverlay.addEventListener('click', closeVideoModal);
  }

  // Close modal with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && videoModal.style.display === 'flex') {
      closeVideoModal();
    }
  });

  // Handle window resize to switch between mobile/desktop modes
  let resizeTimeout;
  let wasMobile = isMobile;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      // Reload the page if device type changes to ensure proper initialization
      const currentlyMobile = isMobileDevice();
      if (currentlyMobile !== wasMobile) {
        location.reload();
      }
    }, 250);
  });

  // Case Study Modal Functionality
  const caseStudyModal = document.getElementById('case-study-modal');
  const caseStudyModalOverlay = document.querySelector(
    '.case-study-modal-overlay'
  );
  const caseStudyModalClose = document.querySelector('.case-study-modal-close');

  // Case study data for each card
  const caseStudyData = {
    docswell: {
      logo: 'assets/docswell-exports/product-logo.png',
      company: 'Docswell',
      role: 'Product Designer',
      title:
        'Leading design at Docswell to help them go from MVP to public launch',
      introParagraph:
        'Docswell is a UK-based medtech company that helps medical practices completely digitise their workflow.',
      subheading:
        'Worked on both patient and practitioner portals and prepared them for public release.',
      description: `
        <p style="margin-bottom: 20px;">(AI-generated placeholder) The startup set out to digitise a fragmented patient management process that was largely dependent on manual workflows, legacy software, and inconsistent data entry across clinics. Through early stakeholder interviews with clinicians, administrative staff, and operations managers, it became clear that existing systems created friction at every stage — from patient onboarding and record updates to appointment coordination and follow-ups. These inefficiencies led to duplicated work, increased risk of errors, and limited visibility across teams.</p>
        
        <div class="case-study-images">
          <img src="assets/docswell-exports/docswell-export-dashboard.png" alt="Docswell dashboard" class="case-study-image" data-image-popup="assets/docswell-exports/docswell-export-dashboard.png" />
          <img src="assets/docswell-exports/docswell-export-inbox.png" alt="Docswell inbox" class="case-study-image" data-image-popup="assets/docswell-exports/docswell-export-inbox.png" />
          <img src="assets/docswell-exports/docswell-export-inbox-general.png" alt="Docswell inbox general" class="case-study-image" data-image-popup="assets/docswell-exports/docswell-export-inbox-general.png" />
          <img src="assets/docswell-exports/docswell-export-calendar-event.png" alt="Docswell calendar event" class="case-study-image" data-image-popup="assets/docswell-exports/docswell-export-calendar-event.png" />
          <img src="assets/docswell-exports/docswell-export-calendar-modal.png" alt="Docswell calendar modal" class="case-study-image" data-image-popup="assets/docswell-exports/docswell-export-calendar-modal.png" />
          <img src="assets/docswell-exports/docswell-export-profile-activity.png" alt="Docswell profile activity" class="case-study-image" data-image-popup="assets/docswell-exports/docswell-export-profile-activity.png" />
          <img src="assets/docswell-exports/docswell-export-profile-note.png" alt="Docswell profile note" class="case-study-image" data-image-popup="assets/docswell-exports/docswell-export-profile-note.png" />
        </div>
      `,
    },
    rememberly: {
      logo: '',
      company: 'Rememberly',
      role: 'Founder + Maker',
      title:
        'Designing and developing a mobile app that saves highlights from physical books',
      introParagraph:
        'This is a placeholder sentence for the Rememberly case study.',
      subheading:
        'Worked on the full cycle from concept to development as Im working on launching my first iPhone app',
      description: `
        <p style="margin-bottom: 20px;">(AI-generated placeholder) The original experience for Rememberly, a mobile app designed to save highlights from physical books using a phone camera, was fragmented and unreliable. Early users struggled with inconsistent scan quality, unclear feedback during capture, and a confusing transition between scanning, editing, and saving highlights. Many felt the process interrupted their reading flow, making the app feel heavier than simply jotting notes. Feedback consistently pointed to friction at the exact moment users wanted speed and focus.</p>
        
        <p style="margin-bottom: 20px;">I worked as the sole product designer, collaborating closely with a solo iOS developer and an OCR-focused engineer. I led the end-to-end design process, including problem definition, user interviews, journey mapping, wireframing, and high-fidelity prototyping, while supporting developer handoff. Given tight timelines and limited resources, we followed a lean, iterative approach with short design sprints and frequent validation using real books in real-world reading conditions.</p>
        
        <p>We started by observing how readers naturally highlight and revisit content in physical books, followed by interviews with 5 active readers and 3 students. The main pain points were clear: too much camera friction, low confidence in OCR accuracy, and excessive manual cleanup after scanning. These insights drove a redesigned capture flow that prioritised speed, clear visual feedback, and minimal correction — enabling users to scan, review, and save a highlight in seconds without breaking their reading momentum.</p>
      `,
    },
    jiffyhive: {
      logo: '',
      company: 'Jiffyhive',
      role: 'Founding Designer',
      title: 'Jiffyhive: AI-powered employee hiring platform',
      introParagraph:
        'This is a placeholder sentence for the Jiffyhive case study.',
      subheading: 'Led design while working closely with the co-founders',
      description: `
        <p style="margin-bottom: 20px;">(AI-generated placeholder) The original hiring flow for Jiffyhive, an AI-powered employee hiring platform, was overwhelming for both employers and candidates. Recruiters struggled with long setup times, noisy candidate lists, and little clarity on why certain matches were recommended. Candidates, on the other hand, found the application process repetitive and impersonal, with unclear expectations around role fit and response timelines. As a result, drop-off rates were high and hiring teams relied heavily on manual screening despite the presence of AI.</p>
        
        <p style="margin-bottom: 20px;">I worked as the sole product designer, partnering closely with the founder and a small engineering team. I led discovery, UX research, flow redesign, wireframing, and high-fidelity prototyping, and supported implementation through ongoing design reviews. We followed a lean, outcome-driven process, shipping in small increments and validating assumptions through weekly usability tests with recruiters and job seekers across different company sizes.</p>
        
        <p>We began by mapping the end-to-end hiring journey and interviewing 6 hiring managers and 8 job seekers. The key pain points were clear: too many steps to post a role, low trust in AI recommendations, and poor feedback loops for candidates. These insights informed a redesigned experience that focused on fast role setup, transparent AI matching signals, and clear next-step communication — allowing employers to reach qualified candidates in minutes while giving applicants confidence that their profiles were being evaluated fairly and efficiently.</p>
      `,
    },
  };

  // Function to open case study modal with specific content
  function openCaseStudyModal(caseStudyType) {
    const data = caseStudyData[caseStudyType] || caseStudyData['docswell']; // Fallback to docswell if type not found

    // Update modal content
    const logoElement = document.getElementById('case-study-logo');
    if (data.logo) {
      // If logo URL provided, create img element
      logoElement.innerHTML = `<img src="${data.logo}" alt="${data.company} logo" style="width: 100%; height: 100%; object-fit: cover;" />`;
    } else {
      // Show placeholder background (already styled in CSS)
      logoElement.innerHTML = '';
    }

    document.getElementById('case-study-company-name').textContent =
      data.company;
    document.getElementById('case-study-role').textContent = data.role;
    document.getElementById('case-study-title').textContent = data.title;
    document.getElementById('case-study-intro-paragraph').textContent =
      data.introParagraph || '';

    // Extract paragraphs for Background and Role sections
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data.description;
    const paragraphs = tempDiv.querySelectorAll('p');

    // Extract dashboard image for docswell (first image in the images container)
    const featuredImageContainer = document.getElementById(
      'case-study-featured-image'
    );
    if (caseStudyType === 'docswell') {
      const imagesContainer = tempDiv.querySelector('.case-study-images');
      if (imagesContainer) {
        const firstImage = imagesContainer.querySelector(
          'img[src*="dashboard"]'
        );
        if (firstImage) {
          // Clone and add the dashboard image to featured image container
          const clonedImage = firstImage.cloneNode(true);
          featuredImageContainer.innerHTML = '';
          featuredImageContainer.appendChild(clonedImage);
          // Remove the dashboard image from the original container
          firstImage.remove();
        }
      }
    } else {
      featuredImageContainer.innerHTML = '';
    }

    if (paragraphs.length > 0) {
      // Set background text to first paragraph's text content
      document.getElementById('case-study-background-text').textContent =
        paragraphs[0].textContent;
      paragraphs[0].remove();
    } else {
      document.getElementById('case-study-background-text').textContent = '';
    }

    if (paragraphs.length > 1) {
      // Set role text to second paragraph's text content
      document.getElementById('case-study-role-text').textContent =
        paragraphs[1].textContent;
      paragraphs[1].remove();
    } else {
      // Use placeholder if no second paragraph
      document.getElementById('case-study-role-text').textContent =
        'Placeholder text for the Role section.';
    }

    // Show and populate Solution section for docswell case study
    const solutionSection = document.getElementById(
      'case-study-solution-section'
    );
    if (caseStudyType === 'docswell') {
      solutionSection.style.display = 'flex';
      document.getElementById('case-study-solution-text').textContent =
        'This is a placeholder sentence for the Solution section in the Docswell case study.';
    } else {
      solutionSection.style.display = 'none';
    }

    // Set the remaining content (other paragraphs and images) in description
    document.getElementById('case-study-description').innerHTML =
      tempDiv.innerHTML;

    // Re-attach image popup handlers for dynamically added images (featured image and description images)
    const featuredImage =
      featuredImageContainer.querySelector('[data-image-popup]');
    if (featuredImage) {
      featuredImage.addEventListener('click', function () {
        const imageSrc = this.getAttribute('data-image-popup');
        const imageAlt = this.getAttribute('alt') || '';
        openImagePopup(imageSrc, imageAlt);
      });
    }

    const caseStudyImages = document.querySelectorAll(
      '#case-study-description [data-image-popup]'
    );
    caseStudyImages.forEach((img) => {
      img.addEventListener('click', function () {
        const imageSrc = this.getAttribute('data-image-popup');
        const imageAlt = this.getAttribute('alt') || '';
        openImagePopup(imageSrc, imageAlt);
      });
    });

    // Show modal
    caseStudyModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Get references to modal elements
    const caseStudyModalContainer = document.querySelector(
      '.case-study-modal-container'
    );

    // Function to check if event originated from scrollable container
    const isEventFromScrollableContainer = function (e) {
      if (!caseStudyModalContainer) return false;
      let target = e.target;

      // Walk up the DOM tree to check if we're inside the scrollable container
      while (target && target !== document.body) {
        if (
          target === caseStudyModalContainer ||
          caseStudyModalContainer.contains(target)
        ) {
          return true;
        }
        target = target.parentElement;
      }
      return false;
    };

    // Forward scroll events to popup container when scrolling outside popup
    const forwardScrollToPopupWheel = function (e) {
      // If scroll is from the scrollable container, let it handle naturally
      if (isEventFromScrollableContainer(e)) {
        return;
      }

      // Otherwise, prevent background scroll and forward to popup container
      if (caseStudyModalContainer) {
        e.preventDefault();
        e.stopPropagation();

        // Check boundaries before applying scroll
        const scrollAmount = e.deltaY;
        const currentScroll = caseStudyModalContainer.scrollTop;
        const maxScroll =
          caseStudyModalContainer.scrollHeight -
          caseStudyModalContainer.clientHeight;
        const isAtTop = currentScroll === 0;
        const isAtBottom = currentScroll >= maxScroll - 1;

        // Prevent scroll if trying to scroll beyond boundaries
        if ((isAtTop && scrollAmount < 0) || (isAtBottom && scrollAmount > 0)) {
          return; // Already at limit, don't scroll
        }

        // Apply scroll to the container
        const newScroll = Math.max(
          0,
          Math.min(maxScroll, currentScroll + scrollAmount)
        );
        caseStudyModalContainer.scrollTop = newScroll;
      }
    };

    let touchStartY = 0;
    let touchStartScroll = 0;

    const forwardScrollToPopupTouchStart = function (e) {
      if (caseStudyModalContainer && e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartScroll = caseStudyModalContainer.scrollTop;
      }
    };

    const forwardScrollToPopupTouchMove = function (e) {
      // If scroll is from the scrollable container, let it handle naturally
      if (isEventFromScrollableContainer(e)) {
        return;
      }

      // Otherwise, prevent background scroll and forward to popup container
      if (caseStudyModalContainer && e.touches.length === 1) {
        e.preventDefault();
        e.stopPropagation();

        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        const currentScroll = caseStudyModalContainer.scrollTop;
        const maxScroll =
          caseStudyModalContainer.scrollHeight -
          caseStudyModalContainer.clientHeight;
        const newScroll = touchStartScroll + deltaY;

        // Clamp to boundaries
        const clampedScroll = Math.max(0, Math.min(maxScroll, newScroll));
        caseStudyModalContainer.scrollTop = clampedScroll;
      }
    };

    // Add scroll forwarding to document to catch scrolls anywhere on the page
    // This ensures scrolling anywhere (overlay, modal, or outside) scrolls the popup
    document.addEventListener('wheel', forwardScrollToPopupWheel, {
      passive: false,
    });
    document.addEventListener('touchstart', forwardScrollToPopupTouchStart, {
      passive: true,
    });
    document.addEventListener('touchmove', forwardScrollToPopupTouchMove, {
      passive: false,
    });

    // Store document handlers for cleanup
    document._caseStudyScrollHandlers = {
      wheel: forwardScrollToPopupWheel,
      touchstart: forwardScrollToPopupTouchStart,
      touchmove: forwardScrollToPopupTouchMove,
    };

    // Prevent scroll propagation when container reaches limits
    if (caseStudyModalContainer) {
      let touchStartY = 0;

      const handleWheel = function (e) {
        const container = e.currentTarget;
        const isAtTop = container.scrollTop === 0;
        const isAtBottom =
          container.scrollTop + container.clientHeight >=
          container.scrollHeight - 1;

        // Prevent scroll propagation when at limits
        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      const handleTouchStart = function (e) {
        touchStartY = e.touches[0].clientY;
      };

      const handleTouchMove = function (e) {
        const container = e.currentTarget;
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        const isAtTop = container.scrollTop === 0;
        const isAtBottom =
          container.scrollTop + container.clientHeight >=
          container.scrollHeight - 1;

        // Prevent scroll propagation when at limits
        if ((isAtTop && deltaY < 0) || (isAtBottom && deltaY > 0)) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      // Use wheel event for mouse wheel scrolling
      caseStudyModalContainer.addEventListener('wheel', handleWheel, {
        passive: false,
      });
      caseStudyModalContainer.addEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      caseStudyModalContainer.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });

      // Store the handlers so we can remove them later
      caseStudyModalContainer._scrollHandlers = {
        wheel: handleWheel,
        touchstart: handleTouchStart,
        touchmove: handleTouchMove,
      };
    }
  }

  // Function to close case study modal
  function closeCaseStudyModal() {
    caseStudyModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    // Remove scroll event listeners from container
    const caseStudyModalContainer = document.querySelector(
      '.case-study-modal-container'
    );
    if (caseStudyModalContainer && caseStudyModalContainer._scrollHandlers) {
      caseStudyModalContainer.removeEventListener(
        'wheel',
        caseStudyModalContainer._scrollHandlers.wheel
      );
      caseStudyModalContainer.removeEventListener(
        'touchstart',
        caseStudyModalContainer._scrollHandlers.touchstart
      );
      caseStudyModalContainer.removeEventListener(
        'touchmove',
        caseStudyModalContainer._scrollHandlers.touchmove
      );
      caseStudyModalContainer._scrollHandlers = null;
    }

    // Remove document scroll handlers
    if (document._caseStudyScrollHandlers) {
      document.removeEventListener(
        'wheel',
        document._caseStudyScrollHandlers.wheel
      );
      document.removeEventListener(
        'touchstart',
        document._caseStudyScrollHandlers.touchstart
      );
      document.removeEventListener(
        'touchmove',
        document._caseStudyScrollHandlers.touchmove
      );
      document._caseStudyScrollHandlers = null;
    }
  }

  // Case study card click handlers
  const caseCards = document.querySelectorAll('.case-card');
  caseCards.forEach((card) => {
    card.addEventListener('click', function () {
      const caseStudyType = card.getAttribute('data-case-study');
      if (caseStudyType) {
        openCaseStudyModal(caseStudyType);
      }
    });
  });

  // Close case study modal event listeners
  if (caseStudyModalClose) {
    caseStudyModalClose.addEventListener('click', closeCaseStudyModal);
  }

  if (caseStudyModalOverlay) {
    caseStudyModalOverlay.addEventListener('click', closeCaseStudyModal);
  }

  // Close case study modal with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && caseStudyModal.style.display === 'flex') {
      closeCaseStudyModal();
    }
  });

  // Image Popup Modal Functionality
  const imagePopupModal = document.getElementById('image-popup-modal');
  const imagePopupOverlay = document.querySelector('.image-popup-overlay');
  const imagePopupClose = document.querySelector('.image-popup-close');
  const popupImage = document.getElementById('popup-image');

  // Function to open image popup modal
  function openImagePopup(imageSrc, imageAlt) {
    popupImage.src = imageSrc;
    popupImage.alt = imageAlt;
    imagePopupModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Reset zoom state
    popupImage.classList.remove('zoomed');
    popupImage.style.transform = 'scale(1)';
    currentScale = 1;
    isZoomed = false;
    isPinching = false;
    initialDistance = 0;
  }

  // Function to close image popup modal
  function closeImagePopup() {
    imagePopupModal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Reset zoom state
    popupImage.classList.remove('zoomed');
    popupImage.style.transform = 'scale(1)';
    currentScale = 1;
    isZoomed = false;
    isPinching = false;
    initialDistance = 0;
  }

  // Image click handlers
  const popupImages = document.querySelectorAll('[data-image-popup]');
  popupImages.forEach((img) => {
    img.addEventListener('click', function () {
      const imageSrc = this.getAttribute('data-image-popup');
      const imageAlt = this.getAttribute('alt');
      openImagePopup(imageSrc, imageAlt);
    });
  });

  // Close image popup event listeners
  if (imagePopupClose) {
    imagePopupClose.addEventListener('click', closeImagePopup);
  }

  if (imagePopupOverlay) {
    imagePopupOverlay.addEventListener('click', closeImagePopup);
  }

  // Close image popup with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && imagePopupModal.style.display === 'flex') {
      closeImagePopup();
    }
  });

  // Mobile pinch-to-zoom functionality
  let currentScale = 1;
  let initialDistance = 0;
  let isZoomed = false;
  let isPinching = false;
  let lastTap = 0;

  // Touch events for pinch-to-zoom
  popupImage.addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
      isPinching = true;
      initialDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else if (e.touches.length === 1) {
      isPinching = false;
    }
  });

  popupImage.addEventListener('touchmove', function (e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      isPinching = true;

      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );

      if (initialDistance > 0) {
        const scale = currentDistance / initialDistance;
        const newScale = Math.max(1, Math.min(3, scale));

        currentScale = newScale;
        this.style.transform = `scale(${newScale})`;

        if (newScale > 1) {
          this.classList.add('zoomed');
          isZoomed = true;
        } else {
          this.classList.remove('zoomed');
          isZoomed = false;
        }
      }
    }
  });

  popupImage.addEventListener('touchend', function (e) {
    // Only reset initialDistance if we were pinching
    if (isPinching) {
      initialDistance = 0;
      isPinching = false;
    }

    // Handle double tap for zoom in/out (only when not pinching)
    if (!isPinching && e.touches.length === 0) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;

      if (tapLength < 500 && tapLength > 0) {
        e.preventDefault();

        if (isZoomed) {
          // Zoom out
          currentScale = 1;
          this.style.transform = 'scale(1)';
          this.classList.remove('zoomed');
          isZoomed = false;
        } else {
          // Zoom in
          currentScale = 2;
          this.style.transform = 'scale(2)';
          this.classList.add('zoomed');
          isZoomed = true;
        }
      }
      lastTap = currentTime;
    }
  });

  // Desktop click to zoom in/out
  popupImage.addEventListener('click', function (e) {
    // Only handle click zoom on desktop (not mobile)
    if (!('ontouchstart' in window)) {
      e.preventDefault();

      if (isZoomed) {
        // Zoom out
        currentScale = 1;
        this.style.transform = 'scale(1)';
        this.classList.remove('zoomed');
        isZoomed = false;
      } else {
        // Zoom in
        currentScale = 2;
        this.style.transform = 'scale(2)';
        this.classList.add('zoomed');
        isZoomed = true;
      }
    }
  });
});
