/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-bitwise */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import axios from "axios";
import { Parser } from "json2csv";
import _ from "underscore";

interface ITranslation {
  /**
   * text in frech
   */
  vernacular_fr: string;

  /**
   * text in english
   */
  vernacular_en: string;
}

/**
 *
 * @param {*} i18next i18next
 * @param {*} translations translations
 * @param {*} source source
 * @returns obj
 */
export const addTranslation = async (
  i18next: any,
  translations: any,
  source: any
) => {
  const resources: any = {
    en: { translation: {} },
    fr: { translation: {} },
  };

  if (source.length !== undefined) {
    source.map((item: ITranslation) => {
      const key: string = item["vernacular_fr"] || "";
      resources["en"]["translation"][key] = item["vernacular_en"];
      resources["fr"]["translation"][key] = item["vernacular_fr"];
      return item;
    });
  }

  resources.en.translation = {
    ...resources.en.translation,
    ...translations.en.translation,
  };
  resources.fr.translation = {
    ...resources.fr.translation,
    ...translations.fr.translation,
  };

  i18next.addResourceBundle(
    "en",
    "translation",
    resources.en.translation,
    true,
    true
  );
  i18next.addResourceBundle(
    "fr",
    "translation",
    resources.fr.translation,
    true,
    true
  );
  return resources;
};

/**
 * function used to create request param object
 * @param {*} baseURL baseURL
 * @param {*} headers request headers
 * @param {*} params request params
 * @param {*} contentType type of the content (JSON, ...)
 * @returns object
 */
export const getRequestParams = (
  baseURL: string,
  headers: any,
  params = {},
  contentType = JSON
) => ({
  baseURL,
  responseType: contentType,
  headers,
  params,
});

/**
 *
 * @param {*} paramObj
 */
export const getImagesFromSpeciesMediaWikimedia = async (paramObj: any) => {
  const result = await axios.get(
    `https://species.wikimedia.org/w/api.php`,
    paramObj
  );

  return filterSpeciesWiki({ data: result.data, name: paramObj.params.titles });
};

/**
 *
 * @param params data
 * @returns object
 */
const filterSpeciesWiki = (params: any) => {
  const { data, name } = params;

  let result: any = [];
  if (typeof data !== "string" && data.hasOwnProperty("query")) {
    result = Object.values(data.query.pages)
      .filter((page: any) => {
        let title = page.title.replace("File:", "");
        title = title.replace(".jpg", "");
        const filterText = title.split(" ");
        const text = filterText.length > 0 ? filterText[0] : filterText;
        const imageinfo = page.imageinfo.filter(
          (item: any) =>
            item.thumbmime.indexOf("jpeg") !== -1 &&
            item.thumburl.toLowerCase().indexOf(".jpg") !== -1 &&
            item.url.toLowerCase().indexOf(text.toLowerCase()) !== -1
        );
        return imageinfo.length > 0;
      })
      .map((value: any) => {
        const imageinfo = value.imageinfo[0];

        return {
          url: imageinfo.url,
          thumburl: imageinfo.thumburl,
          comment: imageinfo.comment,
          name,
          height: imageinfo.height,
          width: imageinfo.width,
        };
      });
  }

  return result;
};

/**
 * fetch an image for a given species' name (image source species.wikimedia)
 * @param {*} param
 * @returns
 */
export const fetchSpeciesImage = async (params: any) => {
  const { valid_scientific_name } = params;

  const speciesBaseUrl = "https://species.wikimedia.org";
  const autoCompleteParamObj = getRequestParams(
    speciesBaseUrl,
    { Accept: "*/*" },
    {
      action: "query",
      generator: "images",
      prop: "imageinfo",
      gimlimit: 5,
      redirects: 1,
      titles: valid_scientific_name,
      format: "json",
      iiurlwidth: "500",
      origin: "*",
      iiprop:
        "timestamp|user|userid|comment|canonicaltitle|url|size|dimensions|mime|thumbmime|mediatype|bitdepth",
    }
  );

  const resutl = await getImagesFromSpeciesMediaWikimedia(autoCompleteParamObj);
  return { ...resutl, itemInfo: params };
};
