

module.exports = function backToHomePage(statusCode){

  var req = this.req;
  var res = this.res;

  if(req.wantsJSON){
    return res.send(statusCode||200);
  }

  res.redirect('/');
};
