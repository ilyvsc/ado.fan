import {
  SiFirefoxbrowser,
  SiGooglechrome,
  SiSafari,
} from "@icons-pack/react-simple-icons";
import { Compass, RefreshCcw } from "lucide-react";

import type { FC } from "react";

const NoScriptError: FC = () => {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-12">
        <section className="space-y-4">
          <header className="space-y-3 text-center">
            <h1 className="text-2xl font-medium tracking-tight">
              JavaScript Required
            </h1>
            <p className="text-sm text-white/60">
              Enable JavaScript in your browser to continue
            </p>
          </header>

          <div className="space-y-2">
            <h2 className="text-sm font-medium text-white/80">
              Enable JavaScript in your browser:
            </h2>
            <ul className="grid gap-3 text-sm sm:grid-cols-2">
              <li className="flex gap-3 rounded border border-white/10 bg-white/5 p-3">
                <SiGooglechrome className="h-4 w-4 shrink-0 text-white/60" />
                <span className="text-white/80">
                  <strong className="text-white">Chrome</strong>
                  <br />
                  Settings → Privacy & Security → Site Settings
                </span>
              </li>
              <li className="flex gap-3 rounded border border-white/10 bg-white/5 p-3">
                <SiFirefoxbrowser className="h-4 w-4 shrink-0 text-white/60" />
                <span className="text-white/80">
                  <strong className="text-white">Firefox</strong>
                  <br />
                  <code className="rounded bg-white/10 px-1 py-0.5 text-xs">
                    about:config
                  </code>{" "}
                  →{" "}
                  <code className="rounded bg-white/10 px-1 py-0.5 text-xs">
                    javascript.enabled
                  </code>{" "}
                  → true
                </span>
              </li>
              <li className="flex gap-3 rounded border border-white/10 bg-white/5 p-3">
                <SiSafari className="h-4 w-4 shrink-0 text-white/60" />
                <span className="text-white/80">
                  <strong className="text-white">Safari</strong>
                  <br />
                  Preferences → Security → Enable JavaScript
                </span>
              </li>
              <li className="flex gap-3 rounded border border-white/10 bg-white/5 p-3">
                <Compass className="h-4 w-4 shrink-0 text-white/60" />
                <span className="text-white/80">
                  <strong className="text-white">Edge</strong>
                  <br />
                  Settings → Site permissions → JavaScript
                </span>
              </li>
            </ul>
          </div>

          <footer className="space-y-2 text-center">
            <p className="text-xs text-white/60">
              Some ad blockers may block JavaScript. This page has absolutely no ads,
              so you can safely disable your ad blocker here.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-white/40">
              <RefreshCcw className="h-3 w-3" />
              Refresh after enabling
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default NoScriptError;
