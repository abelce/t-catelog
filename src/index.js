"use strict";
// exports.__esModule = true;
var Catelog = /** @class */ (function () {
    function Catelog(options) {
        this.options = options;
        this.genSider();
        this.createObserver();
    }
    // 创建观察者
    Catelog.prototype.createObserver = function () {
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
    Catelog.prototype.genSider = function () {
        var list = document.querySelectorAll(this.options.root);
        var navlist = document.querySelector(this.options.catelogEle);
        var fragment = document.createDocumentFragment();
        list.forEach(function (h3, index) {
            var navItem = document.createElement("a");
            navItem.href = "#" + h3.id;
            navItem.textContent = h3.textContent;
            fragment.appendChild(navItem);
            h3.active = function () {
                list.forEach(function (detailItem) {
                    detailItem.isActived = false;
                });
                (navlist.querySelectorAll("a") || []).forEach(function (el) {
                    el.classList.remove("active");
                });
                navItem.classList.add("active");
                h3.isActived = true;
            };
            h3.unactive = function () {
                if (document.scrollingElement.scrollTop > this.lastScrollTop) {
                    navlist[index + 1] && navlist[index + 1].active();
                }
                else {
                    navlist[index - 1] && navlist[index - 1].active();
                }
            };
        });
        navlist.appendChild(fragment);
        navlist.addEventListener("click", function (event) {
            var eleLink = event.target.closest("a");
            // 瀵艰埅瀵瑰簲鐨勬爣棰樺厓绱�
            var eleTarget = eleLink && document.querySelector(eleLink.getAttribute("href"));
            if (eleTarget) {
                event.preventDefault();
                // Safari涓嶆敮鎸佸钩婊戞粴鍔�
                eleTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
                if (CSS.supports("scroll-behavior: smooth")) {
                    // params.isAvoid = true;
                    setTimeout(function () {
                        eleTarget.active();
                        // params.isAvoid = false;
                    }, Math.abs(eleTarget.getBoundingClientRect().top - window.innerHeight / 2) / 2);
                }
                else {
                    eleTarget.active();
                }
            }
        });
    };
    return Catelog;
}());
// exports["default"] = Catelog;
window.Catelog = Catelog;
