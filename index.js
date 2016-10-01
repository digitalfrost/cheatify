#!/usr/bin/env node

var fs = require('fs');

var  noData = "Could not find cheatsheet data to convert";

try {
    fs.statSync('html');
} catch(error) {
    fs.mkdirSync('html');
}

try { fs.accessSync('data');
      var dataFiles = fs.readdirSync('data');
      if (dataFiles.length > 0){

	  //remove temp files
	  dataFiles = dataFiles.filter(function(element){
	      return element.slice(-4) == ".txt"
	  });

	  for (i in dataFiles){
	      var html = '<link rel="import"  href="https://polygit2.appspot.com/components/polymer/polymer.html"><dom-module id="cheat-';

	      //TODO deal with file names that have spaces, and special characters
	      var elementName = dataFiles[i].slice(0,-4);
	      html = html.concat(elementName);
	      html = html.concat('"><template>');

	      var dataLines = fs.readFileSync('data/'+dataFiles[i]).toString().split('\n');
	      dataLines  = dataLines.filter(function(element){
		  return element !== "";
	      }); //remove empty lines
	      var titleLine = dataLines.shift();
	      var titleData = titleLine.split('|');
	      var title = titleData[0];
	      var displayTitle =titleData[1];
	      html = html.concat('<h1');
	      if (['yes', 'Yes', 'True', 'true', '1'].includes(displayTitle)){
		  html = html.concat('>');
	      } else {
		  html = html.concat(' style="display:none;">');
	      }	      
	      html = html.concat(title);
	      html = html.concat('</h1><ul>');
	      for (j in dataLines){
		  var data = dataLines[j].split('|');
		  var priority = data[0];
		  var command = data[1];
		  var description = data[2];
		  html = html.concat('<li class="priority-'+priority+'">');
		  html = html.concat('<span class="command">'+command+'</span>');
		  html = html.concat('<span class="description">'+description+'</span>');
		  html = html.concat('</li>');
	      }
	      html = html.concat('</ul>')

	      html = html.concat('</template><script>Polymer({ is: "cheat-'+ elementName + '"});</script></dom-module>');


	      var fileTitle = dataFiles[i].slice(0,-4)+".html";
	      //TODO: check if creates file if doesn't exist
	      fs.writeFileSync("html/"+fileTitle, html);

	  }
	  console.log('All files converted');
      } else {
	  console.log(noData);
      }
} catch(error) {
    console.log(noData);
}
