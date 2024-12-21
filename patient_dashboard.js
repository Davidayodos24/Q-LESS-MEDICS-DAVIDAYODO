 document.addEventListener("DOMContentLoaded", () => {
    const selectDoctor = document.getElementById("select-doctor");

    // Fetch doctors and populate dropdown
    fetch("db.json")
        .then(response => response.json())
        .then(data => {
            const doctors = data.doctors;

            // Avoid unnecessary repopulation
            if (selectDoctor.childElementCount === doctors.length) {
                return;
            }

            doctors.forEach(doctor => {
                const option = document.createElement("option");
                option.value = doctor.id;
                // option.textContent = `${doctor.name} (${doctor.specialty})`;
                option.textContent = `${doctor.name} (${doctor.specialty}, ${doctor.hospital})`;
                selectDoctor.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading doctors:", error));
});
