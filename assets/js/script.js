/**
 * Vony - Peer-to-Peer Micro-Lending Platform
 * Main JavaScript file
 */

(function($) {
    'use strict';

    // Document ready function
    $(document).ready(function() {
        
        // Initialize all components
        initLoader();
        initMobileMenu();
        initSmoothScrolling();
        initBackToTop();
        initAnimations();
        initContactForm();
        
    });

    // Page loader
    function initLoader() {
        $(window).on('load', function() {
            $('.fullpage_loader').fadeOut(500);
        });
        
        // Fallback to ensure loader disappears
        setTimeout(function() {
            $('.fullpage_loader').fadeOut(500);
        }, 2000);
    }

    // Mobile menu functionality
    function initMobileMenu() {
        // Use vanilla JavaScript for better compatibility
        var toggler = document.querySelector('.navbar-toggler');
        var mobileMenu = document.querySelector('#mobileNavMenu');
        var navLinks = document.querySelectorAll('#mobileNavMenu .nav-link');
        
        if (toggler && mobileMenu) {
            // Toggle mobile menu
            toggler.addEventListener('click', function(e) {
                e.preventDefault();
                var isOpen = mobileMenu.classList.contains('show');
                
                if (isOpen) {
                    mobileMenu.classList.remove('show');
                    toggler.setAttribute('aria-expanded', 'false');
                } else {
                    mobileMenu.classList.add('show');
                    toggler.setAttribute('aria-expanded', 'true');
                }
            });
            
            // Close menu when clicking nav links
            navLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('show');
                    toggler.setAttribute('aria-expanded', 'false');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                var navbar = document.querySelector('.navbar');
                if (navbar && !navbar.contains(e.target) && mobileMenu.classList.contains('show')) {
                    mobileMenu.classList.remove('show');
                    toggler.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        $('a[href^="#"]').on('click', function(e) {
            var target = $(this.getAttribute('href'));
            if (target.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 800);
            }
        });
    }

    // Back to top button
    function initBackToTop() {
        var backToTop = $('.scroll-to-top');
        
        $(window).scroll(function() {
            if ($(this).scrollTop() > 300) {
                backToTop.addClass('show');
            } else {
                backToTop.removeClass('show');
            }
        });

        backToTop.on('click', function(e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 800);
        });
    }

    // Initialize animations
    function initAnimations() {
        // Ensure all fade-up elements are immediately visible
        $('.fade-up').addClass('animate').css({
            'opacity': '1',
            'transform': 'translateY(0)'
        });
        
        // Fade up animation on scroll
        function checkFadeUp() {
            $('.fade-up').each(function() {
                var elementTop = $(this).offset().top;
                var elementBottom = elementTop + $(this).outerHeight();
                var viewportTop = $(window).scrollTop();
                var viewportBottom = viewportTop + $(window).height();

                // Trigger animation when element is 150px before entering viewport
                if (elementTop < viewportBottom - 150) {
                    $(this).addClass('animate');
                }
            });
        }

        // Zoom out animation
        function checkZoomOut() {
            $('.zoom-out').each(function() {
                var elementTop = $(this).offset().top;
                var elementBottom = elementTop + $(this).outerHeight();
                var viewportTop = $(window).scrollTop();
                var viewportBottom = viewportTop + $(window).height();

                // Trigger animation when element is 150px before entering viewport
                if (elementTop < viewportBottom - 150) {
                    $(this).addClass('animate');
                }
            });
        }

        $(window).on('scroll', function() {
            checkFadeUp();
            checkZoomOut();
        });

        // Trigger once on load
        checkFadeUp();
        checkZoomOut();
    }

    // Contact form handling
    function initContactForm() {
        $('#contact-form').on('submit', function(e) {
            e.preventDefault();
            
            var form = $(this);
            var formData = new FormData(this);
            var submitBtn = form.find('button[type="submit"]');
            var responseEl = form.find('.ajax-response');
            
            // Disable submit button
            submitBtn.prop('disabled', true).text('Sending...');
            
            $.ajax({
                url: 'assets/mail.php',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    var data = JSON.parse(response);
                    if (data.success) {
                        responseEl.html('<div class="alert alert-success">' + data.message + '</div>');
                        form[0].reset();
                    } else {
                        responseEl.html('<div class="alert alert-danger">' + data.message + '</div>');
                    }
                },
                error: function() {
                    responseEl.html('<div class="alert alert-danger">An error occurred. Please try again.</div>');
                },
                complete: function() {
                    submitBtn.prop('disabled', false).text('Send Message');
                    
                    // Hide response after 5 seconds
                    setTimeout(function() {
                        responseEl.fadeOut();
                    }, 5000);
                }
            });
        });
    }

    // Sticky header
    $(window).on('scroll', function() {
        var scroll = $(window).scrollTop();
        if (scroll >= 50) {
            $('.header-section').addClass('sticky-header');
        } else {
            $('.header-section').removeClass('sticky-header');
        }
    });

    // Add hover effects to buttons
    $('.theme-btn, .join-with-us-btn').hover(
        function() {
            $(this).addClass('hover-effect');
        },
        function() {
            $(this).removeClass('hover-effect');
        }
    );

    // Text animation for split text
    function initTextAnimation() {
        $('.split-text').each(function() {
            var text = $(this).text();
            var words = text.split(' ');
            var wrappedWords = words.map(function(word) {
                return '<span class="word">' + word + '</span>';
            }).join(' ');
            $(this).html(wrappedWords);
        });

        // Animate words on scroll
        $(window).on('scroll', function() {
            $('.split-text .word').each(function(index) {
                var element = $(this);
                var elementTop = element.offset().top;
                var viewportTop = $(window).scrollTop();
                var viewportBottom = viewportTop + $(window).height();

                if (elementTop < viewportBottom && elementTop > viewportTop) {
                    setTimeout(function() {
                        element.addClass('animate');
                    }, index * 100);
                }
            });
        });
    }

    // Initialize text animation
    initTextAnimation();

    // Counter animation (if odometer is available)
    if (typeof Odometer !== 'undefined') {
        $('.counter').each(function() {
            var counter = $(this);
            var countTo = counter.data('count');
            
            $(window).on('scroll', function() {
                var elementTop = counter.offset().top;
                var viewportBottom = $(window).scrollTop() + $(window).height();
                
                if (elementTop < viewportBottom && !counter.hasClass('counted')) {
                    counter.addClass('counted');
                    counter.html(countTo);
                }
            });
        });
    }

    // Form validation
    $('form').each(function() {
        var form = $(this);
        
        form.find('input[required], select[required], textarea[required]').on('blur', function() {
            var field = $(this);
            if (field.val() === '') {
                field.addClass('error');
            } else {
                field.removeClass('error');
            }
        });
    });

    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

})(jQuery);
