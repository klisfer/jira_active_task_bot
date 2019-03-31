const dotenv = require("dotenv");
const Bot = (require("@dlghq/dialog-bot-sdk"));
const { flatMap } = require('rxjs/operators');
const axios = require('axios');
const requests = require('requests');

var jsonQ=require("jsonq");

dotenv.config();



const credentials =  process.env.JIRA_USERNAME + ":" + process.env.JIRA_API_TOKEN
const  credsBase64 = Buffer.from(credentials).toString('base64');

const jiraUrl = "https://klisfer.atlassian.net/rest/api/2/issue/";
// console.log(Object.getOwnPropertyNames(Bot));



const inprogressIssues = [];


  
 var headers = {
  'Authorization': 'Basic ' + credsBase64,
  'Content-Type': 'application/json',
  };

  




const token = process.env.BOT_TOKEN;
 if (typeof token !== 'string'){
  throw new Error('BOT_TOKEN env variable not configured');
}






const bot = new Bot.default({
  token,
  endpoints: ['https://grpc-test.transmit.im:9443']
});






bot.updateSubject.subscribe({
  next(update) {
    const updatedMessage = jsonQ(update).find("text").value()
    console.log(updatedMessage.toString());  
    if(updatedMessage.toString() === process.env.TEXT_MESSAGE){
      axios({
        url: 'https://klisfer.atlassian.net/rest/api/2/search?jql=status=%22In+Progress%22',
        method: 'get',
        headers: headers,
        
        })
      .then(response => {  
        console.log(response.data.issues);  
           response.data.issues.map((issue) =>{
                inprogressIssues.push(issue.fields);
           })
         
      }).catch(err => {
        console.log(err);
      });
    }
  }
});


