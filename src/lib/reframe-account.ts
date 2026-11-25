export const reframeCreditCheck = 'reframe-credit-check';
export const reframeCreditShortfall = 'reframe-credit-shortfall';

export type CreditShortfall = { requiredCredits?: number; currentCredits?: number; returnFocus: HTMLElement };
export type CreditCheck = {
  requiredCredits: number;
  returnFocus: HTMLElement;
  resolve: (accountId: string | null) => void;
  reject: (error: Error) => void;
};

export function checkReframeCredits(workspace: HTMLElement, requiredCredits: number, returnFocus: HTMLElement) {
  return new Promise<string | null>((resolve, reject) => {
    const handled = !workspace.dispatchEvent(new CustomEvent<CreditCheck>(reframeCreditCheck, {
      cancelable: true, detail: { requiredCredits, returnFocus, resolve, reject },
    }));
    if (!handled) reject(new Error('The account controls are still loading. Try again in a moment.'));
  });
}
