// Déplacez la fonction ici, avant le DOMContentLoaded
function showEditLitForm(lit) {
    document.getElementById('editLitId').value = lit._id;
    document.getElementById('editLitNum').value = lit.num;
    document.getElementById('editLitStatus').value = lit.status;
    
    // Si le statut est 'occupé', afficher la sélection de patient
    if (lit.status === 'occupe') {
        document.getElementById('patientSelection').style.display = 'block';
    } else {
        document.getElementById('patientSelection').style.display = 'none';
    }

    document.getElementById('editLitSection').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token) {
        window.location.href = 'connexion.html';
        return;
    }

    // Récupérer les informations de profil utilisateur
    async function getUserProfile() {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success && data.data) {
                document.getElementById('userName').textContent = `${data.data.nom} ${data.data.prenom}`;
                document.getElementById('userEmail').textContent = data.data.email;
                document.getElementById('userNum').textContent = data.data.num;
                document.getElementById('userSexe').textContent = data.data.sexe;

                document.getElementById('editProfileButton').addEventListener('click', () => {
                    showEditForm(data.data);
                });
            } else {
                console.error('Erreur lors de la récupération du profil utilisateur:', data.message);
                alert('Erreur lors de la récupération du profil utilisateur. Veuillez réessayer plus tard.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la récupération du profil utilisateur. Veuillez réessayer plus tard.');
        }
    }

    // Afficher le formulaire de modification avec les données actuelles
    function showEditForm(data) {
        document.getElementById('editNom').value = data.nom;
        document.getElementById('editPrenom').value = data.prenom;
        document.getElementById('editEmail').value = data.email;
        document.getElementById('editNum').value = data.num;
        document.getElementById('editSexe').value = data.sexe;

        document.getElementById('userProfileSection').style.display = 'none';
        document.getElementById('editProfileSection').style.display = 'block';
    }

    // Gérer la soumission du formulaire de modification
    document.getElementById('editProfileForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedUser = {
            nom: document.getElementById('editNom').value,
            prenom: document.getElementById('editPrenom').value,
            email: document.getElementById('editEmail').value,
            num: document.getElementById('editNum').value,
            sexe: document.getElementById('editSexe').value,
        };

        const newPassword = document.getElementById('editMdp').value;
        const confirmPassword = document.getElementById('confirmMdp').value;

        if (newPassword) {
            if (newPassword !== confirmPassword) {
                alert('Les mots de passe ne correspondent pas.');
                return;
            }
            updatedUser.mdp = newPassword;
        }

        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser)
            });

            const data = await response.json();
            if (response.ok && data.success) {
                alert('Profil mis à jour avec succès.');
                window.location.reload();
            } else {
                alert(`Erreur lors de la mise à jour du profil: ${data.message}`);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            alert('Erreur lors de la mise à jour du profil.');
        }
    });

    // Gérer l'annulation de la modification
    document.getElementById('cancelEdit').addEventListener('click', () => {
        document.getElementById('editProfileSection').style.display = 'none';
        document.getElementById('userProfileSection').style.display = 'block';
    });

    // Fonction pour récupérer et afficher les lits
    async function getLits() {
        try {
            const response = await fetch('http://localhost:5005/lit/lits', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` // Assurez-vous d'envoyer le token si nécessaire
                }
            });
            const data = await response.json();
            if (response.ok) {
                const litsTableBody = document.getElementById('litsTableBody');
                litsTableBody.innerHTML = ''; // Vider le contenu actuel du tableau

                // Parcourir les lits et les afficher
                data.forEach(lit => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${lit.num}</td>
                        <td>${lit.status}</td>
                        <td><button class="btn btn-primary" onclick='showEditLitForm(${JSON.stringify(lit)})'>Modifier</button></td>
                    `;
                    litsTableBody.appendChild(row);
                });
                
            } else {
                console.error('Erreur lors de la récupération des lits:', data.message);
                alert('Erreur lors de la récupération des lits. Veuillez réessayer plus tard.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la récupération des lits. Veuillez réessayer plus tard.');
        }
    }

    // Appeler la fonction pour récupérer et afficher les lits lors du chargement de la page
    getLits();

    // Fonction pour charger la liste des patients
    async function loadPatients() {
        try {
            const response = await fetch('http://localhost:5000/users/patients', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const patients = await response.json();
            const patientSelect = document.getElementById('selectPatient');
            patientSelect.innerHTML = '';
            patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient._id;
                option.textContent = `${patient.nom} ${patient.prenom}`;
                patientSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erreur lors du chargement des patients:', error);
        }
    }

    // Fonction pour gérer la soumission du formulaire de modification du lit
    document.getElementById('editLitForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const litId = document.getElementById('editLitId').value;
        const status = document.getElementById('editLitStatus').value;
        const patientId = status === 'occupe' ? document.getElementById('selectPatient').value : null;

        const updatedLit = {
            status,
            patientId
        };

        try {
            const response = await fetch(`http://localhost:5005/lit/${litId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedLit)
            });
            if (response.ok) {
                alert('Statut du lit mis à jour avec succès.');
                window.location.reload();
            } else {
                const data = await response.json();
                alert(`Erreur lors de la mise à jour du lit: ${data.message}`);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du lit:', error);
            alert('Erreur lors de la mise à jour du lit.');
        }
    });

    // Gérer l'annulation de la modification
    document.getElementById('cancelEditLit').addEventListener('click', () => {
        document.getElementById('editLitSection').style.display = 'none';
    });

    // Appeler la fonction pour charger les patients
    loadPatients();

    // Gérer la déconnexion
    document.getElementById('logoutButton').addEventListener('click', () => {
        // Supprimer les données du localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('token');
        
        // Rediriger l'utilisateur vers la page de connexion
        window.location.href = 'connexion.html';
    });

    getUserProfile();
});
