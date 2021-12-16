#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

import files from './lib/files.js';
import github from './lib/github.js';
import repo from './lib/repo.js';

clear();

console.log(
    chalk.greenBright(
        figlet.textSync('SuperGit', { horizontalLayout: 'full' })
    )
);

if (files.directoryExists('.git')) {
    console.log(chalk.redBright('Already a Git repository!'));
    process.exit();
};

const getGithubToken = async () => {
    // Fetch token from config store
    let token = github.getStoredGithubToken();
    if (token) {
        return token;
    }

    token = await github.getPersonalAccessToken();

    return token;
}

const run = async () => {
    try {
        // Retrieve & set auth token
        const token = await getGithubToken();
        github.githubAuth(token);

        // Create remote repo
        const url = await repo.createRemoteRepo();

        // Create .gitignore
        await repo.createGitIgnore();

        // Setup local repo and push to remote
        await repo.setupRepo(url);

        console.log(chalk.greenBright('All done!'));
    } catch(err) {
        if (err) {
            switch (err.status) {
                case 401:
                    console.log(chalk.redBright('Couldn\'t log you in. Please provide correct credentials/token.'));
                    break;
                case 422:
                    console.log(chalk.redBright('There is already a remote repository or token with the same name'));
                    break;
                default:
                    console.log(chalk.redBright(err));
            }
        }
    }
};

run();