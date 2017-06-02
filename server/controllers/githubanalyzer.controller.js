
/**
 * Get all repositories of informed user
 * @param req
 * @param res
 * @returns void
 */
export function getRepos(req, res) {
    const GitHubClient = require('../libs/GitHubClient.js').GitHubClient;

    let githubCliDotCom = new GitHubClient({
        baseUri: "https://api.github.com",
        token: "99c09458d09120f35c0674528c58f279898e82a1"//process.env.TOKEN_GITHUB_DOT_COM
    });

    githubCliDotCom.getData({ path: `/users/${req.params.user}` })
        .then(response => {
            res.json(response.data);
        });
}