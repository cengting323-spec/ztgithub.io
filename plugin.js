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
            this.isPhoneVisible = false; // 跟踪手机界面状态
        }

        // === 新增的方法：创建悬浮按钮 ===
        createFloatingButton() {
            // 移除已存在的悬浮按钮
            const existingButton = document.getElementById('floatingAppleButton');
            if (existingButton) existingButton.remove();

            const floatingButton = document.createElement('div');
            floatingButton.id = 'floatingAppleButton';
            floatingButton.className = 'floating-apple-button';
            floatingButton.innerHTML = '🍎';
            floatingButton.onclick = () => this.togglePhoneInterface();
            
            document.body.appendChild(floatingButton);
        }

        // === 新增的方法：创建手机主界面 ===
        createPhoneInterface() {
            // 移除已存在的界面
            const existingOverlay = document.getElementById('phoneOverlay');
            const existingContainer = document.getElementById('phoneMainContainer');
            if (existingOverlay) existingOverlay.remove();
            if (existingContainer) existingContainer.remove();

            // 创建遮罩
            const overlay = document.createElement('div');
            overlay.id = 'phoneOverlay';
            overlay.className = 'phone-overlay';
            overlay.onclick = () => this.togglePhoneInterface();
            
            // 创建手机主容器
            const phoneContainer = document.createElement('div');
            phoneContainer.id = 'phoneMainContainer';
            phoneContainer.className = 'phone-main-container';

            // 手机界面内容
            phoneContainer.innerHTML = `
                <button class="phone-close-button" onclick="window.apocalypseMobileInventory.togglePhoneInterface()">×</button>
                <div class="phone-header">
                    <h3>📱 末日生存系统</h3>
                </div>
                <div class="phone-content" id="phoneInventoryContent">
                    <!-- 物资状态栏将显示在这里 -->
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(phoneContainer);
        }

        // === 新增的方法：切换手机界面显示/隐藏 ===
        togglePhoneInterface() {
            const overlay = document.getElementById('phoneOverlay');
            const phoneContainer = document.getElementById('phoneMainContainer');
            const contentArea = document.getElementById('phoneInventoryContent');
            
            this.isPhoneVisible = !this.isPhoneVisible;
            
            if (this.isPhoneVisible) {
                // 显示手机界面时，重新渲染物资状态栏到手机内容区
                this.renderInventoryToPhone(contentArea);
                overlay.classList.add('active');
                phoneContainer.classList.add('active');
            } else {
                // 隐藏手机界面
                overlay.classList.remove('active');
                phoneContainer.classList.remove('active');
            }
        }

        // === 新增的方法：在手机界面内渲染物资状态 ===
        renderInventoryToPhone(container) {
            // 清空容器
            container.innerHTML = '';
            
            // 创建物资状态栏（复用之前的渲染逻辑，但稍作调整）
            for (const [key, item] of Object.entries(this.inventory)) {
                const percentage = (item.value / item.max) * 100;
                let statusClass = 'status-high';
                if (percentage < 50) statusClass = 'status-medium';
                if (percentage < 25) statusClass = 'status-low';
                if (percentage < 10) statusClass = 'status-critical';

                const itemElement = document.createElement('div');
                itemElement.className = 'inventory-item';
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

            // 添加重置按钮
            const resetButton = document.createElement('button');
            resetButton.textContent = '重置所有物资';
            resetButton.className = 'reset-button';
            resetButton.onclick = () => {
                this.resetInventory();
                this.renderInventoryToPhone(container); // 刷新手机界面内的显示
            };
            container.appendChild(resetButton);

            // 绑定手机界面内按钮的事件
            this.bindPhoneEvents(container);
        }

        // === 新增的方法：绑定手机界面内按钮事件 ===
        bindPhoneEvents(container) {
            container.querySelectorAll('.btn-decrease').forEach(btn => {
                btn.onclick = (e) => {
                    const key = e.target.dataset.key;
                    this.updateItem(key, -1);
                    this.renderInventoryToPhone(document.getElementById('phoneInventoryContent'));
                };
            });

            container.querySelectorAll('.btn-increase').forEach(btn => {
                btn.onclick = (e) => {
                    const key = e.target.dataset.key;
                    this.updateItem(key, 1);
                    this.renderInventoryToPhone(document.getElementById('phoneInventoryContent'));
                };
            });
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
                // 如果手机界面是打开的，更新显示
                if (this.isPhoneVisible) {
                    this.renderInventoryToPhone(document.getElementById('phoneInventoryContent'));
                }
            }
        }

        resetInventory() {
            this.inventory = { ...defaultInventory };
            this.saveToStorage();
            // 如果手机界面是打开的，更新显示
            if (this.isPhoneVisible) {
                this.renderInventoryToPhone(document.getElementById('phoneInventoryContent'));
            }
        }

        render() {
            // 先创建悬浮按钮和手机主界面
            this.createFloatingButton();
            this.createPhoneInterface();
            
            // 移除原有的侧边栏状态栏（我们不再需要它常驻显示）
            const existingContainer = document.getElementById('apocalypseMobileInventoryContainer');
            if (existingContainer) {
                existingContainer.remove();
            }
            
            // 注意：我们不再创建常驻的状态栏，而是只在手机界面内显示
            console.log('📱 末世手机物资状态栏插件已加载！悬浮按钮已创建。');
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
