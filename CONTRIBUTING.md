# Contributing to Api Studio

Thank you for your interest in contributing to Api Studio! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/api-client.git
   cd api-client
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/rohittiwari-dev/api-client.git
   ```

## 💻 Development Setup

1. **Install dependencies**

   ```bash
   bun install
   ```

2. **Set up environment**

   ```bash
   cp .env.example .env
   # Edit .env with your local database credentials
   ```

3. **Initialize database**

   ```bash
   bun run db:push
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

## ✏️ Making Changes

### Branch Naming

Use descriptive branch names:

- `feature/add-oauth2-support`
- `fix/cookie-parsing-bug`
- `docs/update-readme`
- `refactor/auth-component`

### Creating a Branch

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

## 🔄 Pull Request Process

1. **Update your branch** with the latest upstream changes:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes** thoroughly

3. **Push your branch**:

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub with:

   - Clear title describing the change
   - Description of what and why
   - Screenshots for UI changes
   - Link to related issues

5. **Address review feedback** promptly

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types (avoid `any`)
- Use interfaces for object shapes

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types

### Styling

- Use Tailwind CSS classes
- Follow existing patterns in the codebase
- Keep responsive design in mind

### File Structure

```
src/modules/feature-name/
├── components/     # React components
├── hooks/          # Custom hooks
├── store/          # Zustand stores
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## 💬 Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Examples

```
feat(auth): add OAuth 2.0 PKCE support

fix(cookies): handle SameSite=None attribute

docs(readme): add self-hosting instructions
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots if applicable
5. Browser and OS information

## 💡 Feature Requests

For feature requests:

1. Check if it already exists as an issue
2. Describe the use case
3. Explain why it would benefit users

## ❓ Questions?

- Open a [GitHub Discussion](https://github.com/rohittiwari-dev/api-client/discussions)
- Check existing issues and discussions

---

Thank you for contributing! 🎉
