var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var style = "";
const app = document.querySelector("#app");
class Main {
  constructor() {
    __publicField(this, "data");
    __publicField(this, "folderListDiv");
    __publicField(this, "urlListDiv");
    __publicField(this, "searchInput");
    __publicField(this, "searchListDiv");
    __publicField(this, "uploadBtn");
    __publicField(this, "searchList");
    __publicField(this, "bottonList", []);
    this.init();
  }
  init() {
    var _a, _b, _c, _d;
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(favoritesUrl, "text/html");
    console.log(xmlDoc);
    let tdList = xmlDoc.getElementsByTagName("dt");
    let td;
    for (let i = 0; i < tdList.length; i++) {
      let temp = tdList[i];
      if (((_b = (_a = temp == null ? void 0 : temp.children) == null ? void 0 : _a[0]) == null ? void 0 : _b.innerHTML) == "\u6536\u85CF\u5939\u680F") {
        td = temp;
        break;
      }
    }
    if (!td) {
      return;
    }
    this.data = {
      name: "\u6536\u85CF\u5939\u680F",
      type: "folder",
      children: []
    };
    console.log(this.data);
    console.log(td);
    this.loopSetData(td, this.data);
    if (((_d = (_c = this == null ? void 0 : this.data) == null ? void 0 : _c.children) == null ? void 0 : _d.length) > 0) {
      this.display();
    }
  }
  display() {
    this.searchInput = document.createElement("input");
    this.uploadBtn = document.createElement("button");
    this.searchListDiv = document.createElement("div");
    this.folderListDiv = document.createElement("div");
    this.urlListDiv = document.createElement("div");
    this.searchInput.className = "searchInput";
    this.folderListDiv.className = "folderListDiv";
    this.urlListDiv.className = "urlListDiv";
    this.searchListDiv.className = "searchListDiv";
    this.uploadBtn.innerHTML = "\u4E0A\u4F20";
    let topDiv = document.createElement("div");
    topDiv.className = "topDiv";
    topDiv.append(this.searchInput, this.uploadBtn);
    app.append(topDiv, this.searchListDiv, this.folderListDiv, this.urlListDiv);
    this.bottonList = [{ name: "\u6536\u85CF\u5939\u680F", data: this.data }];
    this.updateSearchInput();
    this.updateFolderDiv();
    this.updateUrlListDiv(this.data);
    this.uploadBtn.onclick = () => {
      this.quickUploadFile();
    };
  }
  async readFile() {
    return new Promise((resolve, _reject) => {
      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.onchange = (e) => {
        resolve(e.target.files[0]);
      };
      input.click();
    });
  }
  async uploadFile(file, url) {
    return new Promise((res, _rej) => {
      let form = new FormData();
      form.append("file", file);
      let xhr = new XMLHttpRequest();
      xhr.open("post", url, true);
      xhr.addEventListener("readystatechange", () => {
        let r = xhr;
        if (r.status != 200) {
          console.warn("\u4E0A\u4F20\u5931\u8D25", r.status, r.statusText, r.response);
          res(false);
        } else if (r.readyState == 4) {
          console.log("\u4E0A\u4F20\u6210\u529F");
          res(true);
        }
      });
      xhr.send(form);
    });
  }
  async quickUploadFile() {
    let file = await this.readFile();
    let uploadstatus = await this.uploadFile(file, "/upload");
    if (uploadstatus) {
      let c = confirm("\u4E0A\u4F20\u6210\u529F,\u9700\u8981\u5237\u65B0\u5417?");
      if (c) {
        location.reload();
      }
    } else {
      alert("\u4E0A\u4F20\u5931\u8D25!!!");
    }
  }
  updateUrlListDiv(data) {
    var _a;
    this.urlListDiv.innerHTML = "";
    if (!((_a = data == null ? void 0 : data.children) == null ? void 0 : _a.length)) {
      return;
    }
    for (let i = 0; i < data.children.length; i++) {
      let child = data.children[i];
      if (child.type == "folder") {
        let btn = document.createElement("button");
        btn.innerHTML = child.name;
        let div = document.createElement("div");
        div.className = "childDiv";
        div.append(btn);
        this.urlListDiv.append(div);
        btn.onclick = () => {
          this.bottonList.push({ name: child.name, data: child });
          this.updateFolderDiv();
          this.updateUrlListDiv(child);
        };
      } else {
        let image = new Image();
        image.src = child.icon;
        let a = document.createElement("a");
        a.innerHTML = child.name;
        let div = document.createElement("div");
        div.className = "childDiv";
        div.append(image, a);
        this.urlListDiv.append(div);
        a.setAttribute("href", child.url);
        a.setAttribute("target", "_blank");
      }
    }
  }
  updateSearchInput() {
    this.searchInput.addEventListener("input", (_e) => {
      let str = this.searchInput.value;
      this.searchList = [];
      if (!str) {
        this.updateSearchListDiv();
        return;
      }
      let reg = new RegExp(str, "i");
      let loopFunc = (data) => {
        if (data.type == "url" && (data.name.search(reg) != -1 || data.url.search(str) != -1)) {
          this.searchList.push(data);
          return;
        } else if (data.type == "folder" && data.children) {
          data.children.forEach((child) => {
            loopFunc(child);
          });
        }
      };
      loopFunc(this.data);
      this.updateSearchListDiv();
    });
  }
  updateSearchListDiv() {
    this.searchListDiv.innerHTML = "";
    if (!this.searchList) {
      return;
    }
    this.searchList.forEach((child) => {
      let image = new Image();
      image.src = child.icon;
      let nameA = document.createElement("a");
      nameA.innerHTML = child.name;
      nameA.setAttribute("href", child.url);
      nameA.setAttribute("target", "_blank");
      let urlA = document.createElement("a");
      urlA.innerHTML = child.url;
      urlA.setAttribute("href", child.url);
      urlA.setAttribute("target", "_blank");
      let div = document.createElement("div");
      div.className = "childDiv";
      div.append(image, nameA, document.createElement("br"), urlA);
      this.searchListDiv.append(div);
    });
  }
  updateFolderDiv() {
    this.folderListDiv.innerHTML = "";
    for (let i = 0; i < this.bottonList.length; i++) {
      let child = this.bottonList[i];
      let btn = document.createElement("button");
      btn.className = "folderChildDiv";
      btn.innerHTML = child.name;
      this.folderListDiv.appendChild(btn);
      let a = i;
      btn.onclick = () => {
        this.bottonList = this.bottonList.slice(0, a + 1);
        this.updateFolderDiv();
        this.updateUrlListDiv(child.data);
      };
    }
  }
  loopSetData(td, data) {
    var _a, _b;
    let dl = (_a = td == null ? void 0 : td.children) == null ? void 0 : _a[1];
    if ((dl == null ? void 0 : dl.tagName) != "DL" || dl.children.length == 0) {
      return;
    }
    for (let i = 0; i < dl.children.length; i++) {
      let child = dl.children[i];
      if (child.tagName != "DT") {
        continue;
      }
      let childChild = (_b = child == null ? void 0 : child.children) == null ? void 0 : _b[0];
      if (!childChild) {
        continue;
      }
      let childData = {
        name: childChild.innerHTML,
        type: "folder",
        children: []
      };
      let href = childChild.getAttribute("href");
      let icon = childChild.getAttribute("icon");
      if (href) {
        childData.type = "url";
        childData.icon = icon;
        childData.url = href;
      }
      data.children.push(childData);
      this.loopSetData(child, childData);
    }
  }
}
new Main();
