const body = document.body;

const urls = [
  'https://www.livingspaces.com/globalassets/productassets/200000-299999/250000-259999/253000-253999/253100-253199/253180/253180_grey_fabric_reversible_sofa_chaise_signature_01.jpg?w=820&h=553&mode=pad',
  'https://www.livingspaces.com/globalassets/productassets/200000-299999/250000-259999/253000-253999/253100-253199/253180/253180_grey_fabric_reversible_sofa_chaise_side_02.jpg?w=820&h=553&mode=pad',
  'https://www.livingspaces.com/globalassets/productassets/200000-299999/250000-259999/253000-253999/253100-253199/253180/253180_grey_fabric_reversible_sofa_chaise_side_18.jpg?w=820&h=553&mode=pad',
  'https://www.livingspaces.com/globalassets/productassets/200000-299999/250000-259999/253000-253999/253100-253199/253180/253180_grey_fabric_reversible_sofa_chaise_signature_01.jpg?w=820&h=553&mode=pad',
  'https://www.livingspaces.com/globalassets/productassets/200000-299999/250000-259999/253000-253999/253100-253199/253180/253180_grey_fabric_reversible_sofa_chaise_side_02.jpg?w=820&h=553&mode=pad',
  'https://www.livingspaces.com/globalassets/productassets/200000-299999/250000-259999/253000-253999/253100-253199/253180/253180_grey_fabric_reversible_sofa_chaise_side_18.jpg?w=820&h=553&mode=pad'
]

const urls2 = [
  'https://www.livingspaces.com/globalassets/productassets/200000-299999/250000-259999/253000-253999/253100-253199/253180/253180_grey_fabric_reversible_sofa_chaise_signature_01.jpg?w=820&h=553&mode=pad',
  'https://www.livingspaces.com/globalassets/productassets/200000-299999/250000-259999/253000-253999/253100-253199/253180/253180_grey_fabric_reversible_sofa_chaise_signature_01.jpg?w=820&h=553&mode=pad'
]

class Carousel {
  constructor(urls) {
    this.images = urls;
    this.id = 0;
    this.$carousel = this.buildCarousel();
    this.$overlay = this.$carousel.querySelector('.overlay');
    this.$dots = this.$overlay.querySelector('.dots');
    this.handleOverlayClicks = this.handleOverlayClicks.bind(this);
    this.rotateImage = this.rotateImage.bind(this);
    this.$overlay.addEventListener('click', this.handleOverlayClicks);
  }

  buildElement(tag, attr, children) {
    const el = document.createElement(tag);
    for (var key in attr) (key === 'textContent')
      ? el.textContent = attr[key]
      : key.includes('dataset')
        ? el.dataset[key.split('-')[1]] = attr[key]
        : el.setAttribute(key, attr[key]);
    if (children) children.forEach(child => (child) && el.appendChild(child));
    return el;
  }

  buildCarousel(images) {
    const dots = [];
    let dotClassName, imageClassName;

    this.images = this.images.map(url => {
      this.id++;
      dotClassName = (this.id === 1) ? 'dot filled' : 'dot';
      imageClassName = (this.id === 1) ? '' : 'hidden';
      dots.push(this.buildElement('button', { class: 'dot', 'dataset-id': this.id }, [
        this.buildElement('div', { class: dotClassName, 'dataset-id': this.id })
      ]));
      return this.buildElement('img', { src: url, class: imageClassName, 'dataset-id': this.id });
    })

    this.id = 1;

    const carouselItems = (this.images.length > 1)
      ? [
        this.buildElement('button', { class: 'left-chevron' }, [
          this.buildElement('i', { class: 'fas fa-chevron-circle-left' })
        ]),
        this.buildElement('div', { class: 'dots' }, [
          ...dots
        ]),
        this.buildElement('button', { class: 'right-chevron' }, [
          this.buildElement('i', { class: 'fas fa-chevron-circle-right' })
        ]),
      ] : [];

    return this.buildElement('div', { class: 'carousel-container' }, [
      ...this.images,
      this.buildElement('div', { class: 'overlay' }, [
        ...carouselItems
      ])
    ])
  }

  handleOverlayClicks(event) {
    if (event.target.matches('.overlay')) return;
    this.$carousel.querySelector(`img[data-id="${this.id}"]`).classList.add('hidden')
    if (event.target.classList.value.includes('left')) this.rotateImage('left')
    else if (event.target.classList.value.includes('right')) this.rotateImage('right')
    else if (event.target.classList.value.includes('dot')) this.id = Number(event.target.dataset.id)
    this.$carousel.querySelector(`img[data-id="${this.id}"]`).classList.remove('hidden')
    Array.from(this.$dots.children).forEach(dot => {
      (Number(dot.dataset.id) === this.id)
        ? dot.firstElementChild.classList.add('filled')
        : dot.firstElementChild.classList.remove('filled')
    })
  }

  rotateImage(direction) {
    if (direction === 'right') {
      (this.id === this.images.length) ? this.id = 1 : this.id++
    } else {
      (this.id === 1) ? this.id = this.images.length : this.id--
    }
  }
}

const carousel = new Carousel(urls);
const carousel2 = new Carousel(urls2);
body.appendChild(carousel.$carousel);
body.appendChild(carousel2.$carousel);
