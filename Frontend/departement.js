document.addEventListener('DOMContentLoaded', loadDepartments);

document.getElementById('toggleFormButton').addEventListener('click', function() {
    const formContainer = document.getElementById('deptFormContainer');
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block';
        this.textContent = 'Masquer le formulaire';
    } else {
        formContainer.style.display = 'none';
        this.textContent = 'Ajouter un département';
    }
});

document.getElementById('deptForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const nom = document.getElementById('nom').value;
    const description = document.getElementById('description').value;
    const id = document.getElementById('deptId').value; // Récupérer l'ID du département

    const method = id ? 'PUT' : 'POST'; // Choisir la méthode selon la présence d'un ID
    const url = id ? `http://localhost:5003/dept/${id}` : 'http://localhost:5003/dept';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nom, description })
        });

        if (response.ok) {
            alert('Département ' + (id ? 'modifié' : 'ajouté') + ' avec succès!');
            document.getElementById('deptForm').reset();
            document.getElementById('deptId').value = ''; // Réinitialiser l'ID
            document.getElementById('toggleFormButton').click(); // Masquer le formulaire après soumission
            loadDepartments(); // Recharger la liste après ajout ou modification
        } else {
            const errorData = await response.json();
            alert('Erreur: ' + errorData.message);
        }
    } catch (error) {
        alert('Erreur de connexion au serveur.');
    }
});

async function loadDepartments() {
    try {
        const departementResponse = await fetch('http://localhost:5003/dept/departements');
        const depts = await departementResponse.json();

        const deptList = document.getElementById('deptList');
        deptList.innerHTML = ''; // Nettoyer la liste avant de la remplir

        depts.forEach(dept => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.innerHTML = `
                <strong>${dept.nom}</strong> ${dept.description}
                <button class="btn btn-warning btn-sm" onclick="editDepartment('${dept._id}', '${dept.nom}', '${dept.description}')">Modifier</button>
                <button class="btn btn-danger btn-sm" onclick="deleteDepartment('${dept._id}')">Supprimer</button>
            `;
            deptList.appendChild(listItem);
        });
    } catch (error) {
        alert('Erreur de chargement des départements.');
    }
}

function editDepartment(id, nom, description) {
    document.getElementById('nom').value = nom;
    document.getElementById('description').value = description;
    document.getElementById('deptId').value = id; // Stocker l'ID du département à modifier
    document.getElementById('toggleFormButton').click(); // Afficher le formulaire si caché
}

async function deleteDepartment(departmentId) {
    try {
        const response = await fetch(`http://localhost:5003/dept/${departmentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Département supprimé avec succès!');
            loadDepartments(); // Recharger la liste après suppression
        } else {
            alert('Erreur lors de la suppression du département.');
        }
    } catch (error) {
        alert('Erreur de connexion au serveur.');
    }
}
