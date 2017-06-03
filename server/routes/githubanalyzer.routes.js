import { Router } from 'express';
import * as GitHubAnalyzerController from '../controllers/githubanalyzer.controller';
const router = new Router();

// Get data from github user
router.route('/analyzer/:user/github').get(GitHubAnalyzerController.getUser);

// Get repository list from github user
router.route('/analyzer/:user/repos').get(GitHubAnalyzerController.getRepos);

// Get profile score from a github user
router.route('/analyzer/:user/github/score').get(GitHubAnalyzerController.getScore);

// Get social score from a github user
router.route('/analyzer/:user/github/socialscore').get(GitHubAnalyzerController.getSocialScore);

export default router;
