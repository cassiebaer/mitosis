/** Dependencies **/
const fs = require('fs');
const md5 = require('md5');
const exec = require('child_process').exec;
const Promise = require('bluebird');

/** Helper Variables **/
const dockerVolumeDir = '/usr/src/app';
const dockerRunCmd = 'docker run --rm -t';
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
  let filename = md5(content);
  let filepath = __dirname + '/../temp/' + filename;

  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, err => {
      if (err) { reject(err); }
      /* "docker run --rm -t -v /../temp:/usr/src/app python python usr/src/app/hashFileName" */
      let cmdString = [dockerRunCmd, dockerVolume, image(language), cmd(language, filename)].join(' ');

      exec(cmdString, (err, stdout, stderr) => {
        fs.unlink(filepath, err => {
          if (err) { reject(err); }
          resolve({stdout: stdout.trim(), stderr});
        });
      });
    });
  });
};
