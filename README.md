# DIGGITHY SDK [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Lint, build, test, publish](https://github.com/LOUD-GmbH/diggithy-sdk/actions/workflows/lint-build-test-publish.yml/badge.svg)](https://github.com/LOUD-GmbH/diggithy-sdk/actions/workflows/lint-build-test-publish.yml)

DIGGITHY SDK aims to make integration with DIGGITHY easy.

## Installation

```shell script
npm install @diggithy/sdk
```

## Usage

### Authorization

In order to work with the public API, you will need an API key for the instance you are managing.
After you obtained the API key, there are two ways to provide the API key to the SDK.

#### Using environment variables

When importing the SDK it will automatically initialize using `DIGGITHY_API_KEY` if it is set.

#### Using `Diggithy.Auth.init()`

If you prefer not to use environment variables as described above, you can manually initialize the SDK like so:

```typescript
Diggithy.Auth.init(yourApiKeyHere);
```

`Diggithy.Auth.init()` overrides the API key that might be set using the environment variable.

# Contributions

In order to contribute to this package, please create a PR with the proposed changes.

We are using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to facilitate CD.

After running `npm install`, there are git hooks installed which help you with committing.
Although git hooks should be installed automatically, it makes sense to ensure that with running `npm rebuild husky`.

Just work as you are used to and if you want to commit, run `git commit`.
[Commitizen](https://github.com/commitizen/cz-cli) will then ask you about the changes you made to generate a commit
message for you.
