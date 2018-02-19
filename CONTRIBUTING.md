# just-dashboard contribution guidelines
Thank you for considering contributing to just-dashboard!

As this project is still pretty new, I only state a few simple principles here.

You are welcome to implement bug fixes, features, report issues and post feature requests of any kind.

The preferred workflow for implementing new features or bug fixes is:
- Write a test case that fails
- Create an implementation that makes the test case pass
- Refactor
- Repeat

## Commit messages
Please use [Angular Git Commit Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) to write your commit messages.
This is important because just-dashboard uses [semantic-release](https://github.com/semantic-release/semantic-release) to generate releases.

I recommend trying a tool a like [commitizen](https://github.com/commitizen/cz-cli) to help with that.

## Documentation
just-dashboard uses jsdoc to generate documentation.
