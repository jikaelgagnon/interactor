// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- disable ESLint check for the next line
// @ts-nocheck -- this TS comment turns off TypeScript type checking for this file because we do not
// mock the entire Chrome API, but only the parts we need
// jest.setup.ts (add to setupFiles in jest.config)
(global as any).chrome = {
  storage: {
    sync: {
      get: jest.fn(),
    },
    local: {
      get: jest.fn().mockResolvedValue({}),
      set: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    },
  },
  tabs: {
    query: jest.fn().mockResolvedValue([]),
    onRemoved: { addListener: jest.fn() },
    onUpdated: { addListener: jest.fn() },
  },
  runtime: {
    onMessage: { addListener: jest.fn() },
    lastError: null,
  },
  identity: {
    getProfileUserInfo: jest.fn((cb) =>
      cb({ email: "test@example.com", id: "123" })
    ),
  },
  action: {
    setPopup: jest.fn().mockResolvedValue(undefined),
    openPopup: jest.fn().mockResolvedValue(undefined),
  },
} as any
