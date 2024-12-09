import * as github from '@actions/github'
import * as core from '@actions/core'
import { linkChanges } from './linkProcessor'
import { LinkChange } from './types'

export async function createPullRequest(
  octokit: ReturnType<typeof github.getOctokit>,
  branchName: string
): Promise<void> {
  const { owner, repo } = github.context.repo

  const prTitle = 'link-updater: update repository links'
  const prBody = generatePrBody()

  try {
    const response = await octokit.rest.pulls.create({
      owner,
      repo,
      title: prTitle,
      body: prBody,
      head: branchName,
      base: 'main'
    })

    core.info(
      `✨ Created PR #${response.data.number}: ${response.data.html_url}`
    )
  } catch (error) {
    throw new Error(`Failed to create PR: ${error}`)
  }
}

function generatePrBody(): string {
  if (linkChanges.length === 0) {
    return 'No links were changed in this update.'
  }

  // Group changes by file
  const changesByFile = linkChanges.reduce(
    (acc, change) => {
      if (!acc[change.file]) {
        acc[change.file] = []
      }
      acc[change.file].push(change)
      return acc
    },
    {} as Record<string, LinkChange[]>
  )

  const fileCount = Object.keys(changesByFile).length
  let body = '# 🔄 Link Updates\n\n'

  // Add summary with emoji and better formatting
  body += `📊 **Summary**\n`
  body += `- Total updates: \`${linkChanges.length}\` link${linkChanges.length === 1 ? '' : 's'}\n`
  body += `- Files modified: \`${fileCount}\` file${fileCount === 1 ? '' : 's'}\n\n`

  // Add details for each file
  body += `## 📝 Changes by File\n\n`
  for (const [file, changes] of Object.entries(changesByFile)) {
    // Extract just the filename from the full path
    const fileName = file.split('/').pop() || file
    body += `### 📄 \`${fileName}\`\n\n`
    body += `<details>\n<summary>View ${changes.length} change${changes.length === 1 ? '' : 's'}</summary>\n\n`

    // Create a table for the changes
    body += '| Original | Updated |\n'
    body += '|----------|---------||\n'
    for (const change of changes) {
      body += `| \`${change.oldLink}\` | \`${change.newLink}\` |\n`
    }

    body += '\n</details>\n\n'
  }

  body += '---\n\n'
  body +=
    '> 🤖 *This PR was automatically generated by the [Link Updater](https://github.com/iamvikshan/link-updater).*'

  return body
}
