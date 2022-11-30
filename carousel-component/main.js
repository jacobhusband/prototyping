const body = document.body;
const overlay = document.querySelector('.overlay');
const dots = overlay.querySelector('.dots');
let id = 1;

const urls = [
  'https://www.livingspaces.com/globalassets/productassets/200000-299999/250000-259999/253000-253999/253100-253199/253180/253180_grey_fabric_reversible_sofa_chaise_signature_01.jpg?w=820&h=553&mode=pad',
  'https://www.livingspaces.com/globalassets/productassets/200000-299999/250000-259999/253000-253999/253100-253199/253180/253180_grey_fabric_reversible_sofa_chaise_side_02.jpg?w=820&h=553&mode=pad',
  'https://www.livingspaces.com/globalassets/productassets/200000-299999/250000-259999/253000-253999/253100-253199/253180/253180_grey_fabric_reversible_sofa_chaise_side_18.jpg?w=820&h=553&mode=pad'
]

overlay.addEventListener('click', handleOverlayClicks);

function handleOverlayClicks(event) {
  document.querySelector(`img[data-id="${id}"]`).classList.add('hidden')
  if (event.target.classList.value.includes('left')) rotateImage('left')
  else if (event.target.classList.value.includes('right')) rotateImage('right')
  else if (event.target.classList.value.includes('dot')) id = Number(event.target.dataset.id)
  document.querySelector(`img[data-id="${id}"]`).classList.remove('hidden')
  Array.from(dots.children).forEach(dot => {
    (Number(dot.dataset.id) === id)
      ? dot.firstElementChild.classList.add('filled')
      : dot.firstElementChild.classList.remove('filled')
  })
}

function rotateImage(direction) {
  if (direction === 'right') {
    if (id === urls.length) {
      id = 1;
    } else {
      id++;
    }
  } else {
    if (id === 1) {
      id = urls.length;
    } else {
      id--;
    }
  }
}

const carousel = buildCarousel(urls);

function buildCarousel(images) {
}

function buildElement(tag, attr, children) {
  const el = document.createElement(tag);
  for (var key in attr) (key === 'textContent')
    ? el.textContent = attr[key]
    : key.includes('dataset')
      ? el.dataset[key.split('-')[1]] = attr[key]
      : el.setAttribute(key, attr[key]);
  console.log(children)
  if (children) children.forEach(child => (child) && el.appendChild(child));
  return el;
}
