// SignupValidation.js

export default function SignupValidation(username, email, password, password2) {
    let errors = {};

    // Username validation
    if (!username) {
        errors.username = "Username should not be empty";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.email = "Email should not be empty";
    } else if (!emailRegex.test(email)) {
        errors.email = "Invalid email format";
    }

    // Password strength validation
    if (!password) {
        errors.p_strength = "Password should not be empty";
    } else if (password.length < 10) {
        errors.p_strength = "Password should be at least 10 characters long";
    }

    // Password match validation
    if (password !== password2) {
        errors.p_match = "Passwords do not match";
    }

    return errors;
}
