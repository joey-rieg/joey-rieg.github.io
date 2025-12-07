/**
 * A collection of color codes for an "Orange & Teal" look.
 * Each color is provided in hex format.
 */
const ColorCodes = {
    orange_willpower: '#FD5901',
    orange_utk: '#F78104',
    orange_carrot: '#ED9924',
    orange_burnt: '#CC550E',
    orange_bright: '#FFA261',

    teal: '#008083',
    teal_bangladesh_green: '#005F60',
    teal_blue_sapphire: '#115C80',
    teal_medium: '#008081',
    teal_vibrant: '#43CCB3',
    teal_soothing: '#009B77'
};


/**
 * A class to manage the "Orange & Teal" palette with descriptive accessors.
 */
class Palette {
    constructor(colors) {
        this._colors = colors;
    }

    // Accessors for primary colors
    get primaryTeal() {
        return this._colors.teal;
    }

    get primaryOrange() {
        return this._colors.orange_utk;
    }

    // Accessors for secondary/accent colors
    get secondaryTeal() {
        return this._colors.teal_blue_sapphire;
    }

    get secondaryOrange() {
        return this._colors.orange_carrot;
    }

    // Accessors for light/vibrant colors
    get lightTeal() {
        return this._colors.teal_vibrant;
    }

    get lightOrange() {
        return this._colors.orange_bright;
    }

    // Accessors for dark/deep colors
    get deepTeal() {
        return this._colors.teal_bangladesh_green;
    }

    get deepOrange() {
        return this._colors.orange_burnt;
    }
}

export const palette = new Palette(ColorCodes);
