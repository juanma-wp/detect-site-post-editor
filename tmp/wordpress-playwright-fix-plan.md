# Plan: Fix WordPress Playwright E2E Test Authentication

## Problem Analysis
The tests are failing with "Not logged in" and "Cannot read properties of undefined" errors due to incorrect fixture setup. Based on the Automattic reference repository, the solution is much simpler than what we've been attempting.

## Root Cause
We've been trying to manually configure everything when we should be **extending the @wordpress/scripts Playwright configuration** which already includes:
- Correct global setup
- Proper fixtures
- Authentication handling
- Storage state management

## Solution: Simplify and Extend @wordpress/scripts Config

### Changes Required:

1. **Replace `playwright.config.js`** - Extend @wordpress/scripts config instead of manual setup
2. **Delete `tests/e2e/global-setup.js`** - Not needed, @wordpress/scripts handles this
3. **Delete `tests/e2e/fixtures.js`** - Not needed, use @wordpress/scripts fixtures directly
4. **Update test imports** - Import from `@wordpress/e2e-test-utils-playwright` directly
5. **Create `artifacts/` directory** - For storage state
6. **Update `.gitignore`** - Add artifacts directory

### File Changes:

#### 1. playwright.config.js
```javascript
const path = require('path');
const { defineConfig } = require('@playwright/test');
const wpScriptsPlaywrightConfig = require('@wordpress/scripts/config/playwright.config.js');

module.exports = defineConfig({
    ...wpScriptsPlaywrightConfig,
    testDir: './tests/e2e',
    use: {
        ...wpScriptsPlaywrightConfig.use,
        baseURL: process.env.WP_BASE_URL || 'http://localhost:8888',
        storageState: path.join(process.cwd(), 'artifacts/storage-state.json'),
    },
});
```

#### 2. Update all test files (26 files in tests/e2e/)
Change from:
```javascript
const { test, expect } = require('./fixtures');
```

To:
```javascript
const { test, expect } = require('@wordpress/e2e-test-utils-playwright');
```

Files to update:
- tests/e2e/combined-conditions.spec.js
- tests/e2e/exclude-design-post-types.spec.js
- tests/e2e/page-template.spec.js
- tests/e2e/post-status.spec.js
- tests/e2e/server-side-detection.spec.js
- tests/e2e/specific-post-type.spec.js
- tests/e2e/viewable-post-type.spec.js

#### 3. .gitignore
Add: `artifacts/`

#### 4. Delete files:
- `tests/e2e/global-setup.js`
- `tests/e2e/fixtures.js`
- `tests/e2e/.auth/` directory (replaced by artifacts/)

### Why This Works
- @wordpress/scripts already includes all the correct fixtures with proper dependencies
- Admin fixture already has the editor dependency
- Global setup already handles authentication correctly
- Storage state is properly managed
- No manual wiring of fixtures needed

### Testing Steps After Changes:
1. Clean up: `rm -rf artifacts/ tests/e2e/.auth/`
2. Create artifacts dir: `mkdir artifacts`
3. Run tests: `npm run test`

This approach follows the exact pattern used by Automattic's production WordPress block examples and is the officially supported way to set up WordPress Playwright tests.

## Reference
Based on: https://github.com/Automattic/wpvip-learn-enterprise-block-editor/tree/trunk/examples/copyright-date-block-with-tests
