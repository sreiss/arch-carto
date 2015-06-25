'use strict';
angular.module('archCarto')
  .constant('i18nfrFRConstant', {
    CUSTOMER_NAME: "ArchCarto",
    CUSTOMER_DESC: "Planificateur de Parcours de Randonnées",

    MAIN_PAGE_HOME: "Accueil",
    MAIN_PAGE_ABOUTUS: "A propos",
    MAIN_PAGE_SERVICES: "Services",
    MAIN_PAGE_LOGIN: "Connexion",
    MAIN_PAGE_LOGOUT: "Déconnexion",
    MAIN_PAGE_SIGNIN: "Inscription",
    MAIN_PAGE_MAP: "Carte",
    MAIN_PAGE_BACKTOTOP: "Revenir en haut",

    ADD_A_POINT_OF_INTEREST: "Ajouter un point d'intérêt",
    LATITUDE: "Latitude",
    LONGITUDE: "Longitude",
    NAME: "Nom",
    DESCRIPTION: "Description",
    BY_GPS: "Par coordonnées GPS",
    GIVING_A_LOCATION: "En donnant un lieu",
    PLEASE_PROVIDE_GPS_COORDINATES_TO_CENTER_THE_MAP: "Veuillez fournir des coordonnées GPS pour centrer la carte.",
    CHOOSE_CENTER: "Déterminer le centre",
    SELECT_A_TYPE: "Sélectionner un type",
    TYPE: "Type",
    ADD_A_NEW_TYPE: "Ajouter un nouveau type",
    ADD: "Ajouter",
    CANCEL: "Annuler",
    SAVE: "Sauvegarder",
    CHOOSE: "Choisir",
    OR: "ou",
    MUST_BE_A_NUMBER: "Doit être un nombre",
    PLEASE_PROVIDE_A_LATITUDE: "Veuillez fournir une latitude",
    PLEASE_PROVIDE_A_LONGITUDE: "Veuillez fournir une longitude",
    PLEASE_PROVIDE_A_NAME: "Veuillez fournir un nom",
    MAX_LATITUDE_IS_90: "La latitude maximum est 90",
    MIN_LATITUDE_IS_M90: "La latitude minimum est -90",
    MAX_LONGITUDE_IS_180: "La longitude maximum est 180",
    MIN_LONGITUDE_IS_M180: "La longitude minimum est 180",
    WHAT_DO_YOU_WANT_TO_DO: "Que souhaitez-vous faire ?",
    ADD_A_POI: "Ajouter un point d'intérêt",
    REPORT_A_BUG: "Signaler un bug",
    REPORT: "Signaler",
    PLEASE_DESCRIBE_THE_BUG_YOU_ENCOUNTERED: "Veuillez décrire le problème que vous avez rencontré.",
    YOU_MUST_DESCRIBE_THE_BUG: "Vous devez décrire votre bug pour le soumettre",
    BUG_ADDED: "Bug signalé",
    POINTS_OF_INTEREST: "Points d'intérêt",
    POINT_OF_INTEREST_ADDED: "Point d'intérêt ajouté",
    UPLOAD_A_GPX_TRACE: "Uploader une trace GPX",
    UPLOAD: "Upload",
    GPX_FILE: "Fichier GPX",
    YOU_MUST_CHOOSE_A_FILE_TO_UPLOAD: "Vous devez choisir un fichier à uploader",
    THE_FIRST_STEP_IS_TO_DETERMINE_THE_CENTER_OF_THE_MAP: "La première étape est de choisir le centre de la carte.",
    LOCATION: "Lieu",
    PLEASE_PROVIDE_A_LOCATION: "Veuillez renseigner un lieu",
    PLEASE_START_TYPING_THE_NAME_OF_A_LOCATION_THEN_SELECT_IT: "Veuillez commencer à taper le nom d'un lieu puis le sélectionner.",
    SET_MAP_CENTER: "Définir le centre de la carte",
    BACK: "Retour",
    BUGS: "Bugs",
    PATHS: "Chemins",
    WELCOME: "Bienvenue",
    ACCESS_MAP: "Accéder à la carte",
    HOME: "Accueil",
    CLICK_ON_THE_MAP_TO_START: "Cliquez sur la carte pour commencer.",
    CLICK_ON_THE_MAP_TO_REVEAL_COORDINATE_ACTIONS: "Cliquez sur la carte pour afficher les actions liées.",
    BUG_LIST: "Liste de bugs",
    NO_BUG_REPORTED: "Aucun bug signalé",
    TYPE_A_LOCATION_NAME: "Entrez le nom d'un lieu",
    LOCK_POINTS_OF_INTEREST: "Verouiller les points d'intérêt",
    UNLOCK_POINTS_OF_INTEREST: "Déverouiller les points d'intérêt",
    RESOLVE: "Marquer comme résolu",
    UNSOLVED: "Non résolus",
    ALL: "Tous",
    RESOLVED: "Résolus",
    TRACE_LIST: "Liste de trace",
    NO_TRACE_REPORTED: "Aucune  trace signalée",
    OOPS_NO_CENTER: "Oops ! Pas de centre",
    NO_CENTER_SET_YOU_NEED_TO_SET_ONE: "Le centre de la carte n'a pas pu être déterminé automatiquement, il vous faut le faire manuellement.",
    ADD_A_MARKER: "Ajouter un point",
    PLEASE_INDICATE_THE_TYPE_OF_MARKER_YOU_WANT_TO_ADD: "Veuillez indiquer le type de marqueur que vous souhaitez ajouter à la carte.",
    POINT_OF_INTEREST: "Point d'intérêt",
    BUG: "Anomalie",
    SEARCH: "Recherche",

    SINCE: "depuis",
    AWAITING_ADDITION: "En attente d'ajout",
    AWAITING_DELETION: "En attente de suppression",
    AWAITING_UPDATE: "En attente de mise à jour",
    ADDED: "Ajouté",
    DELETED: "Supprimé",
    UPDATED: "Mis à jour",
    REPORTED: "Signalé",

    COATING: "Revêtement",
    NOT_DEFINED: "Non défini",
    EDIT: "Editer",
    ADD_MEDIA: "Ajouter une photo",
    DROP_FILES_HERE: "Déposez vos fichiers ici",
    ADD_SOME: "En ajouter",
    ASSOCIATED_MEDIAS: "Photos associées",
    NO_MEDIAS_FOUND: "Aucune photo associée",
    PATH: "Tronçon",
    SANDY: "Sableux",
    STONY: "Rocailleux",
    SELECT_A_COATING: "Selectionner un revêtement",
    PATH_DETAILS: "Détails du tronçon",
    ROAD: "Route",
    FOREST_ROAD: "Chemin de terre",
    BEATEN_PATH: "Sentier battu",
    SINGLE: "Single",

    COURSE_DETAILS: "Détails de l'itinéraire",
    COMMENTARY: "Commentaire",
    PUBLIC: "Public",
    DIFFICULTY: "Difficulté",
    LENGTH: "Longueur",
    NONE: "Aucun",
    NOT_COMMUNICATED_M: "Non communiqué",
    NOT_COMMUNICATED_F: "Non communiquée",
    YES: "Oui",
    NO: "Non",
    AUTHOR: "Auteur",
    RATING: "Note",
    AVERAGE_RATING: "Note moyenne",
    MEMBER_SPACE: "Espace membre",
    COURSES_I_RATED: "Itinéraires que j'ai noté",
    MY_COURSES: "Mes itinéraires",
    MY_FAVORITE_COURSES: "Mes itinéraires favoris",
    PERSONAL_INFOS : "Informations personnelles",

    SUBSCRIBE_FORM_TITLE : "Inscrivez-vous en quelques secondes !",
    SUBSCRIBE_FORM_LNAME : "Nom",
    SUBSCRIBE_FORM_FNAME : "Prénom",
    SUBSCRIBE_FORM_EMAIL : "Adresse e-mail",
    SUBSCRIBE_FORM_SUBMIT : "M'inscrire",
    SUBSCRIBE_FORM_CGU_1 : "J'accepte les",
    SUBSCRIBE_FORM_CGU_2 : "conditions d'utilisations générales.",
    EMAIL_ALREADY_EXISTS : "Un compte est déjà associé à cette adresse e-mail.",
    SUBSCRIBE_SUCCESS_1 : "Félicitations ! Votre compte a été créé avec succès.",
    SUBSCRIBE_SUCCESS_2 : "Consultez vos e-mails pour récupérer vos identifiants.",

    PERSONAL_INFOS_FORM_LNAME : "Nom",
    PERSONAL_INFOS_FORM_FNAME : "Prénom",
    PERSONAL_INFOS_FORM_EMAIL : "Adresse e-mail",
    PERSONAL_INFOS_FORM_PASSWORD : "Mot de passe",
    PERSONAL_INFOS_FORM_CONFIRM : "Confirmation",
    PERSONAL_INFOS_FORM_PASSWORD_DIFFERENT : "Les mots de passe ne sont pas égaux.",
    PERSONAL_INFOS_FORM_UPDATE_SUCCESS : "Profil mis à jour avec succès.",
    PERSONAL_INFOS_FORM_UPDATE_FAIL : "Une erreur est survenue à la mise à jour de votre profil.",

    ADD_THIS_PATH: "Ajouter ce chemin",
    ARE_YOU_SURE_YOU_WANT_TO_ADD_THIS_PATH: "Êtes-vous sûr de vouloir ajouter ce chemin ?",

    CANCEL_DRAWING: "Annuler le dessin",
    DELETE_LAST_POINT_DRAWN: "Supprimer le dernier point ajouté",
    DELETE_LAST_POINT: "Supprimer le dernier point",
    DRAW_A_POLYLINE: "Dessiner un tronçon",
    DRAW_A_POLYGON: "Dessiner un polygone",
    DRAW_A_RECTANGLE: "Dessiner un rectangle",
    DRAW_A_CIRCLE: "Dessiner un cercle",
    DRAW_A_MARKER: "Ajouter un point",
    CLICK_AND_DRAG_TO_DRAW_CIRCLE: "Cliquer et tirer pour dessiner un cercle.",
    RADIUS: "Rayon",
    CLICK_MAP_TO_PLACE_MARKER: "Cliquer pour placer le point",
    CLICK_TO_START_DRAWING_SHAPE: "Cliquer pour commencer à dessiner une forme.",
    CLICK_TO_CONTINUE_DRAWING_SHAPE: "Cliquer pour continuer à dessiner la forme.",
    CLICK_FIRST_POINT_TO_CLOSE_THIS_SHAPE: "Cliquer sur le premier point pour terminer la forme.",
    SHAPE_EDGES_CANNOT_CROSS: "Les coins de la forme ne peuvent pas se croiser.",
    CLICK_TO_START_DRAWING_LINE: "Cliquer pour commencer à dessiner un tronçon.",
    CLICK_TO_CONTINUE_DRAWING_LINE: "Cliquer pour continuer à dessiner un tronçon.",
    CLICK_LAST_POINT_TO_FINISH_LINE: "Cliquer sur le dernier point pour terminer le tronçon.",
    CLICK_AND_DRAG_TO_DRAW_RECTANGLE: "Cliquer pour dessiner un rectangle.",
    RELEASE_MOUSE_TO_FINISH_DRAWING: "Relâcher la souris pour terminer le dessin.",
    SAVE_CHANGES: "Sauvegarder les changements.",
    CANCEL_EDITING_DISCARDS_ALL_CHANGES: "Quitter l'édition et annuler tous les changements.",
    EDIT_LAYERS: "Editer les couches.",
    NO_LAYERS_TO_EDIT: "Aucune couche à éditer.",
    DELETE_LAYERS: "Supprimer les couches.",
    NO_LAYERS_TO_DELETE: "Aucune couche à supprimer.",
    DRAG_HANDLES_OR_MARKER_TO_EDIT_FEATURE: "Tirer points pour éditer les tracés.",
    CLICK_CANCEL_TO_UNDO_CHANGES: "Cliquer sur \"Annuler\" pour revenir en arrière.",
    CLICK_ON_A_FEATURE_TO_REMOVE: "Cliquer sur un points ou un tronçon pour le supprimer.",

    YOU_DO_NOT_HAVE_THE_RIGHTS_TO_DO_THAT: "Vous n'avez pas le droit d'exécuter cette action.",
    YOU_HAVE_TO_BE_LOGGED_IN_TO_ACCESS_THIS_AREA: "Vous devez être connecté pour accéder à cette zone.",
    OK: "D'accord",
    JUNCTION_ADDED: "Jonction ajoutée",
    ERROR: "Erreur",
    NEW_JUNCTION: "Nouvelle jonction",

    MONUMENT: "Monument",
    WATER: "Point d'eau",
    EXCEPTIONNAL: "Exceptionel",
    RESTAURANT: "Restaurant",
    SHELTER: "Abri",

    POI_ADDED: "Point d'intérêt ajouté"
  });
