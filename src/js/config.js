jQuery.noConflict();

(async function ($,Swal10, PLUGIN_ID) {
  "use strict";

    let GETCONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
    let ROWCOUNT = 1;
    let GETFIELDS = "";
    try {
        let param = { app: kintone.app.getId() };
        GETFIELDS = await kintone.api('/k/v1/preview/app/form/fields', 'GET', param);
    }catch (error) {return console.log('Error', error.message)}

    // ----------------------------setDefaultConfig------------------------------------
    function setDefaultConfig() {
        try {
    
            let config = {};
            let parsedLanguageListAndFieldItem = [];
            let parsedLanguageList = [];
            let parsedFieldItem = [];
                config = GETCONFIG;
                parsedLanguageListAndFieldItem = GETCONFIG.config ? JSON.parse(GETCONFIG.config) : [];
                parsedLanguageList = parsedLanguageListAndFieldItem.languageList;
                parsedFieldItem = parsedLanguageListAndFieldItem.translateFields;
          if (parsedLanguageList == undefined) {
            createNewRow('Default', "");  

          }else{
            //Set default data
            let rowToSetLanguageList = 0;
            let rowToSetFieldItem = 0;
            for (let i = 0; i < parsedLanguageList.length; i++) {
                const object = parsedLanguageList[i];
                object.itemCode;
                createNewRow('setDefaultLanguageList', "");
                rowToSetLanguageList++;
                $('#language-list-tbody > tr:eq(' + rowToSetLanguageList + ') .select_language_column').val(object.languageIso.toLowerCase());
                $('#language-list-tbody > tr:eq(' + rowToSetLanguageList + ') .language_iso').val(object.languageIso);
                $('#language-list-tbody > tr:eq(' + rowToSetLanguageList + ') .button_label').val(object.buttonLabel);
            }
            for (let i = 0; i < parsedFieldItem.length; i++) {
                const object = parsedFieldItem[i];
                createNewRow('setDefaultTranslateField', "");
                rowToSetFieldItem++;
                $('#fields-list-tbody > tr:eq(' + rowToSetFieldItem + ') .ITEM_name').val(object.itemCode);
                $('#fields-list-tbody > tr:eq(' + rowToSetFieldItem + ') .select_field_column').val(object.targeFields.fieldName);
            }
            $('.js-reflection-button').click();
            checkRowNumber();
                
          }  return
        }catch (error) {
            console.log(error);
        }
    }
    // -----------------------------Create new row------------------------
    function createNewRow(type, row) {
        const rowToCloneLanguageList = $("#language-list-tbody tr:first-child");
        const rowToCloneTranslateField = $("#fields-list-tbody tr:first-child");
        const rowToSetLanguageList = $("#language-list-tbody tr:last-child");
        const rowToSetTranslateField = $("#fields-list-tbody tr:last-child");
        const newRowLanguageList = rowToCloneLanguageList.clone(true);
        const newRowTranslateField = rowToCloneTranslateField.clone(true);
            ROWCOUNT++;
            newRowLanguageList.removeAttr("hidden");
            newRowTranslateField.removeAttr("hidden");
        if (type === "newLanguageList") {
            //ເຂົ້າເຖິງ tr ຂອງແຖວທີ່ຖີກກົດປຸ່ມ
            row.parent().parent().after(newRowLanguageList);
        }else if(type === "newTranslateField") {
            row.parent().parent().after(newRowTranslateField);
        }else if(type === "setDefaultLanguageList") {
            rowToSetLanguageList.after(newRowLanguageList);
        }else if(type === "setDefaultTranslateField") {
            rowToSetTranslateField.after(newRowTranslateField);
        }else{
            rowToSetLanguageList.after(newRowLanguageList);
            rowToSetTranslateField.after(newRowTranslateField);
        }
    }
    //-----------------------------Check row nuber---------------------
    function checkRowNumber() {
        const removeButtons = $("#language-list-tbody > tr .removeRow");
        const removeButton = $("#fields-list-tbody > tr .removeRow");
        const rows = $("#language-list-tbody > tr");
        const row = $("#fields-list-tbody > tr");
        if (rows.length < 3) {
            removeButtons.eq(1).css("display", "none");
        }else {
            removeButtons.each(function () {
            $(this).css("display", "inline-block");
            });
        }
        if (row.length < 3) {
            removeButton.eq(1).css("display", "none");
        }else {
            removeButton.each(function () {
            $(this).css("display", "inline-block");
            });
        }
    }
    let VALIDATEFIELDS = false;
    let VALIDATELANGUAGELIST = false;
    // ------------------------Function validate--------------------
    function validateLanguageAndFields(type, language, buttonLabel, uniqueLanguages, uniqueButtonLabels, item, field , uniqueITEM, uniqueFields) {
        switch (type) {
            case "reflection":
        VALIDATELANGUAGELIST = false
        if (language == "-----") {
                    showError("The language selection should not be empty");
                    return false;
                }
                if (buttonLabel == "") {
                    showError("The button label should not be empty");
                    return false;
                }
                if (uniqueLanguages.indexOf(language) > -1) {
                    showError("Duplicate language selection");
                    return false;
                }
                if (uniqueButtonLabels.indexOf(buttonLabel) > -1) {
                    showError("Duplicate button label");
                    return false;
                }
                VALIDATELANGUAGELIST = true
                break;
            default:
        VALIDATEFIELDS = false;
        if (field == "-----") {
                    showError("The field selection should not be empty");
                    return false;
                }
                if (item == "") {
                    showError("The ITEM should not be empty");
                    return false;
                }
                if (uniqueFields.indexOf(field) > -1) {
                    showError("Duplicate field selection");
                    return false;
                }
                if (uniqueITEM.indexOf(item) > -1) {
                    showError("Duplicate ITEM name");
                    return false;
                }
        VALIDATEFIELDS = true;
                break;
        }
        return true;
    }
    function showError(message) {
        Swal10.fire({
            icon: "error",
            title: "Error",
            text: message,
        });
    }

    // ------------------------Function get data--------------------
    function getLanguageList() {
        let data = [];
        let config = {};
        let uniqueLanguages = [];
        let uniqueButtonLabels = [];
        let rowNumber = $('#language-list-tbody > tr');
        for (let row = 1; row < rowNumber.length; row++) {
            let language = $('#language-list-tbody > tr:eq(' + row + ') select[name="select_language_column"] option:selected').text();
            let buttonLabel = $('#language-list-tbody > tr:eq(' + row + ') .button_label').val();
            if (validateLanguageAndFields("reflection",language, buttonLabel, uniqueLanguages, uniqueButtonLabels)) {
                uniqueLanguages.push(language);
                uniqueButtonLabels.push(buttonLabel);
                config = {
                    language: language,
                    languageCode: $('#language-list-tbody > tr:eq(' + row + ') select[name="select_language_column"] option:selected').attr("code"),
                    buttonLabel: buttonLabel,
                    languageIso: $('#language-list-tbody > tr:eq(' + row + ') .language_iso').val()
                };
                data.push(config);
            }
        }
        return data;
    }

    function getFieldItem() {
        let data = [];
        let config = {};
        let uniqueITEM = [];
        let uniqueFields = [];
        let rowNumber = $('#fields-list-tbody > tr');
        for (let row = 1; row < rowNumber.length; row++) {
            let item = $('#fields-list-tbody > tr:eq(' + row + ') .ITEM_name').val();
            let field = $('#fields-list-tbody > tr:eq(' + row + ') select[name="select_field_column"] option:selected').text();
            let fieldCode = $('#fields-list-tbody > tr:eq(' + row + ') select[name="select_field_column"] option:selected').val();
            let fieldName = $('#fields-list-tbody > tr:eq(' + row + ') select[name="select_field_column"] option:selected').attr("fieldname");
            if (validateLanguageAndFields("save","","",[],[], item, field, uniqueITEM, uniqueFields)) {
                uniqueITEM.push(item);
                uniqueFields.push(field);
                config = {
                    itemCode: item,
                    targeFields: {
                        fieldCode,
                        fieldName,
                    }
                };
                data.push(config);
            }
        }
        return data;
    }

    $(document).ready(async function() {
        // Get the array of language objects
        const languageObjects = langPack();
       await $.each(languageObjects, function (index, langObject) {
            $('#select_language_column').append($('<option>', {
                value: langObject.iso,
                code: langObject.code.toUpperCase(),
                text: langObject.language
            }));
        });
        let option = $('<option>');
        const setFields =["SINGLE_LINE_TEXT", "RICH_TEXT", "MULTI_LINE_TEXT"];
        const FieldSorted = Object.values(GETFIELDS.properties).sort((a, b) => {return a.code.localeCompare(b.code)});

       await $.each(FieldSorted, function (item, textField) {
            if (setFields.includes(textField.type)) {
                option.attr("fieldName", textField.label);
                option.attr("value", textField.code);
                option.attr("type", textField.type);
                option.text(`${textField.label} (${textField.code})`);
                $('#select_field_column').append(option.clone());
            }
        });

        //-------------------------add new row-------------------------------
        $(".addRowLanguageList").on("click", function () {
            createNewRow("newLanguageList", $(this));
            checkRowNumber();
        });
        $(".removeRow").on("click", function () {
            $(this).closest("tr").remove();
            checkRowNumber();
        });
        // -------------------------add new row-------------------------------
        $(".addRowTranslateField").on("click", function () {
            createNewRow("newTranslateField", $(this));
            checkRowNumber();
        });

        // -------------------drag and drop table row-----------------------
        $("#language-list-tbody").sortable({
            axis: "y",
            handle: ".drag-handle",
            start: (event, ui) => {
                ui.item.addClass("dragging");
            },
            stop: (event, ui) => {
                ui.item.removeClass("dragging");
            },
        });
        $(".js-reflection-button").click(function (e){
            e.preventDefault();
            let retrieveLanguage = getLanguageList();
            // Clear options after the first option
            $('#select_default_lang_column option:gt(0)').remove();
            $.each(retrieveLanguage, function (index, language) {
                $('#select_default_lang_column').append($('<option>', {
                    value: language.languageCode,
                    text: language.language
                }));
            });
            // Set the second option as selected
            $('#select_default_lang_column option:eq(1)').prop('selected', true);
        });

        $(".js-save-button").click(async function (e) {
            e.preventDefault();
            let config = {};
            let translateFields = getFieldItem();
            let languageList = getLanguageList();
            let options = $('#select_default_lang_column option:gt(0)')
            let allLanguageList = [];
            let allDefaultLanguage = [];

            for (let i = 0; i < options.length; i++) {
                allDefaultLanguage.push(options[i].value);
            }
            for (let i = 0; i < languageList.length; i++) {
                allLanguageList.push(languageList[i].languageCode);
            }
            if (VALIDATEFIELDS == false && VALIDATELANGUAGELIST == false || VALIDATEFIELDS != VALIDATELANGUAGELIST) {return}
            // Check if the lengths of the arrays are different
            if (allDefaultLanguage.length !== allLanguageList.length) {
                Swal10.fire({
                    icon: "error",
                    title: "Error",
                    text: "Please click on Reflection before save",
                });
                return;
            }
            for (let i = 0; i < allLanguageList.length; i++) {
                // Check if the value is different
                if (!allDefaultLanguage.includes(allLanguageList[i])) {
                    Swal10.fire({
                        icon: "error",
                        title: "Error",
                        text: "Please click on Reflection before save",
                    });
                    return;
                }
            }
            config = {
                defaultLanguage: allDefaultLanguage[0],
                languageList,
                translateFields,
            };
            console.log(config);

            config = JSON.stringify(config);
            kintone.plugin.app.setConfig({config}, function() {
                window.location.href = '../../flow?app=' + kintone.app.getId();
            });
        });

        $(".js-cancel-button").on("click", function () {
            window.location.href = "../../" + kintone.app.getId() + "/plugin/";
        });


        $('#select_language_column').on('change', function () {
            const selectedLanguageCode = $(this).val();
            const isoBox = $(this).closest('tr').find('#language_iso');
            if (selectedLanguageCode == "-----"){
                isoBox.val("");
            }else{
                // Update the input with the ISO code
                isoBox.val(selectedLanguageCode.toUpperCase());
            }
        });

        setDefaultConfig();
        checkRowNumber();
    });
})(jQuery,Sweetalert2_10.noConflict(true), kintone.$PLUGIN_ID);
