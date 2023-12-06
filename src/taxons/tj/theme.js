// This list cannot be produced automatically! (copied from CA)
const taxon = {
  1: {
    label: 'Droit des personnes',
    subs: {
      10: 'Nationalité',
      11: 'Etat civil',
      12: 'Nom - Prénom',
      14: 'Droits attachés à la personne',
      '10A':
        "Demande tendant à contester l'enregistrement ou le refus d'enregistrement d'une déclaration de nationalité",
      '10B': 'Action déclaratoire ou négatoire de nationalité',
      '10C': 'Contestation sur une question de nationalité soulevée par voie de question préjudicielle',
      '10Z': 'Autres demandes en matière de nationalité',
      '11C': "Demande sanctionnant le dysfonctionnement de l'état civil",
      '11F': "Contestation d'une décision d'irrecevabilité d'une déclaration conjointe de PACS",
      '11G': "Demande aux fins d'annulation de PACS",
      '12A': "Demande de changement, de substitution ou de reprise de nom d'un enfant naturel",
      '12B': "Demande relative à l'usage du nom d'un conjoint ou d'un ex-conjoint",
      '12C': 'Contestation du choix du prénom par le procureur de la République',
      '12D': 'Demande de changement de prénom',
      '12Z': 'Autres demandes en matière de nom ou de prénom',
      '14A': "Demande tendant à la réparation et/ou à la cessation d'une atteinte au droit au respect de la vie privée",
      '14B': "Demande relative à l'organisation des funérailles ou à la sépulture",
      '14C': "Demande relative à l'internement d'une personne",
      '14D':
        "Demande de relevé des peines de la faillite personnelle et/ou de l'interdiction de diriger, de gérer, d'administrer ou de contrôler",
      '14E': "Demande tendant à la réparation et/ou à la cessation d'une atteinte à la présomption d'innocence",
      '14G': "Demande d'autorisation relative à la rétention et au maintien en zone d'attente d'un étranger",
      '14H':
        "Demande de mainlevée de la rétention formée devant le juge des libertés et de la détention par l'étranger",
      '14I':
        "Demande de mainlevée d'une mesure d'hospitalisation complète par le patient ou toute personne agissant dans son intérêt",
      '14J':
        "Demande de mainlevée d'une mesure d'hospitalisation autre que complète par le patient ou toute personne agissant dans son intérêt",
      '14K': "Demande de contrôle obligatoire périodique de la nécessité d'une mesure d'hospitalisation complète",
      '14L':
        "Demande de contrôle de la nécessité d'une mesure d'hospitalisation complète en cas de désaccord entre psychiatres et préfet",
      '14N':
        "Contestation de la légalité de l'arrêté de placement en rétention devant le juge des libertés et de la détention par l'étranger",
      '14O': "Demande de prolongation d'une mesure de quarantaine ou d'isolement",
      '14P': "Demande de mainlevée d'une mesure de quarantaine ou d'isolement",
      '14X': "Droits attachés à la personnes - nature d'affaire indéternimée",
    },
  },
  2: {
    label: 'Droit de la famille',
    subs: {
      20: 'Divorce',
      21: 'Séparation de corps',
      22: 'Demandes postérieures au prononcé du divorce ou de la séparation de corps',
      23: 'Mariage et régimes matrimoniaux',
      24: 'Obligations à caractère alimentaire',
      25: "Filiation légitime et légitimation (postes à n'utiliser qu'en cas de recours à compter du 1er juillet 2006)",
      26: 'Filiation naturelle (recours) et filiation adoptive',
      28: 'Partage, indivision, succession',
      29: 'Libéralités (donations et testaments)',
      '20A': 'Demande en divorce sur requête conjointe',
      '20B': 'Demande en divorce sur demande acceptée',
      '20C': 'Demande en divorce pour rupture de la vie commune, en cas de séparation de fait',
      '20D': "Demande en divorce pour rupture de la vie commune, en cas d'altération des facultés mentales",
      '20E': 'Demande en divorce pour faute',
      '20F': 'Demande en conversion de la séparation de corps en divorce',
      '20H': "Action en opposabilité ou en inopposabilité d'une décision de divorce rendue à l'étranger",
      '20I': 'Demande en divorce par consentement mutuel',
      '20J': 'Demande en divorce autre que par consentement mutuel',
      '20K': 'Demande en divorce par consentement mutuel - passerelle -',
      '20X': "Divorce - nature d'affaire indéterminée",
      '21A': 'Demande en séparation de corps sur requête conjointe',
      '21B': 'Demande en séparation de corps sur demande acceptée',
      '21C': 'Demande en séparation de corps pour rupture de la vie commune, en cas de séparation de fait',
      '21D': "Demande en séparation de corps pour rupture de la vie commune, en cas d'altération des facultés mentales",
      '21E': 'Demande en séparation de corps pour faute',
      '21G':
        "Action en opposabilité ou en inopposabilité d'une décision prononçant la séparation de corps rendue à l'étranger",
      '21H': 'Demande en séparation de corps par consentement mutuel',
      '21I': 'Demande en séparation de corps autre que par consentement mutuel',
      '21J': 'Demande en séparation de corps par consentement mutuel - passerelle -',
      '21X': "Séparation de corps- nature d'affaire indéterminée",
      '22G': 'Demande relative à la liquidation du régime matrimonial',
      '23A': 'Demande en nullité de mariage',
      '23B': "Demande de mainlevée d'une opposition à mariage",
      '23H': 'Demande en séparation de biens judiciaire',
      '23I': "Demande en nullité de mariage célébré à l'étranger par le procureur de la République de Nantes",
      '23J': 'Demande en nullité de mariage célébré en France par le procureur de la République',
      '23K': 'Demande en nullité de mariage par toute partie autre que le procureur de la République',
      '24G': 'Action à fin de subsides',
      '24H': 'Contestation relative au paiement direct ou au recouvrement public des pensions alimentaires',
      '25D': 'Action en rétablissement de la présomption de paternité légitime',
      '25F': "Action en revendication d'enfant légitime ",
      '25G': 'Demande de légitimation postérieurement au mariage',
      '25H':
        "Demande relative au consentement à une procréation médicalement assistée ou à la délivrance d'un acte de notoriété constatant la possession d'état d'enfant légitime.",
      '25I': 'Demande de légitimation par autorité de justice ',
      '26A': 'Action en contestation de reconnaissance et demande en nullité de reconnaissance ',
      '26B': 'Action en recherche de paternité naturelle ',
      '26C': 'Action en recherche de maternité naturelle ',
      '26E': "Demande en déclaration d'abandon",
      '26F': "Demande d'adoption simple",
      '26G': "Demande d'adoption plénière",
      '26H': "Demande de révocation d'une adoption simple",
      '26I':
        "Demande relative au consentement à une procréation médicalement assistée ou à la délivrance d'un acte de notoriété constatant la possession d'état - filiation naturelle - ",
      '26J': "Demande d'adoption simple de l'enfant du conjoint",
      '26K': "Demande d'adoption plénière de l'enfant du conjoint",
      '26Y': 'Autres demandes relatives à la filiation adoptive',
      '26Z': 'Autres demandes relatives à la filiation naturelle et à la filiation adoptive ',
      '28A': 'Demande en partage, ou contestations relatives au partage',
      '28B': "Demande en annulation d'un acte accompli sur un bien indivis, ou d'une convention d'indivision",
      '28C': 'Demande relative aux pouvoirs de gestion des biens indivis',
      '28D': "Demande relative aux charges et revenus de l'indivision",
      '28E': "Demande relative à l'option successorale",
      '28F': 'Recours sur la succession exercé par un organisme social',
      '28G': 'Demande relative à une succession vacante ou non réclamée',
      '28H': "Demande d'apposition de scellés",
      '28I': 'Contestation en matière de scellés',
      '28Z': 'Autres demandes en matière de succession',
      '29A': "Demande en annulation, en réduction d'une libéralité ou d'une clause d'une libéralité",
      '29B': "Demande en révocation d'une libéralité ou en caducité d'un legs",
      '29C': "Demande en délivrance d'un legs",
      '29D': "Demande relative aux modalités d'une libéralité faite au conjoint survivant",
      '29E': 'Demande relative au rapport à succession',
      '29F': "Demande relative aux libéralités faites à l'Etat ou à des établissements publics",
      '29Z': 'Autres demandes en matière de libéralités',
      '2A': 'Filiation',
      '2A1':
        "TMFPO - Requête sans médiation préalable - demande de modification de l'exercice de l'autorité parentale ou de la résidence habituelle des enfants mineurs",
      '2A2':
        "TMFPO - Requête sans médiation préalable - demande de modification de la contribution à l'entretien des enfants",
      '2A3': 'TMFPO - Requête sans médiation préalable - demande de modification du droit de visite',
      '2A4':
        'TMFPO - Requête sans médiation préalable - demande de modification de la pension alimentaire des enfants mineurs nés hors mariage',
      '2A5':
        "TMFPO - Requête sans médiation préalable - demande de modification de l'exercice de l'autorité parentale, de la résidence habituelle des enfants mineurs, ou au droit de visite - parents non mariés - ",
      '2AA': 'Action en recherche de paternité',
      '2AB': 'Action en recherche de maternité - dans le mariage -',
      '2AC': 'Action en recherche de maternité - hors mariage -',
      '2AD': 'Action en rétablissement de la présomption de paternité',
      '2AE': "Action en constatation de la possession d'état d'un enfant né dans le mariage",
      '2AF': "Action en constatation de la possession d'état d'un enfant né hors mariage",
      '2AG':
        "Demande de délivrance d'un acte de notoriété relative à la possession d'état d'un enfant né dans le mariage",
      '2AH': "Demande de délivrance d'un acte de notoriété relative à la possession d'état d'un enfant né hors mariage",
      '2AI': 'Demande relative au consentement à une procréation médicalement assistée  - dans le mariage -',
      '2AJ': 'Demande relative au consentement à une procréation médicalement assistée - hors mariage -',
      '2AK': "Demande de mainlevée d'une opposition à reconnaissance de paternité ou de maternité",
      '2AM': 'Action en contestation de maternité - dans le mariage -',
      '2AN': 'Action en contestation de maternité - hors mariage -',
      '2AO': 'Action en contestation de paternité - dans le mariage -',
      '2AP': 'Action en contestation de paternité - hors mariage -',
      '2AQ': "Action en contestation de la possession d'état d'un enfant né dans le mariage",
      '2AR': "Action en contestation de la possession d'état d'un enfant hors mariage",
      '2AS': 'Demande formée par le ministère public visant à contester la filiation  maternelle - dans le mariage-',
      '2AT': 'Demande formée par le ministère public visant à contester la filiation  maternelle -hors mariage -',
      '2AU': 'Demande formée par le ministère public visant à contester la filiation paternelle - dans le mariage -',
      '2AV': 'Demande formée par le ministère public visant à contester la  filiation paternelle - hors mariage-',
      '2AZ': 'Autres demandes relatives à la filiation',
    },
  },
  3: {
    label: 'Droit des affaires',
    subs: {
      30: 'Bail commercial',
      31: 'Vente du fonds de commerce',
      32: 'Location-gérance du fonds de commerce',
      33: "Nantissement du fonds de commerce, du fonds artisanal, de l'outillage et du matériel d'équipement ou des stocks",
      34: 'Groupements : Fonctionnement (I)',
      35: 'Groupements : Fonctionnement (II)',
      36: 'Groupements : Dirigeants',
      38: 'Banque - Effets de commerce',
      39: 'Concurrence',
      '30A': 'Demande en nullité du bail commercial',
      '30B': "Demande en paiement des loyers et charges et/ou tendant à la résiliation du bail et/ou à l'expulsion",
      '30C': 'Demande de fixation du prix du bail révisé ou renouvelé',
      '30D': 'Action relative à la despécialisation',
      '30E': 'Action en contestation de congé et/ou demande de renouvellement de bail',
      '30F': "Demande d'évaluation et/ou en paiement de l'indemnité d'éviction",
      '30G': "Demande d'exécution de travaux à la charge du bailleur, ou demande en garantie contre le bailleur",
      '30H': 'Demande de fixation du prix de cession du bail commercial en cas de préemption',
      '30Z': 'Autres demandes en matière de baux commerciaux',
      '31A': 'Demande en nullité des promesses de vente ou de vente de fonds de commerce',
      '31B': 'Demande en paiement du prix et/ou tendant à faire sanctionner le non-paiement du prix',
      '31C': 'Demande formée par les créanciers du vendeur inscrits ou opposants',
      '31D': 'Demande en garantie formée contre le vendeur',
      '31E': "Demande en radiation de l'inscription du privilège du vendeur",
      '31F': "Demande en nullité ou mainlevée de l'opposition sur le prix de vente",
      '31G': 'Demande de vente en justice du fonds de commerce',
      '31H': 'Demande de fixation du prix de cession du fonds de commerce en cas de préemption',
      '31Z': 'Autres demandes en matière de vente de fonds de commerce',
      '32A': 'Demande en nullité du contrat de location-gérance',
      '32B': 'Demande en paiement formée contre le loueur et/ou le locataire-gérant',
      '32C': "Demande en révision du loyer assorti d'une clause d'échelle mobile",
      '32D': 'Demande en paiement de redevance et/ou en résiliation de contrat',
      '32E': "Demande de reprise du fonds par le loueur à l'expiration du contrat de location-gérance",
      '32F': "Demande de dispense des conditions nécessaires à la concession d'une location gérance",
      '32Z': 'Autres demandes en matière de location-gérance du fonds de commerce',
      '33A': 'Demande de vente forcée du fonds nanti et/ou en surenchère du 10°',
      '33B': "Demande en nullité du nantissement et de l'inscription du nantissement du fonds de commerce",
      '33C': "Demande d'inscription provisoire du nantissement du fonds de commerce nanti",
      '33D': 'Demande en déchéance du terme en cas de déplacement du fonds de commerce',
      '33E': 'Demande de vente forcée du bien nanti et/ou en surenchère du 10°',
      '33F': "Demande en nullité du nantissement ou de l'inscription du nantissement du matériel ou de l'outillage",
      '33G': "Demande d'autorisation de vente amiable du bien formée par le débiteur",
      '33H': 'Demande de déchéance du terme en cas de déplacement du bien nanti',
      '33X': "Nantissement du fonds de commerce ou du fonds artisanal, de l'outillage, et du matériel d'équipement",
      '34A': 'Demande en nullité de groupement',
      '34B': 'Demande de libération des apports et/ou en régularisation des statuts et des formalités de constitution',
      '34C': 'Demande en nullité des actes des assemblées et conseils',
      '34D': "Demande relative à la tenue de l'assemblée générale",
      '34E': 'Demande de prorogation pour le paiement des dividendes',
      '34F': 'Demande tendant à la communication des documents sociaux',
      '34G':
        "Demande en paiement de cotisations formée contre les adhérents d'une association, d'un syndicat ou d'un ordre professionnel",
      '34H': "Demande visant à faire respecter les obligations d'une société relatives au plan de vigilance",
      '35A':
        "Demande tendant à contester l'agrément ou le refus d'agrément de cessionnaires de parts sociales ou d'actions",
      '35B': 'Action en opposition des créanciers contre un projet de fusion, scission ou de réduction du capital',
      '35C':
        "Demande de nomination d'un commissaire aux apports, d'un commissaire à la fusion ou d'un commissaire à la transformation",
      '35D': "Demande de nomination, de récusation ou de relèvement judiciaires d'un commissaire aux comptes",
      '35E': "Demande de nomination d'un mandataire de justice chargé d'accomplir certaines opérations",
      '35F': 'Demande de dissolution du groupement',
      '35G': "Demande de nomination d'un administrateur provisoire",
      '35H': 'Demande relative à la désignation et aux pouvoirs du liquidateur',
      '35X': "Groupements : Fonctionnement (II)- nature d'affaire indéterminée",
      '35Z': 'Autres demandes relatives au fonctionnement du groupement',
      '36A': "Demande en nullité de la désignation d'un dirigeant du groupement",
      '36B': 'Demande en révocation des dirigeants',
      '36C': 'Demande en indemnisation formée par le dirigeant pour révocation injustifiée',
      '36D': 'Demande en nullité des opérations ou des conventions conclues par un dirigeant',
      '36E': 'Action en responsabilité civile exercée contre les dirigeants ou les associés',
      '36F': "Demande d'exclusion de membre ou retrait de membre ou associé",
      '36X': "Groupements : Dirigeants- nature d'affaire indéterminée",
      '36Z': 'Autres demandes relatives aux dirigeants du groupement',
      '38A': 'Demande relative à une cession ou un nantissement de créances professionnelles',
      '38B': "Demande en paiement par le porteur, d'une lettre de change, d'un billet à ordre",
      '38C': 'Demande en paiement du solde du compte bancaire',
      '38D':
        "Action en responsabilité exercée contre l'établissement de crédit pour octroi abusif de crédits ou brusque rupture de crédits",
      '38E': 'Autres actions en responsabilité exercées contre un établissement de crédit',
      '38F': 'Demande relative à une interdiction bancaire',
      '38G': "Demande de mainlevée d'opposition au paiement d'un chèque",
      '38Z': "Autres demandes en matière de droit bancaire et d'effets de commerce",
      '39A': 'Demande en cessation et/ou en réparation, de pratiques anticoncurrentielles restrictives',
      '39G': "Demande en cessation d'utilisation d'un nom commercial, d'une raison sociale, ou d'une enseigne",
      '39H': 'Demande en cessation de concurrence déloyale ou illicite et/ou en dommages et intérêts',
      '39I': "Demande en cessation d'utilisation d'un nom de domaine",
      '39J': "Demande en réparation des préjudices résultant de la rupture brutale d'une relation commerciale établie",
      '39K': 'Demande en cessation et/ou en nullité et/ou en réparation du fait de pratiques anticoncurrentielles',
      '39L': 'Demande en cessation et/ou en nullité et/ou en réparation du fait de pratiques restrictives',
      '39M':
        "Recours contre les décisions de communication ou de production de pièces susceptibles d'être couvertes par un secret des affaires",
      '39X': "Concurrence - Propriété industrielle- nature d'affaire indéterminée",
      '39Z':
        "Autres demandes en matière de brevet, d'obtention végétale, de topographie de semi conducteur, marque, dessins et modèles",
      '3A': 'Propriété industrielle: Brevets, certificats complémentaires de protection et topographie de semi-conducteurs',
      '3AA': 'Demande en contrefaçon de brevet européen',
      '3AB':
        'Demande en contrefaçon de brevet français, de certificat complémentaires de protection ou de topographie de semi-conducteurs',
      '3AC': 'Demande en non-contrefaçon de brevet européen',
      '3AD': 'Demande en non-contrefaçon de brevet français, de certificat complémentaires de protection',
      '3AE': 'Demande en nullité de brevet européen',
      '3AF':
        'Demande en nullité de brevet français, de certificat complémentaires de protection ou de topographie de semi-conducteurs',
      '3AH': "Demande  en exécution, nullité, résolution d'un contrat de licence ou de cession de brevet",
      '3AI': "Recours contre les décisions du directeur de l'INPI- brevets -",
      '3B': 'Propriété industrielle: Obtentions végétales',
      '3BA': "Demande en contrefaçon d'obtention végétale communautaire",
      '3BB': "Demande en contrefaçon d'obtention végétale nationale",
      '3BC': "Demande en nullité du certificat d'obtention végétale communautaire",
      '3BD': "Demande en nullité du certificat d'obtention végétale nationale",
      '3BE': "Demande  en exécution, nullité, résolution d'un contrat de licence ou de cession d'obtention végétale",
      '3BF': "Recours contre les décisions de l'Instance nationale des obtentions végétales",
      '3BZ': "Autres demandes en matière d'obtention végétale",
      '3C': 'Propriété industrielle: Marques',
      '3CA': 'Demande en contrefaçon de marque communautaire',
      '3CB': 'Demande en contrefaçon de marque française ou internationale',
      '3CC': 'Demande en nullité de marque',
      '3CD': 'Demande en déchéance de marque',
      '3CE': "Recours contre les décisions du directeur de l'INPI - marques -",
      '3CF': "Demande  en exécution, nullité, résolution d'un contrat de licence ou de cession de marques",
      '3CZ': 'Autres demandes en matière de marques',
      '3D': "Propriété industrielle: Indications géographiques (appellations d'origine contrôlée)",
      '3DA': "Demande en contrefaçon - indications géographiques (appellations d'origine contrôlée)",
      '3DZ': "Autres demandes en matière d'indications géographiques (appellations d'origine contrôlée)",
      '3E': 'Propriété industrielle: Dessins et modèles',
      '3EA': 'Demande en contrefaçon de dessins et modèles communautaires',
      '3EB': 'Demande en contrefaçon de dessins et modèles français ou internationaux',
      '3EC': 'Demande en nullité de dessins et modèles communautaires non enregistrés',
      '3ED': 'Demande en nullité de dessins et modèles français ou internationaux',
      '3EE': "Recours contre les décisions du directeur de l'INPI - dessins et modèles -",
      '3EF': "Demande  en exécution, nullité, résolution d'un contrat de licence ou de cession de dessins et modèles",
      '3EZ': 'Autres demandes en matière de dessins et modèles',
    },
  },
  4: {
    label: 'Entreprises en difficulté',
    subs: {
      40: 'Ouverture du redressement ou de la liquidation judiciaire (procédures ouvertes avant le 1er janvier 2006)',
      41: "L'entreprise au cours de la procédure  - Délais, organes -  (procédures ouvertes avant le 1er janvier 2006)",
      42: "L'entreprise au cours de la procédure  - Autorisations et actions diverses - (procédures ouvertes avant le 1er janvier 2006)",
      43: "L'entreprise au cours de la procédure - Période suspecte et sort des créances -  (procédures ouvertes avant le 1er janvier 2006)",
      44: "Plan de continuation de l'entreprise (procédures ouvertes avant le 1er janvier 2006)",
      45: "Plan de cession de l'entreprise (procédures ouvertes avant le 1er janvier 2006)",
      46: 'Liquidation judiciaire - Clôture des opérations (procédures ouvertes avant le 1er janvier 2006)',
      47: 'Autres demandes en matière de redressement et de liquidation judiciaires (procédures ouvertes avant le 1er janvier 2006)',
      48: 'Surendettement des particuliers, faillite civile et rétablissement personnel',
      '40B': 'Demande de liquidation judiciaire',
      '40C': "Demande d'ouverture d'une procédure de règlement amiable ou de désignation d'un conciliateur",
      '40D':
        "Appel sur une décision de cessation de l'activité de l'entreprise ou de liquidation judiciaire en cours de procédure",
      '40E':
        "Demande de redressement judiciaire à l'encontre du locataire-gérant en cas d'inexécution de ses obligations",
      '40F':
        "Demande d'ouverture d'une procédure de liquidation judiciaire  en cas de résolution du plan de continuation",
      '40G':
        "Demande d'ouverture d'une procédure de redressement ou de liquidation judiciaire à l'encontre des dirigeants en cas d'inexécution de la condamnation en comblement de l'insuffisance d'actif",
      '40H': "Demande d'extension aux dirigeants du redressement ou de la liquidation judiciaire",
      '40I': 'Demande de reprise de la procédure de redressement judiciaire',
      '41A':
        "Appel sur une décision relative à la désignation, au remplacement ou à la mission d'un expert, de l'administrateur, du représentant du créancier, du commissaire à l'exécution du plan ou du liquidateur",
      '41Z': 'Appel sur des décisions relatives au déroulement de la procédure',
      '42X': 'Demandes relatives aux autorisations et actions diverses sans autre indication',
      '43A': 'Demande en modification de la date de la cessation des paiements',
      '43B': 'Demande en nullité des actes de la période suspecte',
      '43C': "Appel sur une décision du juge commissaire relative à l'admission des créances",
      '43D': "Appel sur une décision du juge commissaire relative à la réclamation sur l'état des créances",
      '43E': 'Appel sur une décision relative au relevé de forclusion (procédures ouvertes avant le 1er janvier 2006)',
      '43X': 'Demande relative à la période suspecte et au sort des créances sans autre indication',
      '44A': "Appel sur une décision relative à l'admission du plan de continuation",
      '44B': 'Appel sur une décision  relative à la modification substantielle du plan de continuation',
      '44C': "Demande en nullité d'un acte passé en violation d'une inaliénabilité temporaire",
      '44X': "Plan de continuation de l'entreprise- nature d'affaire indéterminée",
      '45A': "Appel sur une décision relative à l'admission du plan de cession sans location gérance",
      '45B': "Appel sur une décision relative à l'admission du plan de cession avec location gérance",
      '45C': 'Appel sur une décision  relative à la modification substantielle du plan de cession',
      '45D':
        "Appel sur une décision relative à l'autorisation par le cessionnaire d'aliéner des biens, les louer, les grever de sûretés",
      '45E': 'Demande en nullité des actes interdits au cessionnaire',
      '45F': "Appel sur une décision de nomination d'un administrateur ad hoc",
      '45G': 'Demande de clôture du plan de cession',
      '45H': 'Demande de résolution du plan de cession',
      '46A': 'Demande de clôture pour extinction du passif',
      '46B': "Demande de clôture pour insuffisance d'actif",
      '46X': "Liquidation judiciaire - Clôture des opérations- nature d'affaire indéterminée",
      '47A': "Demande en comblement de l'insuffisance d'actif à l'encontre des dirigeants",
      '47B': "Demande de prononcé de la faillite personnelle ou d'autres sanctions",
      '47C':
        "Action en responsabilité exercée contre l'administrateur, le représentant des créanciers, le liquidateur, le commissaire à l'exécution du plan",
      '47D': 'Recours devant le tribunal contre les décisions du juge commissaire',
      '47E': "Action en responsabilité exercée contre l'Etat, les collectivités territoriales",
      '47F': 'Action en responsabilité exercée contre les fournisseurs',
      '47G':
        'Demande relative au règlement judiciaire, à la liquidation des biens, aux sanctions et à la suspension provisoire des poursuites',
      '47X': "Autres demandes en matière de redressement et de liquidation judiciaires- nature d'affaire indéterminée",
      '48A':
        'Recours contre les décisions statuant sur la recevabilité prononcées par les commissions de surendettement des particuliers',
      '48B':
        'Demande de vérification de la validité des créances, des titres qui les constatent et du montant des sommes réclamées',
      '48C': 'Contestation des mesures imposées par la commission de surendettement des particuliers',
      '48D': "Demande relative à la procédure collective applicable aux débiteurs civils spécifique à l'Alsace-Moselle",
      '48F': "Demande postérieure à l'établissement d'un plan de redressement",
      '48G':
        "Demande d'ouverture de la procédure de rétablissement personnel (avec liquidation judiciaire à compter du 1er novembre 2010)",
      '48H':
        "Recours contre les décisions d'orientation du dossier prononcées par la commission de surendettement des particuliers",
      '48J':
        'Contestation de la décision de la commission imposant un rétablissement personnel sans liquidation judiciaire',
      '48K': "Demande de résolution du plan pris dans le cas d'une procédure de rétablissement personnel",
      '48L': "Demande d'annulation d'un acte ou d'un paiement par la commission de surendettement",
      '48M': "Demande d'autorisation d'accomplir l'un des actes mentionnés à l'article L. 722-5 C. consom.",
      '48N': 'Recours contre la décision de déchéance du bénéfice de la procédure de traitement du surendettement',
      '48O': "Demande aux fins de suspension des mesures d'expulsion du logement du débiteur",
      '48P': 'Demande du débiteur tendant à autoriser à aliéner un bien',
      '48Q':
        "Demande formée avant la décision de recevabilité aux fins de suspension des procédures d'exécution et des cessions des rémunérations",
      '48R': 'Demande de relevé de forclusion de déclaration de créances',
      '48X': "Surendettement des particuliers et faillite civile- nature d'affaire indéterminée",
      '4A': "Désignation d'un mandataire ad hoc, ouverture d'une procédure de conciliation ou de règlement amiable agricole, de sauvegarde, de redressement ou de liquidation judiciaire",
      '4AG':
        'Demande de prononcé de la liquidation judiciaire après résolution du plan de sauvegarde ou du plan de redressement',
      '4AH':
        'Demande de reprise de la procédure de liquidation judiciaire   (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)',
      '4AI':
        "Demande d'extension de la procédure de sauvegarde pour confusion du patrimoine ou fictivité d'une personne morale (art. L. 621-2 al. 2)",
      '4AJ':
        "Demande d'extension de la procédure de redressement judiciaire pour confusion de patrimoine ou fictivité d'une personne morale",
      '4AK':
        "Demande d'extension de la procédure de liquidation judiciaire pour confusion de patrimoine ou fictivité d'une personne morale",
      '4B': "L'entreprise au cours de la procédure  - Délais, organes - (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)",
      '4BA':
        "Appel sur une décision relative à la désignation, au remplacement ou à la mission d'un expert, de l'administrateur, du mandataire judiciaire, du commissaire à l'exécution du plan ou du liquidateur",
      '4BB':
        'Appel sur des décisions relatives au déroulement de la procédure (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)',
      '4C': "L'entreprise au cours de la procédure  - Autorisations,  plan de cession et actions diverses - (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)",
      '4CA':
        "Appel sur des décisions relatives à la nullité des actes du débiteur non autorisés par le juge commissaire ou d'homologation de compromis ou de transaction (Loi n°2005-845)",
      '4CB':
        'Appel sur des décisions relatives au remplacement du ou des dirigeants, ou de privation du droit de vote, ou de cession forcée des actions (Loi n°2005-845 du 26 juillet 2005)',
      '4CC':
        'Appel sur des décisions relatives au plan de cession (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)',
      '4CD':
        'Appel sur des décisions statuant sur la nullité des actes interdits au cessionnaire (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)',
      '4D': "L'entreprise au cours de la procédure  - Période suspecte et sort des créances - (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)",
      '4DA':
        'Appel sur les décisions relatives à la modification de la date de la cessation des paiements (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)',
      '4DB':
        'Appel sur des décisions relatives à la nullité des actes de la période suspecte  (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)',
      '4DC':
        "Appel sur une décision du juge commissaire relative à l'admission des créances (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)",
      '4DD':
        "Appel sur une décision du juge commissaire relative à la réclamation sur l'état des créances  (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)",
      '4DE':
        'Appel sur une décision relative au relevé de forclusion (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)',
      '4DF': "Appel sur une décision du juge commissaire relative à la vente d'actifs",
      '4E': 'Conciliation (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)',
      '4EB': "Demande de résolution de l'accord",
      '4F': 'Plan de sauvegarde, plan arrêté en sauvegarde financière accélérée et plan arrêté en sauvegarde accélérée',
      '4FA': "Appel sur une décision relative à l'admission du plan de sauvegarde",
      '4FB': 'Appel sur une décision  relative à la modification substantielle du plan de sauvegarde',
      '4FC':
        "Demande en nullité d'un acte passé en violation d'une inaliénabilité temporaire formée après clôture de la procédure de sauvegarde",
      '4FD': 'Demande de résolution du plan de sauvegarde formée après clôture de la procédure',
      '4FE': "Demande visant à faire constater l'exécution du plan de sauvegarde",
      '4FF':
        'Autres demandes postérieures à la clôture de la procédure de sauvegarde ou de sauvegarde financière accélérée ou de sauvegarde accélérée',
      '4FG':
        "Appel sur une décision relative à l'admission du plan arrêté en sauvegarde financière accélérée ou en sauvegarde accélérée",
      '4FH':
        'Appel sur une décision relative à la modification substantielle du plan arrêté en sauvegarde financière accélérée ou en sauvegarde accélérée',
      '4FI':
        "Demande en nullité d'un acte passé en violation d'une inaliénabilité temporaire formée après clôture de la procédure de sauvegarde  financière accélérée ou de sauvegarde accélérée",
      '4FJ':
        'Demande de résolution du plan arrêté en sauvegarde financière accélérée ou en sauvegarde accélérée formée après clôture de la procédure',
      '4FK':
        "Demande visant à faire constater l'exécution du plan arrêté en sauvegarde financière accélérée ou en sauvegarde accélérée",
      '4G': "Plan de redressement de l'entreprise (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)",
      '4GA': "Appel sur une décision relative à l'admission du plan de redressement",
      '4GB': 'Appel sur une décision  relative à la modification substantielle du plan de redressement',
      '4GC':
        "Demande en nullité d'un acte passé en violation d'une inaliénabilité temporaire formée après clôture de la procédure de redressement",
      '4GD': 'Demande de résolution du plan de redressement formée après clôture de la procédure',
      '4GE': "Appel sur une décision relative au  constat de l'exécution du plan de redressement",
      '4GF': 'Autres demandes postérieures à la clôture de la procédure de redressement',
      '4H': 'Liquidation judiciaire  (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)',
      '4HA': 'Appel contre des décisions prononçant la liquidation judiciaire',
      '4HB': 'Appel contre des décisions statuant sur la clôture de la liquidation judiciaire',
      '4HC': 'Autres demandes postérieures à la clôture de la procédure de liquidation judiciaire',
      '4I': 'Autres demandes en matière de sauvegarde, de redressement et de liquidation judiciaires  (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)',
      '4IA':
        "Action en responsabilité pour insuffisance d'actif à l'encontre des dirigeants  (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)",
      '4IB':
        'Action en responsabilité aux fins de condamnation au paiement de tout ou partie des dettes sociales  (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)',
      '4IC':
        'Demande de prononcé de la faillite personnelle  (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)',
      '4ID':
        "Demande de prononcé d'une interdiction de diriger, gérer, administrer ou contrôler  (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)",
      '4IE':
        "Action en responsabilité exercée contre l'administrateur, le mandataire judiciaire , le liquidateur, le commissaire à l'exécution du plan ",
      '4IF':
        'Recours devant le tribunal contre les décisions du juge commissaire et appels contre les décisions statuant sur ces recours',
      '4IG':
        "Action en responsabilité exercée contre l'Etat, les collectivités territoriales (introduite après le 1er janvier 2006)",
      '4IH':
        'Action en responsabilité exercée contre les créanciers  (Loi n°2005-845 du 26 juillet 2005 de sauvegarde des entreprises)',
      '4II': "Recours devant la cour d'appel contre les décisions du juge commis",
      '4J': "Procédures d'insolvabilité - Règlement (UE) n°2015-848",
      '4JA':
        "Recours contre la nature principale, secondaire ou territorial d'une procédure collective ouverte dans le cadre du règlement européen d'insolvabilité",
      '4JB': "Contestation de l'engagement par un créancier local",
      '4JC':
        "Demande de suspension, de renouvellement ou de levée de la suspension de la réalisation de l'ensemble des actifs par le praticien de l'insolvabilité de la procédure d'insolvabilité principale",
      '4JD':
        "Demande de suspension, de renouvellement ou de levée de la suspension de la réalisation de l'ensemble des actifs formée par le praticien de l'insolvabilité désigné",
      '4JE':
        "Demande de vérification des conditions d'approbation d'un engagement pris en application de l'article 36 du REI",
      '4JG':
        "Demande d'autorisation des licenciements par le tribunal lorsqu'une procédure d'insolvabilité a été ouverte dans un autre état membre en application de l'article 13",
    },
  },
  5: {
    label: 'Contrats',
    subs: {
      50: 'Vente',
      51: "Baux d'habitation et baux professionnels",
      52: 'Baux ruraux',
      53: "Prêt d'argent, crédit-bail (ou leasing), cautionnement",
      54: 'Contrat tendant à la réalisation de travaux de construction',
      55: 'Contrat de transport',
      56: 'Autres contrats de prestation de services',
      57: "Contrats d'intermédiaire",
      58: "Contrat d'assurance",
      59: 'Contrats divers',
      '50A': "Demande en nullité de la vente ou d'une clause de la vente",
      '50B': 'Demande en paiement du prix ou tendant à faire sanctionner le non-paiement du prix',
      '50C': 'Demande tendant à obtenir la livraison de la chose ou à faire sanctionner le défaut de livraison',
      '50D': 'Demande en garantie des vices cachés ou tendant à faire sanctionner un défaut de conformité',
      '50E': "Demande de garantie d'éviction",
      '50F': "Autres demandes  tendant à faire sanctionner l'inexécution des obligations du vendeur",
      '50G':
        "Demande relative à l'exécution d'une promesse unilatérale de vente ou d'un pacte de préférence ou d'un compromis de vente",
      '50Z': 'Autres demandes relatives à la vente',
      '51A':
        "Demande en paiement des loyers et des charges et/ou tendant à faire prononcer ou constater la résiliation pour défaut de paiement ou défaut d'assurance et ordonner l'expulsion",
      '51B':
        "Demande tendant à l'exécution des autres obligations du locataire et/ou tendant à faire prononcer  la résiliation pour inexécution de ces obligations et ordonner l'expulsion",
      '51C': "Demande du bailleur tendant à faire constater la validité du congé et à ordonner l'expulsion",
      '51D': "Demande du  locataire ou de l'ancien locataire tendant au maintien dans les lieux",
      '51E':
        'Demande en dommages-intérêts formée par le bailleur en fin de bail en raison des dégradations ou des pertes imputables au locataire',
      '51F':
        "Demande du locataire tendant  à être autorisé d'exécuter des travaux ou à faire exécuter des travaux à la charge du bailleur",
      '51G':
        'Demande du locataire tendant à la diminution du loyer ou des charges, et/ou à la résiliation du bail, et/ou à des dommages-intérêts,  en raison de troubles de jouissance',
      '51H':
        "Demande du locataire en fin de bail en restitution du dépôt de garantie et/ou tendant au paiement d'une indemnité pour amélioration des lieux loués",
      '51I': 'Demande tendant à la fixation judiciaire du montant du loyer',
      '51J':
        'Demande du bailleur tendant à faire constater la résiliation du bail pour abandon du domicile par le locataire',
      '51K':
        "Demande du locataire tendant à la diminution du loyer en raison de l'absence de certaines mentions ou de la présence de mentions erronées dans le contrat de location",
      '51L':
        'Demande du locataire tendant à la diminution du loyer lorsque son montant est supérieur au loyer de référence majoré',
      '51M':
        'Demande du bailleur tendant à la réévaluation du loyer lorsque son montant est inférieur au loyer de référence minoré',
      '51Z': "Autres demandes relatives à un bail d'habitation ou à un bail professionnel",
      '52A':
        "Demande en paiement des fermages ou loyers et/ou tendant à faire prononcer ou constater la résiliation du bail pour défaut de paiement et prononcer l'expulsion",
      '52B':
        "Demande tendant à l'exécution des autres obligations du preneur et/ou tendant à faire prononcer la résiliation et l'expulsion pour un motif autre que le non paiement des loyers",
      '52C': 'Demande formée par le bailleur ou le preneur relative à la poursuite ou au renouvellement du bail',
      '52D':
        'Demande en paiement de dommages-intérêts formée par le bailleur en fin de bail en raison de dégradations ou de pertes imputables au preneur',
      '52E':
        'Demande du preneur tendant à faire exécuter ou à être autorisé à exécuter des travaux à la charge du bailleur',
      '52F': 'Demande en paiement des indemnités dues en fin de bail au preneur sortant',
      '52G': "Demande relative à l'exercice du droit de préemption du preneur",
      '52Z': 'Autres demandes relatives à un bail rural',
      '53A': "Prêt - Demande en nullité du contrat ou d'une clause du contrat",
      '53B': 'Prêt - Demande en remboursement du prêt',
      '53D': 'Autres demandes relatives au prêt',
      '53E': "Crédit-bail ou leasing - Demande en nullité du contrat ou d'une clause du contrat",
      '53F': 'Crédit-bail ou leasing - Demande en paiement des loyers et/ou en résiliation du crédit-bail',
      '53H': 'Autres demandes relatives au crédit-bail',
      '53I': 'Cautionnement - Demande en paiement formée contre la caution seule',
      '53J':
        'Cautionnement - Recours de la caution qui a payé contre le débiteur principal ou contre une autre caution',
      '53L': 'Autres demandes relatives au cautionnement',
      '54A': "Demande en nullité d'un contrat tendant à la réalisation de travaux de construction",
      '54B': "Demande en paiement du prix formée par le sous-traitant contre l'entrepreneur principal",
      '54C': "Demande en paiement du prix formée par le constructeur contre le maître de l'ouvrage ou son garant",
      '54D': "Demande en paiement direct du prix formée par le sous-traitant contre le maître de l'ouvrage",
      '54E': 'Recours formé par le constructeur entrepreneur principal contre un sous-traitant',
      '54F': 'Recours entre constructeurs',
      '54G':
        "Demande d'exécution de travaux, ou de dommages-intérêts, formée par le maître de l'ouvrage contre le constructeur ou son garant, ou contre le fabricant d'un élément de construction",
      '54Z': 'Autres demandes relatives à un contrat de réalisation de travaux de construction',
      '55A': 'Demande en paiement du prix du transport',
      '55B': 'Action en responsabilité exercée contre le transporteur',
      '55Z': 'Autres demandes relatives au contrat de transport',
      '56A': "Demande en nullité d'un contrat de prestation de services",
      '56B':
        'Demande en paiement du prix, ou des honoraires formée contre le client et/ou tendant à faire sanctionner le non-paiement du prix, ou des honoraires',
      '56C': 'Demande en dommages-intérêts contre le prestataire de services pour mauvaise exécution',
      '56D':
        "Demande en restitution d'une chose confiée au prestataire de services et/ou en dommages-intérêts pour non restitution",
      '56E': 'Demande en exécution formée par le client contre le prestataire de services',
      '56F': 'Demande en résolution formée par le client pour inexécution de la prestation de services',
      '56Z': 'Autres demandes relatives à un contrat de prestation de services',
      '57A': 'Demande en paiement ou en indemnisation formée par un intermédiaire',
      '57B': 'Demande en réparation des dommages causés par un intermédiaire',
      '57X': "Contrats d'intermédiaire- nature d'affaire indéterminée",
      '58A':
        "Demande en nullité du contrat d'assurance, et/ou en remboursement des indemnités pour fausse déclaration intentionnelle ou réticence de la part de l'assuré  formée par l'assureur",
      '58B': "Autres demandes en nullité et/ou en remboursement des indemnités formées par l'assureur",
      '58C': "Demande en nullité du contrat et/ou en restitution des primes, ou cotisations, formée par l'assuré",
      '58D': "Demande en paiement des primes, ou cotisations, formée contre l'assuré",
      '58E': "Demande en paiement de l'indemnité d'assurance dans une assurance de dommages",
      '58F': "Demande en paiement de l'indemnité d'assurance de responsabilité formée par l'assuré",
      '58G': "Demande en paiement de l'indemnité d'assurance dans une assurance de personnes",
      '58H': "Demande en paiement de l'indemnité d'assurance dans une assurance-crédit",
      '58Z': "Demande relative à d'autres contrats d'assurance",
      '59A': "Demande en nullité d'un contrat ou des clauses relatives à un autre contrat",
      '59B': 'Demande en paiement relative à un autre contrat',
      '59C': "Demande en exécution ou en dommages-intérêts pour mauvaise exécution d'un autre contrat",
      '59D': 'Demande en paiement relative à un contrat non qualifié',
      '59E': "Demande en exécution ou en dommages-intérêts pour mauvaise exécution d'un contrat non qualifié",
      '59G': 'Demande conjointe tendant à réviser le contrat pour imprévision',
      '59H': 'Demande unilatérale tendant à réviser le contrat ou y mettre fin pour imprévision',
      '59X': "Contrats divers- nature d'affaire indéterminée",
    },
  },
  6: {
    label: 'Responsabilité et quasi-contrat',
    subs: {
      60: 'Dommages causés par des véhicules',
      61: 'Dommages causés par des animaux, des produits ou des services',
      62: 'Dommages causés par des immeubles',
      63: "Dommages causés par l'activité professionnelle de certaines personnes qualifiées",
      64: "Dommages causés par l'action directe d'une personne",
      65: "Dommages causés par l'action d'une personne dont on est responsable",
      66: 'Quasi-contrats',
      '60A': 'Demande en réparation des dommages causés par des véhicules terrestres à moteur',
      '60B': 'Demande en réparation des dommages causés par des véhicules terrestres sans moteur',
      '60C': 'Demande en réparation des dommages causés par un véhicule aérien, maritime ou fluvial',
      '61A': 'Demande en réparation des dommages causés par un animal',
      '61B': 'Demande en réparation des dommages causés par un produit ou une prestation de services défectueux',
      '62A': 'Demande en réparation des dommages causés à une personne par un immeuble',
      '62B': 'Demande en réparation des dommages causés à une chose mobilière ou immobilière par un immeuble',
      '62X': "Dommages causés par des immeubles- nature d'affaire indéterminée",
      '63A': "Demande en réparation des dommages causés par l'activité médicale ou para-médicale",
      '63B': "Demande en réparation des dommages causés par l'activité des auxiliaires de justice",
      '63C':
        "Demande en réparation des dommages causés par l'activité d'un expert en diagnostic, un commissaire aux comptes, un commissaire aux apports, un commissaire à la fusion ou un expert-comptable",
      '63D': "Demande en réparation des dommages causés par l'activité d'un prestataire de services d'investissement",
      '64A': "Demande en réparation des dommages causés par une nuisance de l'environnement",
      '64B': "Demande en réparation des dommages causés par d'autres faits personnels",
      '64C': "Demande en réparation d'un préjudice écologique",
      '64D': "Action en prévention, en cessation ou en réparation d'une atteinte au secret des affaires",
      '64E': 'Demande en réparation des dommages causés par un acte de terrorisme',
      '64F': 'Demande de blocage, retrait ou déréférencement de contenus illicites accessibles en ligne',
      '64G':
        "Demande en réparation du préjudice causé par l'inexécution des obligations d'une société relatives au plan de vigilance",
      '65A':
        'Demande en réparation des dommages causés par un mineur ou un majeur, formée contre les parents ou la personne contrôlant son mode de vie ou son activité',
      '65B': "Demande en réparation des dommages causés par les salariés et apprentis, formée contre l'employeur",
      '65C':
        "Demande en réparation des dommages causés par un fonctionnaire ou employé, formée contre l'Etat ou une collectivité territoriale",
      '66A': "Demande relative à une gestion d'affaire",
      '66B': "Demande en restitution d'une chose ou en paiement d'un prix reçu indûment",
      '66C': "Demande d'indemnisation pour enrichissement sans cause",
    },
  },
  7: {
    label: 'Biens - propriété littéraire et artistique',
    subs: {
      70: 'Propriété et possession immobilières',
      71: 'Copropriété (I): organisation et administration',
      72: 'Copropriété (II): droits et obligations des copropriétaires',
      73: 'Usufruit - Usage et habitation',
      74: 'Servitudes',
      75: 'Emphytéose - Bail à construction - Concession immobilière',
      76: 'Sûretés mobilières et immobilières',
      77: 'Propriété et possession mobilières',
      78: 'Saisies et mesures conservatoires',
      79: 'Propriété littéraire et artistique',
      '70A': "Revendication d'un bien immobilier",
      '70B':
        "Demande formée par le propriétaire de démolition d'une construction ou d'enlèvement d'une plantation faite par un tiers sur son terrain",
      '70C': "Demande d'expulsion et/ou d'indemnités dirigée contre les occupants des lieux",
      '70D': 'Demande en bornage ou en clôture',
      '70E': 'Demande relative aux murs, haies et  fossés mitoyens',
      '70F': 'Actions possessoires',
      '70H': "Demande de fixation de l'indemnité d'expropriation",
      '70I': "Demande de rétrocession d'un immeuble exproprié",
      '70K': "Demande de constatation d'absence de base légale du transfert de propriété et sur ses conséquences",
      '70L':
        "Demande de désignation d'un expert par le président du TJ, en vue de la déclaration de l'état de carence du propriétaire d'un immeuble",
      '70M': "Demande de désignation d'expert pour un immeuble menaçant ruine",
      '70N': "Demande du maire tendant à la démolition d'un bâtiment menaçant ruine",
      '70O':
        "Demande tendant à la démolition ou la mise en conformité d'un ouvrage édifié ou installé en violation des règles d'urbanisme",
      '70Z':
        "Autres demandes relatives à la propriété ou à la possession d'un immeuble ou relevant de la compétence du juge de l'expropriation",
      '71A':
        'Demande tendant à déclarer non écrite une clause du règlement de copropriété ou demande de nouvelle répartition des charges',
      '71B':
        "Demande de nomination du syndic lorsque l'assemblée générale convoquée à cet effet n'est pas parvenue à en désigner un",
      '71C': "Demande de désignation d'un administrateur provisoire",
      '71D': "Demande de désignation d'un administrateur provisoire d'une copropriété en difficulté",
      '71E': "Demande de convocation d'une assemblée générale",
      '71F': "Demande en nullité d'une assemblée générale ou d'une délibération de cette assemblée",
      '71G': 'Action en responsabilité exercée contre le syndicat',
      '71H': 'Action en responsabilité exercée contre le syndic ou tendant à sa révocation',
      '71I': 'Demande de remise de pièces ou de fonds détenus par le syndic',
      '71J': "Demande de désignation d'un observateur d'une copropriété en pré-difficulté",
      '71K': "Demande de placement de l'immeuble sous administration provisoire renforcée",
      '71L':
        "Demande de désignation des membres du conseil syndical, à défaut de désignation par l'assemblée générale à la majorité requise",
      '71M':
        "Demande de désignation d'un mandataire commun en cas d'indivision ou de démembrement du droit de propriété",
      '71N': "Demande de désignation d'un mandataire ad hoc",
      '72A': 'Demande en paiement des charges ou des contributions',
      '72B': "Demande présentée par ou contre le syndicat à l'occasion de la vente d'un lot",
      '72C':
        "Demande du syndicat tendant à la cessation et/ou à la sanction d'une violation des règles de la copropriété commise par un copropriétaire",
      '72D':
        "Demande d'un copropriétaire tendant à la cessation et/ou à la sanction d'une atteinte à la propriété ou à la jouissance d'un lot",
      '72E':
        "Demande en réparation du préjudice causé à un copropriétaire par des travaux régulièrement décidés par l'assemblée générale",
      '72F': "Demande en inopposabilité de travaux décidés par l'assemblée générale",
      '72G': "Demande d'autorisation de travaux d'amélioration",
      '72H':
        "Demande des copropriétaires de résidences services tendant à la suspension ou la suppression d'un ou des services",
      '72I':
        'Demande en paiement de provisions ou sommes exigibles présentée devant le Président du TJ selon la procédure accélérée au fond (art. 19-2 de L. 1965)',
      '72J':
        'Demande en paiement de pénalités de retard dues par le syndic pour défaut de délivrance de pièces ou documents au profit du syndicat des copropriétaires',
      '72Z': 'Autres demandes relatives à la copropriété',
      '73A': "Demande formée par l'usufruitier",
      '73B': 'Demande formée par le nu-propriétaire',
      '73X': "Usufruit - Usage et habitation- nature d'affaire indéterminée",
      '73Z': "Demande relative à un droit d'usage et d'habitation",
      '74A': "Demande relative à une servitude d'usage ou de passage des eaux",
      '74B': 'Demande relative à une servitude de distance pour les plantations et constructions',
      '74C': 'Demande relative à une servitude de jours et vues sur le fonds voisin',
      '74D': 'Demande relative à un droit de passage',
      '74E': "Demande d'établissement d'une servitude de cour commune",
      '74F': "Demande relative à un droit d'usage forestier ou rural",
      '74Z': "Demande relative à d'autres servitudes",
      '75A':
        'Demande relative au montant et au paiement des redevances emphytéotiques, ou des loyers du bail à construction',
      '75B':
        "Demande relative au sort du bien ou des constructions à l'expiration du bail à construction ou emphytéotique",
      '75D': "Autres demandes relatives au bail à construction ou à l'emphytéose",
      '75E': 'Demande relative à une concession immobilière',
      '76A': "Demande en nullité, en radiation ou en réduction d'une sûreté immobilière",
      '76B':
        "Recours contre les décisions relatives à l'inscription ou à la radiation d'une hypothèque ou d'un privilège d'un doit réel immobilier au Livre foncier",
      '76D': 'Autres demandes relatives à une sûreté immobilière',
      '76E': "Demande en nullité, en radiation ou en réduction d'une sûreté mobilière",
      '76F':
        "Demande tendant à la réalisation de la sûreté : vente forcée, autorisation de vente amiable, ou attribution d'un bien mobilier constitutif de la sûreté",
      '76H': 'Autres demandes relatives à une sûreté mobilière',
      '76X': "Sûretés mobilières et immobilières- nature d'affaire indéterminée",
      '77A': "Demande en revendication d'un bien mobilier",
      '77B': "Demande en restitution d'un meuble vendu avec une clause de réserve de propriété",
      '78A': 'Demande tendant à la vente immobilière et à la distribution du prix',
      '78B':
        "Demande tendant à la suspension de la procédure de saisie immobilière, l'annulation ou la péremption ou tendant à la vente amiable",
      '78C': 'Demande tendant à la remise en vente du bien (procédures introduites avant le 1er janvier 2007)',
      '78E': 'Autres demandes relatives à la procédure de saisie immobilière',
      '78F': "Demande en nullité et/ou en mainlevée, en suspension ou en exécution d'une saisie mobilière",
      '78G': "Demande relative à la saisissabilité et/ou à la mise à disposition de sommes ou d'un  bien",
      '78H': "Demande d'ouverture ou contestation d'une procédure de saisie des rémunérations",
      '78I': 'Autres demandes relatives à la saisie mobilière',
      '78K': "Demande en nullité et/ou de mainlevée d'une mesure conservatoire",
      '78M': 'Autres demandes relatives à une mesure conservatoire',
      '78N':
        "Demande d'autorisation de mesures conservatoires et de mesures d'exécution forcée sur les biens des Etats étrangers",
      '78O': "Demande d'ordonnance européenne de saisie conservatoire des comptes bancaires",
      '78P': "Recours du débiteur contre l'ordonnance européenne de saisie conservatoire des comptes bancaires",
      '78Q':
        "Recours du débiteur contre l'exécution de l'ordonnance européenne de saisie conservatoire des comptes bancaires",
      '78R':
        "Demande de modification ou de révocation de l'ordonnance européenne de saisie conservatoire des comptes bancaires",
      '78X': "Saisies et mesures conservatoires- nature d'affaire indéterminée",
      '79A':
        "Demande tendant à faire cesser et/ou à sanctionner une contrefaçon ou une atteinte illicite au droit de l'auteur, à un droit voisin du droit d'auteur ou à un droit de producteur de base de données",
      '79B': "Demande en paiement de droits d'auteur ou de droits voisins",
      '79C':
        "Demande tendant à faire cesser et/ou à sanctionner l'inexécution des obligations de l'éditeur dans un contrat d'édition",
      '79D':
        "Demande tendant à faire cesser et/ou à sanctionner l'inexécution des obligations de l'auteur dans un contrat d'édition",
      '79E': "Demande relative à un contrat de représentation d'une oeuvre littéraire ou artistique",
      '79F':
        "Demande relative à un contrat de production d'une oeuvre audiovisuelle, de vidéogrammes, de phonogrammes ou de bases de données",
      '79Z': 'Autres demandes relatives à la propriété littéraire et artistique',
    },
  },
  8: {
    label: 'Relations du travail et protection',
    subs: {
      80: 'Relations individuelles de travail',
      81: 'Elections professionnelles',
      82: 'Représentation des intérêts des salariés',
      83: 'Statut des salariés protégés',
      84: 'Condition du personnel dans les procédures de sauvegarde, de redressement ou de liquidation judiciaire',
      85: 'Conflits collectifs du travail',
      86: 'Négociation collective',
      87: 'Formation et insertion professionnelles',
      88: 'Protection sociale',
      89: 'Risques professionnels',
      '80A': "Demande d'indemnités liées à la rupture du contrat de travail CDI ou CDD, son exécution ou inexécution",
      '80B': "Demande d'indemnités liées à la rupture du contrat de travail pour motif économique",
      '80C': "Demande d'indemnités ou de salaires",
      '80D': "Demande d'annulation d'une sanction disciplinaire",
      '80E': "Demande d'autorisation judiciaire de congé particulier",
      '80F': 'Demande de remise de documents',
      '80G': "Demande en paiement de créances salariales en l'absence de rupture du contrat de travail",
      '80H': 'Demande présentée par un employeur liée à la rupture du contrat de travail ou à des créances salariales',
      '80I': 'Demande dirigée par un salarié contre un autre salarié',
      '80J': 'Contestation du motif non économique de la rupture du contrat de travail',
      '80K': 'Contestation du motif économique de la rupture du contrat de travail',
      '80L': "Demande de prise d'acte de la rupture du contrat de travail",
      '80M': 'Demande de résiliation ou de résolution judiciaire du contrat de travail formée par un salarié',
      '80N': 'Demande de mise à la retraite formée par un salarié',
      '80O': 'Demande de requalification du contrat de travail',
      '80P':
        'Demande en paiement de créances salariales sans contestation du motif de la rupture du contrat de travail',
      '80Q': "Demande d'annulation d'une sanction disciplinaire",
      '80R': "Demande d'autorisation judiciaire de congé particulier ou demande de congés formation",
      '80S': 'Demande de remise de documents',
      '80T': "Demande en paiement de créances salariales en l'absence de rupture du contrat de travail",
      '80U': 'Demande présentée par un employeur liée à la rupture du contrat de travail ou à des créances salariales ',
      '80V': 'Demande dirigée par un salarié contre un autre salarié',
      '80W': 'Contestation en matière de médecine du travail',
      '80X': "Relations individuelles de travail- nature d'affaire indéterminée",
      '80Y': 'Demande de nullité de la rupture du contrat de travail',
      '81A':
        "Demande relative à l'organisation des élections des institutions représentatives du personnel dans l'entreprise",
      '81B':
        "Demande relative à l'inscription sur les listes électorales ou sur la liste des candidats  pour l'élection des institutions représentatives du personnel dans l'entreprise",
      '81C':
        "Demande d'annulation du scrutin d'élection d'une institution représentative du personnel de l'entreprise ou d'un scrutin de révocation",
      '81D':
        "Demande d'annulation de la désignation élective de représentants du personnel des institutions représentatives ou d'un scrutin de révocation",
      '81E': "Demande d'inclusion d'une entreprise dans un groupe pour la constitution d'un comité de groupe",
      '81F': "Demande d'annulation de la désignation de membres d'un comité de groupe",
      '81G':
        "Demande relative à l'élection de représentants des salariés au conseil d'une entreprise du secteur public ou d'une société privée",
      '81H': "Demande en révocation d'un administrateur salarié pour faute",
      '81I': "Demande relative à l'élection d'autres représentants du personnel",
      '81J': "Demande relative aux élections des conseillers prud'hommes",
      '81K': 'Contestation relative au scrutin sur sigle organisé dans les très petites entreprises',
      '82A': "Demande de moyens de fonctionnement d'une institution représentative du personnel",
      '82B': "Demande en exécution d'obligations corrélatives aux attributions de représentants du personnel",
      '82C': "Demande relative à la désignation, au mandat ou la rémunération d'un expert",
      '82D': "Demande en nullité d'une délibération d'une institution représentative",
      '82E': 'Autres demandes des représentants du personnel',
      '82F': 'Autres demandes contre une institution représentative en raison de son fonctionnement',
      '82G': "Demande relative à l'expression directe des salariés",
      '82H': "Demande relative à la personnalité juridique d'un syndicat",
      '82I':
        "Demande d'annulation de la désignation ou de la révocation d'un délégué syndical ou d'un représentant syndical au comité d'entreprise",
      '82J': 'Autres demandes contre un syndicat',
      '82K': "Demande relative à un plan de sauvegarde de l'emploi",
      '83A': "Demande en paiement d'heures consacrées aux fonctions",
      '83B': "Demande d'annulation d'une sanction disciplinaire frappant un salarié protégé",
      '83C':
        "Demande d'indemnités ou de salaires  liée à la rupture autorisée ou non d'un contrat de travail d'un salarié protégé",
      '83D': "Demande en résiliation du contrat de travail d'un administrateur salarié de société",
      '83E': "Autres demandes d'un salarié protégé",
      '83F': "Demande d'un employeur contre un salarié protégé",
      '83G': 'Demande de résiliation ou de résolution judiciaire du contrat de travail formée par un salarié protégé',
      '83H': "Autres demandes d'un salarié protégé",
      '83I': "Demande d'un employeur contre un salarié protégé",
      '84A':
        'Demande en annulation de la désignation du représentant des salariés ou des institutions représentatives du personnel',
      '84B':
        'Autres demandes relatives à la désignation du représentant des salariés ou des institutions représentatives du personnel',
      '84C':
        'Demande en annulation de la décision de remplacement du représentant des salariés ou des institutions représentatives du personnel',
      '84D':
        "Action en responsabilité civile exercée contre le représentant des salariés, des institutions représentatives ou des représentants du personnel, pour manquement à l'obligation de discrétion",
      '84E': 'Demande consécutive à une autorisation de licenciements pour motif économique',
      '84F':
        "Demande d'indemnités ou de salaires liée ou non à la rupture du contrat de travail, présentée après l'ouverture d'une procédure collective",
      '84G': 'Demande en relevé de forclusion opposable à un salarié',
      '84H':
        "Demande de l'A.G.S. en paiement des cotisations contre un employeur soumis à l'obligation d'assurance des créances salariales",
      '84I':
        "Demande de l'A.G.S. d'un administrateur judiciaire, d'un représentant des créanciers, ou mandataire liquidateur contre un salarié",
      '84J': "Contestation de la rupture du contrat de travail présentée après l'ouverture d'une procédure collective",
      '84K':
        "Demande d'indemnités ou de salaires sans contestation de la rupture du contrat de travail présentée après l'ouverture d'une procédure collective",
      '84L': 'Demande en relevé de forclusion opposable à un salarié',
      '84M':
        "Demande de l'A.G.S. en paiement des cotisations contre un employeur soumis à l'obligation d'assurance des créances salariales",
      '84N':
        "Demande de l'A.G.S. d'un administrateur judiciaire, d'un représentant des créanciers, ou mandataire liquidateur contre un salarié",
      '85A': "Demande d'expulsion d'occupants des lieux de travail",
      '85B': 'Demande tendant à la réouverture des locaux de travail',
      '85C': "Autres demandes de l'employeur relatives à un mouvement collectif",
      '85D': "Autres demandes d'un syndicat ou d'un salarié en matière de conflits collectifs",
      '86A': "Demande relative à l'ouverture ou au déroulement d'une négociation collective",
      '86B': "Demande en nullité d'une clause, d'une convention ou d'un accord collectif",
      '86C': "Demande en appréciation de validité d'une clause conventionnelle",
      '86D': "Demande en exécution d'engagements conventionnels, ou tendant à sanctionner leur inexécution",
      '86E':
        "Demande relative au fonctionnement d'un organisme créé par une convention ou un accord collectif de travail",
      '86F':
        "Demande en exécution d'un accord de conciliation, d'un accord sur une recommandation de médiateur, d'une sentence arbitrale, ou tendant à sanctionner leur inexécution",
      '86G':
        "Demande relative à la validité d'une clause d'un accord ou d'un accord de conciliation ou d'un accord sur une recommandation de médiateur",
      '87A':
        "Demande relative à la validité, l'exécution ou la résiliation du contrat d'apprentissage formée par l'apprenti",
      '87B':
        "Demande relative à la validité, l'exécution ou la résiliation du contrat d'apprentissage formée par l'employeur",
      '87C':
        "Demande formée par un employeur ou un salarié contre un organisme de formation, un organisme paritaire collecteur agrée ou un fonds d'assurance formation",
      '87D': "Demande formée par un organisme de formation ou d'un fonds d'assurance- formation",
      '87E': "Demande relative au fonctionnement d'un organisme de formation professionnelle",
      '87F': "Autres demandes en matière d'apprentissage",
      '87X': "Formation et insertion professionnelles- nature d'affaire indéterminée",
      '88A':
        "Contestation d'une décision d'un organisme portant sur l'immatriculation, l'affiliation ou un refus de reconnaissance d'un droit ",
      '88B': "Demande d'annulation d'une mise en demeure ou d'une contrainte",
      '88C': 'Demande en paiement de cotisations, majorations de retard et/ou pénalités',
      '88D': 'Demande en remboursement de cotisations, prestations ou allocations indues',
      '88E': 'Demande en paiement de prestations',
      '88F': 'Demande en dommages-intérêts contre un organisme',
      '88G': 'Autres demandes contre un organisme',
      '88H': "Autres demandes d'un organisme, ou au profit d'un organisme",
      '88I': "Demande en nullité d'une décision de justice",
      '88J': 'Demande relative à une élection à un organisme de protection sociale',
      '88K': 'Demande en répétition de prestations ou allocations indûment versées.',
      '88L': "Majeur handicapé - Contestation d'une décision relative à l'attribution d'un taux",
      '88M': "Majeur handicapé - Contestation d'une décision relative à une allocation",
      '88N': "Majeur handicapé - Contestation d'une décision relative à l'affiliation, à l'orientation et au placement",
      '88P': "Mineur handicapé - Contestation d'une décision relative à l'attribution d'un taux",
      '88Q': "Mineur handicapé - Contestation d'une décision relative à une allocation",
      '88R': "Mineur handicapé - Contestation d'une décision relative à l'orientation et au placement",
      '88S': "Mineur handicapé - Contestation d'une décision relative aux cartes",
      '88T': 'Invalidité - Contestation relative à une décision de reconnaissance',
      '88U': "Invalidité - Contestation d'une décision relative à une allocation",
      '88V': "Inaptitude - Contestation d'une décision relative à l'inaptitude",
      '88W': "Aide sociale - Contestation d'une décision relative à une allocation santé",
      '88Y': "Aide sociale - Contestation d'une décision relative aux allocations et/ou aux droits des personnes âgées",
      '89A':
        "A.T.M.P. : Demande de prise en charge au titre des A.T.M.P. et/ou contestation relative au taux d'incapacité",
      '89B': "A.T.M.P. : Demande relative à la faute inexcusable de l'employeur",
      '89C': "A.T.M.P. : Demande en réparation supplémentaire pour faute intentionnelle de l'employeur",
      '89D':
        "A.T.M.P. : Recours contre une décision d'une caisse motivée par une faute inexcusable ou intentionnelle de la victime ou d'un de ses ayants-droit",
      '89E': "A.T.M.P. : Demande d'un employeur contestant une décision d'une caisse",
      '89F': "A.T.M.P. : Demande en paiement de cotisations d' A.T.M.P.",
      '89G': 'A.T.M.P. : Demande en répétition de prestations ou de frais',
      '89H':
        "A.T.M.P. : Demande relative à l'assurance complémentaire contre les A.T.M.P. des non salariés de l'agriculture",
      '89I': "Demande tendant à faire ordonner une mesure préventive de la réalisation d'un risque professionnel",
      '89J': 'Demande relative au compte personnel de prévention de la pénibilité',
      '89K': "Demande relative à l'exposition à un risque professionnel",
      '89L':
        'Tarification - Demande tendant à faire inscrire une maladie professionnelle au compte spécial ou aux charges techniques générales ',
      '89M':
        'Tarification - Demande tendant au retrait ou à la modification du compte employeur des coûts moyens relatifs à une maladie professionnelle ou un accident du travail',
      '89N':
        "Tarification - Demande relative à l'attribution d'un taux réduit pour le personnel exerçant des fonctions support de nature administrative au sein de l'entreprise",
      '89O': "Tarification - Contestation du taux de cotisation fondée sur le classement de l'entreprise",
      '89P':
        "Tarification - Contestation d'une décision portant sur une cotisation supplémentaire liée à une faute inexcusable de l'employeur",
      '89Q':
        'Tarification - Contestation du taux de cotisation fondée sur des motifs autres que les maladies professionnelles et accidents du travail',
      '89R': 'Tarification - Autres demandes ou contestations relatives au taux de cotisation',
      '89Z': 'Autres demandes en matière de risques professionnels',
    },
  },
  9: {
    label: 'Relations avec les personnes publiques',
    subs: {
      90: 'Contributions indirectes et monopoles fiscaux',
      91: "Droits d'enregistrement et assimilés",
      92: 'Droits de douane et assimilés',
      93: 'Autres contestations en matière fiscale et douanière',
      94: 'Elections politiques et référendum',
      95: 'Elections à certains organismes',
      96: 'Responsabilité des personnes publiques',
      97: 'Recours et actions contre les décisions rendues par certains organismes',
      '90A': 'Demande en décharge ou en réduction des droits relatifs au commerce et à la circulation des boissons',
      '90B': 'Demande relative au recouvrement des droits relatifs au commerce et à la circulation des boissons',
      '90C': 'Demande en décharge ou en réduction des droits relatifs aux spectacles',
      '90D': 'Demande relative au recouvrement des droits relatifs aux spectacles',
      '90Z': "Demande relative à d'autres droits indirects",
      '91A':
        "Demande en décharge ou en réduction des droits d'enregistrement portant sur des actes et mutations à titre onéreux",
      '91B': 'Demande relative au recouvrement des droits de mutation à titre onéreux',
      '91C':
        "Demande en décharge ou en réduction des droits d'enregistrement portant sur des mutations à titre gratuit ou des partages",
      '91D':
        "Demande relative au recouvrement des droits d'enregistrement portant sur des mutations à titre gratuit ou des partages",
      '91Z': "Demande relative à d'autres droits d'enregistrement ou assimilés",
      '92A': "Demande en décharge ou en réduction des droits de douane à l'importation",
      '92B': "Demande relative au recouvrement des droits de douane à l'importation",
      '92C': 'Demande en décharge ou en réduction des taxes douanières fiscales, parafiscales et taxes annexes',
      '92D': 'Demande relative au  recouvrement des taxes douanières fiscales, parafiscales et taxes annexes',
      '92Z': 'Autres demandes en matière de droits de douane',
      '93A': "Actions en opposition à poursuites relatives à d'autres droits et contributions",
      '93B': "Demande en revendication d'objets saisis",
      '93C': 'Demande relative à la contrainte par corps pour défaut de paiement des impositions',
      '94A':
        "Contestations des décisions de la commission administrative ayant dressé la liste électorale, concernant l'inscription ou la radiation d'un électeur",
      '94B':
        "Contestations des décisions de la commission administrative concernant l'inscription d'un électeur sur une liste alors que celui-ci était sur plusieurs listes",
      '94C': "Demandes d'inscription sur les listes électorales en dehors des périodes de révision",
      '94D':
        'Demande formée en référé aux fins de faire cesser la diffusion en ligne de fausses informations de nature à altérer la sincérité du scrutin',
      '94Z': "Autres demandes en matière d'élections politiques ou de référendum",
      '95A':
        'Contestations relatives aux inscriptions et radiations sur les listes électorales des membres des tribunaux et chambres de commerce ou des chambres des métiers',
      '95B':
        "Contestations relatives aux inscriptions et radiations sur les listes électorales des membres assesseurs des tribunaux paritaires de baux ruraux ou des membres des chambres d'agriculture",
      '95C': "Contestations en matière d'élections concernant d'autres organismes",
      '96A': 'Demande de réparation des dommages causés par une personne publique à la propriété privée',
      '96B':
        "Demande de réparation du préjudice causé par un agissement d'une personne publique constitutive d'une voie de fait",
      '96C':
        "Demande de réparation d'une atteinte causée par une personne publique à la liberté individuelle ou aux libertés publiques",
      '96D': 'Demande en réparation des dommages causés par le fonctionnement défectueux du service de la justice',
      '96E': "Demande d'indemnisation à raison d'une détention provisoire",
      '96Z': 'Autres actions en responsabilité exercées contre des personnes publiques',
      '97C': "Recours contre les décisions administratives des ordres d'avocats",
      '97D': 'Actions disciplinaires exercées contre les notaires et officiers ministériels',
      '97E': "Recours contre les décisions des bureaux d'aide juridictionnelle",
      '97F': "Recours contre les décisions des organismes chargés de l'établissement des listes d'experts",
      '97H': "Recours contre les décisions de l'autorité de la concurrence",
      '97I': 'Recours contre une décision administrative relative au maintien en rétention des étrangers',
      '97J': "Contestation concernant le montant et le recouvrement des honoraires d'avocats",
      '97K': 'Actions disciplinaires exercées contre les notaires',
      '97L': 'Actions disciplinaires exercées contre les huissiers',
      '97M': 'Actions disciplinaires exercées contre les avocats au Conseil et à la Cour de cassation',
      '97N': 'Actions disciplinaires exercées contre les greffiers des tribunaux de commerce',
      '97O': 'Actions disciplinaires exercées contre les commissaires-priseurs judiciaires',
      '97Z': "Recours et actions exercés contre les décisions d'autres personnes publiques",
    },
  },
};

function getOptions() {
  const options = [];
  for (let key in taxon) {
    options.push(taxon[key].label);
    for (let sub in taxon[key].subs) {
      options.push(taxon[key].subs[sub]);
    }
  }
  return options;
}

function getKeys() {
  const keys = [];
  for (let key in taxon) {
    keys.push(key);
    for (let sub in taxon[key].subs) {
      keys.push(sub);
    }
  }
  return keys;
}

function getTree() {
  const tree = [];
  let index = 0;
  for (let key in taxon) {
    tree[index] = [taxon[key].label];
    for (let sub in taxon[key].subs) {
      tree[index].push(taxon[key].subs[sub]);
    }
    index++;
  }
  return tree;
}

module.exports = {
  options: getOptions(),
  keys: getKeys(),
  tree: getTree(),
  taxonomy: taxon,
};
