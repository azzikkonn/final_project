// ===================================
// API Configuration
// ===================================
const API_URL = 'http://localhost:3000/api';

// ===================================
// State Management
// ===================================
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user'));
let photos = [];
let currentFilter = 'all';

// ===================================
// DOM Elements
// ===================================
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const navToggle = document.getElementById('navToggle');
const navAuth = document.getElementById('navAuth');
const navUser = document.getElementById('navUser');
const userName = document.getElementById('userName');
const galleryGrid = document.getElementById('galleryGrid');
const galleryLoading = document.getElementById('galleryLoading');
const galleryEmpty = document.getElementById('galleryEmpty');
const galleryActions = document.getElementById('galleryActions');
const filterBtns = document.querySelectorAll('.filter-btn');
const categoryCards = document.querySelectorAll('.category-card');

// ===================================
// Initialize App
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    checkAuth();
    loadPhotos();
    initFilters();
    initCategoryCards();
});

// ===================================
// Navigation
// ===================================
function initNavigation() {
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navMenu.classList.remove('active');
            }
            
            // Update active state
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ===================================
// Authentication
// ===================================
function checkAuth() {
    if (token && currentUser) {
        showLoggedInState();
    } else {
        showLoggedOutState();
    }
}

function showLoggedInState() {
    navAuth.style.display = 'none';
    navUser.style.display = 'flex';
    userName.textContent = currentUser.username;
    galleryActions.style.display = 'flex';
}

function showLoggedOutState() {
    navAuth.style.display = 'flex';
    navUser.style.display = 'none';
    galleryActions.style.display = 'none';
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const messageEl = document.getElementById('registerMessage');

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (data.success) {
            token = data.token;
            currentUser = data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            showMessage(messageEl, 'success', 'Account created successfully!');
            setTimeout(() => {
                closeModal('register');
                checkAuth();
                loadPhotos();
                showToast('success', 'Welcome to PhotoFolio!');
            }, 1000);
        } else {
            showMessage(messageEl, 'error', data.message || 'Registration failed');
        }
    } catch (error) {
        showMessage(messageEl, 'error', 'Connection error. Please try again.');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            token = data.token;
            currentUser = data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            showMessage(messageEl, 'success', 'Login successful!');
            setTimeout(() => {
                closeModal('login');
                checkAuth();
                loadPhotos();
                showToast('success', `Welcome back, ${currentUser.username}!`);
            }, 1000);
        } else {
            showMessage(messageEl, 'error', data.message || 'Login failed');
        }
    } catch (error) {
        showMessage(messageEl, 'error', 'Connection error. Please try again.');
    }
}

function logout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    checkAuth();
    loadPhotos();
    showToast('success', 'Logged out successfully');
}

// ===================================
// Photos Management
// ===================================
async function loadPhotos() {
    galleryLoading.style.display = 'block';
    galleryEmpty.style.display = 'none';
    
    // Clear existing photos
    const existingCards = galleryGrid.querySelectorAll('.gallery-card');
    existingCards.forEach(card => card.remove());

    if (!token) {
        // Load sample photos for non-logged users
        loadSamplePhotos();
        return;
    }

    try {
        const categoryParam = currentFilter !== 'all' ? `?category=${currentFilter}` : '';
        const response = await fetch(`${API_URL}/photos${categoryParam}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        galleryLoading.style.display = 'none';

        if (data.success && data.data.length > 0) {
            photos = data.data;
            renderPhotos(photos);
        } else {
            galleryEmpty.style.display = 'block';
        }
    } catch (error) {
        galleryLoading.style.display = 'none';
        galleryEmpty.style.display = 'block';
        console.error('Error loading photos:', error);
    }
}

function loadSamplePhotos() {
    // Sample photos for non-logged users
    const samplePhotos = [
        { _id: '1', title: 'Mountain Sunrise', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', category: 'landscape' },
        { _id: '2', title: 'City Lights', imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600', category: 'street' },
        { _id: '3', title: 'Portrait Study', imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600', category: 'portrait' },
        { _id: '4', title: 'Forest Path', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600', category: 'nature' },
        { _id: '5', title: 'Modern Architecture', imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600', category: 'architecture' },
        { _id: '6', title: 'Ocean Waves', imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600', category: 'landscape' },
        { _id: '7', title: 'Street Life', imageUrl: 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=600', category: 'street' },
        { _id: '8', title: 'Wild Fox', imageUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=600', category: 'wildlife' }
    ];

    galleryLoading.style.display = 'none';
    
    let filteredPhotos = samplePhotos;
    if (currentFilter !== 'all') {
        filteredPhotos = samplePhotos.filter(p => p.category === currentFilter);
    }

    if (filteredPhotos.length > 0) {
        renderPhotos(filteredPhotos, true);
    } else {
        galleryEmpty.style.display = 'block';
    }
}

function renderPhotos(photosData, isSample = false) {
    photosData.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.innerHTML = `
            <img src="${photo.imageUrl}" alt="${photo.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
            <div class="gallery-card-overlay">
                <h3 class="gallery-card-title">${photo.title}</h3>
                <span class="gallery-card-category">${photo.category}</span>
            </div>
            ${!isSample && token ? `
            <div class="gallery-card-actions">
                <button class="card-action-btn" onclick="event.stopPropagation(); editPhoto('${photo._id}')" title="Edit">✏️</button>
                <button class="card-action-btn" onclick="event.stopPropagation(); deletePhoto('${photo._id}')" title="Delete">🗑️</button>
            </div>
            ` : ''}
        `;
        card.addEventListener('click', () => showPhotoDetail(photo, isSample));
        galleryGrid.appendChild(card);
    });
}

async function handleUpload(e) {
    e.preventDefault();
    const messageEl = document.getElementById('uploadMessage');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('photoFile');
    
    // Check if file is selected
    if (!fileInput.files || fileInput.files.length === 0) {
        showMessage(messageEl, 'error', 'Please select a photo to upload');
        return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', document.getElementById('photoTitle').value);
    formData.append('category', document.getElementById('photoCategory').value);
    formData.append('description', document.getElementById('photoDescription').value);
    formData.append('tags', document.getElementById('photoTags').value);

    // Disable button and show loading
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';

    try {
        const response = await fetch(`${API_URL}/photos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showMessage(messageEl, 'success', 'Photo uploaded successfully!');
            document.getElementById('uploadForm').reset();
            removePreview();
            setTimeout(() => {
                closeModal('upload');
                loadPhotos();
                showToast('success', 'Photo added to your portfolio!');
            }, 1000);
        } else {
            showMessage(messageEl, 'error', data.message || data.errors?.join(', ') || 'Upload failed');
        }
    } catch (error) {
        showMessage(messageEl, 'error', 'Connection error. Please try again.');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload Photo';
    }
}

