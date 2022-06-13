class View {
  constructor() {
    this.app = document.querySelector(".app");
    this.searchLine = document.querySelector(".search-line");
    this.searchInput = this.searchLine.querySelector(".search-input");
    this.autoBox = this.searchLine.querySelector(".autocom-box");
    this.usersList = document.querySelector(".users");
  }
  createElement(tag, elementClass) {
    const element = document.createElement(tag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }
  createUser(userData) {
    const userElement = this.createElement("li", "user-prev");
    userElement.textContent = userData.name;
    this.autoBox.append(userElement);
    userElement.addEventListener("click", () =>
      this.addUser(
        userData.name,
        userData.owner.login,
        userData.stargazers_count
      )
    );
  }
  addUser(name, owner, stars) {
    const elem = this.createElement("li", "add-user");
    elem.innerHTML = `<p>name: ${name}</p>
    <p>owner: ${owner}</p>
    <p>stars: ${stars}</p>`;
    const close = this.createElement("button", "user-close");
    close.textContent = "X";
    elem.append(close);
    this.usersList.append(elem);
    close.addEventListener("click", () => {
      elem.hidden = true;
    });
    this.autoBox.innerHTML = "";
    this.searchInput.value = "";
  }
}

class Search {
  constructor(view, api) {
    this.view = view;
    this.api = api;
    this.view.searchInput.addEventListener(
      "keyup",
      this.debounce(this.searchUser.bind(this), 500)
    );
  }
  async searchUser() {
    const searchValue = this.view.searchInput.value;
    if (searchValue) {
      this.clearUsers();
      this.api.loadUsers(searchValue).then((res) => {
        if (res.ok) {
          res.json().then((res) => {
            res.items.forEach((user) => {
              this.view.createUser(user);
            });
          });
        }
      });
    } else {
      this.clearUsers();
    }
  }

  clearUsers() {
    this.view.autoBox.innerHTML = "";
  }

  debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
}

class Api {
  async loadUsers(value) {
    return await fetch(
      `https://api.github.com/search/repositories?q=${value}&per_page=5`
    );
  }
}

const api = new Api();

new Search(new View(), api);
