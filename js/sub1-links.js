/**
 * For checkout /checkout/de-aff/ links on get-syngas.com: set sub1 from page query,
 * or use base URL without sub1 when the parameter is missing.
 * Legal and other get-syngas paths are not modified.
 */
(function () {
  'use strict';

  var CHECKOUT_BASE = 'https://get-syngas.com/checkout/de-aff/?uid=464&oid=19&affid2=499';

  function isGetSyngasCheckout(href) {
    if (!href) return false;
    try {
      var u = new URL(href, document.baseURI);
      return u.hostname === 'get-syngas.com' && u.pathname.indexOf('/checkout/de-aff/') !== -1;
    } catch (e) {
      return false;
    }
  }

  function ensureFooterCheckoutImage() {
    var imgs = document.querySelectorAll('footer#footer img[src*="get-syngas.com"]');
    for (var j = 0; j < imgs.length; j++) {
      var img = imgs[j];
      var a = img.closest('a');
      if (!a) {
        var wrap = document.createElement('a');
        wrap.setAttribute('href', CHECKOUT_BASE);
        wrap.setAttribute('class', 'footer-img-checkout-link');
        var parent = img.parentNode;
        if (parent) {
          parent.insertBefore(wrap, img);
          wrap.appendChild(img);
        }
        continue;
      }
      if (!isGetSyngasCheckout(a.getAttribute('href'))) {
        a.setAttribute('href', CHECKOUT_BASE);
        a.classList.add('footer-img-checkout-link');
      }
    }
  }

  function applyCheckoutSub1() {
    var sub1 = new URLSearchParams(window.location.search).get('sub1');
    var has = sub1 != null && String(sub1).length > 0;
    var anchors = document.querySelectorAll('a[href*="/checkout/de-aff/"]');
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i];
      var h = a.getAttribute('href');
      if (!h) continue;
      if (!isGetSyngasCheckout(h)) continue;

      if (has) {
        var u = new URL(h, document.baseURI);
        u.searchParams.set('sub1', sub1);
        a.setAttribute('href', u.toString());
      } else {
        a.setAttribute('href', CHECKOUT_BASE);
      }
    }
  }

  function run() {
    ensureFooterCheckoutImage();
    applyCheckoutSub1();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
