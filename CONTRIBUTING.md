# Contributing to Placement Hub

Thank you for your interest in contributing to Placement Hub! This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow best practices

## 📝 Before You Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/placement-hub.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Set up your development environment (see README.md)

## 🔍 Making Changes

### Code Style
- Use ES6+ features
- Follow existing code patterns
- Add comments for complex logic
- Keep components small and focused
- Use meaningful variable names

### Commit Messages
```
Format: [Type] Brief description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style changes
- refactor: Code refactoring
- test: Tests
- chore: Build/dependency updates

Examples:
- feat: Add resume PDF export
- fix: Fix authentication token expiration
- docs: Update API documentation
```

### Creating Pull Requests

1. Push to your fork: `git push origin feature/amazing-feature`
2. Open a Pull Request against `main`
3. Provide clear description of changes
4. Reference any related issues (#123)
5. Ensure all tests pass

#### PR Title Format
```
[Type] Brief description (component/module)

Examples:
- feat(auth): Add password reset functionality
- fix(resume): Fix resume PDF export bug
- docs(api): Update authentication endpoint docs
```

## 🐛 Bug Reports

Create an issue with:
- Clear title
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, Node version, etc.)
- Screenshots/logs if applicable

## ✨ Feature Requests

Create an issue with:
- Clear title starting with `[FEATURE]`
- Detailed description
- Use cases/benefits
- Possible implementation approach
- Related features or alternatives

## 📦 Areas for Contribution

### Backend
- [ ] Add input validation
- [ ] Implement rate limiting
- [ ] Add logging system
- [ ] Create API tests
- [ ] Optimize database queries
- [ ] Add caching (Redis)

### Frontend
- [ ] Improve UI/UX
- [ ] Add more responsive layouts
- [ ] Create reusable components
- [ ] Add unit tests
- [ ] Optimize performance
- [ ] Fix accessibility issues

### Documentation
- [ ] Improve README
- [ ] Create tutorials
- [ ] Add code examples
- [ ] Create video guides
- [ ] Translate documentation

### DevOps/Deployment
- [ ] Docker setup
- [ ] GitHub Actions CI/CD
- [ ] Deployment scripts
- [ ] Environment configurations

## 🚀 Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and test
npm run dev  # Run dev server

# 3. Commit changes
git add .
git commit -m "feat(module): Add my feature"

# 4. Push to fork
git push origin feature/my-feature

# 5. Create Pull Request on GitHub
# (Provide detailed description)

# 6. Address review comments
# (Make updates and push again)

# 7. Merge after approval
```

## 🧪 Testing

### Frontend
```bash
cd client
npm test
npm run build  # Check for build errors
```

### Backend
```bash
cd server
npm test
# Manual testing with Postman or curl
```

## 📚 Documentation

- Update README.md for major changes
- Add inline code comments
- Update API_DOCS.md for new endpoints
- Create migration guides for breaking changes

## 🎯 Priority Areas (High Impact Contributions)

1. **OpenAI Integration** - Implement real AI features
2. **Resume PDF Export** - Add PDF generation
3. **Interview Video Recording** - Record practice sessions
4. **Authentication Improvements** - Social login, 2FA
5. **Mobile Responsiveness** - Better mobile experience
6. **Performance Optimization** - Faster load times
7. **Testing** - Unit and integration tests
8. **Documentation** - Better docs and examples

## 💡 Ideas for Beginners

- [ ] Fix typos in documentation
- [ ] Improve error messages
- [ ] Add more test cases
- [ ] Create UI components
- [ ] Add comments to code
- [ ] Fix accessibility issues
- [ ] Improve styling
- [ ] Create helpful utilities

## 🏆 Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## ❓ Questions?

- Check existing issues/discussions
- Read documentation
- Open a discussion in GitHub Discussions
- Contact maintainers

## 📋 Contribution Checklist

Before submitting PR:
- [ ] Code follows style guide
- [ ] No console errors/warnings
- [ ] Added/updated comments
- [ ] Updated documentation
- [ ] Tested changes locally
- [ ] Commit messages are clear
- [ ] No breaking changes (or documented)
- [ ] Related issues linked

## 🙏 Thank You!

Your contributions make Placement Hub better for everyone. We appreciate:
- Code improvements
- Bug reports
- Feature ideas
- Documentation
- Testing
- Feedback

Happy contributing! 🚀

---

For questions or concerns, reach out through GitHub Issues or Discussions.
