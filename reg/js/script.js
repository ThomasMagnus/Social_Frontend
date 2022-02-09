document.addEventListener('DOMContentLoaded', () => {
    'use strict'

    const form = document.querySelector('.reg__form'),
          inputs = form.querySelectorAll('input'),
          password1 = form.querySelector('#id_password1'),
          password2 = form.querySelector('#id_password2'),
          errorInputs = document.querySelector('.error__inputs'),
          errorText = document.querySelector('.error__text'),
          btn = form.querySelector('.enter__btn');

    const main = () => {

        let access = true

        const errors = {
            errorPass: 'Пароли не совпадают',
            errorInputs: 'Не все поля заполнены'
        }

        const getErrorText = text => {
            errorText.classList.add('error__active')
            errorInputs.textContent = text
        }

        const clearErrorText = () => {
            errorInputs.textContent = ''
            errorText.classList.remove('.error__active')
        }

        const detectedPassValid = () => {
            if (password1.value !== password2.value) {
                access = false
                getErrorText(errors.errorPass)
                password1.classList.add('error')
                password2.classList.add('error')
            } else {
                access = true
                clearErrorText()
                password1.classList.remove('error')
                password2.classList.remove('error')
            }
        }

        const detectedValidForm = () => {
            let flag;
            inputs.forEach(item => {
                !item.value.match(/[a-zа-я0-9]/gi) ? item.classList.add('error') : item.classList.remove('error')
            })

            for (let i = 0; i <= inputs.length - 1; i++) {
                if (!inputs[i].value.match(/[a-zа-я0-9]/gi)) {
                    flag = false
                    getErrorText(errors.errorInputs)
                    return
                } else {
                    clearErrorText()
                    flag = true
                }
            }

            return flag
        }

        const createUser = e => {
            e.preventDefault()

            const formData = new FormData(form)

            if (detectedValidForm()) {

                detectedPassValid()

                if (access) {
                    fetch('/reg/', {
                        method: 'POST',
                        body: formData
                    })
                        .then(data => {
                            console.log(data)
                            return data.text()
                        })
                        .then(response => {
                            console.log(response)
                        })
                }
            }
        }

        btn.addEventListener('click', e => createUser(e))
    }

    main()
})