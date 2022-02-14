class query{
    getUser(info){
        queryString=`Select * From user where username='${info.unsername}'and password='${info.password}'`;
        return queryString
    }
    getListing(info){
        queryString = `select * from listings where state = 'published' order by id desc limit 30`
        return queryString
    }
}

module.exports = new query();
