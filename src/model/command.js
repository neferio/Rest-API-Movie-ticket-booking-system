const booking=require("./queries");

// Deleting expired tickets automatically at every 15 min interval

const delete_expire = ()=>{
    booking.del_expire();
}

setInterval(delete_expire, 60*60*1000);




// Adding new entries

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
          message: "Nothing send here"
        });
    }

    //for checking expiry

    var today = new Date();
    
    let time= today.getHours()*60*60  + today.getMinutes()*60  + today.getSeconds();
    let str=req.body.start_at;
    let varx=str.split(":");
    let total=(parseInt(varx[0])*60*60) + (parseInt(varx[1])*60) + parseInt(varx[2])
    total=total-time;
    let exp=false;
    
    total=Math.abs(total)
    console.log(total);
    if(total<=28800 ){
        exp=true;
    }
    
   
    const ticket = new booking({
        id:req.body.id,
        name: req.body.name,
        phn: req.body.phn,
        //start_at:time,
        //end_at:end
        start_at:req.body.start_at,
        expired:exp
        
      });
    
      // Save Customer in the database
      booking.create(ticket, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the booking for customer."
          });
        else res.send(data);
      });

};

//Updating the ticket time using obtained Id

exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    //function 

    booking.updateById(
      req.params.id,
      new booking(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found ticket with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating ticket with id " + req.params.id
            });
          }
        } else res.send("Done updating of this id "+req.params.id+" booked now at "+ data.start_at);
      }
    );
};

//Finding All the id at particular time

exports.findall= (req,res)=>{
    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
    }
    booking.findAll(req.body.start_at,(err,data)=>{
        if(err){
                if (err.kind === "not_found") {
                    res.status(404).send({
                    message: `Not found ticket at ${req.body.start_at}.`
                    })
                }
                else {
                    res.status(500).send({
                      message: "Error retrieving ticket with at " + req.body.start_at
                    })
                }
        }
        else res.send(data);



    })
}

//Find Customer details of particular id

exports.findone = (req,res)=>{
    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
    }
    booking.findbyid(req.params.id,(err,data)=>{
        if(err){
            if (err.kind === "not_found") {
                res.status(404).send({
                message: `Not found ticket with id ${req.params.id}.`
                })
            }
            else {
                res.status(500).send({
                  message: "Error retrieving ticket with id" + req.params.id
                })
            }
            }
            else res.send(data);
    })
}

//Delete record 

exports.deleteone=(req,res)=>{
    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
    }
    booking.delete(req.params.id,(err,data)=>{
        if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found ticket with id ${req.params.id}.`
              });
            } else {
              res.status(500).send({
                message: "Could not delete ticket with id " + req.params.id
              });
            }
          } else res.send({ message: `ticket was deleted successfully!` });
    })
}