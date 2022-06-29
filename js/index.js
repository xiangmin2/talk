// 验证是否有登录，如果没有登录，跳转到登录页，如果有登录，获取到登录信息
(async function () {
  const resp = await API.profile();
  console.log(resp);
  const user = resp.data;
  if (!user) {
    //   登录失败
    alert("未登录或登录已过期！");
    location.href = "./login.html";
    return;
  }
  //   登录成功状态
  const doms = {
    aside: {
      loginId: $("#loginId"),
      nickname: $("#nickname"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };
  setUserInfo();
  loadHistory();
  doms.msgContainer.onsubmit = (e) => {
    e.preventDefault();
    sendChat();
  };
  //   事件：注销账号
  doms.close.onclick = function () {
    API.loginOut();
    location.href = "./login.html";
  };
  //   提交事件

  //   加载历史记录
  async function loadHistory() {
    const resp = await API.getHistory();
    console.log(resp);
    for (const item of resp.data) {
      addChat(item);
    }
    scrollToBottom();
  }
  //   让聊天区域的滚动条滚到末尾
  function scrollToBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }
  //   设置用户信息
  function setUserInfo() {
    doms.aside.loginId.innerText = user.loginId;
    doms.aside.nickname.innerText = user.nickname;
  }
  //   添加聊天信息
  function addChat(chatInfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatInfo.from) {
      div.classList.add("me");
    }

    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formatDate(chatInfo.createdAt);
    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    doms.chatContainer.appendChild(div);
  }
  //   发送消息
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    console.log(content);
    addChat({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content,
    });
    doms.txtMsg.value = "";
    scrollToBottom();
    const resp = await API.sendChar(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollToBottom();
  }
  //   根据时间戳返回日期时间
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
  }
})();
