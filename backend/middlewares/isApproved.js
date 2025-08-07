const ServiceProvider = require("../models/ServiceProvider");

module.exports = async(req, res, next) => {
    const serviceProvider = await ServiceProvider.findOne({ user: req.user._id});

    if(serviceProvider.isApproved){
        next();
    }
    else{
        return res.status(403).json({message: "Service Provider is not approved"});
    }
}