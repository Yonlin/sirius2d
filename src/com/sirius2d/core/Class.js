/**
 * Class.js
 *
 * HTML5游戏开发者社区 QQ群:326492427 127759656 Email:siriushtml5@gmail.com
 * Copyright (c) 2014 Sirius2D www.Sirius2D.com www.html5gamedev.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function(globalNamespace)
{
    "use strict";

    /**
     *
     * @param method
     * @param name
     * @private
     */
    function applyMethodName(method, name)
    {
        method.toString = function () { return name; };
    }

    /**
     *
     * @param NewClass
     * @param name
     * @private
     */
    function applyConstructorName(NewClass, name)
    {
        NewClass.toString = function () { return name; };
    }

    /**
     *
     * @param NewClass
     * @param name
     * @private
     */
    function applyClassNameToPrototype(NewClass, name)
    {
        NewClass.prototype.toString = function () { return name; };
    }


    var Class = function (classPath, classDefinition, local)
    {
        var SuperClass, implementations, className, Initialize, ClassConstructor;

        if (arguments.length < 2)
        {
            classDefinition = classPath;
            classPath = "";
        }

        SuperClass = classDefinition['Extends'] || null;
        delete classDefinition['Extends'];

        implementations = classDefinition['Implements'] || null;
        delete classDefinition['Implements'];

        Initialize = classDefinition['initialize'] || null;
        delete classDefinition['initialize'];

        if (!Initialize)
        {
            if (SuperClass)
            {
                Initialize = function () { SuperClass.apply(this, arguments); };
            }
            else
            {
                Initialize = function () {};
            }
        }

        className = classPath.substr(classPath.lastIndexOf('.') + 1);
        ClassConstructor = new Function('initialize', 'return function ' + className + '() { initialize.apply(this, arguments); }')(Initialize);
        applyConstructorName(ClassConstructor, classPath);

        Class['inherit'](ClassConstructor, SuperClass);

        Class['implement'](ClassConstructor, implementations);

        applyClassNameToPrototype(ClassConstructor, classPath);

        Class['extend'](ClassConstructor, classDefinition, true);

        if(!local)
        {
            Class['namespace'](classPath, ClassConstructor);
        }

        return ClassConstructor;
    };

    /**
     *
     * @param target
     * @param extension
     * @param shouldOverride
     * @private
     */
    Class['augment'] = function (target, extension, shouldOverride)
    {
        var propertyName, property, targetHasProperty,
            propertyWouldNotBeOverriden, extensionIsPlainObject, className;

        for (propertyName in extension)
        {
            if (extension.hasOwnProperty(propertyName))
            {
                targetHasProperty = target.hasOwnProperty(propertyName);
                if (shouldOverride || !targetHasProperty)
                {
                    property = target[propertyName] = extension[propertyName];
                    if (typeof property === 'function')
                    {
                        extensionIsPlainObject = (extension.toString === Object.prototype.toString);
                        className = extensionIsPlainObject ? target.constructor : extension.constructor;
                        applyMethodName(property, className + "::" + propertyName);
                    }
                }
            }
        }
    };

    /**
     *
     * @param TargetClass
     * @param extension
     * @param shouldOverride
     * @private
     */
    Class['extend'] = function (TargetClass, extension, shouldOverride)
    {
        if (extension['STATIC'])
        {
            if(TargetClass.Super)
            {
                // add static properties of the super class to the class namespace
                Class['augment'](TargetClass, TargetClass.Super['_STATIC_'], true);
            }
            // add static properties and methods to the class namespace
            Class['augment'](TargetClass, extension['STATIC'], true);
            // save the static definitions into special var on the class namespace
            TargetClass['_STATIC_'] = extension['STATIC'];
            delete extension['STATIC'];
        }
        // add properties and methods to the class prototype
        Class['augment'](TargetClass.prototype, extension, shouldOverride);
    };

    /**
     *
     * @param SubClass
     * @param SuperClass
     * @private
     */
    Class['inherit'] = function (SubClass, SuperClass)
    {
        if (SuperClass)
        {
            var SuperClassProxy = function () {};
            SuperClassProxy.prototype = SuperClass.prototype;

            SubClass.prototype = new SuperClassProxy();
            SubClass.prototype.constructor = SubClass;
            SubClass.Super = SuperClass;

            Class['extend'](SubClass, SuperClass, false);
        }
    };

    /**
     *
     * @param TargetClass
     * @param implementations
     * @private
     */
    Class['implement'] = function (TargetClass, implementations)
    {
        if (implementations)
        {
            var index;
            if (typeof implementations === 'function')
            {
                implementations = [implementations];
            }
            for (index = 0; index < implementations.length; index += 1)
            {
                Class['augment'](TargetClass.prototype, implementations[index].prototype, false);
            }
        }
    };

    /**
     *
     * @param namespacePath
     * @param exposedObject
     * @private
     */
    Class['namespace'] = function (namespacePath, exposedObject)
    {
        if(typeof globalNamespace['define'] === "undefined")
        {
            var classPathArray, className, currentNamespace, currentPathItem, index;
            classPathArray = namespacePath.split('.');
            className = classPathArray[classPathArray.length - 1];
            currentNamespace = globalNamespace;
            for(index = 0; index < classPathArray.length - 1; index += 1)
            {
                currentPathItem = classPathArray[index];
                if(typeof currentNamespace[currentPathItem] === "undefined")
                {
                    currentNamespace[currentPathItem] = {};
                }
                currentNamespace = currentNamespace[currentPathItem];
            }
            currentNamespace[className] = exposedObject;
        }
    };

    if (typeof define !== "undefined")
    {
        define('Class', [], function () { return Class; });
    }
    // expose on global namespace like window (browser) or exports (node)
    else if (globalNamespace)
    {
        /** @expose */
        globalNamespace['Class'] = Class;
    }

})(typeof define !== "undefined" || typeof window === "undefined" ? exports : window);