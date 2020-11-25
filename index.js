#!/usr/bin/env node

const core = require('@actions/core')
const { context, getOctokit } = require('@actions/github')

async function run () {
  const trigger = core.getInput('trigger', { required: true })

  let triggered = false
  const reaction = core.getInput('reaction')
  const ghToken = core.getInput('ghToken')
  if (reaction && !ghToken) {
    core.setFailed('If "reaction" is supplied, "ghToken" is required')
    return
  }

  if (context.eventName !== 'issue_comment') {
    // If this is not a comment, workflow was triggered by some other hook.
    // Make the workflow continue without any other check.
    triggered = true
  } else if (context.payload.issue.pull_request) {
    // A comment in a PR triggered this workflow
    const { body } = context.payload.comment

    // Check that comment contains the `trigger` word
    const prefixOnly = core.getInput('prefix_only') === 'true'
    if ((prefixOnly && body.startsWith(trigger)) || body.includes(trigger)) {
      triggered = true
    }
  }

  core.setOutput('triggered', triggered)

  if (!triggered || !reaction) {
    return
  }

  if (context.eventName === 'issue_comment') {
    // Add reaction to comment that triggered this workflow

    const { owner, repo } = context.repo

    const octokit = getOctokit(ghToken)

    await octokit.reactions.createForIssueComment({
      owner,
      repo,
      comment_id: context.payload.comment.id,
      content: reaction
    })
  }
}

run().catch((err) => {
  console.error(err)
  core.setFailed('Unexpected error')
})
