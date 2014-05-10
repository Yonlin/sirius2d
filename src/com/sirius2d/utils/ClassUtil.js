/**
 * ClassUtil.js
 *
 * HTML5游戏开发者社区 QQ群:326492427 127759656 Email:siriushtml5@gmail.com
 * Copyright (c) 2011 Sirius2D www.Sirius2D.com www.html5gamedev.org
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

(function()
{
    ss2d.ClassUtil = Class
    (
        {
            STATIC:
            {
                construct : function(cls, properties, parameters)
                {
                    if (!cls) return null;
                    var instance;
                    if (parameters)
                    {
                        switch( parameters.length )
                        {
                            case 0:
                                instance = new cls( );
                                break;
                            case 1:
                                instance = new cls( parameters[0] );
                                break;
                            case 2:
                                instance = new cls( parameters[0], parameters[1] );
                                break;
                            case 3:
                                instance = new cls( parameters[0], parameters[1], parameters[2] );
                                break;
                            case 4:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3] );
                                break;
                            case 5:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3], parameters[4] );
                                break;
                            case 6:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5] );
                                break;
                            case 7:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6] );
                                break;
                            case 8:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7] );
                                break;
                            case 9:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7], parameters[8] );
                                break;
                            case 10:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7], parameters[8], parameters[9] );
                                break;
                            default:
                                return null;
                        }
                    }
                    else instance = new cls( );
                    if (properties)
                    {
                        for (var key in properties)
                        {
                            if (instance.hasOwnProperty(key)) instance[key] = properties[key];
                        }
                    }
                    return instance;
                }
            }
        }
    );
})();