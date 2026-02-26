const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'JUDILIBRE-public',
            description: 'La Cour de cassation, dans le cadre de la refonte de son site Web, a initié le projet JUDILIBRE visant à la conception et au développement en interne d\'un moteur de recherche dans le corpus jurisprudentiel, mettant celui-ci à disposition du public dans l\'esprit du décret sur l\'Open Data des décisions de justice.',
            version: '1.2.4',
        },
        components: {
            securitySchemes: {
                access: {
                    type: 'apiKey',
                    name: 'KeyId',
                    in: 'header',
                    description: 'Access'
                }
            }
        }
    },
    apis: ['./src/swagger/*.swagger.js'],
};

const spec = swaggerJsdoc(options);
fs.writeFileSync(path.join(__dirname, '..', '..', 'public', 'swagger.json'), JSON.stringify(spec, null, 2));