const GitHubClient = require('../libs/GitHubClient.js').GitHubClient;

const githubCliDotCom = new GitHubClient({
  baseUri: 'https://api.github.com',
  token: '99c09458d09120f35c0674528c58f279898e82a1'// process.env.TOKEN_GITHUB_DOT_COM
});

const WATCHERS_THRESHOLD = 5;
const STARGAZERS_THRESHOLD = 5;
const FORKS_THRESHOLD = 1;
const README_FILE_SIZE_THRESHOLD = 200;

/**
 * Get user basic information
 * @param req
 * @param res
 * @returns void
 */
export function getUser(req, res) {
  const userPromise = githubCliDotCom.getData({ path: `/users/${req.params.user}` });
  const reposPromise = githubCliDotCom.getData({ path: `/users/${req.params.user}/repos` });
  const followersPromise = githubCliDotCom.getData({ path: `/users/${req.params.user}/followers` });

  Promise.all([userPromise, reposPromise, followersPromise])
    .then(result => {
      const user = result[0].data;
      const repos = result[1].data;
      const followers = result[2].data;

      let languages = {};
      for (let i = 0; i < repos.length; i++) {
        if (repos[i].language !== null) {
          const languageName = repos[i].language;
          languages[languageName] = languages[languageName] == null ? 1 : languages[languageName] + 1;
        }
      }

      // Workaround.... I know, there is a better way to sort objects, but, it's 02:32.. I just don't remember... sorry :'()
      const tuples = [];
      for (const key in languages) {
        tuples.push([key, languages[key]]);
      }
      tuples.sort((a, b) => {
        return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0;
      });
      languages = {};
      for (let i = 0; i < tuples.length; i++) {
        languages[tuples[i][0]] = tuples[i][1];
        if (i === 2) {
          break;
        }
      }
      // Ends of workaround

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
        languages,
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
    .catch((reason) => {
      console.log(reason);
      res.status(500).send({ error: reason });
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

                    //Check if user created some aditional branches, good git flow practise
                    githubCliDotCom.getData({path: `/repos/${req.params.user}/${repo.name}/branches`})
                    .then(branchesResult => {
                        if(branchesResult.length > 1){
                            finalScore += 1;
                        }
                    })

                    //Check if user created a README file, with a minimum acceptable content
                    githubCliDotCom.getData({path: `/repos/${req.params.user}/${repo.name}/readme`})
                    .then(readmeResult => {
                        if(readmeResult != null &&
                            readmeResult.type == 'file' && 
                            readmeResult.size > README_FILE_SIZE_THRESHOLD) {

                            finalScore += 1;
                        }
                    })

                    reposTotalStars += repo.stargazers_count;
                    reposTotalWatchers += repo.watchers_count;

                    if(repo.forks_count >= FORKS_THRESHOLD) {
                        finalScore += 1;
                    }

                    if(repo.watchers_count >= WATCHERS_THRESHOLD) {
                        finalScore += 1;
                    }

                    if(repo.stargazers_count >= STARGAZERS_THRESHOLD) {
                        finalScore += 1;
                    }

                    if(userHasBlog) {
                        finalScore += 1;
                    }

                    // Final Score Calculations
                    finalScore += reposTotalStars;
                    finalScore += reposTotalWatchers;
                }
            });

            res.json({
                total_score: finalScore
            });
            
        })
        .catch(function (error) {
            console.log(error);
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
            var repos = result[0].data;

            var statusArray = [];

            repos.map((repo) => {
                //TODO(Nuno): Check if user is contributing to any projects

                githubCliDotCom.getData({ path: `/repos/${req.params.user}/${repo.name}/pulls?state=closed` })
                    .then(pulls => {

                        statusArray.push(pulls);

                        //pulls.map((pullRequest) => { });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            });

             res.json(statusArray);

        })
        .catch(error => {
            console.log(error);
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
