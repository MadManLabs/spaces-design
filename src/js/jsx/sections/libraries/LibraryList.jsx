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
    

    var Datalist = require("jsx!js/jsx/shared/Datalist"),
        strings = require("i18n!nls/strings");

    var LibraryList = React.createClass({
        /**
         * Handles the item selection
         * Later on, we'll have "add new library" item in this list
         *
         * @private
         * @param {string} libraryID Selected item ID
         */
        _handleChange: function (libraryID) {
            this.props.onLibraryChange(libraryID);
        },

        /**
         * Given the libraries, creates the datalist friendly
         * options for the library picker
         *
         * @param {Array.<AdobeLibraryComposite>} libraries
         *
         * @private
         * @return {{title: String, id: string}}
         */
        _getLibraryList: function (libraries) {
            return libraries.map(function (library) {
                return {
                    title: library.name,
                    id: library.id
                };
            }).toList();
        },
        
        /**
         * Return library commands based on currently selected library.
         *
         * @private
         * @return {{title: String, id: string, type?: string }}
         */
        _getLibraryCommandOptions: function () {
            var selectedLibrary = this.props.selected,
                options = [
                    {
                        type: "placeholder",
                        id: "dividor"
                    },
                    {
                        title: strings.LIBRARIES.CREATE_LIBRARY,
                        id: "createLibrary"
                    }
                ];
            
            if (selectedLibrary) {
                options = options.concat([
                    {
                        title: strings.LIBRARIES.RENAME_LIBRARY.replace("%s", selectedLibrary.name),
                        id: "renameLibrary"
                    },
                    {
                        title: strings.LIBRARIES.DELETE_LIBRARY.replace("%s", selectedLibrary.name),
                        id: "deleteLibrary"
                    }
                ]);
            }

            return options;
        },

        render: function () {
            var libraryOptions = this._getLibraryList(this.props.libraries),
                libraryCommandOptions = this._getLibraryCommandOptions(),
                listOptions = libraryOptions.concat(libraryCommandOptions),
                selectedLibraryName = this.props.selected && this.props.selected.name,
                selectedLibraryID = this.props.selected && this.props.selected.id,
                listID = "libraries-" + this.props.document.id;

            return (
                <Datalist
                    list={listID}
                    className="dialog-libraries"
                    options={listOptions}
                    value={selectedLibraryName}
                    live={false}
                    onChange={this._handleChange}
                    defaultSelected={selectedLibraryID}
                    disabled={this.props.disabled} />
            );
        }
    });

    module.exports = LibraryList;
});
