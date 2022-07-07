const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
const { response } = require("express");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/',function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post('/',function(req,res){
    
    const {firstName, lastName, email} = req.body;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    client.setConfig({
        apiKey: process.env.MAILCHIMP,
        server: process.env.PREFIX,
      });

    
    const run = async () => {
    const response = await client.lists.batchListMembers(process.env.AUDIENCE, jsonData);
    console.log(response);
    };
      
    run();

    if (response.statusCode>=200 || response.statusCode<300){
        console.log(response.statusCode)
        res.sendFile(__dirname+"/success.html");
        
    } else {
        res.sendFile(__dirname+"/failure.html");
    }
    
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
    console.log("Server is running on port 3000");
});

