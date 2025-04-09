dom.loginId.addEventListener('blur', async function () {
    const validate = API.errValidata([{
        doms: this,
    }]);
    if (validate) {
        const respBody = await API.exists(this.value)
        if (respBody.data) {
            this.nextElementSibling.innerText = '账号已存在'
        }
    }
})
dom.loginNickname.addEventListener('blur', function () {
    API.errValidata([{
        doms: this,
    }]);
})
dom.loginPwd.addEventListener('blur', function () {
    API.errValidata([{
        doms: this,
    }]);
})
dom.loginPwdConfirm.addEventListener('blur', function () {
    if (API.errValidata([{
        doms: this,
    }])) {
        if (this.value !== dom.loginPwd.value) {
            this.nextElementSibling.innerText = '两次输入的密码不一致!!!'
        }
    }
})
dom.loginButton.addEventListener('click', async function (e) {
    e.preventDefault()
    const regBody= await API.loginValidata('注册',
        {
            loginId: dom.loginId.value,
            nickname: dom.loginNickname.value,
            loginPwd: dom.loginPwd.value
        }, [{
            doms: dom.loginId
        }, {
            doms: dom.loginNickname
        }, {
            doms: dom.loginPwd
        },
        {
            doms: dom.loginPwdConfirm
        }])
        console.log(regBody)
    if(regBody.respBody.code===0){
        console.log('注册成功!!')
         window.location.href='./login.html'
    }

})