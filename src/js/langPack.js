const langPack = function () {
    let my_memory_api= [
         {
             language: "Afrikaans",
             code: "af",
             iso: "afr"
         },
         {
             language: "Albanian",
             code: "sq",
             iso: "sqi"
         },
         {
             language: "Amharic",
             code: "am",
             iso: "amh"
         },
         {
             language: "Arabic",
             code: "ar",
             iso: "ara"
         },
         {
             language: "Armenian",
             code: "hy",
             iso: "hye"
         },
         {
             language: "Azerbaijani",
             code: "az",
             iso: "aze"
         },
         {
             language: "Bajan",
             code: "bjs",
             iso: "bjs"
         },
         {
             language: "Balkan Gipsy",
             code: "rom",
             iso: "rom"
         },
         {
             language: "Basque",
             code: "eu",
             iso: "eus"
         },
         {
             language: "Bemba",
             code: "bem",
             iso: "bem"
         },
         {
             language: "Bengali",
             code: "bn",
             iso: "ben"
         },
         {
             language: "Bielarus",
             code: "be",
             iso: "bel"
         },
         {
             language: "Bislama",
             code: "bi",
             iso: "bis"
         },
         {
             language: "Bosnian",
             code: "bs",
             iso: "bos"
         },
         {
             language: "Breton",
             code: "br",
             iso: "bre"
         },
         {
             language: "Bulgarian",
             code: "bg",
             iso: "bul"
         },
         {
             language: "Burmese",
             code: "my",
             iso: "mya"
         },
         {
             language: "Catalan",
             code: "ca",
             iso: "cat"
         },
         {
             language: "Cebuano",
             code: "ceb",
             iso: "ceb"
         },
         {
             language: "Chamorro",
             code: "ch",
             iso: "cha"
         },
         {
             language: "Chinese (Simplified)",
             code: "zh",
             iso: "zho"
         },
         {
             language: "Chinese Traditional",
             code: "zh-TW",
             iso: "zho-TW"
         },
         {
             language: "Comorian (Ngazidja)",
             code: "swb",
             iso: "swb"
         },
         {
             language: "Coptic",
             code: "cop",
             iso: "cop"
         },
         {
             language: "Creole English (Antigua and Barbuda)",
             code: "aig",
             iso: "aig"
         },
         {
             language: "Creole English (Bahamas)",
             code: "bah",
             iso: "bah"
         },
         {
             language: "Creole English (Grenadian)",
             code: "gcl",
             iso: "gcl"
         },
         {
             language: "Creole English (Guyanese)",
             code: "gyn",
             iso: "gyn"
         },
         {
             language: "Creole English (Jamaican)",
             code: "jam",
             iso: "jam"
         },
         {
             language: "Creole English (Vincentian)",
             code: "svc",
             iso: "svc"
         },
         {
             language: "Creole English (Virgin Islands)",
             code: "vic",
             iso: "vic"
         },
         {
             language: "Creole French (Haitian)",
             code: "ht",
             iso: "hat"
         },
         {
             language: "Creole French (Saint Lucian)",
             code: "acf",
             iso: "acf"
         },
         {
             language: "Creole French (Seselwa)",
             code: "crs",
             iso: "crs"
         },
         {
             language: "Creole Portuguese (Upper Guinea)",
             code: "pov",
             iso: "pov"
         },
         {
             language: "Croatian",
             code: "hr",
             iso: "hrv"
         },
         {
             language: "Czech",
             code: "cs",
             iso: "ces"
         },
         {
             language: "Danish",
             code: "da",
             iso: "dan"
         },
         {
             language: "Dutch",
             code: "nl",
             iso: "nld"
         },
         {
             language: "Dzongkha",
             code: "dz",
             iso: "dzo"
         },
         {
             language: "English",
             code: "en",
             iso: "eng"
         },
         {
             language: "Esperanto",
             code: "eo",
             iso: "epo"
         },
         {
             language: "Estonian",
             code: "et",
             iso: "est"
         },
         {
             language: "Fanagalo",
             code: "fng",
             iso: "fng"
         },
         {
             language: "Faroese",
             code: "fo",
             iso: "fao"
         },
         {
             language: "Finnish",
             code: "fi",
             iso: "fin"
         },
         {
             language: "French",
             code: "fr",
             iso: "fra"
         },
         {
             language: "Galician",
             code: "gl",
             iso: "glg"
         },
         {
             language: "Georgian",
             code: "ka",
             iso: "kat"
         },
         {
             language: "German",
             code: "de",
             iso: "deu"
         },
         {
             language: "Greek",
             code: "el",
             iso: "ell"
         },
         {
             language: "Greek (Classical)",
             code: "grc",
             iso: "grc"
         },
         {
             language: "Gujarati",
             code: "gu",
             iso: "guj"
         },
         {
             language: "Hausa",
             code: "ha",
             iso: "hau"
         },
         {
             language: "Hawaiian",
             code: "haw",
             iso: "haw"
         },
         {
             language: "Hebrew",
             code: "he",
             iso: "heb"
         },
         {
             language: "Hindi",
             code: "hi",
             iso: "hin"
         },
         {
             language: "Hungarian",
             code: "hu",
             iso: "hun"
         },
         {
             language: "Icelandic",
             code: "is",
             iso: "isl"
         },
         {
             language: "Indonesian",
             code: "id",
             iso: "ind"
         },
         {
             language: "Inuktitut (Greenlandic)",
             code: "iu",
             iso: "iku"
         },
         {
             language: "Irish Gaelic",
             code: "ga",
             iso: "gle"
         },
         {
             language: "Italian",
             code: "it",
             iso: "ita"
         },
         {
             language: "Japanese",
             code: "ja",
             iso: "jpn"
         },
         {
             language: "Javanese",
             code: "jv",
             iso: "jav"
         },
         {
             language: "Kabuverdianu",
             code: "kea",
             iso: "kea"
         },
         {
             language: "Kabylian",
             code: "kab",
             iso: "kab"
         },
         {
             language: "Kannada",
             code: "kn",
             iso: "kan"
         },
         {
             language: "Kazakh",
             code: "kk",
             iso: "kaz"
         },
         {
             language: "Khmer",
             code: "km",
             iso: "khm"
         },
         {
             language: "Kinyarwanda",
             code: "rw",
             iso: "kin"
         },
         {
             language: "Kirundi",
             code: "rn",
             iso: "run"
         },
         {
             language: "Korean",
             code: "ko",
             iso: "kor"
         },
         {
             language: "Kurdish",
             code: "ku",
             iso: "kur"
         },
         {
             language: "Kurdish Sorani",
             code: "ckb",
             iso: "ckb"
         },
         {
             language: "Kyrgyz",
             code: "ky",
             iso: "kir"
         },
         {
             language: "Lao",
             code: "lo",
             iso: "lao"
         },
         {
             language: "Latin",
             code: "la",
             iso: "lat"
         },
         {
             language: "Latvian",
             code: "lv",
             iso: "lav"
         },
         {
             language: "Lithuanian",
             code: "lt",
             iso: "lit"
         },
         {
             language: "Luxembourgish",
             code: "lb",
             iso: "ltz"
         },
         {
             language: "Macedonian",
             code: "mk",
             iso: "mkd"
         },
         {
             language: "Malagasy",
             code: "mg",
             iso: "mlg"
         },
         {
             language: "Malay",
             code: "ms",
             iso: "msa"
         },
         {
             language: "Maldivian",
             code: "dv",
             iso: "div"
         },
         {
             language: "Maltese",
             code: "mt",
             iso: "mlt"
         },
         {
             language: "Manx Gaelic",
             code: "gv",
             iso: "glv"
         },
         {
             language: "Maori",
             code: "mi",
             iso: "mri"
         },
         {
             language: "Marshallese",
             code: "mh",
             iso: "mah"
         },
         {
             language: "Mende",
             code: "men",
             iso: "men"
         },
         {
             language: "Mongolian",
             code: "mn",
             iso: "mon"
         },
         {
             language: "Morisyen",
             code: "mfe",
             iso: "mfe"
         },
         {
             language: "Nepali",
             code: "ne",
             iso: "nep"
         },
         {
             language: "Niuean",
             code: "niu",
             iso: "niu"
         },
         {
             language: "Norwegian",
             code: "no",
             iso: "nor"
         },
         {
             language: "Nyanja",
             code: "ny",
             iso: "nya"
         },
         {
             language: "Pakistani",
             code: "", // No specific code found
             iso: "" // No specific code found
         },
         {
             language: "Palauan",
             code: "pau",
             iso: "pau"
         },
         {
             language: "Panjabi",
             code: "pa",
             iso: "pan"
         },
         {
             language: "Papiamentu",
             code: "pap",
             iso: "pap"
         },
         {
             language: "Pashto",
             code: "ps",
             iso: "pus"
         },
         {
             language: "Persian",
             code: "fa",
             iso: "fas"
         },
         {
             language: "Pijin",
             code: "pis",
             iso: "pis"
         },
         {
             language: "Polish",
             code: "pl",
             iso: "pol"
         },
         {
             language: "Portuguese",
             code: "pt",
             iso: "por"
         },
         {
             language: "Potawatomi",
             code: "pot",
             iso: "pot"
         },
         {
             language: "Quechua",
             code: "qu",
             iso: "que"
         },
         {
             language: "Romanian",
             code: "ro",
             iso: "ron"
         },
         {
             language: "Russian",
             code: "ru",
             iso: "rus"
         },
         {
             language: "Samoan",
             code: "sm",
             iso: "smo"
         },
         {
             language: "Sango",
             code: "sg",
             iso: "sag"
         },
         {
             language: "Scots Gaelic",
             code: "gd",
             iso: "gla"
         },
         {
             language: "Serbian",
             code: "sr",
             iso: "srp"
         },
         {
             language: "Shona",
             code: "sn",
             iso: "sna"
         },
         {
             language: "Sinhala",
             code: "si",
             iso: "sin"
         },
         {
             language: "Slovak",
             code: "sk",
             iso: "slk"
         },
         {
             language: "Slovenian",
             code: "sl",
             iso: "slv"
         },
         {
             language: "Somali",
             code: "so",
             iso: "som"
         },
         {
             language: "Sotho, Southern",
             code: "st",
             iso: "sot"
         },
         {
             language: "Spanish",
             code: "es",
             iso: "spa"
         },
         {
             language: "Sranan Tongo",
             code: "srn",
             iso: "srn"
         },
         {
             language: "Swahili",
             code: "sw",
             iso: "swa"
         },
         {
             language: "Swedish",
             code: "sv",
             iso: "swe"
         },
         {
             language: "Swiss German",
             code: "gsw",
             iso: "gsw"
         },
         {
             language: "Syriac (Aramaic)",
             code: "syr",
             iso: "syr"
         },
         {
             language: "Tagalog",
             code: "tl",
             iso: "tgl"
         },
         {
             language: "Tajik",
             code: "tg",
             iso: "tgk"
         },
         {
             language: "Tamashek (Tuareg)",
             code: "tmh",
             iso: "tmh"
         },
         {
             language: "Tamil",
             code: "ta",
             iso: "tam"
         },
         {
             language: "Telugu",
             code: "te",
             iso: "tel"
         },
         {
             language: "Tetum",
             code: "tet",
             iso: "tet"
         },
         {
             language: "Thai",
             code: "th",
             iso: "tha"
         },
         {
             language: "Tibetan",
             code: "bo",
             iso: "bod"
         },
         {
             language: "Tigrinya",
             code: "ti",
             iso: "tir"
         },
         {
             language: "Tok Pisin",
             code: "tpi",
             iso: "tpi"
         },
         {
             language: "Tokelauan",
             code: "tkl",
             iso: "tkl"
         },
         {
             language: "Tongan",
             code: "to",
             iso: "ton"
         },
         {
             language: "Tswana",
             code: "tn",
             iso: "tsn"
         },
         {
             language: "Turkish",
             code: "tr",
             iso: "tur"
         },
         {
             language: "Turkmen",
             code: "tk",
             iso: "tuk"
         },
         {
             language: "Tuvaluan",
             code: "tvl",
             iso: "tvl"
         },
         {
             language: "Ukrainian",
             code: "uk",
             iso: "ukr"
         },
         {
             language: "Uma",
             code: "ppk",
             iso: "ppk"
         },
         {
             language: "Uzbek",
             code: "uz",
             iso: "uzb"
         },
         {
             language: "Vietnamese",
             code: "vi",
             iso: "vie"
         },
         {
             language: "Wallisian",
             code: "wls",
             iso: "wls"
         },
         {
             language: "Welsh",
             code: "cy",
             iso: "cym"
         },
         {
             language: "Wolof",
             code: "wo",
             iso: "wol"
         },
         {
             language: "Xhosa",
             code: "xh",
             iso: "xho"
         },
         {
             language: "Yiddish",
             code: "yi",
             iso: "yid"
         },
         {
             language: "Zulu",
             code: "zu",
             iso: "zul"
         }
     ]
 return my_memory_api;
     
 }
