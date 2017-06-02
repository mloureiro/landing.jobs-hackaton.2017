const GitHubClient = require('../libs/GitHubClient.js').GitHubClient;

const githubCliDotCom = new GitHubClient({
  baseUri: 'https://api.github.com',
  token: '99c09458d09120f35c0674528c58f279898e82a1'// process.env.TOKEN_GITHUB_DOT_COM
});

/**
 * Get user basic information
 * @param req
 * @param res
 * @returns void
 */
export function getUser(req, res) {
  const userPromise = Promise.resolve(githubCliDotCom.getData({ path: `/users/${req.params.user}` }));
  const reposPromise = Promise.resolve(githubCliDotCom.getData({ path: `/users/${req.params.user}/repos` }));
  const followersPromise = Promise.resolve(githubCliDotCom.getData({ path: `/users/${req.params.user}/followers` }));

  Promise.all([userPromise, reposPromise, followersPromise])
    .then(result => {
      const user = result[0].data;
      const repos = result[1].data;
      const followers = result[2].data;

      console.log('user=>', user);
      console.log('repos=>', user);
      console.log('followers=>', user);

      const content = {
        login: user.login,
        avatar_url: user.avatar_url,
        url: user.url,
        name: user.name,
        company: user.company,
        blog: user.blog,
        location: user.location,
        email: user.email,
        hireable: user.hireable,
        bio: user.bio,
        updated_at: user.updated_at,
        created_at: user.created_at,
        has_repos: repos.length > 0,
        has_followers: followers.length > 0,
        quantity_repos: repos.length,
        quantity_followers: followers.length,
        repos: repos
          .map((item) => {
            return {
              name: item.name,
              private: item.private
            };
          })
      };

      res.json({
        content,
        status: 'ok',
        links: [
          {
            rel: 'Amazing anazyle #1',
            url: `/analyzer/${req.params.user}/github/analyze1`
          },
        ]
      });
    })
    .catch(error => {
      res.status(500).send(error);
    });
}

/**
 * Get all repositories of informed user
 * @param req
 * @param res
 * @returns void
 */
export function getRepos(req, res) {
  githubCliDotCom.getData({ path: `/users/${req.params.user}/repos` })
    .then(response => {
      res.json(response.data);
    });
}
