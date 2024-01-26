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
                buttonLabel: "English button",
                languageIso: "ENG"
            },
            {
                language: "japanese",
                languageCode: "JA",
                buttonLabel: "japanese button",
                languageIso: "JPN"
            },
            {
                language: "Lao",
                languageCode: "LO",
                buttonLabel: "Lao button",
                languageIso: "LAO"
            },
            {
                language: "Thai",
                languageCode: "TH",
                buttonLabel: "Thai button",
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
    const ISO_DEFAULT = CONFIG.defaultLanguage || LANGUAGELIST[0].languageCode;
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
        const deLang = ISO_DEFAULT;
        const schema_data = cybozu.data.page.SCHEMA_DATA;
        let fieldIdIso = [];
        let fieldtranslated = "";

        let fieldOldArray = [];
        let fieldOld = "";
        for await (let item of TRANSLATEFFIELDS) {
            let fieldEl = item.targetFields;
            let data = getFieldData(schema_data, fieldEl.fieldCode);
            let fieldSelector = `.field-${data.id}`;
            $(document).on('mouseover', fieldSelector, async function (e) {
                let timeout = setTimeout(async () => {
                    e.preventDefault();
                    if (fieldIdIso.length == 0) {
                        createButtonFromDefault(fieldEl, data, deLang, e, fieldSelector);
                    } else {
                        fieldIdIso.forEach(count => {
                            if (fieldSelector === count.fieldID) {
                                createBtnFromTranslated(fieldEl, data, e, count, fieldSelector);;
                            } else {
                                createButtonFromDefault(fieldEl, data, deLang, e, fieldSelector);
                            }
                        });
                    }
                }, 400);
                $(this).on('mouseout', function () {
                    clearTimeout(timeout);
                });
            });
        };

        async function createButtonFromDefault(fieldEl, data, deLang, e, fieldSelector) {
            const oldContextMenu = $('#custom-context-menu');
            if (oldContextMenu.length) {
                oldContextMenu.remove();
            }
            var customContextMenu = $('<div>').attr('id', 'custom-context-menu').css({
                position: 'absolute',
                background: '#fff',
                border: '2px solid #ccc',
                boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
                padding: '5px',
                left: e.pageX + 'px',
                top: e.pageY + 'px',
            });
            $.each(LANGUAGELIST, function (i, field) {
                if (field.languageCode !== ISO_DEFAULT && field.languageCode !== '') {
                    let targetField = fieldEl.fieldCode;
                    let srcField = data.var;
                    let buttonLabel = "";
                    buttonLabel += field.buttonLabel + " ";
                    const hoverBtn = new Kuc.Button({
                        text: buttonLabel,
                        type: 'normal',
                        id: targetField
                    });
                    customContextMenu.append(hoverBtn);
                    let langClick = field.languageCode;
                    $(hoverBtn).on('click', async (e) => {
                        console.log("click");

                        // console.log(field.buttonLabel);
                        if (fieldIdIso.length == 0) {
                            console.log("if");
                            let fieldType = findPropertyById(record, srcField).type;
                            await translateTor(fieldType, langClick, deLang, targetField);
                            fieldtranslated = {
                                fieldID: fieldSelector,
                                fieldISO: langClick
                            }
                            fieldIdIso.push(fieldtranslated);

                            fieldOld = {
                                fieldID: fieldSelector,
                                fieldISO: langClick
                            }
                            fieldOldArray.push(fieldOld);
                        } else {
                            console.log("else");
                            let isoSelete = "";
                            let langClick = field.languageCode;
                            let fieldType
                            fieldOldArray.forEach(async items => {
                                fieldType = findPropertyById(record, srcField).type;
                                isoSelete = items.fieldISO;
                            });
                            await translateTor(fieldType, langClick, isoSelete, targetField);
                            fieldOld = {
                                fieldID: fieldSelector,
                                fieldISO: langClick
                            }
                            fieldOldArray.push(fieldOld);
                        }
                    });
                }
                return
            });
            $('body').append(customContextMenu);
            customContextMenu.on('mouseleave', function () {
                customContextMenu.remove();
            });
        };

        async function createBtnFromTranslated(fieldEl, data, e, count, fieldSelector) {
            const oldContextMenu = $('#custom-context-menu');
            if (oldContextMenu.length) {
                oldContextMenu.remove();
            }

            var customContextMenu = $('<div>').attr('id', 'custom-context-menu').css({
                position: 'absolute',
                background: '#fff',
                border: '1px solid #ccc',
                boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
                padding: '5px',
                left: e.pageX + 'px',
                top: e.pageY + 'px'
            });
            $.each(LANGUAGELIST, function (i, field) {
                if (field.languageCode !== count.fieldISO && field.languageCode !== '') {
                    let targetField = fieldEl.fieldCode;
                    let srcField = data.var;
                    let buttonLabel = "";
                    buttonLabel += field.buttonLabel + " ";
                    const hoverBtn = new Kuc.Button({
                        text: buttonLabel,
                        type: 'normal',
                        id: targetField
                    });
                    customContextMenu.append(hoverBtn);
                    $(hoverBtn).on('click', async (e) => {
                        // console.log("Translated Click");
                        let fieldType = findPropertyById(record, srcField).type;
                        const langClick = field.languageCode;
                        let isoSelete = count.fieldISO;
                        await translateTor(fieldType, langClick, isoSelete, targetField);
                        fieldtranslated = {
                            fieldID: fieldSelector,
                            fieldISO: langClick
                        }
                        fieldIdIso.push(fieldtranslated);
                    });
                }
            });
            $('body').append(customContextMenu);
            customContextMenu.on('mouseleave', function () {
                customContextMenu.remove();
            });
            return;
        };

        async function translateTor(fieldType, langClick, deLang, targetField) {
            // console.log(deLang);
            // console.log(langClick);
            // if (deLang === langClick) { return }
            let resp = kintone.app.record.get();
            let respText = '';
            let textTotl = resp.record[targetField].value;
            if (targetField) {
                respText = await translateText(fieldType, textTotl || '', langClick, deLang);
                if (typeof respText === 'object') {
                    return respText;
                }
                resp.record[targetField].value = respText;
                kintone.app.record.set(resp);
            }
        }

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
                console.log(texts);
                for await (let item of texts) {
                    if (!item) continue;
                    console.log(item);
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
        }

        async function myMemoryApi(textTotl, deLang, langClick) {
            // console.log("My memory");
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
        }

    });
})(jQuery, Sweetalert2_10.noConflict(true), kintone.$PLUGIN_ID);
