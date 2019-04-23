#### Publishing Package

See `NPM` documentation on [publishing packages](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry):

    npm publish

#### Building Package

    npm run build

### Git Hooks Managent

Due to our Python/JS stack, we recommend [Hooks4git](https://pypi.org/project/hooks4git/) module.

#### Install

**requirements:** [`pip`](https://packaging.python.org/guides/installing-using-linux-tools/#installing-pip-setuptools-wheel-with-linux-package-managers)

    pip install hooks4git --user

#### Usage

    cd working-project/
    hooks4git --init

Now you get a new `.hooks4git.ini` and some hooks in `.git/hooks`