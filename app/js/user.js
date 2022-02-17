document.addEventListener('DOMContentLoaded', () => {
    'use strict'

    const userCover = document.querySelector(".userCover"),
          userCoverEditWrapper = document.querySelector(".userCover__edit_wrapper"),
          editDots = document.querySelectorAll('.fa-ellipsis-v'),
          ellipsisList = document.querySelectorAll('.ellipsis__list'),
          editPostElem = document.querySelectorAll('.edit-post'),
          contentCancel = document.querySelectorAll('.cancel__wrapper'),
          contentBtn = document.querySelector('.content__btn'),
          content__form = document.querySelector('.content__form'),
          contentEditBtn = document.querySelectorAll('.content__edit-btn'),
          ellipsisDel = document.querySelectorAll('.ellipsis__del'),
          userCoverEdit = document.querySelector('.userCover__edit'),
          errorlist = document.querySelector('.errorlist'),
          coverForm = document.querySelector('.cover__form');

    let target, parentElement, contentTextEdit, contentPanel;

    const postData = async (data, url, header) => {
        return await fetch(url, {
            method: 'POST',
            body: data,
            headers: header,
            credentials: 'include',
        })
    }

    const showEdit = () => {
        userCoverEditWrapper.classList.toggle('edit__active')
    }

    const hideEdit = () => {
        userCoverEditWrapper.classList.remove('edit__active')
    }

    const announceVars = e => {
        target = e.target
        parentElement = target.closest('.content__item')
        contentTextEdit = parentElement.querySelector('.content__text-edit')
        contentPanel = parentElement.querySelector('.content__panel')
    }

    const showEditDotsMessage = e => {

        let index = detectDotsMessage()

        announceVars(e)

        const element = target.parentElement.querySelector('.ellipsis__list')
        if (index && ellipsisList[index] === element) {
            element.classList.remove('active_disp')
            return
        }

        element.classList.add('active_disp')
    }

    const detectDotsMessage = () => {
        let indexElem;
        ellipsisList.forEach((item, i) => {
            if (item.classList.contains('active_disp')) {
                item.classList.remove('active_disp')
                indexElem = i
            }
        })
        return indexElem
    }

    const editPost = e => {

        announceVars(e)

        const element = parentElement.querySelector('.content__text')
        const editPostForm = document.createElement('form')
        const textarea = document.createElement('textarea')
        const contentTextEdit = parentElement.querySelector('.content__text-edit')
        const contentPanel = parentElement.querySelector('.content__panel')

        detectDotsMessage()

        editPostForm.classList.add('edit_post_form')
        element.style.display = 'none'

        textarea.classList.add('edit__content')
        textarea.setAttribute('data-id', element.getAttribute('data-id'))
        textarea.setAttribute('name', 'editPost')
        editPostForm.append(textarea)
        textarea.value = element.textContent
        contentTextEdit.before(editPostForm)

        contentPanel.style.display = 'flex'
    }

    const cancelEditPost = e => {
        announceVars(e)

        const element = parentElement.querySelector('.edit__content')
        const contentText = parentElement.querySelector('.content__text')
        element.remove()

        contentPanel.style.display = 'none'
        contentText.style.display = 'block'
    }

    const editPostText = () => {
        const editPostForm = document.querySelector('.edit_post_form');
        let postValue = editPostForm.querySelector('.edit__content')

        const formData = {
            editPost: postValue.value,
            id: postValue.getAttribute('data-id')
        }

        const jsonData = JSON.stringify(formData)

        postData(jsonData, 'http://localhost:8000/createPost/edit/', getCookie())
            .then(response => console.log(response))
            .finally(() => {
                document.location.reload()
            })
    }

    const getCookie = () => {

        const getCookieString = name => {
            let cookieValue = null

            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';')
                for (let i=0; i <= cookies.length - 1; i++) {
                    if (cookies[i].substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookies[i].substring(name.length + 1))
                    }
                }
            }
            return cookieValue
        }

        const headers = new Headers()
        headers.append('X-CSRFToken', getCookieString('csrftoken'))
        return headers
    }

    const postDataForm = (e) => {
        e.preventDefault()

        const formData = new FormData(content__form)

        if (document.querySelector('#comment').value !== ""){

            postData(formData, 'http://localhost:8000/createPost/', getCookie())
                .then(response => console.log(response))
                .finally(() => {
                    content__form.reset()
                    document.location.reload()
                })
        }
    }

    const deletePost = e => {
        const target = e.target
        const postText = target.closest('.content__item').querySelector('.content__text')
        target.closest('.ellipsis__list ').classList.remove('active_disp')

        const formData = {
            postId: postText.getAttribute('data-id')
        }

        const jsonData = JSON.stringify(formData)

        postData(jsonData, 'http://localhost:8000/createPost/deletePost/', getCookie())
            .then(response => console.log(response))
            .finally(() => document.location.reload())

    }

    const changeCoverPhoto = () => {

        const formData = new FormData(coverForm)
        const headers = {'X-CSRFToken': getCookie()}

        const location = document.location.pathname
        const userId = location.match(/\d/g).join('')

        formData.append('user_id', userId)

        postData(formData, 'http://localhost:8000/users/changeCover/photo', headers)
            .then(response => {
                console.log(response)
                document.location.reload()
            })
    }

    const delErrorList = () => {
        errorlist.style.display = 'none'
    }


    userCover.addEventListener("mouseenter", showEdit)
    userCover.addEventListener("mouseleave", hideEdit)
    editDots.forEach(element => element.addEventListener('click', showEditDotsMessage))
    editPostElem.forEach(item => item.addEventListener('click', editPost))
    contentCancel.forEach(item => item.addEventListener('click', cancelEditPost))
    contentEditBtn.forEach(item => item.addEventListener('click', editPostText))
    contentBtn.addEventListener('click', e => postDataForm(e))
    ellipsisDel.forEach(item => item.addEventListener('click', e => deletePost(e)))
    userCoverEdit.addEventListener('change', changeCoverPhoto)

    delErrorList()
})