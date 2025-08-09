// Analytics Dashboard JavaScript
class AnalyticsDashboard {
    constructor() {
        this.data = {
            revenue: [
                {"month": "Jan", "value": 120000, "growth": 5.2},
                {"month": "Feb", "value": 135000, "growth": 12.5},
                {"month": "Mar", "value": 148000, "growth": 9.6},
                {"month": "Apr", "value": 162000, "growth": 9.5},
                {"month": "May", "value": 178000, "growth": 9.9},
                {"month": "Jun", "value": 195000, "growth": 9.6}
            ],
            users: [
                {"month": "Jan", "new": 1200, "returning": 3400, "total": 4600},
                {"month": "Feb", "new": 1350, "returning": 3800, "total": 5150},
                {"month": "Mar", "new": 1480, "returning": 4200, "total": 5680},
                {"month": "Apr", "new": 1620, "returning": 4600, "total": 6220},
                {"month": "May", "new": 1780, "returning": 5100, "total": 6880},
                {"month": "Jun", "new": 1950, "returning": 5650, "total": 7600}
            ],
            geography: [
                {"country": "United States", "users": 35000, "percentage": 45.8},
                {"country": "United Kingdom", "users": 12000, "percentage": 15.7},
                {"country": "Canada", "users": 8500, "percentage": 11.1},
                {"country": "Germany", "users": 6200, "percentage": 8.1},
                {"country": "France", "users": 4800, "percentage": 6.3},
                {"country": "Others", "users": 9700, "percentage": 12.7}
            ],
            performance: [
                {"metric": "Page Load Time", "value": "2.3s", "status": "good", "benchmark": "< 3s"},
                {"metric": "Bounce Rate", "value": "32%", "status": "excellent", "benchmark": "< 40%"},
                {"metric": "Conversion Rate", "value": "4.8%", "status": "good", "benchmark": "> 3%"},
                {"metric": "User Satisfaction", "value": "94%", "status": "excellent", "benchmark": "> 85%"}
            ],
            recentActivities: [
                {"action": "New user registration", "user": "john.doe@email.com", "time": "2 minutes ago"},
                {"action": "Purchase completed", "user": "jane.smith@email.com", "time": "5 minutes ago"},
                {"action": "Report generated", "user": "admin@company.com", "time": "12 minutes ago"},
                {"action": "Data export", "user": "analyst@company.com", "time": "18 minutes ago"}
            ]
        };

        this.charts = {};
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.sidebarCollapsed = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.renderKPICards();
        this.renderCharts();
        this.renderActivities();
        this.startRealTimeUpdates();
        
        // Add loading animations
        this.animateElements();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        sidebarToggle.addEventListener('click', () => this.toggleSidebar());

        // Navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Time range selector
        const timeButtons = document.querySelectorAll('.time-btn');
        timeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTimeRangeChange(e));
        });

        // Export buttons
        const exportButtons = document.querySelectorAll('.export-btn');
        exportButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleExport(e));
        });

        // Chart controls
        const chartButtons = document.querySelectorAll('.chart-btn');
        chartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleChartTypeChange(e));
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearch(e));

        // Modal
        const modalClose = document.getElementById('modalClose');
        const modal = document.getElementById('detailModal');
        modalClose.addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal__backdrop')) {
                this.closeModal();
            }
        });

        // KPI cards click
        const kpiCards = document.querySelectorAll('.kpi-card');
        kpiCards.forEach(card => {
            card.addEventListener('click', () => this.showKPIDetails(card));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    initializeTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        this.showToast('Theme changed successfully', 'success');
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        
        this.sidebarCollapsed = !this.sidebarCollapsed;
        
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('show');
        } else {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }
    }

    handleNavigation(e) {
        e.preventDefault();
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        
        e.currentTarget.closest('.nav-item').classList.add('active');
        
        const page = e.currentTarget.dataset.page;
        this.showToast(`Navigated to ${page}`, 'info');
    }

    handleTimeRangeChange(e) {
        const timeButtons = document.querySelectorAll('.time-btn');
        timeButtons.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        const range = e.currentTarget.dataset.range;
        this.showToast(`Time range changed to last ${range} days`, 'info');
        this.updateChartsData(range);
    }

    handleExport(e) {
        const format = e.currentTarget.dataset.format.toUpperCase();
        this.showToast(`Exporting data as ${format}...`, 'info');
        
        // Simulate export process
        setTimeout(() => {
            this.showToast(`Data exported as ${format} successfully`, 'success');
        }, 2000);
    }

    handleChartTypeChange(e) {
        const chartButtons = e.currentTarget.parentElement.querySelectorAll('.chart-btn');
        chartButtons.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        const chartName = e.currentTarget.dataset.chart;
        const chartType = e.currentTarget.dataset.type;
        
        this.updateChartType(chartName, chartType);
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        if (query.length === 0) return;
        
        // Simulate search functionality
        this.showToast(`Searching for: ${query}`, 'info');
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        if (e.key === 'Escape') {
            this.closeModal();
        }
    }

    handleResize() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    renderKPICards() {
        // Animate KPI numbers
        const kpiNumbers = document.querySelectorAll('.kpi-number');
        kpiNumbers.forEach(number => {
            this.animateCounter(number);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(target * this.easeOutQuart(progress));
            
            if (target > 1000) {
                element.textContent = '$' + current.toLocaleString();
            } else {
                element.textContent = current.toString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    renderCharts() {
        this.renderRevenueChart();
        this.renderUsersChart();
        this.renderGeographyChart();
    }

    renderRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.revenue.map(item => item.month),
                datasets: [{
                    label: 'Revenue',
                    data: this.data.revenue.map(item => item.value),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1FB8CD',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#1FB8CD',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `Revenue: $${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000) + 'K';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    renderUsersChart() {
        const ctx = document.getElementById('usersChart').getContext('2d');
        
        this.charts.users = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.users.map(item => item.month),
                datasets: [
                    {
                        label: 'New Users',
                        data: this.data.users.map(item => item.new),
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.2)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Returning Users',
                        data: this.data.users.map(item => item.returning),
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.2)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        stacked: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    renderGeographyChart() {
        const ctx = document.getElementById('geoChart').getContext('2d');
        
        this.charts.geography = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.data.geography.map(item => item.country),
                datasets: [{
                    data: this.data.geography.map(item => item.percentage),
                    backgroundColor: [
                        '#1FB8CD',
                        '#FFC185',
                        '#B4413C',
                        '#5D878F',
                        '#DB4545',
                        '#D2BA4C'
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: '60%',
                animation: {
                    animateRotate: true,
                    duration: 2000
                }
            }
        });
    }

    updateChartType(chartName, type) {
        if (this.charts[chartName]) {
            this.charts[chartName].destroy();
        }
        
        if (chartName === 'revenue') {
            const ctx = document.getElementById('revenueChart').getContext('2d');
            this.charts.revenue = new Chart(ctx, {
                type: type,
                data: {
                    labels: this.data.revenue.map(item => item.month),
                    datasets: [{
                        label: 'Revenue',
                        data: this.data.revenue.map(item => item.value),
                        backgroundColor: type === 'bar' ? '#1FB8CD' : 'rgba(31, 184, 205, 0.1)',
                        borderColor: '#1FB8CD',
                        borderWidth: type === 'bar' ? 0 : 3,
                        fill: type !== 'bar'
                    }]
                },
                options: this.getChartOptions(type)
            });
        } else if (chartName === 'users') {
            const ctx = document.getElementById('usersChart').getContext('2d');
            this.charts.users = new Chart(ctx, {
                type: type === 'area' ? 'line' : type,
                data: {
                    labels: this.data.users.map(item => item.month),
                    datasets: [
                        {
                            label: 'New Users',
                            data: this.data.users.map(item => item.new),
                            backgroundColor: type === 'bar' ? '#FFC185' : 'rgba(255, 193, 133, 0.2)',
                            borderColor: '#FFC185',
                            fill: type === 'area'
                        },
                        {
                            label: 'Returning Users',
                            data: this.data.users.map(item => item.returning),
                            backgroundColor: type === 'bar' ? '#B4413C' : 'rgba(180, 65, 60, 0.2)',
                            borderColor: '#B4413C',
                            fill: type === 'area'
                        }
                    ]
                },
                options: this.getChartOptions(type)
            });
        }
    }

    getChartOptions(type) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1000
            }
        };
    }

    updateChartsData(range) {
        // Simulate data update based on time range
        const multiplier = range === '7' ? 0.3 : range === '30' ? 0.7 : 1;
        
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.data) {
                chart.data.datasets.forEach(dataset => {
                    dataset.data = dataset.data.map(value => Math.floor(value * multiplier));
                });
                chart.update('active');
            }
        });
    }

    renderActivities() {
        const activitiesList = document.getElementById('activitiesList');
        const activities = this.data.recentActivities;
        
        activitiesList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${this.getActivityIcon(activity.action)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-action">${activity.action}</div>
                    <div class="activity-user">${activity.user}</div>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }

    getActivityIcon(action) {
        const iconMap = {
            'New user registration': 'fa-user-plus',
            'Purchase completed': 'fa-shopping-cart',
            'Report generated': 'fa-file-alt',
            'Data export': 'fa-download'
        };
        return iconMap[action] || 'fa-bell';
    }

    showKPIDetails(card) {
        const metric = card.dataset.metric;
        const modal = document.getElementById('detailModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = `${metric.charAt(0).toUpperCase() + metric.slice(1)} Details`;
        modalBody.innerHTML = this.generateKPIDetails(metric);
        
        modal.classList.remove('hidden');
    }

    generateKPIDetails(metric) {
        const details = {
            revenue: `
                <div class="detail-content">
                    <h3>Revenue Analysis</h3>
                    <p>Monthly revenue growth shows consistent upward trend with 9.6% increase in June.</p>
                    <ul>
                        <li>Q2 Performance: +9.7% average growth</li>
                        <li>Best performing month: February (+12.5%)</li>
                        <li>Projected Q3 revenue: $620,000</li>
                    </ul>
                </div>
            `,
            users: `
                <div class="detail-content">
                    <h3>User Growth Analysis</h3>
                    <p>User base has grown by 65% over the past 6 months with strong retention rates.</p>
                    <ul>
                        <li>New user acquisition rate: +1,950 in June</li>
                        <li>User retention rate: 74%</li>
                        <li>Monthly active users: 7,600</li>
                    </ul>
                </div>
            `,
            conversion: `
                <div class="detail-content">
                    <h3>Conversion Rate Analysis</h3>
                    <p>Conversion rate improved by 0.3% this month, exceeding industry benchmarks.</p>
                    <ul>
                        <li>Industry average: 3.2%</li>
                        <li>Our performance: 4.8%</li>
                        <li>Improvement strategies working effectively</li>
                    </ul>
                </div>
            `,
            satisfaction: `
                <div class="detail-content">
                    <h3>User Satisfaction Analysis</h3>
                    <p>User satisfaction remains high with 94% positive feedback across all touchpoints.</p>
                    <ul>
                        <li>Customer support rating: 4.7/5</li>
                        <li>Product satisfaction: 4.8/5</li>
                        <li>NPS Score: 72 (Excellent)</li>
                    </ul>
                </div>
            `
        };
        
        return details[metric] || '<p>No detailed information available.</p>';
    }

    closeModal() {
        const modal = document.getElementById('detailModal');
        modal.classList.add('hidden');
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <i class="toast__icon fas ${this.getToastIcon(type)}"></i>
            <div class="toast__message">${message}</div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        return icons[type] || icons.info;
    }

    startRealTimeUpdates() {
        // Simulate real-time data updates
        setInterval(() => {
            this.updateRealTimeData();
        }, 30000); // Update every 30 seconds
    }

    updateRealTimeData() {
        // Simulate small random changes in data
        const variation = () => (Math.random() - 0.5) * 0.1; // ±5% variation
        
        // Update revenue data
        this.data.revenue.forEach(item => {
            item.value = Math.floor(item.value * (1 + variation()));
        });
        
        // Update users data
        this.data.users.forEach(item => {
            item.new = Math.floor(item.new * (1 + variation()));
            item.returning = Math.floor(item.returning * (1 + variation()));
            item.total = item.new + item.returning;
        });
        
        // Update KPI counters
        this.renderKPICards();
        
        // Update charts if they exist
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.update) {
                chart.update('none');
            }
        });
    }

    animateElements() {
        // Add fade-in animation to cards
        const cards = document.querySelectorAll('.kpi-card, .chart-card, .performance-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new AnalyticsDashboard();
    
    // Add some additional interactive features
    
    // Drag and drop for dashboard customization (simplified)
    const kpiGrid = document.querySelector('.kpi-grid');
    if (kpiGrid) {
        let draggedElement = null;
        
        kpiGrid.addEventListener('dragstart', (e) => {
            draggedElement = e.target.closest('.kpi-card');
            if (draggedElement) {
                draggedElement.style.opacity = '0.5';
            }
        });
        
        kpiGrid.addEventListener('dragend', (e) => {
            if (draggedElement) {
                draggedElement.style.opacity = '1';
                draggedElement = null;
            }
        });
        
        kpiGrid.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        kpiGrid.addEventListener('drop', (e) => {
            e.preventDefault();
            const dropTarget = e.target.closest('.kpi-card');
            if (dropTarget && draggedElement && dropTarget !== draggedElement) {
                const parent = dropTarget.parentNode;
                const nextSibling = dropTarget.nextSibling;
                parent.insertBefore(draggedElement, nextSibling);
                dashboard.showToast('Dashboard layout updated', 'success');
            }
        });
        
        // Make KPI cards draggable
        const kpiCards = document.querySelectorAll('.kpi-card');
        kpiCards.forEach(card => {
            card.draggable = true;
        });
    }
    
    // Add tooltips for better UX
    const elementsWithTooltips = document.querySelectorAll('[title]');
    elementsWithTooltips.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.title;
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '8px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.zIndex = '9999';
            tooltip.style.pointerEvents = 'none';
            
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
            
            e.target.title = '';
            e.target._originalTitle = tooltip.textContent;
        });
        
        element.addEventListener('mouseleave', (e) => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
            if (e.target._originalTitle) {
                e.target.title = e.target._originalTitle;
            }
        });
    });
});