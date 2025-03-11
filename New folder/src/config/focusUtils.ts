// utils/focusUtils.ts
export function focusFirstInput(element: HTMLElement | null) {
    if (!element) return;
    const firstInput = element.querySelector('input, select, textarea') as HTMLElement;
    if (firstInput) {
      firstInput.focus();
    }
  }