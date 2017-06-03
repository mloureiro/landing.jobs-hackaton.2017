const GitHubClient = require('../libs/GitHubClient.js').GitHubClient;

const githubCliDotCom = new GitHubClient({
  baseUri: 'https://api.github.com',
  token: '99c09458d09120f35c0674528c58f279898e82a1'// process.env.TOKEN_GITHUB_DOT_COM
});

const WATCHERS_THRESHOLD = 2;
const STARGAZERS_THRESHOLD = 2;
const FORKS_THRESHOLD = 2;
const README_FILE_SIZE_THRESHOLD = 200;

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
 * Get profile score from a github score
 * @param {*} req 
 * @param {*} res 
 */
export function getScore(req, res) {
    var userPromise = Promise.resolve(githubCliDotCom.getData({ path: `/users/${req.params.user}` }));
    var reposPromise = Promise.resolve(githubCliDotCom.getData({ path: `/users/${req.params.user}/repos` }));
    var followersPromise = Promise.resolve(githubCliDotCom.getData({ path: `/users/${req.params.user}/followers` }));


    Promise.all([userPromise, reposPromise, followersPromise])
        .then(result =>  {
            var user = result[0].data;
            var repos = result[1].data;
            var followers = result[2].data;

            var userHasBlog = (user.blog != null && user.blog != '');
            var userTotalFollowers = user.followers;
            var reposTotalStars = 0;
            var reposTotalWatchers = 0;

            var finalScore = 0;

            repos.map((repo) => {

                // Ignore forked repositories
                if(!repo.fork){

                    //Check if user created a README file, with a minimum acceptable content
                    githubCliDotCom.getData({path: `/repos/${req.params.user}/${repo.name}/readme`})
                    .then(readmeResult => {
                        if(readmeResult != null &&
                            readmeResult.type == 'file' && 
                            readmeResult.size > README_FILE_SIZE_THRESHOLD) {

                            finalScore += 2;
                        }
                    })

                    reposTotalStars += repo.stargazers_count;
                    reposTotalWatchers += repo.watchers_count;

                    if(repo.forks_count >= FORKS_THRESHOLD) {
                        finalScore += 2;
                    }

                    if(repo.watchers_count >= WATCHERS_THRESHOLD) {
                        finalScore += 2;
                    }

                    if(repo.stargazers_count >= STARGAZERS_THRESHOLD) {
                        finalScore += 2;
                    }

                    if(hasBlog) {
                        finalScore += 2;
                    }

                    // Final Score Calculations
                    finalScore += reposTotalStars;
                    finalScore += reposTotalWatchers;
                }
            });
            
            /*
                totalStars: reposTotalStars,
                totalWatchers: reposTotalWatchers,
                userFolowers: userTotalFollowers,
                hasBlog: userHasBlog,
            */
            res.json({
                total_score: finalScore
            });
            
        })
        .catch(error => {
            res.status(500).send(error);
        });
}

/**
 * Get social score from a github user
 * @param req
 * @param res
 * @returns void
 */
export function getSocialScore(req, res) {
    //var userPromise = Promise.resolve(githubCliDotCom.getData({ path: `/users/${req.params.user}` }));
    var reposPromise = Promise.resolve(githubCliDotCom.getData({ path: `/users/${req.params.user}/repos` }));
    //var followersPromise = Promise.resolve(githubCliDotCom.getData({ path: `/users/${req.params.user}/followers` }));

    Promise.all([reposPromise])
        .then(result =>  {
            var repos = result[1].data;

            var statusArray = ["test"];

            repos.map((repo) => {
                // Check if user is contributing to any projects
                if(repo.fork) {
                    githubCliDotCom.getData({ path: `/repos/${req.params.user}/${repo.name}/pulls` })
                        .then(pulls => {
                            pulls.map((pullRequest) => {

                                statusArray.push(pullRequest.state);

                                if(pullRequest.state == 'merged') {

                                }
                            });
                        })
                        .catch(error => {
                            res.status(500).send(error);
                        });
                }
            });

             res.json(statusArray);

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
