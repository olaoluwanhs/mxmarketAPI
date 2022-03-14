class query {
  // Create New user from the signUp form.
  createUser({
    password,
    confirm,
    firstname,
    LastName,
    userName,
    email,
    location,
    phoneNumber,
    whatsApp,
  }) {
    // Create query string
    let queryString = `insert into users values(DEFAULT,'${firstname}','${LastName}','${userName}','${password}','${email}','${phoneNumber}','${whatsApp}','${location}')`;
    return queryString;
  }
  // Create a listing
  createListing(info) {
    let queryString = `insert into user`;
    return queryString;
  }
}

module.exports = new query();
