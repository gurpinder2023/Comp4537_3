const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const {getDate} = require('./modules/utils');
const {message} = require('./lang/en/en');
const port = process.env.PORT || 3000;


// Function to append text into the file
const writeFile = (filepath, text) => {
    fs.appendFile(filepath, text + '\n', err => {
        if(err){
            console.log('Error writing to file');
        }
    });
}

// Function to read from the file
const readFile = (filepath, res) => {
    fs.readFile(filepath, 'utf8', (err, data) =>{
        if(err){
            res.writeHead(404, {'Content-Type' : 'text/html'});
            res.end(`<div style="color:red; font-size: 20px"> 404 File not found: ${filepath}</div>`);
            return;
        }
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(`<div style="color:blue; font-size: 20px">${data}</div>`);
    });
};

// creating the server that runs on port 3000 for the local host
const server = http.createServer((req,res) => {
    const query = url.parse(req.url,true).query; // query to get the object form of the query string.
    const pathname = url.parse(req.url, true ).pathname; // query to get the path after the domain name.
    
    const fileName = path.basename(pathname);
    const filePath = `./${fileName}`;

    // checking the url of the website and if it match with the endpoint showing the name and the time of the servers
    if(req.url.startsWith('/COMP4537/lab3/getDate')){
        const name = query.name || 'Guest';
        const date = getDate();
        const msg = message.replace('%1',name).replace('%2',date);// getting the string from the en.js

        res.writeHead(200, {'Content-type':'text/html'});
        res.end(`<div style = "color:blue; font-size: 20px"> ${msg} </div>`);

    }
    // checking the url of the website and if it match with the endpoint then writing the text from the url into the txt file
    else if(req.url.startsWith('/COMP4537/lab3/writeFile')){
        const text = query.text || '';
        writeFile('./file.txt', text);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<div style="color:blue; font-size: 20px">Text appended: ${text}</div>`);
    }
    // 
    else if(req.url.startsWith('/COMP4537/lab3/readFile')){
        readFile(filePath, res);
    }

    else{
        res.writeHead(404, {'Content-type':'text/html'});
        res.end(`<div style = "color:red; font-size: 20px"> Invalid Request </div>`);
    }
    
    
});

server.listen(port, () =>{
    console.log('Server is running on port 3000');
})