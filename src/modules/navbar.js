const navbarHamburgerToggler = () => {
  const buttonMenu = document.querySelector('#header-button');
  const buttonImage = document.querySelector('#hamburger-image');

  const navigationMenu = document.querySelector('.nav-items');
  const navigationLinks = document.querySelectorAll('.nav-link');

  function toggleNavigation() {
    navigationMenu.classList.toggle('header-nav-active');
  }

  function changeButtonIcon(path) {
    buttonImage.src = path;
  }
  const navigationIcons = ['./images/button-menu.png', './images/close-icon.svg'];
  navigationLinks.forEach((element) => {
    element.addEventListener('click', () => {
      toggleNavigation();
      changeButtonIcon(navigationIcons[0]);
      buttonMenu.style.width = 'initial';
    });
  });

  buttonMenu.addEventListener('click', () => {
    const actualButtonIcon = buttonImage.src;

    if (actualButtonIcon.includes('button-menu')) {
      changeButtonIcon(navigationIcons[1]);
      buttonMenu.style.width = '12px';
    } else {
      changeButtonIcon(navigationIcons[0]);
      buttonMenu.style.width = 'initial';
    }
    toggleNavigation();
  });
};

export default navbarHamburgerToggler;