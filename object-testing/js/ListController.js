class ListController extends BasicController {
  constructor(element) {
    super(element)
    this.nextId = 1;
    this.content = [];
    this.add = this.add.bind(this);
  }

  create(text = "", className = "") {
    const li = document.createElement('li');
    li.textContent = text;
    li.className = className;
    li.dataset.id = this.nextId;
    this.nextId++;
    return li;
  }

  insert(li, id) {
    (!id)
      ? this.element.appendChild(li);
      : this.element.insertBefore(li, this.element.querySelector(`li[data-id="${id}"]`))
  }
}
