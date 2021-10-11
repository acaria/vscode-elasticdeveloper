'use strict';

import * as vscode from 'vscode';
import * as constant from './constant';
import * as WorkspaceEnvironmentManager from './managers/workspaceEnvironmentManagerDecorator';
import * as HostEnvironmentManager from './managers/hostEnvironmentManagerDecorator';
import * as StatusbarEnvironmentManager from './managers/statusbarEnvironmentManagerDecorator';

import { LogManager } from './managers/logManager';
import { EnvironmentManager } from './managers/environmentManager';

import { Controller } from './controllers/controller';
import { QueryCodeLensController} from './controllers/queryCodeLensController';
import { EnvironmentCodeLensController } from './controllers/environmentCodeLensController';
import { EnvironmentCommandController } from './controllers/environmentCommandController';
import { EnvironmentTreeDataProviderController } from './feature/explorer/environmentTreeDataProviderController';
import { IndexTemplateCodeLensController } from './controllers/indexTemplateCodeLensController';
import { IndexTemplateCommandController } from './controllers/indexTemplateCommandController';
import { QueryCompletionItemController } from './feature/intelliSense/controllers/queryCompletionItemController';
import { QueryCommandController } from './controllers/queryCommandController';
import { IndexCommandController } from './controllers/indexCommandController';
import { ScriptCommandController } from './controllers/scriptCommandController';
import { IntellisenseCommandController } from './feature/intelliSense/controllers/intellisenseCommandController';

export function activate(context: vscode.ExtensionContext) {

    let configuration = vscode.workspace.getConfiguration();
    let value = configuration.get(constant.IntelliSenseConfigurationEnabled);

    LogManager.verbose('esreed extension activated');
    LogManager.verbose('esreed decorating EnvironmentManager');

    EnvironmentManager.decorateWith(WorkspaceEnvironmentManager.decorate(context));
    EnvironmentManager.decorateWith(HostEnvironmentManager.decorate());
    EnvironmentManager.decorateWith(StatusbarEnvironmentManager.decorate(context));

    LogManager.verbose('esreed loading controllers');

    let controllers: Controller[] = [];
    controllers.push(new QueryCodeLensController());
    controllers.push(new QueryCommandController());
    controllers.push(new EnvironmentCodeLensController());
    controllers.push(new EnvironmentCommandController());
    controllers.push(new EnvironmentTreeDataProviderController());
    controllers.push(new IndexTemplateCodeLensController());
    controllers.push(new IndexTemplateCommandController());
    controllers.push(new IndexCommandController());
    controllers.push(new ScriptCommandController());
    controllers.push(new IntellisenseCommandController());

    if(value) {
        controllers.push(new QueryCompletionItemController());
    }

    LogManager.verbose('esreed register controllers');

    for(let controller of controllers) {
        controller.register(context);
    }

    EnvironmentManager.init();
    LogManager.verbose('esreed done, the extension should now be ready. happy coding!');
}

export function deactivate() {
}
