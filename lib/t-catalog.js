"use strict";
exports.__esModule = true;
var _ = {
    debounce: require('lodash/debounce')
};
var Catalog = /** @class */ (function () {
    function Catalog(options) {
        this.lastScrollTop = 0;
        this.options = options;
        this.genSider();
        this.createObserver();
    }
    // 创建观察者
    Catalog.prototype.createObserver = function () {
        var _this = this;
        this.intersectionObserver = new IntersectionObserver(function (entries) {
            entries.reverse().forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.active();
                }
                else if (entry.target.isActived) {
                    entry.target.unactive();
                }
            });
            _this.lastScrollTop = document.scrollingElement.scrollTop;
        });
        document.querySelectorAll(this.options.root).forEach(function (el) {
            _this.intersectionObserver.observe(el);
        });
    };
    // 生成目录
    Catalog.prototype.genSider = function () {
        var _this = this;
        var rootElements = document.querySelectorAll(this.options.root);
        var catalogContainer = document.querySelector(this.options.catalogRoot);
        var catalogList = document.createElement("ul");
        catalogList.classList.add("catalogList");
        rootElements.forEach(function (rootElement, index) {
            var item = document.createElement("li");
            // 设置css
            item.classList.add("t_catalog_item");
            var a = document.createElement("a");
            a.href = "#" + rootElement.id;
            a.textContent = rootElement.textContent;
            item.appendChild(a);
            catalogList.appendChild(item);
            _this.addActiveEvent(rootElements, rootElement, index, catalogList, item);
        });
        catalogContainer.appendChild(catalogList);
        this.addClickEvent(catalogList);
    };
    /**
     *
     * @param rootElements ： 内容区要定位的元素列表
     * @param catalogList ： 目录列表根元素
     * @param item : 目录项
     */
    Catalog.prototype.addActiveEvent = function (rootElements, rootElement, rootElementIndex, catalogList, item) {
        rootElement.active = function () {
            rootElements.forEach(function (detailItem) {
                detailItem.isActived = false;
            });
            (catalogList.querySelectorAll("li") || []).forEach(function (el) {
                el.classList.remove("t_catalog_item_active");
            });
            item.classList.add("t_catalog_item_active");
            rootElement.isActived = true;
        };
        rootElement.unactive = function () {
            // if (document.scrollingElement.scrollTop > this.lastScrollTop) {
            //   catalogList[rootElementIndex + 1] && catalogList[rootElementIndex + 1].active();
            // } else {
            //   catalogList[rootElementIndex - 1] && catalogList[rootElementIndex - 1].active();
            // }
        };
    };
    Catalog.prototype.addClickEvent = function (catalogList) {
        catalogList.addEventListener("click", function (event) {
            var eleLink = event.target.closest("a");
            var eleTarget = eleLink && document.querySelector(eleLink.getAttribute("href"));
            if (eleTarget) {
                event.preventDefault();
                eleTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
                if (CSS.supports("scroll-behavior: smooth")) {
                    setTimeout(function () {
                        eleTarget.active();
                    }, Math.abs(eleTarget.getBoundingClientRect().top - window.innerHeight / 2) / 2);
                }
                else {
                    eleTarget.active();
                }
            }
        });
    };
    return Catalog;
}());
exports["default"] = Catalog;
