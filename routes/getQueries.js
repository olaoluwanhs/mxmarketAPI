class query{
    getUser({name, password}){
        let queryString=`Select * From users where user_name='${name}'and password='${password}'`;
        return queryString
    }
    getListing({limit}){
        let queryString = `select * from listings where state = 'published' order by id desc limit ${limit}`
        return queryString
    }
    getProfile({username}){
        let queryString = `select first_name, last_name, user_name, email, phone_nuber, whatsapp, location from users where user_name='${username}'`
        return queryString
    }
}

module.exports = new query();
