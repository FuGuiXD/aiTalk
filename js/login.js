
//添加blur事件检验空值
dom.loginId.addEventListener('blur', function () {
    API.errValidata([{
        doms: this,
    }]);
})
dom.loginPwd.addEventListener('blur', function () {
    API.errValidata([{
        doms: this,
    }]);
})
//登录按钮点击事件
dom.loginButton.addEventListener('click', async function (e) {
    e.preventDefault()
    const loginResp = await API.loginValidata('登录', {
        loginId: dom.loginId.value,
        loginPwd: dom.loginPwd.value
    }, [{
        doms: dom.loginId
    }, {
        doms: dom.loginPwd
    }])
    console.log(loginResp)
    if (loginResp.isValidata && loginResp.respBody.code === 400) {
        dom.loginId.nextElementSibling.innerText = loginResp.respBody.msg
    } else if (loginResp.isValidata && loginResp.respBody.code === 0) {
        console.log('登录成功')
        window.location.href='./index.html'
    }

})
