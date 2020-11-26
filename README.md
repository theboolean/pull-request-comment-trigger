# Pull Request Comment Trigger

Look for a "trigger word" in a pull-request description or comment, so that later steps can know whether or not to run.

<!-- TODO release workflow-preprocessor This is most useful in tandem with [workflow-preprocessor], so that you don't have to be writing a ton of `if`s all down the line. -->

## Example usage in a workflow

Your workflow needs to listen to the following event:
```
on:
  issue_comment:
    types: [created]
```

and can be used in conjunction with other events, such as:
```
on:
  push:
  issue_comment:
    types: [created]
```
in this case, for example, the workflow will trigger every time a `push` is performed, and when a comment is created.

The check of the "trigger word" is performed only in case of a comment created event. Workflow will be considered triggered in any other type of event.

You can use the action in your jobs like this:

```
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: theboolean/pull-request-comment-trigger@v0.3.2
        id: check_comment_trigger
        with:
          prefix_only: 'true'
          reaction: 'rocket'
          trigger: '/ci'
          gh_token: '${{ secrets.GITHUB_TOKEN }}'

      - run: 'echo Found it!'
        if: steps.check_comment_trigger.outputs.triggered == 'true'

      - run: 'echo Another task!'
        if: steps.check_comment_trigger.outputs.triggered == 'true'
```

`reaction` 
If you specify a reaction, you have to provide a `GITHUB_TOKEN` via the `gh_token` variable.

## Inputs

| Input | Required? | Description |
| ----- | --------- | ----------- |
| trigger | Yes | The string to look for in pull-request descriptions and comments. For example `'/ci'`. |
| prefix_only | No (default `'false'`) | If `'true'`, the trigger must match the start of the comment. |
| reaction | No (default `''`) | If set, the specified emoji "reaction" is put on the comment to indicate that the trigger was detected. For example, "rocket". It must be one of the values available here: https://developer.github.com/v3/reactions/#reaction-types |
| gh_token | No (default `''`) | If `reaction` is set, a `GITHUB_TOKEN` must be set to allow reacting to comments. |


## Outputs

| Output | Description |
| ------ | ----------- |
| triggered | `'true'` or `'false'` depending on if the trigger phrase was found. |
