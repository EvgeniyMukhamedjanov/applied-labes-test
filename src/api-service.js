import _ from 'lodash';
import {getAuthDomain, getAuthPassword} from './auth-helper';

export default class ApiService {

    _apiBase = 'admin/api/2020-07/';
    _getApiPath = (url, domain = undefined) => {
        let authDomain = domain;
        if (authDomain === undefined) {
            authDomain = getAuthDomain();
        }
        return `https://cors-anywhere.herokuapp.com/https://${authDomain}.myshopify.com/${this._apiBase}${url}`;
    }

    createSectionForProductTemplate = async (sectionName, sectionValue) => {
        const result = {
            success: false
        }

        const sectionFileName = `${sectionName}.liquid`;

        const themes = await this.getThemes();
        if (!("themes" in themes)) {
            throw new Error(`Shopify theme has not been set up`);
        }
        const mainThemes = themes.themes.filter(({role}) => role === "main");
        if (mainThemes.length < 1) {
            throw new Error(`Shopify theme has not been set up`);
        }
        const themeId = mainThemes[0].id;

        const existedAsset = await this.getAsset(themeId, `sections/${sectionFileName}`).catch((error) => {
        });
        if (_.has(existedAsset, "asset")) {
            throw new Error(`Section "${sectionName}" has already existed`);
        }

        const existedTemplate = await this.getAsset(themeId, `templates/product.liquid`).catch((error) => {
            throw new Error(`Product template has not been found`);
        });
        if (!(_.has(existedTemplate, 'asset.value'))) {
            throw new Error(`Product template is broken`);
        }

        const newAsset = await this.putAsset(themeId, `sections/${sectionFileName}`, sectionValue);
        if (_.has(newAsset, "errors")) {
            const errorArray = [];
            for (let i in newAsset.errors) {
                errorArray.push(newAsset.errors[i]);
                throw new Error(errorArray.join("; "));
            }
        }

        const productUpdate = await this.putAsset(themeId, `templates/product.liquid`, `${existedTemplate.asset.value}\n\n{% section '${sectionName}' %}`);
        if (_.has(productUpdate, "errors")) {
            const errorArray = [];
            for (let i in productUpdate.errors) {
                errorArray.push(productUpdate.errors[i]);
                throw new Error(errorArray.join("; "));
            }
        }

        if ("asset" in newAsset && "asset" in productUpdate) {
            result.success = true;
        }

        return result;
    }

    getResource = async (url) => {
        const res = await fetch(this._getApiPath(url), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': getAuthPassword(),
            }
        });

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}` +
                `, received ${res.status}`)
        }
        return await res.json();
    };

    getShopForAuthentication = async (domain, password) => {
        const res = await fetch(this._getApiPath('shop.json', domain), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': password,
            }
        });

        const result = await res.json();

        if ("errors" in result) {
            throw new Error(`Could not authenticate: ${result.errors}`);
        }

        if (!res.ok) {
            throw new Error(`Could not authenticate`);
        }
        return await result;
    }

    getThemes = async () => {
        const res = await this.getResource('themes.json');
        return res;
    }

    getAsset = async (themeId, assetName) => {
        const res = await this.getResource(`themes/${encodeURIComponent(themeId)}/assets.json?asset[key]=${encodeURIComponent(assetName)}`);
        return res;
    }

    putAsset = async (themeId, assetName, assetValue) => {
        const asset = await fetch(this._getApiPath(`themes/${themeId}/assets.json`), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': getAuthPassword(),
            },
            body: JSON.stringify({
                "asset": {
                    "key": assetName,
                    "value": assetValue
                }
            })
        }).catch((error) => {
            throw new Error(`Could not create "${assetName}": ${error}`);
        });
        return asset.json();
    }

}
