import React, { useState } from 'react';
import { Box } from 'coral-system';
import { Button, Space } from 'antd';
import {
  Designer,
  DesignerPanel,
  SettingPanel,
  Sidebar,
  Toolbar,
  WorkspacePanel,
  WorkspaceView,
  CodeEditor,
  Sandbox,
  DndQuery,
  themeLight,
} from '@music163/tango-designer';
import { createEngine, Workspace } from '@music163/tango-core';
import { Logo, ProjectDetail, bootHelperVariables } from '@/helpers';
import prototypes from '../helpers/prototypes';
import {
  AppstoreAddOutlined,
  BuildOutlined,
  ClusterOutlined,
  createFromIconfontCN,
} from '@ant-design/icons';
import { mailFiles } from '@/helpers/mail-files';
import { readFiles, saveFile } from '@/helpers/fetch-files';

// 防抖
import { debounce } from 'lodash';

// 1. 实例化工作区
let workspace = new Workspace({
  entry: '/src/index.js',
  files: mailFiles,
  prototypes,
});

// @ts-ignore
window.__workspace__ = workspace;

// 3. 沙箱初始化
const sandboxQuery = new DndQuery({
  context: 'iframe',
});

// 4. 图标库初始化（物料面板和组件树使用了 iconfont 里的图标）
createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_2891794_151xsllxqd7.js',
});

let inited = false;

const publishFile = (() => {
  let ready = false;
  return debounce(() => {
    if (!inited) {
      return;
    }

    if (!ready) {
      ready = true;
      return;
    }

    const file = workspace.getFile(workspace.activeFile);
    saveFile(file.filename, file.code);
  }, 1000);
})();

/**
 * 5. 平台初始化，访问 https://local.netease.com:6006/
 */
export default function App() {
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuData, setMenuData] = useState({});

  // 2. 引擎初始化
  const [engine, setEngine] = useState(
    createEngine({
      workspace,
    }),
  );

  if (!inited) {
    setMenuLoading(true);
    readFiles().then((files) => {
      workspace = new Workspace({
        entry: '/src/index.tsx',
        files,
        prototypes,
      });

      setEngine(
        createEngine({
          workspace,
        }),
      );
      setMenuLoading(false);
    });

    inited = true;
  }

  return (
    <Designer
      theme={themeLight}
      engine={engine}
      config={{
        customActionVariables: bootHelperVariables,
        customExpressionVariables: bootHelperVariables,
      }}
      sandboxQuery={sandboxQuery}
    >
      <DesignerPanel
        logo={<Logo />}
        description={<ProjectDetail />}
        actions={
          <Box px="l">
            <Toolbar>
              <Toolbar.Item key="history" placement="left" />
              <Toolbar.Item key="preview" placement="left" />
              <Toolbar.Item key="modeSwitch" placement="right" />
              <Toolbar.Item key="togglePanel" placement="right" />
              <Toolbar.Separator />
              <Toolbar.Item placement="right">
                <Space>
                  <Button type="primary" onClick={publishFile}>
                    发布
                  </Button>
                </Space>
              </Toolbar.Item>
            </Toolbar>
          </Box>
        }
      >
        <Sidebar>
          <Sidebar.Item
            key="components"
            label="组件"
            icon={<AppstoreAddOutlined />}
            widgetProps={{
              menuData,
              loading: menuLoading,
            }}
          />
          <Sidebar.Item key="outline" label="结构" icon={<BuildOutlined />} />
          <Sidebar.Item
            key="dependency"
            label="依赖"
            icon={<ClusterOutlined />}
            isFloat
            width={800}
          />
        </Sidebar>
        <WorkspacePanel>
          <WorkspaceView mode="design">
            <Sandbox
              bundlerURL="https://local.bincooo.com"
              onMessage={(e: any) => {
                if (e.type === 'done') {
                  const sandboxWindow: any = sandboxQuery.window;
                  if (sandboxWindow.TangoCustom) {
                    if (sandboxWindow.TangoCustom.menuData) {
                      setMenuData(sandboxWindow.TangoCustom.menuData);
                      engine.designer.setMenuData(sandboxWindow.TangoCustom.menuData);
                    }
                    if (sandboxWindow.TangoCustom.prototypes) {
                      workspace.setComponentPrototypes(sandboxWindow.TangoCustom.prototypes);
                    }
                  }
                  setMenuLoading(false);
                  publishFile();
                }
              }}
              navigatorExtra={<Button size="small">hello world</Button>}
            />
          </WorkspaceView>
          <WorkspaceView mode="code">
            <CodeEditor />
          </WorkspaceView>
        </WorkspacePanel>
        <SettingPanel />
      </DesignerPanel>
    </Designer>
  );
}
