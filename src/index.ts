interface ICatelog {
    root: string; // 文章根元素
    catelogEle: string; // 目录根元素
  }
  
  class Catelog {
    options: ICatelog;
    intersectionObserver: IntersectionObserver;
    lastScrollTop: number;
  
    constructor(options: ICatelog) {
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
      const list = document.querySelectorAll(this.options.root);
      const navlist = document.querySelector(this.options.catelogEle);
      const fragment = document.createDocumentFragment();
  
      list.forEach((h3, index) => {
        const navItem = document.createElement("a");
        navItem.href = "#" + h3.id;
        navItem.textContent = h3.textContent;
        fragment.appendChild(navItem);
  
        h3.active = function() {
            list.forEach((detailItem) => {
            detailItem.isActived = false;
          });
          (navlist.querySelectorAll("a") || []).forEach((el) => {
            el.classList.remove("active");
          });
          navItem.classList.add("active");
          h3.isActived = true;
        };
        h3.unactive = function() {
          if (document.scrollingElement.scrollTop > this.lastScrollTop) {
            navlist[index + 1] && navlist[index + 1].active();
          } else {
            navlist[index - 1] && navlist[index - 1].active();
          }
        };
      });
      navlist.appendChild(fragment);
      navlist.addEventListener("click", function(event) {
        var eleLink = event.target.closest("a");
        // 瀵艰埅瀵瑰簲鐨勬爣棰樺厓绱�
        var eleTarget =
          eleLink && document.querySelector(eleLink.getAttribute("href"));
        if (eleTarget) {
          event.preventDefault();
          // Safari涓嶆敮鎸佸钩婊戞粴鍔�
          eleTarget.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
  
          if (CSS.supports("scroll-behavior: smooth")) {
            // params.isAvoid = true;
            setTimeout(function() {
              eleTarget.active();
              // params.isAvoid = false;
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
  

  export default Catelog;