// File selection handler
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        showPreview(file);
    }
}

// Show image preview
function showPreview(file) {
    const uploadZoneContent = document.getElementById('uploadZoneContent');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');

    // Check file type
    if (!file.type.startsWith('image/')) {
        showToast('error', 'Please select an image file');
        return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        showToast('error', 'File size must be less than 10MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadZoneContent.style.display = 'none';
        uploadPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Remove preview
function removePreview() {
    const uploadZoneContent = document.getElementById('uploadZoneContent');
    const uploadPreview = document.getElementById('uploadPreview');
    const fileInput = document.getElementById('photoFile');
    
    uploadZoneContent.style.display = 'flex';
    uploadPreview.style.display = 'none';
    fileInput.value = '';
}

// Initialize drag and drop
document.addEventListener('DOMContentLoaded', () => {
    const uploadZone = document.getElementById('uploadZone');
    if (uploadZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => {
                uploadZone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => {
                uploadZone.classList.remove('dragover');
            });
        });

        uploadZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                document.getElementById('photoFile').files = files;
                showPreview(files[0]);
            }
        });
    }
});

async function deletePhoto(id) {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
        const response = await fetch(`${API_URL}/photos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.success) {
            loadPhotos();
            showToast('success', 'Photo deleted successfully');
        } else {
            showToast('error', data.message || 'Failed to delete photo');
        }
    } catch (error) {
        showToast('error', 'Connection error. Please try again.');
    }
}

function showPhotoDetail(photo, isSample = false) {
    const detailEl = document.getElementById('photoDetail');
    detailEl.innerHTML = `
        <div class="photo-detail-image">
            <img src="${photo.imageUrl}" alt="${photo.title}">
        </div>
        <div class="photo-detail-info">
            <h2>${photo.title}</h2>
            <div class="photo-detail-meta">
                <span>📁 ${photo.category}</span>
                ${photo.createdAt ? `<span>📅 ${new Date(photo.createdAt).toLocaleDateString()}</span>` : ''}
                ${photo.likes !== undefined ? `<span>❤️ ${photo.likes} likes</span>` : ''}
            </div>
            ${photo.description ? `<p class="photo-detail-description">${photo.description}</p>` : ''}
            ${photo.tags && photo.tags.length > 0 ? `
                <div class="photo-detail-tags">
                    ${photo.tags.map(tag => `<span class="photo-tag">#${tag}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `;
    showModal('photo');
}

// ===================================
// Filters
// ===================================
function initFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            loadPhotos();
        });
    });
}

function initCategoryCards() {
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            // Scroll to gallery
            document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
            
            // Set filter
            setTimeout(() => {
                filterBtns.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.category === category) {
                        btn.classList.add('active');
                    }
                });
                currentFilter = category;
                loadPhotos();
            }, 500);
        });
    });
}

// ===================================
// Modal Management
// ===================================
function showModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear form messages
        const messageEl = modal.querySelector('.form-message');
        if (messageEl) {
            messageEl.className = 'form-message';
            messageEl.textContent = '';
        }
    }
}

function switchModal(from, to) {
    closeModal(from);
    setTimeout(() => showModal(to), 200);
}

// ===================================
// UI Helpers
// ===================================
function showMessage(el, type, text) {
    el.className = `form-message ${type}`;
    el.textContent = text;
    el.style.display = 'block';
}

function showToast(type, message) {
    const toast = document.getElementById('toast');
    const icon = toast.querySelector('.toast-icon');
    const msg = toast.querySelector('.toast-message');
    
    toast.className = `toast ${type}`;
    icon.textContent = type === 'success' ? '✓' : '✕';
    msg.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            const type = modal.id.replace('Modal', '');
            closeModal(type);
        });
    }
});
