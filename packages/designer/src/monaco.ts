import type * as monacoTypes from 'monaco-editor';
import { setupTypeAcquisition } from '@typescript/ata';
import typescript from 'typescript';

declare type AddExtraLibs = (code: string, path: string) => void;

function globalMonacoEditor(): typeof monacoTypes {
  return (window as any).monaco;
}

export function monacoInitialize(callback: (monaco: typeof monacoTypes) => void) {
  const monaco: typeof monacoTypes = globalMonacoEditor();
  if (monaco) callback(monaco);
}

export function createTypes(addExtraLibs: AddExtraLibs) {
  return setupTypeAcquisition({
    projectName: 'Babel Plugin Playground',
    typescript,
    logger: console,
    delegate: {
      receivedFile(code, path) {
        addExtraLibs(code, path);
      },
    },
  });
}
