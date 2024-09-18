const fs = require('fs');
const path = require('path');

class bodyValidator {
    constructor() {
        this.errors = [];
        this.acceptedFields = [
            {
                name: 'name',
                type: 'string',
                required: true
            },
            {
                description: 'description',
                type: 'string',
                required: false
            },
            {
                tags: 'tags',
                type: ['string'], // Tableau de chaînes de caractères
                required: false
            },
            {
                image: 'image',
                type: 'string',
                required: false
            },
            {
                url: 'url',
                type: 'string',
                required: true
            },
            {
                category: 'category',
                type: 'string',
                required: true
            }
        ];
    }

    validate(body) {
        try {
            // Vérifier si le body est un objet
            if (typeof body !== 'object') {
                this.errors.push('Le body doit être un objet');
                return false;
            }

            // Vérifier si les champs obligatoires sont présents
            this.acceptedFields.forEach(field => {
                if (field.required && !body[field.name]) {
                    this.errors.push(`Le champ ${field.name} est obligatoire`);
                }
            });

            // Vérifier si les champs en trop sont présents
            Object.keys(body).forEach(key => {
                const field = this.acceptedFields.find(field => field.name === key);
                if (!field) {
                    this.errors.push(`Le champ ${key} n'est pas accepté`);
                }
            });

            // Vérifier si les types des champs sont corrects
            Object.keys(body).forEach(key => {
                const field = this.acceptedFields.find(field => field.name === key);
                if (field) {
                    if (Array.isArray(field.type)) {
                        if (!Array.isArray(body[key])) {
                            this.errors.push(`Le champ ${key} doit être un tableau`);
                        } else {
                            body[key].forEach(value => {
                                if (typeof value !== field.type[0]) {
                                    this.errors.push(`Le champ ${key} doit contenir des ${field.type[0]}`);
                                }
                            });
                        }
                    } else {
                        if (typeof body[key] !== field.type) {
                            this.errors.push(`Le champ ${key} doit être de type ${field.type}`);
                        }
                    }
                }
            });

            body.id = this.generateObjectId();
            return { body, errors: this.errors.length === 0 };
        }
        catch (err) {
            this.errors.push(err.message || 'Erreur lors de la validation du body');
            return { body, errors: this.errors };
        }
    }

    generateObjectId() {
        const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
        const machineId = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
        const processId = Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0');
        const counter = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');

        return timestamp + machineId + processId + counter;
    }

}

exports.getAllSites = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../sites.json');

        // Vérifier si le fichier existe, sinon le créer
        if (!fs.existsSync(filePath)) {
            // Créer le fichier avec un tableau vide
            fs.writeFileSync(filePath, '[]');
        }

        // Lire le contenu du fichier
        const sites = fs.readFileSync(filePath, 'utf8');

        // Parser le contenu en JSON
        const sitesJSON = JSON.parse(sites);

        // Envoyer la réponse avec le contenu JSON
         return res.status(200).json(sitesJSON);
    } catch (err) {
        // Gestion des erreurs, si la lecture ou l'écriture échoue
        res.status(400).json({
            error: err.message || 'Erreur lors de la lecture du fichier'
        });
    }
};

exports.getSiteById = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../sites.json');

        // Vérifier si le fichier existe, sinon le créer
        if (!fs.existsSync(filePath)) {
            // s'il n'existe pas, on return une 404
            return res.status(404).json({ error: 'Fichier non trouvé' });
        }

        // Lire le contenu du fichier
        const sites = fs.readFileSync(filePath, 'utf8');

        // Parser le contenu en JSON
        const sitesJSON = JSON.parse(sites);

        // Récupérer le site par son ID
        const site = sitesJSON.find(site => site.id === req.params.id);

        // Envoyer la réponse avec le contenu JSON
        if (site) {
            return res.status(200).json(site);
        } else {
            return res.status(404).json({ error: 'Site non trouvé' });
        }
    } catch (err) {
        // Gestion des erreurs, si la lecture ou l'écriture échoue
        res.status(400).json({
            error: err.message || 'Erreur lors de la lecture du fichier'
        });
    }
}

