/*
  Objet : Ce plugin définit un nouveau type de donnée, Claims IA Currency.
    Basiquement, ce type de donnée permet de manipuler un montant, avec comme attributs le nombre de décimales et la devise.
    La valeur est stockée en base en tant qu'entier. Par exemple, si le champ est définit avec 2 décimales, 
    la valeur stockée est multipliée par 100 
    La devise est automatiquement ajoutée en mode affichage
*/
const {
    textarea,
    text,
    table,
    th,
    tr,
    td,
    code,
    pre,
    input,
    i,
    button,
    text_attr,
    select,
    script,
    domReady,
    option,
    span,
    nbsp,
    section,
    div,
    a,
} = require("@saltcorn/markup/tags");

//const { input, text_attr } = require("@saltcorn/markup/tags");
const { features, getState } = require("@saltcorn/data/db/state");
//const db = require("@saltcorn/data/db");
const { sqlBinOp } = require("@saltcorn/data/plugin-helper");

const sql_name_function_allowed = !!sqlBinOp;

const locale = (req) => {
    //console.log(req && req.getLocale ? req.getLocale() : undefined);
    return req && req.getLocale ? req.getLocale() : undefined;
};

const cia_currency = {
    //
    // name:
    // chaîne de caractères donnant un nom court pour distinguer le nouveau type
    name: "Claims IA Currency",
    //
    // sql_name:
    // chaîne de caractères indiquant le type de données selon lequel la valeur sera stockée dans une base de données SQL.
    //  sql_name: sql_name_function_allowed
    //    ? ({ decimal_points }) =>
    //        `decimal(${16 + (decimal_points || 2)}, ${+(decimal_points || 2)})`
    //    : "decimal(18,2))", //legacy
    sql_name: "integer",
    //
    // fieldviews:
    // objet d'objets, chacun définissant une vue de champ,
    // qui permet à l'utilisateur de visualiser ou de modifier une valeur du nouveau type
    fieldviews: {
        // show: vue pourl'affichage de la valeur
        show: {
            configFields: (field) => {
                return [
                    ...(!field?.attributes?.currency
                        ? [
                              {
                                  type: "String",
                                  name: "currency",
                                  label: "Currency",
                                  sublabel:
                                      "Optional. ISO 4217. Example: USD or EUR",
                              },
                          ]
                        : []),
                    ...(!field?.attributes?.decimal_points
                        ? [
                              {
                                  label: "Decimal points",
                                  name: "decimal_points",
                                  type: "Integer",
                                  default: 2,
                                  required: true,
                                  sublabel:
                                      "Once set this cannot be changed. Number of fractional decimal points",
                              },
                          ]
                        : []),
                    {
                        type: "String",
                        name: "currencyDisplay",
                        label: "Currency display",
                        required: true,
                        attributes: {
                            options: ["symbol", "code", "name"],
                        },
                    },
                ];
            },
            isEdit: false,
            run: (val, req, attrs = {}) => {
                // Cast de la valeur si c'est une chaine de caractères
                //const v1 = typeof val === "string" ? +val : val;
                var v1 = typeof val === "string" ? +val : val;
                // Si le cast a réussi, la valeur est de type number
                // Dans ce cas, on met en forme la valeur affichée, avec le symbol monétaire
                if (typeof v1 === "number") {
                    v1 = v1 / Math.pow(10, attrs.decimal_points);
                    const locale_ = attrs.locale || locale(req) || "en";
                    return v1.toLocaleString(locale_, {
                        style: attrs.currency ? "currency" : "decimal",
                        currency: attrs.currency || undefined,
                        currencyDisplay: attrs.currencyDisplay || "symbol",

                        maximumFractionDigits: attrs.decimal_points,
                    });
                } else return "";
            },
        },
        // edit: vue pour la saisie de la valeur
        edit: {
            isEdit: true,
            run: (nm, v, attrs, cls, required, field) => {
                const id = `input${text_attr(nm)}`;
                const name = text_attr(nm);
/*
        return input({
          type: attrs?.type || "number",
          inputmode: attrs?.inputmode,
          pattern: attrs?.pattern,
          autocomplete: attrs?.autocomplete,
          class: ["form-control", cls],
          disabled: attrs.disabled,
          readonly: attrs.readonly,
          autofocus: attrs.autofocus,
          "data-fieldname": text_attr(field.name),
          name,
          onChange: attrs.onChange,
          id,
          step: "any",
          required: !!required,
          value: text_attr(v),
        });
*/

              return div(
                  { class: "cia-money" },
                  // INPUT
                  input({
                      type: attrs?.type || "number",
                      inputmode: attrs?.inputmode,
                      pattern: attrs?.pattern,
                      autocomplete: attrs?.autocomplete,
                      class: ["form-control", cls],
                      disabled: attrs.disabled,
                      readonly: attrs.readonly,
                      autofocus: attrs.autofocus,
                      "data-fieldname": text_attr(field.name) + "-input",
                      name: name + "-input",
                      // Mise à jour du champ caché (valeur stockée)
                      onChange: `document.getElementById('${id}').value = this.value*Math.pow(10, ${attrs.decimal_points})`,
                      id: id + "-input",
                      step: "any",
                      required: !!required,
                      // Valeur intiale
                      value: text_attr(v / Math.pow(10, attrs.decimal_points)),
                  }),
                  // HIDDEN
                  input({
                      type: "hidden",
                      "data-fieldname": text_attr(field.name),
                      name,
                      id,
                      value: text_attr(v),
                  }),
              );
            },
        },
    },
    //
    // attributes:
    // tableau d'objets spécifiant les attributs du type
    attributes: [
        {
            label: "Decimal points",
            name: "decimal_points",
            type: "Integer",
            default: 2,
            required: true,
            sublabel:
                "Once set this cannot be changed. Number of fractional decimal points",
        },
        {
            type: "String",
            name: "currency",
            label: "Currency",
            sublabel: "Optional. ISO 4217. Example: USD or EUR",
        },
    ],
    //
    // readFromDB:
    // Si les données doivent être transformées de leur représentation dans la base de données vers leur représentation JavaScript,
    // spécifier la transformation ici. Cela permet de résoudre les incohérences entre différentes bases de données.
    readFromDB: (v) =>
        typeof v === "string" ? +v : v,
    //
    // read:
    // fonction qui prend comme argument une valeur JavaScript de différents types JavaScript et qui produit une représentation
    // JavaScript valide pour une valeur de ce type, ou undefined si l'argument ne peut pas être converti en une représentation valide.
    read: (v, attrs) => {
        switch (typeof v) {
            case "string":
                if (v === "") return null;
                return +v;
            default:
                return v;
        }
    },
    //
    // validate:
    // fonction qui transforme les attributs en une fonction qui transforme la représentation JavaScript de la valeur en un booléen.
    // Indique si cette valeur est valide dans les limites des paramètres définis par les attributs, le cas échéant.
    //
    // validate_attributes:
    // fonction qui transforme les attributs (sous forme d'objet) en une valeur booléenne indiquant si ces attributs
    // sont cohérents et valides. Il arrive que des attributs soient invalides : par exemple, les types numériques possèdent des attributs
    // min et max. Un ensemble d'attributs n'est pas valide si min > max
    //
    // presets:
    // Un type peut définir des préréglages à l'aide d'un objet de fonctions renvoyant une représentation JavaScript de la valeur.
    // Par exemple, les préréglages du type date incluent une fonction renvoyant l'heure actuelle. Ces préréglages peuvent servir à
    // préremplir automatiquement les champs d'un formulaire.
    //
    // readFromFormRecord:
    // Certains types de données ne peuvent être lus à partir des valeurs d'un formulaire qu'en lisant l'intégralité de celui-ci.
    // C'est notamment le cas pour les valeurs booléennes, car une case à cocher non cochée n'apparaît pas dans les résultats.
    //
};

module.exports = {
    sc_plugin_api_version: 1,
    types: [cia_currency],
    plugin_name: "Claims IA Currency",
    /*onLoad() {
    console.log("load");
    db.pool.on("connect", async function (client) {
      // https://github.com/pgvector/pgvector-node/blob/master/src/pg/index.js
      const result = await client.query(
        "SELECT typname, oid, typarray FROM pg_type WHERE typname = $1",
        ["vector"]
      );
      if (result.rowCount < 1) {
        throw new Error("vector type not found in the database");
      }
      const oid = result.rows[0].oid;
      client.setTypeParser(oid, "text", function (value) {
        return JSON.stringify(value);
      });
    });
  },*/
};
