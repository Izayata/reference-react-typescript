// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'

// Initializes the i18next singleton before any test renders a component that
// calls useTranslation() - without this, a test file whose import graph never
// happens to touch a utils/*.ts file (which import i18n.ts for ERR_MSG_*
// constants) would render with no i18next instance registered.
import './main/i18n/i18n'
