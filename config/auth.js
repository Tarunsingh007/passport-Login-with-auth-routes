auth={
    isauth:(req,res,next)=>{
        if(req.isAuthenticated())
            next();
        else{
            res.redirect("/api/login");
        }
    },
    isLoggedIn:(req,res,next)=>{
        if(req.user)
        next();
        else
        {
            res.redirect("/api/login")
        }
    }
}
module.exports=auth;