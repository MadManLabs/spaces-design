/*
 * Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

define(function (require, exports, module) {
    "use strict";

    var React = require("react");

    var os = require("adapter/os"),
        synchronization = require("js/util/synchronization"),
        strings = require("i18n!nls/strings");

    var Graphic = require("jsx!./assets/Graphic"),
        Color = require("jsx!./assets/Color"),
        CharacterStyle = require("jsx!./assets/CharacterStyle"),
        LayerStyle = require("jsx!./assets/LayerStyle"),
        ColorTheme = require("jsx!./assets/ColorTheme"),
        Scrim = require("jsx!js/jsx/Scrim");

    /**
     * List of asset types in the CC libraries packge.
     * 
     * @private
     * @const
     */
    var ASSET_TYPES = {
        "color": "application/vnd.adobe.element.color+dcx",
        "graphic": "application/vnd.adobe.element.image+dcx",
        "characterstyle": "application/vnd.adobe.element.characterstyle+dcx",
        "layerstyle": "application/vnd.adobe.element.layerstyle+dcx",
        "brush": "application/vnd.adobe.element.brush+dcx",
        "colortheme": "application/vnd.adobe.element.colortheme+dcx"
    };

    var Library = React.createClass({
        propTypes: {
            library: React.PropTypes.object.isRequired
        },

        componentWillMount: function () {
            this._setTooltipThrottled = synchronization.throttle(os.setTooltip, os, 500);
        },

        /**
         * Selects the content of the input on focus.
         *
         * @private
         * @param {SyntheticEvent} event
         */
        _handleFocus: function (event) {
            event.target.scrollIntoViewIfNeeded();
            if (this.props.onFocus) {
                this.props.onFocus(event);
            }
        },

        /**
         * Render asset components based on type.
         *
         * @private
         * @param {string} type
         * @param {string} title
         * @param {Component} AssetComponent
         * @return {Component?}
         */
        _renderAssets: function (type, title, AssetComponent) {
            var assets = this.props.library.getFilteredElements(ASSET_TYPES[type]);

            if (assets.length === 0) {
                return null;
            }

            var components;
            if (type === "brush") {
                components = (
                    <div className="libraries__asset-brush">
                        {
                            assets.length === 1 ?
                                strings.LIBRARIES.BRUSHES_UNSUPPORTED_1 :
                                strings.LIBRARIES.BRUSHES_UNSUPPORTED_N.replace("%s", assets.length)
                        }
                    </div>
                );
            } else {
                components = assets.map(function (asset) {
                    return React.createElement(AssetComponent, {
                        key: asset.id,
                        element: asset,
                        keyObject: asset,
                        zone: Scrim.DROPPABLE_ZONE
                    });
                });
            }

            return (
                <div className="libraries__assets">
                    <div className="libraries__assets__title">
                        {title}
                    </div>
                    {components}
                </div>
            );
        },

        _getLibraryItems: function () {
            if (!this.props.library) {
                return null;
            }

            var elements = this._getColorAssets(this.props.library);

            return elements;
        },

        render: function () {
            var library = this.props.library;

            if (library.elements.length === 0) {
                // FIXME link should open in new window.
                return (
                    <div className={"libraries__content libraries__info " + this.props.className}>
                        <div className="libraries__info__title">
                            {strings.LIBRARIES.INTRO_TITLE}
                        </div>
                        <div className="libraries__info__body">
                            {strings.LIBRARIES.INTRO_BODY}
                        </div>
                        <div className="libraries__info__link">
                            <a href="https://helpx.adobe.com/creative-cloud/help/libraries.html">
                                {strings.LIBRARIES.INTRO_LINK_TITLE}
                            </a>
                        </div>
                    </div>
                );
            }

            var colorAssets = this._renderAssets("color", strings.LIBRARIES.COLORS, Color),
                colorThemeAssets = this._renderAssets("colortheme", strings.LIBRARIES.COLOR_THEMES, ColorTheme),
                charStyleAssets = this._renderAssets("characterstyle", strings.LIBRARIES.CHAR_STYLES, CharacterStyle),
                layerStyleAssets = this._renderAssets("layerstyle", strings.LIBRARIES.LAYER_STYLES, LayerStyle),
                graphicAssets = this._renderAssets("graphic", strings.LIBRARIES.GRAPHICS, Graphic),
                brushAssets = this._renderAssets("brush", strings.LIBRARIES.BRUSHES);

            return (
                <div className={"libraries__content " + this.props.className}>
                    {colorAssets}
                    {colorThemeAssets}
                    {charStyleAssets}
                    {layerStyleAssets}
                    {graphicAssets}
                    {brushAssets}
                </div>
            );
        }
    });

    module.exports = Library;
});
