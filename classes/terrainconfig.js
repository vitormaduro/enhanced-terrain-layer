import { TerrainLayer } from './terrainlayer.js';
import { log, setting, i18n} from '../terrain-main.js';

export class TerrainConfig extends FormApplication {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "terrain-config",
            classes: ["sheet", "terrain-sheet"],
            title: i18n("EnhancedTerrainLayer.Configuration"),
            template: "modules/enhanced-terrain-layer/templates/terrain-config.html",
            width: 400,
            submitOnChange: true
        });
    }

    /* -------------------------------------------- */

    /** @override */
    getData(options) {
        var _terraintypes = canvas.terrain.getTerrainTypes().reduce(function (map, obj) {
            map[obj.id] = i18n(obj.text);
            return map;
        }, {});

        var _environments = canvas.terrain.getEnvironments().reduce(function (map, obj) {
            map[obj.id] = i18n(obj.text);
            return map;
        }, {});

        var _obstacles = canvas.terrain.getObstacles().reduce(function (map, obj) {
            map[obj.id] = i18n(obj.text);
            return map;
        }, {});

        return {
            object: duplicate(this.object.data),
            options: this.options,
            terraintypes: _terraintypes,
            environments: _environments,
            obstacles: _obstacles,
            useObstacles: setting('use-obstacles'),
            submitText: this.options.preview ? "Create" : "Update"
        }
    }

    /* -------------------------------------------- */

    /** @override */
    _onChangeInput(event) {
        if ($(event.target).attr('name') == 'multiple') {
            let val = $(event.target).val();
            $(event.target).next().html(TerrainLayer.multipleText(val));
        }
    }

    /* -------------------------------------------- */

    /** @override */
    async _updateObject(event, formData) {
        if (!game.user.isGM) throw "You do not have the ability to configure a Terrain object.";
        if (this.object.id) {
            let data = duplicate(formData);
            data._id = this.object.id;
            data.multiple = (data.multiple == 0 ? 0.5 : parseInt(data.multiple));
            return this.object.update(data);
        }
        return this.object.constructor.create(formData);
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}