jQuery.noConflict();

(function ($, PLUGIN_ID) {
    'use strict';
    // ---------------Start get config-------------------
    let CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
    let CONFIGITEMS = [];
    let TRANSLATEFFIELDS = [];
    let LANGUAGELIST = [];
    let ISO_DEFAULT = "";
    CONFIGITEMS = CONFIG.config ? JSON.parse(CONFIG.config) : [];
    TRANSLATEFFIELDS = CONFIGITEMS.translateFields;
    LANGUAGELIST = CONFIGITEMS.languageList;
    ISO_DEFAULT = CONFIGITEMS.defaultLanguage;

    // ---------Start kintone events on edit and create page------------
    kintone.events.on(['app.record.edit.show', 'app.record.create.show'], async function (event) {
        const record = event.record;
        const deLang = ISO_DEFAULT;
        const schemaData = cybozu.data.page.SCHEMA_DATA;
        // ---------Start loop from tarnslate fields------------
        for await (let item of TRANSLATEFFIELDS) {
            // ---------Start Get data------------
            let translatedField = [];
            let oldField = "";
            let fieldEl = item.targeFields;
            let getFieldID = getFieldCode(schemaData, fieldEl.fieldCode);
            let fieldSelector = `.field-${getFieldID.id}`;
            // ----------Start mouse hover Get data-------------
            $(document).on('mouseover', fieldSelector, async function (e) {
                let timeout = setTimeout(async () => {
                    e.preventDefault();
                    let lastField = translatedField.length - 1; // Get last number of translate field array
                    if (translatedField.length == 0) {
                        createButtonFromDefault(fieldEl, getFieldID, deLang, e, fieldSelector, translatedField, oldField);
                    }
                    else if (fieldSelector === translatedField[lastField].fieldID) {
                        let fieldItems = translatedField[lastField].fieldISO; // Get last item of translate field array
                        createBtnFromTranslated(fieldEl, getFieldID, e, fieldItems, fieldSelector, translatedField, oldField);
                    } else {
                        createButtonFromDefault(fieldEl, getFieldID, deLang, e, fieldSelector, translatedField, oldField);
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
        async function createButtonFromDefault(fieldEl, getFieldID, deLang, e, fieldSelector, translatedField, oldField) {
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
                if (field.languageCode !== ISO_DEFAULT) { // Check the language code doesnot match the default language
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
                        if (translatedField.length == 0) {
                            let fieldType = getFieldType(record, getID).type;
                            await translateTor(fieldType, langClick, deLang, targetField);
                            oldField = {
                                fieldID: fieldSelector,
                                fieldISO: langClick
                            }
                            translatedField.push(oldField);
                        } else {
                            let isoSelete = "";
                            let langClick = field.languageCode;
                            let fieldType = "";
                            translatedField.forEach(async items => {
                                fieldType = getFieldType(record, getID).type;
                                isoSelete = items.fieldISO;
                            });
                            await translateTor(fieldType, langClick, isoSelete, targetField);
                            oldField = {
                                fieldID: fieldSelector,
                                fieldISO: langClick
                            }
                            translatedField.push(oldField);
                        }
                    });
                }
                return
            });

            $('body').append(translateButton);
            translateButton.on('mouseleave', function () {
                translateButton.remove();
            });
        };
        async function createBtnFromTranslated(fieldEl, getFieldID, e, fieldItems, fieldSelector, translatedField, oldField) {
            const oldTranslateButtone = $('#translate-button');
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
            let targetField = fieldEl.fieldCode;
            let oldButtonArray = [];
            $.each(LANGUAGELIST, function (i, field) {
                if (field.languageCode !== fieldItems && field.languageCode !== '') {
                    let getText = getFieldID.var;
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
                        let isoSelete = "";
                        let langClick = field.languageCode;
                        let fieldType = "";
                        translatedField.forEach(async items => {
                            fieldType = getFieldType(record, getText).type;
                            isoSelete = items.fieldISO;
                        });
                        await translateTor(fieldType, langClick, isoSelete, targetField);
                        oldField = {
                            fieldID: fieldSelector,
                            fieldISO: langClick
                        }
                        translatedField.push(oldField);
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
                let oldField = {
                    old: fieldLabel
                }
                oldButtonArray.push(oldField);
            } else {
                let lastButton = oldButtonArray.length - 1;
                if (fieldLabel !== oldButtonArray[lastButton].old) {
                    let oldButton = $(`.${targetField} button:contains(${oldButtonArray[lastButton].old})`);
                    oldButton.removeClass('kuc-button-1-15-0__button kuc-button-1-15-0__button--submit');
                    oldButton.addClass('kuc-button-1-15-0__button kuc-button-1-15-0__button--normal');
                    newButton = $(`.${targetField} button:contains(${fieldLabel})`);
                    newButton.addClass('kuc-button-1-15-0__button kuc-button-1-15-0__button--submit');
                    let oldField = {
                        old: fieldLabel
                    }
                    oldButtonArray.push(oldField);
                } else {
                    console.log("else");
                    newButton = $(`.${targetField} button:contains(${fieldLabel})`);
                    newButton.addClass('kuc-button-1-15-0__button kuc-button-1-15-0__button--submit');
                    let oldField = {
                        old: fieldLabel
                    }
                    oldButtonArray.push(oldField);
                }
            }
        };
        async function translateTor(fieldType, langClick, deLang, targetField) {
            // console.log(deLang);
            // console.log(langClick);
            let resp = kintone.app.record.get();
            let respText = '';
            let textTotl = resp.record[targetField].value;
            if (langClick === deLang) { return }
            if (targetField) {
                respText = await translateText(fieldType, textTotl || '', langClick, deLang);
                if (typeof respText === 'object') {
                    return respText;
                }
                resp.record[targetField].value = respText;
                kintone.app.record.set(resp);
            }
        };
        async function translateText(fieldType, textTotl, langClick, deLang) {
            let texts = textTotl;
            // console.log(texts);
            let translated = "";
            if (fieldType === "SINGLE_LINE_TEXT") {
                translated = await myMemoryApi(textTotl, deLang, langClick);
            }
            else if (fieldType === "MULTI_LINE_TEXT") {
                // alert("MULTI_LINE_TEXT");
                texts = texts.split('\n');
                // console.log(texts);
                for await (let item of texts) {
                    if (!item) continue;
                    // console.log(item);
                    let translateText = await myMemoryApi(item, deLang, langClick);
                    if (typeof translateText === 'object') {
                        return translateText;
                    }
                    translated += `${translateText}\n`;
                }
            }
            else if (fieldType === "RICH_TEXT") {
                const parser = new DOMParser();
                const textHtml = parser.parseFromString(texts, 'text/html');
                const textArray = [];
                const setTextArray = (node) => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                        textArray.push(node.textContent.trim());
                    } else {
                        for (const child of node.childNodes) {
                            setTextArray(child);
                        }
                    }
                };
                setTextArray(textHtml.body);
                for await (const item of textArray) {
                    if (item == '' || /^\s+$/.test(item)) {
                        texts = texts.replace(`${item}`, `${item}`);
                    } else {
                        texts = texts.replace(`${item}`, await myMemoryApi(item, deLang, langClick));
                    }
                }
                return texts;
            }
            return translated;
        };
        async function myMemoryApi(textTotl, deLang, langClick) {
            let trans = await axios({ method: 'GET', url: `https://api.mymemory.translated.net/get?q=${textTotl}&langpair=${deLang}|${langClick}` }).catch((err) => {
                throw new Error("Translate Error");
            });
            if (trans.status === 200) {
                let txt = trans.data.responseData.translatedText;
                var leadingSpaces = textTotl.match(/^\s*/)[0];
                var trailingSpaces = textTotl.match(/\s*$/)[0];
                return leadingSpaces + txt + trailingSpaces;
            } else {
                throw new Error(
                    'Translation request failed with status: ' +
                    response.status +
                    'MyMemory API status: ' +
                    response.data.responseStatus
                );
            }
        };
    });
    // ----------End kintone events on edit and create page------------
})(jQuery, kintone.$PLUGIN_ID);
