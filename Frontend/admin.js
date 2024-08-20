document.addEventListener('DOMContentLoaded', async () => {
    const adminName = localStorage.getItem('userName');
    document.getElementById('adminName').textContent = adminName;   
    const token = localStorage.getItem('token');
    // Vérification d'authentification : redirection si l'utilisateur n'est pas authentifié
    if (!token) {
        window.location.href = 'connexion.html'; // Remplacez 'connexion.html' par l'URL de votre page de connexion
        return;
    }

    try {
        // Récupération des patients
        const patientsResponse = await fetch('http://localhost:5000/users/patients', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const patients = await patientsResponse.json();
        const patientsList = document.getElementById('patientsList');
        document.getElementById('patientsCount').textContent = patients.length;

        patients.forEach(patient => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${patient.nom} ${patient.prenom} ${patient.role}
            (email: ${patient.email}) (NAS: ${patient.nas}) (TEL: ${patient.num})
            <button class="btn-danger onclick="deleteUser('${patient._id}')">Supprimer</button>`;
            patientsList.appendChild(listItem);
        });

        // Récupération des docteurs
        const doctorsResponse = await fetch('http://localhost:5000/users/doctors', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const doctors = await doctorsResponse.json();
        const doctorsList = document.getElementById('doctorsList');
        document.getElementById('doctorsCount').textContent = doctors.length;

        doctors.forEach(doctor => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${doctor.nom} ${doctor.prenom} (Spécialisation: ${doctor.specialisation}) 
            (email: ${doctor.email}) (NAS: ${doctor.nas}) (TEL: ${doctor.num})
            <button class="btn-danger onclick="deleteUser('${doctor._id}')">Supprimer</button>`;
            doctorsList.appendChild(listItem);
        });

        // Récupération des départements
        const departmentsResponse = await fetch('http://localhost:5003/dept/departements', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!departmentsResponse.ok) {
            throw new Error(`HTTP error! status: ${departmentsResponse.status}`);
        }
        const departments = await departmentsResponse.json();

        const departmentSelect = document.getElementById('departmentSelect');
        
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept._id;
            option.textContent = dept.nom;
            departmentSelect.appendChild(option);
        });

        // Masquer les sections Patients et Docteurs au départ
        document.getElementById('patientsSection').style.display = 'none';
        document.getElementById('doctorsSection').style.display = 'none';
        

    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs ou départements:', error);
    }
});

function showPatientsSection() {
    document.getElementById('patientsSection').style.display = 'block';
    document.getElementById('doctorsSection').style.display = 'none';
}

function showDoctorsSection() {
    document.getElementById('doctorsSection').style.display = 'block';
    document.getElementById('patientsSection').style.display = 'none';
}

function masquer(){
    document.getElementById('doctorsSection').style.display = 'none';
    document.getElementById('patientsSection').style.display = 'none';

}

function showPatientForm() {
    document.getElementById('patientForm').style.display = 'block';
    
}

function showDoctorForm() {
    document.getElementById('doctorForm').style.display = 'block';
}

async function createPatient(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const patientData = {
        nom: document.getElementById('patientNom').value,
        prenom: document.getElementById('patientPrenom').value,
        email: document.getElementById('patientEmail').value,
        mdp: document.getElementById('patientMdp').value,
        num: document.getElementById('patientNum').value,
        nas: document.getElementById('patientNas').value,
        sexe: document.getElementById('patientSexe').value,
        role: 'Patient'
    };

    try {
        const response = await fetch('http://localhost:5000/users/ajouter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(patientData)
        });

        if (response.ok) {
            alert('Patient créé avec succès');
            window.location.reload(); // Recharger la page pour afficher le nouveau patient
        } else {
            alert('Erreur lors de la création du patient');
        }
    } catch (error) {
        console.error('Erreur lors de la création du patient:', error);
    }
}

async function createDoctor(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const doctorData = {
        nom: document.getElementById('doctorNom').value,
        prenom: document.getElementById('doctorPrenom').value,
        email: document.getElementById('doctorEmail').value,
        mdp: document.getElementById('doctorMdp').value,
        specialisation: document.getElementById('doctorSpecialisation').value,
        num: document.getElementById('doctorNum').value,
        nas: document.getElementById('doctorNas').value,
        sexe: document.getElementById('doctorSexe').value,
        departement: document.getElementById('departmentSelect').value,
        role: 'Doctor'
    };

    try {
        const response = await fetch('http://localhost:5000/users/ajouter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(doctorData)
        });

        if (response.ok) {
            alert('Docteur créé avec succès');
            window.location.reload(); // Recharger la page pour afficher le nouveau docteur
        } else {
            alert('Erreur lors de la création du docteur');
        }
    } catch (error) {
        console.error('Erreur lors de la création du docteur:', error);
    }
}






// Fonction pour supprimer un rendez-vous
async function deleteUser(UserId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:5000/users/${UserId}`, {
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
    window.location.href = 'connexion.html'; // Remplacez 'connexion.html' par l'URL de votre page de connexion
});
