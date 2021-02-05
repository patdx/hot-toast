"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspace = exports.getWorkspacePath = exports.getSourceFile = exports.addModuleImportToModule = exports.addModuleImportToRootModule = exports.removePackageJsonDependency = exports.createTestApp = exports.addPackageToPackageJson = exports.getProjectTargetOptions = exports.getProjectFromWorkspace = exports.addStyleToTarget = exports.installPackageJsonDependencies = void 0;
/* eslint-disable prefer-arrow/prefer-arrow-functions */
const ts = require("typescript");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const change_1 = require("@schematics/angular/utility/change");
const ng_ast_utils_1 = require("@schematics/angular/utility/ng-ast-utils");
const index_1 = require("@schematics/angular/utility/test/index");
const project_main_file_1 = require("./project-main-file");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
function installPackageJsonDependencies() {
    return (host, context) => {
        context.addTask(new tasks_1.NodePackageInstallTask());
        context.logger.log('info', `🔍 Installing packages...`);
        return host;
    };
}
exports.installPackageJsonDependencies = installPackageJsonDependencies;
function addStyleToTarget(project, targetName, host, assetPath, workspace) {
    const targetOptions = getProjectTargetOptions(project, targetName);
    if (!targetOptions.styles) {
        targetOptions.styles = [assetPath];
    }
    else {
        const existingStyles = targetOptions.styles.map((style) => typeof style === 'string' ? style : style.input);
        const hasBootstrapStyle = existingStyles.find((style) => style.includes(assetPath));
        if (!hasBootstrapStyle) {
            targetOptions.styles.unshift(assetPath);
        }
    }
    host.overwrite('angular.json', JSON.stringify(workspace, null, 2));
}
exports.addStyleToTarget = addStyleToTarget;
function getProjectFromWorkspace(workspace, projectName) {
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const project = workspace.projects[projectName || workspace.defaultProject];
    if (!project) {
        throw new Error(`Could not find project in workspace: ${projectName}`);
    }
    return project;
}
exports.getProjectFromWorkspace = getProjectFromWorkspace;
function getProjectTargetOptions(project, buildTarget) {
    const targetConfig = (project.architect && project.architect[buildTarget]) || (project.targets && project.targets[buildTarget]);
    if (targetConfig && targetConfig.options) {
        return targetConfig.options;
    }
    throw new Error(`Cannot determine project target configuration for: ${buildTarget}.`);
}
exports.getProjectTargetOptions = getProjectTargetOptions;
function sortObjectByKeys(obj) {
    return (Object.keys(obj)
        .sort()
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        .reduce((result, key) => (result[key] = obj[key]) && result, {}));
}
function addPackageToPackageJson(host, pkg, version) {
    if (host.exists('package.json')) {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        const sourceText = host.read('package.json').toString('utf-8');
        const json = JSON.parse(sourceText);
        if (!json.devDependencies) {
            json.devDependencies = {};
        }
        if (!json.dependencies[pkg]) {
            json.dependencies[pkg] = version;
            json.dependencies = sortObjectByKeys(json.dependencies);
        }
        host.overwrite('package.json', JSON.stringify(json, null, 2));
    }
    return host;
}
exports.addPackageToPackageJson = addPackageToPackageJson;
function createTestApp(runner, appOptions = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspaceTree = yield runner
            .runExternalSchematicAsync('@schematics/angular', 'workspace', {
            name: 'workspace',
            version: '8.2.0',
            newProjectRoot: 'projects',
        })
            .toPromise();
        return runner
            .runExternalSchematicAsync('@schematics/angular', 'application', Object.assign(Object.assign({}, appOptions), { name: 'ngx-bootstrap' }), workspaceTree)
            .toPromise();
    });
}
exports.createTestApp = createTestApp;
function removePackageJsonDependency(tree, dependencyName) {
    const packageContent = JSON.parse(index_1.getFileContent(tree, '/package.json'));
    delete packageContent.dependencies[dependencyName];
    tree.overwrite('/package.json', JSON.stringify(packageContent, null, 2));
}
exports.removePackageJsonDependency = removePackageJsonDependency;
function addModuleImportToRootModule(host, moduleName, src, project) {
    const modulePath = ng_ast_utils_1.getAppModulePath(host, project_main_file_1.getProjectMainFile(project));
    addModuleImportToModule(host, modulePath, moduleName, src);
}
exports.addModuleImportToRootModule = addModuleImportToRootModule;
function addModuleImportToModule(host, modulePath, moduleName, src) {
    const moduleSource = getSourceFile(host, modulePath);
    if (!moduleSource) {
        throw new schematics_1.SchematicsException(`Module not found: ${modulePath}`);
    }
    const changes = ast_utils_1.addImportToModule(moduleSource, modulePath, moduleName, src);
    const recorder = host.beginUpdate(modulePath);
    changes.forEach((change) => {
        if (change instanceof change_1.InsertChange) {
            recorder.insertLeft(change.pos, change.toAdd);
        }
    });
    host.commitUpdate(recorder);
}
exports.addModuleImportToModule = addModuleImportToModule;
function getSourceFile(host, path) {
    const buffer = host.read(path);
    if (!buffer) {
        throw new schematics_1.SchematicsException(`Could not find file for path: ${path}`);
    }
    const content = buffer.toString();
    return ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
}
exports.getSourceFile = getSourceFile;
function getWorkspacePath(host) {
    const possibleFiles = ['/angular.json', '/.angular.json'];
    const path = possibleFiles.filter((filePath) => host.exists(filePath))[0];
    return path;
}
exports.getWorkspacePath = getWorkspacePath;
function getWorkspace(host) {
    const path = getWorkspacePath(host);
    const configBuffer = host.read(path);
    if (configBuffer === null) {
        throw new schematics_1.SchematicsException(`Could not find (${path})`);
    }
    const content = configBuffer.toString();
    return core_1.parseJson(content, core_1.JsonParseMode.Loose);
}
exports.getWorkspace = getWorkspace;
//# sourceMappingURL=index.js.map