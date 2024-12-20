
document.addEventListener("DOMContentLoaded", () => {
    const appointmentsList = document.getElementById("appointments-list");
    const logoutButton = document.getElementById("logout-button");

    // Fetch the logged-in doctor from sessionStorage
    const loggedInDoctor = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!loggedInDoctor || loggedInDoctor.role !== "doctor") {
        alert("Unauthorized access!");
        window.location.href = "login.html";
        return;
    }

    // Display the logged-in doctor's name in the header
    const doctorNameHeader = document.createElement("h2");
    doctorNameHeader.textContent = `Welcome, ${loggedInDoctor.name}`;
    document.body.insertBefore(doctorNameHeader, document.querySelector("main"));

    // Logout functionality
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("loggedInUser"); 
        window.location.href = "login.html"; // Redirect to login page
    });

    // Load appointments specific to this doctor
    function loadAppointments() {
        appointmentsList.innerHTML = "<p>Loading appointments...</p>";

        // Fetch appointments from db.json
        fetch("db.json")
            .then(response => response.json())
            .then(data => {
                const appointments = data.appointments;

                // Filter appointments for the logged-in doctor
                const doctorAppointments = appointments.filter(app => app.doctorId === loggedInDoctor.id);

                // Clear the list
                appointmentsList.innerHTML = "";

                if (doctorAppointments.length === 0) {
                    appointmentsList.innerHTML = "<li>No appointments available.</li>";
                } else {
                    doctorAppointments.forEach(appointment => {
                        const li = document.createElement("li");
                        li.innerHTML = `
                            <strong>Patient:</strong> ${appointment.patientName}<br>
                            <strong>Date:</strong> ${appointment.date}<br>
                            <strong>Status:</strong> ${appointment.status}<br>
                            <button class="accept">Accept</button>
                            <button class="cancel">Cancel</button>
                            <button class="edit">Edit</button>
                        `;

                        // Add functionality to buttons
                        li.querySelector(".accept").addEventListener("click", () => updateAppointmentStatus(appointment, "Accepted"));
                        li.querySelector(".cancel").addEventListener("click", () => updateAppointmentStatus(appointment, "Cancelled"));
                        li.querySelector(".edit").addEventListener("click", () => editAppointment(appointment));

                        appointmentsList.appendChild(li);
                    });
                }
            })
            .catch(error => console.error("Error loading appointments:", error));
    }

    // Update appointment status
    function updateAppointmentStatus(appointment, status) {
        fetch("db.json")
            .then(response => response.json())
            .then(data => {
                const updatedAppointments = data.appointments.map(app =>
                    app.id === appointment.id ? { ...app, status: status } : app
                );

                // Save updated appointments to localStorage
                localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

                alert(`Appointment status updated to: ${status}`);
                loadAppointments();
            })
            .catch(error => console.error("Error updating appointment status:", error));
    }

    // Edit appointment
    function editAppointment(appointment) {
        const newDate = prompt("Enter a new date (YYYY-MM-DD):", appointment.date);
        if (newDate) {
            fetch("db.json")
                .then(response => response.json())
                .then(data => {
                    const updatedAppointments = data.appointments.map(app =>
                        app.id === appointment.id ? { ...app, date: newDate } : app
                    );

                    // Save updated appointments to localStorage
                    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

                    alert("Appointment date updated successfully.");
                    loadAppointments();
                })
                .catch(error => console.error("Error updating appointment date:", error));
        }
    }

    // Load appointments on page load
    loadAppointments();
});
