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

$('.product-quantity__button--increment').click((event) => {
  event.preventDefault();
  $(event.currentTarget).siblings('.product-quantity__quantity').val((index, value) => {
    const parsedValue = parseInt(value);
    return parsedValue + 1;
  });
});

$('.product-quantity__button--decrement').click((event) => {
  event.preventDefault();
  $(event.currentTarget).siblings('.product-quantity__quantity').val((index, value) => {
    const parsedValue = parseInt(value);
    if (parsedValue > 1) {
      return parsedValue - 1;
    } else {
      return 1;
    }
  });
});
