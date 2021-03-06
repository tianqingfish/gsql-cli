#!/usr/bin/env node

const {program} = require('commander');
program.version(require('./package.json').version, '-v, --version');
const inquirer = require('inquirer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

const { pullTemplate } = require('./templates');

const Inquirer = [
  {
    name: 'name',
    message: 'what\'s the name of new solution?'
  },
  {
    name: 'description',
    message: 'what\'s the description of the solution?'
  },
  {
    name: 'author',
    message: 'who is the author?',
    default: 'tigergraph'
  }
];

program.command('init').description('init application').action((name, opts) => {
  inquirer.prompt(Inquirer)
  .then((ret) => {
    const projectPath = path.join('./', ret.name);
    fs.mkdirSync(ret.name);

    // install template
    pullTemplate(projectPath, 'tigergraph-solution-template', ret).then(() => {
      // init git & set init.sh excutable
      exec(`cd ${projectPath} && chmod 777 init.sh && git init`, (err) => {
        if (err) {
          console.error('error:', err);
        } else {
          const task = exec(`cd ${projectPath} && ./init.sh`, (err) => {
            if (err) {
              console.error('error:', err);
            }
          })
          task.stdout.on('data', chunk => {
            console.log(chunk);
          })
        }
      })
    });
  });
})

program.parse(process.argv);