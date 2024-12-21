document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

     fetch("db.json")
        .then(response => response.json())
        .then(data => {
            const doctors = data.doctors;
            const doctor = doctors.find(doc => doc.email === email && doc.password === password);

            if (doctor) {
                // Save logged-in doctor to sessionStorage
                sessionStorage.setItem("loggedInUser", JSON.stringify(doctor));
                window.location.href = "dashboard.html"; // Redirect to dashboard
            } else {
                errorMessage.textContent = "Invalid email or password.";
            }
        })
        .catch(error => {
            console.error("Error logging in:", error);
            errorMessage.textContent = "An error occurred. Please try again.";
        });
});
