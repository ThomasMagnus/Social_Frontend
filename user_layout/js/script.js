document.addEventListener('DOMContentLoaded', () => {
    'use strict'

    const userMenuArrow = document.querySelector('.user__menu_arrow'),
          userList = document.querySelector('.user__list'),
          userArrow = document.querySelector('.user__menu_arrow i'),
          burger = document.querySelector('.burger'),
          burgerLine = document.querySelectorAll('.burger-line'),
          nav = document.querySelector('.nav');

    const showUserMenu = () => {
        userList.classList.toggle('active')
        userArrow.classList.toggle('active__arrow')
    }
    
    const showBurger = () => {
        burgerLine.forEach(item => {
            item.classList.toggle('active-line')
        })
        nav.classList.toggle('active-menu')
        userList.classList.remove('active')
        userArrow.classList.remove('active__arrow')
    }

    userMenuArrow.addEventListener('click', showUserMenu)
    burger.addEventListener('click', showBurger)
})