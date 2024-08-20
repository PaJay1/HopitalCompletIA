document.addEventListener('DOMContentLoaded', async () => {
    const doctorName = localStorage.getItem('userName');
    const doctorId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    // Vérification d'authentification : redirection si l'utilisateur n'est pas authentifié
    if (!token) {
        window.location.href = 'connexion.html'; // Remplacez 'connexion.html' par l'URL de votre page de connexion
        return;
    }
    document.getElementById('doctorName').textContent = doctorName;

    // Récupération du profil du médecin
    async function getDoctorProfile() {
        try {
            const response = await fetch(`http://localhost:5000/users/${doctorId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success && data.data) {
                document.getElementById('doctorFullName').textContent = `${data.data.nom} ${data.data.prenom}`;
                document.getElementById('doctorEmail').textContent = data.data.email;
                document.getElementById('doctorNum').textContent = data.data.num;
                document.getElementById('doctorSpecialization').textContent = data.data.specialisation;

                // Attacher le gestionnaire d'événements pour le bouton "Modifier Profil"
                document.getElementById('editProfileButton').addEventListener('click', () => {
                    showEditForm(data.data);
                });
            } else {
                console.error('Erreur lors de la récupération du profil du médecin:', data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du profil du médecin:', error);
        }
    }

    // Afficher le formulaire de modification du profil avec les données actuelles
    function showEditForm(data) {
        document.getElementById('editNom').value = data.nom;
        document.getElementById('editPrenom').value = data.prenom;
        document.getElementById('editEmail').value = data.email;
        document.getElementById('editNum').value = data.num;
        document.getElementById('editSpecialization').value = data.specialisation;

        document.getElementById('doctorProfileSection').style.display = 'none';
        document.getElementById('editProfileSection').style.display = 'block';
    }

    // Gérer la soumission du formulaire de modification du profil
    document.getElementById('editProfileForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedDoctor = {
            nom: document.getElementById('editNom').value,
            prenom: document.getElementById('editPrenom').value,
            email: document.getElementById('editEmail').value,
            num: document.getElementById('editNum').value,
            specialisation: document.getElementById('editSpecialization').value,
        };

        const newPassword = document.getElementById('editMdp').value;
        const confirmPassword = document.getElementById('confirmMdp').value;

        if (newPassword) {
            if (newPassword !== confirmPassword) {
                alert('Les mots de passe ne correspondent pas.');
                return;
            }
            updatedDoctor.mdp = newPassword;
        }

        try {
            const response = await fetch(`http://localhost:5000/users/${doctorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedDoctor)
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

    // Annuler la modification du profil
    document.getElementById('cancelEdit').addEventListener('click', () => {
        document.getElementById('editProfileSection').style.display = 'none';
        document.getElementById('doctorProfileSection').style.display = 'block';
    });

    // Récupération des rendez-vous du docteur
    try {
        const appointmentsResponse = await fetch(`http://localhost:5002/rdv/doctor/${doctorId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const appointments = await appointmentsResponse.json();
        const appointmentsList = document.getElementById('appointmentsList');
        
        for (let appointment of appointments) {
            // Récupération des détails du patient pour chaque rendez-vous
            const patientResponse = await fetch(`http://localhost:5000/users/${appointment.patientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const patient = await patientResponse.json();

            // Création de l'élément de la liste avec le nom du patient
            const listItem = document.createElement('li');
            listItem.innerHTML = `Patient: ${patient.data.nom} ${patient.data.prenom}, Date: ${new Date(appointment.date).toLocaleDateString()}, Status: ${appointment.status}
                <button onclick="approveAppointment('${appointment._id}')">Approuver</button>
                <button onclick="rejectAppointment('${appointment._id}')">Rejeter</button>`;
            appointmentsList.appendChild(listItem);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
    }

    // Récupérer la liste des patients
    try {
        const patientsResponse = await fetch('http://localhost:5000/users/patients', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const patients = await patientsResponse.json();
        const patientDropdown = document.getElementById('patientId');
        
        // Ajouter chaque patient à la dropdown list
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient._id;
            option.textContent = `${patient.nom} ${patient.prenom}`;
            patientDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des patients:', error);
    }

    // Gestion de la soumission du formulaire de création de dossier médical
    document.getElementById('createMedicalRecordForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // Empêche le rechargement de la page

        const patientId = document.getElementById('patientId').value;
        const antecedant = document.getElementById('antecedant').value;
        const diagnostic = document.getElementById('diagnostic').value;
        const traitement = document.getElementById('traitement').value;

        try {
            const response = await fetch('http://localhost:5004/dossier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    patientId,
                    doctorId,
                    antecedant,
                    diagnostic,
                    traitement
                })
            });

            if (response.ok) {
                alert('Dossier médical créé avec succès');
                document.getElementById('createMedicalRecordForm').reset(); // Réinitialise le formulaire
            } else {
                console.error('Erreur lors de la création du dossier médical:', response.status);
                alert('Une erreur est survenue lors de la création du dossier médical');
            }
        } catch (error) {
            console.error('Erreur lors de la création du dossier médical:', error);
        }
    });

    // Gérer la déconnexion
    document.getElementById('logoutButton').addEventListener('click', () => {
        // Supprimer les données du localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('token');
        
        // Rediriger l'utilisateur vers la page de connexion
        window.location.href = 'connexion.html'; // Remplacez 'connexion.html' par l'URL de votre page de connexion
    });

    // Initialiser la récupération du profil du médecin
    getDoctorProfile();
});

async function approveAppointment(appointmentId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:5002/rdv/${appointmentId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'approved' })
        });
        if (response.ok) {
            window.location.reload(); // Recharger la page pour mettre à jour la liste des rendez-vous
        } else {
            console.error('Erreur lors de l\'approbation du rendez-vous');
        }
    } catch (error) {
        console.error('Erreur lors de l\'approbation du rendez-vous:', error);
    }
}

async function rejectAppointment(appointmentId) {
    console.log('Rejeter appelé pour le rendez-vous ID:', appointmentId); // Vérifier que la fonction est bien appelée
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:5002/rdv/${appointmentId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Statut de la réponse:', response.status); // Vérifier le statut de la réponse
        if (response.ok) {
            window.location.reload(); // Recharger la page pour mettre à jour la liste des rendez-vous
        } else {
            console.error('Erreur lors du rejet du rendez-vous:', response.status);
        }
    } catch (error) {
        console.error('Erreur lors du rejet du rendez-vous:', error);
    }
}
