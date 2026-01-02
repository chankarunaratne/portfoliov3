// Portfolio website animations and interactions

document.addEventListener("DOMContentLoaded", function () {
  // Sequential spring blur animation system
  const elementsToAnimate = [
    { selector: ".navbar", delay: 300 },
    { selector: ".hero", delay: 500 },
    { selector: ".video-intro", delay: 700 },
    { selector: ".case-studies", delay: 900 },
    { selector: ".more-work", delay: 1100 },
    { selector: ".more-work-gallery", delay: 1300 },
    { selector: ".my-products-section", delay: 1500 },
  ];

  // Start sequential animations
  elementsToAnimate.forEach(({ selector, delay }) => {
    const element = document.querySelector(selector);
    if (element) {
      // Apply initial animation class and transitions
      element.classList.add("fade-blur-up");

      // Trigger animation after delay
      setTimeout(() => {
        element.classList.add("animate");
      }, delay);
    }
  });
  // Navbar remains static at top of page; no scroll background behavior

  // Logo click handler for home navigation
  const logoLink = document.querySelector(".logo-link");
  if (logoLink) {
    logoLink.addEventListener("click", function (e) {
      e.preventDefault();
      // Scroll to top of page for home navigation
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Navigation links functionality
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");
    });
  });

  // Mobile menu functionality
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenuOverlay = document.querySelector(".mobile-menu-overlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  if (mobileMenuToggle && mobileMenuOverlay) {
    // Toggle mobile menu
    mobileMenuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isActive = mobileMenuToggle.classList.contains("active");

      if (isActive) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        mobileMenuOverlay.classList.contains("active") &&
        !mobileMenuOverlay.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Handle mobile nav link clicks
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        // Remove active class from all mobile links
        mobileNavLinks.forEach((l) => l.classList.remove("active"));
        // Remove active class from desktop links too
        navLinks.forEach((l) => l.classList.remove("active"));

        // Add active class to clicked mobile link
        this.classList.add("active");

        // Add active class to corresponding desktop link
        const linkText = this.textContent;
        const correspondingDesktopLink = Array.from(navLinks).find(
          (link) => link.textContent === linkText
        );
        if (correspondingDesktopLink) {
          correspondingDesktopLink.classList.add("active");
        }

        // Close mobile menu after selection
        closeMobileMenu();
      });
    });

    function openMobileMenu() {
      mobileMenuToggle.classList.add("active");
      mobileMenuOverlay.classList.add("active");
    }

    function closeMobileMenu() {
      mobileMenuToggle.classList.remove("active");
      mobileMenuOverlay.classList.remove("active");
    }
  }

  // Video interaction handlers
  const watchBtn = document.querySelector(".watch-btn");
  const videoThumbnail = document.querySelector(".video-thumbnail");
  const videoModal = document.getElementById("video-modal");
  const videoModalClose = document.querySelector(".video-modal-close");
  const videoModalOverlay = document.querySelector(".video-modal-overlay");
  const loomEmbedContainer = document.getElementById("loom-embed-container");

  // Loom video configuration
  const loomVideoId = "2ea578cee6d74116b211a16accde633d";
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
    videoModal.style.display = "flex";

    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";

    // Focus on the close button for accessibility
    setTimeout(() => {
      videoModalClose.focus();
    }, 300);
  }

  // Function to close video modal
  function closeVideoModal() {
    // Hide the modal
    videoModal.style.display = "none";

    // Remove the embed to stop the video
    loomEmbedContainer.innerHTML = "";

    // Restore body scrolling
    document.body.style.overflow = "auto";
  }

  // Function to handle video play
  function handleVideoPlay() {
    openVideoModal();
  }

  // Initialize video thumbnail based on device type
  const isMobile = initializeMobileVideoThumbnail();

  // Add modal event handlers for both mobile and desktop
  // Watch button
  if (watchBtn) {
    watchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      handleVideoPlay();
    });
  }

  // Video thumbnail click
  if (videoThumbnail) {
    videoThumbnail.addEventListener("click", function () {
      handleVideoPlay();
    });

    // Keyboard accessibility for thumbnail
    videoThumbnail.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleVideoPlay();
      }
    });
  }

  // Make entire video-intro section clickable on mobile
  const videoIntroSection = document.querySelector(".video-intro");
  if (videoIntroSection && isMobileDevice()) {
    videoIntroSection.addEventListener("click", function (e) {
      // Only trigger if the click wasn't on the thumbnail (to avoid double-triggering)
      if (!videoThumbnail || !videoThumbnail.contains(e.target)) {
        handleVideoPlay();
      }
    });

    // Add cursor pointer style for mobile
    videoIntroSection.style.cursor = "pointer";

    // Keyboard accessibility for the entire section on mobile
    videoIntroSection.setAttribute("tabindex", "0");
    videoIntroSection.setAttribute("role", "button");
    videoIntroSection.setAttribute(
      "aria-label",
      "Play Chan's video introduction"
    );

    videoIntroSection.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleVideoPlay();
      }
    });
  }

  // Modal close event listeners
  if (videoModalClose) {
    videoModalClose.addEventListener("click", closeVideoModal);
  }

  if (videoModalOverlay) {
    videoModalOverlay.addEventListener("click", closeVideoModal);
  }

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && videoModal.style.display === "flex") {
      closeVideoModal();
    }
  });

  // Handle window resize to switch between mobile/desktop modes
  let resizeTimeout;
  let wasMobile = isMobile;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      // Reload the page if device type changes to ensure proper initialization
      const currentlyMobile = isMobileDevice();
      if (currentlyMobile !== wasMobile) {
        location.reload();
      }
    }, 250);
  });

  // Showcase Modal Functionality
  const showcaseModal = document.getElementById("showcase-modal");
  const showcaseModalOverlay = document.querySelector(
    ".showcase-modal-overlay"
  );
  const showcaseModalClose = document.querySelector(".showcase-modal-close");

  // Showcase data for each card
  const showcaseData = {
    docswell: {
      logo: "", // Placeholder logo URL (empty for now, will show grey placeholder)
      company: "Docswell",
      role: "Product Designer",
      title: "Taking Docswell’s MVP to production as the sole designer of the team",
      subheading: "Overhauled both patient and practitioner portals from the ground up and prepared them for production launch.",
      description: `
        <p style="margin-bottom: 20px;">The original appointment booking flow for Docswell, a UK-based medtech startup, was unintuitive and time-consuming. Users — both patients and medical staff — struggled with unclear navigation, redundant form fields, and lack of real-time availability. Feedback from clinics highlighted frequent booking errors and increased support requests.</p>
        
        <p style="margin-bottom: 20px;">I was the sole product designer on the project, working closely with the founder and the dev team. I led the UX research, wireframing, high-fidelity prototyping, and supported hand-off to developers. We followed a lean, iterative approach with weekly user testing cycles.</p>
        
        <p>We started by mapping out the existing booking journey and conducting quick interviews with 6 clinic staff and 4 patients. The biggest pain points? Too many steps, no calendar visibility, and lack of mobile optimisation.</p>
      `
    },
    rememberly: {
      logo: "",
      company: "Rememberly",
      role: "Founder + Maker",
      title: "Never forget a moment",
      subheading: "A personal memory keeper that helps you cherish life's highlights",
      description: "Content for Rememberly case study coming soon."
    },
    jiffyhive: {
      logo: "",
      company: "Jiffyhive",
      role: "Founding Designer",
      title: "Streamlining freelance workflows",
      subheading: "All-in-one platform for freelancers to manage projects and payments",
      description: "Content for Jiffyhive case study coming soon."
    }
  };

  // Function to open showcase modal with specific content
  function openShowcaseModal(showcaseType) {
    const data = showcaseData[showcaseType] || showcaseData['docswell']; // Fallback to docswell if type not found

    // Update modal content
    const logoElement = document.getElementById("showcase-logo");
    if (data.logo) {
      // If logo URL provided, create img element
      logoElement.innerHTML = `<img src="${data.logo}" alt="${data.company} logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />`;
    } else {
      // Show placeholder background (already styled in CSS)
      logoElement.innerHTML = "";
    }
    
    document.getElementById("showcase-company-name").textContent = data.company;
    document.getElementById("showcase-role").textContent = data.role;
    document.getElementById("showcase-title").textContent = data.title;
    
    const subheadingElement = document.getElementById("showcase-subheading");
    if (subheadingElement) {
      subheadingElement.textContent = data.subheading;
    }
    
    // Use innerHTML to support HTML content in description (paragraphs, etc.)
    document.getElementById("showcase-description").innerHTML = data.description;

    // Show modal
    showcaseModal.style.display = "flex";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Get references to modal elements
    const showcaseModalContainer = document.querySelector(".showcase-modal-container");
    
    // Function to check if event originated from scrollable container
    const isEventFromScrollableContainer = function(e) {
      if (!showcaseModalContainer) return false;
      let target = e.target;
      
      // Walk up the DOM tree to check if we're inside the scrollable container
      while (target && target !== document.body) {
        if (target === showcaseModalContainer || showcaseModalContainer.contains(target)) {
          return true;
        }
        target = target.parentElement;
      }
      return false;
    };

    // Forward scroll events to popup container when scrolling outside popup
    const forwardScrollToPopupWheel = function(e) {
      // If scroll is from the scrollable container, let it handle naturally
      if (isEventFromScrollableContainer(e)) {
        return;
      }
      
      // Otherwise, prevent background scroll and forward to popup container
      if (showcaseModalContainer) {
        e.preventDefault();
        e.stopPropagation();
        
        // Check boundaries before applying scroll
        const scrollAmount = e.deltaY;
        const currentScroll = showcaseModalContainer.scrollTop;
        const maxScroll = showcaseModalContainer.scrollHeight - showcaseModalContainer.clientHeight;
        const isAtTop = currentScroll === 0;
        const isAtBottom = currentScroll >= maxScroll - 1;
        
        // Prevent scroll if trying to scroll beyond boundaries
        if ((isAtTop && scrollAmount < 0) || (isAtBottom && scrollAmount > 0)) {
          return; // Already at limit, don't scroll
        }
        
        // Apply scroll to the container
        const newScroll = Math.max(0, Math.min(maxScroll, currentScroll + scrollAmount));
        showcaseModalContainer.scrollTop = newScroll;
      }
    };

    let touchStartY = 0;
    let touchStartScroll = 0;
    
    const forwardScrollToPopupTouchStart = function(e) {
      if (showcaseModalContainer && e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartScroll = showcaseModalContainer.scrollTop;
      }
    };

    const forwardScrollToPopupTouchMove = function(e) {
      // If scroll is from the scrollable container, let it handle naturally
      if (isEventFromScrollableContainer(e)) {
        return;
      }
      
      // Otherwise, prevent background scroll and forward to popup container
      if (showcaseModalContainer && e.touches.length === 1) {
        e.preventDefault();
        e.stopPropagation();
        
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        const currentScroll = showcaseModalContainer.scrollTop;
        const maxScroll = showcaseModalContainer.scrollHeight - showcaseModalContainer.clientHeight;
        const newScroll = touchStartScroll + deltaY;
        
        // Clamp to boundaries
        const clampedScroll = Math.max(0, Math.min(maxScroll, newScroll));
        showcaseModalContainer.scrollTop = clampedScroll;
      }
    };

    // Add scroll forwarding to document to catch scrolls anywhere on the page
    // This ensures scrolling anywhere (overlay, modal, or outside) scrolls the popup
    document.addEventListener("wheel", forwardScrollToPopupWheel, { passive: false });
    document.addEventListener("touchstart", forwardScrollToPopupTouchStart, { passive: true });
    document.addEventListener("touchmove", forwardScrollToPopupTouchMove, { passive: false });
    
    // Store document handlers for cleanup
    document._showcaseScrollHandlers = {
      wheel: forwardScrollToPopupWheel,
      touchstart: forwardScrollToPopupTouchStart,
      touchmove: forwardScrollToPopupTouchMove
    };

    // Prevent scroll propagation when container reaches limits
    if (showcaseModalContainer) {
      let touchStartY = 0;
      
      const handleWheel = function(e) {
        const container = e.currentTarget;
        const isAtTop = container.scrollTop === 0;
        const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
        
        // Prevent scroll propagation when at limits
        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      const handleTouchStart = function(e) {
        touchStartY = e.touches[0].clientY;
      };

      const handleTouchMove = function(e) {
        const container = e.currentTarget;
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        const isAtTop = container.scrollTop === 0;
        const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
        
        // Prevent scroll propagation when at limits
        if ((isAtTop && deltaY < 0) || (isAtBottom && deltaY > 0)) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      // Use wheel event for mouse wheel scrolling
      showcaseModalContainer.addEventListener("wheel", handleWheel, { passive: false });
      showcaseModalContainer.addEventListener("touchstart", handleTouchStart, { passive: true });
      showcaseModalContainer.addEventListener("touchmove", handleTouchMove, { passive: false });
      
      // Store the handlers so we can remove them later
      showcaseModalContainer._scrollHandlers = {
        wheel: handleWheel,
        touchstart: handleTouchStart,
        touchmove: handleTouchMove
      };
    }
  }

  // Function to close showcase modal
  function closeShowcaseModal() {
    showcaseModal.style.display = "none";
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    
    // Remove scroll event listeners from container
    const showcaseModalContainer = document.querySelector(".showcase-modal-container");
    if (showcaseModalContainer && showcaseModalContainer._scrollHandlers) {
      showcaseModalContainer.removeEventListener("wheel", showcaseModalContainer._scrollHandlers.wheel);
      showcaseModalContainer.removeEventListener("touchstart", showcaseModalContainer._scrollHandlers.touchstart);
      showcaseModalContainer.removeEventListener("touchmove", showcaseModalContainer._scrollHandlers.touchmove);
      showcaseModalContainer._scrollHandlers = null;
    }

    // Remove document scroll handlers
    if (document._showcaseScrollHandlers) {
      document.removeEventListener("wheel", document._showcaseScrollHandlers.wheel);
      document.removeEventListener("touchstart", document._showcaseScrollHandlers.touchstart);
      document.removeEventListener("touchmove", document._showcaseScrollHandlers.touchmove);
      document._showcaseScrollHandlers = null;
    }
  }

  // Case study card click handlers
  const caseCards = document.querySelectorAll(".case-card");
  caseCards.forEach((card) => {
    card.addEventListener("click", function () {
      const showcaseType = card.getAttribute("data-showcase");
      if (showcaseType) {
        openShowcaseModal(showcaseType);
      }
    });
  });

  // Close showcase modal event listeners
  if (showcaseModalClose) {
    showcaseModalClose.addEventListener("click", closeShowcaseModal);
  }

  if (showcaseModalOverlay) {
    showcaseModalOverlay.addEventListener("click", closeShowcaseModal);
  }

  // Close showcase modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && showcaseModal.style.display === "flex") {
      closeShowcaseModal();
    }
  });

  // Image Popup Modal Functionality
  const imagePopupModal = document.getElementById("image-popup-modal");
  const imagePopupOverlay = document.querySelector(".image-popup-overlay");
  const imagePopupClose = document.querySelector(".image-popup-close");
  const popupImage = document.getElementById("popup-image");

  // Function to open image popup modal
  function openImagePopup(imageSrc, imageAlt) {
    popupImage.src = imageSrc;
    popupImage.alt = imageAlt;
    imagePopupModal.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Reset zoom state
    popupImage.classList.remove("zoomed");
    popupImage.style.transform = "scale(1)";
    currentScale = 1;
    isZoomed = false;
    isPinching = false;
    initialDistance = 0;
  }

  // Function to close image popup modal
  function closeImagePopup() {
    imagePopupModal.style.display = "none";
    document.body.style.overflow = "auto";

    // Reset zoom state
    popupImage.classList.remove("zoomed");
    popupImage.style.transform = "scale(1)";
    currentScale = 1;
    isZoomed = false;
    isPinching = false;
    initialDistance = 0;
  }

  // Image click handlers
  const popupImages = document.querySelectorAll("[data-image-popup]");
  popupImages.forEach((img) => {
    img.addEventListener("click", function () {
      const imageSrc = this.getAttribute("data-image-popup");
      const imageAlt = this.getAttribute("alt");
      openImagePopup(imageSrc, imageAlt);
    });
  });

  // Close image popup event listeners
  if (imagePopupClose) {
    imagePopupClose.addEventListener("click", closeImagePopup);
  }

  if (imagePopupOverlay) {
    imagePopupOverlay.addEventListener("click", closeImagePopup);
  }

  // Close image popup with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && imagePopupModal.style.display === "flex") {
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
  popupImage.addEventListener("touchstart", function (e) {
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

  popupImage.addEventListener("touchmove", function (e) {
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
          this.classList.add("zoomed");
          isZoomed = true;
        } else {
          this.classList.remove("zoomed");
          isZoomed = false;
        }
      }
    }
  });

  popupImage.addEventListener("touchend", function (e) {
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
          this.style.transform = "scale(1)";
          this.classList.remove("zoomed");
          isZoomed = false;
        } else {
          // Zoom in
          currentScale = 2;
          this.style.transform = "scale(2)";
          this.classList.add("zoomed");
          isZoomed = true;
        }
      }
      lastTap = currentTime;
    }
  });

  // Desktop click to zoom in/out
  popupImage.addEventListener("click", function (e) {
    // Only handle click zoom on desktop (not mobile)
    if (!("ontouchstart" in window)) {
      e.preventDefault();

      if (isZoomed) {
        // Zoom out
        currentScale = 1;
        this.style.transform = "scale(1)";
        this.classList.remove("zoomed");
        isZoomed = false;
      } else {
        // Zoom in
        currentScale = 2;
        this.style.transform = "scale(2)";
        this.classList.add("zoomed");
        isZoomed = true;
      }
    }
  });
});
