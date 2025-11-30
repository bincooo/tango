import type * as T from 'monaco-editor';
import { setupTypeAcquisition } from '@typescript/ata';
import typescript from 'typescript';

declare type AddExtraLibs = (code: string, path: string) => void;

function monacoComponment(): typeof T {
  return (window as any).monaco;
}

export function monacoSetting(callback: (monaco: typeof T, editor: typeof T.editor) => void) {
  const monaco: typeof T = monacoComponment();
  if (monaco) callback(monaco, monaco.editor);
}

export function addTypescriptExtra(addExtraLibs: AddExtraLibs) {
  return setupTypeAcquisition({
    projectName: 'Babel Plugin Playground',
    typescript,
    logger: console,
    delegate: {
      receivedFile: addExtraLibs,
    },
  });
}
