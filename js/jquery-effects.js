// jQuery Effects — Glitch Vault
$(function () {

    // 1. SMOOTH SCROLL for all anchor links
    $(document).on('click', 'a[href^="#"]', function (e) {
        var href = $(this).attr('href');
        if (href === '#') return;
        var target = $(href);
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: target.offset().top - 80 }, 500);
        }
    });

    // 2. SCROLL-REVEAL — cards below the fold fade + rise into view
    var $revealItems = $('.game-card, .news-card');

    function revealOnScroll() {
        var windowBottom = $(window).scrollTop() + $(window).height();
        $revealItems.each(function () {
            if ($(this).hasClass('reveal-visible')) return;
            if ($(this).offset().top < windowBottom - 40) {
                $(this).addClass('reveal-visible');
            } else {
                $(this).addClass('reveal-hidden');
            }
        });
    }
    $(window).on('scroll.reveal', revealOnScroll);
    revealOnScroll();

    // 3. TOAST NOTIFICATION — shown when bundle is saved
    $(document).on('click', '#bundle-save-btn', function () {
        if ($(this).prop('disabled')) return;
        showToast('Build saved!');
    });

    // Also show toast on successful form submit
    $(document).on('click', '[type="submit"]', function () {
        var $form = $(this).closest('form');
        if ($form.length && $form.attr('id') === 'validation-form') {
            // toast shown after short delay to let validation run first
            setTimeout(function () {
                if ($('#success-result').is(':visible') || !$('#success-result').hasClass('d-none')) {
                    showToast('Pre-order confirmed!');
                }
            }, 200);
        }
    });

    function showToast(message) {
        $('.gv-toast').remove(); // prevent stacking
        var $toast = $('<div class="gv-toast">').text(message).appendTo('body');
        $toast.animate({ opacity: 1 }, 300);
        setTimeout(function () {
            $toast.animate({ opacity: 0 }, 400, function () { $toast.remove(); });
        }, 2500);
    }

    // 4. ACCORDION — News section "Read More" toggles excerpt
    $(document).on('click', '.read-more', function (e) {
        e.preventDefault();
        var $card = $(this).closest('.news-card');
        var $extra = $card.find('.news-extra');
        if ($extra.length === 0) {
            $extra = $('<p class="news-extra small mt-2" style="color:var(--text-secondary)">Full article coming soon. Stay tuned for more updates from Glitch Vault.</p>');
            $card.find('.card-body').append($extra);
            $extra.hide().slideDown(300);
            $(this).html('Read Less <i class="fas fa-arrow-up"></i>');
        } else {
            $extra.slideUp(300, function () { $extra.remove(); });
            $(this).html('Read More <i class="fas fa-arrow-right"></i>');
        }
    });

    // 5. HOVER LIFT on game-card and news-card (jQuery hover)
    $(document).on('mouseenter', '.game-card, .news-card', function () {
        $(this).stop(true).animate({ 'margin-top': '-4px', 'margin-bottom': '4px' }, 150);
    }).on('mouseleave', '.game-card, .news-card', function () {
        $(this).stop(true).animate({ 'margin-top': '0px', 'margin-bottom': '0px' }, 150);
    });

});
