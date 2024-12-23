module.exports = {
  branches: ['main'],
  plugins: [
    [
      'semantic-release-gitmoji',
      {
        releaseRules: {
          patch: {
            include: [':bug:', ':ambulance:', ':lock:', ':adhesive_bandage:']
          },
          minor: {
            include: [':sparkles:', ':rocket:', ':boom:', ':lipstick:', ':zap:']
          },
          major: {
            include: [':boom:', ':warning:']
          }
        }
      }
    ],

    '@semantic-release/commit-analyzer',

    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        writerOpts: {
          types: [
            { type: 'feat', section: '✨ Features' },
            { type: 'fix', section: '🐛 Bug Fixes' },
            { type: 'perf', section: '⚡ Performance Improvements' },
            { type: 'revert', section: '⏪ Reverts' },
            { type: 'docs', section: '📚 Documentation' },
            { type: 'style', section: '💄 Styles' },
            { type: 'chore', section: '🔧 Miscellaneous' },
            { type: 'refactor', section: '♻️ Code Refactoring' },
            { type: 'test', section: '✅ Tests' },
            { type: 'build', section: '👷 Build System' },
            { type: 'ci', section: '🔄 CI/CD' }
          ]
        }
      }
    ],

    [
      '@semantic-release/changelog',
      {
        changelogTitle:
          '# 📦 Changelog\n\nAll notable changes to this project will be documented in this file.\n'
      }
    ],

    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: '.',
        tarballDir: 'dist'
      }
    ],

    [
      '@semantic-release/github',
      {
        assets: [
          { path: 'dist/*.tgz', label: 'NPM Package' },
          { path: 'dist/index.js', label: 'Action Bundle' }
        ],
        successComment:
          "🎉 This ${issue.pull_request ? 'PR is included' : 'issue has been resolved'} in version ${nextRelease.version} and published to GitHub Marketplace",
        failTitle: '❌ The release failed',
        failComment:
          'The release from branch ${branch.name} failed to publish.',
        labels: ['released']
      }
    ],

    [
      '@semantic-release/exec',
      {
        prepareCmd:
          "sed -i 's|iamvikshan/link-updater@v[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+|iamvikshan/link-updater@v${nextRelease.version}|g' README.md"
      }
    ],

    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md', 'README.md'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ]
}
