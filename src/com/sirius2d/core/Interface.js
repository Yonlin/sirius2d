/**
 * Interface.js
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

(function (globalNamespace)
{
    function defineInterfaceModule(Class)
    {
        /**
         * @constructor
         */
        var ImplementationMissingError = function (message)
        {
            this.name = "ImplementationMissingError";
            this.message = (message || "");
        };

        ImplementationMissingError.prototype = Error.prototype;

        function createExceptionThrower(interfaceName, methodName, expectedType)
        {
            return function()
            {
                var message = 'Missing implementation for <' + this + '::' + methodName + '> defined by interface ' + interfaceName;
                throw new ImplementationMissingError(message);
            };
        }

        var Interface = function(path, definition, local)
        {
            if(typeof path !== 'string')
            {
                throw new Error('Please give your interface a name. Pass "true" as last parameter to avoid global namespace pollution');
            }

            var interfaceName = path.substr(path.lastIndexOf('.') + 1),
                methodName,
                property;

            /*jslint evil: true */
            var InterfaceConstructor = new Function('return function ' + interfaceName + '() {}')();

            for(methodName in definition)
            {
                if(definition.hasOwnProperty(methodName))
                {
                    property = definition[methodName];
                    InterfaceConstructor.prototype[methodName] = createExceptionThrower(path, methodName, property);
                }
            }

            if(!local)
            {
                Class['namespace'](path, InterfaceConstructor);
            }
            InterfaceConstructor.toString = function () { return interfaceName; };
            return InterfaceConstructor;
        };

        Interface['ImplementationMissingError'] = ImplementationMissingError;
        return Interface;
    }

    // Return as AMD module or attach to head object
    if (typeof define !== "undefined")
    {
        define('Interface', ['Class'], function (Class) { return defineInterfaceModule(Class); });
    }
    // expose on global namespace (browser)
    else if (typeof window !== "undefined")
    {
        /** @expose */
        globalNamespace['Interface'] = defineInterfaceModule(globalNamespace['Class']);
    }
    // expose on global namespace (node)
    else
    {
        var Class = require('./Class')['Class'];
        globalNamespace.Interface = defineInterfaceModule(Class);
    }
}(typeof define !== "undefined" || typeof window === "undefined" ? exports : window));