exports.getSiteByName = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../sites.json');

        // Vérifier si le fichier existe, sinon le créer
        if (!fs.existsSync(filePath)) {
            // s'il n'existe pas, on return une 404
            return res.status(404).json({ error: 'Fichier non trouvé' });
        }

        // Lire le contenu du fichier
        const sites = fs.readFileSync(filePath, 'utf8');

        // Parser le contenu en JSON
        const sitesJSON = JSON.parse(sites);

        // Récupérer le site par son nom
        const site = sitesJSON.find(site => site.name === req.params.name);

        // Envoyer la réponse avec le contenu JSON
        if (site) {
            return res.status(200).json(site);
        } else {
            return res.status(404).json({ error: 'Site non trouvé' });
        }
    } catch (err) {
        // Gestion des erreurs, si la lecture ou l'écriture échoue
        res.status(400).json({
            error: err.message || 'Erreur lors de la lecture du fichier'
        });
    }
}

exports.deleteSite = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../sites.json');

        // Vérifier si le fichier existe, sinon le créer
        if (!fs.existsSync(filePath)) {
            // s'il n'existe pas, on return une 404
            return res.status(404).json({ error: 'Fichier non trouvé' });
        }

        // Lire le contenu du fichier
        const sites = fs.readFileSync(filePath, 'utf8');

        // Parser le contenu en JSON
        const sitesJSON = JSON.parse(sites);

        // Récupérer le site par son ID
        const siteIndex = sitesJSON.findIndex(site => site.id === req.params.id);

        // Supprimer le site de la liste
        if (siteIndex !== -1) {
            sitesJSON.splice(siteIndex, 1);
            // Écrire la liste mise à jour dans le fichier
            fs.writeFileSync(filePath, JSON.stringify(sitesJSON, null, 2));
            return res.status(204).json();
        } else {
            return res.status(404).json({ error: 'Site non trouvé' });
        }
    } catch (err) {
        // Gestion des erreurs, si la lecture ou l'écriture échoue
        res.status(400).json({
            error: err.message || 'Erreur lors de la lecture du fichier'
        });
    }
}

exports.updateSite = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../sites.json');

        // Vérifier si le fichier existe, sinon le créer
        if (!fs.existsSync(filePath)) {
            // s'il n'existe pas, on return une 404
            return res.status(404).json({ error: 'Fichier non trouvé' });
        }

        // Lire le contenu du fichier
        const sites = fs.readFileSync(filePath, 'utf8');

        // Parser le contenu en JSON
        const sitesJSON = JSON.parse(sites);

        // Valider le body de la requête
        const validator = new bodyValidator();
        const { body, errors } = validator.validate(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        // Récupérer le site par son ID
        const siteIndex = sitesJSON.findIndex(site => site.id === req.params.id);

        // Mettre à jour le site dans la liste
        if (siteIndex !== -1) {
            sitesJSON[siteIndex] = body;
            // Écrire la liste mise à jour dans le fichier
            fs.writeFileSync(filePath, JSON.stringify(sitesJSON, null, 2));
            return res.status(200).json(body);
        } else {
            return res.status(404).json({ error: 'Site non trouvé' });
        }
    } catch (err) {
        // Gestion des erreurs, si la lecture ou l'écriture échoue
        res.status(400).json({
            error: err.message || 'Erreur lors de la lecture du fichier'
        });
    }
}

exports.createSite = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../sites.json');

        // Vérifier si le fichier existe, sinon le créer
        if (!fs.existsSync(filePath)) {
            // Créer le fichier avec un tableau vide
            fs.writeFileSync(filePath, '[]');
        }

        // Lire le contenu du fichier
        const sites = fs.readFileSync(filePath, 'utf8');

        // Parser le contenu en JSON
        const sitesJSON = JSON.parse(sites);

        // Valider le body de la requête
        const validator = new bodyValidator();
        const { body, errors } = validator.validate(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        // Ajouter le nouveau site à la liste
        sitesJSON.push(body);

        // Écrire la liste mise à jour dans le fichier
        fs.writeFileSync(filePath, JSON.stringify(sitesJSON, null, 2));

        // Envoyer la réponse avec le contenu JSON
        return res.status(201).json(req.body);
    } catch (err) {
        // Gestion des erreurs, si la lecture ou l'écriture échoue
        res.status(400).json({
            error: err.message || 'Erreur lors de la lecture du fichier'
        });
    }
}
