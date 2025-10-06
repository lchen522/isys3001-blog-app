class BlogApp {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        this.init();
    }
    init() {
        this.setupNavigation();
        this.showSection('home');
        this.displayPosts();
        this.setupForm();
    }
    showSection(sectionName) {
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(sectionName).classList.add('active');
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector(`[href="#${sectionName}"]`).classList.add('active');
    }
    displayPosts() {
        const container = document.getElementById('posts-container');
        if (this.posts.length === 0) {
            container.innerHTML = '<div class="post-card"><h3>欢迎！还没有文章，去发布第一篇吧！</h3></div>';
            return;
        }
        container.innerHTML = this.posts.map(post => `
            <div class="post-card">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <small>发布于: ${new Date(post.date).toLocaleString('zh-CN')}</small>
            </div>
        `).join('');
    }
    setupForm() {
        document.getElementById('post-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('post-title').value;
            const content = document.getElementById('post-content').value;
            this.posts.unshift({ title, content, date: new Date().toISOString() });
            localStorage.setItem('blogPosts', JSON.stringify(this.posts));
            document.getElementById('post-form').reset();
            alert('文章发布成功！');
            this.showSection('home');
        });
    }
    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(e.target.getAttribute('href').substring(1));
            });
        });
    }
}
new BlogApp();