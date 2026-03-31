if (sessionStorage.getItem('token')) {
    window.location.href = 'admin.html';
}

document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const showText = this.querySelector('.show-text');
    const hideText = this.querySelector('.hide-text');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        showText.style.display = 'none';
        hideText.style.display = 'inline';
    } else {
        passwordInput.type = 'password';
        showText.style.display = 'inline';
        hideText.style.display = 'none';
    }
});

document.getElementById('formLogin').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const identifiant = document.getElementById('identifiant').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const btnLogin = document.getElementById('btnLogin');
    const btnText = btnLogin.querySelector('.btn-text');
    const btnLoader = btnLogin.querySelector('.btn-loader');
    const loginBox = document.querySelector('.login-box');
    
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    btnLogin.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    
    try {
        const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: API_CONFIG.getHeaders(false),
            body: JSON.stringify({ identifiant, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            API_CONFIG.setToken(data.token);
            sessionStorage.setItem('currentUser', JSON.stringify(data.user));
            window.location.href = 'admin.html';
        } else {
            throw new Error(data.message || 'Identifiants incorrects');
        }
    } catch (error) {
        errorMessage.textContent = error.message || 'Erreur de connexion. Veuillez réessayer.';
        errorMessage.classList.add('show');
        
        loginBox.classList.add('shake');
        setTimeout(() => {
            loginBox.classList.remove('shake');
        }, 300);
        
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    } finally {
        btnLogin.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});