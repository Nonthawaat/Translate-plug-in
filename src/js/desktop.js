jQuery.noConflict();

(function ($, Swal10, PLUGIN_ID) {
    'use strict';
    // ---------------Start get config-------------------
    let CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
    let CONFIGITEMS = [];
    let TRANSLATEFFIELDS = [];
    let LANGUAGELIST = [];
    let DEFAULT = "";
    CONFIGITEMS = CONFIG.config ? JSON.parse(CONFIG.config) : [];
    TRANSLATEFFIELDS = CONFIGITEMS.translateFields;
    LANGUAGELIST = CONFIGITEMS.languageList;
    DEFAULT = CONFIGITEMS.defaultLanguage;

    // ---------Start kintone events on edit and create page------------
    kintone.events.on(['app.record.edit.show', 'app.record.create.show'], async function (event) {
        try {
            const record = event.record;
            const schemaData = cybozu.data.page.SCHEMA_DATA;
            // ---------Start loop from tarnslate fields------------
            for await (let item of TRANSLATEFFIELDS) {
                // ---------Start Get data------------
                let translate = [];
                let oldField = "";
                let fieldEl = item.targeFields;
                let getFieldID = getFieldCode(schemaData, fieldEl.fieldCode);
                let fieldHover = `.field-${getFieldID.id}`;
                // ----------Start mouse hover Get data-------------
                $(document).on('mouseover', fieldHover, async function (e) {
                    let timeout = setTimeout(async () => {
                        e.preventDefault();
                        let lastField = translate.length - 1; // Get last number of translate field array
                        if (translate.length == 0) {
                            createButtonFromDefault(fieldEl, getFieldID, DEFAULT, e, fieldHover, translate, oldField);
                        }
                        else if (fieldHover === translate[lastField].fieldID) {
                            let fieldItems = translate[lastField].fieldISO; // Get last item of translate field array
                            createBtnFromTranslated(fieldEl, getFieldID, fieldItems, e, fieldHover, translate, oldField);
                        } else {
                            createButtonFromDefault(fieldEl, getFieldID, DEFAULT, e, fieldHover, translate, oldField);
                        }
                    }, 400);
                    $(this).on('mouseout', function () {
                        clearTimeout(timeout);
                    });
                });
            };
            // ------------------------------------------------------[Function]--------------------------------------------------
            function getFieldType(record, getID) {
                for (const key in record) {
                    if (key === getID) {
                        return record[key];
                    } else if (typeof record[key] === 'object') {
                        const result = getFieldType(record[key], getID);
                        if (result !== undefined) {
                            return result;
                        }
                    }
                }
            };
            function getFieldCode(schemaData, fieldCode) {
                for (const key in schemaData.table.fieldList) {
                    if (schemaData.table.fieldList[key].var === fieldCode) {
                        return schemaData.table.fieldList[key];
                    }
                }
                return null;
            };
            async function createButtonFromDefault(fieldEl, getFieldID, DEFAULT, e, fieldHover, translate, oldField) {
                const oldTranslateButtone = $('#translate-button');
                let targetField = fieldEl.fieldCode;
                let oldButtonArray = [];
                // ----------Start check old translate button-------------
                if (oldTranslateButtone.length) {
                    oldTranslateButtone.remove();
                }
                // ----------Start create translate button area-------------
                var translateButton = $('<div>').attr('id', 'translate-button').css({
                    position: 'absolute',
                    background: '#fff',
                    border: '2px solid #ccc',
                    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
                    padding: '5px',
                    left: e.pageX + 'px',
                    top: e.pageY + 'px',
                });
                // ----------Start loop from language list-------------
                $.each(LANGUAGELIST, function (i, field) {
                    if (field.languageCode !== DEFAULT) { // Check the language code doesnot match the default language
                        // ----------Start get data-------------
                        let getID = getFieldID.var;
                        let buttonLabel = "";
                        buttonLabel += field.buttonLabel + " ";
                        let langClick = field.languageCode;
                        let fieldLabel = field.buttonLabel;

                        // -----------End get data--------------
                        const hoverBtn = new Kuc.Button({
                            text: buttonLabel,
                            type: 'normal',
                            id: targetField,
                            className: targetField
                        });
                        translateButton.append(hoverBtn); // Addpend  
                        $(hoverBtn).on('click', async (e) => {
                            activeButton(targetField, fieldLabel, oldButtonArray);
                            let fieldType = getFieldType(record, getID).type;
                            if (translate.length == 0) {
                                await translateTor(fieldType, langClick, DEFAULT, targetField);
                            } else {
                                let isoTranslated = "";
                                translate.forEach(async items => {
                                    isoTranslated = items.fieldISO;
                                });
                                await translateTor(fieldType, langClick, isoTranslated, targetField);
                            }
                            oldField = {
                                fieldID: fieldHover,
                                fieldISO: langClick
                            }
                            translate.push(oldField);
                        });
                    }
                    return
                });

                $('body').append(translateButton);
                translateButton.on('mouseleave', function () {
                    translateButton.remove();
                });
            };
            async function createBtnFromTranslated(fieldEl, getFieldID, fieldItems, e, fieldHover, translate, oldField) {
                const oldTranslateButtone = $('#translate-button');
                let targetField = fieldEl.fieldCode;
                let oldButtonArray = [];
                if (oldTranslateButtone.length) {
                    oldTranslateButtone.remove();
                }
                var translateButton = $('<div>').attr('id', 'translate-button').css({
                    position: 'absolute',
                    background: '#fff',
                    border: '1px solid #ccc',
                    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
                    padding: '5px',
                    left: e.pageX + 'px',
                    top: e.pageY + 'px'
                });
                $.each(LANGUAGELIST, function (i, field) {
                    if (field.languageCode !== fieldItems) {
                        let getID = getFieldID.var;
                        let buttonLabel = "";
                        let fieldLabel = field.buttonLabel;
                        buttonLabel += field.buttonLabel + " ";
                        const hoverBtn = new Kuc.Button({
                            text: buttonLabel,
                            type: 'normal',
                            id: targetField,
                            className: targetField
                        });
                        translateButton.append(hoverBtn);
                        $(hoverBtn).on('click', async (e) => {
                            activeButton(targetField, fieldLabel, oldButtonArray);
                            let isoTranslated = "";
                            let fieldType = getFieldType(record, getID).type;
                            let langClick = field.languageCode;
                            translate.forEach(async items => {
                                isoTranslated = items.fieldISO;
                            });
                            await translateTor(fieldType, langClick, isoTranslated, targetField);
                            oldField = {
                                fieldID: fieldHover,
                                fieldISO: langClick
                            }
                            translate.push(oldField);
                        });
                    }
                });
                $('body').append(translateButton);
                translateButton.on('mouseleave', function () {
                    translateButton.remove();
                });
                return;
            };
            async function activeButton(targetField, fieldLabel, oldButtonArray) {
                let newButton = "";
                if (oldButtonArray.length == 0) {
                    newButton = $(`.${targetField} button:contains(${fieldLabel})`);
                    newButton.addClass('kuc-button-1-15-0__button kuc-button-1-15-0__button--submit');
                } else {
                    let lastButton = oldButtonArray.length - 1;
                    if (fieldLabel !== oldButtonArray[lastButton].old) {
                        let oldButton = $(`.${targetField} button:contains(${oldButtonArray[lastButton].old})`);
                        oldButton.removeClass('kuc-button-1-15-0__button kuc-button-1-15-0__button--submit');
                        oldButton.addClass('kuc-button-1-15-0__button kuc-button-1-15-0__button--normal');
                        newButton = $(`.${targetField} button:contains(${fieldLabel})`);
                        newButton.addClass('kuc-button-1-15-0__button kuc-button-1-15-0__button--submit');
                    } else {
                        newButton = $(`.${targetField} button:contains(${fieldLabel})`);
                        newButton.addClass('kuc-button-1-15-0__button kuc-button-1-15-0__button--submit');
                    }
                }
                let oldField = {
                    old: fieldLabel
                }
                oldButtonArray.push(oldField);
            };
            async function translateTor(fieldType, langClick, DEFAULT, targetField) {
                let getField = kintone.app.record.get();
                let textTotl = getField.record[targetField].value;
                if (langClick === DEFAULT) {
                    return
                } else if (textTotl) {
                    let getText = await translateText(fieldType, textTotl, langClick, DEFAULT);
                    getField.record[targetField].value = getText;
                    kintone.app.record.set(getField);
                }
            };
            async function translateText(fieldType, textTotl, langClick, DEFAULT) {
                let texts = textTotl;
                let translated = "";
                switch (fieldType) {
                    case "SINGLE_LINE_TEXT":
                        translated = await myMemoryApi(textTotl, DEFAULT, langClick);
                        break;
                    case "MULTI_LINE_TEXT":
                        texts = texts.split('\n');
                        for await (let item of texts) {
                            if (!item) continue;
                            let translateText = await myMemoryApi(item, DEFAULT, langClick);
                            translated += `${translateText}\n`;
                        }
                        break;
                    case "RICH_TEXT":
                        const parser = new DOMParser();
                        const textHtml = parser.parseFromString(texts, 'text/html');
                        const textArray = [];
                        function setTextArray(element) {
                            if (element.nodeType === element.TEXT_NODE && element.textContent.trim() !== '') {
                                textArray.push(element.textContent.trim());
                            } else {
                                for (const child of element.childNodes) {
                                    setTextArray(child);
                                }
                            }
                        };
                        setTextArray(textHtml.body);
                        for await (const textItem of textArray) {
                            texts = texts.replace(`${textItem}`, await myMemoryApi(textItem, DEFAULT, langClick));
                        }
                        return texts;
                    default:
                        break;
                }
                return translated;
            }
            async function myMemoryApi(textTotl, DEFAULT, langClick) {
                let trans = await axios({ method: 'GET', url: `https://api.mymemory.translated.net/get?q=${textTotl}&langpair=${DEFAULT}|${langClick}` }).catch((err) => {
                    throw new Error("Translate Error");
                });
                if (trans.status === 200) {
                    let textFromTrans = trans.data.responseData.translatedText;
                    return textFromTrans;
                } else {
                    throw new Error(
                        'Translation status: ' + response.status +
                        'MyMemory API text: ' + response.data.responseStatus
                    );
                }
            };
        } catch (error) {
            return Swal10.fire({
                icon: "error",
                title: "",
                html: error.message || error,
            });
        }
    });
    // ----------End kintone events on edit and create page------------
})(jQuery, Sweetalert2_10.noConflict(true), kintone.$PLUGIN_ID);
