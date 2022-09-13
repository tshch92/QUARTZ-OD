export const headerMob = () => {
    const closeBtn = document.querySelector('.header-button-close');
    const burgerBtn = document.querySelector('.header-button-burger');
    const headerNav = document.querySelector('.header-nav');

    closeBtn.addEventListener('click', () => {
        headerNav.classList.remove('expanded');
    });

    burgerBtn.addEventListener('click', () => {
        headerNav.classList.add('expanded');
    });
}