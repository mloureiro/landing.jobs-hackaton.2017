const GitHubClient = require('../libs/GitHubClient.js').GitHubClient;

let githubCliDotCom = new GitHubClient({
    baseUri: "https://api.github.com",
    token: "99c09458d09120f35c0674528c58f279898e82a1"//process.env.TOKEN_GITHUB_DOT_COM
});

/**
 * Get user basic information
 * @param req
 * @param res
 * @returns void
 */
export function getUser(req, res) {
    var userPromise = Promise.resolve(githubCliDotCom.getData({ path: `/users/${req.params.user}` }));
    var reposPromise = Promise.resolve(githubCliDotCom.getData({ path: `/users/${req.params.user}/repos` }));
    var followersPromise = Promise.resolve(githubCliDotCom.getData({ path: `/users/${req.params.user}/followers` }));

    Promise.all([userPromise, reposPromise, followersPromise])
        .then(result => {
            var user = result[0].data;
            var repos = result[1].data;
            var followers = result[2].data;

            var content = {
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


                        // {
                        // id: 63958655,
                        // name: "awesome-dotnet",
                        // full_name: "diegobrum/awesome-dotnet",
                        // owner: {},
                        // private: false,
                        // html_url: "https://github.com/diegobrum/awesome-dotnet",
                        // description: "A collection of awesome .NET libraries, tools, frameworks and software",
                        // fork: true,
                        // url: "https://api.github.com/repos/diegobrum/awesome-dotnet",
                        // forks_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/forks",
                        // keys_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/keys{/key_id}",
                        // collaborators_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/collaborators{/collaborator}",
                        // teams_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/teams",
                        // hooks_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/hooks",
                        // issue_events_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/issues/events{/number}",
                        // events_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/events",
                        // assignees_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/assignees{/user}",
                        // branches_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/branches{/branch}",
                        // tags_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/tags",
                        // blobs_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/git/blobs{/sha}",
                        // git_tags_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/git/tags{/sha}",
                        // git_refs_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/git/refs{/sha}",
                        // trees_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/git/trees{/sha}",
                        // statuses_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/statuses/{sha}",
                        // languages_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/languages",
                        // stargazers_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/stargazers",
                        // contributors_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/contributors",
                        // subscribers_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/subscribers",
                        // subscription_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/subscription",
                        // commits_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/commits{/sha}",
                        // git_commits_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/git/commits{/sha}",
                        // comments_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/comments{/number}",
                        // issue_comment_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/issues/comments{/number}",
                        // contents_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/contents/{+path}",
                        // compare_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/compare/{base}...{head}",
                        // merges_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/merges",
                        // archive_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/{archive_format}{/ref}",
                        // downloads_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/downloads",
                        // issues_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/issues{/number}",
                        // pulls_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/pulls{/number}",
                        // milestones_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/milestones{/number}",
                        // notifications_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/notifications{?since,all,participating}",
                        // labels_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/labels{/name}",
                        // releases_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/releases{/id}",
                        // deployments_url: "https://api.github.com/repos/diegobrum/awesome-dotnet/deployments",
                        // created_at: "2016-07-22T14:15:04Z",
                        // updated_at: "2016-07-22T10:33:48Z",
                        // pushed_at: "2016-07-22T14:18:42Z",
                        // git_url: "git://github.com/diegobrum/awesome-dotnet.git",
                        // ssh_url: "git@github.com:diegobrum/awesome-dotnet.git",
                        // clone_url: "https://github.com/diegobrum/awesome-dotnet.git",
                        // svn_url: "https://github.com/diegobrum/awesome-dotnet",
                        // homepage: null,
                        // size: 611,
                        // stargazers_count: 0,
                        // watchers_count: 0,
                        // language: null,
                        // has_issues: false,
                        // has_projects: true,
                        // has_downloads: true,
                        // has_wiki: false,
                        // has_pages: false,
                        // forks_count: 0,
                        // mirror_url: null,
                        // open_issues_count: 0,
                        // forks: 0,
                        // open_issues: 0,
                        // watchers: 0,
                        // default_branch: "master",
                        // permissions: {
                        // admin: false,
                        // push: false,
                        // pull: true
                        // }
                        // }

                        return {
                            name: item.name,
                            private: item.private
                        };
                    })
            };

            res.json({
                content: content,
                status: "ok",
                links: [
                    {
                        name: 'Amazing anazyle #1',
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