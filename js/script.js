/**
 * ===================================================================
 * RAGHAV BANSAL - PORTFOLIO INTERACTIVITY SCRIPT
 * Handles navigation, animations, form validation, and micro-interactions
 * ===================================================================
 */

function initApp() {
  'use strict';

  // --- 1. DOM Elements ---
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');
  const currentYearSpan = document.getElementById('current-year');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toastContainer = document.getElementById('toast-container');
  const revealElements = document.querySelectorAll('.reveal');
  const skillCards = document.querySelectorAll('.skill-card');

  // --- 2. Dynamic Year in Footer ---
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- Resume Button Feedback ---
  const resumeBtn = document.getElementById('resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      showToast('Resume: You can place your resume.pdf in the project folder to enable direct download.', 'info', 4000);
    });
  }

  // --- 3. Mobile Navigation Menu Toggle ---
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Handle active state immediately on click & close mobile menu
    navLinkItems.forEach(link => {
      link.addEventListener('click', function() {
        navLinkItems.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          menuToggle.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close mobile menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 4. Scroll Event Handler (Throttled with requestAnimationFrame for 60/120fps) ---
  const sections = document.querySelectorAll('section[id]');
  let isTicking = false;

  const updateActiveNavLink = (scrollY) => {
    const scrollPos = scrollY + 120;
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (scrollPos >= section.offsetTop) {
        const sectionId = section.getAttribute('id');
        navLinkItems.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        break;
      }
    }
  };

  const handleScroll = () => {
    const scrollPos = window.scrollY;

    // Navbar elevation styling
    if (navbar) {
      if (scrollPos > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll to top button visibility
    if (scrollTopBtn) {
      if (scrollPos > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Active Section ScrollSpy
    updateActiveNavLink(scrollPos);
  };

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  handleScroll(); // Initial check on load

  // --- 5. Smooth Scroll-To-Top ---
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 7. Intersection Observer for Scroll Reveal & Skill Progress Bars ---
  if ('IntersectionObserver' in window) {
    // Reveal animation observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, no need to observe again
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Skill cards observer for progress bars
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    skillCards.forEach(card => skillObserver.observe(card));
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('active'));
    skillCards.forEach(card => card.classList.add('in-view'));
  }

  // --- 8. Toast Notification Utility ---
  function showToast(message, type = 'info', duration = 3500) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconClass = type === 'success' 
      ? 'fa-solid fa-circle-check' 
      : (type === 'error' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-info-circle');

    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  // --- 9. Copy Email to Clipboard ---
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'raghavbansal@example.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
          .then(() => {
            showToast('Email address copied to clipboard!', 'success');
          })
          .catch(() => {
            showToast('Email: ' + email, 'info');
          });
      } else {
        // Fallback
        showToast('Email: ' + email, 'info');
      }
    });
  }

  // --- 10. Contact Form Validation & Submission Handling ---
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    // Validation helper functions
    const validateName = () => {
      const val = nameInput.value.trim();
      if (val.length < 2) {
        nameInput.classList.add('input-error');
        nameError.classList.add('visible');
        return false;
      }
      nameInput.classList.remove('input-error');
      nameError.classList.remove('visible');
      return true;
    };

    const validateEmail = () => {
      const val = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(val)) {
        emailInput.classList.add('input-error');
        emailError.classList.add('visible');
        return false;
      }
      emailInput.classList.remove('input-error');
      emailError.classList.remove('visible');
      return true;
    };

    const validateMessage = () => {
      const val = messageInput.value.trim();
      if (val.length < 10) {
        messageInput.classList.add('input-error');
        messageError.classList.add('visible');
        return false;
      }
      messageInput.classList.remove('input-error');
      messageError.classList.remove('visible');
      return true;
    };

    // Real-time validation listeners
    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('input-error')) validateName();
    });

    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('input-error')) validateEmail();
    });

    messageInput.addEventListener('input', () => {
      if (messageInput.classList.contains('input-error')) validateMessage();
    });

    // Form Submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        showToast('Please fix the errors in the form before sending.', 'error');
        return;
      }

      // Simulate sending with loading state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>Sending Message...</span>
      `;

      setTimeout(() => {
        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        // Display feedback banner
        formStatus.className = 'form-status success';
        formStatus.innerHTML = `
          <i class="fa-solid fa-circle-check"></i>
          <strong>Message Sent Successfully!</strong> Thank you for reaching out, Raghav will get back to you shortly.
        `;

        showToast('Message sent successfully! Thank you!', 'success', 4000);

        // Reset form inputs
        contactForm.reset();

        // Clear status banner after 6 seconds
        setTimeout(() => {
          formStatus.className = 'form-status';
          formStatus.innerHTML = '';
        }, 6000);
      }, 900);
    });
  }

  // --- 11. Interactive ParKezy Mockup demo interaction ---
  const parkingSlots = document.querySelectorAll('.parking-grid-preview .slot');
  parkingSlots.forEach(slot => {
    slot.style.cursor = 'pointer';
    slot.title = 'Click to toggle parking slot status';
    slot.addEventListener('click', () => {
      if (slot.classList.contains('available')) {
        slot.classList.remove('available', 'pulse');
        slot.classList.add('reserved');
        slot.innerHTML = `<i class="fa-solid fa-clock"></i> ${slot.textContent.trim()}`;
        showToast('ParKezy: Slot marked as Reserved!', 'info', 2000);
      } else if (slot.classList.contains('reserved')) {
        slot.classList.remove('reserved');
        slot.classList.add('occupied');
        slot.innerHTML = `<i class="fa-solid fa-car"></i> ${slot.textContent.trim()}`;
        showToast('ParKezy: Vehicle checked into slot!', 'info', 2000);
      } else {
        slot.classList.remove('occupied');
        slot.classList.add('available', 'pulse');
        slot.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${slot.textContent.trim()}`;
        showToast('ParKezy: Slot is now Free & Available!', 'success', 2000);
      }
    });
  });

  // --- 12. Interactive Terminal Commands ---
  const terminalInput = document.getElementById('terminal-input');
  const terminalLogs = document.getElementById('terminal-dynamic-logs');
  const termChips = document.querySelectorAll('.term-chip');

  const executeCommand = (cmdRaw) => {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd || !terminalLogs) return;

    let responseHTML = '';
    switch (cmd) {
      case 'help':
        responseHTML = '<p class="code-output text-cyan">Available commands: <strong>skills</strong>, <strong>projects</strong>, <strong>about</strong>, <strong>whoami</strong>, <strong>clear</strong></p>';
        break;
      case 'whoami':
        responseHTML = '<p class="code-output text-cyan">Raghav Bansal — B.Tech Computer Science Engineering Student</p>';
        break;
      case 'skills':
        responseHTML = '<p class="code-output text-cyan">Java, Python, DSA, HTML, CSS, JavaScript, MySQL</p>';
        // Smooth scroll to skills
        const skillsSection = document.getElementById('skills');
        if (skillsSection) skillsSection.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'projects':
        responseHTML = '<p class="code-output text-cyan">1. ParKezy (Smart Parking System)<br>2. AlgoPulse (DSA Visualizer)<br>3. IntelliStudy (AI Assistant)</p>';
        const projSection = document.getElementById('projects');
        if (projSection) projSection.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'about':
        responseHTML = '<p class="code-output text-cyan">Passionate about Java, Web Development, DSA, and Artificial Intelligence.</p>';
        const aboutSection = document.getElementById('about');
        if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'clear':
        terminalLogs.innerHTML = '';
        if (terminalInput) terminalInput.value = '';
        return;
      default:
        responseHTML = `<p class="code-output" style="color: #f87171;">Command not found: "${cmd}". Type 'help' for available commands.</p>`;
        break;
    }

    const logEntry = document.createElement('div');
    logEntry.className = 'terminal-entry';
    logEntry.innerHTML = `
      <p class="code-line"><span class="cmd-prompt">$</span> <span class="cmd-text">${cmdRaw}</span></p>
      ${responseHTML}
    `;
    terminalLogs.appendChild(logEntry);

    if (terminalInput) terminalInput.value = '';
    // Auto scroll terminal to bottom
    const terminalBody = document.querySelector('.terminal-body');
    if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
  };

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeCommand(terminalInput.value);
      }
    });
  }

  termChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) executeCommand(cmd);
    });
  });

  // --- 13. Project Details Modal Logic ---
  const projectModal = document.getElementById('project-modal');
  const projectModalTitle = document.getElementById('modal-project-title');
  const projectModalCategory = document.getElementById('modal-project-category');
  const projectModalBody = document.getElementById('modal-project-body');
  const projectModalClose = document.getElementById('modal-close-btn');
  const projectBtns = document.querySelectorAll('.project-btn');

  const projectData = {
    'ParKezy': {
      category: 'Smart City Solution • Full Stack',
      title: 'ParKezy — Smart Parking Management System',
      description: 'ParKezy is an intelligent urban parking management platform designed to eliminate parking congestion and reduce vehicle emission footprint in busy city centers.',
      architecture: 'Client Web Interface (HTML/CSS/JS) ⇄ RESTful Controller Layer (Java) ⇄ Transaction Service Layer ⇄ MySQL Relational DB',
      highlights: [
        'Real-time parking space detection and automated live slot status synchronization.',
        'ACID-compliant reservation transaction handling to prevent race conditions & double-booking.',
        'Centralized administrative dashboard for analytics, tariff configuration, and reporting.',
        'Seamless integration with QR-code based entry/exit vehicle validation.'
      ],
      tech: ['Java (Core & OOP)', 'MySQL', 'JavaScript (ES6+)', 'HTML5 / CSS3', 'REST APIs']
    },
    'AlgoPulse': {
      category: 'Algorithms & Education',
      title: 'AlgoPulse — Interactive DSA Visualizer',
      description: 'A dynamic visual platform built to bridge the gap between abstract mathematical computer science concepts and intuitive visual mental models for engineering students.',
      architecture: 'DOM & Canvas Render Engine ⇄ Custom Array & Graph State Store ⇄ Step Execution Engine with Speed Control',
      highlights: [
        'Visual execution of Sorting algorithms (QuickSort, MergeSort, HeapSort, BubbleSort).',
        'Graph traversal algorithms including Dijkstra\'s shortest path, Breadth-First Search (BFS), and Depth-First Search (DFS).',
        'Interactive array generator, custom input support, and real-time step-by-step playback.',
        'Live performance telemetry displaying exact Big-O Time & Auxiliary Space complexities.'
      ],
      tech: ['JavaScript (ES6+)', 'HTML5 Canvas', 'Data Structures & Algorithms', 'CSS Grid']
    },
    'IntelliStudy': {
      category: 'Artificial Intelligence & Education',
      title: 'IntelliStudy — AI-Powered Academic Assistant',
      description: 'An AI-powered academic assistant engineered to transform dense lecture notes, textbooks, and documentation into interactive study materials for engineers.',
      architecture: 'Python Backend ⇄ NLP Summarization Pipeline ⇄ Quiz Generation Model ⇄ MySQL Persistence Store',
      highlights: [
        'Automated extraction of key concepts and technical definitions from unstructured notes.',
        'Algorithmic generation of practice multiple-choice quizzes with detailed rationales.',
        'Spaced-repetition review scheduler to maximize long-term retention of algorithmic patterns.',
        'Responsive, distraction-free markdown note reader with code syntax highlighting.'
      ],
      tech: ['Python', 'AI / NLP', 'MySQL', 'JavaScript', 'Modern CSS']
    }
  };

  const openProjectModal = (projectName) => {
    const data = projectData[projectName];
    if (!data || !projectModal) return;

    projectModalTitle.textContent = data.title;
    projectModalCategory.textContent = data.category;

    const highlightsHTML = data.highlights.map(h => `<li><i class="fa-solid fa-check-circle"></i> <span>${h}</span></li>`).join('');
    const techHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

    projectModalBody.innerHTML = `
      <p>${data.description}</p>
      
      <div class="modal-highlight-box">
        <h5><i class="fa-solid fa-layer-group"></i> System Architecture Flow:</h5>
        <p style="font-family: var(--font-mono); font-size: 0.82rem; color: #a5b4fc; margin-top: 6px;">${data.architecture}</p>
      </div>

      <div>
        <h5 style="color: #ffffff; margin-bottom: 10px; font-family: var(--font-heading);">Key Technical Capabilities:</h5>
        <ul class="modal-feature-list">
          ${highlightsHTML}
        </ul>
      </div>

      <div>
        <h5 style="color: #ffffff; margin-bottom: 8px; font-family: var(--font-heading);">Technology Stack:</h5>
        <div class="modal-tech-cluster">
          ${techHTML}
        </div>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  projectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projName = btn.getAttribute('data-project');
      if (projName && projectData[projName]) {
        e.preventDefault();
        openProjectModal(projName);
      }
    });
  });

  if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
  }

  // --- 14. Resume Modal Logic ---
  const resumeModal = document.getElementById('resume-modal');
  const resumeModalClose = document.getElementById('resume-modal-close');
  const printResumeBtn = document.getElementById('print-resume-btn');

  const openResumeModal = () => {
    if (!resumeModal) return;
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeResumeModal = () => {
    if (!resumeModal) return;
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  }

  if (resumeModalClose) {
    resumeModalClose.addEventListener('click', closeResumeModal);
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Close modals when clicking backdrop
  [projectModal, resumeModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
    }
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResumeModal();
    }
  });

  // Handle modal contact links
  document.querySelectorAll('.modal-contact-link').forEach(link => {
    link.addEventListener('click', () => {
      closeProjectModal();
      closeResumeModal();
    });
  });
}

// Reliable Initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

