import CLI from 'clui';
import Configstore from 'configstore';
import { Octokit } from '@octokit/rest';
import { createTokenAuth } from '@octokit/auth-token';
import fs from 'fs';

import inquirer from './inquirer.js';
import pkg from '../config.js';

const Spinner = CLI.Spinner;

const conf = new Configstore(pkg.name);

let octokit;

const getInstance = () => {
    return octokit;
};

const getStoredGithubToken = () => {
    return conf.get('github.token');
};

const getPersonalAccessToken = async () => {
    const credentials = await inquirer.askGithubCredentials();
    const status = new Spinner('Authenticating you, please wait...');

    status.start();

    const auth = createTokenAuth(credentials.PAT);

    try {
        const res = await auth();
        if (res.token) {
            conf.set('github.token', res.token);
            return res.token;
        } else {
            throw new Error('GitHub token was not found in the response');
        }
    } catch {
        throw new Error('No Auth response');
    } finally {
        status.stop();
    }
};

const githubAuth = (token) => {
    octokit = new Octokit({
        auth: token
    });
};

export default { getInstance, getStoredGithubToken, getPersonalAccessToken, githubAuth }