(function() {
    // 物资数据 - 这里定义了显示哪些物资
    const defaultInventory = {
        water: { name: "饮用水", value: 50, unit: "升", max: 100 },
        food: { name: "压缩干粮", value: 18, unit: "份", max: 50 },
        medicine: { name: "医疗包", value: 75, unit: "%", max: 100 },
        ammo: { name: "手枪弹药", value: 47, unit: "发", max: 200 },
        fuel: { name: "车辆燃油", value: 25, unit: "%", max: 100 },
        battery: { name: "电池", value: 80, unit: "%", max: 100 }
    };

    class ApocalypseMobileInventory {
        constructor() {
            this.inventory = { ...defaultInventory };
            this.loadFromStorage();
        }

        loadFromStorage() {
            try {
                const saved = localStorage.getItem('apocalypseMobileInventory');
                if (saved) {
                    this.inventory = JSON.parse(saved);
                }
            } catch (e) {
                console.warn('无法加载库存数据，使用默认值。', e);
            }
        }

        saveToStorage() {
            try {
                localStorage.setItem('apocalypseMobileInventory', JSON.stringify(this.inventory));
            } catch (e) {
                console.warn('无法保存库存数据。', e);
            }
        }

        updateItem(key, change) {
            if (this.inventory[key]) {
                this.inventory[key].value += change;
                this.inventory[key].value = Math.max(0, Math.min(this.inventory[key].value, this.inventory[key].max));
                this.saveToStorage();
                this.render();
            }
        }

        resetInventory() {
            this.inventory = { ...defaultInventory };
            this.saveToStorage();
            this.render();
        }

        render() {
            // 移除已存在的容器
            const existingContainer = document.getElementById('apocalypseMobileInventoryContainer');
            if (existingContainer) {
                existingContainer.remove();
            }

            // 创建主容器 - 像你创建snowflake那样创建元素
            const container = document.createElement('div');
            container.id = 'apocalypseMobileInventoryContainer';
            container.className = 'apocalypse-inventory-container';

            // 创建标题
            const title = document.createElement('h3');
            title.textContent = '📱 物资状态';
            container.appendChild(title);

            // 为每个物资创建显示项 - 模仿你的UI结构
            for (const [key, item] of Object.entries(this.inventory)) {
                const percentage = (item.value / item.max) * 100;
                let statusClass = 'status-high';
                if (percentage < 50) statusClass = 'status-medium';
                if (percentage < 25) statusClass = 'status-low';
                if (percentage < 10) statusClass = 'status-critical';

                // 创建物资项容器
                const itemElement = document.createElement('div');
                itemElement.className = 'inventory-item';

                // 使用innerHTML来设置内容，就像你在音乐界面做的那样
                itemElement.innerHTML = `
                    <div class="item-header">
                        <span class="item-name">${item.name}</span>
                        <span class="item-value">${item.value} ${item.unit}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${statusClass}" style="width: ${percentage}%"></div>
                    </div>
                    <div class="item-controls">
                        <button class="btn-decrease" data-key="${key}">-</button>
                        <button class="btn-increase" data-key="${key}">+</button>
                    </div>
                `;

                container.appendChild(itemElement);
            }

            // 创建重置按钮
            const resetButton = document.createElement('button');
            resetButton.textContent = '重置所有物资';
            resetButton.className = 'reset-button';
            resetButton.onclick = () => this.resetInventory();
            container.appendChild(resetButton);

            // 将容器插入到页面中 - 寻找合适的位置
            this.insertIntoPage(container);

            // 绑定按钮事件
            this.bindEvents(container);
        }

        insertIntoPage(container) {
            // 尝试插入到角色卡区域之后
            const characterBlock = document.querySelector('.character-block');
            if (characterBlock) {
                characterBlock.after(container);
            } else {
                // 备用方案：插入到聊天容器附近
                const chatContainer = document.querySelector('#chat-container');
                if (chatContainer) {
                    chatContainer.before(container);
                } else {
                    // 最后方案：插入到body开头
                    document.body.insertBefore(container, document.body.firstChild);
                }
            }
        }

        bindEvents(container) {
            // 绑定减少按钮事件
            container.querySelectorAll('.btn-decrease').forEach(btn => {
                btn.onclick = (e) => {
                    const key = e.target.dataset.key;
                    this.updateItem(key, -1);
                };
            });

            // 绑定增加按钮事件
            container.querySelectorAll('.btn-increase').forEach(btn => {
                btn.onclick = (e) => {
                    const key = e.target.dataset.key;
                    this.updateItem(key, 1);
                };
            });
        }
    }

    // 初始化插件
    function initializePlugin() {
        setTimeout(() => {
            window.apocalypseMobileInventory = new ApocalypseMobileInventory();
            window.apocalypseMobileInventory.render();
            console.log('📱 末世手机物资状态栏插件已加载！');
        }, 1000);
    }

    // 监听页面加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePlugin);
    } else {
        initializePlugin();
    }
})();
