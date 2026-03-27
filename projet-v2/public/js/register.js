// Gestion du formulaire d'inscription
document.getElementById('formInscription').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const messageDiv = document.getElementById('message');
    const submitBtn = this.querySelector('button[type="submit"]');
    
    // Désactiver le bouton pendant l'envoi
    submitBtn.disabled = true;
    submitBtn.textContent = 'Inscription en cours...';
    
    // Récupération des données du formulaire
    const formData = {
        nom: document.getElementById('nom').value,
        prenoms: document.getElementById('prenoms').value,
        sexe: document.querySelector('input[name="sexe"]:checked').value,
        dateNaissance: document.getElementById('dateNaissance').value,
        lieuNaissance: document.getElementById('lieuNaissance').value,
        zone: document.getElementById('zone').value,
        egliseLocale: document.getElementById('egliseLocale').value,
        direction: document.getElementById('direction').value,
        responsabilite: document.getElementById('responsabilite').value,
        contact: document.getElementById('contact').value
    };
    
    try {
        // Envoyer les données à l'API
        await InscritsAPI.create(formData);
        
        // Affichage du message de succès
        messageDiv.innerHTML = '<p style="color: green;">✅ Inscription réussie !</p>';
        messageDiv.style.display = 'block';
        
        // Réinitialisation du formulaire
        this.reset();
        
        // Masquer le message après 5 secondes
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
        
    } catch (error) {
        console.error('Erreur inscription:', error);
        messageDiv.innerHTML = `<p style="color: red;">❌ Erreur: ${error.message}</p>`;
        messageDiv.style.display = 'block';
    } finally {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.textContent = "M'inscrire";
    }
});