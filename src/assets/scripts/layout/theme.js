import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';

import '../../styles/theme.scss';
import '../../styles/theme.scss.liquid';

import $ from 'jquery';
import {pageLinkFocus} from '@shopify/theme-a11y';
import {cookiesEnabled} from '@shopify/theme-cart';
import {wrapTable, wrapIframe} from '@shopify/theme-rte';

import Glide from '@glidejs/glide';

// If there is a glide carousel, setup a new instance of the carousel
if (document.querySelector('.glide')) {
  new Glide('.glide', {
    type: 'carousel',
    perView: 3,
    peek: {before: 50, after: 50},
    breakpoints: {
      800: {
        perView: 2,
      },
      500: {
        perView: 1,
      },
    },
  }).mount();
}

window.slate = window.slate || {};
window.theme = window.theme || {};

$(document).ready(() => {
  // Common a11y fixes
  if (window.location.hash !== '#') {
    pageLinkFocus($(window.location.hash));
  }

  $('.in-page-link').on('click', (evt) => {
    pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  const tableSelectors = '.rte table';

  wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  const iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper',
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace(
      'supports-no-cookies',
      'supports-cookies',
    );
  }

  // Hide the announcement bar if the user has previously closed it
  //  TODO: Uncomment this when moving the website live
  // if (localStorage.getItem('hideAnnouncement')) {
  //     $('.announcement').css('display', 'none');
  // }

  // Instagram fetching
  // TODO: figure out how to grab the access token from the customizer
  fetch('https://api.instagram.com/v1/users/self/media/recent/?access_token=2221755979.4247df9.1794f985c3014fc09ac415a8bc607128')
    .then((response) => response.json())
    .then((response) => {
      response.data.filter((post) => post.type === ('image' || 'carousel')).some((post, index) => {
        $('.instagram__images').append(`<div class="instagram__image-wrapper"><img class="instagram__image" src=${post.images.standard_resolution.url} /></div>`);
        return (index >= 5);
      });

      $.each($('.instagram__image'), (index, image) => {
        if ($(image).width() > $(image).height()) {
          const postionFromLeft = (($(image).width() - $(image).height()) / 2) * -1;
          $(image).css('left', postionFromLeft);
        }
      });

      $(window).resize(() => {
        repositionInstagramImages();
      });
    })
    .catch((error) => console.log(error));

  function repositionInstagramImages() {
    $.each($('.instagram__image'), (index, image) => {
      if ($(image).width() > $(image).height()) {
        const postionFromLeft = (($(image).width() - $(image).height()) / 2) * -1;
        $(image).css('left', postionFromLeft);
      }
    });
  }

});

$('.announcement__close').click(() => {
  $('.announcement').css('height', 0);
  localStorage.setItem('hideAnnouncement', true);
});

$('.header__menu-mobile-hamburger').click(() => {
  $('.header__menu-mobile-hamburger').toggle();
  $('.header__menu-mobile-close').toggle();
  $('.header__menu-mobile-list').toggleClass('header__menu-mobile-list--active');
  $('.header__menu-mobile').toggleClass('header__menu-mobile--active');
});

$('.header__menu-mobile-close').click(() => {
  $('.header__menu-mobile-hamburger').toggle();
  $('.header__menu-mobile-close').toggle();
  $('.header__menu-mobile-list').toggleClass('header__menu-mobile-list--active');
  $('.header__menu-mobile').toggleClass('header__menu-mobile--active');
});

$(window).scroll(() => {
  $('.hero__chevron').css('opacity', 1 - $(window).scrollTop() / 350);
});

$('.quantity-controls__button--increment').click((event) => {
  event.preventDefault();
  $(event.currentTarget).siblings('.quantity-controls__quantity').val((index, value) => {
    const parsedValue = parseInt(value);
    return parsedValue + 1;
  });
});

$('.quantity-controls__button--decrement').click((event) => {
  event.preventDefault();
  $(event.currentTarget).siblings('.quantity-controls__quantity').val((index, value) => {
    const parsedValue = parseInt(value);
    if (parsedValue > 1) {
      return parsedValue - 1;
    } else {
      return 1;
    }
  });
});

/* eslint-disable */

$('.contact__form-button').click((event) => {
  event.preventDefault();

  let isValid = true;

  $.each($('.contact__form-field  [required]') , (index, input) => {
    $(input).parent('.contact__form-field').removeClass('contact__form-field--error')
    console.log($(input).attr('pattern'), $(input).val());
    let fieldValue = $(input).val();
    if ($(input).attr('pattern')) {
      let regex = RegExp($(input).attr('pattern'));
      let validField = regex.test(fieldValue);
      console.log(validField)
      if (!validField) {
        isValid = false;
        $(input).parent('.contact__form-field').addClass('contact__form-field--error');
      }
    }
    if (fieldValue === '') {
      isValid = false;
      $(input).parent('.contact__form-field').addClass('contact__form-field--error');
    }
  });

  // Form validation that checks that at least one required checkbox is ticked
  if ($('.contact__options--meetingTimes').length) {
    $('.contact__options--meetingTimes').parent('.contact__form-field').removeClass('contact__form-field--error')

    let atLeastOneCheckboxChecked = false;
    
    $.each($('.contact__options--meetingTimes input[type="checkbox"]'), (index, checkbox) => {
      if ($(checkbox).is(':checked')) {
        atLeastOneCheckboxChecked = true;
        return atLeastOneCheckboxChecked;
      }
    });

    if (!atLeastOneCheckboxChecked) {
      isValid = false;
      $('.contact__options--meetingTimes').parent('.contact__form-field').addClass('contact__form-field--error')
    }
  }

  // Form validation that checks that at least one required checkbox is ticked
  if ($('.contact__options--referrals').length) {
    $('.contact__options--referrals').parent('.contact__form-field').removeClass('contact__form-field--error')

    let atLeastOneCheckboxChecked = false;
    
    $.each($('.contact__options--referrals input[type="checkbox"]'), (index, checkbox) => {
      if ($(checkbox).is(':checked')) {
        atLeastOneCheckboxChecked = true;
        return atLeastOneCheckboxChecked;
      }
    });

    if (!atLeastOneCheckboxChecked) {
      isValid = false;
      $('.contact__options--referrals').parent('.contact__form-field').addClass('contact__form-field--error')
    }
  }

  if (isValid) {
    document.querySelector('form').submit();
  }
});

/* eslint-enable */
