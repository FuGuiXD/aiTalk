//初始化函数
async function init() {
    //获取当前登录用户信息
    const currentLoginUser = await API.getLoginUser();
    dom.nickName.innerText = currentLoginUser.data.nickname;
    dom.account.innerText = currentLoginUser.data.loginId
    //获取当前用户的聊天记录,并将记录add到dom中
    const userChat = await API.getChat()
    userChat.data.forEach(item => {
        createChat(item)
    });
    //创建对话函数
    function createChat(chatInfo) {
        const appednDom = document.createElement('div');
        appednDom.classList.add('chat-item')
        if (chatInfo.from === currentLoginUser.data.loginId) {
            appednDom.classList.add('me')
            appednDom.innerHTML = `<img class='chat-avatar'src='./asset/avatar.png'>
            <div class='chat-content'>${chatInfo.content}</div>
            <div class='chat-date __web-inspector-hide-shortcut__'>${formatDate(new Date(chatInfo.createdAt))}</div>`
        }
        else {
            appednDom.innerHTML = `<img class='chat-avatar'src='./asset/robot-avatar.jpg'>
            <div class='chat-content'>${chatInfo.content}</div>
            <div class='chat-date __web-inspector-hide-shortcut__'>${formatDate(new Date(chatInfo.createdAt))}</div>`
        }
        dom.chat_container.appendChild(appednDom)
        scrollLoad()
    }
    function scrollLoad() {
        dom.chat_container.scrollTo({
            top: dom.chat_container.scrollHeight,
            behavior: 'smooth'
        })
    }

    //发送信息函数
    dom.sendChatButton.addEventListener('click', async function (e) {
        e.preventDefault()
        if (dom.txtMsg.value === '') {
            alert('请输入内容')
        }else{
            const reloadValue = dom.txtMsg.value;
            createChat({
                content: dom.txtMsg.value,
                createdAt: Date.now(),
                from: currentLoginUser.data.loginId
            })
            dom.txtMsg.value = ''
            const respBody = await API.sendChat(reloadValue);
            createChat({
                content: respBody.data.content,
                createdAt: respBody.data.createdAt
            })
    
            //退出登录函数
            dom.logOut.addEventListener('click', function () {
                API.logOut();
                window.location.href = './login.html'
            })
        }
        


    })
}
//时间转换函数
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


init();