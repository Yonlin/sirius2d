/**
 * WebGLUtil.js
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
    ss2d.WebGLUtil = Class
    (
        {
            STATIC:
            {
                GET_A_WEBGL_BROWSER : '' +
                    'This page requires a browser that supports WebGL.<br/>' +
                    '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>',

                OTHER_PROBLEM : '' +
                    "It doesn't appear your computer can support WebGL.<br/>" +
                    '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>',

                makeFailHTML : function(msg)
                {
                    return '' +
                        '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
                        '<td align="center">' +
                        '<div style="display: table-cell; vertical-align: middle;">' +
                        '<div style="">' + msg + '</div>' +
                        '</div>' +
                        '</td></tr></table>';
                },

                setupWebGL : function(canvas, opt_attribs)
                {
                    function showLink(str)
                    {
                        var container = canvas.parentNode;
                        if (container)
                        {
                            container.innerHTML = ss2d.WebGLUtil.makeFailHTML(str);
                        }
                    };

                    if (!window.WebGLRenderingContext)
                    {
                        showLink(ss2d.WebGLUtil.GET_A_WEBGL_BROWSER);
                        return null;
                    }

                    var context = ss2d.WebGLUtil.create3DContext(canvas, opt_attribs);
                    if (!context)
                    {
                        showLink(ss2d.WebGLUtil.OTHER_PROBLEM);
                    }
                    return context;
                },

                create3DContext : function(canvas, opt_attribs)
                {
                    var names;
                    var context = null;
                    names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
                    for (var ii = 0; ii < names.length; ++ii)
                    {
                        try {
                            context = canvas.getContext(names[ii], opt_attribs);
                        } catch(e) {}
                        if (context)
                        {
                            break;
                        }
                    }
                    return context;
                }
            }
        }
    );
})();