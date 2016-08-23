/** Dependencies **/
const fs = require('fs');
const md5 = require('md5');
const exec = require('child_process').exec;
const Promise = require('bluebird');

/** Helper Variables **/
const dockerVolumeDir = '/usr/src/app';
// const dockerRunCmd = 'docker run --rm -t --name';
const dockerRunCmd = 'docker run -t --name';
const dockerVolume = `-v ${__dirname + '/../temp'}:${dockerVolumeDir}`;

/** Helper Functions **/
/**
 * Returns the docker image name required for running `language`
 *
 * @param  {string} language Language to be run
 * @return {string}          Image to use
 */
const image = language => {

  switch (language) {
  case 'python': return 'python';
  case 'ruby': return 'ruby';
  case 'node': return 'node';
  case 'c': return 'gcc';
  default: throw new DockerError(`${language} is not a supported language`);
  }
};

/**
 * Returns the docker command to run for evaluating `filename` with `language`
 *
 * @param  {string} language Language to be run
 * @param  {string} filename Name of file to be evaluated
 * @return {cmd}             Command string for Docker to use
 */
const cmd = (language, filename) => {
  switch (language) {
  case 'python': return `python ${dockerVolumeDir}/${filename}`;
  case 'ruby': return `ruby ${dockerVolumeDir}/${filename}`;
  case 'node': return `node ${dockerVolumeDir}/${filename}`;
  case 'c': return `gcc ${dockerVolumeDir}/${filename}.c -o ${filename} && ./${filename}`;
  case 'java': return `java ${dockerVolumeDir}/${filename}`;
  default: throw new DockerError(`${language} is not a supported language.`);
  }
};

/** Export Function **/
/**
 * Spins up a docker container intended to run `language`
 * and evaluates `content`
 *
 * @async
 * @param  {string}   language Intended language
 * @param  {string}   content  Language contents
 * @param  {Function} done     Callback function
 * @return {Promise<Object>}   Promise containing an object with two properties: `stdout` and `stderr`
 */
module.exports = (language, content) => {
  console.log(content);
  let filename = md5(content);
  let filepath = __dirname + '/../temp/' + filename;

  if (language === 'c') {
    filepath += '.c';
  }

  /*
    Name the file per usual, but add .java


  */

  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, err => {
      if (err) { reject(err); }
      /* "docker run --rm -t --name hashFileName -v /../temp:/usr/src/app python python usr/src/app/hashFileName" */
      let cmdString = [dockerRunCmd, filename, dockerVolume, image(language), cmd(language, filename)].join(' ');

      setTimeout(function() {
        exec(`docker rm -f ${filename}`);
      }, 10000);

      exec(cmdString, (err, stdout, stderr) => {
        resolve({stdout: stdout.trim(), stderr});
        fs.unlink(filepath, err => {
          if (err) { console.log(err); }
        });
      });
    });
  });
};
