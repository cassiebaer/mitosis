const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Command Line via Node Child Process
const exec = require('child_process').exec;

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

// Sample incoming message:
const incomingMessage = {
  user: 'http://www.fluidio.com',

  language: 'python',
  type: 'string', // file
  query: "print('hello')"
};

const extensions = {
  python: 'py',
  c: 'c',
};

// Routes

// TODO: Change app.get to app.post
app.get('/', (req, res) => {

  const language = incomingMessage.language;
  const type = incomingMessage.type;
  const query = incomingMessage.query;

  const random = Math.round((Math.random() * (100 - 1) + 1)).toString(); // 1-99
  // TODO: implement better way to avoid duplicate files
  // TODO: think about a way to avoid the problem of compiling languages that create new files
  // Perhaps by building out randomnlynamed folders, compiling there, then deleting the folder

  const codeFile = `${random}.${extensions[language]}`;

  if (type === 'string') {
    // TODO: add docker run ${language} ${language} to spin up container of image then run the compiler too
    exec(`echo "${query}" > ${codeFile} && ${language} ${codeFile} && rm ${codeFile}`, (err, output) => {
      if (err) {
        console.log(err);
      } else {
        console.log(output);
      }
    });
  } else {
    exec(`${language} ${query}`, (err, output) => {
      if (err) {
        console.log(err);
      } else {
        console.log(output);
        // TODO: res.send() the results back to the client
      }
    });
  }
});

module.exports = app;
