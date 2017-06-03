const GitHubClient = require('../libs/GitHubClient.js').GitHubClient;

const github = new GitHubClient({
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
  const userPromise = github.getData({ path: `/users/${req.params.user}` });
  const reposPromise = github.getData({ path: `/users/${req.params.user}/repos` });
  const followersPromise = github.getData({ path: `/users/${req.params.user}/followers` });

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
            rel: 'Get tech score',
            url: `/analyzer/${req.params.user}/github/score`
          },
          {
            rel: 'Get social score',
            url: `/analyzer/${req.params.user}/github/socialscore`
          }
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
 * @param req
 * @param res
 */
export function getScore(req, res) {
  const userPromise = github.getData({ path: `/users/${req.params.user}` });
  const reposPromise = github.getData({ path: `/users/${req.params.user}/repos` });

  Promise.all([userPromise, reposPromise])
    .then(result => {
      const user = result[0].data;
      const repos = result[1].data;

      const userHasBlog = (user.blog !== null && user.blog !== '');
      const userTotalFollowers = user.followers;
      let reposTotalStars = 0;
      let reposTotalWatchers = 0;
      let repoScore = 0;
      const roles = [];
      let finalScore = 0;

      const promises = repos
        .filter((repo) => !repo.fork)
        .map((repo) => {
          const brancesPromise = github.getData({ path: `/repos/${req.params.user}/${repo.name}/branches` });
          // const readmePromise = github.getData({ path: `/repos/${req.params.user}/${repo.name}/readme` });
          const testsPromise = github.getData({ path: `/repos/${req.params.user}/${repo.name}/commits/master` });
          const pullsPromise = github.getData({ path: `/repos/${req.params.user}/${repo.name}/pulls?state=all` });
          const commitsPromise = github.getData({ path: `/repos/${req.params.user}/${repo.name}/commits/master` })

          return [Promise.resolve(repo), brancesPromise, /*readmePromise,*/ testsPromise, pullsPromise, commitsPromise];
        });

      Promise
        .all(promises)
        .then(reposResult => {
          let accumulatedDataLength = 0;

          if (userHasBlog) {
            roles.push(`User ${req.params.user} with blog, earn 1 point`);
            repoScore += 1;
          }

          for (let i = 0; i < reposResult.length; i++) {
            const repoItemResult = reposResult[i];
            const repo = repoItemResult[0] || {};
            const branchesResult = repoItemResult[1].data || [];
            // const readmeResult = repoItemResult[1].data;
            const testsResult = repoItemResult[2].data || [];
            const pullsResult = repoItemResult[3].data || [];
            const commitsResult = repoItemResult[4].data || [];

            // Check if user created some aditional branches, good git flow practise
            if (branchesResult.length > 1) {
              roles.push(`Repository ${repo.name} with branchs, earn 1 point`);
              repoScore += 1;
            }

            // Check for merged pull requests
            const pullRequestWithMergeCount = pullsResult
              .filter((pull) => pull.merged_at != null)
              .length;
            if (pullRequestWithMergeCount > 0) {
              repoScore += pullRequestWithMergeCount;
              roles.push(`Accepted pull request, earn ${pullRequestWithMergeCount} point(s)`);
            }

            reposTotalStars += repo.stargazers_count;
            reposTotalWatchers += repo.watchers_count;

            if (repo.forks_count >= FORKS_THRESHOLD) {
              roles.push(`Repository ${repo.name} with many forks, earn 1 point`);
              repoScore += 1;
            }

            if (repo.watchers_count >= WATCHERS_THRESHOLD) {
              roles.push(`Repository ${repo.name} with many watchers, earn 1 point`);
              repoScore += 1;
            }

            if (repo.stargazers_count >= STARGAZERS_THRESHOLD) {
              roles.push(`Repository ${repo.name} with many stargazers, earn 1 point`);
              repoScore += 1;
            }

            // Final Score Calculations
            repoScore += repo.stargazers_count;
            repoScore += repo.watchers_count;

            finalScore += repoScore;

            accumulatedDataLength = branchesResult.length +
              testsResult.length +
              pullsResult.length +
              commitsResult.length;
          }

          res.json({
            total_score: finalScore,
            level: getLevelByScore(finalScore),
            roles: roles,
            quality: getQuality(accumulatedDataLength)
          });
        }).catch(error => {
          console.log(error);
        });
    });
};

/**
 * Get level by score
 * @param req
 * @returns int
 */
const getLevelByScore = function (score) {
  // inspired by https://gamedev.stackexchange.com/questions/13638/algorithm-for-dynamically-calculating-a-level-based-on-experience-points
  const constant = 10;
  return constant * Math.sqrt(score);
};

/**
 * Get data quality by score
 * @param req
 * @returns string
 */
const getQuality = function (dataLength) {
  if (dataLength <= 5) {
    return 'Poor';
  } else if (dataLength > 5 && dataLength <= 10) {
    return 'Medium';
  } else {
    return 'High';
  }
};

/**
 * Get social score from a github user
 * @param req
 * @param res
 * @returns void
 */
export function getSocialScore(req, res) {
  github
    .getData({ path: `/users/${req.params.user}/repos` })
    .then(result => {
      const repos = result.data;

      const repoDetailsPromises = repos
        .filter(repo => repo != null && repo.full_name != null)
        .map(repo => {
          return github.getData({ path: `/repos/${repo.full_name}` });
        });

      Promise
        .all(repoDetailsPromises)
        .then(repoDetailsValues => {
          const pullsPromises = repoDetailsValues
            .map(repoResult => repoResult.data)
            .filter(repoResult => repoResult.fork === true)
            .map(repoResult => {
              const fullPath = `/repos/${repoResult.parent.full_name}/pulls?head=${req.params.user}:${repoResult.default_branch}&state=all`;
              return github.getData({ path: fullPath });
            });

          // 0-5 => qualidade baixa
          // 6-10 => qualidade media
          // >10 => qualidade alta



          Promise
            .all(pullsPromises)
            .then(pullsValues => {
              const pulls = pullsValues
                .map(pulls => pulls.data);

              res.json({});
            })
            .catch(error => {
              console.log(error);
              res.status(500).send(error);
            });
        }).catch(error => {
          console.log(error);
          res.status(500).send(error);
        });
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
  github.getData({ path: `/users/${req.params.user}/repos` })
    .then(response => {
      res.json(response.data);
    });
}
