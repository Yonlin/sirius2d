/**
 * Capabilities.js
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
    ss2d.Capabilities = Class
    (
        {
            STATIC:
            {
                pixelRatio : window.devicePixelRatio || 1,
                viewport :
                {
                    width:window.innerWidth,
                    height:window.innerHeight
                },
                screen :
                {
                    width:window.screen.availWidth * this.pixelRatio,
                    height:window.screen.availHeight * this.pixelRatio
                },
                iPhone : /iPhone/i.test(navigator.userAgent),
                iPhone4 : (this.iPhone && this.pixelRatio == 2),
                iPad : /iPad/i.test(navigator.userAgent),
                android : /android/i.test(navigator.userAgent),
                iOS : this.iPhone || this.iPad,
                mobile : this.iOS || this.android
            }
        }
    );
})();