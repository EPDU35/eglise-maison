// Vérifier l'authentification
if (sessionStorage.getItem('adminConnected') !== 'true') {
    window.location.href = 'admin-login.html';
}

const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));


// Navigation entre sections
document.getElementById('menuInscrits').addEventListener('click', function(e) {
    e.preventDefault();
    afficherSection('sectionInscrits');
});

document.getElementById('menuUtilisateurs').addEventListener('click', function(e) {
    e.preventDefault();
    afficherSection('sectionUtilisateurs');
    chargerUtilisateurs();
});

document.getElementById('menuProfil').addEventListener('click', function(e) {
    e.preventDefault();
    afficherSection('sectionProfil');
});

function afficherSection(sectionId) {
    document.querySelectorAll('.admin-container').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Charger au démarrage
document.addEventListener('DOMContentLoaded', function() {
    afficherInscrits();
    mettreAJourStats();
});

// === GESTION DES INSCRITS ===

function afficherInscrits() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    if (inscritsFiltres.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #777;">Aucun résultat trouvé</td></tr>';
        document.getElementById('resultCount').textContent = '(0)';
        return;
    }

    inscritsFiltres.forEach(inscrit => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${inscrit.nom}</td>
            <td>${inscrit.prenoms}</td>
            <td>${inscrit.sexe}</td>
            <td>${new Date(inscrit.dateNaissance).toLocaleDateString('fr-FR')}</td>
            <td>${inscrit.zone}</td>
            <td>${inscrit.egliseLocale}</td>
            <td>${inscrit.direction}</td>
            <td>${inscrit.responsabilite.replace(/_/g, ' ')}</td>
            <td>${inscrit.contact}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editerInscrit(${inscrit.id})">Modifier</button>
                <button class="btn-delete" onclick="supprimerInscrit(${inscrit.id})">Supprimer</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('resultCount').textContent = `(${inscritsFiltres.length})`;
}

function mettreAJourStats() {
    document.getElementById('totalInscrits').textContent = inscrits.length;
    document.getElementById('totalHommes').textContent = inscrits.filter(i => i.sexe === 'Homme').length;
    document.getElementById('totalFemmes').textContent = inscrits.filter(i => i.sexe === 'Femme').length;
}

document.getElementById('btnRechercher').addEventListener('click', function() {
    const nom = document.getElementById('searchNom').value.toLowerCase();
    const sexe = document.getElementById('filterSexe').value;
    const zone = document.getElementById('filterZone').value;
    const eglise = document.getElementById('filterEglise').value;
    const responsabilite = document.getElementById('filterResponsabilite').value;

    inscritsFiltres = inscrits.filter(inscrit => {
        const matchNom = !nom || inscrit.nom.toLowerCase().includes(nom) || inscrit.prenoms.toLowerCase().includes(nom);
        const matchSexe = !sexe || inscrit.sexe === sexe;
        const matchZone = !zone || inscrit.zone === zone;
        const matchEglise = !eglise || inscrit.egliseLocale === eglise;
        const matchResponsabilite = !responsabilite || inscrit.responsabilite === responsabilite;

        return matchNom && matchSexe && matchZone && matchEglise && matchResponsabilite;
    });

    afficherInscrits();
});

document.getElementById('btnReset').addEventListener('click', function() {
    document.getElementById('searchNom').value = '';
    document.getElementById('filterSexe').value = '';
    document.getElementById('filterZone').value = '';
    document.getElementById('filterEglise').value = '';
    document.getElementById('filterResponsabilite').value = '';
    inscritsFiltres = [...inscrits];
    afficherInscrits();
});

// Gestion des modals
document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', function() {
        const modalId = this.dataset.modal;
        document.getElementById(modalId).style.display = 'none';
    });
});

document.querySelectorAll('.btn-cancel').forEach(btn => {
    btn.addEventListener('click', function() {
        const modalId = this.dataset.modal;
        document.getElementById(modalId).style.display = 'none';
    });
});

window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
};

function editerInscrit(id) {
    const inscrit = inscrits.find(i => i.id === id);
    if (!inscrit) return;

    document.getElementById('editId').value = inscrit.id;
    document.getElementById('editNom').value = inscrit.nom;
    document.getElementById('editPrenoms').value = inscrit.prenoms;
    document.querySelector(`input[name="editSexe"][value="${inscrit.sexe}"]`).checked = true;
    document.getElementById('editDateNaissance').value = inscrit.dateNaissance;
    document.getElementById('editLieuNaissance').value = inscrit.lieuNaissance;
    document.getElementById('editZone').value = inscrit.zone;
    document.getElementById('editEgliseLocale').value = inscrit.egliseLocale;
    document.getElementById('editDirection').value = inscrit.direction;
    document.getElementById('editResponsabilite').value = inscrit.responsabilite;
    document.getElementById('editContact').value = inscrit.contact;

    document.getElementById('modalEdit').style.display = 'flex';
}

