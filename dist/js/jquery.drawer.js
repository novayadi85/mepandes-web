jQuery(document).ready(function() {
  jQuery("#openDrawerButton").click(function() {
      openDrawer()
  });

  jQuery("[drawer-menu]").click(function() {
      openDrawer()
  });

  let config = {
      title : 'Menu'
  }
  let headerTitle = config.title;
  let activeMenuId = null;
  const visitedMenus = []; // Array to keep track of visited menu IDs

  jQuery(document).on('click', '.accordion--element', function (e) {
      e.preventDefault();
      console.log('accordion')
      const target = jQuery(this).next(".accordion--target");

      console.log('target', target)

      if (target.is(":hidden")) {
          jQuery(this).attr('aria-expanded', true)
          target.slideDown(200);
          setTimeout(() => {
              target.addClass('expand')
          }, 300);

      }
      else {
          jQuery(this).attr('aria-expanded', false)

          target.removeClass('expand')
          setTimeout(() => {
              target.slideUp(200);
          }, 300);
      }

      if (activeMenuId) {
          setTimeout(() => {
              const activeHtml = jQuery('.drawer--contents').html()
              jQuery('.menu_source').find(`#${activeMenuId}`).html(activeHtml);

              if (jQuery('.menu_source').find(`#${activeMenuId}`).length <= 0 &&  jQuery(".menu_source").find(`[data-menu="${activeMenuId}"] > .menu-holder`).length > 0) {
                  jQuery(".menu_source").find(`[data-menu="${activeMenuId}"] > .menu-holder`).html(activeHtml)
              }
          }, 1000);

      }

  });

  jQuery(document).on('click', '[data-menu-id]', function (e) {
      const menuId = jQuery(this).data("menu-id");
      activeMenuId = menuId;
      headerTitle = jQuery(this).text();
      showContent(menuId, false);
      setTitle();
  });

  jQuery(document).on('click', '[data-menu]', function (e) {
      let menuId = jQuery(this).data("menu-id");
      headerTitle = jQuery(this).text();
      if (!menuId) {
          //console.log('data-menu', menuId)
          //console.log('data-menu', jQuery(this))
          menuId = jQuery(this).attr("data-menu");
          headerTitle = jQuery(this).find('> a').text();
      }

      if (jQuery(".menu_source").find(`[data-menu="${menuId}"] > .menu-holder`).length > 0) {
          e.preventDefault();
      }

      if (menuId) {
          activeMenuId = menuId;
          showContent(menuId, false);
          setTitle();
      }

  });

  function openDrawer() {
      jQuery(".drawer--menu").toggleClass("open");
      addOverlay();
  }

  function closeDrawer() {
      jQuery(".drawer--menu").removeClass("open");
      reset();
      removeOverlay();
  }

  function addOverlay() {
      if (jQuery('body').find('.drawer--overlay').length <= 0) {
          jQuery('body').append('<div class="drawer--overlay"></div>');
      }
  }

  function removeOverlay() {
      jQuery('.drawer--overlay').remove();
  }

  function setTitle() {
      jQuery('[data-drawer-title]').text(headerTitle.trim())
  }

  //jQuery('.data-drawer-title').text(headerTitle)

  function reset() {
      activeMenuId = null
      const newContent = jQuery("#primary").html();
      headerTitle = config.title;
      jQuery(".drawer--contents").removeClass("sliding slide-in");
      jQuery(".drawer--contents").html(newContent);

      setTitle();
  }

  function resetDrawerContent() {
      jQuery(".drawer--contents").addClass("sliding");
      let animated = 'slide-in';
      const newContent = jQuery(".menu_source #primary").html();
      headerTitle = config.title;
      activeMenuId = null
      jQuery(".drawer--contents")
          .html(newContent)
          .removeClass(animated)
          .addClass(animated)
          .promise()
          .done(function () {
              setTimeout(() => {
                  jQuery(this).removeClass(function(index, className) {
                      return (className.match(/(^|\s)(?!drawer--contents)\S+/g) || []).join(' ');
                  });
              }, 500);
          });

      setTitle();
  }

  function goBack() {
      if (visitedMenus.length > 0) {
        visitedMenus.pop();
        const lastMenuId = visitedMenus[visitedMenus.length - 1];

        if (lastMenuId) {
          showContent(lastMenuId, true);
        } else {
          // If there are no more items in the array, reset the drawer content
            resetDrawerContent();
            activeMenuId = null
        }
      }
      else {
          activeMenuId = null
          closeDrawer();
      }

      jQuery('.data-drawer-title').text(headerTitle)
  }

  function showContent(menuId, back = false) {
      // if (activeMenuId === menuId) return;

      activeMenuId = menuId;

      if (!visitedMenus.includes(menuId)) {
          visitedMenus.push(menuId);
      }

      let selectedMenu = jQuery("#" + menuId);

      let old = false;
      if (selectedMenu.length <= 0) {
          selectedMenu = jQuery(".menu_source").find(`[data-menu="${menuId}"]`);
          old = true;
      }

      //console.log(menuId)
      //console.log(visitedMenus)
      //console.log(selectedMenu.length)

      let newContent = '';

      if (old && selectedMenu.length) {
          newContent = jQuery(".menu_source").find(`[data-menu="${menuId}"] > .menu-holder `).html()

          jQuery(".drawer--contents").addClass("sliding");

          selectedMenu.addClass("active");

          let animated = 'slide-in';

          if (selectedMenu.attr('data-animated')) {
              animated = selectedMenu.attr('data-animated');
          }

          if (selectedMenu.attr('data-title')) {
              headerTitle = selectedMenu.attr('data-title')
          }

          if (visitedMenus.length > 0 && !back) {
              animated = 'slide-right-to-left'
          }

          jQuery(".drawer--contents").html(newContent).removeClass(animated).addClass(animated);

          setTimeout(function() {
              jQuery(".drawer--contents").removeClass(`sliding ${animated}`);
              jQuery(".drawer--contents").removeClass('slide-in');
          }, 500);


          jQuery(".drawer-back-button").show();

          setTitle();

          return;

      }

      if (selectedMenu.length) {
          jQuery(".drawer--content").removeClass("active");
          jQuery(".drawer--contents").addClass("sliding");

          selectedMenu.addClass("active");

          let animated = 'slide-in';
          if (selectedMenu.attr('data-animated')) {
              animated = selectedMenu.attr('data-animated');
          }

          if (selectedMenu.attr('data-title')) {
              headerTitle = selectedMenu.attr('data-title')
          }


          if (visitedMenus.length > 0) {
              animated = 'slide-right-to-left'
          }

          newContent = jQuery("#" + menuId).html();

          jQuery(".drawer--contents").html(newContent).removeClass(animated).addClass(animated);

          setTimeout(function() {
              jQuery(".drawer--contents").removeClass(`sliding ${animated}`);
              jQuery(".drawer--contents").removeClass('slide-in');
          }, 500);


          jQuery(".drawer-back-button").show();

      }

      setTitle();

  }

  jQuery(".drawer-back-button").click(function() {
      goBack();
  });

  jQuery(".drawer-close-button").click(function() {
      closeDrawer();
  });



});

const images_menus = {};
document.addEventListener("DOMContentLoaded", function() {
  var lazyloadImages = document.querySelectorAll("img.lazyloaded");
  var lazyloadThrottleTimeout;

  function lazyload() {
      if (lazyloadThrottleTimeout) {
          clearTimeout(lazyloadThrottleTimeout);
      }

      lazyloadThrottleTimeout = setTimeout(function() {
          lazyloadImages.forEach(function(img) {
              if (images_menus[img?.dataset?.imageId]) {
                  if (!images_menus[img.dataset.imageId].includes('no-image')) {
                      img.src = images_menus[img?.dataset?.imageId];
                  } else {
                      img.style.display = 'none'
                  }
              }
              else if(img?.dataset?.src) {
                  img.src = img.dataset.src;
              }

              img.classList.remove('lazy');
          });
      }, 20);
  }

  lazyload();

});
