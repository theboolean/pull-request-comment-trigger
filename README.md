# Pull Request Comment Trigger

Look for a "trigger word" in a pull-request description or comment, so that later steps can know whether or not to run.

<!-- TODO release workflow-preprocessor This is most useful in tandem with [workflow-preprocessor], so that you don't have to be writing a ton of `if`s all down the line. -->

## Example usage in a workflow

Your workflow needs to listen to the following events:
```
on:
  pull_request:
    types: [opened]
  issue_comment:
    types: [created]
```

And then you can use the action in your jobs like this:

```
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: khan/pull-request-comment-trigger@master
        id: check
        with:
          trigger: '@deploy'
          reaction: rocket
        env:
          GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}'
      - run: 'echo Found it!'
        if: steps.check.outputs.triggered == 'true'
```

`reaction` must be one of the reactions here: https://developer.github.com/v3/reactions/#reaction-types
If you specify a reaction, you have to provide a `GITHUB_TOKEN` via `gh_token` variable.

## Inputs

| Input | Required? | Description |
| ----- | --------- | ----------- |
| trigger | Yes | The string to look for in pull-request descriptions and comments. For example "#build/android". |
| prefix_only | No (default 'false') | If 'true', the trigger must match the start of the comment. |
| reaction | No (default '') | If set, the specified emoji "reaction" is put on the comment to indicate that the trigger was detected. For example, "rocket". |
| gh_token | No (default '') | If "reaction" is set, a GITHUB_TOKEN must be set to allow reacting to comments. |


## Outputs

| Output | Description |
| ------ | ----------- |
| triggered | 'true' or 'false' depending on if the trigger phrase was found. |
