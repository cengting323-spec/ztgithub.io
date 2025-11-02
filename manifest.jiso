```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>手机界面</title>
    <style>
        :root {
            --phone-border-color: #FFC0CB; /* 淡粉色 */
            --screen-bg: #FFFFFF;
            --app-icon-text-color: #333;
            --main-bg-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><text y="20" font-size="20">🌸</text><text x="50" y="50" font-size="20">🌸</text><text x="20" y="80" font-size="20">🌸</text><text x="80" y="30" font-size="20">🌸</text><text x="70" y="90" font-size="20">🌸</text></svg>');
            --weather-bg: #E0F7FA;
            --music-bg: #D6EAF8; /* 带雪花的淡蓝色背景 */
            --accent-color: #F8BBD0;
            --text-secondary: #757575;
            --popup-bg: rgba(0, 0, 0, 0.4);
        }

        body {
            background-color: transparent;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            margin: 0;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: calc(100vh - 20px);
        }

        .phone-container {
            width: 100%;
            max-width: 400px;
            aspect-ratio: 9 / 18;
            background-color: var(--screen-bg);
            border: 8px solid var(--phone-border-color);
            border-radius: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .phone-screen {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
        }

        .screen {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--screen-bg);
            transition: transform 0.3s ease-in-out;
            transform: translateX(100%);
            display: flex;
            flex-direction: column;
        }

        .screen.active {
            transform: translateX(0);
        }

        /* --- 主屏幕 --- */
        .main-screen {
            background-image: var(--main-bg-image);
            background-size: 20%;
            background-repeat: repeat;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 40px 20px;
            align-content: start;
        }
        .main-screen.active { transform: translateX(0); }
        .app-icon { display: flex; flex-direction: column; align-items: center; text-align: center; cursor: pointer; text-decoration: none; color: var(--app-icon-text-color); }
        .app-icon .icon { font-size: 48px; line-height: 1; transition: transform 0.2s; }
        .app-icon .app-name { font-size: 14px; margin-top: 8px; }
        .app-icon:hover .icon { transform: scale(1.1); }

        /* --- 通用头部和返回按钮 --- */
        .header { display: flex; align-items: center; padding: 12px 15px; background-color: #F8F9FA; border-bottom: 1px solid #E0E0E0; flex-shrink: 0; position: relative; }
        .back-button { font-size: 24px; font-weight: bold; cursor: pointer; text-decoration: none; color: #555; margin-right: 10px; z-index: 2; }
        .header-title { font-size: 18px; font-weight: 600; margin: 0; text-align: center; flex-grow: 1; }
        .header-action { font-size: 24px; cursor: pointer; color: #555; position: absolute; right: 15px; top: 50%; transform: translateY(-50%); z-index: 2; }

        /* --- 弹出窗口通用样式 --- */
        .popup-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--popup-bg); display: none; align-items: center; justify-content: center; z-index: 100; opacity: 0; transition: opacity 0.3s; }
        .popup-overlay.active { display: flex; opacity: 1; }
        .popup-window { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); text-align: center; transform: scale(0.9); transition: transform 0.3s; }
        .popup-overlay.active .popup-window { transform: scale(1); }
        .popup-window h3 { margin-top: 0; }
        .popup-window input, .popup-window textarea { width: 90%; padding: 8px; margin-top: 10px; border: 1px solid #ccc; border-radius: 5px; resize: none; }
        .popup-window .popup-actions { margin-top: 20px; }
        .popup-window button { padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; margin: 0 5px; }
        .popup-window .btn-confirm { background-color: var(--accent-color); color: white; }
        .popup-window .btn-cancel { background-color: #E0E0E0; }

        /* --- 消息界面 --- */
        .message-screen { justify-content: space-between; }
        .message-content { flex-grow: 1; overflow-y: auto; background-color: #fff; }
        .message-tab-content { display: none; height: 100%; }
        .message-tab-content.active { display: block; }
        .message-footer { display: flex; justify-content: space-around; padding: 10px 0; border-top: 1px solid #E0E0E0; background-color: #F8F9FA; }
        .message-footer span { color: var(--text-secondary); cursor: pointer; padding: 5px 10px; border-radius: 5px; }
        .message-footer span.active { color: var(--phone-border-color); font-weight: bold; }
        /* 我的界面 */
        .profile-page { padding: 30px; text-align: center; }
        .profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: #EEE; margin: 0 auto; background-size: cover; background-position: center; }
        .profile-name { font-size: 20px; font-weight: bold; margin-top: 15px; }
        .profile-signature { font-size: 14px; color: var(--text-secondary); margin-top: 5px; }
        /* 联系人界面弹出菜单 */
        .contacts-popup-menu { position: absolute; top: 50px; right: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); display: none; flex-direction: column; z-index: 10; }
        .contacts-popup-menu a { padding: 10px 15px; text-decoration: none; color: #333; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
        .contacts-popup-menu a:last-child { border-bottom: none; }
        .contacts-popup-menu.active { display: flex; }

        /* --- 购物车界面 --- */
        .cart-screen { justify-content: space-between; }
        .cart-main-content { flex-grow: 1; overflow: hidden; display: flex; flex-direction: column; }
        .search-bar { display: flex; padding: 10px 15px; }
        .search-bar input { flex-grow: 1; border: 1px solid #CCC; border-radius: 15px; padding: 8px 12px; font-size: 14px; }
        .categories-container { padding: 0 15px; overflow-x: auto; white-space: nowrap; -ms-overflow-style: none; scrollbar-width: none; border-bottom: 1px solid #f0f0f0; }
        .categories-container::-webkit-scrollbar { display: none; }
        .category { display: inline-block; padding: 8px 15px; margin: 5px 5px 10px 0; text-align: center; background-color: #F5F5F5; border-radius: 15px; cursor: pointer; font-size: 14px; }
        .cart-tab-content { flex-grow: 1; display: none; padding: 15px; text-align: center; color: var(--text-secondary); font-size: 18px; overflow-y: auto; }
        .cart-tab-content.active { display: block; }
        .cart-footer { display: flex; justify-content: space-around; padding: 10px 0; border-top: 1px solid #E0E0E0; background-color: #F8F9FA; }
        .cart-footer span { color: var(--text-secondary); cursor: pointer; padding: 5px 10px; }
        .cart-footer span.active { color: var(--phone-border-color); font-weight: bold; }

        /* --- 音乐界面 --- */
        .music-screen { background-color: var(--music-bg); position: relative; overflow: hidden; align-items: center; justify-content: center; }
        .snowflake { position: absolute; color: white; font-size: 20px; top: -20px; animation: fall linear infinite; user-select: none; }
        @keyframes fall {
            to { transform: translateY(110vh); }
        }
        .record-player { width: 250px; height: 250px; border-radius: 50%; background: linear-gradient(45deg, #333, #111); display: flex; align-items: center; justify-content: center; animation: rotate 10s linear infinite paused; z-index: 1; }
        .record-player.playing { animation-play-state: running; }
        .record-label { width: 80px; height: 80px; border-radius: 50%; background-color: var(--accent-color); }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }


        /* --- 其他原始界面保持基本样式 --- */
        .notepad-screen, .x-screen { padding: 15px; overflow-y: auto; }
        .weather-screen { background-color: var(--weather-bg); padding: 20px; display: flex; flex-direction: column; align-items: center; }
        .current-weather { text-align: center; margin-bottom: 30px; }
        .weather-icon { font-size: 80px; }
        .temperature { font-size: 48px; font-weight: bold; }
        .weather-desc { font-size: 20px; color: var(--text-secondary); }
        .forecast { width: 100%; display: flex; justify-content: space-around; }
        .day-forecast { text-align: center; }
        .resource-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #EEE; font-size: 16px; }
    </style>
</head>
<body>

<div class="phone-container">
    <div class="phone-screen">


        <div id="main" class="screen main-screen active">
            <a class="app-icon" onclick="showScreen('message')"><span class="icon">✉️</span><span class="app-name">消息</span></a>
            <a class="app-icon" onclick="showScreen('cart')"><span class="icon">🛒</span><span class="app-name">购物车</span></a>
            <a class="app-icon" onclick="showScreen('notepad')"><span class="icon">📒</span><span class="app-name">记事本</span></a>
            <a class="app-icon" onclick="showScreen('music')"><span class="icon">🎶</span><span class="app-name">音乐</span></a>
            <a class="app-icon" onclick="showScreen('weather')"><span class="icon">🌙</span><span class="app-name">天气</span></a>
            <a class="app-icon" onclick="showScreen('x')"><span class="icon">X</span><span class="app-name">物资</span></a>
        </div>


        <div id="message" class="screen message-screen">
            <div id="message-header" class="header">
                 <a class="back-button" onclick="showScreen('main')">‹</a>
                 <h1 id="message-header-title" class="header-title">朋友圈</h1>
                 <span id="message-header-action" class="header-action" onclick="handleMessageAction()">+</span>
            </div>
            <div class="message-content">
                <div id="message-tab-moments" class="message-tab-content active" style="padding: 15px; text-align:center; color: #999;">还没有动态哦</div>
                <div id="message-tab-contacts" class="message-tab-content" style="padding: 15px; text-align:center; color: #999;">好友列表</div>
                <div id="message-tab-profile" class="message-tab-content">
                    <div class="profile-page">
                        <div class="profile-avatar"></div>
                        <div class="profile-name">我的名字</div>
                        <div class="profile-signature">在这里写下你的个性签名</div>
                    </div>
                </div>
            </div>
            <div id="contacts-menu" class="contacts-popup-menu">
                <a href="#">添加好友</a><a href="#">删除好友</a><a href="#">创建群聊</a><a href="#">删除群聊</a>
            </div>
            <div class="message-footer">
                <span id="msg-tab-btn-moments" class="message-tab-btn" onclick="switchMessageTab('moments')">朋友圈</span>
                <span id="msg-tab-btn-contacts" class="message-tab-btn" onclick="switchMessageTab('contacts')">联系人</span>
                <span id="msg-tab-btn-profile" class="message-tab-btn" onclick="switchMessageTab('profile')">我</span>
            </div>
        </div>


        <div id="cart" class="screen cart-screen">
            <div class="header">
                <a class="back-button" onclick="showScreen('main')">‹</a>
                <h1 class="header-title">商城</h1>
            </div>
            <div class="cart-main-content">
                <div class="search-bar"><input type="text" placeholder="搜索商品"></div>
                <div class="categories-container">
                    <span class="category">水果</span><span class="category">蔬菜</span><span class="category">医药</span><span class="category">情趣用品</span><span class="category">女装</span><span class="category">男装</span><span class="category">家居</span><span class="category">零食</span>
                </div>
                <div id="cart-tab-products" class="cart-tab-content">这里是商品列表</div>
                <div id="cart-tab-mycart" class="cart-tab-content">购物车是空的</div>
            </div>
            <div class="cart-footer">
                <span id="cart-tab-btn-products" class="cart-tab-btn" onclick="switchCartTab('products')">商品</span>
                <span id="cart-tab-btn-mycart" class="cart-tab-btn" onclick="switchCartTab('mycart')">购物车</span>
            </div>
        </div>

        <div id="notepad" class="screen">
            <div class="header"><a class="back-button" onclick="showScreen('main')">‹</a><h1 class="header-title">记事本</h1></div>
            <div class="notepad-screen"><p>1.<br>这是一个重要的事件。</p><p>2.<br>这是另一件需要记住的事情。</p></div>
        </div>

        <div id="music" class="screen music-screen">
            <a class="back-button" onclick="showScreen('main')" style="position: absolute; top: 12px; left: 15px; color: #333; z-index: 10;">‹</a>
            <div class="header-action" onclick="togglePopup('add-song-popup')" style="color: #333;">+</div>
            <div class="record-player" onclick="this.classList.toggle('playing')">
                <div class="record-label"></div>
            </div>
        </div>

        <div id="weather" class="screen weather-screen">
             <div class="header" style="background: transparent; border-bottom: none;"><a class="back-button" onclick="showScreen('main')">‹</a><h1 class="header-title">天气</h1></div>
             <div class="current-weather"><div class="weather-icon">☀️</div><div class="temperature">28°C</div><div class="weather-desc">晴朗</div></div>
             <div class="forecast"><div class="day-forecast">周一<br>☁️<br>29°/21°</div><div class="day-forecast">周二<br>🌦️<br>27°/20°</div><div class="day-forecast">周三<br>☀️<br>30°/22°</div></div>
        </div>

        <div id="x" class="screen">
            <div class="header"><a class="back-button" onclick="showScreen('main')">‹</a><h1 class="header-title">远程物资查看</h1></div>
            <div class="x-screen"><div class="resource-item"><span>蔬菜</span><span>充足</span></div><div class="resource-item"><span>水果</span><span>少量</span></div><div class="resource-item"><span>医疗箱</span><span>3个</span></div><div class="resource-item"><span>水</span><span>50L</span></div></div>
        </div>
    </div>


    <div id="moments-popup" class="popup-overlay" onclick="closePopupOnOverlay(event)">
        <div class="popup-window">
            <h3>发布朋友圈</h3>
            <textarea placeholder="分享新鲜事..." rows="4"></textarea>
            <div class="popup-actions"><button class="btn-cancel" onclick="togglePopup('moments-popup')">取消</button><button class="btn-confirm">发布</button></div>
        </div>
    </div>
    <div id="add-song-popup" class="popup-overlay" onclick="closePopupOnOverlay(event)">
        <div class="popup-window">
            <h3>添加歌曲</h3>
            <input type="text" placeholder="粘贴歌曲链接">
            <div class="popup-actions"><button class="btn-cancel" onclick="togglePopup('add-song-popup')">取消</button><button class="btn-confirm">添加</button></div>
        </div>
    </div>
</div>

<script>
    let currentMessageTab = 'moments';

    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        if (screenId === 'message') switchMessageTab('moments', true);
        if (screenId === 'cart') switchCartTab('products', true);
        if (screenId === 'music' && !document.getElementById('music').querySelector('.snowflake')) createSnowflakes();
    }

    function switchMessageTab(tabName, force = false) {
        if (currentMessageTab === tabName && !force) return;
        currentMessageTab = tabName;
        document.querySelectorAll('.message-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`msg-tab-btn-${tabName}`).classList.add('active');
        document.querySelectorAll('.message-tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`message-tab-${tabName}`).classList.add('active');

        const headerTitle = document.getElementById('message-header-title');
        const headerAction = document.getElementById('message-header-action');
        const contactsMenu = document.getElementById('contacts-menu');
        contactsMenu.classList.remove('active');
        if (tabName === 'moments') {
            headerTitle.innerText = '朋友圈';
            headerAction.style.display = 'block';
        } else if (tabName === 'contacts') {
            headerTitle.innerText = '联系人';
            headerAction.style.display = 'block';
        } else {
            headerTitle.innerText = '我';
            headerAction.style.display = 'none';
        }
    }

    function handleMessageAction() {
        if (currentMessageTab === 'moments') {
            togglePopup('moments-popup');
        } else if (currentMessageTab === 'contacts') {
            document.getElementById('contacts-menu').classList.toggle('active');
        }
    }

    function switchCartTab(tabName, force = false) {
        document.querySelectorAll('.cart-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`cart-tab-btn-${tabName}`).classList.add('active');
        document.querySelectorAll('.cart-tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`cart-tab-${tabName}`).classList.add('active');
    }

    function togglePopup(popupId) {
        document.getElementById(popupId).classList.toggle('active');
    }

    function closePopupOnOverlay(event) {
        if (event.target.classList.contains('popup-overlay')) {
            event.target.classList.remove('active');
        }
    }

    function createSnowflakes() {
        const musicScreen = document.getElementById('music');
        const snowflakeCount = 20;
        for (let i = 0; i < snowflakeCount; i++) {
            let snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = '❄️';
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = (Math.random() * 5 + 8) + 's'; // 8-13s
            snowflake.style.animationDelay = Math.random() * 8 + 's';
            snowflake.style.opacity = Math.random() * 0.7 + 0.3;
            snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
            musicScreen.appendChild(snowflake);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        showScreen('main');
        document.body.addEventListener('click', (event) => {
            const contactsMenu = document.getElementById('contacts-menu');
            const headerAction = document.getElementById('message-header-action');
            if (contactsMenu.classList.contains('active') && !contactsMenu.contains(event.target) && !headerAction.contains(event.target)) {
                contactsMenu.classList.remove('active');
            }
        });
    });
</script>

</body>
</html>
```
