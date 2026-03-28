(function () {
  function initProjectImageZoom() {
    var projectImages = document.querySelectorAll('.project-gallery img');
    if (!projectImages.length) {
      return;
    }

    var lightbox = document.getElementById('project-image-lightbox');
    var closeButton = document.getElementById('project-image-lightbox-close');
    var lightboxImage = document.getElementById('project-image-lightbox-image');
    var lightboxCaption = document.getElementById('project-image-lightbox-caption');

    if (!lightbox || !closeButton || !lightboxImage || !lightboxCaption) {
      return;
    }

    if (lightbox.dataset.zoomInitialized === 'true') {
      return;
    }
    lightbox.dataset.zoomInitialized = 'true';

    var lastActiveElement = null;

    function resetZoomState() {
      lightboxImage.classList.remove('is-zoomed');
    }

    function openLightbox(sourceImage) {
      var source = sourceImage.currentSrc || sourceImage.src;

      if (!source) {
        return;
      }

      if (typeof lightbox.showModal !== 'function') {
        window.open(source, '_blank', 'noopener,noreferrer');
        return;
      }

      lastActiveElement = document.activeElement;
      lightboxImage.src = source;
      lightboxImage.alt = sourceImage.alt || '';
      lightboxCaption.textContent = sourceImage.alt || 'Project image preview';
      resetZoomState();
      lightbox.showModal();
      closeButton.focus();
    }

    function closeLightbox() {
      if (lightbox.open) {
        lightbox.close();
      }
    }

    function setupImageInteraction(image) {
      if (image.closest('a, button')) {
        return;
      }

      image.classList.add('project-image-zoomable');
      image.setAttribute('role', 'button');
      image.setAttribute('tabindex', '0');
      image.setAttribute('aria-haspopup', 'dialog');
      image.setAttribute('aria-label', (image.alt || 'Project image') + '. Open zoom view');

      image.addEventListener('click', function () {
        openLightbox(image);
      });

      image.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(image);
        }
      });
    }

    projectImages.forEach(setupImageInteraction);

    closeButton.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightbox.addEventListener('cancel', function (event) {
      event.preventDefault();
      closeLightbox();
    });

    lightbox.addEventListener('close', function () {
      lightboxImage.src = '';
      lightboxImage.alt = '';
      lightboxCaption.textContent = '';
      resetZoomState();

      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
      lastActiveElement = null;
    });

    lightboxImage.addEventListener('click', function () {
      lightboxImage.classList.toggle('is-zoomed');
    });

    lightboxImage.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        lightboxImage.classList.toggle('is-zoomed');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectImageZoom);
  } else {
    initProjectImageZoom();
  }
})();
