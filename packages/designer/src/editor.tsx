import React, { useRef, useEffect, useCallback } from 'react';
import { Box } from 'coral-system';
import { MultiEditor, MultiEditorProps } from '@music163/tango-ui';
import { observer, useDesigner, useWorkspace } from '@music163/tango-context';

import { monacoSetting, addTypescriptExtra } from './monaco';
import './editor.scss';
import { MonacoJsxSyntaxHighlight, getWorker } from 'monaco-jsx-syntax-highlight';

const ideConfig = {
  // disableFileOps: {
  //   add: true,
  //   delete: true,
  // },
  // disableFolderOps: {
  //   add: true,
  //   delete: true,
  //   rename: true,
  // },
  disablePrettier: true,
  disableEslint: true,
  saveWhenBlur: true,
  // disableSetting: true,
  useFileMenu: true,
};

export type CodeEditorProps = Partial<MultiEditorProps>;

export const CodeEditor = observer((props: CodeEditorProps) => {
  const editorRef = useRef(null);
  const workspace = useWorkspace();
  const designer = useDesigner();
  const files = workspace.listFiles();
  const activeFile = workspace.activeFile;

  let loc: any; // 记录视图代码的选中位置
  const selectNode = workspace.selectSource.firstNode;
  if (selectNode && activeFile === workspace.activeViewFile) {
    loc = selectNode.loc;
  }

  useEffect(() => {
    editorRef.current?.refresh(files, activeFile, loc);

    monacoSetting((monaco, editor) => {
      // ✅ 启用 TSX 支持
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
        allowUnusedLabels: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.ESNext,
      });

      // ✅ TSX node 高亮
      const monacoJsxSyntaxHighlight = new MonacoJsxSyntaxHighlight(getWorker(), monaco);

      editor.getEditors().forEach((ed) => {
        const { highlighter, dispose } = monacoJsxSyntaxHighlight.highlighterBuilder(
          {
            editor: ed,
          },
          {
            jsxTagCycle: 6,
          },
        );
        highlighter();
        ed.onDidChangeModelContent(() => {
          highlighter();
        });
      });

      // ✅ 忽略类型异常
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
      });

      // ✅ 注册类型提示
      // const ata = addTypescriptExtra((code, path) => {
      //   monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`);
      // });
      // if (!!editorRef.current) {
      //   ata(editorRef.current.getValue(activeFile));
      // }
    });
  }, [files, activeFile, loc]);

  const fileSave = useCallback(
    (path: string, value: string) => {
      workspace.updateFile(path, value, false);
    },
    [workspace],
  );

  const handleFileChange = useCallback(
    (type: string, info: any) => {
      switch (type) {
        case 'addFile':
          workspace.addFile(info.path, info.value);
          break;
        case 'deleteFile':
        case 'deleteFolder':
          workspace.removeFile(info.path);
          break;
        case 'renameFile':
          workspace.renameFile(info.path, info.newpath);
          workspace.setActiveFile(info.newpath);
          break;
        case 'renameFolder':
          workspace.renameFolder(info.path, info.newpath);
          break;
        case 'addFolder':
        default:
          break;
      }
    },
    [workspace],
  );

  const handlePathChange = useCallback(
    (path: string) => {
      workspace.setActiveFile(path);
    },
    [workspace],
  );

  const borderStyle =
    designer.activeView === 'dual'
      ? {
          borderLeft: 'solid 1px var(--tango-colors-line2)',
          borderRight: 'solid 1px var(--tango-colors-line2)',
        }
      : {};

  return (
    <Box display="flex" flexDirection="row" height="100%" bg="white" {...borderStyle}>
      <MultiEditor
        ref={editorRef}
        options={{
          fontSize: 14,
          automaticLayout: true,
        }}
        ideConfig={ideConfig}
        onFileSave={fileSave}
        onPathChange={handlePathChange}
        onFileChange={handleFileChange}
        defaultPath={activeFile}
        defaultTheme="GithubLightDefault"
        defaultFiles={files}
        {...props}
      />
    </Box>
  );
});
