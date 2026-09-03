<div align="center">
  <img src="https://img.shields.io/badge/react-19.2.8-blue.svg" alt="React" />
  <img src="https://img.shields.io/badge/typescript-5.0.0-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/vite-6.1.0-blue.svg" alt="Vite" />
</div>

<h1 align="center">READMEForge</h1>

<p align="center">
  <strong>A modern GitHub README generator that helps developers create professional documentation in minutes.</strong>
</p>

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [How to Use READMEForge](#how-to-use-readmeforge)
- [Areas for Improvement](#areas-for-improvement)
- [Project Structure](#project-structure)
- [License](#license)

---

## Features

- ✓ Live Markdown preview
- ✓ Professional templates
- ✓ GitHub repository import
- ✓ Badge generator
- ✓ README quality score
- ✓ One-click Markdown export

## Tech Stack

**Frontend:**
- React
- Tailwind CSS

**Language:**
- TypeScript

**Tooling:**
- Vite

## Installation

1. Clone the repository:
```bash
git clone https://github.com/username/readmeforge.git
```

2. Navigate to the project directory:
```bash
cd readmeforge
```

3. Install dependencies:
```bash
npm install
```

4. Run the development server:
```bash
npm run dev
```

## How to Use READMEForge

Once the development server is running and you have opened the app in your browser:

1. **Start a New Project**: Click "Create README" from the landing page to enter the workspace.
2. **Configure Project Details**: Fill out the project name, description, and repository URL in the left-hand Editor panel.
3. **Toggle Sections**: Use the checkboxes in the "Enabled Sections" to instantly add or remove blocks (e.g., Features, Tech Stack, Badges) from your documentation.
4. **Follow Recommendations**: Check the "Quality Score" in the top right. Follow the actionable recommendations to ensure your README is professional and thorough.
5. **View & Export**: Switch the right-hand panel from "Preview" to "Markdown" to see the generated code. Use the "Copy" or "Download" buttons at the top of the preview to export your final `README.md`.

## Areas for Improvement

While READMEForge currently offers a robust core experience, here are some planned improvements for the future roadmap:

- **Authentication & GitHub Integration**: Allow users to sign in with GitHub to automatically push the generated `README.md` directly to their repository.
- **Dynamic Badge Builder**: An interactive UI for searching, coloring, and customizing Shields.io badges without writing markdown manually.
- **Pre-built Templates Modal**: A catalog of starting templates (Minimal, SaaS, Open Source, Portfolio) that pre-fill the editor.
- **Drag-and-Drop Reordering**: Allow users to drag sections in the sidebar to dynamically change the order of the generated markdown.
- **Rich Text Editor**: Introduce a WYSIWYG rich text editor for individual section content alongside the plain text fields.

## Project Structure

```text
src/
├── components/
│   ├── Editor/
│   ├── Preview/
│   ├── LandingPage.tsx
│   └── Navbar.tsx
├── hooks/
│   └── useReadme.tsx
├── utils/
│   ├── githubApi.ts
│   ├── markdownGenerator.ts
│   └── qualityScore.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
