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
        let isoTranslated = "";
        let fieldIdIso = [];
        let fieldtranslated = "";
        for await (let item of TRANSLATEFFIELDS) {
            // console.log(item);
            let fieldEl = item.targetFields;
            // console.log(fieldEl);
            for (let obj = 0; obj < LANGUAGELIST.length; obj++) {
                // console.log(obj);
                if (!fieldEl.fieldCode || fieldEl.fieldCode == '') continue;
                let data = getFieldData(schema_data, fieldEl.fieldCode);
                let fieldSelector = `.field-${data.id}`;
                // console.log(fieldSelector);

                $(document).on('mouseover', fieldSelector, async function (e) {
                    // console.log(fieldIdIso.length);
                    if (fieldIdIso.length == 0) {
                        // console.log("ບໍ່ແປ");
                        let timeout = setTimeout(async () => {
                            e.preventDefault();
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
                                    // console.log(field);
                                    let targetField = fieldEl.fieldCode;
                                    // console.log(targetField);
                                    let srcField = data.var;
                                    // console.log(srcField);
                                    let buttonLabel = "";
                                    buttonLabel += field.buttonLlabel + " ";
                                    // console.log(buttonLabel);
                                    const hoverBtn = new Kuc.Button({
                                        text: buttonLabel,
                                        type: 'normal',
                                        id: targetField
                                    });
                                    customContextMenu.append(hoverBtn);
                                    $(hoverBtn).on('click', async (e) => {
                                        // console.log(fieldSelector);
                                        // console.log(e);
                                        let fieldType = findPropertyById(record, srcField).type;
                                        // console.log(fieldType);
                                        const langClick = field.languageCode;
                                        // console.log(langClick);

                                        isoTranslated = langClick;
                                        await translateTor(fieldType, langClick, deLang, targetField);

                                        // isoTranslated = langClick;
                                        // console.log(isoTranslated);
                                        // if ()
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

                        }, 400);
                        $(this).on('mouseout', function () {
                            clearTimeout(timeout);
                        });
                    } else {
                        // console.log("ແປແລ້ວ");
                        for (let ic = 0; ic < fieldIdIso.length; ic++) {
                            // console.log(i);
                            // console.log(fieldIdIso[i].fieldID);
                            // console.log(fieldIdIso[ic].fieldID);
                            // let fieldIsoSelected = fieldIdIso[ic].fieldISO;
                            // console.log(fieldIsoSelected);
                            // console.log("TEST",fieldSelector);
                            let check = fieldSelector === fieldIdIso[ic].fieldID;
                            if (check) {
                                let timeout = setTimeout(async () => {
                                    console.log("ແປແລ້ວ");
                                    e.preventDefault();
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
                                        if (field.languageCode !== fieldIdIso[ic].fieldISO && field.languageCode !== '') {
                                            // console.log(fieldIsoSelected);
                                            // console.log(field);
                                            let targetField = fieldEl.fieldCode;
                                            // console.log(targetField);
                                            let srcField = data.var;
                                            // console.log(srcField);
                                            let buttonLabel = "";
                                            buttonLabel += field.buttonLlabel + " ";
                                            // console.log(buttonLabel);
                                            const hoverBtn = new Kuc.Button({
                                                text: buttonLabel,
                                                type: 'normal',
                                                id: targetField
                                            });
                                            customContextMenu.append(hoverBtn);
                                            $(hoverBtn).on('click', async (e) => {
                                                // console.log(fieldSelector);
                                                // console.log(e);
                                                let fieldType = findPropertyById(record, srcField).type;
                                                // console.log(fieldType);
                                                const langClick = field.languageCode;
                                                // console.log(langClick);
                                                if (isoTranslated !== "") {
                                                    console.log("if");
                                                    await translateTor(fieldType, langClick, isoTranslated, targetField);
                                                    isoTranslated = "";
                                                    isoTranslated = langClick;
                                                } else {
                                                    console.log("else");
                                                    isoTranslated = langClick;
                                                    await translateTor(fieldType, langClick, deLang, targetField);
                                                }
                                                // isoTranslated = langClick;
                                                // console.log(isoTranslated);
                                                // if ()
                                                fieldtranslated = {
                                                    fieldID: fieldSelector,
                                                    fieldISO: langClick
                                                }
                                                // if (fieldIdIso.length > 0){
                                                //     if (fieldSelector === fieldIdIso[ic].fieldID){
                                                        
                                                //     }
                                                // } else {
                                                    fieldIdIso.push(fieldtranslated);
                                                // }  
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

                                }, 400);
                                $(this).on('mouseout', function () {
                                    clearTimeout(timeout);
                                });
                            } else {
                                console.log("ບໍ່ແປ");
                                let timeout = setTimeout(async () => {
                                    e.preventDefault();
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
                                            // console.log(field);
                                            let targetField = fieldEl.fieldCode;
                                            // console.log(targetField);
                                            let srcField = data.var;
                                            // console.log(srcField);
                                            let buttonLabel = "";
                                            buttonLabel += field.buttonLlabel + " ";
                                            // console.log(buttonLabel);
                                            const hoverBtn = new Kuc.Button({
                                                text: buttonLabel,
                                                type: 'normal',
                                                id: targetField
                                            });
                                            customContextMenu.append(hoverBtn);
                                            $(hoverBtn).on('click', async (e) => {
                                                // console.log(fieldSelector);
                                                // console.log(e);
                                                let fieldType = findPropertyById(record, srcField).type;
                                                // console.log(fieldType);
                                                const langClick = field.languageCode;
                                                // console.log(langClick);


                                                isoTranslated = langClick;
                                                await translateTor(fieldType, langClick, deLang, targetField);

                                                // isoTranslated = langClick;
                                                // console.log(isoTranslated);
                                                // if ()
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

                                }, 400);
                                $(this).on('mouseout', function () {
                                    clearTimeout(timeout);
                                });
                            }
                        }
                    }

                    // console.log("Over");
                    // if (isoTranslated !== ISO_DEFAULT && isoTranslated !== ""){
                    //     console.log("ຕ່າງ");
                    // } else {
                    //     console.log("ບໍ່ຕ່າງ");
                    // }
                });
            }
        };

        async function translateTor(fieldType, langClick, deLang, targetField) {
            let resp = kintone.app.record.get();
            let respText = '';
            let textTotl = resp.record[targetField].value;
            // console.log(fieldType);
            // console.log(textTotl);
            // console.log(deLang);
            // console.log(langClick);
            // console.log(srcField);
            // console.log(targetField);

            if (targetField) {
                respText = await translateText(fieldType, textTotl || '', langClick, deLang);
                // check if error
                if (typeof respText === 'object') {
                    return respText;
                }
                resp.record[targetField].value = respText;
                kintone.app.record.set(resp);
                // console.log(respText);
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
            // console.log(textTotl);
            // console.log(deLang);
            // console.log(langClick);
            let trans = await axios({ method: 'GET', url: `https://api.mymemory.translated.net/get?q=${textTotl}&langpair=${deLang}|${langClick}` }).catch((err) => {
                throw new Error("Translate Error");
            });
            if (trans.status === 200) {
                let txt = trans.data.responseData.translatedText;
                // Calculate the leading and trailing spaces to restore
                var leadingSpaces = textTotl.match(/^\s*/)[0];
                var trailingSpaces = textTotl.match(/\s*$/)[0];

                // Return the translated text with the preserved spaces
                return leadingSpaces + txt + trailingSpaces;
                // return txt;
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
