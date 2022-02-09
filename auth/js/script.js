document.addEventListener('DOMContentLoaded', () => {
    'use strict'

    const main = () => {

        const form = document.querySelector('.enter__form'),
            btn = document.querySelector('.enter__btn'),
            errorInputs = document.querySelector('.error__inputs'),
            errorText = document.querySelector('.error__text'),
            email = document.querySelector('#email'),
            password = document.querySelector('#password');

        form.querySelectorAll('ul').forEach(item => {
            item.style.display = 'none'
        })

        const data_errors = {
            error_account: 'Неверно указан логин или пароль'
        }

        class Error {
            constructor(text, email, password) {
                this.text = text
                this.access = false
                this.email = email
                this.password = password
            }

            getValidForm = () => {
                !this.email.value.match(/[a-zа-я0-9]/gi) ? this.email.classList.add('error') : this.email.classList.remove('error')
                !this.password.value.match(/[a-zа-я0-9]/gi) ? this.password.classList.add('error') : this.password.classList.remove('error')

                if (!this.email.value.match(/[a-zа-я0-9]/gi) || !this.password.value.match(/[a-zа-я0-9]/gi)) {
                    this.access = false
                    this.getErrorText()
                } else {
                    this.access = true
                    this.clearErrorText()
                }

                return this.access
            }

            getErrorText = () => {
                errorText.classList.add('error__active')
                errorInputs.textContent = this.text
            }

            clearErrorText = () => {
                errorInputs.textContent = ''
                errorText.classList.remove('error__active')
            }
        }


        const authUser = e => {
            e.preventDefault()

            let url;
            const error = new Error('Не все поля заполнены!', email, password)

            const data = new FormData(form)

            error.getValidForm()

            if (error.access) {

                fetch('/', {
                    method: 'POST',
                    body: data
                })
                    .then(data => {
                        if (data.status === 200) {
                            url = data.url
                        }
                        return data.text()
                    })
                    .then(response => {
                        if (url !== '' && response !== data_errors.error_account) {
                            console.log('redirect')
                            document.location = url
                        } else if (response === data_errors.error_account) {
                            const account_error = new Error(data_errors.error_account, email, password)
                            account_error.getErrorText()
                        }
                        form.reset()
                    })
            }
        }

        btn.addEventListener('click', e => authUser(e))
    }

    main()
})