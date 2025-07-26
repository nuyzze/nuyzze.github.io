// Firebase Configuration
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_DOMINIO.firebaseapp.com",
    projectId: "SEU_ID",
    storageBucket: "SEU_BUCKET.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID",
    databaseURL: "https://SEU_ID.firebaseio.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Global Variables
let currentUser = null;
let currentProject = null;
let elements = [];
let selectedElement = null;
let undoStack = [];
let redoStack = [];

// Element Templates
const elementTemplates = {
    header: {
        type: 'header',
        content: 'Título Principal',
        styles: {
            fontSize: '32px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#1e293b',
            backgroundColor: '#f8fafc',
            padding: '20px',
            margin: '0 0 20px 0'
        }
    },
    text: {
        type: 'text',
        content: 'Este é um parágrafo de texto. Clique para editar o conteúdo.',
        styles: {
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#374151',
            margin: '0 0 16px 0'
        }
    },
    button: {
        type: 'button',
        content: 'Clique Aqui',
        styles: {
            backgroundColor: '#667eea',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'inline-block',
            textDecoration: 'none'
        }
    },
    image: {
        type: 'image',
        content: 'https://via.placeholder.com/400x300',
        styles: {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            display: 'block',
            margin: '0 auto'
        }
    },
    container: {
        type: 'container',
        content: '',
        styles: {
            padding: '20px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            minHeight: '100px'
        }
    },
    form: {
        type: 'form',
        content: `
            <div class="form-field">
                <label>Nome:</label>
                <input type="text" placeholder="Digite seu nome">
            </div>
            <div class="form-field">
                <label>Email:</label>
                <input type="email" placeholder="Digite seu email">
            </div>
            <button type="submit">Enviar</button>
        `,
        styles: {
            padding: '20px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
        }
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 2000);

    // Setup event listeners
    setupAuthListeners();
    setupUIListeners();
    setupDragAndDrop();
    setupCanvasListeners();
    
    // Check authentication state
    auth.onAuthStateChanged(handleAuthStateChange);
}

// Authentication Functions
function setupAuthListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchAuthTab(tab);
        });
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

function switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${tab}Form`).classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        showToast('Login realizado com sucesso!', 'success');
    } catch (error) {
        showAuthError(error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;
    
    if (password !== confirmPassword) {
        showAuthError('As senhas não coincidem');
        return;
    }
    
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        showToast('Conta criada com sucesso!', 'success');
    } catch (error) {
        showAuthError(error.message);
    }
}

function handleAuthStateChange(user) {
    if (user) {
        currentUser = user;
        document.getElementById('userEmail').textContent = user.email;
        showApp();
        loadUserProjects();
    } else {
        currentUser = null;
        showAuth();
    }
}

function showAuthError(message) {
    const errorDiv = document.getElementById('authError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showApp() {
    document.getElementById('authContainer').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
}

function showAuth() {
    document.getElementById('appContainer').classList.add('hidden');
    document.getElementById('authContainer').classList.remove('hidden');
}

// UI Event Listeners
function setupUIListeners() {
    // Header buttons
    document.getElementById('saveProjectBtn').addEventListener('click', saveProject);
    document.getElementById('viewCodeBtn').addEventListener('click', showCodeModal);
    document.getElementById('previewBtn').addEventListener('click', showPreviewModal);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Canvas controls
    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('redoBtn').addEventListener('click', redo);
    document.getElementById('clearBtn').addEventListener('click', clearCanvas);
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // New project modal
    document.getElementById('newProjectBtn').addEventListener('click', showNewProjectModal);
    document.getElementById('newProjectForm').addEventListener('submit', createNewProject);
    
    // Code tabs
    document.querySelectorAll('.code-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            switchCodeTab(e.target.dataset.tab);
        });
    });
    
    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            copyCode(e.target.dataset.target);
        });
    });
}

// Drag and Drop
function setupDragAndDrop() {
    const elementItems = document.querySelectorAll('.element-item');
    const canvas = document.getElementById('canvas');
    
    elementItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
    
    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);
    canvas.addEventListener('dragenter', handleDragEnter);
    canvas.addEventListener('dragleave', handleDragLeave);
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.type);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drop-zone');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drop-zone');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drop-zone');
    
    const elementType = e.dataTransfer.getData('text/plain');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    addElement(elementType, x, y);
}

// Canvas Functions
function setupCanvasListeners() {
    const canvas = document.getElementById('canvas');
    
    canvas.addEventListener('click', (e) => {
        if (e.target === canvas) {
            deselectElement();
        }
    });
}

function addElement(type, x, y) {
    const template = elementTemplates[type];
    if (!template) return;
    
    const element = {
        id: generateId(),
        ...template,
        position: { x, y },
        styles: { ...template.styles }
    };
    
    elements.push(element);
    saveToHistory();
    renderElements();
    updateElementCount();
}

function generateId() {
    return 'el_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function renderElements() {
    const canvas = document.getElementById('canvas');
    const placeholder = canvas.querySelector('.canvas-placeholder');
    
    if (elements.length === 0) {
        placeholder.style.display = 'flex';
        return;
    }
    
    placeholder.style.display = 'none';
    
    // Clear existing elements
    canvas.querySelectorAll('.canvas-element').forEach(el => el.remove());
    
    // Render elements
    elements.forEach(element => {
        const elementDiv = createElementDiv(element);
        canvas.appendChild(elementDiv);
    });
}

function createElementDiv(element) {
    const div = document.createElement('div');
    div.className = 'canvas-element';
    div.dataset.elementId = element.id;
    
    // Apply styles
    Object.assign(div.style, element.styles);
    div.style.position = 'absolute';
    div.style.left = element.position.x + 'px';
    div.style.top = element.position.y + 'px';
    div.style.minWidth = '100px';
    div.style.zIndex = '1';
    
    // Create content based on type
    switch (element.type) {
        case 'header':
            div.innerHTML = `<h1>${element.content}</h1>`;
            break;
        case 'text':
            div.innerHTML = `<p>${element.content}</p>`;
            break;
        case 'button':
            div.innerHTML = `<button>${element.content}</button>`;
            break;
        case 'image':
            div.innerHTML = `<img src="${element.content}" alt="Imagem" />`;
            break;
        case 'container':
            div.innerHTML = `<div>${element.content}</div>`;
            break;
        case 'form':
            div.innerHTML = `<form>${element.content}</form>`;
            break;
    }
    
    // Add controls
    const controls = document.createElement('div');
    controls.className = 'element-controls';
    controls.innerHTML = `
        <button onclick="editElement('${element.id}')" title="Editar">
            <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteElement('${element.id}')" title="Excluir">
            <i class="fas fa-trash"></i>
        </button>
    `;
    div.appendChild(controls);
    
    // Add click handler
    div.addEventListener('click', (e) => {
        e.stopPropagation();
        selectElement(element.id);
    });
    
    return div;
}

function selectElement(elementId) {
    selectedElement = elements.find(el => el.id === elementId);
    if (selectedElement) {
        document.querySelectorAll('.canvas-element').forEach(el => {
            el.classList.remove('selected');
        });
        document.querySelector(`[data-element-id="${elementId}"]`).classList.add('selected');
        showElementProperties(selectedElement);
    }
}

function deselectElement() {
    selectedElement = null;
    document.querySelectorAll('.canvas-element').forEach(el => {
        el.classList.remove('selected');
    });
    showNoSelection();
}

function editElement(elementId) {
    const element = elements.find(el => el.id === elementId);
    if (element) {
        const newContent = prompt('Editar conteúdo:', element.content);
        if (newContent !== null) {
            element.content = newContent;
            saveToHistory();
            renderElements();
        }
    }
}

function deleteElement(elementId) {
    if (confirm('Tem certeza que deseja excluir este elemento?')) {
        elements = elements.filter(el => el.id !== elementId);
        saveToHistory();
        renderElements();
        updateElementCount();
        deselectElement();
    }
}

function showElementProperties(element) {
    const panel = document.getElementById('propertiesPanel');
    panel.innerHTML = `
        <div class="form-group">
            <label>Conteúdo</label>
            <input type="text" value="${element.content}" onchange="updateElementProperty('content', this.value)">
        </div>
        <div class="form-group">
            <label>Cor do Texto</label>
            <input type="color" value="${element.styles.color || '#000000'}" onchange="updateElementProperty('color', this.value)">
        </div>
        <div class="form-group">
            <label>Tamanho da Fonte</label>
            <input type="range" min="12" max="72" value="${parseInt(element.styles.fontSize) || 16}" onchange="updateElementProperty('fontSize', this.value + 'px')">
        </div>
        <div class="form-group">
            <label>Alinhamento</label>
            <select onchange="updateElementProperty('textAlign', this.value)">
                <option value="left" ${element.styles.textAlign === 'left' ? 'selected' : ''}>Esquerda</option>
                <option value="center" ${element.styles.textAlign === 'center' ? 'selected' : ''}>Centro</option>
                <option value="right" ${element.styles.textAlign === 'right' ? 'selected' : ''}>Direita</option>
            </select>
        </div>
    `;
}

function showNoSelection() {
    const panel = document.getElementById('propertiesPanel');
    panel.innerHTML = '<p class="no-selection">Selecione um elemento para editar suas propriedades</p>';
}

function updateElementProperty(property, value) {
    if (selectedElement) {
        if (property === 'content') {
            selectedElement.content = value;
        } else {
            selectedElement.styles[property] = value;
        }
        saveToHistory();
        renderElements();
    }
}

// History Management
function saveToHistory() {
    undoStack.push(JSON.stringify(elements));
    redoStack = [];
    updateHistoryButtons();
}

function undo() {
    if (undoStack.length > 0) {
        const currentState = JSON.stringify(elements);
        redoStack.push(currentState);
        
        const previousState = undoStack.pop();
        elements = JSON.parse(previousState);
        
        renderElements();
        updateElementCount();
        updateHistoryButtons();
    }
}

function redo() {
    if (redoStack.length > 0) {
        const currentState = JSON.stringify(elements);
        undoStack.push(currentState);
        
        const nextState = redoStack.pop();
        elements = JSON.parse(nextState);
        
        renderElements();
        updateElementCount();
        updateHistoryButtons();
    }
}

function updateHistoryButtons() {
    document.getElementById('undoBtn').disabled = undoStack.length === 0;
    document.getElementById('redoBtn').disabled = redoStack.length === 0;
}

function clearCanvas() {
    if (confirm('Tem certeza que deseja limpar o canvas?')) {
        elements = [];
        undoStack = [];
        redoStack = [];
        renderElements();
        updateElementCount();
        updateHistoryButtons();
        deselectElement();
    }
}

function updateElementCount() {
    document.getElementById('elementCount').textContent = `${elements.length} elementos`;
}

// Project Management
async function loadUserProjects() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`/api/projetos/${currentUser.uid}`);
        const projects = await response.json();
        
        const projectsList = document.getElementById('projectsList');
        projectsList.innerHTML = '';
        
        if (projects.length === 0) {
            projectsList.innerHTML = '<p style="text-align: center; color: #64748b;">Nenhum projeto encontrado.</p>';
            return;
        }
        
        projects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project-item';
            projectDiv.innerHTML = `
                <h4>${project.nome}</h4>
                <p>${project.elementos ? project.elementos.length : 0} elementos</p>
                <div class="project-meta">
                    <span>Criado em ${new Date(project.criadoEm).toLocaleDateString('pt-BR')}</span>
                    <button class="btn-text" onclick="loadProject('${project.id}')">Carregar</button>
                </div>
            `;
            projectsList.appendChild(projectDiv);
        });
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
    }
}

async function saveProject() {
    if (!currentUser) {
        showToast('Faça login para salvar projetos', 'error');
        return;
    }
    
    if (!currentProject) {
        showNewProjectModal();
        return;
    }
    
    try {
        const projectData = {
            nome: currentProject.nome,
            elementos: elements,
            html: generateHTML(),
            css: generateCSS(),
            js: generateJS(),
            atualizadoEm: new Date().toISOString()
        };
        
        const response = await fetch(`/api/projetos/${currentUser.uid}/${currentProject.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        
        if (response.ok) {
            showToast('Projeto salvo com sucesso!', 'success');
        } else {
            throw new Error('Erro ao salvar projeto');
        }
    } catch (error) {
        showToast('Erro ao salvar projeto: ' + error.message, 'error');
    }
}

