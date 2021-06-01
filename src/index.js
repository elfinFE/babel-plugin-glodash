import {addDefault} from '@babel/helper-module-imports'

const CHAIN_ERROR = 'Lodash chain sequences are not supported by babel-plugin-elfin.'

function transformMemberExp(rootPath, path, t) {
    const {node, scope} = path
    const objectPath = path.get('object')
    if (objectPath.isMemberExpression()) {
        transformMemberExp(rootPath, objectPath, t)
        return
    }
    if (!t.isIdentifier(node.object, {name: 'glodash'})) return
    const property = node.property
    // 是否自定义了 glodash 变量
    if (scope.getBinding('glodash') || !property) return
    // module标示
    const propertyName = property.name
    // 不支持chain的链式调用
    if (propertyName === 'chain') {
        throw path.buildCodeFrameError(CHAIN_ERROR)
    }
    // 处理参数同名的情况
    const {name} = addDefault(rootPath, `lodash/${propertyName}`, {nameHint: propertyName})
    path.replaceWith(t.identifier(name))
}

export default function (babel) {
    const {types: t} = babel;
    return {
        name: 'elfin-glodash',
        visitor: {
            CallExpression(path) {
                const calleePath = path.get('callee')
                if (calleePath.isMemberExpression()) {
                    transformMemberExp(path, calleePath, t)
                }
            },
            VariableDeclarator(path) {
                const initPath = path.get('init')
                if (initPath.isMemberExpression()) {
                    transformMemberExp(path, initPath, t)
                }
                // TODO: Destructuring assignment support
            },
        }
    };
}
