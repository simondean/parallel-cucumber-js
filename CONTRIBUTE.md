## Release checklist

Here are the steps to follow when making a release.

* Update development status in `README.md`, if relevant
* Update `History.md`
* Bump version in `package.json`
* Add new contributors to `package.json`, if any
* Commit those changes as "*Release 0.1.2*" (where *0.1.2* is the actual version, of course)
  * $ `git commit -m "Release 0.1.2"`
* Tag commit as "v0.1.2" with short description of main changes
  * $ `git tag -a "v0.1.2" -m "Description of changes"
* Push to main repo on GitHub
* Wait for build to go green
* Publish to NPM