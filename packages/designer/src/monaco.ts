import type * as T from 'monaco-editor';
import { setupTypeAcquisition } from '@typescript/ata';
import typescript from 'typescript';

declare type AddExtraLibs = (code: string, path: string) => void;

function monacoComponment(): typeof T {
  return (window as any).monaco;
}

export function initMonacoLite(
  cb: (monaco: typeof T & { __monaco_lite__init__?: boolean }, editor: typeof T.editor) => void,
) {
  const monaco: typeof T & { __monaco_lite__init__?: boolean } = monacoComponment();
  if (!monaco || monaco.__monaco_lite__init__ || monaco.editor.getEditors().length == 0) {
    return;
  }
  monaco.__monaco_lite__init__ = true;
  cb(monaco, monaco.editor);
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
