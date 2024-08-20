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

    // Récupérer les médecins pour la liste déroulante
    try {
        const doctorsResponse = await fetch('http://localhost:5000/users/doctors', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!doctorsResponse.ok) {
            throw new Error(`Erreur HTTP: ${doctorsResponse.status}`);
        }

        const doctors = await doctorsResponse.json();
        const doctorSelect = document.getElementById('doctorId');
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor._id;
            option.textContent = `${doctor.nom} ${doctor.prenom} (${doctor.specialisation})`;
            doctorSelect.appendChild(option);
        });

        // Récupération des rendez-vous par patientId
        const appointmentsResponse = await fetch(`http://localhost:5002/rdv/patient/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!appointmentsResponse.ok) {
            throw new Error(`Erreur HTTP: ${appointmentsResponse.status}`);
        }

        const appointments = await appointmentsResponse.json();
        const appointmentsList = document.getElementById('appointmentsList');
        appointments.forEach(appointment => {
            const doctor = doctors.find(doc => doc._id === appointment.doctorId);
            if (doctor) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `Médecin: Dr. ${doctor.nom} ${doctor.prenom}, Date: ${new Date(appointment.date).toLocaleDateString()}, Status: ${appointment.status}
                    <button onclick="deleteAppointment('${appointment._id}')">Supprimer</button>`;
                appointmentsList.appendChild(listItem);
            } else {
                console.error(`Médecin non trouvé pour l'ID: ${appointment.doctorId}`);
                const listItem = document.createElement('li');
                listItem.innerHTML = `Médecin: Non trouvé, Date: ${new Date(appointment.date).toLocaleDateString()}, Status: ${appointment.status}
                    <button onclick="deleteAppointment('${appointment._id}')">Supprimer</button>`;
                appointmentsList.appendChild(listItem);
            }
        });

        // Récupération du dossier médical
        const medicalRecordResponse = await fetch(`http://localhost:5004/dossier/dossierPatient/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!medicalRecordResponse.ok) {
            throw new Error(`Erreur HTTP: ${medicalRecordResponse.status}`);
        }

        const medicalRecords = await medicalRecordResponse.json();
        const medicalRecordDiv = document.getElementById('medicalRecord');
        
        medicalRecords.forEach(record => {
            const recordDiv = document.createElement('div');
            recordDiv.innerHTML = `
                <li>Antécédent: ${record.antecedant}</li>
                <li>Diagnostic: ${record.diagnostic}</li>
                <li>Traitement: ${record.traitement}</li>
            `;
            medicalRecordDiv.appendChild(recordDiv);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }

    // Fonction pour créer un rendez-vous
    document.getElementById('createAppointmentForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const doctorId = document.getElementById('doctorId').value;
        const date = document.getElementById('appointmentDate').value;
        const userId = localStorage.getItem('userId');

        try {
            const response = await fetch('http://localhost:5002/rdv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ patientId: userId, doctorId, date })
            });

            if (response.ok) {
                alert('Rendez-vous créé avec succès. En attente d\'approbation.');
                window.location.reload(); // Recharger la page pour mettre à jour la liste des rendez-vous
            } else {
                const errorData = await response.json();
                alert(`Erreur lors de la création du rendez-vous: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erreur lors de la création du rendez-vous:', error);
            alert('Erreur lors de la création du rendez-vous.');
        }
    });

    // Fonction pour supprimer un rendez-vous
    async function deleteAppointment(appointmentId) {
        try {
            const response = await fetch(`http://localhost:5002/rdv/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                window.location.reload(); // Recharger la page pour mettre à jour la liste des rendez-vous
            } else {
                console.error('Erreur lors de la suppression du rendez-vous:', response.status);
                alert('Erreur lors de la suppression du rendez-vous.');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du rendez-vous:', error);
            alert('Erreur lors de la suppression du rendez-vous.');
        }
    }

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
