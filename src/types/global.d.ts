// global.d.ts

// ---- URLPattern ----
interface URLPatternInit {
  protocol?: string;
  username?: string;
  password?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
  baseURL?: string;
}

declare class URLPattern {
  constructor(input?: string | URLPatternInit, baseURL?: string);
  test(input: string | URLPatternInit, baseURL?: string): boolean;
  exec(input: string | URLPatternInit, baseURL?: string): Record<string, unknown> | null;
}

// ---- Navigation API ----
type NavigationType = "reload" | "push" | "replace" | "traverse";

interface NavigationHistoryEntry {
  id: string;
  key: string;
  url: string;
  index: number;
  sameDocument: boolean;
  getState(): unknown;
}

interface NavigationOptions {
  state?: any;
  info?: any;
  history?: "push" | "replace" | "auto";
}

// --- NavigationEvent ---
interface NavigationEventInit extends EventInit {
  navigationType?: NavigationType;
  destination: NavigationHistoryEntry;
  canTransition?: boolean;
  userInitiated?: boolean;
  hashChange?: boolean;
  signal: AbortSignal;
  info?: any;
}

declare class NavigationEvent extends Event {
  constructor(type: string, eventInitDict: NavigationEventInit);

  readonly navigationType: NavigationType;
  readonly destination: NavigationHistoryEntry;
  readonly canTransition: boolean;
  readonly userInitiated: boolean;
  readonly hashChange: boolean;
  readonly signal: AbortSignal;
  readonly info: any;

  // Allows overriding default navigate behavior
  intercept(options?: { handler?: () => void }): void;
  scroll(): void;
}

// --- Navigation itself ---
interface NavigationEventMap {
  navigate: NavigationEvent;
  navigateerror: Event;
  navigatesuccess: Event;
  currententrychange: Event;
}

declare class Navigation {
  readonly currentEntry: NavigationHistoryEntry | null;
  readonly transition: any;

  entries(): NavigationHistoryEntry[];
  updateCurrentEntry(options: { state?: any; info?: any }): void;

  navigate(url: string, options?: NavigationOptions): Promise<void>;
  reload(options?: NavigationOptions): Promise<void>;
  back(): Promise<void>;
  forward(): Promise<void>;
  traverseTo(key: string, options?: NavigationOptions): Promise<void>;

  onnavigate: ((this: Navigation, ev: NavigationEvent) => any) | null;
  onnavigatesuccess: ((this: Navigation, ev: Event) => any) | null;
  onnavigateerror: ((this: Navigation, ev: Event) => any) | null;
  oncurrententrychange: ((this: Navigation, ev: Event) => any) | null;

  addEventListener<K extends keyof NavigationEventMap>(
    type: K,
    listener: (this: Navigation, ev: NavigationEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
}

declare var navigation: Navigation;
