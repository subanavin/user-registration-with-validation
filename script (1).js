// DOM Elements
const form = document.getElementById('registrationForm');
const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const mobile = document.getElementById('mobile');
const dob = document.getElementById('dob');
const successMsg = document.getElementById('successMsg');
const togglePassword = document.getElementById('togglePassword');
const themeBtn = document.getElementById('themeBtn');

// Load registrations from localStorage or initialize empty
let registrations = JSON.parse(localStorage.getItem("registrations")) || [];

// Validation Functions (same as your existing code)
function validateName() {
    const regex = /^[a-zA-Z ]+$/;
    if (!fullName.value.match(regex)) {
        setError(fullName, "Name can contain only letters");
        return false;
    }
    setSuccess(fullName);
    return true;
}
function validateEmail() {
    const regex = /^\S+@\S+\.\S+$/;
    if (!email.value.match(regex)) {
        setError(email, "Enter a valid email");
        return false;
    }
    setSuccess(email);
    return true;
}
function validatePassword() {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (!password.value.match(regex)) {
        setError(password, "Password must be 8+ chars, include number & special char");
        return false;
    }
    setSuccess(password);
    return true;
}
function validateConfirmPassword() {
    if (confirmPassword.value !== password.value || confirmPassword.value === "") {
        setError(confirmPassword, "Passwords do not match");
        return false;
    }
    setSuccess(confirmPassword);
    return true;
}
function validateMobile() {
    const regex = /^\d{10}$/;
    if (!mobile.value.match(regex)) {
        setError(mobile, "Mobile number must be 10 digits");
        return false;
    }
    setSuccess(mobile);
    return true;
}
function validateDOB() {
    if (dob.value === "") {
        setError(dob, "Date of Birth is required");
        return false;
    }
    setSuccess(dob);
    return true;
}

// Set error/success
function setError(element, message) {
    const error = element.nextElementSibling;
    error.innerText = message;
    element.classList.add('invalid');
    element.classList.remove('valid');
}
function setSuccess(element) {
    const error = element.nextElementSibling;
    error.innerText = "";
    element.classList.add('valid');
    element.classList.remove('invalid');
}

// Toggle Password Visibility
togglePassword.addEventListener('click', () => {
    if (password.type === "password") {
        password.type = "text";
        confirmPassword.type = "text";
        togglePassword.innerText = "Hide";
    } else {
        password.type = "password";
        confirmPassword.type = "password";
        togglePassword.innerText = "Show";
    }
});

// Theme Switcher
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// Form Submit
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateName() && validateEmail() && validatePassword() &&
        validateConfirmPassword() && validateMobile() && validateDOB()) {

        // Check duplicate registration
        const duplicate = registrations.find(user => user.email === email.value || user.mobile === mobile.value);
        if (duplicate) {
            alert("User already registered with this email or mobile number!");
            return;
        }

        // Save registration
        const user = {
            fullName: fullName.value,
            email: email.value,
            password: password.value,
            mobile: mobile.value,
            dob: dob.value
        };
        registrations.push(user);

        // Save to localStorage
        localStorage.setItem("registrations", JSON.stringify(registrations));

        // Export to Excel
        exportToExcel();

        // Success message
        successMsg.innerText = "Registered Successfully!";
        form.reset();
        document.querySelectorAll('input').forEach(input => input.classList.remove('valid'));
    }
});

// Export registrations to Excel
function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(registrations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, "registrations.xlsx");
}

// Real-time validation
fullName.addEventListener('input', validateName);
email.addEventListener('input', validateEmail);
password.addEventListener('input', validatePassword);
confirmPassword.addEventListener('input', validateConfirmPassword);
mobile.addEventListener('input', validateMobile);
dob.addEventListener('input', validateDOB);

