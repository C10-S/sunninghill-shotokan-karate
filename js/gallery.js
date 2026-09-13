// Reusable static lightbox gallery component for Sunninghill Shotokan Karate
// Styled to match the Shotokan Red and Black aesthetic
(function (window) {
  const ID_MODAL = 'galleryModal';
  const ID_CAROUSEL = 'galleryCarousel';

  function escapeHtml(s) {
    if (!s && s !== 0) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function createModal() {
    if (document.getElementById(ID_MODAL)) return;
    const modalHtml = `
<div class="modal fade" id="${ID_MODAL}" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content" style="background: rgba(14,14,14,0.98); border: 2px solid #C8102E; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 48px rgba(0,0,0,0.85);">
      <div class="modal-header border-0 pb-0 pt-3 px-4">
        <div class="d-flex align-items-center w-100">
          <button id="galleryBackBtn" class="btn btn-sm btn-outline-danger rounded-pill me-3" style="display:none; font-size: 0.75rem; border-color: #C8102E; color: #fff; background-color: #C8102E;">&larr; Back</button>
          <h5 class="modal-title fw-bold mb-0 me-auto" id="${ID_MODAL}Title" style="font-size: 1.05rem; letter-spacing: 1px; text-transform: uppercase; color: #fff;">Gallery</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
      </div>
      
      <div class="modal-body p-0 position-relative mt-2">
        <!-- Thumbnail Grid -->
        <div id="galleryGrid" class="row g-2 p-3 overflow-auto" style="max-height: 70vh; margin: 0;"></div>
        
        <!-- Carousel View -->
        <div id="${ID_CAROUSEL}" class="carousel slide" data-bs-ride="false" style="display:none;">
          <div class="carousel-indicators" style="bottom: 10px;"></div>
          <div class="carousel-inner" style="min-height: 250px;"></div>
          <button class="carousel-control-prev" type="button" data-bs-target="#${ID_CAROUSEL}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#${ID_CAROUSEL}" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      
      <div class="modal-footer border-0 pt-2 pb-3 px-4 justify-content-center">
         <div id="galleryCounter" class="badge rounded-pill" style="background: rgba(200,16,46,0.25); color: #fff; border: 1px solid #C8102E; font-weight: 700; padding: 6px 14px; font-size: 0.8rem;">1 / 1</div>
      </div>
    </div>
  </div>
</div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('galleryBackBtn').addEventListener('click', () => {
      showGrid();
    });

    const carouselEl = document.getElementById(ID_CAROUSEL);
    carouselEl.addEventListener('slid.bs.carousel', function (e) {
      updateCounter(e.to);
    });
  }

  function updateCounter(index) {
    const counter = document.getElementById('galleryCounter');
    const items = document.querySelectorAll(`#${ID_CAROUSEL} .carousel-item`);
    if (counter && items.length) {
      counter.textContent = `${index + 1} / ${items.length}`;
      counter.style.display = 'inline-block';
    } else if (counter) {
      counter.style.display = 'none';
    }
  }

  function showCarousel(index) {
    const grid = document.getElementById('galleryGrid');
    const carousel = document.getElementById(ID_CAROUSEL);
    const backBtn = document.getElementById('galleryBackBtn');
    
    if (grid && carousel) {
      grid.style.display = 'none';
      carousel.style.display = 'block';
      if (backBtn && grid.children.length > 1) {
        backBtn.style.display = 'inline-block';
      }
      
      const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carousel);
      carouselInstance.to(index);
      updateCounter(index);
    }
  }

  function showGrid() {
    const grid = document.getElementById('galleryGrid');
    const carousel = document.getElementById(ID_CAROUSEL);
    const backBtn = document.getElementById('galleryBackBtn');
    const counter = document.getElementById('galleryCounter');
    
    if (grid && carousel) {
      grid.style.display = 'flex';
      carousel.style.display = 'none';
      if (backBtn) backBtn.style.display = 'none';
      if (counter) counter.style.display = 'none';
    }
  }

  window.Gallery = {
    open: function (items, options = {}) {
      createModal();
      
      const titleEl = document.getElementById(`${ID_MODAL}Title`);
      if (titleEl) {
        titleEl.textContent = options.title || 'Sunninghill Shotokan Karate Gallery';
      }

      const parsedItems = items.map(item => {
        if (typeof item === 'string') {
          return { src: item, alt: 'Karate Photo', caption: '' };
        }
        return {
          src: item.src || item.url || '',
          alt: item.alt || 'Karate Photo',
          caption: item.caption || item.alt || ''
        };
      }).filter(item => item.src);

      const inner = document.querySelector(`#${ID_CAROUSEL} .carousel-inner`);
      const indicators = document.querySelector(`#${ID_CAROUSEL} .carousel-indicators`);
      const grid = document.getElementById('galleryGrid');

      if (!inner || !indicators || !grid) return;

      inner.innerHTML = '';
      indicators.innerHTML = '';
      grid.innerHTML = '';

      parsedItems.forEach((item, idx) => {
        // Build Carousel Item
        const itemEl = document.createElement('div');
        itemEl.className = `carousel-item ${idx === (options.startIndex || 0) ? 'active' : ''}`;
        itemEl.innerHTML = `
          <div class="d-flex align-items-center justify-content-center p-2" style="min-height: 400px; background: #000;">
            <img src="${escapeHtml(item.src)}" class="d-block img-fluid" alt="${escapeHtml(item.alt)}" style="max-height: 65vh; object-fit: contain;">
          </div>
          ${item.caption ? `<div class="carousel-caption d-block p-2 text-center" style="background: rgba(0,0,0,0.85); border-top: 1px solid #C8102E; color: #fff; font-size: 0.95rem; font-weight: 600;">${escapeHtml(item.caption)}</div>` : ''}
        `;
        inner.appendChild(itemEl);

        // Build Indicators
        const indBtn = document.createElement('button');
        indBtn.type = 'button';
        indBtn.dataset.bsTarget = `#${ID_CAROUSEL}`;
        indBtn.dataset.bsSlideTo = idx.toString();
        indBtn.setAttribute('aria-label', `Slide ${idx + 1}`);
        if (idx === (options.startIndex || 0)) {
          indBtn.className = 'active';
          indBtn.setAttribute('aria-current', 'true');
        }
        indicators.appendChild(indBtn);

        // Build Grid Item
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-3 p-1';
        col.innerHTML = `
          <div class="ratio ratio-1x1" style="cursor:pointer; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15);">
            <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          </div>
        `;
        col.querySelector('div').addEventListener('click', () => {
          showCarousel(idx);
        });
        grid.appendChild(col);
      });

      const modalEl = document.getElementById(ID_MODAL);
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();

      // Show single direct slide or grid
      if (parsedItems.length === 1 || options.startIndex !== undefined) {
        showCarousel(options.startIndex || 0);
      } else {
        showGrid();
      }
    },

    bindAll: function () {
      // Optional declarative binding if needed
    }
  };
})(window);
