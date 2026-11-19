# TERANGA DUBAI | Audit et feuille de route

## Version de départ

- Dépôt TERANGA, commit a5c1593. Le Worker de production ne sert que les
  fichiers statiques. L'accueil a répondu HTTP 200 lors de l'audit.
- Cinq pages HTML, JavaScript natif et CSS partagé. Les formulaires Visa,
  Billets et Plats préparent des messages WhatsApp. Le filtre de l'accueil
  parcourt des exemples locaux, sans calendrier d'inventaire synchronisé.
- Les sources et l'historique ont été sauvegardés dans un bundle Git vérifié.
  Les anciennes pages, médias et données d'exemple restent dans le dépôt.
  Aucun stockage serveur n'était relié au Worker. Les données locales restent
  dans le navigateur qui les a créées ; aucun dossier client n'a été exporté.

## Risques et mesures

| Priorité | Constat | Réponse |
| --- | --- | --- |
| P0 | Code admin livré au client, demandes dans localStorage | API privée, session serveur ; ancien code non publié en préproduction |
| P0 | Passeport, références Wave et fichiers demandés sans canal privé | Formulaire de prise de contact uniquement ; aucun paiement ni document |
| P0 | Prix, notes, inventaire et délai visa non vérifiés | Exemples conservés hors du catalogue public ; offres approuvées uniquement |
| P1 | Saisie interpolée dans du HTML | Échappement / textContent ; validation serveur et SQL paramétré |
| P1 | Aucune trace commerciale centralisée | D1, états de traitement, devis, historique et journal des changements |
| P1 | Numéro et nom dispersés, traduction partielle | Configuration de marque unique et routes FR/EN |

## Priorités et limites de mise en service

1. Restaurer les routes historiques dans le nouveau catalogue bilingue et
   établir les parcours de demande à la conciergerie.
2. Relier le catalogue, les demandes, les devis et leur acceptation à une D1
   de recette isolée. Vérifier les droits et la cohérence des transitions.
3. Valider les offres, les opérateurs, les tarifs, la conservation, le MFA
   nominatif, l'anti-abus et les textes avant toute mise en production.
4. Ajouter le compte client multi-dossiers, la messagerie, email/WhatsApp
   Business avec consentement et le portail partenaire après le socle.
5. Relier un PSP agréé et ses webhooks vérifiés ; seulement ensuite ouvrir
   acomptes, remboursements, reçus, factures et commissions comptabilisées.

## Points à faire valider

- Hébergement (identité de l'exploitant, taxes, annulation, droit de publier
  les photos), véhicules/chauffeurs, restauration (allergènes et livraison),
  transport/fret, billets, visa et perception des paiements : vérifier les
  habilitations, contrats locaux et conditions avec les opérateurs et un
  conseiller qualifié. Aucune licence ni partenariat n'est affirmé.
- Faire valider le logo fourni, les médias et les mentions légales de
  l'entité ; confirmer la devise de facturation. AED seul au départ, sans
  conversions non sourcées.
- Exiger stockage privé, accès traçable, purge et procédures approuvées avant
  tout document d'identité. Le tarif Wave et le délai visa historiques ne
  sont pas repris comme des faits.
- Production : approbation écrite requise. Préparer une D1 distincte, un
  export de sauvegarde et la référence de la version Worker précédente.
  Annuler un déploiement de code ne restaure pas les données D1.
