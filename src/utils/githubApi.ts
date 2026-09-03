export async function fetchGithubRepo(url: string) {
  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);
    if (!match) throw new Error('Invalid GitHub URL');

    const owner = match[1];
    const repo = match[2].replace('.git', '');

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!response.ok) throw new Error('Repository not found or API rate limit exceeded');
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}
