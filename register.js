 document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent form submission from reloading the page

        // Get form values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const role = document.getElementById("role").value; // Role: 'doctor' or 'patient'

        // Check if all fields are filled
        if (!name || !email || !password || !role) {
            alert("All fields are required.");
            return;
        }

        // Create a new user object
        const newUser = {
            id: Date.now(), // Unique ID for the user
            name: name,
            email: email,
            password: password,
            role: role // 'doctor' or 'patient'
        };

        // Retrieve existing users from localStorage
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Check if the email is already registered
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            alert("This email is already registered. Please use a different email.");
            return;
        }

        // Add the new user to the users array
        users.push(newUser);

        // Save the updated users array to localStorage
        localStorage.setItem("users", JSON.stringify(users));

        // Confirm registration and redirect to login page
        alert("Registration successful! You can now log in.");
        window.location.href = "login.html"; // Redirect to login page
    });
});
