const mongoose = require('mongoose');

const inscritSchema = new mongoose.Schema({
    nom: { type: String, required: true, trim: true },
    prenoms: { type: String, required: true, trim: true },
    sexe: { type: String, required: true, enum: ['Homme', 'Femme'] },
    dateNaissance: { type: Date, required: true },
    lieuNaissance: { type: String, required: true, trim: true },
    zone: { type: String, required: true, enum: ['LOBIA', 'LABIA', 'UBERSONE', 'ZOUKOUGBE'] },
    egliseLocale: {
        type: String,
        required: true,
        enum: ['LOBIA', 'TAZIBOUO', 'KENEDY', 'OUROUTA', 'TAGOURA', 'BRIZEBOUA', 'LABIA', 'BETLEME', 'GADOUAN', 'GONATE']
    },
    direction: { type: String, required: true, enum: ['HOMME', 'FEMME', 'JEUNESSE', 'DFD', 'DFNC'] },
    responsabilite: {
        type: String,
        required: true,
        enum: ['REPRESENTANT_REGION', 'RESPONSABLE_DIRECTION', 'ZONALE_PRINCIPALE', 'ZONALE', 'SECTEUR', 'OUVRIER']
    },
    contact: { type: String, required: true, trim: true },
    dateInscription: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Inscrit || mongoose.model('Inscrit', inscritSchema);
