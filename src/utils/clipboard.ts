/**
 * TODO: Replace execCommand with navigator.clipboard
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
 * https://developer.mozilla.org/en-US/docs/Web/API/Clipboard
 *
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
 *
 * Currently the permission name is missing
 *
 * https://github.com/microsoft/TypeScript/issues/33923
 * https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API#permissions_interface
 */

const COPY = 'copy';

export function isClipboardEnabled(): boolean {
  return true;
}

export function copyToClipboard(value: string): void {
  const element: HTMLInputElement = document.getElementById('copy-to-clipboard') as HTMLInputElement;

  if (element && document.queryCommandSupported(COPY)) {
    element.focus();
    element.value = value;
    element.select();
    document.execCommand(COPY);
  }
}