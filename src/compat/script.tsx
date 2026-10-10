import type { ScriptHTMLAttributes } from 'react';

type Props = ScriptHTMLAttributes<HTMLScriptElement> & {
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker';
};

export default function Script({ strategy: _strategy, ...props }: Props) {
  return <script {...props} />;
}
