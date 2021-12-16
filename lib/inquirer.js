import inquirer from 'inquirer';
import minimist from 'minimist';
import files from './files.js';

const askGithubCredentials = () => {
    const questions = [
        {
            name: 'PAT',
            type: 'input',
            message: 'Enter your GitHub Personal Access Token:',
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your Personal Access Token';
                }
            }
        }
    ];
    return inquirer.prompt(questions);
};

const askRepoDetails = () => {
    const argv = minimist(process.argv.slice(2));

    const questions = [
        {
            name: 'name',
            type: 'input',
            message: 'Enter a name for the repository:',
            default: argv._[0] || files.getCurrentDirectoryBase(),
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter a name for the repository.';
                }
            }
        },
        {
            name: 'description',
            type: 'input',
            default: argv._[1] || null,
            message: 'Optionally enter a description of the repository:'
        },
        {
            name: 'visibility',
            type: 'list',
            message: 'Public or private:',
            choices: [ 'public', 'private' ],
            default: 'public'
        }
    ];
    return inquirer.prompt(questions);
};

const askIgnoreFiles = (filelist) => {
    const questions = [
        {
            name: 'ignore',
            type: 'checkbox',
            message: 'Select the files and/or folders you wish to ignore:',
            choices: filelist,
            default: [ 'node_modules', 'bower_components' ]
        }
    ];
    return inquirer.prompt(questions);
}

export default { askGithubCredentials, askRepoDetails, askIgnoreFiles }