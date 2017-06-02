import { Router } from 'express';
import * as GitHubAnalyzerController from '../controllers/githubanalyzer.controller';
const router = new Router();

// Get repos from user
router.route('/analyzer/:user/github').get(GitHubAnalyzerController.getRepos);

export default router;
