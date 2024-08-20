document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    const email = document.getElementById('email').value;
    const mdp = document.getElementById('mdp').value;
    console.log("Email:", email);
    console.log("Password:", mdp);

    try {
        const response = await fetch('http://localhost:5000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, mdp })
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Error data:", errorData);
            alert(errorData.message || "Erreur lors de la connexion");
            return;
        }

        const data = await response.json();
        console.log("Response data:", data);

        if (data.success) {
            const user = data.data;
            // Stocker le token et d'autres informations utilisateur dans localStorage
            localStorage.setItem('token', data.token); // <-- Ajoutez cette ligne
            localStorage.setItem('userId', user._id); // <-- Ajoutez cette ligne pour stocker l'ID utilisateur
            localStorage.setItem('userName', user.nom);
            localStorage.setItem('userPrenom', user.prenom);
            localStorage.setItem('userNas', user.nas);
            localStorage.setItem('userNum', user.num);
            localStorage.setItem('userRole', user.role);

            switch (user.role) {
                case 'Patient':
                    window.location.href = 'TPatient.html';
                    break;
                case 'Doctor':
                    window.location.href = 'TDoctor.html';
                    break;
                case 'Admin':
                    window.location.href = 'TAdmin.html';
                    break;
                case 'Infirmier':
                    window.location.href = 'TInfirmier.html';
                        break;
                default:
                    alert('Rôle utilisateur non reconnu');
            }
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error during fetch:", error);
        alert("Erreur lors de la connexion");
    }
});
