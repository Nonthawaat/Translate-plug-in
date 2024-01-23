jQuery.noConflict();

(function ($, Swal10, PLUGIN_ID) {
    'use strict';
    // var CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);

    let CONFIG = {
        defaultLanguage: "EN",
        languageList: [
            {
                language: "English",
                languageCode: "EN",
                buttonLlabel: "English button",
                languageIso: "ENG"
            },
            {
                language: "japanese",
                languageCode: "JA",
                buttonLlabel: "japanese button",
                languageIso: "JPN"
            },
            {
                language: "Lao",
                languageCode: "LO",
                buttonLlabel: "Lao button",
                languageIso: "LAO"
            },
            {
                language: "Thai",
                languageCode: "TH",
                buttonLlabel: "Thai button",
                languageIso: "THA"
            }
        ],
        translateFfields: [
            {
                itemCode: "ITEM_0",
                targetFields: {
                    fieldCode: "TEXTPFIELD_1",
                    fieldName: "TEXTPFIELD_1",
                }
            },
            {
                itemCode: "ITEM_1",
                targetFields: {
                    fieldCode: "TEXTPAREA_1",
                    fieldName: "TEXTPAREA_1",
                }
            },
            {
                itemCode: "ITEM_2",
                targetFields: {
                    fieldCode: "RICHTEXT_1",
                    fieldName: "RICHTEXT_1",
                }
            },
            {
                itemCode: "ITEM_4",
                targetFields: {
                    fieldCode: "TEXTPFIELD_2",
                    fieldName: "TEXTPFIELD_2",
                }
            },
            {
                itemCode: "ITEM_5",
                targetFields: {
                    fieldCode: "TEXTPFIELD_3",
                    fieldName: "TEXTPFIELD_3",
                }
            },
            {
                itemCode: "ITEM_6",
                targetFields: {
                    fieldCode: "TEXTPAREA_2",
                    fieldName: "TEXTPAREA_2",
                }
            },
            {
                itemCode: "ITEM_7",
                targetFields: {
                    fieldCode: "TEXTPAREA_3",
                    fieldName: "TEXTPAREA_3",
                }
            },
            {
                itemCode: "ITEM_8",
                targetFields: {
                    fieldCode: "RICHTEXT_2",
                    fieldName: "RICHTEXT_2",
                }
            },
            {
                itemCode: "ITEM_9",
                targetFields: {
                    fieldCode: "RICHTEXT_3",
                    fieldName: "RICHTEXT_3",
                }
            }
        ]
    }
    const TRANSLATEFFIELDS = CONFIG.translateFfields;
    const LANGUAGELIST = CONFIG.languageList;
    const DEFASULTLANGUAGE = CONFIG.defaultLanguage || LANGUAGELIST[0].languageCode;
    function findPropertyById(obj, targetId) {
        for (const key in obj) {
            if (key === targetId) {
                return obj[key];
            } else if (typeof obj[key] === 'object') {
                const result = findPropertyById(obj[key], targetId);
                if (result !== undefined) {
                    return result;
                }
            }
        }
    }
    function getFieldData(data, fieldCode) {
        for (const key in data.table.fieldList) {
            if (data.table.fieldList[key].var === fieldCode) {
                return data.table.fieldList[key];
            }
        }
        return null;
    }

    kintone.events.on(['app.record.edit.show', 'app.record.create.show'], async function (event) {
        const record = event.record;
        const deLang = DEFASULTLANGUAGE;
        const schema_data = cybozu.data.page.SCHEMA_DATA;
        for await (let item of TRANSLATEFFIELDS) {
            let fieldEl = item.targetFields;
            let translateArray = [];
            let fieldtranslated = "";
            for (let obj = 0; obj < LANGUAGELIST.length; obj++) {
                // console.log(obj);
                if (!fieldEl.fieldCode || fieldEl.fieldCode == '') continue;
                let data = getFieldData(schema_data, fieldEl.fieldCode);
                // console.log(data);
                let fieldId = `.field-${data.id}`;
                // console.log(fieldId);
                $(document).on('mouseover', fieldId, async function (e) {
                    let timeout = setTimeout(async () => {
                        e.preventDefault();
                        if (translateArray.length == 0) {
                            createBtnFromDefault(fieldEl, data, deLang, e);
                        } else {
                            translateArray.forEach(item => {
                                if (fieldId === item.fieldID) {
                                    createBtnFromTranslated(fieldEl, data, e, item, fieldId);
                                } else {
                                    createBtnFromDefault(fieldEl, data, deLang, e);
                                }
                            });
                        }
                    }, 300);
                    $(this).on('mouseout', function () {
                        clearTimeout(timeout);
                    });
                });

                function createBtnFromDefault(fieldEl, data, deLang, e) {
                    const oldContextMenu = $('#translate-button');
                    if (oldContextMenu.length) {
                        oldContextMenu.remove();
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
                        if (field.languageCode !== DEFASULTLANGUAGE && field.languageCode !== '') {
                            let targetField = fieldEl.fieldCode;
                            let srcField = data.var;
                            let buttonLabel = "";
                            buttonLabel += field.buttonLlabel + " ";
                            const hoverBtn = new Kuc.Button({
                                text: buttonLabel,
                                type: 'normal',
                                id: targetField
                            });
                            translateButton.append(hoverBtn);
                            $(hoverBtn).on('click', async (e) => {
                                let fieldType = findPropertyById(record, srcField).type;
                                let languageCode = field.languageCode;
                                await translateTor(fieldType, languageCode, deLang, targetField);
                                fieldtranslated = {
                                    fieldID: fieldId,
                                    fieldISO: languageCode
                                }
                                translateArray.push(fieldtranslated);
                            });
                        }
                    });
                    $('body').append(translateButton);
                    $(document).on('click', function (el) {
                        if (!translateButton.is(el.currentTarget) && translateButton.has(el.currentTarget).length === 0) {
                            translateButton.remove();
                        }
                    });
                    translateButton.on('mouseleave', function () {
                        translateButton.remove();
                    });
                }

                function createBtnFromTranslated(fieldEl, data, e, item, fieldId) {
                    const oldContextMenu = $('#translate-button');
                    if (oldContextMenu.length) {
                        oldContextMenu.remove();
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
                        if (field.languageCode !== item.fieldISO && field.languageCode !== '') {
                            let targetField = fieldEl.fieldCode;
                            let srcField = data.var;
                            let buttonLabel = "";
                            buttonLabel += field.buttonLlabel + " ";
                            const hoverBtn = new Kuc.Button({
                                text: buttonLabel,
                                type: 'normal',
                                id: targetField
                            });
                            translateButton.append(hoverBtn);
                            $(hoverBtn).on('click', async (e) => {
                                let fieldType = findPropertyById(record, srcField).type;
                                let languageCode = field.languageCode;
                                console.log(languageCode);
                                let isoSelect = item.fieldISO;
                                console.log(isoSelect);
                                await translateTor(fieldType, languageCode, isoSelect, targetField);
                                fieldtranslated = {
                                    fieldID: fieldId,
                                    fieldISO: languageCode
                                }
                                translateArray.push(fieldtranslated);
                            });
                        }
                    });
                    $('body').append(translateButton);
                    $(document).on('click', function (el) {
                        if (!translateButton.is(el.currentTarget) && translateButton.has(el.currentTarget).length === 0) {
                            translateButton.remove();
                        }
                    });
                    translateButton.on('mouseleave', function () {
                        translateButton.remove();
                    });
                    return;
                }
            }
        };

        async function translateTor(fieldType, languageCode, deLang, targetField) {
            let resp = kintone.app.record.get();
            let respText = '';
            let textTotl = resp.record[targetField].value;
            if (targetField) {
                respText = await translateText(fieldType, textTotl || '', languageCode, deLang);
                resp.record[targetField].value = respText;
                kintone.app.record.set(resp);
            }
        }

        async function translateText(fieldType, textTotl, languageCode, deLang) {
            let texts = textTotl;
            // console.log(texts);
            let translated = "";
            if (fieldType === "SINGLE_LINE_TEXT") {
                translated = await myMemoryApi(textTotl, deLang, languageCode);
            }
            else if (fieldType === "MULTI_LINE_TEXT") {
                texts = texts.split('\n');
                console.log(texts);
                for await (let item of texts) {
                    if (!item) continue;
                    let translateText = await myMemoryApi(item, deLang, languageCode);
                    translated += `${translateText}\n`;
                }
            }
            else if (fieldType === "RICH_TEXT") {
                const DOMPparser = new DOMParser();
                console.log(DOMPparser);
                const textHtml = DOMPparser.parseFromString(texts, 'text/html');
                console.log(textHtml);
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
                console.log(textArray);
                for await (const item of textArray) {
                    texts = texts.replace(`${item}`, await myMemoryApi(item, deLang, languageCode));
                }
                return texts;
            }
            return translated;
        }

        async function myMemoryApi(textTotl, deLang, languageCode) {
            let trans = await axios({ 
                method: 'GET', 
                url: `https://api.mymemory.translated.net/get?q=${textTotl}&langpair=${deLang}|${languageCode}` 
            });
            if (trans.status === 200) {
                let txt = trans.data.responseData.translatedText;
                let leadingSpaces = textTotl.match(/^\s*/)[0];
                let trailingSpaces = textTotl.match(/\s*$/)[0];
                return leadingSpaces + txt + trailingSpaces;
            } else {
                throw new Error(
                    'Translation request failed with status: ' +response.status +'MyMemory API status: ' 
                    + response.data.responseStatus
                );
            }
        }

    });
})(jQuery, Sweetalert2_10.noConflict(true), kintone.$PLUGIN_ID);
