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
          coverForm = document.querySelector('.cover__form'),
          searchInput = document.querySelector('.search__input'),
          searchForm = document.querySelector('.search');

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

    const removeSearchFriendsText = e => {
        const target = e.target

        try {
            if (target.classList !== '.search__friendItem a') {
                document.querySelector('.search__friendList').remove()
            }
        } catch {}
    }

    const searchUsers = () => {

        class Users {
            constructor(name, id, avatar, limit = 7) {
                this.name = name;
                this.id = id;
                this.avatar = avatar;
                this.limit = limit;
            }

            createUSer(ul) {

                const createHtml = img => {
                    return (`
                            <a href=http://localhost:8000/friends/${this.id}>
                                <div class="search__img">
                                    <img src="${img}" alt="friend_img">
                                </div>
                                ${this.name}
                            </a>
                        `)
                }

                const html = this.avatar ? createHtml(this.avatar) : createHtml('/static/img/user_logo.jpg');

                const li = document.createElement('li')
                li.classList.add('search__friendItem')
                li.innerHTML = html

                ul.append(li)

            }
        }

        const clearSearchPanel = () => {
            try {
                searchForm.querySelector('.search__friendList').remove()
            } catch (e) {}
        }

        if (searchInput.value.trim()) {

            let dataDict = {
                friendsSearch: searchInput.value.toLowerCase()
            }

            let data = JSON.stringify(dataDict)

            postData(data, 'http://localhost:8000/users/friends/searchFriend/', getCookie())
                .then(response => response.json())
                .then(data => {
                    clearSearchPanel()
                    const ul = document.createElement('ul')
                    ul.classList.add('search__friendList')
                    searchForm.append(ul)

                    data.forEach(item => {
                        let users;
                        console.log(item)
                        if (data.length > 7){
                            users = new Users(item[0], item[1], item[2])
                        } else {
                            users = new Users(item[0], item[1], item[2], data.length)
                        }

                        users.createUSer(ul)
                        console.log(`User: ${item[0]}, id: ${item[1]}`)
                    })
                })
            }
        else {
            clearSearchPanel()
        }
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
    searchInput.addEventListener('input', searchUsers)
    document.body.addEventListener('click', (e) => removeSearchFriendsText(e))

    delErrorList()
})