async function createNewProject(e) {
    e.preventDefault();
    
    const projectName = document.getElementById('projectName').value;
    if (!projectName.trim()) return;
    
    try {
        const projectData = {
            nome: projectName,
            elementos: elements,
            html: generateHTML(),
            css: generateCSS(),
            js: generateJS(),
            criadoEm: new Date().toISOString(),
            atualizadoEm: new Date().toISOString()
        };
        
        const response = await fetch(`/api/projetos/${currentUser.uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        
        if (response.ok) {
            const newProject = await response.json();
            currentProject = newProject;
            showToast('Projeto criado com sucesso!', 'success');
            closeAllModals();
            loadUserProjects();
        } else {
            throw new Error('Erro ao criar projeto');
        }
    } catch (error) {
        showToast('Erro ao criar projeto: ' + error.message, 'error');
    }
}

async function loadProject(projectId) {
    try {
        const response = await fetch(`/api/projetos/${currentUser.uid}/${projectId}`);
        const project = await response.json();
        
        currentProject = project;
        elements = project.elementos || [];
        undoStack = [];
        redoStack = [];
        
        renderElements();
        updateElementCount();
        updateHistoryButtons();
        deselectElement();
        
        closeAllModals();
        showToast('Projeto carregado com sucesso!', 'success');
    } catch (error) {
        showToast('Erro ao carregar projeto: ' + error.message, 'error');
    }
}

// Code Generation
function generateHTML() {
    let html = '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n';
    html += '    <meta charset="UTF-8">\n';
    html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '    <title>Site Gerado pelo Sitefy</title>\n';
    html += '    <link rel="stylesheet" href="styles.css">\n';
    html += '</head>\n<body>\n';
    
    elements.forEach(element => {
        html += generateElementHTML(element);
    });
    
    html += '    <script src="script.js"></script>\n';
    html += '</body>\n</html>';
    
    return html;
}

function generateElementHTML(element) {
    const styles = Object.entries(element.styles)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
    
    switch (element.type) {
        case 'header':
            return `    <header style="${styles}">\n        <h1>${element.content}</h1>\n    </header>\n`;
        case 'text':
            return `    <p style="${styles}">${element.content}</p>\n`;
        case 'button':
            return `    <button style="${styles}">${element.content}</button>\n`;
        case 'image':
            return `    <img src="${element.content}" style="${styles}" alt="Imagem">\n`;
        case 'container':
            return `    <div style="${styles}">\n        ${element.content}\n    </div>\n`;
        case 'form':
            return `    <form style="${styles}">\n        ${element.content}\n    </form>\n`;
        default:
            return `    <div style="${styles}">${element.content}</div>\n`;
    }
}

function generateCSS() {
    let css = '/* Estilos gerados pelo Sitefy */\n\n';
    css += 'body {\n';
    css += '    font-family: Arial, sans-serif;\n';
    css += '    margin: 0;\n';
    css += '    padding: 20px;\n';
    css += '    background-color: #f8fafc;\n';
    css += '}\n\n';
    
    elements.forEach((element, index) => {
        css += `.element-${index} {\n`;
        Object.entries(element.styles).forEach(([property, value]) => {
            css += `    ${property}: ${value};\n`;
        });
        css += '}\n\n';
    });
    
    return css;
}

function generateJS() {
    let js = '// JavaScript gerado pelo Sitefy\n\n';
    js += 'document.addEventListener("DOMContentLoaded", function() {\n';
    js += '    console.log("Site carregado com sucesso!");\n';
    js += '});\n';
    
    return js;
}

// Modal Functions
function showCodeModal() {
    document.getElementById('htmlCodeContent').textContent = generateHTML();
    document.getElementById('cssCodeContent').textContent = generateCSS();
    document.getElementById('jsCodeContent').textContent = generateJS();
    
    document.getElementById('codeModal').classList.remove('hidden');
}

function showPreviewModal() {
    const html = generateHTML();
    const css = generateCSS();
    const js = generateJS();
    
    const fullHTML = html.replace('</head>', `<style>${css}</style></head>`)
                        .replace('</body>', `<script>${js}</script></body>`);
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    document.getElementById('previewFrame').src = url;
    document.getElementById('previewModal').classList.remove('hidden');
}

function showNewProjectModal() {
    document.getElementById('newProjectModal').classList.remove('hidden');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

function switchCodeTab(tab) {
    document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.code-panel').forEach(p => p.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}Code`).classList.add('active');
}

function copyCode(target) {
    const content = document.getElementById(`${target}Content`).textContent;
    navigator.clipboard.writeText(content).then(() => {
        showToast('Código copiado!', 'success');
    });
}

// Utility Functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function logout() {
    auth.signOut().then(() => {
        showToast('Logout realizado com sucesso!', 'success');
    });
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeAllModals();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 's':
                e.preventDefault();
                saveProject();
                break;
            case 'z':
                e.preventDefault();
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
                break;
        }
    }
    
    if (e.key === 'Escape') {
        closeAllModals();
        deselectElement();
    }
});