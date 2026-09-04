<div align="center">
  <img src="https://img.shields.io/badge/react-19.2.8-blue.svg" alt="React" />
  <img src="https://img.shields.io/badge/typescript-5.0.0-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/vite-6.1.0-blue.svg" alt="Vite" />
</div>

<h1 align="center">READMEForge 2.0</h1>

<p align="center">
  <strong>Build, analyze, and maintain better GitHub documentation.</strong>
</p>

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [How to Use READMEForge](#how-to-use-readmeforge)
- [Project Structure](#project-structure)
- [License](#license)

---

## Features

- ✓ **Multi-Project Versioned Storage**: Seamlessly save and switch between an infinite number of README projects locally.
- ✓ **3-Column Architecture**: A powerful new editor workspace featuring a Sections Manager, an Active Editor Canvas, and a Live Markdown Preview.
- ✓ **Dynamic Structured Forms**: Edit "Environment Variables", "Project Details", and more with strictly-typed custom UI forms—no raw markdown needed.
- ✓ **Drag-and-Drop Reordering**: Rearrange sections of your README by dragging them in the sidebar.
- ✓ **Reusable Design System**: Modern, scalable UI components (`Button`, `Card`) driving the visual experience.
- ✓ **Live Markdown Preview**: See your edits compile in real-time.
- ✓ **Quality Score Analyzer**: Provides actionable linters and recommendations to ensure your README is professional.

## Tech Stack

**Frontend:**
- React (Hooks, Context)
- Tailwind CSS
- Lucide React (Icons)
- @hello-pangea/dnd (Drag and drop)

**Language:**
- TypeScript (Strict Typing)

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

1. **Dashboard (Project Switcher)**: View your recently saved projects or click "Create README" to start a new one.
2. **Sections Manager (Left Column)**: Check or uncheck sections to add/remove them from your document. Drag the grip icon to reorder them globally.
3. **Active Canvas (Center Column)**: Click on a section in the left sidebar to open its dedicated form here. Fill out your details, environment variables, etc.
4. **Markdown Preview (Right Column)**: Instantly see what your `README.md` will look like on GitHub. Toggle between "Preview" and "Markdown" views.
5. **Quality Checks**: Watch the quality score in the top right. Follow any linter warnings or recommendations to improve your documentation's completeness.
6. **Export**: Copy your final Markdown code or download it directly to your machine using the tools above the preview!

## Project Structure

```text
src/
├── components/
│   ├── Editor/       # 3-column layout components and structured forms
│   ├── Preview/      # Real-time markdown renderer
│   ├── ui/           # Generic design system components (Button, Card, etc.)
│   ├── Dashboard.tsx # Multi-project switcher
│   └── ...
├── services/
│   ├── analyzer/     # Quality scoring and Markdown generation logic
│   ├── github/       # GitHub API integration
│   └── storage/      # Multi-project localStorage persistence and migration
├── hooks/
│   └── useReadme.tsx # Global state context and history (Undo/Redo)
├── types/            # Strict domain models (project.ts, repository.ts, etc.)
├── App.tsx           # Router and migration initialization
└── index.css         # Global Tailwind configuration
```

## License

This project is licensed under the MIT License.
