function Validation(username, password){
    let errors = {}
    
    if(username === ""){
        errors.username = "Username should not be empty";
    } else {
        errors.username = ""
    } 
    // else if () {
    //     error.username = "Username is not found"
    // }
    
    if(password === ""){
        errors.password = "Password should not be empty"
    } else {
        errors.password = ""
    }

    return errors;
}

export default Validation;



