'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const chalk = require('chalk');
const inquirer = require('inquirer');
const validateProjectName = require('validate-npm-package-name');

const unlink = util.promisify(fs.unlink);

async function create(projectName, options) {
  const cwd = options.cwd || process.cwd();
  const inCurrent = projectName === '.';
  const name = inCurrent ? path.relative('../', cwd) : projectName;
  const targetDir = path.resolve(cwd, projectName || '.');

  const result = validateProjectName(name);
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`));
    result.errors && result.errors.forEach((err) => {
      console.error(chalk.red(err));
    });
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await unlink(targetDir);
    } else {
      if (inCurrent) {
        const {
          ok
        } = await inquirer.prompt([{
          name: 'ok',
          type: 'confirm',
          message: `Generate project in current directory?`
        }]);
        if (!ok) {
          return;
        }
      } else {
        const {
          action
        } = await inquirer.prompt([{
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
          choices: [{
            name: 'Overwrite',
            value: 'overwrite'
          }, {
            name: 'Merge',
            value: 'merge'
          }, {
            name: 'Cancel',
            value: false
          }]
        }]);
        if (!action) {
          return;
        } else if (action === 'overwrite') {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
          await unlink(targetDir);
        }
      }
    }
  }
  console.log(targetDir);
  // const creator = new Creator(name, targetDir, getPromptModules());
  // await creator.create(options);
};

module.exports = create;
