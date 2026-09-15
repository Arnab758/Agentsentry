import { execSync } from 'child_process';

async function main() {
  let token = '';
  try {
    token = execSync('git config --get github.token').toString().trim();
  } catch (e) {
    console.error('Failed to get github.token from git config:', e.message);
  }

  if (!token) {
    console.error('No GitHub token found in git config.');
    process.exit(1);
  }

  console.log('GitHub token found. Checking user profile...');

  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'AgentSentry-Uploader'
    }
  });

  if (!userRes.ok) {
    const errText = await userRes.text();
    console.error('GitHub auth failed:', userRes.status, errText);
    process.exit(1);
  }

  const user = await userRes.json();
  console.log(`Successfully authenticated as GitHub user: ${user.login}`);

  // Create repository named 'Agentsentry'
  console.log("Creating public repository 'Agentsentry'...");
  const createRes = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'AgentSentry-Uploader',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Agentsentry',
      description: 'AgentSentry: Autonomous AI Agent Immune & Observability Fabric. Devpost AI Builders Hackathon 2026 Submission.',
      homepage: 'https://ai-builders-hackathon-2026.devpost.com/',
      private: false,
      has_issues: true,
      has_projects: true,
      has_wiki: false
    })
  });

  if (createRes.status === 201) {
    const repo = await createRes.json();
    console.log(`Repository created successfully: ${repo.html_url}`);
  } else if (createRes.status === 422) {
    console.log("Repository 'Agentsentry' already exists or name taken. Proceeding to push...");
  } else {
    const createErr = await createRes.text();
    console.warn('Repository creation response:', createRes.status, createErr);
  }

  const repoUrl = `https://${user.login}:${token}@github.com/${user.login}/Agentsentry.git`;

  console.log('Setting git remote origin...');
  try {
    execSync('git remote remove origin', { stdio: 'ignore' });
  } catch {}

  execSync(`git remote add origin https://github.com/${user.login}/Agentsentry.git`);
  console.log('Remote origin added.');

  console.log('Pushing main branch to GitHub...');
  execSync(`git push -u "${repoUrl}" main --force`, { stdio: 'inherit' });

  console.log(`\n🎉 SUCCESS! Project pushed to: https://github.com/${user.login}/Agentsentry`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
