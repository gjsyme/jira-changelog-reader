var Client = require('node-rest-client').Client;
var client = new Client;

if(process.argv.length != 6){
  console.log('usage: node jiraChangelog.js <server URI> <username> <password> <ticket number in KEY-# format>');
  process.exit(1);
}

var jiraServer = process.argv[2];
var credential = new Buffer(process.argv[3]+":"+process.argv[4]).toString('base64');
var credHeader = "Basic "+credential;
var ticket = process.argv[5];

var args = {
  headers: {"Authorization": credHeader}
}

client.get(jiraServer+"/rest/api/latest/issue/"+ticket+"?expand=changelog", args, function(data, response){
  // console.log(data);
  // console.log(data.changelog.histories);
  console.log('<html>');
  console.log('<table>');
  console.log('<tr><th>Author</th><th>Timestamp</th><th>Old Date</th><th>New Date</th></tr>')
  data.changelog.histories.forEach(function(element, index, array){
    // console.log(element);
    element.items.forEach(function(item, index, array){

      if(item.field==='duedate'){
        // Uncomment this block for readable-ish command line output
        // console.log("Change to Due Date:");
        // console.log("Author: "+element.author.displayName);
        // console.log("Change Timestamp: "+element.created);
        // console.log(item.from+" -> changed to -> "+item.to);

        // Uncomment this block for an HTML table output
        console.log('<tr><td>'+element.author.displayName+'</td>');
        console.log("<td>"+element.created+"</td>");
        console.log("<td>"+item.from+"</td><td>"+item.to+"</td>");
        console.log("</tr>");
      }
    });
  });
  console.log('</table></html>');
});
