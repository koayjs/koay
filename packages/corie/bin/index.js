#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');

function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach((o) => {
    const key = o.long.replace(/^--/, '');
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }
  });
  return args;
}

program
  .version(require('../package.json').version, '-v, --version')
  .usage('<command> [options]');

program
  .command('create <app-name>')
  .description('create a new project powered with corie')
  .option('-d, --cwd <dirname>', 'current work directory')
  .action((name, cmd) => {
    const options = cleanArgs(cmd);
    if (process.argv.includes('-g') || process.argv.includes('--git')) {
      options.forceGit = true;
    }
    require('./create')(name, options);
  });

program
  .on('--help', () => {
    const content = `  Examples:

    $ corie create <app-name>
    $ corie -h
`;
    console.log(chalk.green(content));
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
