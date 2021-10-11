'use strict'

import * as vscode from 'vscode';
import * as constant from "../constant";
import { EnvironmentManagerDecorator } from "./environmentManagerDecorator";
import { EnvironmentManager } from "./environmentManager";

export class StatusbarEnvironmentManagerDecorator extends EnvironmentManagerDecorator {

    private statusBarItem: vscode.StatusBarItem;
    private _context: vscode.ExtensionContext;

    constructor(context:vscode.ExtensionContext, manager:EnvironmentManager) {
        super(manager);

        this._context = context;
    }

    public async init() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = `${constant.CommandPrefix}.${constant.EnvironmentStatusCommandPing}`;
        this.statusBarItem.color = "#00FF00";

        this._context.subscriptions.push(this.statusBarItem);
        this._context.subscriptions.push(vscode.commands.registerCommand(constant.OnEnvironmentChanged, () => {
            this.updateStatusBarItem();
        }))

        this.updateStatusBarItem();
    }

    private updateStatusBarItem() {
        if (this._environmentManager.environment) {
            this.statusBarItem.text = `$(search-view-icon) ${this._environmentManager.environment.name}`;
            this.statusBarItem.show();
        } else {
            this.statusBarItem.hide();
        }
    }
}

export function decorate(context:vscode.ExtensionContext) {
    return (manager) => {
        let decoratedManager = new StatusbarEnvironmentManagerDecorator(context, manager);
        decoratedManager.init();

        // EnvironmentManager.subscribe((eventName) => {
        //   if (eventName === "environment.changed") {
        //     this.updateStatusBarItem();
        //   }
        // });

        return decoratedManager;
    }
}
