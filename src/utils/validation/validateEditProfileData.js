function validateEditProfileData(req){
    const ALLOWED_UPDATES = ["firstName","lastName","age","gender","skills","photoUrl","about"];
    const updates = Object.keys(req.body);
    const isUpdateAllowed = updates.every(field => ALLOWED_UPDATES.includes(field));
    return isUpdateAllowed;
}

module.exports = {validateEditProfileData}