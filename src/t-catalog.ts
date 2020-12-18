const _ = {
  debounce: require('lodash/debounce'),
}

interface ICatalog {
  root: string; // 文章根元素
  catalogRoot: string; // 目录根元素
  // className?: string;
  // activeName?: string;
  // style?: string;
  // activeStyle?: string;
}

export default class Catalog {
  options: ICatalog;
  intersectionObserver: IntersectionObserver;
  lastScrollTop: number = 0;

  constructor(options: ICatalog) {
    this.options = options;
    this.genSider();
    this.createObserver();
  }

  // 创建观察者
  createObserver() {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.reverse().forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.active();
        } else if (entry.target.isActived) {
          entry.target.unactive();
        }
      });
      this.lastScrollTop = document.scrollingElement.scrollTop;
    });
    document.querySelectorAll(this.options.root).forEach((el) => {
      this.intersectionObserver.observe(el);
    });
  }

  // 生成目录
  genSider() {
    const rootElements = document.querySelectorAll(this.options.root);
    const catalogContainer = document.querySelector(this.options.catalogRoot);
    const catalogList = document.createElement("ul");
    catalogList.classList.add("catalogList");

    rootElements.forEach((rootElement, index) => {
      const item = document.createElement("li");
      // 设置css
      item.classList.add("t_catalog_item");

      const a = document.createElement("a");
      a.href = "#" + rootElement.id;
      a.textContent = rootElement.textContent;
      item.appendChild(a);
      catalogList.appendChild(item);

      this.addActiveEvent(rootElements, rootElement, index, catalogList, item);
    });

    catalogContainer.appendChild(catalogList);
    this.addClickEvent(catalogList);
  }

  /**
   *
   * @param rootElements ： 内容区要定位的元素列表
   * @param catalogList ： 目录列表根元素
   * @param item : 目录项
   */
  addActiveEvent(
    rootElements: NodeListOf<Element>,
    rootElement: Element,
    rootElementIndex: number,
    catalogList: Element,
    item: Element
  ) {
    rootElement.active = () => {
      rootElements.forEach((detailItem) => {
        detailItem.isActived = false;
      });
      (catalogList.querySelectorAll("li") || []).forEach((el) => {
        el.classList.remove("t_catalog_item_active");
      });
      item.classList.add("t_catalog_item_active");
      rootElement.isActived = true;
    };

    rootElement.unactive = () => {
      // if (document.scrollingElement.scrollTop > this.lastScrollTop) {
      //   catalogList[rootElementIndex + 1] && catalogList[rootElementIndex + 1].active();
      // } else {
      //   catalogList[rootElementIndex - 1] && catalogList[rootElementIndex - 1].active();
      // }
    };
  }

  addClickEvent(catalogList: Element) {
    catalogList.addEventListener("click", function(event) {
      const eleLink = (event.target as Element).closest("a");
      const eleTarget =
        eleLink && document.querySelector(eleLink.getAttribute("href"));
      if (eleTarget) {
        event.preventDefault();
        eleTarget.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        if (CSS.supports("scroll-behavior: smooth")) {
          setTimeout(function() {
            eleTarget.active();
          }, Math.abs(
            eleTarget.getBoundingClientRect().top - window.innerHeight / 2
          ) / 2);
        } else {
          eleTarget.active();
        }
      }
    });
  }
}
