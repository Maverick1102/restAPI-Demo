const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

let employee = new Object();
employee["1234567"] = ["John", "Cena", "CEO"]
employee["1029384"] = ["Jason", "Smith", "Admin"]


let record = new Object();
record["1234567"] = "Status : Allowed"
record["1029384"] = "Status : Not Allowed"

//Get employee record
app.get("/records", (req, res) => {
    
    //verify employee exists
    if (record[req.headers.ssn] === undefined){
        res.status(404).send({"msg":"Employee not found. Please implement security measure."})
        return;
    }

    //Verify number matches name 
    if(req.headers.firstname == employee[req.headers.ssn][0] && req.headers.lastname == employee[req.headers.ssn][1]){
        if (req.body.reasonforvisit === "update server") {
            //retun employee records
            res.status(200).send(record[req.headers.ssn]);
            return;
        }
        else{
            //return error
            res.status(501).send({"msg":"unable to complete request" + req.body.reasonforvisit});
            return;
        }
    }
    else{
        res.status(401).send({"msg":"First Name / Last Name do not match SSN. Please implement security measure."})
        return;
    }

    //Return proper record
    res.status(200).send({"msg": "HTTP GET - SUCCESS"})
});


//new employee
app.post("/", (req, res) => {
    //employee database
    employee[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.headers.position];
    res.status(200).send(employee)
});


//update existing position number
app.put("/", (req, res) => {

    //verify employee exists
    if (record[req.headers.ssn] === undefined){
        res.status(404).send({"msg":"employee not found"})
        return;
    }

    //Verify number matches name 
    if(req.headers.firstname == employee[req.headers.ssn][0] && req.headers.lastname == employee[req.headers.ssn][1]){
        //update Position number and return employee info
        employee[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.body.position];
        res.status(202).send(employee[req.headers.ssn]);
        return;
    }
    else{
        res.status(401).send({"msg":"first or last didnt match SSN (Security Breach Detected.)"})
        return;
    }

    //make sure employee exists
    res.status(200).send({"msg": "HTTP PUT - SUCCESS"})
});


//delete records
app.delete("/", (req, res) => {

    //verify employee exists
    if (record[req.headers.ssn] === undefined){
        res.status(404).send({"msg":"employee not found"})
        return;
    }

    //Verify number matches name 
    if(req.headers.firstname == employee[req.headers.ssn][0] && req.headers.lastname == employee[req.headers.ssn][1]){
        //Delete employee records from database

        delete employee[req.headers.ssn]
        delete record[req.headers.ssn]

        res.status(200).send(employee);
        return;
    }
    else{
        res.status(401).send({"msg":"first or last didnt match SSN, Employee non-existent (Pending delete)"})
        return;
    }

    res.status(200).send({"msg": "HTTP DELETE - SUCCESS"})
});


app.listen(2000);
