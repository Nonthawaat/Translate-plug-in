jQuery.noConflict();

(function ($, Swal10, PLUGIN_ID) {
    'use strict';
    var CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);


    let config = {
        default_language: "ENG",
        language_list: [
            {
                language: "English",
                button_label: "English button",
                language_code: "en",
                language_iso: "ENG"
            },
            {
                language: "japanese",
                button_label: "japanese button",
                language_code: "ja",
                language_iso: "JPN"
            },
            {
                language: "Lao",
                button_label: "Lao button",
                language_code: "lo",
                language_iso: "LAO"
            },
        ],
        translate_fields: [
            {
                item_code: "ITEM_1",
                target_fields: [
                    {
                        field_iso: "ENG",
                        field_code: "TEXTPFIELD_1",
                        field_name: "TEXTPFIELD_1",
                    },
                    {
                        field_iso: "JPN",
                        field_code: "TEXTPFIELD_2",
                        field_name: "TEXTPFIELD_2",
                    },
                    {
                        field_iso: "LAO",
                        field_code: "TEXTPFIELD_3",
                        field_name: "TEXTPFIELD_3",
                    },
                ]
            }
        ]
    }

    const TRANSLATE_FIELDS = config.translate_fields;
    // console.log(TRANSLATE_FIELDS);
    const LANGUAGE_LIST = config.language_list;
    // console.log(LANGUAGE_LIST);
    const ISO_DEFAULT = config.default_language || LANGUAGE_LIST[0].language_iso;
    // console.log(ISO_DEFAULT);

    function getFieldData(data, fieldCode) {
        // Search in fieldList
        for (const key in data.table.fieldList) {
            if (data.table.fieldList[key].var === fieldCode) {
                return data.table.fieldList[key];
            }
        }
        return null; // Return null if not found
    }

    kintone.events.on(['app.record.edit.show', 'app.record.create.show'], async function (event) {
        // console.log(config.translate_fields);
        const record = event.record;
        // console.log(record);
        const schema_data = cybozu.data.page.SCHEMA_DATA;
        console.log(schema_data);
        for await (let item of TRANSLATE_FIELDS) {
            // console.log(item);
            for (let j = 0; j < item.target_fields.length; j++) {
                // console.log("TEST");
                let fieldEl = item.target_fields[j];
                // console.log(fieldEl);
                if (!fieldEl.field_code || fieldEl.field_code == '') continue;
                let data = getFieldData(schema_data, fieldEl.field_code); //find object element in schema by field
                // console.log(data);
                if (data == null) {
                    continue;
                }
                let fieldSelector = `.field-${data.id}`;
                // console.log(fieldSelector);
                //Add event hover over
                $(document).on('mouseover', fieldSelector, async function (e) {
                    let timeout = setTimeout(async () => {
                        e.preventDefault();
                        const oldContextMenu = $('#custom-context-menu');

                        //check old contextmenu and remove
                        if (oldContextMenu.length) {
                            oldContextMenu.remove();
                        }

                        //create contextmenu
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
                        $.each(item.target_fields, function (i, field) {
                            // console.log(field.iso.toUpperCase());
                            if (field.field_iso.toUpperCase() !== ISO_DEFAULT.toUpperCase() && field.field_code !== '') {
                                let targetField = field.field_code;
                                let srcField = data.var;
                                // console.log(srcField);
                                let buttonLabel = LANGUAGE_LIST.filter(lang => lang.language_iso.toUpperCase() === field.field_iso.toUpperCase())[0].button_label;
                                console.log(buttonLabel);
                                const hoverBtn = new Kuc.Button({
                                    text: buttonLabel,
                                    type: 'normal',
                                    id: targetField
                                });
                                customContextMenu.append(hoverBtn);
                                hoverBtn.addEventListener('click', clickEvent => {
                                    console.log(clickEvent);
                                });
                            }
                        });
                        $('body').append(customContextMenu);
                        // funtion for remove contextMenu
                        $(document).on('click', function (el) {
                            if (!customContextMenu.is(el.currentTarget) && customContextMenu.has(el.currentTarget).length === 0) {
                                customContextMenu.remove();
                            }
                        });
                        //remove contextMenu when mouseleave from button
                        customContextMenu.on('mouseleave', function () {
                            customContextMenu.remove();
                        });

                    }, 400);
                    //check mouseout
                    $(this).on('mouseout', function () {
                        clearTimeout(timeout);
                    });
                });
            }
        }

    });
})(jQuery, Sweetalert2_10.noConflict(true), kintone.$PLUGIN_ID);
