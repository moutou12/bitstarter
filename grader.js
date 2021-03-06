#!/usr/bin/env node
/*Authomatically grade files for the presence of specified HTML tags/abbributes.
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var outfile = "";

/*var getUrl = function(url){
       rest.get(url).on('complete', function(response){
          console.log(response);
      });
    };

*/
var assertFileExists = function(infile) {
   var instr = infile.toString();
   if(!fs.existsSync(instr)) {
       console.log("%s does not exist. Exiting.", instr);
       process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
   }
   return instr;
};


var cheerioHtmlFile = function(htmlfile) {
      return cheerio.load(fs.readFileSync(htmlfile));
};

var cheerioUrl = function(url) {
      return cheerio.load(url);
};

var loadChecks = function(checksfile) {
      return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
   $ = cheerioHtmlFile(htmlfile);
   var checks = loadChecks(checksfile).sort();
   var out = {};
   for(var ii in checks) {
      var present = $(checks[ii]).length > 0;
      out[checks[ii]] = present;
   }
   return out;
};

var checkUrl = function(url, checksfile) {
   $ = cheerioUrl(url);
   var checks = loadChecks(checksfile).sort();
   var out = {};
   for(var ii in checks) {
      var present = $(checks[ii]).length > 0;
      out[checks[ii]] = present;
   }
   return out;
};

var clone = function(fn) {
   //Workaround for command.js.issue.
   //http:stackoverflow.com/a6772648
   return fn.bind({});
};

if(require.main == module) {
   program
     .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
     .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
     .option('-u, --url  <url>', 'URL to index.html')
     .parse(process.argv);
   if (program.url != null) {
        rest.get(program.url).on('complete', function(result){
          if (result instanceof Error) {
               console.log("Error getting URL");
           }
          else {
              var checkJson = checkUrl(result, program.checks);
              var outJson = JSON.stringify(checkJson, null, 4);
              console.log(outJson);

           }
       });      

    }
    else {
       var checkJson = checkHtmlFile(program.file, program.checks);
       var outJson = JSON.stringify(checkJson, null, 4);
       console.log(outJson);
    }
 }
 else {
   exports.checkHtmlFile = checkHtmlFile;
}
