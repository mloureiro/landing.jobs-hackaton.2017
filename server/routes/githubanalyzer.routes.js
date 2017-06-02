import { Router } from 'express';
import * as GitHubAnalyzerController from '../controllers/githubanalyzer.controller';
const router = new Router();

// Get data from github user
router.route('/analyzer/:user/github').get(GitHubAnalyzerController.getUser);

// Get repository list from github user
router.route('/analyzer/:user/repos').get(GitHubAnalyzerController.getRepos);

export default router;
