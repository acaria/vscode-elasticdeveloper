'use strict'

import * as vscode from 'vscode';
import * as constant from '../constant'

import { EnvironmentController } from "./environmentController";
import { EnvironmentDocument } from '../parsers/environmentDocument';
import { IEnvironmentTreeNode } from '../feature/explorer/models/interfaces';

export class EnvironmentCommandController extends EnvironmentController  {

    public registerCommands() {
        this.registerCommand(constant.EnvironmentStatusCommandPing, () => { this.ping(this.environment); })
        this.registerCommand(constant.EnvironmentCommandPing, (input)=> { this.pingWithUri(input) });
        this.registerCommand(constant.EnvironmentExplorerCommandPing, (input)=> { this.pingWithNode(input) });
        this.registerCommand(constant.EnvironmentCommandSetAsTarget, (input)=> { this.setAsTargetWithUri(input) });
        this.registerCommand(constant.EnvironmentExplorerCommandSetAsTarget, (input)=> { this.setAsTargetWithNode(input) });
        this.registerCommand(constant.EnvironmentExplorerCommandOpenFile, (input)=> { this.openFileWithNode(input) });
    }

    public async pingWithUri(input:any) {

        let uri = this.getActiveDocumentUri(input, constant.EnvironmentLanguageId);

        if(uri) {

            let textDocument = await vscode.workspace.openTextDocument(uri);
            let text = textDocument.getText();
            let document = EnvironmentDocument.parse(text);

            if(document.environments.length > 0) {
                this.ping(document.environments[0]);
            }

        }

    }

    public async pingWithNode(input:IEnvironmentTreeNode) {
        this.ping(input.environment);
    }

    public async setAsTargetWithUri(input:any) {

        let uri = this.getActiveDocumentUri(input, constant.EnvironmentLanguageId);

        if(uri) {

            let textDocument = await vscode.workspace.openTextDocument(uri);
            let text = textDocument.getText();
            let document = EnvironmentDocument.parse(text);

            if(document.environments.length > 0) {
                this.setAsTarget(document.environments[0]);
            }

        }

    }

    public async setAsTargetWithNode(input:IEnvironmentTreeNode) {
        await this.setAsTarget(input.environment);
        input.parent.refresh();
    }

    public async openFileWithNode(input:IEnvironmentTreeNode) {
        let textDocument:vscode.TextDocument  = await vscode.workspace.openTextDocument(input.resourcePath);
        vscode.window.showTextDocument(textDocument);
    }
}
