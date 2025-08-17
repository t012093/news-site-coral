# Publishing Guide

## Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com)
2. **npm Login**: 
   ```bash
   npm login
   ```
3. **Organization**: Create organization `@news-site-coral` on npm (optional but recommended)

## Pre-publish Checklist

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md` with new features/fixes
- [ ] Ensure all tests pass: `npm test`
- [ ] Build successfully: `npm run build`
- [ ] Test locally: `npm pack` and install the tarball
- [ ] Update README.md if needed
- [ ] Commit all changes to git

## Publishing Steps

### 1. Version Bump
```bash
# Patch release (1.0.0 -> 1.0.1)
npm version patch

# Minor release (1.0.0 -> 1.1.0)  
npm version minor

# Major release (1.0.0 -> 2.0.0)
npm version major
```

### 2. Test Package
```bash
# Build and test
npm run build
npm pack

# Test the tarball
npm install -g ./news-site-coral-mcp-task-server-*.tgz
news-site-mcp --help
npm uninstall -g @news-site-coral/mcp-task-server
```

### 3. Publish to npm
```bash
# Dry run (recommended first)
npm publish --dry-run

# Actual publish
npm publish

# For scoped packages (first time)
npm publish --access public
```

### 4. Verify Publication
```bash
# Check on npm
npm view @news-site-coral/mcp-task-server

# Test installation
npm install -g @news-site-coral/mcp-task-server
news-site-mcp setup
```

### 5. Create Git Release
```bash
git push origin main --tags
```

Then create a GitHub release from the new tag.

## Post-publish

1. **Announcement**: Update project README with new version
2. **Documentation**: Update any integration guides
3. **Testing**: Test in real Claude Code environment
4. **Support**: Monitor for issues and user feedback

## Rollback (if needed)

```bash
# Unpublish within 72 hours (use carefully)
npm unpublish @news-site-coral/mcp-task-server@1.0.1

# Or deprecate a version
npm deprecate @news-site-coral/mcp-task-server@1.0.1 "This version has issues, use 1.0.2+"
```

## Version Strategy

- **Patch** (1.0.x): Bug fixes, security updates
- **Minor** (1.x.0): New features, backwards compatible
- **Major** (x.0.0): Breaking changes, API changes

## Distribution Tags

```bash
# Latest (default)
npm publish

# Beta release
npm publish --tag beta
npm install @news-site-coral/mcp-task-server@beta

# Next release
npm publish --tag next
```