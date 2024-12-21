 document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("appointment-form");
    const appointmentsList = document.getElementById("appointments-list");
    const selectDoctor = document.getElementById("select-doctor");
    const appointmentLocation = document.getElementById("appointment-location");
    let doctors = [];

    // Fetch doctors and populate the select dropdown
    fetch('http://localhost:3000/doctors')
        .then(response => response.json())
        .then(data => {
            doctors = data;
            doctors.forEach(doctor => {
                const option = document.createElement("option");
                option.value = doctor.name;
                option.textContent = `${doctor.name} (${doctor.specialty})`;
                selectDoctor.appendChild(option);
            });
        });

    // Update location based on selected doctor
    selectDoctor.addEventListener('change', (event) => {
        const selectedDoctor = doctors.find(doctor => doctor.name === event.target.value);
        appointmentLocation.value = selectedDoctor ? selectedDoctor.hospital : '';
    });

    // Function to add a new appointment
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const patientName = document.getElementById("patient-name").value;
        const date = document.getElementById("appointment-date").value;
        const location = appointmentLocation.value;
        const doctorName = selectDoctor.value;

        const appointment = { patientName, date, location, doctorName, status: "Pending" };
        addAppointmentToList(appointment);
        saveAppointmentData(appointment);
        form.reset();
    });

    // Function to display an appointment in the list
    function addAppointmentToList(appointment) {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>Patient:</strong> ${appointment.patientName} <br>
            <strong>Date:</strong> ${appointment.date} <br>
            <strong>Hospital:</strong> ${appointment.location} <br>
            <strong>Doctor:</strong> ${appointment.doctorName} <br>
            <strong>Status:</strong> ${appointment.status} <br>
            <button class="accept">Accept</button>
            <button class="cancel">Cancel</button>
            <button class="delete">Delete</button>
            <button class="bill">M-Pesa Bill</button>
        `;
        li.querySelector('.accept').addEventListener('click', () => updateAppointmentStatus(appointment, "Accepted"));
        li.querySelector('.cancel').addEventListener('click', () => updateAppointmentStatus(appointment, "Cancelled"));
        li.querySelector('.delete').addEventListener('click', () => deleteAppointment(appointment));
        li.querySelector('.bill').addEventListener('click', () => billAppointment(appointment));
        appointmentsList.appendChild(li);
    }

    // Function to update appointment status
    function updateAppointmentStatus(appointment, status) {
        appointment.status = status;
        saveAppointmentData(appointment, true); // true indicates updating existing appointment
        loadAppointments();
    }

    // Function to save appointment data
    function saveAppointmentData(appointment, update = false) {
        let appointments = localStorage.getItem("appointments");
        appointments = appointments ? JSON.parse(appointments) : [];
        if (update) {
            const index = appointments.findIndex(a => a.patientName === appointment.patientName && a.date === appointment.date && a.location === appointment.location);
            appointments[index] = appointment;
        } else {
            appointments.push(appointment);
        }
        localStorage.setItem("appointments", JSON.stringify(appointments));
    }


    

    // Function to delete appointment
    function deleteAppointment(appointment) {
        let appointments = localStorage.getItem("appointments");
        appointments = appointments ? JSON.parse(appointments) : [];
        appointments = appointments.filter(a => !(a.patientName === appointment.patientName && a.date === appointment.date && a.location === appointment.location));
        localStorage.setItem("appointments", JSON.stringify(appointments));
        loadAppointments();
    }

    // Function to bill appointment using M-Pesa
    function billAppointment(appointment) {
        // Implement M-Pesa billing logic here
        alert(`Billing for ${appointment.patientName} with ${appointment.doctorName}`);
    }

    // Load saved appointments on page load
    function loadAppointments() {
        appointmentsList.innerHTML = ''; // Clear the list
        let appointments = localStorage.getItem("appointments");
        if (appointments) {
            appointments = JSON.parse(appointments);
            appointments.forEach(appointment => addAppointmentToList(appointment));
        }
    }

    loadAppointments();
});
