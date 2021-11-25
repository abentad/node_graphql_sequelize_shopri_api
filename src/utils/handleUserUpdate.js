const handleUserUpdate = (data, originalUser) => {
    const d = {};
    data.deviceToken || data.deviceToken === "" ? d.deviceToken = data.deviceToken : d.deviceToken = originalUser.deviceToken;
    data.username ? d.username = data.username : d.username = originalUser.username;
    data.email ? d.email = data.email : d.email = originalUser.email;
    data.phoneNumber ? d.phoneNumber = data.phoneNumber : d.phoneNumber = originalUser.phoneNumber;
    data.password ? d.password = data.password : d.password = originalUser.password;
    data.profile_image ? d.profile_image = data.profile_image : d.profile_image = originalUser.profile_image;
    data.dateJoined ? d.dateJoined = data.dateJoined : d.dateJoined = originalUser.dateJoined;
    return d;
};

module.exports = handleUserUpdate;