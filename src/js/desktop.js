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
            }
        ]
    }
    // console.log(CONFIG.languageList);
    const TRANSLATEFFIELDS = CONFIG.translateFfields;
    // console.log(TRANSLATEFFIELDS);
    const LANGUAGELIST = CONFIG.languageList;
    // console.log(LANGUAGELIST);
    const ISO_DEFAULT = CONFIG.defaultLanguage || LANGUAGELIST[0].languageCode;
    // console.log(ISO_DEFAULT);
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
        return null; // Return null if not found
    }

    kintone.events.on(['app.record.edit.show', 'app.record.create.show'], async function (event) {
        // console.log(CONFIG.translateFfields);
        const record = event.record;
        const deLang = ISO_DEFAULT;
        // console.log(record);
        const schema_data = cybozu.data.page.SCHEMA_DATA;
        // console.log(schema_data);
        for await (let item of TRANSLATEFFIELDS) {
            let fieldIdIso = [];
            let fieldtranslated = "";
            for (let obj = 0; obj < LANGUAGELIST.length; obj++) {
                // console.log(obj);
                let fieldEl = item.targetFields;
                if (!fieldEl.fieldCode || fieldEl.fieldCode == '') continue;
                let data = getFieldData(schema_data, fieldEl.fieldCode);
                let fieldSelector = `.field-${data.id}`;
                $(document).on('mouseover', fieldSelector, async function (e) {
                    let timeout = setTimeout(async () => {
                        e.preventDefault();
                        if (fieldIdIso.length == 0) {
                            const oldContextMenu = $('#custom-context-menu');
                            if (oldContextMenu.length) {
                                oldContextMenu.remove();
                            }

                            var customContextMenu = $('<div>').attr('id', 'custom-context-menu')
                                .css({
                                    position: 'absolute',
                                    background: '#fff',
                                    border: '1px solid #ccc',
                                    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
                                    padding: '5px',
                                    left: e.pageX + 'px',
                                    top: e.pageY + 'px'
                                });
                            $.each(LANGUAGELIST, function (i, field) {
                                if (field.languageCode !== ISO_DEFAULT && field.languageCode !== '') {
                                    let targetField = fieldEl.fieldCode;
                                    let srcField = data.var;
                                    let buttonLabel = "";
                                    buttonLabel += field.buttonLlabel + " ";
                                    const hoverBtn = new Kuc.Button({
                                        text: buttonLabel,
                                        type: 'normal',
                                        id: targetField
                                    });
                                    customContextMenu.append(hoverBtn);
                                    $(hoverBtn).on('click', async (e) => {
                                        let fieldType = findPropertyById(record, srcField).type;
                                        let langClick = field.languageCode;
                                        await translateTor(fieldType, langClick, deLang, targetField);
                                        fieldtranslated = {
                                            fieldID: fieldSelector,
                                            fieldISO: langClick
                                        }
                                        fieldIdIso.push(fieldtranslated);
                                    });
                                }
                            });
                            $('body').append(customContextMenu);
                            $(document).on('click', function (el) {
                                if (!customContextMenu.is(el.currentTarget) && customContextMenu.has(el.currentTarget).length === 0) {
                                    customContextMenu.remove();
                                }
                            });
                            customContextMenu.on('mouseleave', function () {
                                customContextMenu.remove();
                            });
                        } else {
                            let foundFieldID = "";
                            fieldIdIso.forEach(count => {
                                if (fieldSelector === count.fieldID) {
                                    foundFieldID = count;
                                    const oldContextMenu = $('#custom-context-menu');
                                    if (oldContextMenu.length) {
                                        oldContextMenu.remove();
                                    }

                                    var customContextMenu = $('<div>').attr('id', 'custom-context-menu')
                                        .css({
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
                                            buttonLabel += field.buttonLlabel + " ";
                                            const hoverBtn = new Kuc.Button({
                                                text: buttonLabel,
                                                type: 'normal',
                                                id: targetField
                                            });
                                            customContextMenu.append(hoverBtn);
                                            $(hoverBtn).on('click', async (e) => {
                                                let fieldType = findPropertyById(record, srcField).type;
                                                const langClick = field.languageCode;
                                                let isoSelete = count.fieldISO;
                                                await translateTor(fieldType, langClick, isoSelete, targetField);
                                                fieldtranslated = {
                                                    fieldID: fieldSelector,
                                                    fieldISO: langClick
                                                }
                                                fieldIdIso.push(fieldtranslated);
                                                console.log(fieldIdIso);
                                            });
                                        }
                                    });
                                    $('body').append(customContextMenu);
                                    $(document).on('click', function (el) {
                                        if (!customContextMenu.is(el.currentTarget) && customContextMenu.has(el.currentTarget).length === 0) {
                                            customContextMenu.remove();
                                        }
                                    });
                                    customContextMenu.on('mouseleave', function () {
                                        customContextMenu.remove();
                                    });
                                    return;
                                } else {
                                    console.log("ບໍ່ແປ");
                                    const oldContextMenu = $('#custom-context-menu');
                                    if (oldContextMenu.length) {
                                        oldContextMenu.remove();
                                    }

                                    var customContextMenu = $('<div>').attr('id', 'custom-context-menu')
                                        .css({
                                            position: 'absolute',
                                            background: '#fff',
                                            border: '1px solid #ccc',
                                            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
                                            padding: '5px',
                                            left: e.pageX + 'px',
                                            top: e.pageY + 'px'
                                        });
                                    $.each(LANGUAGELIST, function (i, field) {
                                        if (field.languageCode !== ISO_DEFAULT && field.languageCode !== '') {
                                            let targetField = fieldEl.fieldCode;
                                            let srcField = data.var;
                                            let buttonLabel = "";
                                            buttonLabel += field.buttonLlabel + " ";
                                            const hoverBtn = new Kuc.Button({
                                                text: buttonLabel,
                                                type: 'normal',
                                                id: targetField
                                            });
                                            customContextMenu.append(hoverBtn);
                                            $(hoverBtn).on('click', async (e) => {
                                                let fieldType = findPropertyById(record, srcField).type;
                                                const langClick = field.languageCode;
                                                await translateTor(fieldType, langClick, deLang, targetField);
                                                fieldtranslated = {
                                                    fieldID: fieldSelector,
                                                    fieldISO: langClick
                                                }
                                                fieldIdIso.push(fieldtranslated);
                                            });
                                        }
                                    });
                                    $('body').append(customContextMenu);
                                    $(document).on('click', function (el) {
                                        if (!customContextMenu.is(el.currentTarget) && customContextMenu.has(el.currentTarget).length === 0) {
                                            customContextMenu.remove();
                                        }
                                    });
                                    customContextMenu.on('mouseleave', function () {
                                        customContextMenu.remove();
                                    });
                                }
                            });
                            console.log(foundFieldID);
                        }

                    }, 400);
                    $(this).on('mouseout', function () {
                        clearTimeout(timeout);
                    });
                });
            }
        };

        async function translateTor(fieldType, langClick, deLang, targetField) {
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
            let tranText = "";
            if (fieldType === "SINGLE_LINE_TEXT") {
                tranText = myMemoryApi(textTotl, deLang, langClick);
            }
            else if (fieldType === "MULTI_LINE_TEXT") {
            }
            else if (fieldType === "RICH_TEXT") {

            }
            return tranText;
        }

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
        }

    });
})(jQuery, Sweetalert2_10.noConflict(true), kintone.$PLUGIN_ID);
