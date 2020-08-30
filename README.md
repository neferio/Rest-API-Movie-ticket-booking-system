# zomentum-backend-siddharth_kandola

REST interface for a movie Theatre ticket booking system

The entire application is contained within the src folder.

# REST API
Given below are the request used to cover various business issues

## Book a ticket

### Request

`POST /book/`

    POST /book/ HTTP/1.1
    Host: localhost:3000
    Content-Type: application/json

    {
        "id":"99",
        "name":"G.O.A.T",
        "phn":"987663",
        "start_at":"09:00:00"

    }

### Successful Response:

    HTTP/1.1 200 OK
    Date: Sat, 29 Aug 2020 17:19:45 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 81
    
    {
    "id": "99",
    "name": "G.O.A.T",
    "phn": "987663",
    "start_at": "09:00:00",
    "expired": false
    }
   
   
### Failed Response:

    HTTP/1.1 500 Internal Server Error
    Date: Sat, 29 Aug 2020 17:31:34 GMT
    Server: Express
    Content-Type: application/json
    Content-Length: 66

    {
    "message": "ER_DUP_ENTRY: Duplicate entry '99' for key 'PRIMARY'"
    }
    
 

## Update Ticket Timing

`PUT /book/:id`

    PUT /book/99 HTTP/1.1
    Host: localhost:3000
    Content-Type: application/json

    {

        "start_at":"10:00:00"

    }

### Successful Response:

    HTTP/1.1 200 OK
    Date: Sat, 29 Aug 2020 17:43:42 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 50
    
    Done updating of this id 99 booked now at 10:00:00
   
### Failed Response:

    HTTP/1.1 404 Not Found
    Date: Sat, 29 Aug 2020 17:48:37 GMT
    Server: Express
    Content-Type: application/json
    Content-Length: 43

    {
    "message": "Not found ticket with id 999."
    }
 
 
## View Tickets For particular time

`GET /book/`

    GET /book/99 HTTP/1.1
    Host: localhost:3000
    Content-Type: application/json

    {

        "start_at":"9:00:00"

    }
    
### Successful Response:

    HTTP/1.1 200 OK
    Date: Sat, 29 Aug 2020 18:00:42 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 157
    [
    {
        "id": 7,
        "name": "siddharth",
        "phn": "987612363",
        "start_at": "09:00:00",
        "expired": 0
    },
    {
        "id": 99,
        "name": "G.O.A.T",
        "phn": "987663",
        "start_at": "09:00:00",
        "expired": 0
    }
    ]
### Failed Response:

    HTTP/1.1 404 Not Found
    Date: Sat, 29 Aug 2020 17:48:37 GMT
    Server: Express
    Content-Type: application/json
    Content-Length: 43

    {
    "message": "Not found ticket at 19:00:00."
     }
 
 
## Delete ticket

`DELETE /book/:id`

    DELETE /book/7 HTTP/1.1
    Host: localhost:3000
    

### Successful Response:

    HTTP/1.1 200 OK
    Date: Sat, 29 Aug 2020 18:05:42 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 46
    
    {
    "message": "ticket was deleted successfully!"
    }
    

### Failed Response:

    HTTP/1.1 404 Not Found
    Date: Sat, 29 Aug 2020 18:48:37 GMT
    Server: Express
    Content-Type: application/json
    Content-Length: 43

    {
    "message": "Not found ticket with id 7."
    }
   
## Find ticket using id

`GET /book/:id`

    GET /book/99 HTTP/1.1
    Host: localhost:3000
    
### Successful Response:

    
    HTTP/1.1 200 OK
    Date: Sat, 29 Aug 2020 18:15:42 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 75
    
       {
        "id": 99,
        "name": "G.O.A.T",
        "phn": "987663",
        "start_at": "09:00:00",
        "expired": 0
        }
    


### Failed Response:

    HTTP/1.1 404 Not Found
    Date: Sat, 29 Aug 2020 18:48:37 GMT
    Server: Express
    Content-Type: application/json
    Content-Length: 43
    {
        "message": "Error retrieving ticket with id999"
    }
   

## Response Codes 
### Response Codes
```
200: Success
400: Bad request
401: Unauthorized
404: Cannot be found
405: Method not allowed
```
### Error Codes Details
```
100: Bad Request
110: Unauthorized
120: User Authenticaion Invalid
130: Parameter Error
```


## Requirements

* npm
* express
* Mysql
* body-parser

### MYSQL database is used for this api

        id -> unique ticket id
        name -> customer name
        phn -> phone number
        start_at -> timings
        expired -> True/False (checking expirey)
        


## Extra 

Automatic Deletion of Records if difference between current time and timings is 8 or less.
Using this - >

        const delete_expire = ()=>{
            booking.del_expire();
        }

        setInterval(delete_expire, 60*60*1000);
        
booking.del_expire called here->
        
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




    

  
