export const GITHUB_ACTION_WORKFLOW_TEMPLATE = `name: AgentSentry Continuous AI Immune Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    # Run automated nightly adversarial pen-test
    - cron: '0 2 * * *'

jobs:
  agentsentry-redteam-audit:
    name: Autonomous Agent Red-Team & Immune Verification
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code Repository
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install AgentSentry CLI Runner
        run: npm install -g @agentsentry/cli

      - name: Execute Autonomous Adversarial Red-Team Swarm
        env:
          AGENTSENTRY_API_KEY: \${{ secrets.AGENTSENTRY_API_KEY }}
          TARGET_AGENT_URL: \${{ secrets.TARGET_AGENT_URL }}
        run: |
          echo "Starting AgentSentry OWASP Top-10 Penetration Test..."
          agentsentry scan \\
            --target-url \$TARGET_AGENT_URL \\
            --vectors "ALL" \\
            --auto-heal \\
            --fail-on-critical \\
            --output-report ./agentsentry-audit.json

      - name: Upload Security & Compliance Artifact
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: agentsentry-compliance-scorecard
          path: ./agentsentry-audit.json
`;
