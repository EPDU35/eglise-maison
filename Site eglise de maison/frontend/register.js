document.getElementById('formInscription').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const messageDiv = document.getElementById('message');
    const btnSubmit = document.getElementById('btnSubmit');
    const btnText = btnSubmit.querySelector('.btn-text');
    const btnLoader = btnSubmit.querySelector('.btn-loader');
    
    const formData = {
        nom: document.getElementById('nom').value.trim(),
        prenoms: document.getElementById('prenoms').value.trim(),
        sexe: document.querySelector('input[name="sexe"]:checked').value,
        dateNaissance: document.getElementById('dateNaissance').value,
        lieuNaissance: document.getElementById('lieuNaissance').value.trim(),
        zone: document.getElementById('zone').value,
        egliseLocale: document.getElementById('egliseLocale').value,
        direction: document.getElementById('direction').value,
        responsabilite: document.getElementById('responsabilite').value,
        contact: document.getElementById('contact').value.trim()
    };
    
    btnSubmit.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    messageDiv.style.display = 'none';
    
    try {
        const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.INSCRITS, {
            method: 'POST',
            headers: API_CONFIG.getHeaders(false),
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.textContent = 'Inscription enregistrée avec succès';
            messageDiv.className = 'message success';
            messageDiv.style.display = 'block';
            this.reset();
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        } else {
            throw new Error(data.message || 'Erreur lors de l\'inscription');
        }
    } catch (error) {
        messageDiv.textContent = error.message || 'Une erreur est survenue. Veuillez réessayer.';
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
    } finally {
        btnSubmit.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});