document.getElementById('formEdit').addEventListener('submit', function(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('editId').value);
    const index = inscrits.findIndex(i => i.id === id);

    if (index !== -1) {
        inscrits[index] = {
            id: id,
            nom: document.getElementById('editNom').value,
            prenoms: document.getElementById('editPrenoms').value,
            sexe: document.querySelector('input[name="editSexe"]:checked').value,
            dateNaissance: document.getElementById('editDateNaissance').value,
            lieuNaissance: document.getElementById('editLieuNaissance').value,
            zone: document.getElementById('editZone').value,
            egliseLocale: document.getElementById('editEgliseLocale').value,
            direction: document.getElementById('editDirection').value,
            responsabilite: document.getElementById('editResponsabilite').value,
            contact: document.getElementById('editContact').value
        };

        inscritsFiltres = [...inscrits];
        afficherInscrits();
        mettreAJourStats();
        document.getElementById('modalEdit').style.display = 'none';
        
        alert('Modification enregistrée avec succès !');
    }
});

function supprimerInscrit(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet inscrit ?')) {
        inscrits = inscrits.filter(i => i.id !== id);
        inscritsFiltres = inscritsFiltres.filter(i => i.id !== id);
        afficherInscrits();
        mettreAJourStats();
        alert('Inscrit supprimé avec succès !');
    }
}

document.getElementById('btnExport').addEventListener('click', function() {
    let csv = 'Nom,Prénoms,Sexe,Date Naissance,Lieu Naissance,Zone,Église Locale,Direction,Responsabilité,Contact\n';
    
    inscritsFiltres.forEach(inscrit => {
        csv += `${inscrit.nom},${inscrit.prenoms},${inscrit.sexe},${inscrit.dateNaissance},${inscrit.lieuNaissance},${inscrit.zone},${inscrit.egliseLocale},${inscrit.direction},${inscrit.responsabilite},${inscrit.contact}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inscrits_' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
});

// === GESTION DES UTILISATEURS ===

function chargerUtilisateurs() {
    const users = JSON.parse(localStorage.getItem('adminUsers'));
    const tbody = document.getElementById('tableUsers');
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        const isCurrentUser = user.identifiant === currentUser.identifiant;
        
        tr.innerHTML = `
            <td>${user.identifiant}</td>
            <td>${user.role === 'super_admin' ? 'Super Admin' : 'Administrateur'}</td>
            <td>${new Date(user.dateCreation).toLocaleDateString('fr-FR')}</td>
            <td class="actions">
                ${!isCurrentUser ? `<button class="btn-delete" onclick="supprimerUtilisateur(${user.id})">Supprimer</button>` : '<span style="color: #666;">Compte actuel</span>'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('btnAjouterUser').addEventListener('click', function() {
    document.getElementById('modalAddUser').style.display = 'flex';
});

document.getElementById('formAddUser').addEventListener('submit', function(e) {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('adminUsers'));
    const identifiant = document.getElementById('newUserIdentifiant').value;
    
    // Vérifier si l'identifiant existe déjà
    if (users.find(u => u.identifiant === identifiant)) {
        alert('Cet identifiant existe déjà !');
        return;
    }

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        identifiant: identifiant,
        password: document.getElementById('newUserPassword').value,
        role: document.getElementById('newUserRole').value,
        dateCreation: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('adminUsers', JSON.stringify(users));

    document.getElementById('modalAddUser').style.display = 'none';
    this.reset();
    chargerUtilisateurs();
    alert('Utilisateur créé avec succès !');
});

function supprimerUtilisateur(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        let users = JSON.parse(localStorage.getItem('adminUsers'));
        users = users.filter(u => u.id !== id);
        localStorage.setItem('adminUsers', JSON.stringify(users));
        chargerUtilisateurs();
        alert('Utilisateur supprimé avec succès !');
    }
}

// === CHANGEMENT DE MOT DE PASSE ===

document.getElementById('formChangerPassword').addEventListener('submit', function(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Vérifier le mot de passe actuel
    if (currentPassword !== currentUser.password) {
        alert('Le mot de passe actuel est incorrect !');
        return;
    }

    // Vérifier la confirmation
    if (newPassword !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas !');
        return;
    }

    // Mettre à jour le mot de passe
    let users = JSON.parse(localStorage.getItem('adminUsers'));
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('adminUsers', JSON.stringify(users));
        
        // Mettre à jour la session
        currentUser.password = newPassword;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

        this.reset();
        alert('Mot de passe modifié avec succès !');
    }
});

// Déconnexion
document.getElementById('btnDeconnexion').addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        sessionStorage.clear();
        window.location.href = 'admin-login.html';
    }
});