# Contributing

Any contributions to this package are more than welcome. To make life for everyone easier, please take some time and follow this guide.

## Issues

Please use issues for bug reporting only. For questions, ideas or anything else, please head over to
[discussions](https://github.com/LOUD-GmbH/diggithy-sdk/discussions).

As of now, we do not have an issue template. If you want to report a bug, please describe the problem as precise as possible.
Include any information that might help to reproduce the problem. Also describe, what behavior you would expect and what the
actual behavior is.

Most probably we will ask you for a minimum reproducible example repository, so it speeds up investigation, if you prepare
one beforehand.

## Pull requests

In order to contribute to this package, please create a PR with the proposed changes. The base branch should always be `dev`
which also is the repositories default branch. There is a PR template which we kindly ask you to use, since it streamlines the
review process.

Do not forget to add a reviewer, it might be the best idea to simply add the `loud-gmbh/diggithy` team so Github picks
the actual reviewer for you.

### Commit formatting

We are using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to facilitate CD, version calculation and
changelog generation.

After running `npm install`, there are git hooks installed which help you with committing.
Although git hooks should be installed automatically, in some instances they are not. That is easily fixable with running
`npm rebuild husky`.

Just work as you are used to and if you want to commit, run `git commit`.
[Commitizen](https://github.com/commitizen/cz-cli) will then ask you about the changes you made to generate a commit
message for you. Just answer the questions. When you are done, your default text editor will open. You can just close it
(`ctrl + x` in most cases). The commit will be done and you can push it with `git push` as usual.

## Testing

The SDK relies on automated unit and e2e tests to ensure integrity and functionality.
If you add or change code, please do not forget to also add e2e and unit tests that cover your changes as much as possible.
Otherwise the PR cannot be accepted.

### Unit testing

Unit tests should cover as many cases as possible, should be small and lightweight and thus be efficient and fast.
They should not depend on external dependencies like the actual API, networking in general, etc. Instead, these dependencies
should be mocked using the Jest framework.

To run unit tests, simply run `npm run test`.

### e2e testing

While we implemented e2e tests, it is currently not possible to run them on the build server or locally if you are not part
of the DIGGITHY core team. The reason is that e2e tests need an actual, working API key and need to be run against a dev API
which we cannot provide publicly at the moment. This is a known limitation and we are discussing internally on how to handle
it and improve the process.

For now, we kindly ask you to implement e2e tests that cover your changes as good as possible and then ask for help so our
core team can have a look into it.

e2e tests should not cover as much cases (and not even necessarily the same cases) as unit tests but rather should demonstrate
and verify the whole application flow of the feature you are testing. This required external dependencies and real network requests
and API calls will be done, thus making e2e tests not very efficient but necessary.

## Questions?

If you still have open questions (or feature requests, improvements, rants, ...) feel free to head over to
[discussions](https://github.com/LOUD-GmbH/diggithy-sdk/discussions) and do not hesitate to talk to us there!
