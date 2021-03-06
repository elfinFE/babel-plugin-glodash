import {addDefault} from '@babel/helper-module-imports';

const CHAIN_ERROR = 'Lodash chain sequences are not supported by babel-plugin-elfin.'

export default function (babel) {
    const {types: t} = babel;
    return {
        name: 'elfin-glodash',
        visitor: {
            MemberExpression: {
                exit(path) {
                    if (!path.hub) return
                    const {file} = path.hub
                    const {node} = path
                    // 是以属性调用的形式使用 glodash.cloneDeep()
                    if (!t.isIdentifier(path.node.object, {name: 'glodash'})) return
                    const property = node.property
                    // 是否自定义了 glodash 变量
                    if (file.scope.getBinding('glodash') || !property) return
                    // module标示
                    const propertyName = property.name
                    // 不支持chain的链式调用
                    if (propertyName === 'chain') {
                        throw path.buildCodeFrameError(CHAIN_ERROR)
                    }
                    // 处理参数同名的情况
                    const {name} = addDefault(path, `lodash/${propertyName}`, {nameHint: propertyName})
                    path.replaceWith(t.identifier(name))
                },
            },
        }
    };
}
