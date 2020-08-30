const sql = require("../db/database");

// constructor
const user = function(customer) {
  this.id=customer.id,
  this.name = customer.name;
  this.phn = customer.phn;
  this.start_at=customer.start_at;
  this.expired=customer.expired;
};

// Sql commands for automatic deletion of expired tickets

user.del_expire = ()=>{
  

 
  // Finding all expired records

  sql.query("SELECT * FROM booking where expired=false", (err,res)=>{
    if(err){
      console.log(err);
      return;
    }
    else{

        const box=[];
        box.push(-1);
        var today = new Date();
        let time= today.getHours()*60*60  + today.getMinutes()*60  + today.getSeconds();
        res.forEach( (ele)=> {
        let str=ele.start_at;
        let varx=str.split(":");
        let total=(parseInt(varx[0])*60*60) + (parseInt(varx[1])*60) + parseInt(varx[2])
        total=total-time;
        total=Math.abs(total)
        console.log(total);
        if(total<=28800 ){
          box.push(ele.id)
        }
              //console.log(box)
        })

        sql.query("DELETE FROM booking where expired=true OR id IN (?)",[box],(err,res)=>{
          if(err){
            console.log(err);
          }
          else{
              console.log("things are deleted",res.affectedRows)
          }
        })



      }
  })

   

  

  




}




// Sql commands for creating new users as requested

user.create = (newuser, result) => {
    
  sql.query("INSERT INTO booking SET ?", newuser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created booking : ", { id: res.id, ...newuser });
    result(null, { id: res.id, ...newuser });
  });
};

// Sql commands for updating time 

user.updateById = (id, customer, result) => {

  var today = new Date();
    
  let time= today.getHours()*60*60  + today.getMinutes()*60  + today.getSeconds();
  console.log(time);
  let str=customer.start_at;
  let varx=str.split(":");
  let total=(parseInt(varx[0])*60*60) + (parseInt(varx[1])*60) + parseInt(varx[2])
  console.log(total);
  total=total-time;
  let exp=false;
  if(total<=28800){
    exp=true;
  }

  console.log(total);
  //console.log(exp);

  sql.query(
    "UPDATE booking SET start_at = ?, expired = ? WHERE id = ?",
    [customer.start_at,exp,id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated customer: ", { id: customer.id, ...customer });
      result(null, { id: customer.id, ...customer });
    }
  );
};

// Sql commands for finding all bookings at given time

user.findAll = (time,result)=>{
    sql.query("SELECT * FROM booking WHERE start_at=? and expired=false" ,[time],(err,res)=>{
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.length) {
        console.log("found bookings: ", res);
        result(null, res);
        return;
      }
  
      // not found Customer with the id
      result({ kind: "not_found" }, null)


    })
}

// Sql commands for finding detail of particular id

user.findbyid = (id,result)=>{
    sql.query("SELECT * FROM booking WHERE id=?",[id],(err,res)=>{
        if(err){
          console.log("error",err);
          result(null,err);
          return;
        }
        if(res.length){
          console.log("found booking ",res);
          result(null,res[0]);
          return;
        }
        result({kind:"not found"},null)
    })
}

// Sql commands for deleting a record

user.delete = (id,result)=>{
    sql.query("DELETE FROM booking where id= ? ",[id],(err,res)=>{
      if(err){
        console.log("error",err);
        result(null,err);
        return;
      }
      if(res.affectedRows==0){
          result({kind:"not_found"},null);
      }
      console.log("deleted ticket with id: ", id);
      result(null, res);
    })
}





module.exports=user;