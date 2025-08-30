import { SessionManager } from "./background/sessionmanagement";
import { describe, expect, it } from "@jest/globals";

describe("SessionManager.getInstance useDB behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset singleton so each test gets a fresh one
    ;(SessionManager as any).instance = undefined
  })

  it("sets useDB = true when chrome.storage.sync.get returns true", async () => {
    (chrome.storage.sync.get as jest.Mock).mockResolvedValue({ useDB: true })

    const instance = await SessionManager.getInstance()

    expect(chrome.storage.sync.get).toHaveBeenCalledWith("useDB")
    expect((instance as any).useDB).toBe(true)
  })

  it("sets useDB = false when chrome.storage.sync.get returns false", async () => {
    (chrome.storage.sync.get as jest.Mock).mockResolvedValue({ useDB: false })

    const instance = await SessionManager.getInstance()

    expect((instance as any).useDB).toBe(false)
  })

  it("sets useDB = false when chrome.storage.sync.get returns undefined", async () => {
    (chrome.storage.sync.get as jest.Mock).mockResolvedValue({})

    const instance = await SessionManager.getInstance()

    expect((instance as any).useDB).toBe(false)
  })

  it("sets useDB = false when chrome.storage.sync.get throws", async () => {
    (chrome.storage.sync.get as jest.Mock).mockRejectedValue(
      new Error("storage unavailable"),
    )

    const instance = await SessionManager.getInstance()

    expect((instance as any).useDB).toBe(false)
  })
})