jQuery.noConflict();

(async function ($, Swal10, PLUGIN_ID) {
    "use strict";

    const GETCONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
    let GETFIELDS = "";
    let VALIDATEFIELDS = false;
    let VALIDATELANGUAGELIST = false;
    try {
        GETFIELDS = await kintone.api('/k/v1/preview/app/form/fields', 'GET', { app: kintone.app.getId() });
    } catch (error) { return console.error('Error', error.message) }

    //SetDefaultConfig
    function setDefaultConfig() {
        try {
            const parsedLanguageListAndFieldItem = GETCONFIG.config ? JSON.parse(GETCONFIG.config) : [];
            const parsedLanguageList = parsedLanguageListAndFieldItem.languageList;
            const parsedFieldItem = parsedLanguageListAndFieldItem.translateFields;
            if (parsedLanguageList == undefined) {
                createNewRow('Default', "");
            } else {
                //Set default data
                let rowToSetLanguageList = 0;
                let rowToSetFieldItem = 0;
                for (let i = 0; i < parsedLanguageList.length; i++) {
                    const object = parsedLanguageList[i];
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
                    $('#fields-list-tbody > tr:eq(' + rowToSetFieldItem + ') .select_field_column').val(object.targeFields.fieldCode);
                }
                $('.js-reflection-button').click();
                $('.select_default_lang_column').val(parsedLanguageListAndFieldItem.defaultLanguage);
                checkRowNumber();
            }
        } catch (error) { console.error(error) }
    }
    //Create new row
    function createNewRow(type, row) {
        const rowToSetLanguageList = $("#language-list-tbody tr:last-child");
        const rowToSetTranslateField = $("#fields-list-tbody tr:last-child");
        const newRowLanguageList = $("#language-list-tbody tr:first-child").clone(true);
        const newRowTranslateField = $("#fields-list-tbody tr:first-child").clone(true);
        newRowLanguageList.removeAttr("hidden");
        newRowTranslateField.removeAttr("hidden");
        if (type === "newLanguageList") {
            //ເຂົ້າເຖິງ tr ຂອງແຖວທີ່ຖີກກົດປຸ່ມ
            row.parent().parent().after(newRowLanguageList);
        } else if (type === "newTranslateField") {
            row.parent().parent().after(newRowTranslateField);
        } else if (type === "setDefaultLanguageList") {
            rowToSetLanguageList.after(newRowLanguageList);
        } else if (type === "setDefaultTranslateField") {
            rowToSetTranslateField.after(newRowTranslateField);
        } else {
            rowToSetLanguageList.after(newRowLanguageList);
            rowToSetTranslateField.after(newRowTranslateField);
        }
    }
    //Check row number
    function checkRowNumber() {
        const removeButtonLanguage = $("#language-list-tbody > tr .removeRow");
        const removeButtonField = $("#fields-list-tbody > tr .removeRow");
        if ($("#language-list-tbody > tr").length < 3) {
            removeButtonLanguage.eq(1).css("display", "none");
        } else {
            removeButtonLanguage.eq(1).css("display", "inline-block");
        }
        if ($("#fields-list-tbody > tr").length < 3) {
            removeButtonField.eq(1).css("display", "none");
        } else {
            removeButtonField.eq(1).css("display", "inline-block");
        }
    }
    //Function validate Language list and field item list
    function validateLanguageAndFields(type, language, buttonLabel, uniqueLanguages, uniqueButtonLabels, item, field, uniqueITEM, uniqueFields) {
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
    //Display popup error using sweet alert
    function showError(message) {
        Swal10.fire({
            icon: "error",
            title: "Error",
            text: message,
        });
    }
    // Function get data from LanguageList
    function getLanguageList() {
        let data = [];
        let config = {};
        let uniqueLanguages = [];
        let uniqueButtonLabels = [];
        for (let row = 1; row < $('#language-list-tbody > tr').length; row++) {
            let language = $('#language-list-tbody > tr:eq(' + row + ') select[name="select_language_column"] option:selected').text();
            let buttonLabel = $('#language-list-tbody > tr:eq(' + row + ') .button_label').val();
            if (validateLanguageAndFields("reflection", language, buttonLabel, uniqueLanguages, uniqueButtonLabels)) {
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
    // Function get data from FieldItem
    function getFieldItem() {
        let data = [];
        let config = {};
        let uniqueITEM = [];
        let uniqueFields = [];
        for (let row = 1; row < $('#fields-list-tbody > tr').length; row++) {
            let item = $('#fields-list-tbody > tr:eq(' + row + ') .ITEM_name').val();
            let field = $('#fields-list-tbody > tr:eq(' + row + ') select[name="select_field_column"] option:selected').text();
            let fieldCode = $('#fields-list-tbody > tr:eq(' + row + ') select[name="select_field_column"] option:selected').val();
            let fieldName = $('#fields-list-tbody > tr:eq(' + row + ') select[name="select_field_column"] option:selected').attr("fieldname");
            if (validateLanguageAndFields("save", "", "", [], [], item, field, uniqueITEM, uniqueFields)) {
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

    $(document).ready(async function () {
        const setFields = ["SINGLE_LINE_TEXT", "RICH_TEXT", "MULTI_LINE_TEXT"];
        const FieldSorted = Object.values(GETFIELDS.properties).sort((a, b) => {
            return a.label.localeCompare(b.label);
        });
        //Get the array of language Pack objects
        const languageObjects = langPack();
        //Add option language to dropdown
        await $.each(languageObjects, function (index, langObject) {
            $('#select_language_column').append($('<option>', {
                value: langObject.iso,
                code: langObject.code.toUpperCase(),
                text: langObject.language
            }));
        });
        //Add option fields to dropdown 
        await $.each(FieldSorted, function (item, textField) {
            if (setFields.includes(textField.type)) {
                $('#select_field_column').append($('<option>', {
                    fieldName: textField.label,
                    value: textField.code,
                    type: textField.type,
                    text: `${textField.label} (${textField.code})`
                }));
            }
        });
        //Add new row for LanguageList
        $(".addRowLanguageList").on("click", function () {
            createNewRow("newLanguageList", $(this));
            checkRowNumber();
        });
        //Add new row for Translate Field
        $(".addRowTranslateField").on("click", function () {
            createNewRow("newTranslateField", $(this));
            checkRowNumber();
        });
        //Remove row button
        $(".removeRow").on("click", function () {
            $(this).closest("tr").remove();
            checkRowNumber();
        });
        //Drag and drop table row
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
        //Reflection button
        $(".js-reflection-button").click(function (e) {
            e.preventDefault();
            // Clear options after the first option
            $('#select_default_lang_column option:gt(0)').remove();
            //Add option to Default Language dropdown
            $.each(getLanguageList(), function (index, language) {
                $('#select_default_lang_column').append($('<option>', {
                    value: language.languageCode,
                    text: language.language
                }));
            });
            // Set the second option as selected
            $('#select_default_lang_column option:eq(1)').prop('selected', true);
        });
        //Save button
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
            //If both tables are verified, fail
            if (VALIDATEFIELDS == false && VALIDATELANGUAGELIST == false || VALIDATEFIELDS != VALIDATELANGUAGELIST) { return }
            // Check if the lengths of the arrays are different
            if (allDefaultLanguage.length !== allLanguageList.length || $('.select_default_lang_column').val() == "-----") {
                Swal10.fire({
                    icon: "error",
                    title: "Error",
                    text: "Please click on Reflection before save",
                });
                return;
            }
            for (let i = 0; i < allLanguageList.length; i++) {
                // Check if the value of languageList and defaultLanguage is different
                if (!allDefaultLanguage.includes(allLanguageList[i])) {
                    Swal10.fire({
                        icon: "error",
                        title: "Error",
                        text: "Please click on Reflection before save",
                    });
                    return;
                }
            }
            // Create config
            config = {
                defaultLanguage: $('#select_default_lang_column option:selected').val(),
                languageList,
                translateFields,
            };
            console.log(config);
            config = JSON.stringify(config);
            kintone.plugin.app.setConfig({ config }, function () { window.location.href = '../../flow?app=' + kintone.app.getId() });
        });
        //Cancel button
        $(".js-cancel-button").on("click", function () {
            window.location.href = "../../" + kintone.app.getId() + "/plugin/";
        });
        //Set languageISO auto after selected language
        $('#select_language_column').on('change', function () {
            const selectedLanguageCode = $(this).val();
            const isoBox = $(this).closest('tr').find('#language_iso');
            if (selectedLanguageCode == "-----") {
                isoBox.val("");
            } else {
                // Update the input with the ISO code
                isoBox.val(selectedLanguageCode.toUpperCase());
            }
        });

        setDefaultConfig();
        checkRowNumber();
    });
})(jQuery, Sweetalert2_10.noConflict(true), kintone.$PLUGIN_ID);