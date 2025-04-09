var dom = {
    loginId: document.querySelector('#txtLoginId'),
    loginPwd: document.querySelector('#txtLoginPwd'),
    loginButton: document.querySelector('.submit'),
    loginNickname: document.querySelector('#txtNickname'),
    loginPwdConfirm: document.querySelector('#txtLoginPwdConfirm'),
    nickName: document.querySelector('.container .aside #nickname'),
    account: document.querySelector('.container .aside #loginId'),
    chat_container: document.querySelector('.container .chat-container'),
    sendChatButton: document.querySelector('button'),
    txtMsg: document.querySelector('#txtMsg'),
    logOut: document.querySelector('.close')
}
const BASE_URL = 'https://study.duyiedu.com'
const TOKEN_KEY = 'token'
if (window.location.pathname !== '/login.html') {
    if (!localStorage.getItem(TOKEN_KEY)) {
        window.location.href = './login.html';
    }
}
var API = (() => {

    function get(url) {
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + url, {
            headers,
        });
    }
    function post(url, obj) {
        const headers = {
            "Content-Type": "application/json"
        }
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + url, {
            method: 'POST',
            headers,
            body: JSON.stringify(obj)
        })
    }
    //注册
    async function reg(userInfo) {
        return await post('/api/user/reg', userInfo).then((resp) => resp.json())
    }
    //登录
    async function login(loginInfo) {
        return await post('/api/user/login', loginInfo).then(async (resp) => {
            const body = await resp.json();
            const token = resp.headers.get('authorization')
            if (body.code === 0) {
                localStorage.setItem(TOKEN_KEY, token)
            }
            return body
        })
    }
    //验证用户
    async function exists(loginId) {
        return await get(`/api/user/exists?loginId=${loginId}`).then((resp) => resp.json())
    }
    //获取当前登录的用户信息
    async function getLoginUser() {
        return await get('/api/user/profile').then((resp) => resp.json())
    }
    //发送聊天消息
    async function sendChat(content) {
        return await post('/api/chat', { content }).then((resp) => resp.json())
    }
    //获取聊天记录
    async function getChat() {
        return await get('/api/chat/history').then((resp) => resp.json())
    }
    function logOut() {
        localStorage.removeItem(TOKEN_KEY)
    }
    /**
     * 
     * @param {String} type 验证的类型
     * @param {} userInfo 需要验证的对象
     * @param {} errDom 验证的dom数组
     */
    function errValidata(errDom) {
        //1.空值校验添加错误信息
        errDom.forEach(element => {
            if (!element.doms.value) {
                element.doms.nextElementSibling.innerText = element.doms.placeholder
                element.isValidata = false;
            } else {
                element.doms.nextElementSibling.innerText = ''
                element.isValidata = true;
            }
        });
        if (errDom.filter((item) => {
            return item.isValidata === false
        }).length === 0) {
            return true
        }
        return false

    }
    async function loginValidata(type, userInfo, errDom) {
        const isValidata = errValidata(errDom)
        //2.登录校验是否登录成功
        if (isValidata) {
            console.log(isValidata);
            switch (type) {
                case '登录':
                    console.log('登录校验');
                    const respBody = await login(userInfo)
                    return {
                        isValidata,
                        respBody
                    }
                case '注册':
                    console.log('注册校验');
                    const existsLoginId = await API.exists(userInfo.loginId)
                    if (existsLoginId.data) {
                        dom.loginId.nextElementSibling.innerText = '账号已存在'
                        return {
                            isValidata: false,
                            msg: '账号已存在',
                            respBody: {
                                code: 400
                            }
                        }
                    } else if (dom.loginPwdConfirm.value !== dom.loginPwd.value) {
                        dom.loginPwdConfirm.nextElementSibling.innerText = '两次输入的密码不一致!!!'
                        return {
                            isValidata: false,
                            msg: '两次输入的密码不一致',
                            respBody: {
                                code: 400
                            }
                        }
                    }
                    else {
                        const respBody = await API.reg(userInfo)
                        return {
                            isValidata: true,
                            respBody
                        }
                    }
                    break
            }
        }
        return {
            isValidata,
        }
        //3.注册校验是否存在以及其他校验
    }
    return {
        reg,
        login,
        exists,
        getLoginUser,
        logOut,
        errValidata,
        loginValidata,
        getChat,
        sendChat
    }
}
)()
