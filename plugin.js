(function() {
    // 所有可能的物资配置库
    const itemLibrary = {
        water: { name: "饮用水", unit: "升", max: 100, weight: 10 },
        food: { name: "压缩干粮", unit: "份", max: 50, weight: 8 },
        medicine: { name: "医疗包", unit: "%", max: 100, weight: 5 },
        ammo: { name: "手枪弹药", unit: "发", max: 200, weight: 6 },
        fuel: { name: "车辆燃油", unit: "%", max: 100, weight: 3 },
        battery: { name: "电池", unit: "%", max: 100, weight: 4 },
        car: { name: "车辆", unit: "辆", max: 1, weight: 1 },
        rifle: { name: "突击步枪", unit: "把", max: 1, weight: 2 },
        radaway: { name: "抗辐射剂", unit: "剂", max: 10, weight: 3 },
        generator: { name: "发电机", unit: "台", max: 1, weight: 1 }
    };

    class DynamicInventorySystem {
        constructor() {
            this.inventory = {}; // 开始时为空
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            this.loadFromStorage();
            
            // 自动随机事件
            this.setupRandomEvents();
        }

        // ==================== 拖拽功能 ====================
        makeDraggable(element) {
            const header = element.querySelector('.floating-header');
            
            header.addEventListener('mousedown', (e) => {
                this.startDrag(e, element);
            });
            
            document.addEventListener('mousemove', (e) => {
                this.onDrag(e, element);
            });
            
            document.addEventListener('mouseup', () => {
                this.stopDrag(element);
            });
        }

        startDrag(e, element) {
            this.isDragging = true;
            element.classList.add('dragging');
            
            const rect = element.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
        }

        onDrag(e, element) {
            if (!this.isDragging) return;
            
            element.style.left = (e.clientX - this.dragOffset.x) + 'px';
            element.style.top = (e.clientY - this.dragOffset.y) + 'px';
        }

        stopDrag(element) {
            this.isDragging = false;
            element.classList.remove('dragging');
            this.saveWindowPosition(element);
        }

        saveWindowPosition(element) {
            const position = {
                left: element.style.left,
                top: element.style.top
            };
            localStorage.setItem('inventoryWindowPosition', JSON.stringify(position));
        }

        loadWindowPosition(element) {
            try {
                const saved = localStorage.getItem('inventoryWindowPosition');
                if (saved) {
                    const position = JSON.parse(saved);
                    element.style.left = position.left;
                    element.style.top = position.top;
                }
            } catch (e) {
                console.warn('无法加载窗口位置', e);
            }
        }

        // ==================== 动态物资系统 ====================
        addRandomItem() {
            // 根据权重随机选择一个物品
            const availableItems = Object.keys(itemLibrary).filter(key => !this.inventory[key]);
            if (availableItems.length === 0) return;
            
            const weights = availableItems.map(key => itemLibrary[key].weight);
            const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
            let random = Math.random() * totalWeight;
            
            let selectedKey = availableItems[0];
            for (let i = 0; i < availableItems.length; i++) {
                random -= itemLibrary[availableItems[i]].weight;
                if (random <= 0) {
                    selectedKey = availableItems[i];
                    break;
                }
            }
            
            const itemConfig = itemLibrary[selectedKey];
            this.inventory[selectedKey] = {
                ...itemConfig,
                value: Math.floor(Math.random() * itemConfig.max * 0.3) + 1 // 随机初始数量
            };
        }

        removeEmptyItems() {
            Object.keys(this.inventory).forEach(key => {
                if (this.inventory[key].value <= 0) {
                    delete this.inventory[key];
                }
            });
        }

        simulateRandomChange() {
            // 随机增减现有物资
            Object.keys(this.inventory).forEach(key => {
                const change = Math.random() > 0.5 ? 1 : -1;
                const amount = Math.floor(Math.random() * 5) + 1;
                this.inventory[key].value += change * amount;
                
                // 确保值在合理范围内
                this.inventory[key].value = Math.max(0, Math.min(
                    this.inventory[key].value, 
                    this.inventory[key].max
                ));
            });
            
            // 随机添加新物资 (10% 几率)
            if (Math.random() < 0.1 && Object.keys(this.inventory).length < Object.keys(itemLibrary).length) {
                this.addRandomItem();
            }
            
            // 移除耗尽的物资
            this.removeEmptyItems();
            
            this.saveToStorage();
            this.renderInventory();
        }

        // ==================== 手动控制方法 ====================
        updateItem(key, change) {
            if (this.inventory[key]) {
                this.inventory[key].value += change;
                this.inventory[key].value = Math.max(0, Math.min(
                    this.inventory[key].value, 
                    this.inventory[key].max
                ));
                
                if (this.inventory[key].value <= 0) {
                    delete this.inventory[key];
                }
                
                this.saveToStorage();
                this.renderInventory();
            }
        }

        addSpecificItem(itemKey) {
            if (!this.inventory[itemKey] && itemLibrary[itemKey]) {
                this.inventory[itemKey] = {
                    ...itemLibrary[itemKey],
                    value: 1
                };
                this.saveToStorage();
                this.renderInventory();
            }
        }

        // ==================== 渲染系统 ====================
        createFloatingWindow() {
            const existingWindow = document.getElementById('floatingInventoryWindow');
            if (existingWindow) existingWindow.remove();

            const windowElement = document.createElement('div');
            windowElement.id = 'floatingInventoryWindow';
            windowElement.className = 'floating-apple-window';
            windowElement.innerHTML = `
                <div class="floating-header">
                    <span class="floating-title">🍎 物资管理系统</span>
                    <div class="floating-controls">
                        <button onclick="window.dynamicInventorySystem.simulateRandomChange()">🎲</button>
                        <button onclick="window.dynamicInventorySystem.minimizeWindow()">−</button>
                        <button onclick="window.dynamicInventorySystem.closeWindow()">×</button>
                    </div>
                </div>
                <div class="floating-content" id="inventoryContent"></div>
            `;

            document.body.appendChild(windowElement);
            this.makeDraggable(windowElement);
            this.loadWindowPosition(windowElement);
            this.renderInventory();
        }

        renderInventory() {
            const content = document.getElementById('inventoryContent');
            if (!content) return;

            if (Object.keys(this.inventory).length === 0) {
                content.innerHTML = '<div class="empty-inventory">暂无物资<br><small>点击🎲按钮随机生成</small></div>';
                return;
            }

            let html = '';
            Object.entries(this.inventory).forEach(([key, item]) => {
                const percentage = (item.value / item.max) * 100;
                const statusClass = this.getStatusClass(percentage);

                html += `
                    <div class="inventory-item">
                        <div class="item-header">
                            <span class="item-name">${item.name}</span>
                            <span class="item-value">${item.value} ${item.unit}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${statusClass}" style="width: ${percentage}%"></div>
                        </div>
                        <div class="item-controls">
                            <button onclick="window.dynamicInventorySystem.updateItem('${key}', -1)">-1</button>
                            <button onclick="window.dynamicInventorySystem.updateItem('${key}', -5)">-5</button>
                            <button onclick="window.dynamicInventorySystem.updateItem('${key}', 1)">+1</button>
                            <button onclick="window.dynamicInventorySystem.updateItem('${key}', 5)">+5</button>
                        </div>
                    </div>
                `;
            });

            html += `
                <div class="action-buttons">
                    <button class="simulate-button" onclick="window.dynamicInventorySystem.simulateRandomChange()">
                        🎲 随机事件
                    </button>
                    <button class="reset-button" onclick="window.dynamicInventorySystem.addRandomItem()">
                        ➕ 获得物资
                    </button>
                </div>
            `;

            content.innerHTML = html;
        }

        getStatusClass(percentage) {
            if (percentage >= 70) return 'status-high';
            if (percentage >= 30) return 'status-medium';
            if (percentage >= 10) return 'status-low';
            return 'status-critical';
        }

        // ==================== 窗口控制 ====================
        minimizeWindow() {
            const content = document.getElementById('inventoryContent');
            if (content) {
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
            }
        }

        closeWindow() {
            const windowElement = document.getElementById('floatingInventoryWindow');
            if (windowElement) {
                windowElement.remove();
            }
        }

        showWindow() {
            this.createFloatingWindow();
        }

        // ==================== 存储系统 ====================
        loadFromStorage() {
            try {
                const saved = localStorage.getItem('dynamicInventory');
                if (saved) {
                    this.inventory = JSON.parse(saved);
                } else {
                    // 初始随机物资
                    for (let i = 0; i < 3; i++) {
                        this.addRandomItem();
                    }
                }
            } catch (e) {
                console.warn('无法加载库存数据', e);
            }
        }

        saveToStorage() {
            try {
                localStorage.setItem('dynamicInventory', JSON.stringify(this.inventory));
            } catch (e) {
                console.warn('无法保存库存数据', e);
            }
        }

        // ==================== 随机事件系统 ====================
        setupRandomEvents() {
            // 每2分钟触发一次随机事件
            setInterval(() => {
                if (Math.random() < 0.3) { // 30% 几率触发
                    this.simulateRandomChange();
                }
            }, 120000);
        }

        // ==================== 主渲染方法 ====================
        render() {
            this.createFloatingWindow();
            console.log('🎯 动态物资管理系统已加载！');
        }
    }

    // ==================== 插件初始化 ====================
    function initializePlugin() {
        setTimeout(() => {
            window.dynamicInventorySystem = new DynamicInventorySystem();
            window.dynamicInventorySystem.render();
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePlugin);
    } else {
        initializePlugin();
    }
})();
